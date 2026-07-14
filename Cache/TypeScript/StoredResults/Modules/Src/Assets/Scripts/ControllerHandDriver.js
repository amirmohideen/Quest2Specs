"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerHandDriver = void 0;
var __selfType = requireType("./ControllerHandDriver");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
/**
 * ControllerHandDriver — WORLD-LOCKED 6DoF
 *
 * Drives a custom hand rig in a Spectacles Lens from a Quest 3 controller, relayed
 * over a secure WebSocket:
 *
 *   Quest Browser (WebXR) --wss--> Node relay --wss--> THIS SCRIPT --> hand rig
 *
 * The hand is placed in Spectacles WORLD space (the rig must NOT be parented to the Camera),
 * so it stays put in the room as you turn your head, sitting where the controller physically is.
 *
 * The two devices have independent tracking origins, so we ALIGN them once at calibration.
 * Both worlds are gravity-aligned (Y-up), so the only difference is a yaw (heading) rotation
 * plus a translation. At calibration we:
 *   - read the Spectacles Camera pose (our world reference),
 *   - read the controller pose (Quest world),
 *   - solve a yaw + translation that maps "controller now" to "a spot in front of the camera",
 *   - capture the hand model's current world rotation as its rest pose.
 * Then every frame:  handWorld = align ∘ controllerQuestPose.
 *
 * CALIBRATION GESTURE: rest the controller on your thigh pointing forward, look at it, and
 * click the joystick. The hand model is placed at a fixed offset (`calibrationOffsetCm`) from
 * where you're looking, its forward matched to the controller's pointing direction, and it
 * follows the controller's movement 1:1 from then on. Fine-tune the resting spot afterward
 * with the thumbstick slide and the A/B height-nudge buttons.
 *
 * PINCH = trigger curls index+thumb.  FIST = grip curls the rest (+ index/thumb via max()).
 *
 * Why a custom rig and not SIK's HandVisual? SIK joints are read-only Keypoints bound to the
 * native hand tracker. We use HandVisual only as a rigging reference (joint names: wrist,
 * thumb-0..3, index-0..3, mid-*, ring-*, pinky-*).
 */
const TAG = "[ControllerHandDriver]";
const DEG2RAD = Math.PI / 180;
let ControllerHandDriver = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ControllerHandDriver = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.handedness = this.handedness;
            this.internetModule = this.internetModule;
            this.url = this.url;
            this.handRoot = this.handRoot;
            this.camera = this.camera;
            this.indexJoints = this.indexJoints;
            this.indexCurlAxis = this.indexCurlAxis;
            this.indexMaxDegrees = this.indexMaxDegrees;
            this.thumbJoints = this.thumbJoints;
            this.thumbCurlAxis = this.thumbCurlAxis;
            this.thumbMaxDegrees = this.thumbMaxDegrees;
            this.fistJoints = this.fistJoints;
            this.fistCurlAxis = this.fistCurlAxis;
            this.fistMaxDegrees = this.fistMaxDegrees;
            this.calibrationOffsetCm = this.calibrationOffsetCm;
            this.yawTrimDegrees = this.yawTrimDegrees;
            this.posScale = this.posScale;
            this.resetButton = this.resetButton;
            this.nudgeUpButton = this.nudgeUpButton;
            this.nudgeDownButton = this.nudgeDownButton;
            this.nudgeStepCm = this.nudgeStepCm;
            this.nudgeAxisWorld = this.nudgeAxisWorld;
            this.enableStickMove = this.enableStickMove;
            this.stickSpeedCmPerSec = this.stickSpeedCmPerSec;
            this.stickDeadzone = this.stickDeadzone;
            this.stickForwardAxisWorld = this.stickForwardAxisWorld;
            this.stickRightDir = this.stickRightDir;
            this.stickXIndex = this.stickXIndex;
            this.stickYIndex = this.stickYIndex;
            this.maxStickOffsetCm = this.maxStickOffsetCm;
            // Pinch/fist rest poses
            this.indexRest = [];
            this.thumbRest = [];
            this.fistRest = [];
            // Alignment (Quest world -> Spectacles world): handWorldPos = alignYaw*(questPos*100*scale) + alignPos
            //                                               handWorldRot = alignYaw * questRot * modelOffset
            this.calibrated = false;
            this.alignYaw = quat.quatIdentity();
            this.alignPos = vec3.zero();
            this.modelOffset = quat.quatIdentity();
            this.prevCalibButton = false;
            this.prevUpButton = false;
            this.prevDownButton = false;
            this.heightOffsetCm = 0;
            this.stickOffset = vec3.zero();
            this.lastStickTime = -1;
            this.active = true;
            // Only the FRESHEST unapplied packet is kept — see onmessage below for why.
            this.pendingPacket = null;
            // Debug HUD state
            this._connected = false;
            this._lastTrigger = 0;
            this._lastGrip = 0;
            this._lastRxTime = -1;
        }
        __initialize() {
            super.__initialize();
            this.handedness = this.handedness;
            this.internetModule = this.internetModule;
            this.url = this.url;
            this.handRoot = this.handRoot;
            this.camera = this.camera;
            this.indexJoints = this.indexJoints;
            this.indexCurlAxis = this.indexCurlAxis;
            this.indexMaxDegrees = this.indexMaxDegrees;
            this.thumbJoints = this.thumbJoints;
            this.thumbCurlAxis = this.thumbCurlAxis;
            this.thumbMaxDegrees = this.thumbMaxDegrees;
            this.fistJoints = this.fistJoints;
            this.fistCurlAxis = this.fistCurlAxis;
            this.fistMaxDegrees = this.fistMaxDegrees;
            this.calibrationOffsetCm = this.calibrationOffsetCm;
            this.yawTrimDegrees = this.yawTrimDegrees;
            this.posScale = this.posScale;
            this.resetButton = this.resetButton;
            this.nudgeUpButton = this.nudgeUpButton;
            this.nudgeDownButton = this.nudgeDownButton;
            this.nudgeStepCm = this.nudgeStepCm;
            this.nudgeAxisWorld = this.nudgeAxisWorld;
            this.enableStickMove = this.enableStickMove;
            this.stickSpeedCmPerSec = this.stickSpeedCmPerSec;
            this.stickDeadzone = this.stickDeadzone;
            this.stickForwardAxisWorld = this.stickForwardAxisWorld;
            this.stickRightDir = this.stickRightDir;
            this.stickXIndex = this.stickXIndex;
            this.stickYIndex = this.stickYIndex;
            this.maxStickOffsetCm = this.maxStickOffsetCm;
            // Pinch/fist rest poses
            this.indexRest = [];
            this.thumbRest = [];
            this.fistRest = [];
            // Alignment (Quest world -> Spectacles world): handWorldPos = alignYaw*(questPos*100*scale) + alignPos
            //                                               handWorldRot = alignYaw * questRot * modelOffset
            this.calibrated = false;
            this.alignYaw = quat.quatIdentity();
            this.alignPos = vec3.zero();
            this.modelOffset = quat.quatIdentity();
            this.prevCalibButton = false;
            this.prevUpButton = false;
            this.prevDownButton = false;
            this.heightOffsetCm = 0;
            this.stickOffset = vec3.zero();
            this.lastStickTime = -1;
            this.active = true;
            // Only the FRESHEST unapplied packet is kept — see onmessage below for why.
            this.pendingPacket = null;
            // Debug HUD state
            this._connected = false;
            this._lastTrigger = 0;
            this._lastGrip = 0;
            this._lastRxTime = -1;
        }
        onAwake() {
            this.handTransform = this.handRoot.getTransform();
            this.cameraTransform = this.camera.getTransform();
            this.indexRest = this.captureRest(this.indexJoints);
            this.thumbRest = this.captureRest(this.thumbJoints);
            this.fistRest = this.captureRest(this.fistJoints);
            print(`${TAG} ${this.handedness} joints  index:${this.indexJoints.length}  ` +
                `thumb:${this.thumbJoints.length}  fist:${this.fistJoints.length}`);
            this.forceAlwaysDrawn(this.handRoot);
            this.connect();
            // Apply at most one packet per rendered frame - see onmessage for why this matters.
            const update = this.createEvent("UpdateEvent");
            update.bind(() => {
                if (this.pendingPacket) {
                    this.applyPacket(this.pendingPacket);
                    this.pendingPacket = null;
                }
            });
        }
        captureRest(joints) {
            return joints.map((j) => (j ? j.getTransform().getLocalRotation() : quat.quatIdentity()));
        }
        /**
         * Force every mesh under the rig to never frustum-cull. SIK's hand material uses a dynamic
         * UserDefinedAABB that HandVisual updated each frame; without HandVisual that box is stale, so
         * the mesh blinks out as it nears the view edges. A huge AABB makes the cull test always pass.
         */
        forceAlwaysDrawn(obj) {
            const big = 10000;
            const visuals = obj.getComponents("RenderMeshVisual");
            for (const v of visuals) {
                for (const mat of v.materials) {
                    for (let i = 0; i < mat.getPassCount(); i++) {
                        const pass = mat.getPass(i);
                        pass.frustumCullMode = FrustumCullMode.UserDefinedAABB;
                        pass.frustumCullMin = new vec3(-big, -big, -big);
                        pass.frustumCullMax = new vec3(big, big, big);
                    }
                }
            }
            const n = obj.getChildrenCount();
            for (let i = 0; i < n; i++)
                this.forceAlwaysDrawn(obj.getChild(i));
        }
        setActive(on) {
            this.active = on;
            this.handRoot.enabled = on;
        }
        requestCalibration() {
            this.calibrated = false;
        }
        // ---- Debug HUD accessors ----
        isConnected() {
            return this._connected;
        }
        isReceiving() {
            return this._lastRxTime >= 0 && getTime() - this._lastRxTime < 0.5;
        }
        getLastTrigger() {
            return this._lastTrigger;
        }
        getLastGrip() {
            return this._lastGrip;
        }
        getHandedness() {
            return this.handedness;
        }
        connect() {
            this.socket = this.internetModule.createWebSocket(this.url);
            this.socket.onopen = () => {
                this._connected = true;
                print(`${TAG} ${this.handedness} connected to ${this.url}`);
            };
            this.socket.onerror = () => print(`${TAG} ${this.handedness} socket error`);
            this.socket.onclose = () => {
                this._connected = false;
                print(`${TAG} ${this.handedness} socket closed, retrying in 2s`);
                const retry = this.createEvent("DelayedCallbackEvent");
                retry.bind(() => this.connect());
                retry.reset(2.0);
            };
            this.socket.onmessage = async (e) => {
                if (!this.active)
                    return;
                const raw = typeof e.data === "string" ? e.data : await e.data.text();
                let pkt;
                try {
                    pkt = JSON.parse(raw);
                }
                catch {
                    return;
                }
                if (pkt.hand && pkt.hand !== this.handedness)
                    return;
                this._lastRxTime = getTime();
                // Overwrite, don't queue: if several packets arrive before the next rendered frame (the
                // device fell behind for a moment), only the newest one matters. Applying every packet in
                // order here is what caused stale state (e.g. an old grab) to visibly replay late while
                // the current state waited behind it in the backlog.
                this.pendingPacket = pkt;
            };
        }
        /** Horizontal heading (radians) of a world-space direction vector. */
        headingOf(v) {
            return Math.atan2(v.x, v.z);
        }
        applyPacket(p) {
            const questPos = new vec3(p.px, p.py, p.pz);
            const questRot = new quat(p.qw, p.qx, p.qy, p.qz);
            // Rising-edge calibrate button (A/X) -> re-anchor.
            const calibPressed = !!(p.buttons && p.buttons[this.resetButton] > 0.5);
            if (calibPressed && !this.prevCalibButton)
                this.calibrated = false;
            this.prevCalibButton = calibPressed;
            // Per-hand height nudge: up button (B/Y) raises this hand, down button (A/X) lowers it.
            const upPressed = !!(p.buttons && p.buttons[this.nudgeUpButton] > 0.5);
            if (upPressed && !this.prevUpButton) {
                this.heightOffsetCm += this.nudgeStepCm;
                print(`${TAG} ${this.handedness} height -> ${this.heightOffsetCm.toFixed(0)}cm`);
            }
            this.prevUpButton = upPressed;
            const downPressed = !!(p.buttons && p.buttons[this.nudgeDownButton] > 0.5);
            if (downPressed && !this.prevDownButton) {
                this.heightOffsetCm -= this.nudgeStepCm;
                print(`${TAG} ${this.handedness} height -> ${this.heightOffsetCm.toFixed(0)}cm`);
            }
            this.prevDownButton = downPressed;
            if (!this.calibrated) {
                this.calibrate(questPos, questRot);
                this.calibrated = true;
            }
            // FOLLOW (world-locked) + live height nudge (B/Y) + thumbstick slide (X/Z)
            this.updateStickOffset(p.axes);
            const scaled = questPos.uniformScale(100 * this.posScale);
            const nudge = this.nudgeAxisWorld.uniformScale(this.heightOffsetCm);
            const worldPos = this.alignYaw.multiplyVec3(scaled).add(this.alignPos).add(nudge).add(this.stickOffset);
            this.handTransform.setWorldPosition(worldPos);
            this.handTransform.setWorldRotation(this.alignYaw.multiply(questRot).multiply(this.modelOffset));
            // PINCH (trigger) + FIST (grip)
            this._lastTrigger = Math.max(0, Math.min(1, p.trigger));
            this._lastGrip = Math.max(0, Math.min(1, p.grip ?? 0));
            const indexThumb = Math.max(this._lastTrigger, this._lastGrip);
            this.applyCurl(this.indexJoints, this.indexRest, this.indexCurlAxis, this.indexMaxDegrees, indexThumb);
            this.applyCurl(this.thumbJoints, this.thumbRest, this.thumbCurlAxis, this.thumbMaxDegrees, indexThumb);
            this.applyCurl(this.fistJoints, this.fistRest, this.fistCurlAxis, this.fistMaxDegrees, this._lastGrip);
        }
        /** Solve the Quest-world -> Spectacles-world alignment from the current camera + controller pose. */
        calibrate(questPos, questRot) {
            // A reset re-anchors AND clears the manual stick/height offsets for a clean default pose.
            this.stickOffset = vec3.zero();
            this.heightOffsetCm = 0;
            const camPos = this.cameraTransform.getWorldPosition();
            const camRot = this.cameraTransform.getWorldRotation();
            const camRight = camRot.multiplyVec3(new vec3(1, 0, 0));
            const camUp = camRot.multiplyVec3(new vec3(0, 1, 0));
            const camFwd = camRot.multiplyVec3(new vec3(0, 0, -1)); // camera looks down local -Z
            // Yaw: align the controller's heading to the camera's heading (assumes you point it forward).
            const ctrlFwd = questRot.multiplyVec3(new vec3(0, 0, -1));
            const phi = this.headingOf(camFwd) - this.headingOf(ctrlFwd) + this.yawTrimDegrees * DEG2RAD;
            this.alignYaw = quat.angleAxis(phi, vec3.up());
            // Translation: map the controller's current position to the fixed offset spot relative to
            // where you're looking. From this moment on, controller movement applies 1:1 on top of it.
            const o = this.calibrationOffsetCm;
            const anchor = camPos
                .add(camRight.uniformScale(o.x))
                .add(camUp.uniformScale(o.y))
                .add(camFwd.uniformScale(o.z));
            const scaledRef = questPos.uniformScale(100 * this.posScale);
            this.alignPos = anchor.sub(this.alignYaw.multiplyVec3(scaledRef));
            // Orientation offset so the hand starts at its authored (current) world rest pose.
            const restRot = this.handTransform.getWorldRotation();
            this.modelOffset = this.alignYaw.multiply(questRot).invert().multiply(restRot);
            print(`${TAG} ${this.handedness} calibrated  yaw=${(phi / DEG2RAD).toFixed(1)}deg`);
        }
        /** Integrate this hand's thumbstick into a persistent positional slide (X/Z by default). */
        updateStickOffset(axes) {
            const now = getTime();
            if (!this.enableStickMove || !axes) {
                this.lastStickTime = now;
                return;
            }
            const dt = this.lastStickTime < 0 ? 0 : Math.min(0.1, now - this.lastStickTime);
            this.lastStickTime = now;
            if (dt <= 0)
                return;
            let sx = axes[this.stickXIndex] ?? 0;
            let sy = axes[this.stickYIndex] ?? 0;
            if (Math.abs(sx) < this.stickDeadzone)
                sx = 0;
            if (Math.abs(sy) < this.stickDeadzone)
                sy = 0;
            if (sx === 0 && sy === 0)
                return;
            // WebXR: stick up = -Y, stick right = +X.
            const forward = -sy;
            const right = sx;
            const move = this.stickForwardAxisWorld
                .uniformScale(forward)
                .add(this.stickRightDir.uniformScale(right))
                .uniformScale(this.stickSpeedCmPerSec * dt);
            this.stickOffset = this.stickOffset.add(move);
            const len = this.stickOffset.length;
            if (len > this.maxStickOffsetCm) {
                this.stickOffset = this.stickOffset.uniformScale(this.maxStickOffsetCm / len);
            }
        }
        applyCurl(joints, rest, axis, maxDeg, t) {
            if (joints.length === 0)
                return;
            const curl = quat.angleAxis(t * maxDeg * DEG2RAD, axis);
            for (let i = 0; i < joints.length; i++) {
                if (joints[i] && rest[i])
                    joints[i].getTransform().setLocalRotation(rest[i].multiply(curl));
            }
        }
    };
    __setFunctionName(_classThis, "ControllerHandDriver");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ControllerHandDriver = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ControllerHandDriver = _classThis;
})();
exports.ControllerHandDriver = ControllerHandDriver;
//# sourceMappingURL=ControllerHandDriver.js.map