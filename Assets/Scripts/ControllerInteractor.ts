/**
 * ControllerInteractor
 *
 * A SIK Interactor driven by the Quest-controller hand, so pinching selects any SIK
 * Interactable (buttons, sliders, manipulables) — at a distance via a ray, and up close by
 * pointing. Modeled on SIK's MobileInteractor (also a 6DoF-pose + trigger interactor).
 *
 * Because we register as `InteractorInputType.CustomController` (which is part of
 * InteractorInputType.All), SIK's CursorController automatically spawns a cursor that follows
 * this interactor's ray — no extra wiring for the cursor.
 *
 * Add one per hand. Set:
 *   - rayOrigin: a transform on the hand that points where you aim (e.g. an empty at the
 *     index base, its forward pointing down the finger).
 *   - driver:    the ControllerHandDriver for the same hand (we read its trigger as the pinch).
 *
 * The InteractionManager calls updateState() every frame once we're registered (done in
 * BaseInteractor's constructor), so there's no update loop here.
 */

import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import BaseInteractor from "SpectaclesInteractionKit.lspkg/Core/Interactor/BaseInteractor"
import IndirectTargetProvider from "SpectaclesInteractionKit.lspkg/Core/Interactor/IndirectTargetProvider"
import {InteractorInputType, InteractorTriggerType, TargetingMode} from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor"
import {RaycastInfo, RayProvider} from "SpectaclesInteractionKit.lspkg/Core/Interactor/RayProvider"
import {InteractableHitInfo} from "SpectaclesInteractionKit.lspkg/Providers/TargetProvider/TargetProvider"
import {ControllerHandDriver} from "./ControllerHandDriver"

/** Ray from a transform on the hand: locus = its world position, direction = its local aim axis in world. */
class ControllerRayProvider implements RayProvider {
  constructor(
    private aim: SceneObject,
    private localDir: vec3,
    private avail: () => boolean
  ) {}

  getRaycastInfo(): RaycastInfo {
    const t = this.aim.getTransform()
    return {direction: t.getWorldRotation().multiplyVec3(this.localDir), locus: t.getWorldPosition()}
  }
  isAvailable(): boolean {
    return this.avail()
  }
  reset(): void {}
}

@component
export class ControllerInteractor extends BaseInteractor {
  @input
  @hint("Transform on the hand that points where you aim (e.g. an empty at the index base).")
  rayOrigin!: SceneObject

  @input
  @hint("The ControllerHandDriver for this same hand. Its trigger value drives the pinch/select.")
  driver!: ControllerHandDriver

  @input
  @hint("Local aim axis of rayOrigin. If the ray points backwards, flip this to (0,0,-1).")
  aimForwardLocal: vec3 = new vec3(0, 0, 1)

  @input
  @hint("Trigger value (0..1) at which a pinch counts as a select.")
  selectThreshold: number = 0.5

  private indirectTargetProvider!: IndirectTargetProvider
  private rayProvider!: ControllerRayProvider

  onAwake(): void {
    this.inputType = InteractorInputType.CustomController

    this.rayProvider = new ControllerRayProvider(this.rayOrigin, this.aimForwardLocal, () => this.isActive())

    this.indirectTargetProvider = new IndirectTargetProvider(this as BaseInteractor, {
      maxRayDistance: this.maxRaycastDistance,
      rayProvider: this.rayProvider,
      targetingVolumeMultiplier: this.indirectTargetingVolumeMultiplier,
      shouldPreventTargetUpdate: () => (this.currentTrigger & InteractorTriggerType.Select) !== 0,
      spherecastRadii: this.spherecastRadii,
      spherecastDistanceThresholds: this.spherecastDistanceThresholds
    })
  }

  // ---- targeting geometry (delegated to the indirect provider) ----
  get startPoint(): vec3 | null {
    return this.indirectTargetProvider?.startPoint ?? null
  }
  get endPoint(): vec3 | null {
    return this.indirectTargetProvider?.endPoint ?? null
  }
  get direction(): vec3 | null {
    return this.indirectTargetProvider?.direction ?? null
  }
  get orientation(): quat | null {
    return this.rayOrigin?.getTransform().getWorldRotation() ?? null
  }
  get distanceToTarget(): number | null {
    return this.indirectTargetProvider?.currentInteractableHitInfo?.hit.distance ?? null
  }
  get targetHitPosition(): vec3 | null {
    return this.indirectTargetProvider?.currentInteractableHitInfo?.hit.position ?? null
  }
  get targetHitInfo(): InteractableHitInfo | null {
    return this.indirectTargetProvider?.currentInteractableHitInfo ?? null
  }
  get activeTargetingMode(): TargetingMode {
    return this.indirectTargetProvider?.targetingMode ?? TargetingMode.None
  }
  get maxRaycastDistance(): number {
    return this._maxRaycastDistance
  }
  get interactionStrength(): number | null {
    return this.driver ? this.driver.getLastTrigger() : 0
  }

  set drawDebug(debug: boolean) {
    this._drawDebug = debug
    if (this.indirectTargetProvider) this.indirectTargetProvider.drawDebug = debug
  }
  get drawDebug(): boolean {
    return this._drawDebug
  }

  // ---- hover queries ----
  get isHoveringCurrentInteractable(): boolean | null {
    if (!this.currentInteractable) return null
    return this.indirectTargetProvider.isHoveringInteractable(this.currentInteractable)
  }
  get hoveredInteractables(): Interactable[] {
    return Array.from(this.indirectTargetProvider.currentInteractableSet)
  }
  isHoveringInteractable(interactable: Interactable): boolean {
    return this.indirectTargetProvider.isHoveringInteractable(interactable)
  }
  isHoveringInteractableHierarchy(interactable: Interactable): boolean {
    if (this.indirectTargetProvider.isHoveringInteractable(interactable)) return true
    for (const hovered of this.indirectTargetProvider.currentInteractableSet) {
      if (hovered.isDescendantOf(interactable)) return true
    }
    return false
  }

  // ---- per-frame state (driven by the InteractionManager) ----
  override updateState(): void {
    super.updateState()
    if (!this.isActive()) return

    this.indirectTargetProvider.update()
    this.currentInteractable = this.indirectTargetProvider.currentInteractableHitInfo?.interactable ?? null

    const selecting = (this.driver?.getLastTrigger() ?? 0) >= this.selectThreshold
    this.currentTrigger = selecting ? InteractorTriggerType.Select : InteractorTriggerType.None

    this.updateDragVector()
    this.processTriggerEvents()
    this.handleSelectionLifecycle(this.indirectTargetProvider)
  }

  isTargeting(): boolean {
    return this.isActive()
  }
  isActive(): boolean {
    return this.rayOrigin !== null && this.rayOrigin.isEnabledInHierarchy && this.driver !== null
  }
  protected clearCurrentHitInfo(): void {
    this.indirectTargetProvider?.clearCurrentInteractableHitInfo()
  }
}
