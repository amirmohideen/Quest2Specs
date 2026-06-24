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
exports.InteractorCursor = exports.CursorMode = void 0;
var __selfType = requireType("./InteractorCursor");
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
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const WorldCameraFinderProvider_1 = require("../../../Providers/CameraProvider/WorldCameraFinderProvider");
const CursorControllerProvider_1 = require("../../../Providers/CursorControllerProvider/CursorControllerProvider");
const Event_1 = require("../../../Utils/Event");
const NativeLogger_1 = require("../../../Utils/NativeLogger");
const validate_1 = require("../../../Utils/validate");
const InteractorRayVisual_1 = require("../InteractorRayVisual/InteractorRayVisual");
const CircleVisual_1 = require("./CircleVisual");
const CircleVisualV2_1 = require("./CircleVisualV2");
const CursorViewModel_1 = require("./CursorViewModel");
const CursorViewModelV2_1 = require("./CursorViewModelV2");
var CursorMode;
(function (CursorMode) {
    CursorMode["Auto"] = "Auto";
    CursorMode["Translate"] = "Translate";
    CursorMode["ScaleTopLeft"] = "ScaleTopLeft";
    CursorMode["ScaleTopRight"] = "ScaleTopRight";
    CursorMode["Disabled"] = "Disabled";
    CursorMode["Custom"] = "Custom";
})(CursorMode || (exports.CursorMode = CursorMode = {}));
const DEFAULT_IDLE_OUTLINE_OFFSET = 0.0;
const DEFAULT_HOVER_OUTLINE_OFFSET = 0.1;
const DEFAULT_IDLE_SCALE = 1.0;
const DEFAULT_SQUISH_SCALE = 0.6;
const DEFAULT_IDLE_OUTLINE_ALPHA = 1.0;
const DEFAULT_HOVER_OUTLINE_ALPHA = 0.5;
const TAG = "InteractorCursor";
/**
 * This class represents a cursor for interactors, providing visual feedback for different interaction states. It manages the cursor's appearance, including its circle visual and manipulation line, and handles state changes and events.
 */
let InteractorCursor = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractorCursor = _classThis = class extends _classSuper {
        constructor() {
            super();
            /**
             * Controls the "stickiness" of the cursor when hovering over interactable objects. When enabled, the cursor
             * maintains its position on the target object, even when the hand moves slightly, making interaction with small
             * targets easier. Only applies to hand-based interactions, not other input types like mouse. Disable for immediate
             * 1:1 cursor movement that follows the hand position exactly.
             */
            this.enableCursorHolding = this.enableCursorHolding;
            /**
             * Applies smoothing to cursor movement for hand-based interactions. When enabled, reduces jitter and makes cursor
             * motion appear more stable, improving precision when interacting with small targets. Only applies to hand-based
             * interactions.
             */
            this.enableFilter = this.enableFilter;
            /**
             * Reference to the component that this cursor will visualize. The cursor will update its position and appearance
             * based on the interactor's state.
             */
            this._interactor = this._interactor;
            /**
             * Enable debug rendering for this cursor (propagated to the internal view model)
             */
            this.drawDebug = this.drawDebug;
            this.log = new NativeLogger_1.default(TAG);
            this.circleVisualEnabled = true;
            this.cursorAlpha = 0.0;
            this._rayAlpha = 0.0;
            this._wasRayVisible = false;
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this.cursorController = CursorControllerProvider_1.CursorControllerProvider.getInstance();
            // Events
            this.onEnableChangedEvent = new Event_1.default();
            this.onRayVisibilityChangedEvent = new Event_1.default();
            this._useV2 = true;
            this.cameraProvider = WorldCameraFinderProvider_1.default.getInstance();
            this.cameraTransform = this.cameraProvider.getTransform();
            this.tempScaleVec = new vec3(1, 1, 1);
            // Cache for expensive property updates
            this.lastCursorPosition = new vec3(0, 0, 0);
            this.lastCursorScale = -1;
            this.lastOutlineAlpha = -1;
            this.lastOutlineOffset = -1;
            this.lastCircleSquish = -1;
            this.lastOverallOpacity = -1;
            /**
             * Called whenever the cursor changes enabled state (showing / hiding the cursor visual)
             */
            this.onEnableChanged = this.onEnableChangedEvent.publicApi();
            /**
             * Called whenever the ray visibility changes (becomes visible or invisible based on rayAlpha threshold).
             */
            this.onRayVisibilityChanged = this.onRayVisibilityChangedEvent.publicApi();
            this.onStateChange = (state) => {
                switch (state) {
                    case CursorViewModel_1.CursorState.Inactive:
                        // If the visual is already hidden, do not invoke the extra event.
                        if (this.circleVisual.isShown) {
                            this.onEnableChangedEvent.invoke(false);
                        }
                        this.circleVisual.isShown = false;
                        this.circleVisual.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET;
                        break;
                    case CursorViewModel_1.CursorState.Idle:
                        this.circleVisual.outlineAlpha = DEFAULT_IDLE_OUTLINE_ALPHA;
                        this.circleVisual.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET;
                        break;
                    case CursorViewModel_1.CursorState.Hovering:
                        this.circleVisual.outlineAlpha = DEFAULT_HOVER_OUTLINE_ALPHA;
                        this.circleVisual.outlineOffset = DEFAULT_HOVER_OUTLINE_OFFSET;
                        break;
                }
            };
            this.onCursorUpdate = (viewState) => {
                // If the script component has been disabled, do not show the cursor visual.
                const shouldShow = viewState.cursorEnabled && this.circleVisualEnabled;
                if (shouldShow !== this.circleVisual.isShown) {
                    this.onEnableChangedEvent.invoke(shouldShow);
                }
                this.circleVisual.isShown = shouldShow;
                this.circleVisual.multipleInteractorsActive = this.interactionManager.hasMultipleActiveTargetingInteractors();
                if (viewState.cursorEnabled) {
                    this.updateWorldCursor(viewState.cursorData);
                }
            };
            this.onCursorUpdateV2 = (viewStateV2) => {
                const shouldShow = viewStateV2.cursorEnabled && this.circleVisualEnabled;
                this.cursorAlpha = viewStateV2.cursorAlpha;
                this.rayAlpha = viewStateV2.rayAlpha;
                this.circleVisualV2.isTriggering = viewStateV2.isTriggering;
                const isHovering = this.interactor?.targetHitInfo !== null;
                const targetOutlineAlpha = isHovering ? DEFAULT_HOVER_OUTLINE_ALPHA : DEFAULT_IDLE_OUTLINE_ALPHA;
                const targetOutlineOffset = isHovering ? DEFAULT_HOVER_OUTLINE_OFFSET : DEFAULT_IDLE_OUTLINE_OFFSET;
                if (Math.abs(targetOutlineAlpha - this.lastOutlineAlpha) > InteractorCursor.ALPHA_EPSILON) {
                    this.circleVisualV2.outlineAlpha = targetOutlineAlpha;
                    this.lastOutlineAlpha = targetOutlineAlpha;
                }
                if (Math.abs(targetOutlineOffset - this.lastOutlineOffset) > InteractorCursor.OFFSET_EPSILON) {
                    this.circleVisualV2.outlineOffset = targetOutlineOffset;
                    this.lastOutlineOffset = targetOutlineOffset;
                }
                const interactionStrength = this.interactor?.interactionStrength ?? 0;
                const clampedStrength = Math.max(0, Math.min(1, interactionStrength));
                const squishScale = 1.0 - 0.45 * clampedStrength;
                if (Math.abs(squishScale - this.lastCircleSquish) > InteractorCursor.SQUISH_EPSILON) {
                    this.circleVisualV2.circleSquishScale = squishScale;
                    this.lastCircleSquish = squishScale;
                }
                this.circleVisualV2.multipleInteractorsActive = this.interactionManager.hasMultipleActiveTargetingInteractors();
                if (Math.abs(viewStateV2.cursorAlpha - this.lastOverallOpacity) > InteractorCursor.ALPHA_EPSILON) {
                    this.circleVisualV2.overallOpacity = viewStateV2.cursorAlpha;
                    this.lastOverallOpacity = viewStateV2.cursorAlpha;
                }
                if (shouldShow) {
                    if (viewStateV2.position.distanceSquared(this.lastCursorPosition) > InteractorCursor.POSITION_EPSILON_SQ) {
                        this.circleVisualV2.worldPosition = viewStateV2.position;
                        this.lastCursorPosition.x = viewStateV2.position.x;
                        this.lastCursorPosition.y = viewStateV2.position.y;
                        this.lastCursorPosition.z = viewStateV2.position.z;
                    }
                    if (Math.abs(viewStateV2.scale - this.lastCursorScale) > InteractorCursor.SCALE_EPSILON) {
                        this.tempScaleVec.x = viewStateV2.scale;
                        this.tempScaleVec.y = viewStateV2.scale;
                        this.tempScaleVec.z = viewStateV2.scale;
                        this.circleVisualV2.transform.setWorldScale(this.tempScaleVec);
                        this.lastCursorScale = viewStateV2.scale;
                    }
                }
            };
        }
        __initialize() {
            super.__initialize();
            /**
             * Controls the "stickiness" of the cursor when hovering over interactable objects. When enabled, the cursor
             * maintains its position on the target object, even when the hand moves slightly, making interaction with small
             * targets easier. Only applies to hand-based interactions, not other input types like mouse. Disable for immediate
             * 1:1 cursor movement that follows the hand position exactly.
             */
            this.enableCursorHolding = this.enableCursorHolding;
            /**
             * Applies smoothing to cursor movement for hand-based interactions. When enabled, reduces jitter and makes cursor
             * motion appear more stable, improving precision when interacting with small targets. Only applies to hand-based
             * interactions.
             */
            this.enableFilter = this.enableFilter;
            /**
             * Reference to the component that this cursor will visualize. The cursor will update its position and appearance
             * based on the interactor's state.
             */
            this._interactor = this._interactor;
            /**
             * Enable debug rendering for this cursor (propagated to the internal view model)
             */
            this.drawDebug = this.drawDebug;
            this.log = new NativeLogger_1.default(TAG);
            this.circleVisualEnabled = true;
            this.cursorAlpha = 0.0;
            this._rayAlpha = 0.0;
            this._wasRayVisible = false;
            this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
            this.cursorController = CursorControllerProvider_1.CursorControllerProvider.getInstance();
            // Events
            this.onEnableChangedEvent = new Event_1.default();
            this.onRayVisibilityChangedEvent = new Event_1.default();
            this._useV2 = true;
            this.cameraProvider = WorldCameraFinderProvider_1.default.getInstance();
            this.cameraTransform = this.cameraProvider.getTransform();
            this.tempScaleVec = new vec3(1, 1, 1);
            // Cache for expensive property updates
            this.lastCursorPosition = new vec3(0, 0, 0);
            this.lastCursorScale = -1;
            this.lastOutlineAlpha = -1;
            this.lastOutlineOffset = -1;
            this.lastCircleSquish = -1;
            this.lastOverallOpacity = -1;
            /**
             * Called whenever the cursor changes enabled state (showing / hiding the cursor visual)
             */
            this.onEnableChanged = this.onEnableChangedEvent.publicApi();
            /**
             * Called whenever the ray visibility changes (becomes visible or invisible based on rayAlpha threshold).
             */
            this.onRayVisibilityChanged = this.onRayVisibilityChangedEvent.publicApi();
            this.onStateChange = (state) => {
                switch (state) {
                    case CursorViewModel_1.CursorState.Inactive:
                        // If the visual is already hidden, do not invoke the extra event.
                        if (this.circleVisual.isShown) {
                            this.onEnableChangedEvent.invoke(false);
                        }
                        this.circleVisual.isShown = false;
                        this.circleVisual.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET;
                        break;
                    case CursorViewModel_1.CursorState.Idle:
                        this.circleVisual.outlineAlpha = DEFAULT_IDLE_OUTLINE_ALPHA;
                        this.circleVisual.outlineOffset = DEFAULT_IDLE_OUTLINE_OFFSET;
                        break;
                    case CursorViewModel_1.CursorState.Hovering:
                        this.circleVisual.outlineAlpha = DEFAULT_HOVER_OUTLINE_ALPHA;
                        this.circleVisual.outlineOffset = DEFAULT_HOVER_OUTLINE_OFFSET;
                        break;
                }
            };
            this.onCursorUpdate = (viewState) => {
                // If the script component has been disabled, do not show the cursor visual.
                const shouldShow = viewState.cursorEnabled && this.circleVisualEnabled;
                if (shouldShow !== this.circleVisual.isShown) {
                    this.onEnableChangedEvent.invoke(shouldShow);
                }
                this.circleVisual.isShown = shouldShow;
                this.circleVisual.multipleInteractorsActive = this.interactionManager.hasMultipleActiveTargetingInteractors();
                if (viewState.cursorEnabled) {
                    this.updateWorldCursor(viewState.cursorData);
                }
            };
            this.onCursorUpdateV2 = (viewStateV2) => {
                const shouldShow = viewStateV2.cursorEnabled && this.circleVisualEnabled;
                this.cursorAlpha = viewStateV2.cursorAlpha;
                this.rayAlpha = viewStateV2.rayAlpha;
                this.circleVisualV2.isTriggering = viewStateV2.isTriggering;
                const isHovering = this.interactor?.targetHitInfo !== null;
                const targetOutlineAlpha = isHovering ? DEFAULT_HOVER_OUTLINE_ALPHA : DEFAULT_IDLE_OUTLINE_ALPHA;
                const targetOutlineOffset = isHovering ? DEFAULT_HOVER_OUTLINE_OFFSET : DEFAULT_IDLE_OUTLINE_OFFSET;
                if (Math.abs(targetOutlineAlpha - this.lastOutlineAlpha) > InteractorCursor.ALPHA_EPSILON) {
                    this.circleVisualV2.outlineAlpha = targetOutlineAlpha;
                    this.lastOutlineAlpha = targetOutlineAlpha;
                }
                if (Math.abs(targetOutlineOffset - this.lastOutlineOffset) > InteractorCursor.OFFSET_EPSILON) {
                    this.circleVisualV2.outlineOffset = targetOutlineOffset;
                    this.lastOutlineOffset = targetOutlineOffset;
                }
                const interactionStrength = this.interactor?.interactionStrength ?? 0;
                const clampedStrength = Math.max(0, Math.min(1, interactionStrength));
                const squishScale = 1.0 - 0.45 * clampedStrength;
                if (Math.abs(squishScale - this.lastCircleSquish) > InteractorCursor.SQUISH_EPSILON) {
                    this.circleVisualV2.circleSquishScale = squishScale;
                    this.lastCircleSquish = squishScale;
                }
                this.circleVisualV2.multipleInteractorsActive = this.interactionManager.hasMultipleActiveTargetingInteractors();
                if (Math.abs(viewStateV2.cursorAlpha - this.lastOverallOpacity) > InteractorCursor.ALPHA_EPSILON) {
                    this.circleVisualV2.overallOpacity = viewStateV2.cursorAlpha;
                    this.lastOverallOpacity = viewStateV2.cursorAlpha;
                }
                if (shouldShow) {
                    if (viewStateV2.position.distanceSquared(this.lastCursorPosition) > InteractorCursor.POSITION_EPSILON_SQ) {
                        this.circleVisualV2.worldPosition = viewStateV2.position;
                        this.lastCursorPosition.x = viewStateV2.position.x;
                        this.lastCursorPosition.y = viewStateV2.position.y;
                        this.lastCursorPosition.z = viewStateV2.position.z;
                    }
                    if (Math.abs(viewStateV2.scale - this.lastCursorScale) > InteractorCursor.SCALE_EPSILON) {
                        this.tempScaleVec.x = viewStateV2.scale;
                        this.tempScaleVec.y = viewStateV2.scale;
                        this.tempScaleVec.z = viewStateV2.scale;
                        this.circleVisualV2.transform.setWorldScale(this.tempScaleVec);
                        this.lastCursorScale = viewStateV2.scale;
                    }
                }
            };
        }
        /**
         * Gets the current ray alpha value.
         */
        get rayAlpha() {
            return this._rayAlpha;
        }
        /**
         * Sets the ray alpha value and triggers visibility change events when crossing the threshold.
         */
        set rayAlpha(value) {
            this._rayAlpha = value;
            const isNowVisible = value > InteractorRayVisual_1.RAY_VISIBILITY_THRESHOLD;
            if (isNowVisible !== this._wasRayVisible) {
                this._wasRayVisible = isNowVisible;
                this.onRayVisibilityChangedEvent.invoke(isNowVisible);
            }
        }
        /**
         * Shows the cursor visual.
         * @param duration The fade in duration.
         */
        show(duration = 0.2) {
            if (this._useV2 && this.viewModelV2) {
                this.viewModelV2.fadeIn(duration);
            }
            else {
                this.circleVisualEnabled = true;
            }
        }
        /**
         * Hides the cursor visual.
         * @param duration The fade out duration.
         */
        hide(duration = 0.2) {
            if (this._useV2 && this.viewModelV2) {
                this.viewModelV2.fadeOut(duration);
            }
            else {
                this.circleVisualEnabled = false;
            }
        }
        /**
         * Initializes the cursor with the useV2 setting from the CursorController.
         * @param _caller The CursorController that initialized this cursor.
         * @param _useV2 Whether to use the V2 cursor implementation.
         */
        init(_caller, _useV2) {
            this._useV2 = _useV2;
        }
        /**
         * @returns Whether the cursor is using the V2 cursor implementation.
         */
        get useV2() {
            return this._useV2;
        }
        onAwake() {
            this.defineScriptEvents();
            this.visual = this.createVisual();
            this._useV2 = CursorControllerProvider_1.CursorControllerProvider.getInstance().getDefaultUseV2();
            if (this._useV2) {
                this.circleVisualConfigV2 = {
                    meshSceneObject: this.visual,
                    textures: {
                        translate: requireAsset("./translate.png"),
                        scaleTL: requireAsset("./scale-tl.png"),
                        scaleTR: requireAsset("./scale-tr.png"),
                        disabled: requireAsset("./disabled.png")
                    }
                };
                this.circleVisualV2 = new CircleVisualV2_1.CircleVisual(this.circleVisualConfigV2);
            }
            else {
                this.circleVisualConfig = {
                    meshSceneObject: this.visual,
                    textures: {
                        translate: requireAsset("./translate.png"),
                        scaleTL: requireAsset("./scale-tl.png"),
                        scaleTR: requireAsset("./scale-tr.png"),
                        disabled: requireAsset("./disabled.png")
                    }
                };
                this.circleVisual = new CircleVisual_1.CircleVisual(this.circleVisualConfig);
            }
        }
        set interactor(interactor) {
            (0, validate_1.validate)(interactor, "InteractorCursor cannot have an undefined Interactor reference.");
            if (this.interactor !== null) {
                this.log.f(`InteractorCursor's Interactor has already been set to: ${this.interactor.sceneObject.name}`);
            }
            this._interactor = interactor;
        }
        get interactor() {
            return this._interactor ?? null;
        }
        /**
         * Programmatically instantiates the cursor visual
         * @returns The SceneObject for the cursor visual
         */
        createVisual() {
            const visual = global.scene.createSceneObject("CursorVisual");
            visual.setParent(this.getSceneObject());
            const visualMesh = visual.createComponent("Component.RenderMeshVisual");
            visualMesh.mesh = requireAsset("./Plane.mesh");
            visualMesh.mainMaterial = requireAsset("./Cursor.mat");
            return visual;
        }
        updateWorldCursor(data) {
            (0, validate_1.validate)(data.position);
            const cameraRotation = this.cameraTransform.getWorldRotation();
            this.circleVisual.worldRotation = cameraRotation;
            this.circleVisual.worldPosition = data.position;
            if (data.interactionStrength !== null) {
                this.circleVisual.circleSquishScale = MathUtils.lerp(DEFAULT_IDLE_SCALE, DEFAULT_SQUISH_SCALE, data.interactionStrength);
            }
            else {
                this.circleVisual.circleSquishScale = DEFAULT_IDLE_SCALE;
            }
            this.circleVisual.isTriggering = data.isTriggering;
            this.circleVisual.worldScale = vec3.one().uniformScale(data.scale);
        }
        /**
         * Get the world position of this interactor's cursor visual
         * @returns vec3 of the worldPosition
         */
        get cursorPosition() {
            if (this._useV2) {
                return this.viewModelV2.cursorPosition;
            }
            else {
                return this.viewModel.cursorPosition;
            }
        }
        /**
         * Set the world position of this interactor's cursor visual
         * @param position - vec3 of the worldPosition, null to revert to default behavior to follow raycast
         */
        set cursorPosition(position) {
            if (this._useV2) {
                this.viewModelV2.positionOverride = position;
            }
            else {
                this.viewModel.positionOverride = position;
            }
        }
        /**
         * Set the {@link CursorMode} of the cursor to change the visual
         * To return the cursor to its default {@link StateMachine} logic, use {@link CursorMode}.Auto
         * @param mode - The new mode of the cursor visual
         */
        set cursorMode(mode) {
            if (this._useV2) {
                this.circleVisualV2.cursorMode = mode;
            }
            else {
                this.circleVisual.cursorMode = mode;
            }
        }
        /**
         * Set the {@link Texture} of the cursor when using the {@link CursorMode}.Custom mode
         * Must explicitly set the {@link CursorMode} to {@link CursorMode}.Custom before the texture appears.
         * @param texture - The custom texture (typically cached via requireAsset(.../assetName.png) as Texture) to use
         */
        set customTexture(texture) {
            if (this._useV2) {
                this.circleVisualV2.customTexture = texture;
            }
            else {
                this.circleVisual.customTexture = texture;
            }
        }
        /**
         * Set the render order of the cursor visual.
         */
        set renderOrder(renderOrder) {
            if (this._useV2) {
                this.circleVisualV2.renderOrder = renderOrder;
            }
            else {
                this.circleVisual.renderOrder = renderOrder;
            }
        }
        /**
         * @returns the transform and material parameters of the cursor to allow other cursor implementations to re-use the same values.
         */
        get cursorParameters() {
            const visual = this._useV2 ? this.circleVisualV2 : this.circleVisual;
            const transform = visual.transform;
            const materialParameters = visual.materialParameters;
            return {
                worldPosition: transform.getWorldPosition(),
                worldRotation: transform.getWorldRotation().toEulerAngles(),
                worldScale: transform.getWorldScale(),
                isShown: visual.isShown,
                maxAlpha: materialParameters.maxAlpha,
                outlineAlpha: materialParameters.outlineAlpha,
                outlineOffset: materialParameters.outlineOffset,
                circleSquishScale: materialParameters.circleSquishScale,
                isTriggering: materialParameters.isTriggering,
                useTexture: materialParameters.useTexture,
                cursorTexture: materialParameters.cursorTexture,
                handType: materialParameters.handType,
                multipleInteractorsActive: materialParameters.multipleInteractorsActive
            };
        }
        defineScriptEvents() {
            this.createEvent("OnEnableEvent").bind(() => {
                this.onEnable();
            });
            this.createEvent("OnDisableEvent").bind(() => {
                this.onDisable();
            });
            this.createEvent("OnDestroyEvent").bind(() => {
                this.onDestroy();
            });
            this.createEvent("OnStartEvent").bind(() => {
                if (this.interactor === null) {
                    this.log.f(`InteractorCursor must have an Interactor set immediately after initializiation.`);
                }
                else {
                    if (this.cursorController.getCursorByInteractor(this.interactor) === null) {
                        this.cursorController.registerCursor(this);
                    }
                }
                const interactor = this.interactor;
                if (this._useV2) {
                    this.viewModelV2 = new CursorViewModelV2_1.CursorViewModel(interactor);
                    this.viewModelV2.setDebugDraw(this.drawDebug);
                    this.viewModelV2.onCursorUpdate.add(this.onCursorUpdateV2);
                }
                else {
                    this.viewModel = new CursorViewModel_1.CursorViewModel(this.enableCursorHolding, this.enableFilter, this.interactor);
                    this.viewModel.onStateChange.add(this.onStateChange);
                    this.viewModel.onCursorUpdate.add(this.onCursorUpdate);
                }
                let handType;
                switch (this.interactor.inputType) {
                    case Interactor_1.InteractorInputType.LeftHand:
                        handType = "left";
                        break;
                    case Interactor_1.InteractorInputType.RightHand:
                        handType = "right";
                        break;
                    default:
                        handType = null;
                }
                if (this._useV2) {
                    this.circleVisualV2.handType = handType;
                    const interactorLabel = `${interactor.inputType}`;
                    this.circleVisualConfigV2.eventLabel = `${interactorLabel}`;
                    this.circleVisualV2.onStart();
                    this.viewModelV2.enableUpdateEvent(true);
                    this.circleVisualV2.enableUpdateEvent(true);
                }
                else {
                    this.circleVisual.handType = handType;
                }
            });
        }
        onEnable() {
            this.show();
        }
        onDisable() {
            this.hide();
        }
        onDestroy() {
            if (this._useV2) {
                this.viewModelV2.destroy();
                this.circleVisualV2.destroy();
            }
            this.visual.destroy();
            this.viewModel.destroy();
        }
    };
    __setFunctionName(_classThis, "InteractorCursor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractorCursor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    // Thresholds for change detection
    _classThis.POSITION_EPSILON_SQ = 1e-4;
    _classThis.SCALE_EPSILON = 1e-2;
    _classThis.ALPHA_EPSILON = 1e-2;
    _classThis.OFFSET_EPSILON = 1e-2;
    _classThis.SQUISH_EPSILON = 1e-2;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractorCursor = _classThis;
})();
exports.InteractorCursor = InteractorCursor;
//# sourceMappingURL=InteractorCursor.js.map