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
exports.Checkbox = void 0;
var __selfType = requireType("./Checkbox");
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
const RadioButton_1 = require("./RadioButton");
const DEFAULT_TOGGLED_VISUAL_DEPTH = 0.01;
const DEFAULT_CHECK_VISUAL_DEPTH = 0.02;
const CHECK_TEXTURES = {
    default: requireAsset("../../../Textures/check_default.png"),
    hovered: requireAsset("../../../Textures/check_hovered.png"),
    toggled: requireAsset("../../../Textures/check_toggledHovered.png")
};
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
const DEFAULT_CHECK_VISUAL_PARAMETERS = {
    default: {
        baseType: "Texture",
        baseTexture: CHECK_TEXTURES.default,
        hasBorder: false,
        shouldScale: false,
        shouldPosition: false,
        localScale: new vec3(1, 1, 1),
        localPosition: new vec3(0, 0, 0)
    },
    hovered: {
        baseTexture: CHECK_TEXTURES.hovered
    },
    toggledDefault: {
        baseTexture: CHECK_TEXTURES.default
    },
    toggledHovered: {
        baseTexture: CHECK_TEXTURES.toggled
    },
    toggledTriggered: {
        baseTexture: CHECK_TEXTURES.toggled
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
    }
};
const TOGGLED_WIDTH_RATIO = 0.8;
const CHECK_MARK_SIZE_RATIO = 0.7;
/**
 * Checkbox-style button derived from `RadioButton`.
 *
 * Composition:
 * - Base `RoundedRectangleVisual` (cornerRadius = 0.25 × size)
 * - "Toggled" `RoundedRectangleVisual` above the base
 * - Textured check visual (child of the toggled visual)
 *
 * Sizing:
 * - `_width` controls the base size (`width` setter updates it)
 * - `_toggledWidth` controls the toggled visual size
 * - `_checkSize` controls the check visual size (`checkWidth` mirrors it)
 *
 * Render order: base = `renderOrder`, toggled = `renderOrder + 1`, check = `renderOrder + 2`.
 */
let Checkbox = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RadioButton_1.RadioButton;
    var Checkbox = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._width = this._width;
            this._toggledWidth = this._width * TOGGLED_WIDTH_RATIO;
            this._checkMarkSize = this._width * CHECK_MARK_SIZE_RATIO;
            this.checkVisualEventHandlerUnsubscribes = [];
        }
        __initialize() {
            super.__initialize();
            this._width = this._width;
            this._toggledWidth = this._width * TOGGLED_WIDTH_RATIO;
            this._checkMarkSize = this._width * CHECK_MARK_SIZE_RATIO;
            this.checkVisualEventHandlerUnsubscribes = [];
        }
        /**
         * Gets the render order of the Checkbox.
         */
        get renderOrder() {
            return this._renderOrder;
        }
        /**
         * Sets the render order of the Checkbox and its toggled and check visuals.
         *
         * The toggled visual renders above the base (`order + 1`), and the check
         * visual renders above the toggled visual (`order + 2`).
         *
         * @param order - The base render order for the Checkbox.
         */
        set renderOrder(order) {
            if (order === undefined) {
                return;
            }
            super.renderOrder = order;
            if (this._initialized) {
                if (this._checkMarkVisual) {
                    this._checkMarkVisual.renderMeshVisual.renderOrder = order + 2;
                }
            }
        }
        /**
         * Gets the check visual of the Checkbox.
         *
         * @returns {Visual} The visual object representing the check visual.
         */
        get checkVisual() {
            return this._checkMarkVisual;
        }
        /**
         * Sets the check visual
         *
         * Replaces any existing check visual, applies sizing, and syncs state.
         *
         * @param value - The new check visual.
         */
        set checkVisual(value) {
            if (value === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._checkMarkVisual, value)) {
                return;
            }
            this.destroyCheckVisual();
            this._checkMarkVisual = value;
            if (this._initialized) {
                this.configureCheckVisual();
                this._checkMarkVisual.size = new vec3(this._checkMarkSize, this._checkMarkSize, 1);
                this._checkMarkVisual.cornerRadius = this._checkMarkSize * 0.25;
                this._checkMarkVisual.setState(this.stateName);
            }
        }
        /**
         * Gets the size of the Checkbox button.
         *
         * @returns {number} The width of the Checkbox.
         */
        get width() {
            return this._width;
        }
        /**
         * Sets the size of the Checkbox button.
         * Uses a corner radius of 0.25 × size for a less rounded base than a radio button.
         *
         * @param width - The new size of the Checkbox.
         */
        set width(width) {
            if (width === undefined) {
                return;
            }
            this._width = width;
            if (this._initialized) {
                this.size = new vec3(width, width, 1);
                this.visual.cornerRadius = width * 0.25;
            }
            this.toggledWidth = width * TOGGLED_WIDTH_RATIO;
            this.checkMarkWidth = width * CHECK_MARK_SIZE_RATIO;
        }
        /**
         * Sets the current visual state of the checkbox and its toggled visuals.
         *
         * @param stateName - The state to apply.
         */
        setState(stateName) {
            super.setState(stateName);
            if (this._initialized) {
                if (this.checkVisual) {
                    this.checkVisual.setState(stateName);
                }
            }
        }
        initialize() {
            super.initialize();
            if (this._checkMarkVisual) {
                this._checkMarkVisual.renderMeshVisual.renderOrder = this._renderOrder + 2;
            }
            this.configureCheckVisual();
        }
        createDefaultVisual() {
            if (!this._visual) {
                const defaultVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: this.sceneObject,
                    style: DEFAULT_VISUAL_PARAMETERS
                });
                defaultVisual.cornerRadius = this._width * 0.25;
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
                defaultToggledVisual.cornerRadius = this._toggledWidth * 0.25;
                this._toggledVisual = defaultToggledVisual;
            }
            if (!this._checkMarkVisual) {
                const checkVisualObject = global.scene.createSceneObject("CheckVisual");
                this.managedSceneObjects.add(checkVisualObject);
                checkVisualObject.setParent(this._toggledVisual.sceneObject);
                checkVisualObject.getTransform().setLocalPosition(new vec3(0, 0, DEFAULT_CHECK_VISUAL_DEPTH));
                const defaultCheckMarkVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: checkVisualObject,
                    style: DEFAULT_CHECK_VISUAL_PARAMETERS,
                    transparent: true
                });
                defaultCheckMarkVisual.cornerRadius = this._checkMarkSize * 0.25;
                this._checkMarkVisual = defaultCheckMarkVisual;
            }
        }
        configureCheckVisual() {
            if (this._checkMarkVisual) {
                this.checkVisualEventHandlerUnsubscribes.push(this._checkMarkVisual.onDestroyed.add(() => {
                    this._checkMarkVisual = null;
                }));
                this._checkMarkVisual.size = new vec3(this._checkMarkSize, this._checkMarkSize, 1);
            }
        }
        destroyCheckVisual() {
            this.checkVisualEventHandlerUnsubscribes.forEach((unsubscribe) => unsubscribe());
            this.checkVisualEventHandlerUnsubscribes = [];
            if (this._checkMarkVisual) {
                this._checkMarkVisual.destroy();
                this._checkMarkVisual = null;
            }
        }
        onEnabled() {
            super.onEnabled();
            if (this._initialized) {
                this._checkMarkVisual?.enable();
            }
        }
        onDisabled() {
            super.onDisabled();
            if (this._initialized) {
                this._checkMarkVisual?.disable();
            }
        }
        release() {
            this._checkMarkVisual?.destroy();
            this._checkMarkVisual = null;
            super.release();
        }
        /**
         * Gets the size of the toggled visual.
         *
         * @returns {number} The width of the toggled visual.
         */
        get toggledWidth() {
            return this._toggledWidth;
        }
        /**
         * Sets the size of the toggled visual.
         * Uses a corner radius of 0.25 × size to match the styling.
         *
         * @param width - The new size of the toggled visual.
         */
        set toggledWidth(width) {
            if (width === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._toggledWidth, width)) {
                return;
            }
            this._toggledWidth = width;
            if (this._initialized && this._toggledVisual) {
                this._toggledVisual.size = new vec3(width, width, 1);
                this._toggledVisual.cornerRadius = width * 0.25;
            }
        }
        /**
         * Gets the size of the check visual.
         *
         * @returns {number} The width of the check visual.
         */
        get checkMarkWidth() {
            return this._checkMarkSize;
        }
        /**
         * Sets the size of the check visual.
         * Uses a corner radius of 0.25 × size to match the check styling.
         *
         * @param width - The new width of the check visual.
         */
        set checkMarkWidth(width) {
            if (width === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._checkMarkSize, width)) {
                return;
            }
            this._checkMarkSize = width;
            if (this._initialized && this._checkMarkVisual) {
                this._checkMarkVisual.size = new vec3(width, width, 1);
                this._checkMarkVisual.cornerRadius = width * 0.25;
            }
        }
    };
    __setFunctionName(_classThis, "Checkbox");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Checkbox = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Checkbox = _classThis;
})();
exports.Checkbox = Checkbox;
//# sourceMappingURL=Checkbox.js.map