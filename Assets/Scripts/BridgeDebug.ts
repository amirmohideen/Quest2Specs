/**
 * BridgeDebug
 *
 * Tiny on-lens readout to confirm the Quest->Spectacles bridge is alive before you
 * finish rigging. Shows, per hand: socket connected? data flowing? live trigger value.
 *
 * Setup:
 *   - Add a Text component somewhere visible (e.g. a Screen Text, or a world Text pinned
 *     to the camera) and assign it to `statusText`.
 *   - Assign the right/left ControllerHandDriver components (either is optional).
 */

import {ControllerHandDriver} from "./ControllerHandDriver"

@component
export class BridgeDebug extends BaseScriptComponent {
  @input
  @hint("Text component to write the status into.")
  statusText!: Text

  @input
  @allowUndefined
  rightDriver!: ControllerHandDriver

  @input
  @allowUndefined
  leftDriver!: ControllerHandDriver

  private nextRefresh = 0

  onAwake(): void {
    const update = this.createEvent("UpdateEvent")
    update.bind(() => {
      // Throttled: setting Text.text rebuilds the glyph mesh, and doing that EVERY frame is
      // real per-frame work on device. 10Hz is plenty readable for a status readout.
      if (getTime() < this.nextRefresh) return
      this.nextRefresh = getTime() + 0.1
      this.refresh()
    })
  }

  private line(d: ControllerHandDriver | undefined, label: string): string {
    if (!d) return `${label}: (no driver)`
    const conn = d.isConnected() ? "OPEN" : "closed"
    const rx = d.isReceiving() ? "RX" : "--"
    const t = d.getLastTrigger()
    const g = d.getLastGrip()
    return `${label} ${conn} ${rx}  T:${this.bar(t)}${t.toFixed(2)}  G:${this.bar(g)}${g.toFixed(2)}`
  }

  private bar(v: number): string {
    const n = Math.round(Math.max(0, Math.min(1, v)) * 10)
    return "[" + "#".repeat(n) + "-".repeat(10 - n) + "]"
  }

  private refresh(): void {
    if (!this.statusText) return
    this.statusText.text =
      "QUEST BRIDGE\n" + this.line(this.rightDriver, "R") + "\n" + this.line(this.leftDriver, "L")
  }
}
