/**
 * DebugPanelToggle
 *
 * Pinch a palm button -> show the debug UI panel; pinch again -> hide it.
 *
 * Button-agnostic: it binds to the button's SIK `Interactable` (both SIK buttons and
 * SpectaclesUIKit buttons create one), so it works with a UIKit RoundButton/SphereButton
 * ("bubble"), a SIK PinchButton, etc. The pinch comes from your ControllerInteractor.
 *
 * Setup:
 *   - buttonObject: the palm button's SceneObject (parented to the left hand).
 *   - panel:        the debug panel root (kept camera-tied). Starts hidden.
 *
 * UIKit buttons create their Interactable at runtime, so we retry the bind briefly.
 */

import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"

@component
export class DebugPanelToggle extends BaseScriptComponent {
  @input
  @hint("The palm button's SceneObject. Must have an Interactable (any SIK or UIKit button does).")
  buttonObject!: SceneObject

  @input
  @hint("The debug panel root (camera-tied). Enabled/disabled by pinching the button.")
  panel!: SceneObject

  @input
  @hint("Whether the panel is visible on launch.")
  startVisible: boolean = false

  private visible = false

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.setVisible(this.startVisible)
      this.bindButton(15)
    })
  }

  /** Bind to the button's Interactable, retrying since UIKit creates it at runtime. */
  private bindButton(retries: number): void {
    const interactable = this.buttonObject.getComponent(Interactable.getTypeName()) as Interactable
    if (interactable) {
      interactable.onTriggerStart.add(() => this.toggle())
      print("[DebugPanelToggle] bound to palm button")
      return
    }
    if (retries <= 0) {
      print("[DebugPanelToggle] no Interactable found on buttonObject — is it a SIK/UIKit button?")
      return
    }
    const retry = this.createEvent("DelayedCallbackEvent")
    retry.bind(() => this.bindButton(retries - 1))
    retry.reset(0.2)
  }

  toggle(): void {
    this.setVisible(!this.visible)
  }

  setVisible(v: boolean): void {
    this.visible = v
    this.panel.enabled = v
  }
}
