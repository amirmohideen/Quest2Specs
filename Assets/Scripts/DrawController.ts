/**
 * DrawController
 *
 * 3D drawing with a controller hand. While draw mode is ON and you hold the trigger,
 * the brush tip lays down a world-locked ribbon stroke — press harder for a thicker line.
 *
 * Wire your UIKit "Draw" Switch's On Value Changed callback to:
 *   Script Component -> this component,  Function Name -> setDrawModeFromValue
 *
 * Inputs:
 *   - driver:     the LEFT ControllerHandDriver (trigger = draw pressure).
 *   - brushTip:   transform the ink comes from (e.g. the left hand's index-3 fingertip).
 *   - camera:     Spectacles camera; strokes are ribbons that face you while drawn.
 *   - strokeMaterial: a material to clone per stroke (an Unlit material works best);
 *     its baseColor is set to `color`.
 *   - interactorToSuppress: optional — the LEFT ControllerInteractor, disabled while in
 *     draw mode so trigger-drawing doesn't also pinch-select UI.
 *
 * Auto-delete: when enabled, each stroke disappears `autoDeleteSeconds` after you finish it.
 */

import {ControllerHandDriver} from "./ControllerHandDriver"
import {ControllerInteractor} from "./ControllerInteractor"

const TAG = "[DrawController]"

interface Stroke {
  builder: MeshBuilder
  sceneObject: SceneObject
  lastPos: vec3
  lastWidth: number
  pairCount: number
  pointCount: number
}

interface FinishedStroke {
  sceneObject: SceneObject
  doneAt: number
}

@component
export class DrawController extends BaseScriptComponent {
  @input
  @hint("ControllerHandDriver of the drawing hand (left). Its trigger drives the ink.")
  driver!: ControllerHandDriver

  @input
  @hint("Where the ink comes out (e.g. the left hand's index-3 fingertip).")
  brushTip!: SceneObject

  @input
  @hint("The Spectacles Camera. Stroke ribbons face it while being drawn.")
  camera!: SceneObject

  @input
  @hint("Material cloned for each stroke (use an Unlit material). baseColor is set to Color.")
  strokeMaterial!: Material

  @input
  @widget(new ColorWidget())
  @hint("Stroke color.")
  color: vec4 = new vec4(1, 0.2, 0.2, 1)

  @ui.group_start("Brush")
  @input
  @hint("Line thickness (cm) at a light trigger press.")
  minThicknessCm: number = 0.3
  @input
  @hint("Line thickness (cm) at full trigger press.")
  maxThicknessCm: number = 2.0
  @input
  @hint("Trigger value at which ink starts flowing.")
  triggerThreshold: number = 0.1
  @input
  @hint("Minimum hand travel (cm) between stroke samples.")
  minPointDistanceCm: number = 0.4
  @input
  @hint(
    "Max points per mesh CHUNK before a new one starts (seamlessly, no visible gap). Keep this \
LOW (e.g. 40-80) - rebuilding the stroke mesh gets more expensive the more points it has, so an \
unbounded single mesh will eventually stall a frame and freeze the lens. Long strokes become \
many small cheap chunks instead of one ever-growing expensive one."
  )
  chunkSizePoints: number = 60
  @ui.group_end

  @ui.group_start("Auto delete")
  @input
  @hint("Delete each stroke automatically after it's finished.")
  autoDelete: boolean = true
  @input
  @hint("Seconds after finishing a stroke before it's deleted.")
  autoDeleteSeconds: number = 5
  @ui.group_end

  @input
  @hint("Optional: the LEFT ControllerInteractor — suppressed while draw mode is on.")
  @allowUndefined
  interactorToSuppress: ControllerInteractor | undefined

  @input
  @hint("Start with draw mode on?")
  startEnabled: boolean = false

  private drawOn = false
  private stroke: Stroke | null = null
  private finished: FinishedStroke[] = []
  // Chunks belonging to the line currently being drawn (one continuous trigger-hold). They only
  // move into `finished` (and start their shared auto-delete countdown) once you actually let go
  // of the trigger - a chunk ROLLOVER (hitting chunkSizePoints mid-draw) must NOT start the
  // countdown, or the start of a long line would erase itself while you're still drawing the end.
  private currentStrokeChunks: SceneObject[] = []
  private camTf!: Transform
  private tipTf!: Transform

  onAwake(): void {
    this.camTf = this.camera.getTransform()
    this.tipTf = this.brushTip.getTransform()
    this.setDrawMode(this.startEnabled)

    const upd = this.createEvent("UpdateEvent")
    upd.bind(() => this.onUpdate())
  }

  // ---- Switch wiring ----
  /** For a UIKit Switch "On Value Changed" callback (receives 1/0). */
  setDrawModeFromValue(value: number): void {
    this.setDrawMode(!!value)
  }

  setDrawMode(on: boolean): void {
    this.drawOn = on
    if (!on) this.finalizeStroke()
    this.interactorToSuppress?.setInputEnabled(!on)
    print(`${TAG} draw mode ${on ? "ON" : "OFF"}`)
  }

  toggle(): void {
    this.setDrawMode(!this.drawOn)
  }

  /** Delete every stroke immediately, including the one currently mid-draw (handy on a button). */
  clearAll(): void {
    if (this.stroke && !isNull(this.stroke.sceneObject)) this.stroke.sceneObject.destroy()
    this.stroke = null
    for (const so of this.currentStrokeChunks) if (!isNull(so)) so.destroy()
    this.currentStrokeChunks = []
    for (const f of this.finished) if (!isNull(f.sceneObject)) f.sceneObject.destroy()
    this.finished = []
  }

  // ---- Main loop ----
  private onUpdate(): void {
    this.reapOldStrokes()
    if (!this.drawOn) return

    const trigger = this.driver.getLastTrigger()
    if (trigger >= this.triggerThreshold && this.driver.isReceiving()) {
      const t = (trigger - this.triggerThreshold) / (1 - this.triggerThreshold)
      const width = this.minThicknessCm + (this.maxThicknessCm - this.minThicknessCm) * Math.min(1, t)
      this.addPoint(this.tipTf.getWorldPosition(), width)
    } else {
      this.finalizeStroke()
    }
  }

  private startStroke(pos: vec3, width: number): void {
    const builder = new MeshBuilder([
      {name: "position", components: 3},
      {name: "normal", components: 3, normalized: true},
      {name: "texture0", components: 2}
    ])
    builder.topology = MeshTopology.Triangles
    builder.indexType = MeshIndexType.UInt16

    const so = global.scene.createSceneObject("Stroke")
    const rmv = so.createComponent("Component.RenderMeshVisual")
    const mat = this.strokeMaterial.clone()
    mat.mainPass.baseColor = this.color
    mat.mainPass.twoSided = true
    rmv.mainMaterial = mat
    rmv.mesh = builder.getMesh()

    this.stroke = {builder, sceneObject: so, lastPos: pos, lastWidth: width, pairCount: 0, pointCount: 1}
  }

  private addPoint(pos: vec3, width: number): void {
    if (!this.stroke) {
      this.startStroke(pos, width)
      return
    }
    const s = this.stroke
    if (pos.distance(s.lastPos) < this.minPointDistanceCm) return

    const dir = pos.sub(s.lastPos).normalize()
    // First segment also emits the pair for the stroke's origin point.
    if (s.pairCount === 0) this.appendPair(s, s.lastPos, s.lastWidth, dir)
    this.appendPair(s, pos, width, dir)

    // Stitch a quad between the last two vertex pairs.
    const base = (s.pairCount - 2) * 2
    s.builder.appendIndices([base, base + 1, base + 2, base + 1, base + 3, base + 2])
    s.builder.updateMesh()

    s.lastPos = pos
    s.lastWidth = width
    s.pointCount++
    if (s.pointCount >= this.chunkSizePoints) {
      // Roll into a new chunk-mesh (seamlessly, from this same pos/width) so no single mesh's
      // updateMesh() cost keeps growing the longer you draw. This is what prevents the freeze.
      this.finalizeStroke(true)
      this.startStroke(pos, width)
    }
  }

  /** Two vertices straddling `pos`, ribbon oriented to face the camera. */
  private appendPair(s: Stroke, pos: vec3, width: number, dir: vec3): void {
    const toCam = this.camTf.getWorldPosition().sub(pos).normalize()
    let side = dir.cross(toCam)
    if (side.length < 0.001) side = this.camTf.right // dir points at the camera: pick any stable side
    side = side.normalize().uniformScale(width * 0.5)

    const n = toCam
    const v = s.pairCount % 2
    s.builder.appendVerticesInterleaved([
      pos.x + side.x, pos.y + side.y, pos.z + side.z, n.x, n.y, n.z, 0, v,
      pos.x - side.x, pos.y - side.y, pos.z - side.z, n.x, n.y, n.z, 1, v
    ])
    s.pairCount++
  }

  /**
   * Ends the current chunk mesh. `isChunkRollover` = true means we're only splitting a still-
   * ongoing line into a new cheap chunk (auto-delete countdown must NOT start yet). false means
   * the line itself really ended (trigger released / draw mode off) - now start the shared
   * countdown for every chunk that made up this line.
   */
  private finalizeStroke(isChunkRollover: boolean = false): void {
    const s = this.stroke
    this.stroke = null
    if (s) {
      // A chunk that never got a segment (e.g. a single tap) has no geometry — discard it.
      if (s.pairCount < 2) {
        s.sceneObject.destroy()
      } else {
        this.currentStrokeChunks.push(s.sceneObject)
      }
    }

    if (isChunkRollover || this.currentStrokeChunks.length === 0) return

    const doneAt = getTime()
    for (const sceneObject of this.currentStrokeChunks) {
      this.finished.push({sceneObject, doneAt})
    }
    this.currentStrokeChunks = []
  }

  private reapOldStrokes(): void {
    if (this.finished.length === 0) return
    const now = getTime()
    this.finished = this.finished.filter((f) => {
      if (isNull(f.sceneObject)) return false
      if (this.autoDelete && now > f.doneAt + this.autoDeleteSeconds) {
        f.sceneObject.destroy()
        return false
      }
      return true
    })
  }
}
