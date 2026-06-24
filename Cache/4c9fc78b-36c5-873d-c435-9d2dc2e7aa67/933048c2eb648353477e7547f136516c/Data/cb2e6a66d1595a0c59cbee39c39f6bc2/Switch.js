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
exports.Switch = void 0;
var __selfType = requireType("./Switch");
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
const Colors_1 = require("../../Themes/SnapOS-2.0/Colors");
const RoundedRectangleVisual_1 = require("../../Visuals/RoundedRectangle/RoundedRectangleVisual");
const Slider_1 = require("../Slider/Slider");
// Track visual style
const trackStyle = {
    default: {
        baseGradient: {
            type: "Linear",
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchTrackGray },
            stop1: { percent: 0.5, color: Colors_1.SwitchTrackGray },
            stop2: { percent: 1, color: Colors_1.SwitchTrackGray }
        },
        baseType: "Gradient",
        hasBorder: true,
        borderSize: 0.1,
        borderType: "Gradient",
        borderGradient: {
            start: new vec2(-0.8, 1),
            end: new vec2(0.8, -1),
            stop0: { percent: 0, color: Colors_1.SwitchTrackBorderGray },
            stop1: { percent: 0.5, color: Colors_1.SwitchTrackBorderTransparent },
            stop2: { percent: 1, color: Colors_1.SwitchTrackBorderGray }
        }
    },
    hovered: {
        baseGradient: {
            start: new vec2(0, 1.8),
            end: new vec2(0, -1.8),
            stop0: { percent: 0, color: Colors_1.DarkGray },
            stop1: { percent: 0.5, color: Colors_1.DarkGray },
            stop2: { percent: 1, color: Colors_1.MediumDarkGray }
        }
    },
    triggered: {
        baseGradient: {
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchTrackGray },
            stop1: { percent: 0.5, color: Colors_1.SwitchTrackGray },
            stop2: { percent: 1, color: Colors_1.SwitchTrackGray }
        }
    },
    toggledDefault: {
        borderGradient: {
            type: "Linear",
            start: new vec2(-0.9, 1),
            end: new vec2(0.9, -1),
            stop0: { percent: 0, color: Colors_1.SwitchBorderYellowLight },
            stop1: { percent: 0.55, color: Colors_1.SwitchBorderYellowMedium },
            stop2: { percent: 1, color: Colors_1.SwitchBorderYellowLight }
        }
    },
    toggledHovered: {
        borderGradient: {
            type: "Linear",
            start: new vec2(-0.9, 1),
            end: new vec2(0.9, -1),
            stop0: { percent: 0, color: Colors_1.SwitchBorderYellowBright },
            stop1: { percent: 0.55, color: Colors_1.SwitchBorderYellowBrighter },
            stop2: { percent: 1, color: Colors_1.SwitchBorderYellowBright }
        }
    },
    toggledTriggered: {
        borderGradient: {
            type: "Linear",
            start: new vec2(-0.9, 1),
            end: new vec2(0.9, -1),
            stop0: { percent: 0, color: Colors_1.SwitchBorderYellowLight },
            stop1: { percent: 0.55, color: Colors_1.SwitchBorderYellowMedium },
            stop2: { percent: 1, color: Colors_1.SwitchBorderYellowLight }
        }
    }
};
// Track Fill visual style
const trackFillStyle = {
    default: {
        baseGradient: {
            type: "Linear",
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchTrackFillGray },
            stop1: { percent: 1, color: Colors_1.SwitchTrackFillGray }
        },
        baseType: "Gradient"
    },
    hovered: {
        baseGradient: {
            type: "Linear",
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchHoverOrange },
            stop1: { percent: 1, color: Colors_1.SwitchHoverYellow }
        }
    },
    toggledDefault: {
        baseGradient: {
            type: "Linear",
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchTrackYellowDark },
            stop1: { percent: 1, color: Colors_1.SwitchTrackYellowDark }
        }
    },
    toggledHovered: {
        baseGradient: {
            type: "Linear",
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchTrackYellowMedium },
            stop1: { percent: 1, color: Colors_1.SwitchTrackYellowMedium }
        }
    },
    toggledTriggered: {
        baseGradient: {
            type: "Linear",
            start: new vec2(-1, 0),
            end: new vec2(1, 0),
            stop0: { percent: 0, color: Colors_1.SwitchTrackYellowDark },
            stop1: { percent: 1, color: Colors_1.SwitchTrackYellowDark }
        }
    }
};
// Knob visual style
const knobStyle = {
    default: {
        baseGradient: {
            enabled: true,
            type: "Linear",
            start: new vec2(-1, 1),
            end: new vec2(1, -1),
            stop0: { percent: 0, color: Colors_1.DarkestGray },
            stop1: { percent: 1, color: Colors_1.DarkWarmGray }
        },
        baseType: "Gradient",
        hasBorder: true,
        borderSize: 0.05,
        borderType: "Gradient",
        borderGradient: {
            start: new vec2(-0.8, 1),
            end: new vec2(0.8, -1),
            stop0: { percent: 0, color: Colors_1.SwitchKnobBorderGray },
            stop1: { percent: 1, color: Colors_1.SwitchKnobBorderTransparent }
        }
    },
    hovered: {
        baseGradient: {
            enabled: true,
            type: "Linear",
            start: new vec2(-1, 1),
            end: new vec2(1, -1),
            stop0: { percent: 0, color: Colors_1.DarkerLessGray },
            stop1: { percent: 1, color: Colors_1.SwitchKnobGray }
        },
        borderGradient: {
            start: new vec2(-0.8, 1),
            end: new vec2(0.8, -1),
            stop0: { percent: 0, color: Colors_1.MediumWarmGray },
            stop1: { percent: 1, color: Colors_1.SwitchKnobBorderTransparentHover }
        }
    },
    triggered: {
        baseGradient: {
            enabled: true,
            type: "Linear",
            stop0: { percent: 0, color: Colors_1.SwitchYellowDark },
            stop1: { percent: 1, color: Colors_1.SwitchYellowBright }
        }
    },
    toggledDefault: {
        baseGradient: {
            enabled: true,
            type: "Linear",
            stop0: { percent: 0, color: Colors_1.SwitchYellowDark },
            stop1: { percent: 1, color: Colors_1.SwitchYellowBright }
        },
        borderGradient: {
            type: "Linear",
            start: new vec2(-0.8, 1),
            end: new vec2(0.8, -1),
            stop0: { percent: 0, color: Colors_1.SwitchKnobBorderYellow },
            stop1: { percent: 0.55, color: Colors_1.SwitchKnobBorderYellowMedium },
            stop2: { percent: 1, color: Colors_1.SwitchKnobBorderYellowBright }
        }
    },
    toggledHovered: {
        baseGradient: {
            enabled: true,
            type: "Linear",
            stop0: { percent: 0, color: Colors_1.SwitchYellowBrightHover },
            stop1: { percent: 1, color: Colors_1.SwitchYellowBrightestHover }
        },
        borderGradient: {
            type: "Linear",
            start: new vec2(-0.8, 1),
            end: new vec2(0.8, -1),
            stop0: { percent: 0, color: Colors_1.TriggeredBorderYellow },
            stop1: { percent: 0.55, color: Colors_1.SwitchKnobBorderYellowHover },
            stop2: { percent: 1, color: Colors_1.TriggeredBorderYellow }
        }
    },
    toggledTriggered: {
        baseGradient: {
            enabled: true,
            type: "Linear",
            stop0: { percent: 0, color: Colors_1.SwitchYellowDark },
            stop1: { percent: 1, color: Colors_1.SwitchYellowBright }
        },
        borderGradient: {
            type: "Linear",
            start: new vec2(-0.8, 1),
            end: new vec2(0.8, -1),
            stop0: { percent: 0, color: Colors_1.SwitchKnobBorderYellow },
            stop1: { percent: 0.55, color: Colors_1.SwitchKnobBorderYellowMedium },
            stop2: { percent: 1, color: Colors_1.SwitchKnobBorderYellowBright }
        }
    }
};
/**
 * Represents a Switch component that extends the Slider functionality.
 *
 * @extends VisualElement
 * @implements Toggleable
 */
let Switch = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Slider_1.Slider;
    var Switch = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._defaultValue = this._defaultValue;
            // Hidden inputs
            this.segmented = true;
            this.snapToTriggerPosition = true;
            this.numberOfSegments = 2;
            this._isExplicit = true;
        }
        __initialize() {
            super.__initialize();
            this._defaultValue = this._defaultValue;
            // Hidden inputs
            this.segmented = true;
            this.snapToTriggerPosition = true;
            this.numberOfSegments = 2;
            this._isExplicit = true;
        }
        get isToggle() {
            return true;
        }
        /**
         * Gets the current state of the switch.
         *
         * @returns {boolean} - Returns `true` if the switch's current state is not set to 0, otherwise `false`.
         */
        get isOn() {
            return this._currentValue !== 0;
        }
        /**
         * Sets the state of the switch to either "on" or "off".
         *
         * @param on - A boolean value indicating whether the switch should be turned on (`true`) or off (`false`).
         */
        set isOn(on) {
            if (on === undefined) {
                return;
            }
            this._isExplicit = false;
            this.setOn(on);
        }
        /**
         * Toggles the switch to the on/off state.
         *
         * This method sets the current state of the switch to 1 or 0 and updates the knob position accordingly.
         * @param on - A boolean value indicating the desired toggle state.
         */
        toggle(on) {
            this._isExplicit = true;
            this.setOn(on);
        }
        /**
         * Initializes the switch component.
         *
         * This method sets the default state
         */
        initialize() {
            super.initialize();
            this._interactableStateMachine.toggle = this.currentValue > 0;
        }
        onTriggerUpHandler(event) {
            this._isExplicit = true;
            super.onTriggerUpHandler(event);
        }
        onInteractableDragEnd(dragEvent) {
            this._isExplicit = true;
            super.onInteractableDragEnd(dragEvent);
        }
        onInteractableDragUpdate(dragEvent) {
            super.onInteractableDragUpdate(dragEvent);
            const knobDraggedOn = this.knobValue > 0;
            if (this._interactableStateMachine.toggle !== knobDraggedOn)
                this._interactableStateMachine.toggle = knobDraggedOn;
        }
        onTriggerRespond() {
            if (!this._isDragged) {
                if (this.segmented && this.snapToTriggerPosition) {
                    const newValue = this.currentValue === 0 ? 1 : 0;
                    this.updateCurrentValue(newValue, true);
                }
            }
        }
        setOn(on) {
            if ((on && this._currentValue === 1) || (!on && this._currentValue === 0)) {
                return;
            }
            this.updateCurrentValue(on ? 1 : 0, true);
        }
        updateCurrentValue(value, shouldAnimate) {
            if (this.initialized) {
                this._interactableStateMachine.toggle = value > 0;
            }
            super.updateCurrentValue(value, shouldAnimate);
        }
        get isExplicit() {
            return this._isExplicit;
        }
        createDefaultVisual() {
            if (!this._visual) {
                const defaultVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: this.sceneObject,
                    style: trackStyle
                });
                defaultVisual.cornerRadius = this.size.y * 0.5;
                this._visual = defaultVisual;
            }
            if (!this._knobVisual) {
                const knobObject = global.scene.createSceneObject("SliderKnob");
                this.managedSceneObjects.add(knobObject);
                const defaultKnobVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: knobObject,
                    style: knobStyle
                });
                defaultKnobVisual.cornerRadius = (this.size.y - defaultKnobVisual.borderSize * 2) * 0.5;
                this._knobVisual = defaultKnobVisual;
                if (!this.customKnobSize) {
                    this._knobSize = new vec2(this.size.y, this.size.y);
                }
                knobObject.setParent(this.sceneObject);
            }
            if (!this._trackFillVisual && this.hasTrackVisual) {
                const trackFillObject = global.scene.createSceneObject("SliderTrackFill");
                this.managedSceneObjects.add(trackFillObject);
                const defaultTrackFillVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: trackFillObject,
                    style: trackFillStyle
                });
                this._trackFillVisual = defaultTrackFillVisual;
                trackFillObject.setParent(this.sceneObject);
            }
        }
    };
    __setFunctionName(_classThis, "Switch");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Switch = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Switch = _classThis;
})();
exports.Switch = Switch;
//# sourceMappingURL=Switch.js.map