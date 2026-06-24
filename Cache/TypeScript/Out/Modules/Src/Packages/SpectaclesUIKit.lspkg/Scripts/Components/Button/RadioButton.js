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
exports.RadioButton = void 0;
var __selfType = requireType("./RadioButton");
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
const RoundedRectangleVisual_1 = require("../../Visuals/RoundedRectangle/RoundedRectangleVisual");
const SecondaryGradients_1 = require("../../../Scripts/Themes/SnapOS-2.0/Gradients/SecondaryGradients");
const PrimaryGradients_1 = require("../../Themes/SnapOS-2.0/Gradients/PrimaryGradients");
const UIKitUtilities_1 = require("../../Utility/UIKitUtilities");
const BaseButton_1 = require("./BaseButton");
const DEFAULT_TOGGLED_VISUAL_DEPTH = 0.01;
const DEFAULT_VISUAL_PARAMETERS = {
    default: {
        baseType: "Gradient",
        baseGradient: SecondaryGradients_1.SecondaryGradients.defaultBackground,
        hasBorder: true,
        borderType: "Gradient",
        borderGradient: SecondaryGradients_1.SecondaryGradients.defaultBorder,
        shouldScale: false,
        shouldPosition: false,
        localScale: new vec3(1, 1, 1),
        localPosition: new vec3(0, 0, 0)
    },
    hovered: {
        baseGradient: SecondaryGradients_1.SecondaryGradients.hoverBackground,
        borderGradient: SecondaryGradients_1.SecondaryGradients.hoverBorder
    },
    toggledDefault: {
        baseGradient: PrimaryGradients_1.PrimaryGradients.defaultBackground,
        borderGradient: PrimaryGradients_1.PrimaryGradients.defaultBorder
    },
    toggledHovered: {
        baseGradient: PrimaryGradients_1.PrimaryGradients.hoverBackground,
        borderGradient: PrimaryGradients_1.PrimaryGradients.triggeredBorder
    }
};
const DEFAULT_TOGGLED_VISUAL_PARAMETERS = {
    default: {
        baseType: "Gradient",
        baseGradient: {
            enabled: true,
            type: "Linear",
            stop0: {
                enabled: false,
                percent: 0,
                color: vec4.zero()
            },
            stop1: {
                enabled: false,
                percent: 1,
                color: vec4.zero()
            }
        },
        hasBorder: false,
        shouldScale: false,
        shouldPosition: false,
        localScale: new vec3(1, 1, 1),
        localPosition: new vec3(0, 0, 0)
    },
    toggledDefault: {
        baseGradient: PrimaryGradients_1.PrimaryGradients.triggeredBackground,
        hasBorder: true,
        borderSize: 0.05,
        borderType: "Gradient",
        borderGradient: PrimaryGradients_1.PrimaryGradients.triggeredBorder
    },
    toggledHovered: {
        baseGradient: PrimaryGradients_1.PrimaryGradients.triggeredBackground,
        hasBorder: true,
        borderSize: 0.05,
        borderType: "Gradient",
        borderGradient: PrimaryGradients_1.PrimaryGradients.triggeredBorder
    },
    toggledTriggered: {
        baseGradient: PrimaryGradients_1.PrimaryGradients.triggeredBackground,
        hasBorder: true,
        borderSize: 0.05,
        borderType: "Gradient",
        borderGradient: PrimaryGradients_1.PrimaryGradients.triggeredBorder
    }
};
const TOGGLED_WIDTH_RATIO = 0.6666;
/**
 * A circular toggle-style button with an inner toggled visual (dot).
 *
 * The outer button size is controlled by `_width`; the inner dot size is
 * controlled by `_toggledWidth`. Both visuals are `RoundedRectangleVisual`s
 * with corner radii set to half of their widths, and the toggled visual
 * renders above the base via `renderOrder + 1`.
 */
let RadioButton = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseButton_1.BaseButton;
    var RadioButton = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._width = this._width;
            this._toggledWidth = this._width * TOGGLED_WIDTH_RATIO;
            this._size = new vec3(this._width, this._width, 1);
            this.toggledVisualEventHandlerUnsubscribes = [];
        }
        __initialize() {
            super.__initialize();
            this._width = this._width;
            this._toggledWidth = this._width * TOGGLED_WIDTH_RATIO;
            this._size = new vec3(this._width, this._width, 1);
            this.toggledVisualEventHandlerUnsubscribes = [];
        }
        /**
         * Gets the render order of the RadioButton.
         */
        get renderOrder() {
            return this._renderOrder;
        }
        /**
         * Sets the render order of the RadioButton and its toggled visual.
         *
         * The toggled visual is rendered above the base visual using `order + 1`.
         *
         * @param order - The base render order for the RadioButton.
         */
        set renderOrder(order) {
            if (order === undefined) {
                return;
            }
            super.renderOrder = order;
            if (this._initialized) {
                if (this._toggledVisual) {
                    this._toggledVisual.renderMeshVisual.renderOrder = order + 1;
                }
            }
        }
        /**
         * Gets the visual representation of the RadioButton's toggled visual.
         *
         * @returns {Visual} The visual object representing the toggled visual.
         */
        get toggledVisual() {
            return this._toggledVisual;
        }
        /**
         * Sets the visual used when the RadioButton is in the toggled state.
         *
         * Replaces any existing toggled visual, applies sizing, and syncs state.
         *
         * @param value - The new toggled visual.
         */
        set toggledVisual(value) {
            if (value === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._toggledVisual, value)) {
                return;
            }
            this.destroyToggledVisual();
            this._toggledVisual = value;
            if (this._initialized) {
                this.configureToggledVisual();
                this._toggledVisual.size = new vec3(this._toggledWidth, this._toggledWidth, 1);
                this._toggledVisual.cornerRadius = this._toggledWidth * 0.5;
                this._toggledVisual.setState(this.stateName);
            }
        }
        /**
         * Gets the width (diameter) of the RadioButton.
         *
         * @returns {number} The width of the RadioButton.
         */
        get width() {
            return this._width;
        }
        /**
         * Sets the width (diameter) of the RadioButton.
         * Updates the base visual size and corner radius when initialized.
         *
         * @param width - The new width of the RadioButton.
         */
        set width(width) {
            if (width === undefined) {
                return;
            }
            this._width = width;
            if (this._initialized) {
                this.size = new vec3(width, width, 1);
                this.visual.cornerRadius = width * 0.5;
            }
            this.toggledWidth = width * TOGGLED_WIDTH_RATIO;
        }
        /**
         * Sets the current visual state of the RadioButton and its toggled visual.
         *
         * @param stateName - The state to apply.
         */
        setState(stateName) {
            super.setState(stateName);
            if (this._initialized) {
                this._toggledVisual.setState(stateName);
            }
        }
        /**
         * Initializes the RadioButton, creating and configuring visuals as needed.
         * Also sets the initial enabled state for the toggled visual.
         */
        initialize() {
            super.initialize();
            this._size = new vec3(this._width, this._width, 1);
            if (this._toggledVisual) {
                this._toggledVisual.renderMeshVisual.renderOrder = this._renderOrder + 1;
            }
            this.configureToggledVisual();
        }
        createDefaultVisual() {
            if (!this._visual) {
                const defaultVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: this.sceneObject,
                    style: DEFAULT_VISUAL_PARAMETERS
                });
                defaultVisual.cornerRadius = this._width * 0.5;
                this._visual = defaultVisual;
            }
            if (!this._toggledVisual) {
                const toggledVisualObject = global.scene.createSceneObject("ToggledVisual");
                this.managedSceneObjects.add(toggledVisualObject);
                toggledVisualObject.setParent(this.sceneObject);
                toggledVisualObject.getTransform().setLocalPosition(new vec3(0, 0, DEFAULT_TOGGLED_VISUAL_DEPTH));
                const defaultToggledVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: toggledVisualObject,
                    style: DEFAULT_TOGGLED_VISUAL_PARAMETERS,
                    transparent: true
                });
                defaultToggledVisual.cornerRadius = this._toggledWidth * 0.5;
                defaultToggledVisual.shouldColorChange = true;
                this._toggledVisual = defaultToggledVisual;
            }
        }
        configureVisual() {
            super.configureVisual();
            if (this._visual) {
                this.visualEventHandlerUnsubscribes.push(this._visual.onDestroyed.add(() => {
                    this._toggledVisual = null;
                }));
                this._visual.size = new vec3(this._width, this._width, 1);
            }
        }
        configureToggledVisual() {
            if (this._toggledVisual) {
                this.toggledVisualEventHandlerUnsubscribes.push(this._toggledVisual.onDestroyed.add(() => {
                    this._toggledVisual = null;
                }));
                this._toggledVisual.size = new vec3(this._toggledWidth, this._toggledWidth, 1);
            }
        }
        destroyToggledVisual() {
            this.toggledVisualEventHandlerUnsubscribes.forEach((unsubscribe) => unsubscribe());
            this.toggledVisualEventHandlerUnsubscribes = [];
            if (this._toggledVisual) {
                this._toggledVisual.destroy();
                this._toggledVisual = null;
            }
        }
        enableVisuals() {
            super.enableVisuals();
            if (this._initialized) {
                if (!isNull(this._toggledVisual) && this._toggledVisual) {
                    this._toggledVisual.enable();
                }
            }
        }
        disableVisuals() {
            super.disableVisuals();
            if (this._initialized) {
                if (!isNull(this._toggledVisual) && this._toggledVisual) {
                    this._toggledVisual.disable();
                }
            }
        }
        release() {
            if (!isNull(this._toggledVisual) && this._toggledVisual) {
                this._toggledVisual.destroy();
            }
            this._toggledVisual = null;
            super.release();
        }
        get isToggle() {
            return true;
        }
        /**
         * Gets the width (diameter) of the toggled visual.
         *
         * @returns {number} The width of the toggled visual.
         */
        get toggledWidth() {
            return this._toggledWidth;
        }
        /**
         * Sets the width (diameter) of the toggled visual.
         * If the new width is different from the current width, it updates the toggled visual.
         *
         * @param width - The new width of the toggled visual.
         */
        set toggledWidth(width) {
            if (width === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._toggledWidth, width)) {
                return;
            }
            this._toggledWidth = width;
            if (this._initialized) {
                this._toggledVisual.size = new vec3(width, width, 1);
                this._toggledVisual.cornerRadius = width * 0.5;
            }
        }
    };
    __setFunctionName(_classThis, "RadioButton");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RadioButton = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RadioButton = _classThis;
})();
exports.RadioButton = RadioButton;
//# sourceMappingURL=RadioButton.js.map