/**
 * HandModeToggle
 *
 * Swaps between native SIK hand tracking and the Quest-controller-driven hand.
 * Use this when Spectacles hand tracking fails (e.g. in the dark).
 *
 * Wire `toggle()` / `setControllerMode()` to a SIK ToggleButton's onStateChanged,
 * a PinchButton, or any UI event. The simplest path: drop a SIK ToggleButton in the
 * scene and, in its Inspector, point its "On State" callback at this script's
 * `setControllerMode(true)` and "Off State" at `setControllerMode(false)`.
 *
 * What it switches:
 *   - nativeHandObjects: the SIK HandVisual root(s) / hand interactors (disabled in controller mode)
 *   - controllerDriver:  ControllerHandDriver (enabled in controller mode)
 */

import {ControllerHandDriver} from "./ControllerHandDriver"

@component
export class HandModeToggle extends BaseScriptComponent {
  @input
  @hint("SIK hand visual root object(s) to disable when using the controller (e.g. left/right HandVisual roots).")
  nativeHandObjects: SceneObject[] = []

  @input
  @hint("The ControllerHandDriver(s) to enable in controller mode (e.g. right + left).")
  controllerDrivers: ControllerHandDriver[] = []

  @input
  @hint("Start in controller mode? Usually false (native tracking by default).")
  startInControllerMode: boolean = false

  private usingController = false

  onAwake(): void {
    this.setControllerMode(this.startInControllerMode)
  }

  /** True = Quest controller hands, False = native SIK hand tracking. */
  setControllerMode(controller: boolean): void {
    this.usingController = controller
    for (const obj of this.nativeHandObjects) {
      if (obj) obj.enabled = !controller
    }
    for (const driver of this.controllerDrivers) {
      if (!driver) continue
      driver.setActive(controller)
      if (controller) driver.requestCalibration()
    }
    print(`[HandModeToggle] mode = ${controller ? "CONTROLLER" : "NATIVE"}`)
  }

  /** Convenience for a single on/off button. */
  toggle(): void {
    this.setControllerMode(!this.usingController)
  }
}
