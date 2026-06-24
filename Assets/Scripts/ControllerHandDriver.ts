/**
 * ControllerHandDriver — WORLD-LOCKED 6DoF
 *
 * Drives a custom hand rig in a Spectacles Lens from a Quest 3 controller, relayed
 * over a secure WebSocket:
 *
 *   Quest Browser (WebXR) --wss--> Node relay --wss--> THIS SCRIPT --> hand rig
 *
 * The hand is placed in Spectacles WORLD space (the rig must NOT be parented to the Camera),
 * so it stays put in the room as you turn your head, sitting where the controller physically is.
 *
 * The two devices have independent tracking origins, so we ALIGN them once at calibration.
 * Both worlds are gravity-aligned (Y-up), so the only difference is a yaw (heading) rotation
 * plus a translation. At calibration we:
 *   - read the Spectacles Camera pose (our world reference),
 *   - read the controller pose (Quest world),
 *   - solve a yaw + translation that maps "controller now" to "a spot in front of the camera",
 *   - capture the hand model's current world rotation as its rest pose.
 * Then every frame:  handWorld = align ∘ controllerQuestPose.
 *
 * CALIBRATION GESTURE: point the controller forward along your gaze and press A/X.
 *
 * PINCH = trigger curls index+thumb.  FIST = grip curls the rest (+ index/thumb via max()).
 *
 * Why a custom rig and not SIK's HandVisual? SIK joints are read-only Keypoints bound to the
 * native hand tracker. We use HandVisual only as a rigging reference (joint names: wrist,
 * thumb-0..3, index-0..3, mid-*, ring-*, pinky-*).
 */

const TAG = "[ControllerHandDriver]"

interface ControllerPacket {
  hand?: string
  px: number; py: number; pz: number       // position, metres (Quest local-floor world)
  qx: number; qy: number; qz: number; qw: number   // orientation, Quest world
  trigger: number
  grip?: number
  buttons?: number[]                        // [trigger, grip, _, stick, A/X, B/Y]
}

const DEG2RAD = Math.PI / 180

// Shared across both hand drivers (same script module): live height tuned with B/Y in-headset.
let sharedNudgeCm = 0

@component
export class ControllerHandDriver extends BaseScriptComponent {
  @input
  @hint("Which controller this driver listens to. Add one driver per hand.")
  @widget(new ComboBoxWidget([new ComboBoxItem("Right", "right"), new ComboBoxItem("Left", "left")]))
  handedness: string = "right"

  @input
  @hint("Internet Module asset used to open the secure WebSocket.")
  internetModule!: InternetModule

  @input
  @hint("wss URL of the relay's consumer endpoint, e.g. wss://your-host/specs")
  url: string = "wss://YOUR-RELAY-HOST/specs"

  @input
  @hint("Root of YOUR cloned hand rig. Must be in WORLD space (NOT a child of the Camera).")
  handRoot!: SceneObject

  @input
  @hint("The Spectacles Camera SceneObject (the head). Used as the world reference for alignment.")
  camera!: SceneObject

  @ui.group_start("Pinch — Index (trigger)")
  @input
  @hint("Index joints to curl, base-first, e.g. [index-0, index-1].")
  @allowUndefined
  indexJoints: SceneObject[] = []
  @input
  indexCurlAxis: vec3 = new vec3(1, 0, 0)
  @input
  indexMaxDegrees: number = 70
  @ui.group_end

  @ui.group_start("Pinch — Thumb (trigger)")
  @input
  @hint("Thumb joints to curl, base-first, e.g. [thumb-0, thumb-1].")
  @allowUndefined
  thumbJoints: SceneObject[] = []
  @input
  thumbCurlAxis: vec3 = new vec3(1, 0, 0)
  @input
  thumbMaxDegrees: number = 45
  @ui.group_end

  @ui.group_start("Fist — Middle/Ring/Pinky (grip)")
  @input
  @hint("Other finger joints to curl when gripping, e.g. [mid-0, mid-1, ring-0, ring-1, pinky-0, pinky-1].")
  @allowUndefined
  fistJoints: SceneObject[] = []
  @input
  fistCurlAxis: vec3 = new vec3(1, 0, 0)
  @input
  fistMaxDegrees: number = 80
  @ui.group_end

  @ui.group_start("World-lock tuning")
  @input
  @hint("Where the hand sits at calibration, relative to your head in cm: x=right, y=up, z=forward. Lower y to drop it to where you hold the controllers (negative y = down).")
  anchorOffsetCm: vec3 = new vec3(0, -25, 35)
  @input
  @hint("Manual heading trim (degrees) if left/right feels rotated after calibration.")
  yawTrimDegrees: number = 0
  @input
  @hint("Movement scale. 1 = physical 1:1. Raise to amplify reach.")
  posScale: number = 1.0
  @input
  @hint("Button index that calibrates / re-anchors (Quest: 4 = A/X). Point controller forward, hold still, press.")
  calibrateButton: number = 4
  @input
  @hint("Button index that nudges hand height live (Quest: 5 = B on right / Y on left). Right raises, left lowers. Affects both hands.")
  nudgeButton: number = 5
  @input
  @hint("Centimetres moved per nudge press.")
  nudgeStepCm: number = 3
  @input
  @hint("World direction a +nudge moves the hands (default up). Right controller's B = +, left's Y = -.")
  nudgeAxisWorld: vec3 = new vec3(0, 1, 0)
  @ui.group_end

  private socket: WebSocket | undefined
  private handTransform!: Transform
  private cameraTransform!: Transform

  // Pinch/fist rest poses
  private indexRest: quat[] = []
  private thumbRest: quat[] = []
  private fistRest: quat[] = []

  // Alignment (Quest world -> Spectacles world): handWorldPos = alignYaw*(questPos*100*scale) + alignPos
  //                                               handWorldRot = alignYaw * questRot * modelOffset
  private calibrated = false
  private alignYaw: quat = quat.quatIdentity()
  private alignPos: vec3 = vec3.zero()
  private modelOffset: quat = quat.quatIdentity()
  private prevCalibButton = false
  private prevNudgeButton = false

  private active = true

  // Debug HUD state
  private _connected = false
  private _lastTrigger = 0
  private _lastGrip = 0
  private _lastRxTime = -1

  onAwake(): void {
    this.handTransform = this.handRoot.getTransform()
    this.cameraTransform = this.camera.getTransform()

    this.indexRest = this.captureRest(this.indexJoints)
    this.thumbRest = this.captureRest(this.thumbJoints)
    this.fistRest = this.captureRest(this.fistJoints)

    print(
      `${TAG} ${this.handedness} joints  index:${this.indexJoints.length}  ` +
        `thumb:${this.thumbJoints.length}  fist:${this.fistJoints.length}`
    )

    this.forceAlwaysDrawn(this.handRoot)
    this.connect()
  }

  private captureRest(joints: SceneObject[]): quat[] {
    return joints.map((j) => (j ? j.getTransform().getLocalRotation() : quat.quatIdentity()))
  }

  /**
   * Force every mesh under the rig to never frustum-cull. SIK's hand material uses a dynamic
   * UserDefinedAABB that HandVisual updated each frame; without HandVisual that box is stale, so
   * the mesh blinks out as it nears the view edges. A huge AABB makes the cull test always pass.
   */
  private forceAlwaysDrawn(obj: SceneObject): void {
    const big = 10000
    const visuals = obj.getComponents("RenderMeshVisual") as RenderMeshVisual[]
    for (const v of visuals) {
      for (const mat of v.materials) {
        for (let i = 0; i < mat.getPassCount(); i++) {
          const pass = mat.getPass(i)
          pass.frustumCullMode = FrustumCullMode.UserDefinedAABB
          pass.frustumCullMin = new vec3(-big, -big, -big)
          pass.frustumCullMax = new vec3(big, big, big)
        }
      }
    }
    const n = obj.getChildrenCount()
    for (let i = 0; i < n; i++) this.forceAlwaysDrawn(obj.getChild(i))
  }

  setActive(on: boolean): void {
    this.active = on
    this.handRoot.enabled = on
  }

  requestCalibration(): void {
    this.calibrated = false
  }

  // ---- Debug HUD accessors ----
  isConnected(): boolean {
    return this._connected
  }
  isReceiving(): boolean {
    return this._lastRxTime >= 0 && getTime() - this._lastRxTime < 0.5
  }
  getLastTrigger(): number {
    return this._lastTrigger
  }
  getLastGrip(): number {
    return this._lastGrip
  }
  getHandedness(): string {
    return this.handedness
  }

  private connect(): void {
    this.socket = this.internetModule.createWebSocket(this.url)
    this.socket.onopen = () => {
      this._connected = true
      print(`${TAG} ${this.handedness} connected to ${this.url}`)
    }
    this.socket.onerror = () => print(`${TAG} ${this.handedness} socket error`)
    this.socket.onclose = () => {
      this._connected = false
      print(`${TAG} ${this.handedness} socket closed, retrying in 2s`)
      const retry = this.createEvent("DelayedCallbackEvent")
      retry.bind(() => this.connect())
      retry.reset(2.0)
    }
    this.socket.onmessage = async (e: any) => {
      if (!this.active) return
      const raw: string = typeof e.data === "string" ? e.data : await e.data.text()
      let pkt: ControllerPacket
      try {
        pkt = JSON.parse(raw)
      } catch {
        return
      }
      if (pkt.hand && pkt.hand !== this.handedness) return
      this._lastRxTime = getTime()
      this.applyPacket(pkt)
    }
  }

  /** Horizontal heading (radians) of a world-space direction vector. */
  private headingOf(v: vec3): number {
    return Math.atan2(v.x, v.z)
  }

  private applyPacket(p: ControllerPacket): void {
    const questPos = new vec3(p.px, p.py, p.pz)
    const questRot = new quat(p.qw, p.qx, p.qy, p.qz)

    // Rising-edge calibrate button (A/X) -> re-anchor.
    const calibPressed = !!(p.buttons && p.buttons[this.calibrateButton] > 0.5)
    if (calibPressed && !this.prevCalibButton) this.calibrated = false
    this.prevCalibButton = calibPressed

    // Rising-edge nudge button (B on right raises, Y on left lowers) -> shared live height.
    const nudgePressed = !!(p.buttons && p.buttons[this.nudgeButton] > 0.5)
    if (nudgePressed && !this.prevNudgeButton) {
      sharedNudgeCm += this.handedness === "right" ? this.nudgeStepCm : -this.nudgeStepCm
      print(`${TAG} height nudge -> ${sharedNudgeCm.toFixed(0)}cm`)
    }
    this.prevNudgeButton = nudgePressed

    if (!this.calibrated) {
      this.calibrate(questPos, questRot)
      this.calibrated = true
    }

    // FOLLOW (world-locked) + live shared height nudge
    const scaled = questPos.uniformScale(100 * this.posScale)
    const nudge = this.nudgeAxisWorld.uniformScale(sharedNudgeCm)
    this.handTransform.setWorldPosition(this.alignYaw.multiplyVec3(scaled).add(this.alignPos).add(nudge))
    this.handTransform.setWorldRotation(this.alignYaw.multiply(questRot).multiply(this.modelOffset))

    // PINCH (trigger) + FIST (grip)
    this._lastTrigger = Math.max(0, Math.min(1, p.trigger))
    this._lastGrip = Math.max(0, Math.min(1, p.grip ?? 0))
    const indexThumb = Math.max(this._lastTrigger, this._lastGrip)
    this.applyCurl(this.indexJoints, this.indexRest, this.indexCurlAxis, this.indexMaxDegrees, indexThumb)
    this.applyCurl(this.thumbJoints, this.thumbRest, this.thumbCurlAxis, this.thumbMaxDegrees, indexThumb)
    this.applyCurl(this.fistJoints, this.fistRest, this.fistCurlAxis, this.fistMaxDegrees, this._lastGrip)
  }

  /** Solve the Quest-world -> Spectacles-world alignment from the current camera + controller pose. */
  private calibrate(questPos: vec3, questRot: quat): void {
    const camPos = this.cameraTransform.getWorldPosition()
    const camRot = this.cameraTransform.getWorldRotation()
    const camRight = camRot.multiplyVec3(new vec3(1, 0, 0))
    const camUp = camRot.multiplyVec3(new vec3(0, 1, 0))
    const camFwd = camRot.multiplyVec3(new vec3(0, 0, -1)) // camera looks down local -Z

    // Yaw: align the controller's heading to the camera's heading (assumes you point it forward).
    const ctrlFwd = questRot.multiplyVec3(new vec3(0, 0, -1))
    const phi = this.headingOf(camFwd) - this.headingOf(ctrlFwd) + this.yawTrimDegrees * DEG2RAD
    this.alignYaw = quat.angleAxis(phi, vec3.up())

    // Translation: map the controller's current position to your chosen spot relative to the head.
    const o = this.anchorOffsetCm
    const anchor = camPos
      .add(camRight.uniformScale(o.x))
      .add(camUp.uniformScale(o.y))
      .add(camFwd.uniformScale(o.z))
    const scaledRef = questPos.uniformScale(100 * this.posScale)
    this.alignPos = anchor.sub(this.alignYaw.multiplyVec3(scaledRef))

    // Orientation offset so the hand starts at its authored (current) world rest pose.
    const restRot = this.handTransform.getWorldRotation()
    this.modelOffset = this.alignYaw.multiply(questRot).invert().multiply(restRot)

    print(`${TAG} ${this.handedness} calibrated  yaw=${(phi / DEG2RAD).toFixed(1)}deg`)
  }

  private applyCurl(joints: SceneObject[], rest: quat[], axis: vec3, maxDeg: number, t: number): void {
    if (joints.length === 0) return
    const curl = quat.angleAxis(t * maxDeg * DEG2RAD, axis)
    for (let i = 0; i < joints.length; i++) {
      if (joints[i] && rest[i]) joints[i].getTransform().setLocalRotation(rest[i].multiply(curl))
    }
  }
}
