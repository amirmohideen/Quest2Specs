# Quest 3 → Spectacles controller bridge

Use Quest 3 controllers as 6DoF hand input for a Spectacles Lens, for when native hand
tracking fails (e.g. in the dark). Movement drives the hand; the analog trigger drives a
pinch. Supports both hands.

```
Quest Browser (WebXR)  --wss-->  Node relay+host  --wss-->  Spectacles Lens
  webxr/index.html                relay/server.js           Assets/Scripts/*.ts
  reads both grips + triggers     serves page + fans out    one driver per hand + HUD
```

The relay also serves the WebXR page, so the whole thing lives behind **one URL**.
Your MacBook only runs Lens Studio + (optionally) the relay. No Quest/Android SDKs.

---

## 1. Start the relay

```bash
cd QuestBridge/relay
npm install
npm start            # -> Bridge on http://localhost:8080
```

## 2. Expose it over `wss://` (required by both Spectacles and WebXR)

A plain LAN `ws://` won't work — Spectacles' `createWebSocket` and WebXR both need TLS.

**Option A — ngrok (fastest for dev, lowest latency):**
```bash
ngrok http 8080
```
Copy the forwarding URL it prints, e.g. `https://ab12cd34.ngrok-free.app`.
> Free-tier ngrok URLs change every restart — you'll re-paste them when that happens.

**Option B — hosted (no install, stable URL):** deploy the `relay/` folder to
Glitch / Render / Railway / Fly. They give you a permanent `https://…` URL.

From your public host URL `https://HOST`, your three endpoints are:

| Who | URL |
|---|---|
| WebXR page (open on Quest) | `https://HOST/` |
| Quest producer (auto-filled in the page) | `wss://HOST/quest` |
| **`ControllerHandDriver.url`** (both drivers) | **`wss://HOST/specs`** |

Example with ngrok host `ab12cd34.ngrok-free.app`:
- Open on Quest: `https://ab12cd34.ngrok-free.app/`
- Driver `url`: `wss://ab12cd34.ngrok-free.app/specs`

## 3. Stream from the Quest

On the Quest: open `https://HOST/` in **Quest Browser**. The Relay URL field is pre-filled
to this origin's `/quest`. Press **Enter VR & stream both controllers**. Keep the headset on —
6DoF position needs the headset to be tracking the controllers.

## 4. Wire up the Lens (Lens Studio on your Mac)

1. Lens Studio auto-imports `Assets/Scripts/*.ts`.
2. Add an **Internet Module** asset (Asset Browser → + → Internet Module).
3. Build a controller hand rig **per hand**:
   - Duplicate SIK's rigged hand model (the `root → handModel → mesh` hierarchy that
     `HandVisual` references), or any rigged hand/glove model.
   - Make each rig's **root a child of the Camera**, positioned where the hand should rest
     (right ≈ `(8,-10,-30)` cm, left ≈ `(-8,-10,-30)` cm). The driver moves this local transform.
4. Add a **ControllerHandDriver** for each hand:
   - `handedness` → `Right` / `Left`
   - `internetModule` → the Internet Module asset
   - `url` → `wss://HOST/specs` (same for both)
   - `handRoot` → that hand's rig root (the child of Camera)
   - `indexJoint` / `thumbJoint` → that rig's proximal `index-0` / `thumb-0` joints
5. Add a **BridgeDebugHud**:
   - `statusText` → a Text component (Screen Text is easiest)
   - `rightDriver` / `leftDriver` → the two drivers
   - It shows, per hand: `socket:OPEN data:RX trig:[####------] 0.42` — use it to confirm
     data is flowing before you fuss with the rig.
6. Add a **HandModeToggle** + a SIK **ToggleButton** in front of you:
   - `nativeHandObjects` → the SIK left/right HandVisual root object(s)
   - `controllerDriver` → (your right driver; add a second toggle entry for left if you like)
   - Point the ToggleButton's On/Off callbacks at `setControllerMode(true/false)`.

## 5. Calibrate (6DoF)

Quest's tracking origin is unrelated to the Spectacles origin, so the mapping is relative.
With controller mode on: hold a controller where you want that hand to sit, press the
**A/X button** (or re-toggle controller mode), and it zeroes. From there the hand follows the
controller's movement and rotation, anchored to that spot. Calibrate each hand.

## Tuning / gotchas
- **Mirrored / wrong-axis motion?** Both spaces are right-handed Y-up/-Z-forward so it usually
  maps directly; if not, adjust `posScale` or swap `curlAxis` signs.
- **Pinch curls the wrong way?** Adjust `curlAxis` / `maxCurlDegrees` per driver.
- **Drift in the dark.** Orientation (IMU) stays solid; *position* can degrade in very low light
  because the Quest also uses cameras to track controllers. Lower `posScale` or recalibrate often.
- **Latency.** Hosted relay adds ~30–80 ms; ngrok/LAN is snappier. Streams at headset frame rate.
- **HUD shows `socket:closed`** → relay not running / wrong `wss` URL / not exposed over TLS.
  **`socket:OPEN data:--`** → Lens connected but Quest isn't streaming (not in VR, or wrong /quest URL).
