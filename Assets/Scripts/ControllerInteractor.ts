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

  @input
  @hint("Draw a ray line that STOPS at the cursor/hit. Turn OFF the SIK 'Draw Debug' above so the forever-ray goes away.")
  drawRayLine: boolean = true
  @input
  @widget(new ColorWidget())
  @hint("Color of the ray line.")
  rayColor: vec4 = new vec4(1, 1, 1, 1)
  @input
  @hint("Ray length (cm) when not pointing at an interactable.")
  rayFallbackLengthCm: number = 100

  @ui.group_start("Poke (fingertip touch)")
  @input
  @hint("Fingertip joint used for poking (this hand's index-3). Leave empty to disable poke.")
  @allowUndefined
  fingertip: SceneObject | undefined
  @input
  @hint("Radius (cm) of the fingertip poke sphere.")
  pokeRadiusCm: number = 1.2
  @input
  @hint("Poke only works while the trigger is released (below this value), so the index finger is extended.")
  pokeMaxTrigger: number = 0.3
  @input
  @hint("Seconds after a poke ends before a new poke can start (debounce).")
  pokeCooldownSec: number = 0.15
  @ui.group_end

  private indirectTargetProvider!: IndirectTargetProvider
  private rayProvider!: ControllerRayProvider

  // Poke state
  private touchedByCollider = new Map<ColliderComponent, Interactable>()
  private pokeTarget: Interactable | null = null
  private pokeEndTarget: Interactable | null = null
  private pokeBlockedUntil = 0

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

    this.setupPokeCollider()
  }

  /** Sphere trigger on the fingertip; tracks which Interactable colliders it's touching. */
  private setupPokeCollider(): void {
    if (!this.fingertip) return
    const collider = this.fingertip.createComponent("Physics.ColliderComponent")
    const shape = Shape.createSphereShape()
    shape.radius = this.pokeRadiusCm
    collider.shape = shape
    collider.intangible = true
    collider.fitVisual = false
    // UI colliders are intangible; without this the fingertip sphere would never see them.
    collider.overlapFilter.includeIntangible = true

    collider.onOverlapEnter.add((e) => {
      const other = e.overlap.collider
      const interactable = this.interactionManager.getInteractableByCollider(other) as Interactable | null
      if (interactable) this.touchedByCollider.set(other, interactable)
    })
    collider.onOverlapExit.add((e) => {
      this.touchedByCollider.delete(e.overlap.collider)
    })
  }

  /** Nearest touched Interactable, or null when poke is not allowed right now. */
  private findPokeTarget(triggerVal: number): Interactable | null {
    if (!this.fingertip || triggerVal > this.pokeMaxTrigger) return null

    // Prune destroyed/disabled entries.
    for (const [c, i] of this.touchedByCollider) {
      if (isNull(c) || isNull(i) || isNull(i.sceneObject) || !i.sceneObject.isEnabledInHierarchy) {
        this.touchedByCollider.delete(c)
      }
    }
    if (this.touchedByCollider.size === 0) return null
    // Debounce: block NEW pokes right after one ended (an ongoing poke keeps its target).
    if (this.pokeTarget === null && getTime() < this.pokeBlockedUntil) return null

    const tipPos = this.fingertip.getTransform().getWorldPosition()
    let best: Interactable | null = null
    let bestDist = Infinity
    for (const [c, i] of this.touchedByCollider) {
      const d = c.getSceneObject().getTransform().getWorldPosition().distance(tipPos)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    }
    return best
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
    if (this.pokeTarget) return TargetingMode.Poke
    return this.indirectTargetProvider?.targetingMode ?? TargetingMode.None
  }
  get maxRaycastDistance(): number {
    return this._maxRaycastDistance
  }
  get interactionStrength(): number | null {
    if (this.pokeTarget) return 1
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
    // While poking (and on the release frame), we ARE on the target — this is what makes the
    // InteractionManager dispatch TriggerEnd (a click) instead of TriggerEndOutside (a cancel).
    if (this.currentInteractable === this.pokeTarget || this.currentInteractable === this.pokeEndTarget) {
      return true
    }
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

    const triggerVal = this.driver?.getLastTrigger() ?? 0
    const wasPoking = this.pokeTarget !== null
    this.pokeTarget = this.findPokeTarget(triggerVal)
    const pokeJustEnded = wasPoking && this.pokeTarget === null
    if (pokeJustEnded) this.pokeBlockedUntil = getTime() + this.pokeCooldownSec

    if (this.pokeTarget) {
      // Touching with an extended finger: poke-select the touched Interactable.
      this.currentInteractable = this.pokeTarget
      this.currentTrigger = InteractorTriggerType.Poke
      this.pokeEndTarget = this.pokeTarget
    } else if (pokeJustEnded && this.pokeEndTarget && !isNull(this.pokeEndTarget.sceneObject)) {
      // Keep the poked target for the release frame so it receives TriggerEnd (a click),
      // not TriggerEndOutside (a cancel).
      this.currentInteractable = this.pokeEndTarget
      this.currentTrigger = InteractorTriggerType.None
    } else {
      this.pokeEndTarget = null
      this.currentInteractable = this.indirectTargetProvider.currentInteractableHitInfo?.interactable ?? null
      this.currentTrigger = triggerVal >= this.selectThreshold ? InteractorTriggerType.Select : InteractorTriggerType.None
    }

    this.updateDragVector()
    this.processTriggerEvents()
    if (!this.pokeTarget && !pokeJustEnded) {
      this.handleSelectionLifecycle(this.indirectTargetProvider)
    }

    if (this.drawRayLine && !this.pokeTarget) this.drawRay()
  }

  /** Same look as SIK's drawDebug ray, but ends at the cursor/hit instead of at max distance. */
  private drawRay(): void {
    const start = this.startPoint
    const dir = this.direction
    if (!start || !dir) return
    const hit = this.targetHitInfo?.hit.position
    const end = hit ?? start.add(dir.uniformScale(this.rayFallbackLengthCm))
    global.debugRenderSystem.drawLine(start, end, this.rayColor)
  }

  isTargeting(): boolean {
    return this.isActive()
  }
  isActive(): boolean {
    return this._inputEnabled && this.rayOrigin !== null && this.rayOrigin.isEnabledInHierarchy && this.driver !== null
  }

  private _inputEnabled = true
  /** Externally suppress this interactor (e.g. while its hand is drawing). */
  override setInputEnabled(enabled: boolean): void {
    this._inputEnabled = enabled
  }
  protected clearCurrentHitInfo(): void {
    this.indirectTargetProvider?.clearCurrentInteractableHitInfo()
  }
}
