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
 * ControllerHandDriver
 *
 * Drives a custom hand rig in a Spectacles Lens from a Quest 3 controller, relayed
 * over a secure WebSocket. This is the "sink" side of the bridge:
 *
 *   Quest Browser (WebXR) --wss--> Node relay --wss--> THIS SCRIPT --> hand rig
 *
 * Why a custom rig and not SIK's HandVisual?
 *   SIK's TrackedHand joints are read-only Keypoints bound to the device's native
 *   ObjectTracking3D hand tracker (see Keypoint.ts). You cannot inject external poses
 *   into them. So we drive our OWN cloned hand rig instead, using HandVisual only as a
 *   rigging reference (joint naming + root/handModel/mesh hierarchy).
 *
 * Coordinate frames:
 *   WebXR `local-floor` and Lens Studio are both right-handed, Y-up, -Z-forward, so
 *   position/rotation map directly (just metres -> centimetres). Quest's tracking origin
 *   is unrelated to the Spectacles origin, so we CALIBRATE: hold the controller where you
 *   want the hand to rest, press the calibrate button, and from then on we apply the
 *   controller's delta motion relative to that moment, anchored to a spot in front of you.
 *
 * Setup (see QuestBridge/README.md):
 *   - Make `handRoot` a CHILD of the Spectacles Camera, positioned where the hand should
 *     rest by default (e.g. ~30cm in front, slightly down). We drive its LOCAL transform.
 *   - Assign an Internet Module asset to `internetModule`.
 *   - Assign the proximal index/thumb joints for the trigger->pinch curl.
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
            this.internetModule = this.internetModule;
            this.url = this.url;
            this.handRoot = this.handRoot;
            this.indexJoint = this.indexJoint;
            this.thumbJoint = this.thumbJoint;
            this.curlAxis = this.curlAxis;
            this.maxCurlDegrees = this.maxCurlDegrees;
            this.posScale = this.posScale;
            this.calibrateButton = this.calibrateButton;
            // Pinch rest pose, captured at awake
            this.indexRest = quat.quatIdentity();
            this.thumbRest = quat.quatIdentity();
            // Calibration reference
            this.calibrated = false;
            this.refPos = vec3.zero();
            this.refRotInv = quat.quatIdentity();
            this.anchorPos = vec3.zero();
            this.anchorRot = quat.quatIdentity();
            this.prevCalibButton = false;
            this.active = true;
        }
        __initialize() {
            super.__initialize();
            this.internetModule = this.internetModule;
            this.url = this.url;
            this.handRoot = this.handRoot;
            this.indexJoint = this.indexJoint;
            this.thumbJoint = this.thumbJoint;
            this.curlAxis = this.curlAxis;
            this.maxCurlDegrees = this.maxCurlDegrees;
            this.posScale = this.posScale;
            this.calibrateButton = this.calibrateButton;
            // Pinch rest pose, captured at awake
            this.indexRest = quat.quatIdentity();
            this.thumbRest = quat.quatIdentity();
            // Calibration reference
            this.calibrated = false;
            this.refPos = vec3.zero();
            this.refRotInv = quat.quatIdentity();
            this.anchorPos = vec3.zero();
            this.anchorRot = quat.quatIdentity();
            this.prevCalibButton = false;
            this.active = true;
        }
        onAwake() {
            this.handTransform = this.handRoot.getTransform();
            this.anchorPos = this.handTransform.getLocalPosition();
            this.anchorRot = this.handTransform.getLocalRotation();
            if (this.indexJoint)
                this.indexRest = this.indexJoint.getTransform().getLocalRotation();
            if (this.thumbJoint)
                this.thumbRest = this.thumbJoint.getTransform().getLocalRotation();
            this.connect();
        }
        /** Enable/disable the controller-driven hand (used by the toggle). */
        setActive(on) {
            this.active = on;
            this.handRoot.enabled = on;
        }
        /** Re-zero the mapping next packet. Call from a UI button too if you like. */
        requestCalibration() {
            this.calibrated = false;
        }
        connect() {
            this.socket = this.internetModule.createWebSocket(this.url);
            this.socket.onopen = () => print(`${TAG} connected to ${this.url}`);
            this.socket.onerror = () => print(`${TAG} socket error`);
            this.socket.onclose = () => {
                print(`${TAG} socket closed, retrying in 2s`);
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
                this.applyPacket(pkt);
            };
        }
        applyPacket(p) {
            const questPos = new vec3(p.px, p.py, p.pz);
            const questRot = new quat(p.qw, p.qx, p.qy, p.qz);
            // Rising-edge calibrate button
            const calibPressed = !!(p.buttons && p.buttons[this.calibrateButton] > 0.5);
            if (calibPressed && !this.prevCalibButton)
                this.calibrated = false;
            this.prevCalibButton = calibPressed;
            if (!this.calibrated) {
                this.refPos = questPos;
                this.refRotInv = questRot.invert();
                // Re-read anchor in case it was repositioned in the editor
                this.anchorPos = this.handTransform.getLocalPosition();
                this.anchorRot = this.handTransform.getLocalRotation();
                this.calibrated = true;
            }
            // Position: delta since calibration, metres -> cm, applied at the anchor.
            const deltaM = questPos.sub(this.refPos);
            const deltaCm = deltaM.uniformScale(100 * this.posScale);
            this.handTransform.setLocalPosition(this.anchorPos.add(deltaCm));
            // Rotation: world delta since calibration, applied to the anchor rotation.
            const deltaRot = questRot.multiply(this.refRotInv);
            this.handTransform.setLocalRotation(deltaRot.multiply(this.anchorRot));
            // Pinch: curl proximal joints by trigger amount.
            const angle = Math.max(0, Math.min(1, p.trigger)) * this.maxCurlDegrees * DEG2RAD;
            const curl = quat.angleAxis(angle, this.curlAxis);
            if (this.indexJoint)
                this.indexJoint.getTransform().setLocalRotation(this.indexRest.multiply(curl));
            if (this.thumbJoint)
                this.thumbJoint.getTransform().setLocalRotation(this.thumbRest.multiply(curl));
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