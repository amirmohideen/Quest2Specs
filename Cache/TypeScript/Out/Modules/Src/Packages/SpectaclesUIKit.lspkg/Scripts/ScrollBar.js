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
exports.ScrollBar = void 0;
var __selfType = requireType("./ScrollBar");
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
const color_1 = require("SpectaclesInteractionKit.lspkg/Utils/color");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const mathUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/mathUtils");
const Slider_1 = require("./Components/Slider/Slider");
const UIKitUtilities_1 = require("./Utility/UIKitUtilities");
const RoundedRectangleVisual_1 = require("./Visuals/RoundedRectangle/RoundedRectangleVisual");
var ScrollOrientation;
(function (ScrollOrientation) {
    ScrollOrientation["Horizontal"] = "Horizontal";
    ScrollOrientation["Vertical"] = "Vertical";
})(ScrollOrientation || (ScrollOrientation = {}));
const darkGray = new vec4(0.22, 0.22, 0.22, 1);
const mediumGray = new vec4(0.31, 0.31, 0.31, 1);
const lightGray = new vec4(0.4, 0.4, 0.4, 1);
const bgDarkGray = new vec4(0.15, 0.15, 0.15, 1);
const bgMediumGray = new vec4(0.2, 0.2, 0.2, 1);
const bgLightGray = new vec4(0.25, 0.25, 0.25, 1);
const SCROLL_BAR_BACKGROUND_GRADIENT = {
    enabled: true,
    type: "Rectangle",
    start: new vec2(0, -1),
    end: new vec2(0, 1),
    stop0: { enabled: true, percent: -1, color: bgMediumGray },
    stop1: { enabled: true, percent: 2, color: bgDarkGray }
};
const SCROLL_BAR_BACKGROUND_HOVERED_GRADIENT = {
    enabled: true,
    type: "Rectangle",
    start: new vec2(0, -1),
    end: new vec2(0, 1),
    stop0: { enabled: true, percent: -1, color: bgLightGray },
    stop1: { enabled: true, percent: 2, color: bgMediumGray }
};
const SCROLL_BAR_BACKGROUND_TRIGGERED_GRADIENT = SCROLL_BAR_BACKGROUND_HOVERED_GRADIENT;
const SCROLL_BAR_BACKGROUND_INACTIVE_GRADIENT = {
    enabled: true,
    type: "Rectangle",
    start: new vec2(0, -1),
    end: new vec2(0, 1),
    stop0: { enabled: true, percent: 0, color: (0, color_1.withAlpha)(bgMediumGray, 0) },
    stop1: { enabled: true, percent: 1, color: (0, color_1.withAlpha)(bgDarkGray, 0) }
};
const SCROLL_BAR_KNOB_GRADIENT = {
    enabled: true,
    type: "Rectangle",
    stop0: { enabled: true, percent: -1, color: darkGray },
    stop1: { enabled: true, percent: -0.25, color: darkGray },
    stop2: { enabled: true, percent: 2, color: mediumGray }
};
const SCROLL_BAR_KNOB_HOVERED_GRADIENT = {
    enabled: true,
    type: "Rectangle",
    stop0: { enabled: true, percent: -1, color: mediumGray },
    stop1: { enabled: true, percent: -0.25, color: mediumGray },
    stop2: { enabled: true, percent: 2, color: lightGray }
};
const SCROLL_BAR_KNOB_TRIGGERED_GRADIENT = SCROLL_BAR_KNOB_HOVERED_GRADIENT;
const SCROLL_BAR_KNOB_INACTIVE_GRADIENT = {
    enabled: true,
    type: "Rectangle",
    stop0: { enabled: true, percent: -1, color: (0, color_1.withAlpha)(darkGray, 0) },
    stop1: { enabled: true, percent: -0.25, color: (0, color_1.withAlpha)(darkGray, 0) },
    stop2: { enabled: true, percent: 2, color: (0, color_1.withAlpha)(mediumGray, 0) }
};
let ScrollBar = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ScrollBar = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._renderOrder = this._renderOrder;
            this.size = this.size;
            this.orientation = this.orientation;
            this.scrollWindow = this.scrollWindow;
            this._playAudio = this._playAudio;
            this.windowSize = 0;
            this.contentLength = 0;
            this._inactive = false;
            this.initialized = false;
            this.isDraggingSlider = false;
            this._currentValue = 0;
            this.unsubscribes = [];
            this.onScrolledEvent = new Event_1.default();
            /**
             * Event that is invoked when the scrollbar value changes.
             * Provides the current normalized value (0-1) of the scrollbar position.
             */
            this.onScrolled = this.onScrolledEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this._renderOrder = this._renderOrder;
            this.size = this.size;
            this.orientation = this.orientation;
            this.scrollWindow = this.scrollWindow;
            this._playAudio = this._playAudio;
            this.windowSize = 0;
            this.contentLength = 0;
            this._inactive = false;
            this.initialized = false;
            this.isDraggingSlider = false;
            this._currentValue = 0;
            this.unsubscribes = [];
            this.onScrolledEvent = new Event_1.default();
            /**
             * Event that is invoked when the scrollbar value changes.
             * Provides the current normalized value (0-1) of the scrollbar position.
             */
            this.onScrolled = this.onScrolledEvent.publicApi();
        }
        /**
         * Gets whether audio should be played for scrollbar interactions.
         *
         * @returns {boolean} `true` if audio should be played; otherwise, `false`.
         */
        get playAudio() {
            return this._playAudio;
        }
        /**
         * Sets whether audio should be played for scrollbar interactions.
         *
         * @param playAudio - A boolean indicating whether audio should be played (`true`) or not (`false`).
         */
        set playAudio(playAudio) {
            if (playAudio === undefined) {
                return;
            }
            this._playAudio = playAudio;
            if (this.initialized) {
                this.slider.playAudio = playAudio;
            }
        }
        /**
         * Gets the render order of the scrollbar.
         *
         * @returns {number} The render order of the scrollbar.
         */
        get renderOrder() {
            return this._renderOrder;
        }
        /**
         * Sets the render order of the scrollbar.
         *
         * @param order - The render order of the scrollbar.
         */
        set renderOrder(order) {
            if (order === undefined) {
                return;
            }
            this._renderOrder = order;
            if (this.initialized) {
                this.slider.renderOrder = order;
            }
        }
        /**
         * Gets the track visual of the scrollbar.
         *
         * @returns {RoundedRectangleVisual | undefined} The track visual of the scrollbar.
         */
        get trackVisual() {
            return this._trackVisual;
        }
        /**
         * Sets the track visual of the scrollbar.
         *
         * @param visual - The new track visual of the scrollbar.
         */
        set trackVisual(visual) {
            if (visual === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._trackVisual, visual)) {
                return;
            }
            this._trackVisual = visual;
            if (this.initialized) {
                this.slider.visual = this._trackVisual;
            }
        }
        /**
         * Gets the knob visual of the scrollbar.
         *
         * @returns {RoundedRectangleVisual | undefined} The knob visual of the scrollbar.
         */
        get knobVisual() {
            return this._knobVisual;
        }
        /**
         * Sets the knob visual of the scrollbar.
         *
         * @param visual - The new knob visual of the scrollbar.
         */
        set knobVisual(visual) {
            if (visual === undefined) {
                return;
            }
            if ((0, UIKitUtilities_1.isEqual)(this._knobVisual, visual)) {
                return;
            }
            this._knobVisual = visual;
            if (this.initialized) {
                this.slider.knobVisual = this._knobVisual;
            }
        }
        /**
         * Gets whether the scrollbar is inactive.
         *
         * @returns {boolean} `true` if the scrollbar is inactive; otherwise, `false`.
         */
        get inactive() {
            return this._inactive;
        }
        /**
         * Sets whether the scrollbar is inactive.
         *
         * @param inactive - A boolean indicating whether the scrollbar should be inactive (`true`) or not (`false`).
         */
        set inactive(inactive) {
            if (inactive === undefined) {
                return;
            }
            this._inactive = inactive;
            if (this.initialized) {
                this.updateSliderVisibility();
            }
        }
        /**
         * Gets whether the scrollbar is scrollable.
         *
         * @returns {boolean} `true` if the scrollbar is scrollable; otherwise, `false`.
         */
        get isScrollable() {
            return (((this.orientation === ScrollOrientation.Horizontal && this.scrollWindow.horizontal) ||
                (this.orientation === ScrollOrientation.Vertical && this.scrollWindow.vertical)) &&
                this.contentLength > this.windowSize);
        }
        /**
         * Gets the current value of the scrollbar.
         *
         * @returns {number} The current value of the scrollbar.
         */
        get currentValue() {
            return this._currentValue;
        }
        /**
         * Lifecycle method called when the component awakens.
         * Initializes the scrollbar by creating the slider component, setting up visuals,
         * and configuring event handlers.
         */
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                const sliderObject = global.scene.createSceneObject("ScrollBarSlider");
                sliderObject.setParent(this.sceneObject);
                this.slider = sliderObject.createComponent(Slider_1.Slider.getTypeName());
                this.setupDefaultVisuals();
                this.slider.visual = this._trackVisual;
                this.slider.knobVisual = this._knobVisual;
                this.slider.hasTrackVisual = false;
                this.slider.playAudio = this._playAudio;
                if (this.orientation === ScrollOrientation.Horizontal) {
                    if (!this.scrollWindow.horizontal) {
                        throw new Error("Error setting up scrollbar: ScrollWindow orientation is not compatible with horizontal scrollbar");
                    }
                    else {
                        this.windowSize = this.scrollWindow.windowSize.x;
                    }
                }
                else if (this.orientation === ScrollOrientation.Vertical) {
                    if (!this.scrollWindow.vertical) {
                        throw new Error("Error setting up scrollbar: ScrollWindow orientation is not compatible with vertical scrollbar");
                    }
                    else {
                        this.windowSize = this.scrollWindow.windowSize.y;
                    }
                }
                this.updateContentLength();
                this.slider.onInitialized.add(() => {
                    this.initialized = true;
                    this.slider.size = new vec3(this.size.x, this.size.y, 1);
                    this.slider.renderOrder = this._renderOrder;
                    if (this.unsubscribes.length === 0) {
                        this.setupScrollWindowEventHandlers();
                        this.setupSliderEventHandlers();
                    }
                    this.updateSliderKnobPosition();
                    this.updateSliderKnobSize();
                    this.updateSliderVisibility();
                });
                this.createEvent("OnEnableEvent").bind(() => {
                    if (this.unsubscribes.length === 0) {
                        this.setupScrollWindowEventHandlers();
                        this.setupSliderEventHandlers();
                    }
                    this.slider.enabled = true;
                });
                this.createEvent("OnDisableEvent").bind(() => {
                    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
                    this.unsubscribes = [];
                    this.slider.enabled = false;
                });
                this.createEvent("OnDestroyEvent").bind(() => {
                    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
                    this.unsubscribes = [];
                    this.slider.sceneObject.destroy();
                });
                this.slider.createEvent("OnDestroyEvent").bind(() => {
                    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
                    this.unsubscribes = [];
                });
            });
        }
        setupDefaultVisuals() {
            if (this._trackVisual === undefined) {
                const trackParameters = {
                    default: {
                        baseType: "Gradient",
                        hasBorder: false,
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_BACKGROUND_GRADIENT)
                    },
                    hovered: {
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_BACKGROUND_HOVERED_GRADIENT)
                    },
                    triggered: {
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_BACKGROUND_TRIGGERED_GRADIENT)
                    },
                    inactive: {
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_BACKGROUND_INACTIVE_GRADIENT)
                    }
                };
                this._trackVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: this.slider.sceneObject,
                    style: trackParameters,
                    transparent: true
                });
                this._trackVisual.renderMeshVisual.mainPass.blendMode = BlendMode.PremultipliedAlphaAuto;
                this._trackVisual.renderMeshVisual.mainPass.colorMask = new vec4b(true, true, true, true);
                this._trackVisual.shouldColorChange = true;
                this._trackVisual.cornerRadius = this.size.y * 0.5;
                this._trackVisual.initialize();
            }
            if (this._knobVisual === undefined) {
                const knobParameters = {
                    default: {
                        baseType: "Gradient",
                        hasBorder: false,
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_KNOB_GRADIENT)
                    },
                    hovered: {
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_KNOB_HOVERED_GRADIENT)
                    },
                    triggered: {
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_KNOB_TRIGGERED_GRADIENT)
                    },
                    inactive: {
                        baseGradient: (0, UIKitUtilities_1.gradientParameterClone)(SCROLL_BAR_KNOB_INACTIVE_GRADIENT)
                    }
                };
                const knobObject = global.scene.createSceneObject("ScrollBarKnob");
                knobObject.setParent(this.slider.sceneObject);
                this._knobVisual = new RoundedRectangleVisual_1.RoundedRectangleVisual({
                    sceneObject: knobObject,
                    style: knobParameters,
                    transparent: true
                });
                this._knobVisual.renderMeshVisual.mainPass.blendMode = BlendMode.PremultipliedAlphaAuto;
                this._knobVisual.renderMeshVisual.mainPass.colorMask = new vec4b(true, true, true, true);
                this._knobVisual.shouldColorChange = true;
                this._knobVisual.initialize();
            }
        }
        setupScrollWindowEventHandlers() {
            this.unsubscribes.push(this.scrollWindow.onScrollDimensionsUpdated.add(() => {
                this.updateContentLength();
                this.updateSliderKnobSize();
                this.updateSliderVisibility();
            }));
            this.unsubscribes.push(this.scrollWindow.onScrollPositionUpdated.add(() => {
                if (!this.isDraggingSlider) {
                    this.updateSliderKnobPosition();
                }
            }));
        }
        setupSliderEventHandlers() {
            this.unsubscribes.push(this.slider.interactable.onTriggerStart.add(() => {
                this.isDraggingSlider = true;
                this.scrollWindow.isControlledExternally = true;
            }));
            this.unsubscribes.push(this.slider.onFinished.add(() => {
                this.isDraggingSlider = false;
                this.scrollWindow.isControlledExternally = false;
            }));
            this.unsubscribes.push(this.slider.interactable.onTriggerCanceled.add(() => {
                this.isDraggingSlider = false;
                this.scrollWindow.scrollSnapping = false;
            }));
            this.unsubscribes.push(this.slider.onValueChange.add((value) => {
                if (this.isDraggingSlider) {
                    if (this.scrollWindow) {
                        if (this.orientation === ScrollOrientation.Horizontal) {
                            this.scrollWindow.scrollPositionNormalized = new vec2(value * 2 - 1, this.scrollWindow.scrollPositionNormalized.y);
                        }
                        else if (this.orientation === ScrollOrientation.Vertical) {
                            this.scrollWindow.scrollPositionNormalized = new vec2(this.scrollWindow.scrollPositionNormalized.x, value * 2 - 1);
                        }
                    }
                    if (this._currentValue !== value) {
                        this._currentValue = value;
                        this.onScrolledEvent.invoke(this._currentValue);
                    }
                }
            }));
        }
        updateContentLength() {
            if (this.scrollWindow) {
                const scrollDimensions = this.scrollWindow.scrollDimensions;
                if (this.orientation === ScrollOrientation.Horizontal) {
                    if (scrollDimensions.x === -1) {
                        throw new Error("Error setting up scrollbar: ScrollWindow horizontal dimension is not compatible with horizontal scrollbar");
                    }
                    else {
                        this.contentLength = scrollDimensions.x;
                    }
                }
                else if (this.orientation === ScrollOrientation.Vertical) {
                    if (scrollDimensions.y === -1) {
                        throw new Error("Error setting up scrollbar: ScrollWindow vertical dimension is not compatible with vertical scrollbar");
                    }
                    else {
                        this.contentLength = scrollDimensions.y;
                    }
                }
            }
        }
        updateSliderKnobPosition() {
            if (this.slider) {
                let scrollPosition = 0;
                if (this.orientation === ScrollOrientation.Horizontal) {
                    scrollPosition = this.scrollWindow.scrollPositionNormalized.x;
                }
                else if (this.orientation === ScrollOrientation.Vertical) {
                    scrollPosition = this.scrollWindow.scrollPositionNormalized.y;
                }
                const newCurrentValue = (0, mathUtils_1.clamp)(scrollPosition / 2 + 0.5, 0, 1);
                if (this._currentValue !== newCurrentValue) {
                    this._currentValue = newCurrentValue;
                    this.slider.currentValue = this._currentValue;
                    this.onScrolledEvent.invoke(this._currentValue);
                }
            }
        }
        updateSliderKnobSize() {
            if (this.slider && this._knobVisual) {
                const width = this.slider.customKnobSize ? this.slider.knobSize.y : this.slider.size.y;
                let length = this.slider.size.x;
                if (this.contentLength > 0) {
                    length *= Math.min(this.windowSize / this.contentLength, 1);
                }
                this.slider.knobSize = new vec2(Math.max(length, width), width);
                this._knobVisual.cornerRadius = width * 0.5;
            }
        }
        updateSliderVisibility() {
            if (this.slider) {
                this.slider.inactive = this._inactive;
                this.slider.interactable.enabled = this.isScrollable;
            }
        }
    };
    __setFunctionName(_classThis, "ScrollBar");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScrollBar = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScrollBar = _classThis;
})();
exports.ScrollBar = ScrollBar;
//# sourceMappingURL=ScrollBar.js.map