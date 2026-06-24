/**
 * ControllerHandDriver
 *
 * Drives a custom hand rig in a Spectacles Lens from a Quest 3 controller, relayed
 * over a secure WebSocket. This is the "sink" side of the bridge:
 *
 *   Quest Browser (WebXR) --wss--> Node relay --wss--> THIS SCRIPT --> hand rig
 *
 * Add ONE of these per hand. Set `handedness` to "left" or "right"; the driver ignores
 * packets for the other hand. Both drivers can share the same relay/url (the relay
 * fans every packet out to every consumer, and each driver filters by handedness).
 *
 * Why a custom rig and not SIK's HandVisual?
 *   SIK's TrackedHand joints are read-only Keypoints bound to the device's native
 *   ObjectTracking3D hand tracker (see Keypoint.ts). You cannot inject external poses
 *   into them. So we drive our OWN cloned hand rig instead, using HandVisual only as a
 *   rigging reference (joint naming: wrist, thumb-0..3, index-0..3, mid-*, ring-*, pinky-*).
 *
 * - FOLLOW:  we set `handRoot`'s LOCAL transform every packet. Make handRoot a child of
 *   the Camera so the hand sits/moves relative to your head.
 * - PINCH:   trigger (0..1) curls the index joints and thumb joints toward each other.
 *   Index and thumb have SEPARATE axes/signs so you can tune them to actually meet.
 *
 * Coordinate frames:
 *   WebXR `local-floor` and Lens Studio are both right-handed, Y-up, -Z-forward, so
 *   position/rotation map directly (metres -> centimetres). Quest's origin is unrelated
 *   to the Spectacles origin, so we CALIBRATE on the first packet (and on the A/X button):
 *   wherever you hold the controller becomes the rest spot, and motion is applied as a delta.
 */

const TAG = "[ControllerHandDriver]"

interface ControllerPacket {
  hand?: string                            // "left" | "right"
  px: number; py: number; pz: number       // position, metres (WebXR local-floor)
  qx: number; qy: number; qz: number; qw: number   // orientation quaternion
  trigger: number                          // 0..1 analog index trigger
  grip?: number                            // 0..1 analog squeeze
  buttons?: number[]                       // [trigger, grip, _, stick, A/X, B/Y]
}

const DEG2RAD = Math.PI / 180

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
  @hint("Root of YOUR cloned hand rig. MUST be a child of the Camera. We drive its local transform.")
  handRoot!: SceneObject

  @ui.group_start("Pinch — Index")
  @input
  @hint("Index joints to curl, base-first, e.g. [index-0, index-1]. Start with just index-0.")
  @allowUndefined
  indexJoints: SceneObject[] = []
  @input
  @hint("Local axis the index curls around. Flip a sign if it bends the wrong way.")
  indexCurlAxis: vec3 = new vec3(1, 0, 0)
  @input
  @hint("Index curl angle in degrees at trigger = 1.")
  indexMaxDegrees: number = 70
  @ui.group_end

  @ui.group_start("Pinch — Thumb")
  @input
  @hint("Thumb joints to curl, base-first, e.g. [thumb-0, thumb-1]. Start with just thumb-0.")
  @allowUndefined
  thumbJoints: SceneObject[] = []
  @input
  @hint("Local axis the thumb curls around. Tune so the thumb meets the index.")
  thumbCurlAxis: vec3 = new vec3(1, 0, 0)
  @input
  @hint("Thumb curl angle in degrees at trigger = 1.")
  thumbMaxDegrees: number = 45
  @ui.group_end

  @ui.group_start("Tuning")
  @input
  @hint("Scales controller travel. 1 = 1:1. Lower it to keep the hand in a smaller volume.")
  posScale: number = 1.0

  @input
  @hint("Button index that re-zeroes the rest spot (Quest: 4 = A/X). Hold still and press.")
  calibrateButton: number = 4
  @ui.group_end

  private socket: WebSocket | undefined
  private handTransform!: Transform

  // Pinch rest poses, captured at awake (parallel to the joint arrays)
  private indexRest: quat[] = []
  private thumbRest: quat[] = []

  // Calibration reference
  private calibrated = false
  private refPos: vec3 = vec3.zero()
  private refRotInv: quat = quat.quatIdentity()
  private anchorPos: vec3 = vec3.zero()
  private anchorRot: quat = quat.quatIdentity()
  private prevCalibButton = false

  private active = true

  // Live state for the debug HUD
  private _connected = false
  private _lastTrigger = 0
  private _lastRxTime = -1

  onAwake(): void {
    this.handTransform = this.handRoot.getTransform()
    this.anchorPos = this.handTransform.getLocalPosition()
    this.anchorRot = this.handTransform.getLocalRotation()

    this.indexRest = this.indexJoints.map((j) => (j ? j.getTransform().getLocalRotation() : quat.quatIdentity()))
    this.thumbRest = this.thumbJoints.map((j) => (j ? j.getTransform().getLocalRotation() : quat.quatIdentity()))

    this.connect()
  }

  /** Enable/disable the controller-driven hand (used by the toggle). */
  setActive(on: boolean): void {
    this.active = on
    this.handRoot.enabled = on
  }

  /** Re-zero the mapping next packet. Call from a UI button too if you like. */
  requestCalibration(): void {
    this.calibrated = false
  }

  // ---- Debug HUD accessors ----
  isConnected(): boolean {
    return this._connected
  }
  /** True if a matching packet arrived in the last ~0.5s. */
  isReceiving(): boolean {
    return this._lastRxTime >= 0 && getTime() - this._lastRxTime < 0.5
  }
  getLastTrigger(): number {
    return this._lastTrigger
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
      if (pkt.hand && pkt.hand !== this.handedness) return // not our hand
      this._lastRxTime = getTime()
      this.applyPacket(pkt)
    }
  }

  private applyPacket(p: ControllerPacket): void {
    const questPos = new vec3(p.px, p.py, p.pz)
    const questRot = new quat(p.qw, p.qx, p.qy, p.qz)

    // Rising-edge calibrate button
    const calibPressed = !!(p.buttons && p.buttons[this.calibrateButton] > 0.5)
    if (calibPressed && !this.prevCalibButton) this.calibrated = false
    this.prevCalibButton = calibPressed

    if (!this.calibrated) {
      this.refPos = questPos
      this.refRotInv = questRot.invert()
      // Re-read anchor in case it was repositioned in the editor
      this.anchorPos = this.handTransform.getLocalPosition()
      this.anchorRot = this.handTransform.getLocalRotation()
      this.calibrated = true
    }

    // FOLLOW — position: delta since calibration, metres -> cm, applied at the anchor.
    const deltaM = questPos.sub(this.refPos)
    const deltaCm = deltaM.uniformScale(100 * this.posScale)
    this.handTransform.setLocalPosition(this.anchorPos.add(deltaCm))

    // FOLLOW — rotation: world delta since calibration, applied to the anchor rotation.
    const deltaRot = questRot.multiply(this.refRotInv)
    this.handTransform.setLocalRotation(deltaRot.multiply(this.anchorRot))

    // PINCH — curl index + thumb by the trigger amount.
    this._lastTrigger = Math.max(0, Math.min(1, p.trigger))
    this.applyCurl(this.indexJoints, this.indexRest, this.indexCurlAxis, this.indexMaxDegrees, this._lastTrigger)
    this.applyCurl(this.thumbJoints, this.thumbRest, this.thumbCurlAxis, this.thumbMaxDegrees, this._lastTrigger)
  }

  private applyCurl(joints: SceneObject[], rest: quat[], axis: vec3, maxDeg: number, t: number): void {
    if (joints.length === 0) return
    const curl = quat.angleAxis(t * maxDeg * DEG2RAD, axis)
    for (let i = 0; i < joints.length; i++) {
      if (joints[i] && rest[i]) joints[i].getTransform().setLocalRotation(rest[i].multiply(curl))
    }
  }
}
