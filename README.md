# Quest2Specs

Use your Meta Quest controllers as hand input for Snap Spectacles

**[Watch the trailer](#)** <!-- TODO: replace with the video link -->

---

## Why this exists

Spectacles tracks your hands with cameras — which means it needs light, the same way a
camera needs light to take a photo. In a dim room or in the dark, that tracking breaks down.

Quest controllers don't have that problem. They're tracked with infrared (invisible light,
like a TV remote) plus their own motion sensors, so a Quest headset can track them even with
the lights off. Quest2Specs borrows that: it reads your Quest controller's position, rotation,
and button presses, and streams that data to a virtual hand in your Spectacles Lens — so you
get full hand tracking, pinch, and grab, regardless of lighting.

## Features

- **6DoF hand tracking** — the virtual hand follows your real controller's position and rotation
- **Works in the dark** — no dependency on Spectacles' camera-based hand tracking
- **Pinch, poke, and grab** — trigger pinches (index + thumb), grip closes a full fist, and you
  can poke UI buttons directly with a virtual fingertip
- **Point-and-select UI** — a ray + cursor lets you select SIK/UIKit interactables at a distance
- **3D drawing** — draw in-air, world-locked strokes with the trigger, with adjustable
  thickness, color, and auto-delete
- **Two hands, independently calibrated and adjustable**

## Requirements

- A Meta Quest 3 or Quest 3S
- Snap Spectacles (2024), with the Lens built and pushed via Lens Studio
- Both devices on the internet (a local WiFi network works fine for both)
- **Only for self-hosting (Method 2):** [Node.js](https://nodejs.org) and
  [`cloudflared`](https://github.com/cloudflare/cloudflared) (`brew install cloudflared`) on a
  Mac/PC

---

## How to set it up

There are two ways to run the bridge server that relays data between your Quest and your
Spectacles. **Method 1 is the easy path** — a permanent, always-on server, nothing to run
yourself. **Method 2** runs the same server on your own computer, useful for development or if
you'd rather not depend on a hosted server.

### Method 1: Hosted (Render URL)

1. On the Quest, open the **Quest Browser** and go to **quest2specs.onrender.com**.
2. Tap **"Enter VR & stream both controllers."**
3. Take the headset off and place it **in front of you, facing you**, so its cameras can see
   your controllers (about a meter away, tilted slightly down toward your hands).
4. Put on your Spectacles.
5. Launch the **Quest2Specs** Lens.
6. Pick up your Quest controllers.
7. Calibrate each hand:
   - Grab your controllers and rest them on your thighs, pointing forward. Look at your
     controllers, then **click the joystick** (press down on the thumbstick) to reset that
     hand. Do this for both controllers.
   - If needed, fine-tune from there: **move the joystick** to slide the hand forward/back and
     left/right, and use the **Primary button** (A / X) to lower it or the **Secondary button**
     (B / Y) to raise it.
   - **Trigger** pinches (also used to select UI and to draw, depending on mode).
   - **Grip** (the side squeeze button) makes a full fist.

That's it — this URL never changes, so this is the whole setup every time you use it.

### Method 2: Self-hosted (Cloudflare tunnel)

Use this if you're running your own copy of the relay locally instead of the hosted one. The
free tunnel URL changes every time you start it, so there are a couple of extra steps versus
Method 1.

1. **On your Mac**, open a terminal and start the relay:
   ```bash
   cd /path/to/SpecsQuest/QuestBridge/relay
   npm start
   ```
2. In a **second terminal window**, open a tunnel to it:
   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```
3. Copy the `https://xxxx.trycloudflare.com` URL it prints. Save it somewhere you can open on
   the Quest later (e.g. a Google Keep note).
4. **In Lens Studio**, paste that same URL into **both** `ControllerHandDriver` components'
   `url` field — but swap `https://` for `wss://` at the start (the Lens needs the `wss://`
   data-socket address, not the `https://` page address). Save and push the project to your
   Spectacles.
5. **On the Quest**, open the **original `https://`** URL (type it, or open it from your saved
   note) and tap **"Enter VR & stream both controllers."**
6. Take the headset off, place it facing you, put on your Spectacles, launch the Lens, and use
   your controllers exactly as in Method 1.

---

## How it works

```
Quest 3 controller          Quest Browser (WebXR)         Relay server            Spectacles Lens
   (tracked via   )   -->   reads position, rotation, --> forwards each     -->   moves a virtual
   infrared + IMU          trigger/grip/stick values       packet to the         hand model to match
                            ~70-90 times a second           Spectacles
```

**1. The Quest tracks the controller.** Quest 3 controllers are tracked using infrared light
(which the headset's cameras can see even in a dark room) combined with the controller's own
motion sensors. This is what makes the whole project work in low light — the Quest doesnt need
visible light to know where your hand is.

**2. A webpage reads that tracking data.** Quest2Specs is, underneath, a small webpage using
WebXR (a browser API for VR/AR data) that you open in the Quest's own browser. Every rendered
frame, it reads each controller's position, rotation, and button states, and sends that as a
small message over the internet.

**3. A relay server passes it along.** Spectacles can't talk to the Quest directly, so a small
server sits in between — either the hosted one on Render, or one you run yourself — and simply
forwards every message it receives from the Quest to the Spectacles.

**4. The Lens moves a virtual hand to match.** A script running in the Spectacles Lens
(`ControllerHandDriver`) receives that stream and drives a 3D hand rig: the hand's position and
rotation follow the controller, the trigger curls the index finger and thumb into a pinch, and
the grip curls the rest of the fingers into a fist.

**5. The tricky part — lining up two separate "worlds."** The Quest and the Spectacles each
track space independently; they have no shared sense of where "here" is. So the two worlds get
lined up at the moment you click the joystick, using a fixed offset (configurable in the
`ControllerHandDriver` script): the Lens takes the direction you're currently looking, applies
that offset from your Spectacles' position, and places the hand model at the resulting spot. At
the same time, the hand model's forward is set to match whichever direction the controller is
pointing. From that single handshake on, every movement of the controller is applied 1:1 to the
hand — even though the two devices never share a coordinate system beyond that moment.

One detail worth knowing: the mapping between the controller's tilt and the hand's tilt is
captured at the moment you click reset. Whatever orientation the controller has right then is
adopted as the hand's neutral pose — flat, fingers forward. That's exactly why the calibration
step has you rest the controller flat on your thigh, pointing forward, before clicking the
joystick: click reset while the controller is tilted or pointing sideways, and the hand will
sit at a matching weird angle until you reset again properly.

Everything else — pinch-to-select UI, poke-to-press buttons, and in-air drawing — is built on
top of this same live hand data, the same way Spectacles' own native hand tracking would drive
those interactions, just powered by a controller instead of your bare hands.

## Troubleshooting

- **Hand movement is laggy or doesn't match your controller** — almost always a WiFi issue.
  Make sure both the Quest and your Mac/relay are on a strong connection; a weak signal to
  either device causes exactly this.
- **Hand seems to randomly pinch/grab, or feels out of sync** — check that only **one** Quest
  device is streaming to the relay at a time. If an old tab or a second headset is still
  connected, its data gets mixed in with the one you're using.
- **Screen looks blank/teal in VR** — that's expected; the WebXR page doesn't render a scene,
  it only streams controller data. A status panel is shown at eye level once you're in VR.
- **Hand position feels off after a while** — the two devices' tracking can drift apart over a
  long session. Click the joystick again to re-anchor, then fine-tune with the joystick and
  A/B buttons if needed.
- **Hand looks tilted or points a weird direction** — the controller was tilted when the Lens
  started or when you last clicked reset. Rest the controller flat on your thigh, pointing
  forward, and click the joystick again — no need to restart the Lens.

---

## Project structure

```
Assets/Scripts/           Lens Studio scripts (hand driver, interactors, UI toggles, drawing)
QuestBridge/webxr/        The WebXR page you open in the Quest Browser
QuestBridge/relay/        The relay server (Node.js) — deploy this or run it locally
```

This project is open source — contributions and forks welcome.
