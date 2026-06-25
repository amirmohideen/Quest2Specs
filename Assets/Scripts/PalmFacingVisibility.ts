/**
 * PalmFacingVisibility
 *
 * Shows the target object(s) only when the (controller-driven) palm faces your eyes —
 * like the system hand-menu. SIK's TrackedHand.isFacingCamera() does this for the NATIVE
 * tracked hand, but that has no data for our controller rig (and fails in the dark anyway),
 * so we compute it from the rig's own transform.
 *
 * It dots the palm's outward normal against the direction to the camera; if they're aligned
 * within `thresholdDegrees`, the palm is considered facing you and the targets are shown.
 *
 * Setup:
 *   - palmTransform: a transform on the LEFT hand (e.g. the `wrist` joint, or a palm empty).
 *   - palmNormalLocal: the local axis of palmTransform that points OUT of the palm. Flip/try
 *     axes until `logFacingAngle` reads a small angle when you look at your palm.
 *   - camera: the Spectacles Camera (head).
 *   - targets: the debug bubble button (and anything else palm-anchored).
 */

const RAD2DEG = 180 / Math.PI

@component
export class PalmFacingVisibility extends BaseScriptComponent {
  @input
  @hint("Transform on the left hand used as the palm (e.g. the 'wrist' joint).")
  palmTransform!: SceneObject

  @input
  @hint("Local axis of palmTransform that points OUT of the palm (toward you when you look at it). Tune if inverted.")
  palmNormalLocal: vec3 = new vec3(0, 1, 0)

  @input
  @hint("The Spectacles Camera (head).")
  camera!: SceneObject

  @input
  @hint("Objects shown only when the palm faces you (e.g. the debug bubble button).")
  targets: SceneObject[] = []

  @input
  @hint("Max angle (deg) between the palm normal and the direction to your eyes to count as 'facing'.")
  thresholdDegrees: number = 50

  @input
  @hint("Seconds the state must hold before switching, to stop flicker at the boundary.")
  debounceSeconds: number = 0.1

  @input
  @hint("Print the live facing angle so you can pick palmNormalLocal / threshold, then turn off.")
  logFacingAngle: boolean = false

  private palmTf!: Transform
  private camTf!: Transform
  private shown = true
  private pendingState = true
  private pendingSince = -1
  private nextLog = 0

  onAwake(): void {
    this.palmTf = this.palmTransform.getTransform()
    this.camTf = this.camera.getTransform()

    // Let the button initialize (UIKit builds its Interactable on first enable) and let
    // DebugPanelToggle bind before we start hiding it.
    const start = this.createEvent("DelayedCallbackEvent")
    start.bind(() => {
      const upd = this.createEvent("UpdateEvent")
      upd.bind(() => this.onUpdate())
    })
    start.reset(0.5)
  }

  private facingAngleDeg(): number {
    const normal = this.palmTf.getWorldRotation().multiplyVec3(this.palmNormalLocal).normalize()
    const toCam = this.camTf.getWorldPosition().sub(this.palmTf.getWorldPosition()).normalize()
    const dot = Math.max(-1, Math.min(1, normal.dot(toCam)))
    return Math.acos(dot) * RAD2DEG
  }

  private onUpdate(): void {
    const angle = this.facingAngleDeg()
    const facing = angle <= this.thresholdDegrees

    if (this.logFacingAngle && getTime() > this.nextLog) {
      this.nextLog = getTime() + 0.4
      print(`[PalmFacingVisibility] angle=${angle.toFixed(0)}deg  facing=${facing}`)
    }

    if (facing !== this.pendingState) {
      this.pendingState = facing
      this.pendingSince = getTime()
    }
    if (facing !== this.shown && getTime() - this.pendingSince >= this.debounceSeconds) {
      this.shown = facing
      for (const t of this.targets) if (t) t.enabled = facing
    }
  }
}
