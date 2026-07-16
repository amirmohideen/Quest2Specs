<h1 align="center">🥽 Quest2Specs</h1>

<p align="center">
  Use your <b>Meta Quest controllers</b> as controller hand inputs for <b>Snap Spectacles!</b><br>
  Quest2Specs reads your Quest controller's position, rotation, and button presses, and streams that data to a virtual hand in your Spectacles Lens - so you get full hand tracking, pinch, and grab, regardless of lighting conditions.
</p>

<p align="center">
  <a href="#features">✨ Features</a> •
  <a href="#supported-hardware">🥽 Supported Hardware</a> •
  <a href="#setup">🚀 Setup & Instructions</a> •
  <a href="#how-it-works">⚙️ How it works</a> •
  <a href="#troubleshooting">🛠️ Troubleshooting</a>
</p>

<p align="center">
  <!-- TODO: replace with a nice hero gif or video link -->
  <img src="icon.png" alt="Quest2Specs icon" width="150" />
</p>

---

<a id="features"></a>
## ✨ Features

| Feature | Description |
| :--- | :--- |
| 👐 **6DoF controller hand tracking** | The virtual hand follows your real controller's position, rotation and button input actions 1:1. |
| 🌒 **Works in the dark** | IR sensors in controllers are tracked by Quest, so Spectacles's hand models works in the dark. |
| 🤏 **Pinch, grab & poke** | Trigger pinches (index + thumb), grip closes a full fist, and you can poke UI directly. |
| 🎯 **Point-and-select UI** | A ray + cursor lets you select SIK/UIKit interactables at a distance. |
| 🎨 **3D drawing** | Draw in-air, world-locked strokes with the trigger (adjustable thickness/color/auto-delete). |
| 🤲 **Independent hands** | Two hand models, independently calibrated and adjustable with controllers. |

---

<a id="supported-hardware"></a>
## 🥽 Supported hardware

| Device | Type | Status |
| :--- | :--- | :--- |
| **Quest 3** | Headset | ✅ Supported (tested on OS Version 2.5 released on June 22, 2026) |
| **Quest 3S** | Headset | ✅ Supported (tested on OS Version 2.5 released on June 22, 2026) |
| **Spectacles (2024)** | Glasses | ✅ Supported |
| **Specs (2026)** | Glasses | ⚠️ Need to test |
| **Quest Pro** | Headset | ⚠️ Need to test |
| **Quest 2** | Headset | ⚠️ Need to test |

> **📝 Note:** Both devices must be connected to the internet (a local WiFi network works fine for both). Self-hosting requires [Node.js](https://nodejs.org) and `cloudflared` on a Mac/PC.

---

<a id="setup"></a>
## 🚀 Setup & Instructions

There are two ways to run the bridge server that relays data between your Quest and your Spectacles. 

<details open>
<summary><b>🌐 Method 1: Hosted (Easiest)</b></summary>
<br>

<video src="https://github.com/user-attachments/assets/e65661ae-cd18-4a50-9892-ea0578e144f3" width="300" controls></video>

1. **Quest Settings:**
   - **For Quest 3S:** Go to **Settings -> General -> Power -> Display Off** -> Set it to 4 hours or a longer option so that the Quest doesn't power off during the session.
   - **For Quest 3:** In addition to the display setting change, Quest 3 has a proximity sensor that you may have to cover with a small sticky note so that the Quest stays on.

2. **Start relay server:**
   - **2.1** On the Quest, open the Quest Browser and go to https://quest2specs.onrender.com.
   - **2.2** Tap **"Enter VR & stream both controllers."**
   - **2.3** Take the headset off and place it **in front of you, facing you**, so its cameras can see your controllers (about a meter away, tilted slightly down toward your hands).

3. **Spectacles:**
   - **3.1** Put on your Spectacles and launch this Quest2Specs project Lens in the draft section that you pushed from your computer to your Specs, or [launch the Lens from this link](https://www.spectacles.com/lens/3e934befff444f5dad0ff119e31f27bc).
   - **3.2** Pick up your Quest controllers. Here are the basic controls:

     | Input | Action |
     | :--- | :--- |
     | **Trigger** | Pinches (used to select UI and to draw) |
     | **Grip** (side squeeze button) | Makes a full fist |

   - **3.3** If necessary, here is how you recalibrate your controller hand models: <br>
     Grab your controllers and rest them on your thighs, pointing forward. Look at your controllers, then click the joystick (press down on the thumbstick) to reset that hand. (Do this for both hands).

   - **3.4** If needed, fine-tune:

     | Input | Action |
     | :--- | :--- |
     | **Move Joystick** | Slide the hand forward/back and left/right |
     | **Primary button (A / X)** | Lower hand |
     | **Secondary button (B / Y)** | Raise hand |

</details>

<details open>
<summary><b>💻 Method 2: Self-hosted (For Developers)</b></summary>
<br>
Useful for development or if you'd rather not depend on a hosted server. The free cloudflare tunnel URL changes every time you start it.

1. **On your Mac**, open a terminal window and start the relay:
   ```bash
   cd /[path to the repo]/Quest2Specs/QuestBridge/relay
   npm start
   ```
2. In a **second terminal window**, open a tunnel to it:
   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```
3. Search for the `https://xxxx.trycloudflare.com` URL it prints and copy it. Save it somewhere (like a Google Keep notes) so you can open on the Quest later.
4. **In Lens Studio**, paste that same URL into **both** `ControllerHandDriver.ts` components' `url` field - but swap `https://` for `wss://` at the start (the Lens needs the WebSocket address). So in the script url field it will look like 'wss://xxxx.trycloudflare.com'. Save and push the project to your Spectacles.
5. **On the Quest**, open the **original `https://xxxx.trycloudflare.com`** URL and tap **"Enter VR & stream both controllers."**
6. Take the headset off, put on your Spectacles, launch the Lens, and calibrate your controllers exactly as in Method 1.
</details>

---

<a id="how-it-works"></a>
## ⚙️ How it works

```mermaid
flowchart LR
  Quest["🎮 Quest 3 controller<br>(tracked via IR + IMU)"] -->|"Reads pos/rot, buttons<br>WebXR ~70-90Hz"| Browser["🌐 Quest Browser"]
  Browser -->|"WebSockets"| Server["☁️ Relay Server<br>(Hosted or Local)"]
  Server -->|"Forwards packets"| Lens["👓 Spectacles Lens<br>Quest2Specs"]
```

<details open>
<summary><b>📖 Read the technical deep-dive</b></summary>
<br>

**1. Quest tracks controllers:** <br>
Quest 3 controllers are tracked using infrared light combined with the controller's own motion sensors. Hence, Quest is able to track controllers even in very dark environments.

**2. WebXR page sends tracking data to relay server:** <br>
A page hosted in WebXR (a browser API for VR/AR data) reads each controller's position, rotation, and button states in every rendered frame, and sends that as a small message over the internet to a relay server.

**3. Relay server forwards it to Spectacles:** <br>
Spectacles can't talk to the Quest directly, so a small relay server (Method 1: hosted on Render, Method 2: self hosted using cloudflare) sits in between and simply forwards every message it receives from the Quest to the Spectacles.

**4. Specs Lens moves virtual hand to match:** <br>
A script running in the Spectacles Lens (ControllerHandDriver.ts) receives that stream and drives a 3D hand rig. The trigger curls the index finger and thumb into a pinch, and the grip curls the rest of the fingers into a fist.

**5. The tricky part - lining up two separate "worlds":** <br>
The Quest and the Spectacles each track space independently. The two worlds get lined up at the moment you click the joystick, using a fixed offset: the Lens takes the direction you're currently looking, applies an offset, and places the hand model at the resulting spot. The hand model's forward is set to match whichever direction the controller is pointing.

> 💡 **Calibration Tip:** The mapping between the controller's tilt and the hand's tilt is captured at the moment you click reset. That's why the calibration step has you rest the controller flat on your thigh, pointing forward!

</details>

---

<a id="troubleshooting"></a>
## 🛠️ Troubleshooting & Structure

<details open>
<summary><b>🔧 Troubleshooting Guide</b></summary>
<br>

| Symptom | Things to try |
| :--- | :--- |
| 🐌 **Laggy movement** | Make sure your controllers are in the Quest's field of view, especially in the dark. |
| 🐌 **Extreme delay or mismatched movement** | Probably a WiFi or Internet connection issue. Make sure both the Quest and your Spectacles and/or your Mac/relay are on the same connection and are on a strong connection. Testing with your Mobile Hotspot is another suggestion. |
| 👻 **Random pinches / out of sync** | Check that only **one** Quest device is streaming to the relay at a time. Old tabs in a PC or a second headset will mix data. |
| 🟦 **Blank teal screen in VR** | Expected behavior! The WebXR page doesn't render a scene, it only streams data. A status panel is shown at eye level. |
| 🧭 **Drifting position over time** | Devices can drift over a long session. Click the joystick again to re-anchor, then fine-tune with the joystick/buttons. |
| 📐 **Tilted / weird hand angle** | The controller was tilted or in a weird orientation when reset. Grab your controllers, rest your arm flat on your thigh, pointing forward, and click joystick again to reset. |

</details>

<details open>
<summary><b>📁 Project Structure</b></summary>
<br>

| Path | Description |
| :--- | :--- |
| 📂 `Assets/Scripts/` | Lens Studio scripts (hand driver, interactors, UI toggles, drawing) |
| 🌐 `QuestBridge/webxr/` | The WebXR page you open in the Quest Browser |
| 🖥️ `QuestBridge/relay/` | The relay server (Node.js) - deploy this or run it locally |

</details>

<p align="center">
  <i>This project is open source - contributions and forks welcome.</i> 🤝
</p>
