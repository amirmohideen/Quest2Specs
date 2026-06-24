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
exports.ScrollWindow = void 0;
var __selfType = requireType("./ScrollWindow");
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
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const ReplayEvent_1 = require("SpectaclesInteractionKit.lspkg/Utils/ReplayEvent");
const SceneObjectUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/SceneObjectUtils");
const springAnimate_1 = require("SpectaclesInteractionKit.lspkg/Utils/springAnimate");
const Frustum_1 = require("../../Utility/Frustum");
const UIKitUtilities_1 = require("../../Utility/UIKitUtilities");
// a small number
const EPSILON = 0.0025;
// time window for additive gestures
const GESTURE_ACCUMULATION_TIME_MS = 300;
// minimum velocity to be considered for spring
const SIGNIFICANT_VELOCITY_THRESHOLD = 0.1;
// how much to decay velocity when accumulating
const VELOCITY_DECAY_FACTOR = 0.7;
// how fast to fling
const FLING_MULTIPLIER = 1;
// how fast to slow
const FRICTION_FACTOR = 0.95;
// how much overshoot is allowed max
const MAX_OVERSHOOT_FACTOR = 0.45;
// Minimum velocity before lerping is applied
const MINIMUM_SCROLLING_VELOCITY = 0.15;
// Velocity smoothing factor (0-1, lower = smoother but more lag)
const VELOCITY_SMOOTHING = 0.3;
// Number of velocity samples to track for better predictions
const VELOCITY_HISTORY_SIZE = 5;
// Weights for velocity history (most recent has highest weight)
const VELOCITY_HISTORY_WEIGHTS = [0.35, 0.25, 0.2, 0.12, 0.08]; // Sums to 1.0
const EDGE_BOUNCE_STRENGTH = 1.0;
/**
 * A low-level scrolling interaction solution for Spectacles.
 *
 * Children of this Component's SceneObject will be masked into windowSize and scrollable by scrollDimensions
 */
let ScrollWindow = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ScrollWindow = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._vertical = this._vertical;
            this._horizontal = this._horizontal;
            this._windowSize = this._windowSize;
            this._scrollDimensions = this._scrollDimensions;
            this._scrollPosition = this._scrollPosition;
            this._scrollSnapping = this._scrollSnapping;
            this._snapRegion = this._snapRegion;
            this._edgeFade = this._edgeFade;
            this.initialized = false;
            this._scrollingPaused = false;
            // world camera
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.cameraComponent = this.camera.getComponent();
            this.mesh = requireAsset("../../../Meshes/Unit Plane.mesh");
            this.material = requireAsset("../../../Materials/ScrollWindowFadeMask.mat");
            this.managedSceneObjects = [];
            this.managedComponents = [];
            /**
             * Frustum that handles helper viewport logic.
             * Use this to test if your content is visible within the scroll window.
             */
            this.frustum = new Frustum_1.Frustum();
            // scroll logic
            this.startPosition = vec3.zero();
            this.interactorOffset = vec3.zero();
            this.interactorUpdated = false;
            /**
             * The currently active interactor controlling this scroll window
             */
            this.activeInteractor = null;
            /**
             * is currently dragging
             */
            this.isDragging = false;
            this._isControlledExternally = false;
            this.velocity = vec3.zero();
            this.accumulatedVelocity = vec3.zero();
            this.lastPosition = this.startPosition;
            this.lastGestureEndTime = 0;
            /**
             * History of recent velocity samples for better fling predictions
             * Most recent samples are at the beginning of the array
             */
            this.velocityHistory = [];
            this.dragAmount = vec2.zero();
            this.onInitializedEvent = new ReplayEvent_1.default();
            this.scrollDragEvent = new Event_1.default();
            this.onScrollDimensionsUpdatedEvent = new Event_1.default();
            this.onScrollPositionUpdatedEvent = new Event_1.default();
            this.scrollTweenCancel = new animate_1.CancelSet();
            /**
             * Event that fires when the ScrollWindow has been initialized
             */
            this.onInitialized = this.onInitializedEvent.publicApi();
            /**
             * Event that fires during scroll drag interactions.
             * Use this event to execute logic when the user drags to scroll.
             */
            this.onScrollDrag = this.scrollDragEvent.publicApi();
            /**
             * Event that fires when scroll dimensions are updated.
             * Use this event to execute logic when the scrollable area size changes.
             */
            this.onScrollDimensionsUpdated = this.onScrollDimensionsUpdatedEvent.publicApi();
            /**
             * Event that fires when scroll position is updated.
             * Use this event to execute logic when the scroll position changes.
             * The position is in local space.
             */
            this.onScrollPositionUpdated = this.onScrollPositionUpdatedEvent.publicApi();
            /**
             * When true, disables the bounce-back effect at the edges of the scroll area.
             * When false (default), the scroll window will use a spring animation to bounce back when scrolled beyond bounds.
             */
            this._hardStopAtEnds = false;
            /**
             * When an Interactor hovers the ScrollWindow within this boundary (using normalized positions from -1 to 1),
             * all child ColliderComponents will be enabled.
             *
             * For example, if we provide a Rect with Rect.create(-1, 1, -0.8, 1),
             * hovering the bottom 10% of the ScrollWindow will not enable the child ColliderComponents.
             */
            this._enableChildCollidersBoundary = Rect.create(-1, 1, -1, 1);
            /**
             * turn on top secret debug visuals
             */
            this.debugRender = false;
            this.colliderShape = Shape.createBoxShape();
            this.spring = new springAnimate_1.SpringAnimate(150, 21, 1);
            this.isSubscribedToEvents = false;
            this.eventUnsubscribes = [];
            this.colliderToElementMap = new Map();
            /**
             * Tracks the committed snap target position for each axis.
             * Once a snap target is determined, we commit to it until the snap completes.
             */
            this.committedSnapTarget = { x: null, y: null };
            /**
             * Tracks the starting page index when a drag begins (for deadzone calculation)
             */
            this.startingPageIndex = { x: 0, y: 0 };
            /**
             * Initializes the ScrollWindow component.
             * This method runs once on creation and sets up all necessary components and event handlers.
             */
            this.initialize = () => {
                if (this.scrollSnapping) {
                    if (this.horizontal &&
                        this.scrollDimensions.x > this.windowSize.x &&
                        this.snapRegion.x > 0 &&
                        (this.scrollDimensions.x / this.snapRegion.x) % 1 !== 0) {
                        throw new Error("ScrollWindow: scrollDimensions.x must be divisible by snapRegion.x");
                    }
                    if (this.vertical &&
                        this.scrollDimensions.y > this.windowSize.y &&
                        this.snapRegion.y > 0 &&
                        (this.scrollDimensions.y / this.snapRegion.y) % 1 !== 0) {
                        throw new Error("ScrollWindow: scrollDimensions.y must be divisible by snapRegion.y");
                    }
                }
                if (this.initialized)
                    return;
                this.transform = this.sceneObject.getTransform();
                /**
                 * when you create this, does it overwrite existing local transform?
                 */
                this.screenTransform =
                    this.sceneObject.getComponent("ScreenTransform") || this.sceneObject.createComponent("ScreenTransform");
                /**
                 * like i gotta do this??
                 */
                this.screenTransform.position = this.transform.getLocalPosition();
                this.collider =
                    this.sceneObject.getComponent("ColliderComponent") || this.sceneObject.createComponent("ColliderComponent");
                this.managedComponents.push(this.collider);
                this.maskingComponent =
                    this.sceneObject.getComponent("MaskingComponent") || this.sceneObject.createComponent("MaskingComponent");
                this.managedComponents.push(this.maskingComponent);
                this._interactable =
                    this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName()) ||
                        this.sceneObject.createComponent(Interactable_1.Interactable.getTypeName());
                this.managedComponents.push(this._interactable);
                this._interactable.isScrollable = true;
                if (this._edgeFade) {
                    this.createEdgeFade();
                }
                this.setWindowSize(this._windowSize);
                this.collider.shape = this.colliderShape;
                this.collider.fitVisual = false;
                this.collider.debugDrawEnabled = this.debugRender;
                this._interactable.enableInstantDrag = true;
                const currentChildren = [...this.sceneObject.children];
                this.scroller = global.scene.createSceneObject("Scroller");
                this.managedSceneObjects.push(this.scroller);
                this.scroller.layer = this.sceneObject.layer;
                this.scroller.setParent(this.sceneObject);
                this.scrollerTransform = this.scroller.getTransform();
                // move children under this.scroller
                for (let i = 0; i < currentChildren.length; i++) {
                    const thisChild = currentChildren[i];
                    thisChild.setParent(this.scroller);
                }
                this.subscribeToEvents(this.enabled);
                // Initialize scroll position
                const initialPosition = new vec3(this.scrollPosition.x, this.scrollPosition.y, 0);
                if (this._scrollSnapping) {
                    if (this._horizontal &&
                        this.snapRegion.x > 0 &&
                        (this._scrollDimensions.x === -1 || this._scrollDimensions.x > this._windowSize.x)) {
                        const pageIndex = this.getPageIndexFromPosition("x", this._scrollPosition.x);
                        if (this._scrollDimensions.x !== -1) {
                            // Bounded: use nearEdge-relative position
                            initialPosition.x = this.rightEdge + pageIndex * this.snapRegion.x;
                            initialPosition.x = MathUtils.clamp(initialPosition.x, this.rightEdge, this.leftEdge);
                        }
                        else {
                            // Unbounded: use center-relative position
                            initialPosition.x = pageIndex * this.snapRegion.x;
                        }
                    }
                    if (this._vertical &&
                        this.snapRegion.y > 0 &&
                        (this._scrollDimensions.y === -1 || this._scrollDimensions.y > this._windowSize.y)) {
                        const pageIndex = this.getPageIndexFromPosition("y", this._scrollPosition.y);
                        if (this._scrollDimensions.y !== -1) {
                            // Bounded: use nearEdge-relative position
                            initialPosition.y = this.topEdge + pageIndex * this.snapRegion.y;
                            initialPosition.y = MathUtils.clamp(initialPosition.y, this.topEdge, this.bottomEdge);
                        }
                        else {
                            // Unbounded: use center-relative position
                            initialPosition.y = pageIndex * this.snapRegion.y;
                        }
                    }
                }
                // Set initial position if not at origin
                if (initialPosition.x !== 0 || initialPosition.y !== 0) {
                    this.updateScrollerPosition(initialPosition);
                }
                this.initialized = true;
                this.onInitializedEvent.invoke();
            };
            this.subscribeToEvents = (subscribe) => {
                const onHoverStart = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    const intersection = event.interactor.raycastPlaneIntersection(this._interactable);
                    if (intersection) {
                        const localIntersection = this.screenTransform.worldPointToLocalPoint(intersection);
                        if (localIntersection.x < this._enableChildCollidersBoundary.left ||
                            localIntersection.x > this._enableChildCollidersBoundary.right ||
                            localIntersection.y < this._enableChildCollidersBoundary.bottom ||
                            localIntersection.y > this._enableChildCollidersBoundary.top) {
                            event.stopPropagation();
                        }
                        else {
                            this.enableChildColliders(true);
                        }
                    }
                    else {
                        this.enableChildColliders(false);
                    }
                };
                const onHoverUpdate = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    const intersection = event.interactor.raycastPlaneIntersection(this._interactable);
                    if (intersection) {
                        const localIntersection = this.screenTransform.worldPointToLocalPoint(intersection);
                        if (localIntersection.x < this._enableChildCollidersBoundary.left ||
                            localIntersection.x > this._enableChildCollidersBoundary.right ||
                            localIntersection.y < this._enableChildCollidersBoundary.bottom ||
                            localIntersection.y > this._enableChildCollidersBoundary.top) {
                            event.stopPropagation();
                        }
                        else {
                            this.enableChildColliders(true);
                        }
                    }
                    else {
                        this.enableChildColliders(false);
                    }
                };
                const onHoverEnd = () => {
                    this.enableChildColliders(false);
                };
                const onTriggerStart = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    // If there's already an active interactor, cancel it first
                    if (this.activeInteractor && this.activeInteractor !== event.interactor) {
                        this.cancelCurrentInteractor();
                    }
                    // Set new active interactor
                    this.activeInteractor = event.interactor;
                    // Reset state for new interaction
                    this.resetDragState();
                };
                const onTriggerCanceled = (event) => {
                    // Only process cancellation from the active interactor
                    if (this.activeInteractor !== event.interactor) {
                        return;
                    }
                    this.cancelCurrentInteractor();
                    // Apply any accumulated velocity from previous gestures if we have momentum
                    if (this.accumulatedVelocity.length > 0) {
                        // Use existing accumulated velocity for continued scrolling
                        this.spring.velocity = this.accumulatedVelocity.uniformScale(FLING_MULTIPLIER);
                    }
                    else {
                        // No accumulated velocity, stop completely
                        this.spring.velocity = vec3.zero();
                    }
                };
                const onDragUpdate = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    if (this.activeInteractor?.inputType !== event.interactor.inputType) {
                        return;
                    }
                    if (event.interactor) {
                        const interactedElement = (0, UIKitUtilities_1.getElement)(event.interactor.currentInteractable.sceneObject);
                        if (interactedElement && interactedElement.isDraggable && !interactedElement.inactive) {
                            return;
                        }
                        const intersection = event.interactor.raycastPlaneIntersection(this._interactable);
                        if (intersection) {
                            this.scrollTweenCancel();
                            const interactorPos = this.transform.getInvertedWorldTransform().multiplyPoint(intersection);
                            if (!this.interactorUpdated) {
                                this.interactorOffset = interactorPos;
                                this.interactorUpdated = true;
                                this.isDragging = true;
                                this.committedSnapTarget.x = null;
                                this.committedSnapTarget.y = null;
                                this.cancelChildInteraction(event);
                            }
                            this.dragAmount = interactorPos.sub(this.interactorOffset);
                            let newPosition = this.startPosition.add(interactorPos.sub(this.interactorOffset));
                            newPosition.z = 0;
                            // Apply overscroll resistance if needed
                            newPosition = this.applyOverscrollIfNeeded(newPosition);
                            this.updateScrollerPosition(newPosition);
                            this.scrollDragEvent.invoke({
                                startPosition: this.startPosition,
                                dragAmount: this.dragAmount
                            });
                            if (event.target.sceneObject === this.sceneObject || event.propagationPhase === "BubbleUp") {
                                // Update velocity from position change
                                this.updateVelocityFromPosition(newPosition);
                            }
                        }
                    }
                };
                const onDragEnd = (event) => {
                    if (this.activeInteractor !== event.interactor) {
                        return;
                    }
                    this.activeInteractor = null;
                    this.isDragging = false;
                    if (event.target.sceneObject !== this.sceneObject) {
                        const interactedElement = (0, UIKitUtilities_1.getElement)(event.target.sceneObject);
                        if (!interactedElement?.isDraggable) {
                            event.stopPropagation();
                        }
                    }
                    // Apply accumulated velocity for fling behavior
                    this.applyAccumulatedVelocity();
                };
                if (this.isSubscribedToEvents === subscribe)
                    return;
                this.isSubscribedToEvents = subscribe;
                if (subscribe) {
                    this.eventUnsubscribes = [
                        this._interactable.onHoverEnter.add(onHoverStart.bind(this)),
                        this._interactable.onHoverUpdate.add(onHoverUpdate.bind(this)),
                        this._interactable.onHoverExit.add(onHoverEnd.bind(this)),
                        this._interactable.onInteractorTriggerStart.add(onTriggerStart.bind(this)),
                        this._interactable.onTriggerCanceled.add(onTriggerCanceled.bind(this)),
                        this._interactable.onDragUpdate.add(onDragUpdate.bind(this)),
                        this._interactable.onDragEnd.add(onDragEnd.bind(this))
                    ];
                }
                else {
                    this.eventUnsubscribes.forEach((unsubscribe) => unsubscribe());
                    this.eventUnsubscribes = [];
                }
            };
            /**
             * Helper function to tween scroll
             * @param position final position
             * @param time duration of tweened scroll in milliseconds
             */
            this.tweenTo = (position, time) => {
                this.scrollTweenCancel();
                this.spring.velocity = vec3.zero();
                const scrollerLocalPosition = this.scrollerTransform.getLocalPosition();
                const finalPosition = new vec3(position.x, position.y, scrollerLocalPosition.z);
                (0, animate_1.default)({
                    duration: time * 0.001,
                    update: (t) => {
                        this.updateScrollerPosition(vec3.lerp(scrollerLocalPosition, finalPosition, t));
                    },
                    cancelSet: this.scrollTweenCancel,
                    easing: "ease-in-out-quad"
                });
            };
            /**
             * Sets the size of the masked window viewport in local space.
             *
             * @param size - The window size in local space
             */
            this.setWindowSize = (size) => {
                this._windowSize = size;
                this.screenTransform.anchors.left = this._windowSize.x * -0.5;
                this.screenTransform.anchors.right = this._windowSize.x * 0.5;
                this.screenTransform.anchors.bottom = this._windowSize.y * -0.5;
                this.screenTransform.anchors.top = this._windowSize.y * 0.5;
                if (this._edgeFade) {
                    this.material.mainPass.windowSize = size;
                    this.material.mainPass.radius = this.maskingComponent.cornerRadius;
                }
                this.colliderShape.size = new vec3(this._windowSize.x, this._windowSize.y, 1);
                this.collider.shape = this.colliderShape;
            };
            /**
             * Sets the size of the total scrollable area in local space.
             *
             * @param size - The scroll dimensions in local space
             */
            this.setScrollDimensions = (size) => {
                this._scrollDimensions = size;
                this.setWindowSize(this._windowSize);
                this.onScrollDimensionsUpdatedEvent.invoke(this._scrollDimensions);
            };
            /**
             * Enables or disables the black fade effect at the edges of the scroll window.
             * This is a rendering trick for transparency.
             *
             * @param enable - true to enable edge fade, false to disable
             */
            this.enableEdgeFade = (enable) => {
                this._edgeFade = enable;
                if (enable && !this.rmv) {
                    this.createEdgeFade();
                }
                if (this.rmv) {
                    this.rmv.enabled = enable;
                }
            };
            /**
             * Gets the current scroll velocity (fling velocity).
             *
             * @returns The current velocity as a vec3
             */
            this.getVelocity = () => this.spring.velocity;
            /**
             * Sets the scroll velocity for programmatic scrolling animations.
             *
             * @param velocity - The velocity to set in local space units per frame
             */
            this.setVelocity = (velocity) => {
                this.spring.velocity = new vec3(velocity.x, velocity.y, this.spring.velocityZ);
            };
            this.enableChildColliders = (enable) => {
                const childColliders = (0, SceneObjectUtils_1.findAllComponentsInSelfOrChildren)(this.sceneObject, "ColliderComponent");
                // Prune cache entries for colliders that no longer exist
                const currentColliders = new Set(childColliders);
                for (const cachedCollider of this.colliderToElementMap.keys()) {
                    if (!currentColliders.has(cachedCollider)) {
                        this.colliderToElementMap.delete(cachedCollider);
                    }
                }
                for (let i = 0; i < childColliders.length; i++) {
                    const collider = childColliders[i];
                    if (collider === this.collider)
                        continue;
                    // Get the element from the cache
                    let element = this.colliderToElementMap.get(collider);
                    // Resolve and cache if not seen in cache before
                    if (element === undefined) {
                        element = (0, UIKitUtilities_1.getElement)(collider.sceneObject.getParent());
                        if (element && element.collider) {
                            this.colliderToElementMap.set(element.collider, element);
                        }
                    }
                    if (element && element.collider === collider) {
                        collider.enabled = enable && element.enabled && !element.inactive;
                    }
                    else {
                        collider.enabled = enable;
                    }
                }
            };
            this.cancelCurrentInteractor = () => {
                this.activeInteractor = null;
                this.isDragging = false;
                this.interactorUpdated = false;
                this.velocity = vec3.zero();
                this.dragAmount = vec2.zero();
                this.interactorOffset = vec3.zero();
                this.enableChildColliders(false);
                this.scrollTweenCancel();
                this.clearVelocityHistory();
                // Reset spring state to prevent overflow corruption during pause
                this.spring.velocity = vec3.zero();
                // If we're out of bounds, snap back to clamped position immediately
                if (!this._hardStopAtEnds) {
                    const currentPosition = this.scrollerTransform.getLocalPosition();
                    const boundsCheck = this.getClampedBoundsAndCheckOutOfBounds(currentPosition);
                    if (boundsCheck.isOutOfBounds) {
                        this.updateScrollerPosition(boundsCheck.clamped);
                    }
                }
            };
            this.cancelChildInteraction = (e) => {
                const childInteractables = (0, SceneObjectUtils_1.findAllComponentsInSelfOrChildren)(this.sceneObject, Interactable_1.Interactable.getTypeName());
                for (let i = 0; i < childInteractables.length; i++) {
                    const interactable = childInteractables[i];
                    if (interactable === this._interactable)
                        continue;
                    interactable.triggerCanceled(e);
                }
            };
            this.createEdgeFade = () => {
                this.rmv = this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual");
                this.managedComponents.push(this.rmv);
                this.rmv.mesh = this.mesh;
                this.material = this.material.clone();
                this.rmv.mainMaterial = this.material;
            };
            this.updateScrollerPosition = (newPosition) => {
                const currentPos = this.scrollerTransform.getLocalPosition();
                if (this._hardStopAtEnds) {
                    if (this._scrollDimensions.y !== -1 && (newPosition.y < this.topEdge || newPosition.y > this.bottomEdge)) {
                        newPosition.y = currentPos.y;
                    }
                    if (this._scrollDimensions.x !== -1 && (newPosition.x > this.leftEdge || newPosition.x < this.rightEdge)) {
                        newPosition.x = currentPos.x;
                    }
                }
                if (!this._horizontal)
                    newPosition.x = currentPos.x;
                if (!this._vertical)
                    newPosition.y = currentPos.y;
                this.scrollerTransform.setLocalPosition(newPosition);
                this._scrollPosition = new vec2(newPosition.x, newPosition.y);
                this.onScrollPositionUpdatedEvent.invoke(new vec2(newPosition.x, newPosition.y));
                return newPosition;
            };
            this.update = () => {
                const scale = this.transform.getWorldScale();
                // calculate frustum visible through scroll window
                this.frustum.setFromNearPlane(this.camera, this.cameraComponent.far, new vec2((this.screenTransform.anchors.right - this.screenTransform.anchors.left) * scale.x, (this.screenTransform.anchors.top - this.screenTransform.anchors.bottom) * scale.y), this.transform);
                if (this.debugRender) {
                    this.frustum.render();
                }
                /**
                 * If the scroll window is scrollingPaused, don't update the scroll position
                 * and do not update the scroller position or velocity
                 */
                if (this.scrollingPaused)
                    return;
                /**
                 * If the scroll window is controlled externally (e.g., by ScrollBar),
                 * don't apply spring velocity, friction, or snapping effects
                 */
                if (this._isControlledExternally) {
                    return;
                }
                // Early exit optimization: skip physics calculations when idle
                if (!this.isDragging) {
                    const velocity = this.spring.velocity;
                    const hasVelocity = velocity.length > EPSILON;
                    if (!hasVelocity) {
                        // Check if we're settled in bounds
                        const cScrollPosition = this.scrollerTransform.getLocalPosition();
                        const isOutOfBounds = !this._hardStopAtEnds && this.isOutOfBounds(cScrollPosition);
                        if (!isOutOfBounds) {
                            // Completely idle and in bounds - skip all physics updates
                            return;
                        }
                    }
                }
                if (this._horizontal || this._vertical) {
                    // overshoot logic
                    if (!this.isDragging && !this._hardStopAtEnds) {
                        let cScrollPosition = this.scrollerTransform.getLocalPosition();
                        const boundsCheck = this.getClampedBoundsAndCheckOutOfBounds(cScrollPosition);
                        if (boundsCheck.isOutOfBounds) {
                            this.spring.evaluate(cScrollPosition, boundsCheck.clamped, cScrollPosition);
                            const boundsCheckAfterSpring = this.getClampedBoundsAndCheckOutOfBounds(cScrollPosition);
                            if (!boundsCheckAfterSpring.isOutOfBounds) {
                                this.updateScrollerPosition(boundsCheck.clamped);
                                this.spring.velocity = vec3.zero();
                            }
                            else {
                                this.updateScrollerPosition(cScrollPosition);
                            }
                        }
                        else {
                            // Track whether any axis needs position update
                            let shouldUpdatePosition = false;
                            if (this._horizontal) {
                                if (this.scrollSnapping && this.snapRegion.x > 0) {
                                    const result = this.processSnapScrolling("x", cScrollPosition);
                                    cScrollPosition.x = result.position.x;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                                else {
                                    const result = this.processFrictionScrolling("x", cScrollPosition, boundsCheck.clamped);
                                    cScrollPosition = result.position;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                            }
                            if (this._vertical) {
                                if (this.scrollSnapping && this.snapRegion.y > 0) {
                                    const result = this.processSnapScrolling("y", cScrollPosition);
                                    cScrollPosition.y = result.position.y;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                                else {
                                    const result = this.processFrictionScrolling("y", cScrollPosition, boundsCheck.clamped);
                                    cScrollPosition = result.position;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                            }
                            if (shouldUpdatePosition) {
                                this.updateScrollerPosition(cScrollPosition);
                            }
                        }
                    }
                }
            };
        }
        __initialize() {
            super.__initialize();
            this._vertical = this._vertical;
            this._horizontal = this._horizontal;
            this._windowSize = this._windowSize;
            this._scrollDimensions = this._scrollDimensions;
            this._scrollPosition = this._scrollPosition;
            this._scrollSnapping = this._scrollSnapping;
            this._snapRegion = this._snapRegion;
            this._edgeFade = this._edgeFade;
            this.initialized = false;
            this._scrollingPaused = false;
            // world camera
            this.camera = WorldCameraFinderProvider_1.default.getInstance();
            this.cameraComponent = this.camera.getComponent();
            this.mesh = requireAsset("../../../Meshes/Unit Plane.mesh");
            this.material = requireAsset("../../../Materials/ScrollWindowFadeMask.mat");
            this.managedSceneObjects = [];
            this.managedComponents = [];
            /**
             * Frustum that handles helper viewport logic.
             * Use this to test if your content is visible within the scroll window.
             */
            this.frustum = new Frustum_1.Frustum();
            // scroll logic
            this.startPosition = vec3.zero();
            this.interactorOffset = vec3.zero();
            this.interactorUpdated = false;
            /**
             * The currently active interactor controlling this scroll window
             */
            this.activeInteractor = null;
            /**
             * is currently dragging
             */
            this.isDragging = false;
            this._isControlledExternally = false;
            this.velocity = vec3.zero();
            this.accumulatedVelocity = vec3.zero();
            this.lastPosition = this.startPosition;
            this.lastGestureEndTime = 0;
            /**
             * History of recent velocity samples for better fling predictions
             * Most recent samples are at the beginning of the array
             */
            this.velocityHistory = [];
            this.dragAmount = vec2.zero();
            this.onInitializedEvent = new ReplayEvent_1.default();
            this.scrollDragEvent = new Event_1.default();
            this.onScrollDimensionsUpdatedEvent = new Event_1.default();
            this.onScrollPositionUpdatedEvent = new Event_1.default();
            this.scrollTweenCancel = new animate_1.CancelSet();
            /**
             * Event that fires when the ScrollWindow has been initialized
             */
            this.onInitialized = this.onInitializedEvent.publicApi();
            /**
             * Event that fires during scroll drag interactions.
             * Use this event to execute logic when the user drags to scroll.
             */
            this.onScrollDrag = this.scrollDragEvent.publicApi();
            /**
             * Event that fires when scroll dimensions are updated.
             * Use this event to execute logic when the scrollable area size changes.
             */
            this.onScrollDimensionsUpdated = this.onScrollDimensionsUpdatedEvent.publicApi();
            /**
             * Event that fires when scroll position is updated.
             * Use this event to execute logic when the scroll position changes.
             * The position is in local space.
             */
            this.onScrollPositionUpdated = this.onScrollPositionUpdatedEvent.publicApi();
            /**
             * When true, disables the bounce-back effect at the edges of the scroll area.
             * When false (default), the scroll window will use a spring animation to bounce back when scrolled beyond bounds.
             */
            this._hardStopAtEnds = false;
            /**
             * When an Interactor hovers the ScrollWindow within this boundary (using normalized positions from -1 to 1),
             * all child ColliderComponents will be enabled.
             *
             * For example, if we provide a Rect with Rect.create(-1, 1, -0.8, 1),
             * hovering the bottom 10% of the ScrollWindow will not enable the child ColliderComponents.
             */
            this._enableChildCollidersBoundary = Rect.create(-1, 1, -1, 1);
            /**
             * turn on top secret debug visuals
             */
            this.debugRender = false;
            this.colliderShape = Shape.createBoxShape();
            this.spring = new springAnimate_1.SpringAnimate(150, 21, 1);
            this.isSubscribedToEvents = false;
            this.eventUnsubscribes = [];
            this.colliderToElementMap = new Map();
            /**
             * Tracks the committed snap target position for each axis.
             * Once a snap target is determined, we commit to it until the snap completes.
             */
            this.committedSnapTarget = { x: null, y: null };
            /**
             * Tracks the starting page index when a drag begins (for deadzone calculation)
             */
            this.startingPageIndex = { x: 0, y: 0 };
            /**
             * Initializes the ScrollWindow component.
             * This method runs once on creation and sets up all necessary components and event handlers.
             */
            this.initialize = () => {
                if (this.scrollSnapping) {
                    if (this.horizontal &&
                        this.scrollDimensions.x > this.windowSize.x &&
                        this.snapRegion.x > 0 &&
                        (this.scrollDimensions.x / this.snapRegion.x) % 1 !== 0) {
                        throw new Error("ScrollWindow: scrollDimensions.x must be divisible by snapRegion.x");
                    }
                    if (this.vertical &&
                        this.scrollDimensions.y > this.windowSize.y &&
                        this.snapRegion.y > 0 &&
                        (this.scrollDimensions.y / this.snapRegion.y) % 1 !== 0) {
                        throw new Error("ScrollWindow: scrollDimensions.y must be divisible by snapRegion.y");
                    }
                }
                if (this.initialized)
                    return;
                this.transform = this.sceneObject.getTransform();
                /**
                 * when you create this, does it overwrite existing local transform?
                 */
                this.screenTransform =
                    this.sceneObject.getComponent("ScreenTransform") || this.sceneObject.createComponent("ScreenTransform");
                /**
                 * like i gotta do this??
                 */
                this.screenTransform.position = this.transform.getLocalPosition();
                this.collider =
                    this.sceneObject.getComponent("ColliderComponent") || this.sceneObject.createComponent("ColliderComponent");
                this.managedComponents.push(this.collider);
                this.maskingComponent =
                    this.sceneObject.getComponent("MaskingComponent") || this.sceneObject.createComponent("MaskingComponent");
                this.managedComponents.push(this.maskingComponent);
                this._interactable =
                    this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName()) ||
                        this.sceneObject.createComponent(Interactable_1.Interactable.getTypeName());
                this.managedComponents.push(this._interactable);
                this._interactable.isScrollable = true;
                if (this._edgeFade) {
                    this.createEdgeFade();
                }
                this.setWindowSize(this._windowSize);
                this.collider.shape = this.colliderShape;
                this.collider.fitVisual = false;
                this.collider.debugDrawEnabled = this.debugRender;
                this._interactable.enableInstantDrag = true;
                const currentChildren = [...this.sceneObject.children];
                this.scroller = global.scene.createSceneObject("Scroller");
                this.managedSceneObjects.push(this.scroller);
                this.scroller.layer = this.sceneObject.layer;
                this.scroller.setParent(this.sceneObject);
                this.scrollerTransform = this.scroller.getTransform();
                // move children under this.scroller
                for (let i = 0; i < currentChildren.length; i++) {
                    const thisChild = currentChildren[i];
                    thisChild.setParent(this.scroller);
                }
                this.subscribeToEvents(this.enabled);
                // Initialize scroll position
                const initialPosition = new vec3(this.scrollPosition.x, this.scrollPosition.y, 0);
                if (this._scrollSnapping) {
                    if (this._horizontal &&
                        this.snapRegion.x > 0 &&
                        (this._scrollDimensions.x === -1 || this._scrollDimensions.x > this._windowSize.x)) {
                        const pageIndex = this.getPageIndexFromPosition("x", this._scrollPosition.x);
                        if (this._scrollDimensions.x !== -1) {
                            // Bounded: use nearEdge-relative position
                            initialPosition.x = this.rightEdge + pageIndex * this.snapRegion.x;
                            initialPosition.x = MathUtils.clamp(initialPosition.x, this.rightEdge, this.leftEdge);
                        }
                        else {
                            // Unbounded: use center-relative position
                            initialPosition.x = pageIndex * this.snapRegion.x;
                        }
                    }
                    if (this._vertical &&
                        this.snapRegion.y > 0 &&
                        (this._scrollDimensions.y === -1 || this._scrollDimensions.y > this._windowSize.y)) {
                        const pageIndex = this.getPageIndexFromPosition("y", this._scrollPosition.y);
                        if (this._scrollDimensions.y !== -1) {
                            // Bounded: use nearEdge-relative position
                            initialPosition.y = this.topEdge + pageIndex * this.snapRegion.y;
                            initialPosition.y = MathUtils.clamp(initialPosition.y, this.topEdge, this.bottomEdge);
                        }
                        else {
                            // Unbounded: use center-relative position
                            initialPosition.y = pageIndex * this.snapRegion.y;
                        }
                    }
                }
                // Set initial position if not at origin
                if (initialPosition.x !== 0 || initialPosition.y !== 0) {
                    this.updateScrollerPosition(initialPosition);
                }
                this.initialized = true;
                this.onInitializedEvent.invoke();
            };
            this.subscribeToEvents = (subscribe) => {
                const onHoverStart = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    const intersection = event.interactor.raycastPlaneIntersection(this._interactable);
                    if (intersection) {
                        const localIntersection = this.screenTransform.worldPointToLocalPoint(intersection);
                        if (localIntersection.x < this._enableChildCollidersBoundary.left ||
                            localIntersection.x > this._enableChildCollidersBoundary.right ||
                            localIntersection.y < this._enableChildCollidersBoundary.bottom ||
                            localIntersection.y > this._enableChildCollidersBoundary.top) {
                            event.stopPropagation();
                        }
                        else {
                            this.enableChildColliders(true);
                        }
                    }
                    else {
                        this.enableChildColliders(false);
                    }
                };
                const onHoverUpdate = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    const intersection = event.interactor.raycastPlaneIntersection(this._interactable);
                    if (intersection) {
                        const localIntersection = this.screenTransform.worldPointToLocalPoint(intersection);
                        if (localIntersection.x < this._enableChildCollidersBoundary.left ||
                            localIntersection.x > this._enableChildCollidersBoundary.right ||
                            localIntersection.y < this._enableChildCollidersBoundary.bottom ||
                            localIntersection.y > this._enableChildCollidersBoundary.top) {
                            event.stopPropagation();
                        }
                        else {
                            this.enableChildColliders(true);
                        }
                    }
                    else {
                        this.enableChildColliders(false);
                    }
                };
                const onHoverEnd = () => {
                    this.enableChildColliders(false);
                };
                const onTriggerStart = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    // If there's already an active interactor, cancel it first
                    if (this.activeInteractor && this.activeInteractor !== event.interactor) {
                        this.cancelCurrentInteractor();
                    }
                    // Set new active interactor
                    this.activeInteractor = event.interactor;
                    // Reset state for new interaction
                    this.resetDragState();
                };
                const onTriggerCanceled = (event) => {
                    // Only process cancellation from the active interactor
                    if (this.activeInteractor !== event.interactor) {
                        return;
                    }
                    this.cancelCurrentInteractor();
                    // Apply any accumulated velocity from previous gestures if we have momentum
                    if (this.accumulatedVelocity.length > 0) {
                        // Use existing accumulated velocity for continued scrolling
                        this.spring.velocity = this.accumulatedVelocity.uniformScale(FLING_MULTIPLIER);
                    }
                    else {
                        // No accumulated velocity, stop completely
                        this.spring.velocity = vec3.zero();
                    }
                };
                const onDragUpdate = (event) => {
                    if (this.scrollingPaused) {
                        return;
                    }
                    if (this.activeInteractor?.inputType !== event.interactor.inputType) {
                        return;
                    }
                    if (event.interactor) {
                        const interactedElement = (0, UIKitUtilities_1.getElement)(event.interactor.currentInteractable.sceneObject);
                        if (interactedElement && interactedElement.isDraggable && !interactedElement.inactive) {
                            return;
                        }
                        const intersection = event.interactor.raycastPlaneIntersection(this._interactable);
                        if (intersection) {
                            this.scrollTweenCancel();
                            const interactorPos = this.transform.getInvertedWorldTransform().multiplyPoint(intersection);
                            if (!this.interactorUpdated) {
                                this.interactorOffset = interactorPos;
                                this.interactorUpdated = true;
                                this.isDragging = true;
                                this.committedSnapTarget.x = null;
                                this.committedSnapTarget.y = null;
                                this.cancelChildInteraction(event);
                            }
                            this.dragAmount = interactorPos.sub(this.interactorOffset);
                            let newPosition = this.startPosition.add(interactorPos.sub(this.interactorOffset));
                            newPosition.z = 0;
                            // Apply overscroll resistance if needed
                            newPosition = this.applyOverscrollIfNeeded(newPosition);
                            this.updateScrollerPosition(newPosition);
                            this.scrollDragEvent.invoke({
                                startPosition: this.startPosition,
                                dragAmount: this.dragAmount
                            });
                            if (event.target.sceneObject === this.sceneObject || event.propagationPhase === "BubbleUp") {
                                // Update velocity from position change
                                this.updateVelocityFromPosition(newPosition);
                            }
                        }
                    }
                };
                const onDragEnd = (event) => {
                    if (this.activeInteractor !== event.interactor) {
                        return;
                    }
                    this.activeInteractor = null;
                    this.isDragging = false;
                    if (event.target.sceneObject !== this.sceneObject) {
                        const interactedElement = (0, UIKitUtilities_1.getElement)(event.target.sceneObject);
                        if (!interactedElement?.isDraggable) {
                            event.stopPropagation();
                        }
                    }
                    // Apply accumulated velocity for fling behavior
                    this.applyAccumulatedVelocity();
                };
                if (this.isSubscribedToEvents === subscribe)
                    return;
                this.isSubscribedToEvents = subscribe;
                if (subscribe) {
                    this.eventUnsubscribes = [
                        this._interactable.onHoverEnter.add(onHoverStart.bind(this)),
                        this._interactable.onHoverUpdate.add(onHoverUpdate.bind(this)),
                        this._interactable.onHoverExit.add(onHoverEnd.bind(this)),
                        this._interactable.onInteractorTriggerStart.add(onTriggerStart.bind(this)),
                        this._interactable.onTriggerCanceled.add(onTriggerCanceled.bind(this)),
                        this._interactable.onDragUpdate.add(onDragUpdate.bind(this)),
                        this._interactable.onDragEnd.add(onDragEnd.bind(this))
                    ];
                }
                else {
                    this.eventUnsubscribes.forEach((unsubscribe) => unsubscribe());
                    this.eventUnsubscribes = [];
                }
            };
            /**
             * Helper function to tween scroll
             * @param position final position
             * @param time duration of tweened scroll in milliseconds
             */
            this.tweenTo = (position, time) => {
                this.scrollTweenCancel();
                this.spring.velocity = vec3.zero();
                const scrollerLocalPosition = this.scrollerTransform.getLocalPosition();
                const finalPosition = new vec3(position.x, position.y, scrollerLocalPosition.z);
                (0, animate_1.default)({
                    duration: time * 0.001,
                    update: (t) => {
                        this.updateScrollerPosition(vec3.lerp(scrollerLocalPosition, finalPosition, t));
                    },
                    cancelSet: this.scrollTweenCancel,
                    easing: "ease-in-out-quad"
                });
            };
            /**
             * Sets the size of the masked window viewport in local space.
             *
             * @param size - The window size in local space
             */
            this.setWindowSize = (size) => {
                this._windowSize = size;
                this.screenTransform.anchors.left = this._windowSize.x * -0.5;
                this.screenTransform.anchors.right = this._windowSize.x * 0.5;
                this.screenTransform.anchors.bottom = this._windowSize.y * -0.5;
                this.screenTransform.anchors.top = this._windowSize.y * 0.5;
                if (this._edgeFade) {
                    this.material.mainPass.windowSize = size;
                    this.material.mainPass.radius = this.maskingComponent.cornerRadius;
                }
                this.colliderShape.size = new vec3(this._windowSize.x, this._windowSize.y, 1);
                this.collider.shape = this.colliderShape;
            };
            /**
             * Sets the size of the total scrollable area in local space.
             *
             * @param size - The scroll dimensions in local space
             */
            this.setScrollDimensions = (size) => {
                this._scrollDimensions = size;
                this.setWindowSize(this._windowSize);
                this.onScrollDimensionsUpdatedEvent.invoke(this._scrollDimensions);
            };
            /**
             * Enables or disables the black fade effect at the edges of the scroll window.
             * This is a rendering trick for transparency.
             *
             * @param enable - true to enable edge fade, false to disable
             */
            this.enableEdgeFade = (enable) => {
                this._edgeFade = enable;
                if (enable && !this.rmv) {
                    this.createEdgeFade();
                }
                if (this.rmv) {
                    this.rmv.enabled = enable;
                }
            };
            /**
             * Gets the current scroll velocity (fling velocity).
             *
             * @returns The current velocity as a vec3
             */
            this.getVelocity = () => this.spring.velocity;
            /**
             * Sets the scroll velocity for programmatic scrolling animations.
             *
             * @param velocity - The velocity to set in local space units per frame
             */
            this.setVelocity = (velocity) => {
                this.spring.velocity = new vec3(velocity.x, velocity.y, this.spring.velocityZ);
            };
            this.enableChildColliders = (enable) => {
                const childColliders = (0, SceneObjectUtils_1.findAllComponentsInSelfOrChildren)(this.sceneObject, "ColliderComponent");
                // Prune cache entries for colliders that no longer exist
                const currentColliders = new Set(childColliders);
                for (const cachedCollider of this.colliderToElementMap.keys()) {
                    if (!currentColliders.has(cachedCollider)) {
                        this.colliderToElementMap.delete(cachedCollider);
                    }
                }
                for (let i = 0; i < childColliders.length; i++) {
                    const collider = childColliders[i];
                    if (collider === this.collider)
                        continue;
                    // Get the element from the cache
                    let element = this.colliderToElementMap.get(collider);
                    // Resolve and cache if not seen in cache before
                    if (element === undefined) {
                        element = (0, UIKitUtilities_1.getElement)(collider.sceneObject.getParent());
                        if (element && element.collider) {
                            this.colliderToElementMap.set(element.collider, element);
                        }
                    }
                    if (element && element.collider === collider) {
                        collider.enabled = enable && element.enabled && !element.inactive;
                    }
                    else {
                        collider.enabled = enable;
                    }
                }
            };
            this.cancelCurrentInteractor = () => {
                this.activeInteractor = null;
                this.isDragging = false;
                this.interactorUpdated = false;
                this.velocity = vec3.zero();
                this.dragAmount = vec2.zero();
                this.interactorOffset = vec3.zero();
                this.enableChildColliders(false);
                this.scrollTweenCancel();
                this.clearVelocityHistory();
                // Reset spring state to prevent overflow corruption during pause
                this.spring.velocity = vec3.zero();
                // If we're out of bounds, snap back to clamped position immediately
                if (!this._hardStopAtEnds) {
                    const currentPosition = this.scrollerTransform.getLocalPosition();
                    const boundsCheck = this.getClampedBoundsAndCheckOutOfBounds(currentPosition);
                    if (boundsCheck.isOutOfBounds) {
                        this.updateScrollerPosition(boundsCheck.clamped);
                    }
                }
            };
            this.cancelChildInteraction = (e) => {
                const childInteractables = (0, SceneObjectUtils_1.findAllComponentsInSelfOrChildren)(this.sceneObject, Interactable_1.Interactable.getTypeName());
                for (let i = 0; i < childInteractables.length; i++) {
                    const interactable = childInteractables[i];
                    if (interactable === this._interactable)
                        continue;
                    interactable.triggerCanceled(e);
                }
            };
            this.createEdgeFade = () => {
                this.rmv = this.sceneObject.getComponent("RenderMeshVisual") || this.sceneObject.createComponent("RenderMeshVisual");
                this.managedComponents.push(this.rmv);
                this.rmv.mesh = this.mesh;
                this.material = this.material.clone();
                this.rmv.mainMaterial = this.material;
            };
            this.updateScrollerPosition = (newPosition) => {
                const currentPos = this.scrollerTransform.getLocalPosition();
                if (this._hardStopAtEnds) {
                    if (this._scrollDimensions.y !== -1 && (newPosition.y < this.topEdge || newPosition.y > this.bottomEdge)) {
                        newPosition.y = currentPos.y;
                    }
                    if (this._scrollDimensions.x !== -1 && (newPosition.x > this.leftEdge || newPosition.x < this.rightEdge)) {
                        newPosition.x = currentPos.x;
                    }
                }
                if (!this._horizontal)
                    newPosition.x = currentPos.x;
                if (!this._vertical)
                    newPosition.y = currentPos.y;
                this.scrollerTransform.setLocalPosition(newPosition);
                this._scrollPosition = new vec2(newPosition.x, newPosition.y);
                this.onScrollPositionUpdatedEvent.invoke(new vec2(newPosition.x, newPosition.y));
                return newPosition;
            };
            this.update = () => {
                const scale = this.transform.getWorldScale();
                // calculate frustum visible through scroll window
                this.frustum.setFromNearPlane(this.camera, this.cameraComponent.far, new vec2((this.screenTransform.anchors.right - this.screenTransform.anchors.left) * scale.x, (this.screenTransform.anchors.top - this.screenTransform.anchors.bottom) * scale.y), this.transform);
                if (this.debugRender) {
                    this.frustum.render();
                }
                /**
                 * If the scroll window is scrollingPaused, don't update the scroll position
                 * and do not update the scroller position or velocity
                 */
                if (this.scrollingPaused)
                    return;
                /**
                 * If the scroll window is controlled externally (e.g., by ScrollBar),
                 * don't apply spring velocity, friction, or snapping effects
                 */
                if (this._isControlledExternally) {
                    return;
                }
                // Early exit optimization: skip physics calculations when idle
                if (!this.isDragging) {
                    const velocity = this.spring.velocity;
                    const hasVelocity = velocity.length > EPSILON;
                    if (!hasVelocity) {
                        // Check if we're settled in bounds
                        const cScrollPosition = this.scrollerTransform.getLocalPosition();
                        const isOutOfBounds = !this._hardStopAtEnds && this.isOutOfBounds(cScrollPosition);
                        if (!isOutOfBounds) {
                            // Completely idle and in bounds - skip all physics updates
                            return;
                        }
                    }
                }
                if (this._horizontal || this._vertical) {
                    // overshoot logic
                    if (!this.isDragging && !this._hardStopAtEnds) {
                        let cScrollPosition = this.scrollerTransform.getLocalPosition();
                        const boundsCheck = this.getClampedBoundsAndCheckOutOfBounds(cScrollPosition);
                        if (boundsCheck.isOutOfBounds) {
                            this.spring.evaluate(cScrollPosition, boundsCheck.clamped, cScrollPosition);
                            const boundsCheckAfterSpring = this.getClampedBoundsAndCheckOutOfBounds(cScrollPosition);
                            if (!boundsCheckAfterSpring.isOutOfBounds) {
                                this.updateScrollerPosition(boundsCheck.clamped);
                                this.spring.velocity = vec3.zero();
                            }
                            else {
                                this.updateScrollerPosition(cScrollPosition);
                            }
                        }
                        else {
                            // Track whether any axis needs position update
                            let shouldUpdatePosition = false;
                            if (this._horizontal) {
                                if (this.scrollSnapping && this.snapRegion.x > 0) {
                                    const result = this.processSnapScrolling("x", cScrollPosition);
                                    cScrollPosition.x = result.position.x;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                                else {
                                    const result = this.processFrictionScrolling("x", cScrollPosition, boundsCheck.clamped);
                                    cScrollPosition = result.position;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                            }
                            if (this._vertical) {
                                if (this.scrollSnapping && this.snapRegion.y > 0) {
                                    const result = this.processSnapScrolling("y", cScrollPosition);
                                    cScrollPosition.y = result.position.y;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                                else {
                                    const result = this.processFrictionScrolling("y", cScrollPosition, boundsCheck.clamped);
                                    cScrollPosition = result.position;
                                    shouldUpdatePosition = shouldUpdatePosition || result.shouldUpdate;
                                }
                            }
                            if (shouldUpdatePosition) {
                                this.updateScrollerPosition(cScrollPosition);
                            }
                        }
                    }
                }
            };
        }
        /**
         * Whether scrolling is currently paused
         * @returns true if scrolling is paused, false otherwise
         */
        get scrollingPaused() {
            return this._scrollingPaused;
        }
        /**
         * Pause or resume scrolling
         * @param scrollingPaused - true to pause scrolling, false to resume
         */
        set scrollingPaused(scrollingPaused) {
            // reset accumulated velocity
            if (this.initialized && scrollingPaused) {
                this.cancelCurrentInteractor();
                this.accumulatedVelocity = vec3.zero();
                this.lastGestureEndTime = 0;
                this.committedSnapTarget.x = null;
                this.committedSnapTarget.y = null;
                this.startingPageIndex.x = 0;
                this.startingPageIndex.y = 0;
            }
            this._scrollingPaused = scrollingPaused;
        }
        /**
         * get whether this scroll window is initialized
         */
        get isInitialized() {
            return this.initialized;
        }
        /**
         * get the number of children in the content of scroll window
         */
        get children() {
            if (!this.initialized) {
                return [];
            }
            return this.scroller.children;
        }
        /**
         * The Interactable component of this scroll window
         * @returns Interactable component
         */
        get interactable() {
            return this._interactable;
        }
        /**
         * Whether vertical scrolling is enabled
         * @returns true if vertical scrolling is enabled, false otherwise
         */
        get vertical() {
            return this._vertical;
        }
        /**
         * Whether vertical scrolling is enabled
         * @param value - true to enable vertical scrolling, false to disable
         */
        set vertical(value) {
            if (value === undefined) {
                return;
            }
            this._vertical = value;
        }
        /**
         * Whether horizontal scrolling is enabled
         * @returns true if horizontal scrolling is enabled, false otherwise
         */
        get horizontal() {
            return this._horizontal;
        }
        /**
         * Whether horizontal scrolling is enabled
         * @param value - true to enable horizontal scrolling, false to disable
         */
        set horizontal(value) {
            if (value === undefined) {
                return;
            }
            this._horizontal = value;
        }
        /**
         * Whether this scroll window is controlled externally
         * @returns true if controlled externally, false otherwise
         */
        get isControlledExternally() {
            return this._isControlledExternally;
        }
        /**
         * Whether this scroll window is controlled externally
         * @param value - true to control externally, false to control internally
         */
        set isControlledExternally(value) {
            if (value === undefined) {
                return;
            }
            if (this._isControlledExternally && !value) {
                // Transitioning from external control to internal control
                this.applyAccumulatedVelocity();
            }
            else if (!this._isControlledExternally && value) {
                // Transitioning from internal control to external control
                this.resetDragState();
            }
            this._isControlledExternally = value;
        }
        /**
         * Whether this scroll window is using snap scrolling
         * @returns true if snap scrolling is enabled, false otherwise
         */
        get scrollSnapping() {
            return this._scrollSnapping;
        }
        /**
         * Whether this scroll window is using snap scrolling
         * @param value - true to enable snap scrolling, false to disable
         */
        set scrollSnapping(scrollSnapping) {
            if (scrollSnapping === undefined) {
                return;
            }
            this._scrollSnapping = scrollSnapping;
        }
        /**
         * The size of each snap segment in the scroll window
         * @returns vec2 of the size of each snap segment in local space.
         */
        get snapRegion() {
            return this._snapRegion;
        }
        /**
         * The size of each snap segment in the scroll window
         * @param snapRegion - The size of each snap segment in local space.
         */
        set snapRegion(snapRegion) {
            if (snapRegion === undefined) {
                return;
            }
            this._snapRegion = snapRegion;
        }
        /**
         * The scroll position in local space
         */
        get scrollPosition() {
            return this._scrollPosition;
        }
        /**
         * The scroll position in local space
         */
        set scrollPosition(position) {
            if (position === undefined) {
                return;
            }
            if (this.initialized) {
                this.scrollTweenCancel();
                const scrollerLocalPosition = this.scrollerTransform.getLocalPosition();
                let newPosition = new vec3(position.x, position.y, scrollerLocalPosition.z);
                // Apply overscroll resistance if needed
                newPosition = this.applyOverscrollIfNeeded(newPosition);
                this.updateScrollerPosition(newPosition);
                if (this.scrollSnapping) {
                    // Update velocity from position change
                    this.updateVelocityFromPosition(newPosition);
                }
            }
            else {
                this._scrollPosition = position;
            }
        }
        /**
         * The scroll position in normalized space
         * -1, 1 on the x (left to right) if scrollDimensions.x is not -1, otherwise the scroll position.x in pixels
         * -1, 1 on the y (bottom to top) if scrollDimensions.y is not -1, otherwise the scroll position.y in pixels
         */
        get scrollPositionNormalized() {
            const normalizedScrollPosition = vec2.zero();
            normalizedScrollPosition.x =
                this._scrollDimensions.x !== -1 ? this._scrollPosition.x / this.rightEdge : this._scrollPosition.x;
            normalizedScrollPosition.y =
                this._scrollDimensions.y !== -1 ? this._scrollPosition.y / this.topEdge : this._scrollPosition.y;
            return normalizedScrollPosition;
        }
        /**
         * The scroll position in normalized space
         * -1, 1 on the x (left to right)
         * -1, 1 on the y (bottom to top)
         */
        set scrollPositionNormalized(normalizedPosition) {
            if (normalizedPosition === undefined) {
                return;
            }
            if (this.initialized) {
                this.scrollTweenCancel();
                const scrollerLocalPosition = this.scrollerTransform.getLocalPosition();
                let newPosition = new vec3(this._scrollDimensions.x !== -1 ? normalizedPosition.x * this.rightEdge : normalizedPosition.x, this._scrollDimensions.y !== -1 ? normalizedPosition.y * this.topEdge : normalizedPosition.y, scrollerLocalPosition.z);
                // Apply overscroll resistance if needed
                newPosition = this.applyOverscrollIfNeeded(newPosition);
                this.updateScrollerPosition(newPosition);
                if (this.scrollSnapping) {
                    // Update velocity from position change
                    this.updateVelocityFromPosition(newPosition);
                }
            }
            else {
                this._scrollPosition.x =
                    this._scrollDimensions.x !== -1 ? normalizedPosition.x * this.rightEdge : normalizedPosition.x;
                this._scrollPosition.y =
                    this._scrollDimensions.y !== -1 ? normalizedPosition.y * this.topEdge : normalizedPosition.y;
            }
        }
        /**
         * The size of the masked window viewport in local space
         * @returns vec2 of the current window size
         */
        get windowSize() {
            return this._windowSize;
        }
        /**
         * The size of the masked window viewport in local space
         * @param size - The window size in local space
         */
        set windowSize(size) {
            if (size === undefined) {
                return;
            }
            if (this.initialized) {
                this.setWindowSize(size);
            }
            else {
                this._windowSize = size;
            }
        }
        /**
         * The size of the total scrollable area
         * @returns vec2 of the current scroll dimensions
         */
        get scrollDimensions() {
            return this._scrollDimensions;
        }
        /**
         * The size of the total scrollable area
         * @param size - The scroll dimensions in local space
         */
        set scrollDimensions(size) {
            if (size === undefined) {
                return;
            }
            if (this.initialized) {
                this.setScrollDimensions(size);
            }
            else {
                this._scrollDimensions = size;
            }
        }
        /**
         * Whether edge fade is enabled
         * @returns true if edge fade is enabled, false otherwise
         */
        get edgeFade() {
            return this._edgeFade;
        }
        /**
         * Whether edge fade is enabled
         * @param value - true to enable edge fade, false to disable
         */
        set edgeFade(value) {
            if (value === undefined) {
                return;
            }
            if (this.initialized) {
                this.enableEdgeFade(value);
            }
            else {
                this._edgeFade = value;
            }
        }
        /**
         * Whether hard stop at ends is enabled
         * When true, disables the bounce-back effect at the edges of the scroll area.
         * When false (default), the scroll window will use a spring animation to bounce back when scrolled beyond bounds.
         * @returns true if hard stop at ends is enabled, false otherwise
         */
        get hardStopAtEnds() {
            return this._hardStopAtEnds;
        }
        /**
         * Whether hard stop at ends is enabled
         * @param value - true to enable hard stop at ends, false to disable
         */
        set hardStopAtEnds(value) {
            if (value === undefined) {
                return;
            }
            this._hardStopAtEnds = value;
        }
        /**
         * The boundary within which child colliders will be enabled when an interactor hovers over the ScrollWindow.
         * Uses normalized positions from -1 to 1 on both axes.
         * For example, if we provide a Rect with Rect.create(-1, 1, -0.8, 1),
         * hovering the bottom 10% of the ScrollWindow will not enable the child ColliderComponents.
         * @returns The current enable child colliders boundary
         */
        get enableChildCollidersBoundary() {
            return this._enableChildCollidersBoundary;
        }
        /**
         * The boundary within which child colliders will be enabled when an interactor hovers over the ScrollWindow.
         * @param value - The boundary rect using normalized positions from -1 to 1
         */
        set enableChildCollidersBoundary(value) {
            if (value === undefined) {
                return;
            }
            this._enableChildCollidersBoundary = value;
        }
        onAwake() {
            this.createEvent("OnEnableEvent").bind(() => {
                if (this.initialized) {
                    this.subscribeToEvents(true);
                    this.managedComponents.forEach((component) => {
                        if (!isNull(component) && component) {
                            if (component === this.rmv) {
                                component.enabled = this._edgeFade;
                            }
                            else {
                                component.enabled = true;
                            }
                        }
                    });
                    this.cancelCurrentInteractor();
                }
            });
            this.createEvent("OnDisableEvent").bind(() => {
                if (this.initialized) {
                    this.subscribeToEvents(false);
                    this.managedComponents.forEach((component) => {
                        if (!isNull(component) && component) {
                            component.enabled = false;
                        }
                    });
                    this.enableChildColliders(true);
                }
            });
            this.createEvent("OnDestroyEvent").bind(() => {
                this.scrollTweenCancel();
                if (this.scroller) {
                    // When destroying the scroll window, we need to reparent the children to the scene object
                    this.scroller.children.forEach((child) => {
                        child.setParent(this.sceneObject);
                    });
                }
                this.managedComponents.forEach((component) => {
                    if (!isNull(component) && component) {
                        component.destroy();
                    }
                });
                this.managedComponents = [];
                this.managedSceneObjects.forEach((sceneObject) => {
                    if (!isNull(sceneObject) && sceneObject) {
                        sceneObject.destroy();
                    }
                });
                this.managedSceneObjects = [];
            });
            this.createEvent("OnStartEvent").bind(this.initialize.bind(this));
            this.createEvent("LateUpdateEvent").bind(this.update.bind(this));
        }
        /**
         * Adds a SceneObject to this scroll window's scrollable content area.
         * The object's parent will be set to the internal scroller object.
         *
         * @param object - The SceneObject to add to the scroll window
         */
        addObject(object) {
            object.setParent(this.scroller ?? this.sceneObject);
        }
        /**
         * Gets the viewable window of local space at zero depth.
         * The window ranges from -windowSize.x/2 to windowSize.x/2 on the x-axis (left to right)
         * and -windowSize.y/2 to windowSize.y/2 on the y-axis (bottom to top).
         *
         * @returns VisibleWindow object containing bottomLeft and topRight corners in local space
         */
        getVisibleWindow() {
            const visibleWindow = {
                bottomLeft: vec2.zero(),
                topRight: vec2.zero()
            };
            const scrollerLocalPosition = this.scrollerTransform.getLocalPosition();
            visibleWindow.bottomLeft.x = -scrollerLocalPosition.x - this._windowSize.x * 0.5;
            visibleWindow.bottomLeft.y = -scrollerLocalPosition.y - this._windowSize.y * 0.5;
            visibleWindow.topRight.x = -scrollerLocalPosition.x + this._windowSize.x * 0.5;
            visibleWindow.topRight.y = -scrollerLocalPosition.y + this._windowSize.y * 0.5;
            return visibleWindow;
        }
        /**
         * Gets the viewable window in normalized space at zero depth.
         * The window ranges from -1 to 1 on the x-axis (left to right)
         * and -1 to 1 on the y-axis (bottom to top).
         *
         * @returns VisibleWindow object containing bottomLeft and topRight corners in normalized space
         */
        getVisibleWindowNormalized() {
            const visibleWindow = this.getVisibleWindow();
            visibleWindow.bottomLeft.x /= this._scrollDimensions.x * 0.5;
            visibleWindow.bottomLeft.y /= this._scrollDimensions.y * 0.5;
            visibleWindow.topRight.x /= this._scrollDimensions.x * 0.5;
            visibleWindow.topRight.y /= this._scrollDimensions.y * 0.5;
            return visibleWindow;
        }
        get topEdge() {
            return this._scrollDimensions.y * -0.5 + this._windowSize.y * 0.5;
        }
        get bottomEdge() {
            return this._scrollDimensions.y * 0.5 - this._windowSize.y * 0.5;
        }
        get leftEdge() {
            return this._scrollDimensions.x * 0.5 - this._windowSize.x * 0.5;
        }
        get rightEdge() {
            return this._scrollDimensions.x * -0.5 + this._windowSize.x * 0.5;
        }
        /**
         * Optimized bounds checking that calculates clamped position and out-of-bounds status in one pass
         * @param scrollPos - The scroll position to check
         * @returns Object containing the clamped position and whether the original position was out of bounds
         */
        getClampedBoundsAndCheckOutOfBounds(scrollPos) {
            const clampedX = this._scrollDimensions.x === -1
                ? scrollPos.x
                : this._scrollDimensions.x > this._windowSize.x
                    ? MathUtils.clamp(scrollPos.x, this.rightEdge, this.leftEdge)
                    : 0;
            const clampedY = this._scrollDimensions.y === -1
                ? scrollPos.y
                : this._scrollDimensions.y > this._windowSize.y
                    ? MathUtils.clamp(scrollPos.y, this.topEdge, this.bottomEdge)
                    : 0;
            const clamped = new vec3(clampedX, clampedY, 0);
            const isOutOfBounds = Math.abs(scrollPos.x - clampedX) > EPSILON ||
                Math.abs(scrollPos.y - clampedY) > EPSILON ||
                Math.abs(scrollPos.z - clamped.z) > EPSILON;
            return { clamped, isOutOfBounds };
        }
        isOutOfBounds(scrollPos) {
            return this.getClampedBoundsAndCheckOutOfBounds(scrollPos).isOutOfBounds;
        }
        calculateAxisResistance(displacement, maxOverscroll) {
            if (Math.abs(displacement) <= EPSILON) {
                return 0;
            }
            // Normalize displacement to 0-1 range
            const normalized = Math.abs(displacement) / maxOverscroll;
            // Apply exponential curve with configurable strength
            // Higher strength = more resistance (slower falloff)
            const curveExponent = 0.5 + EDGE_BOUNCE_STRENGTH * 0.2;
            const resistanceFactor = Math.pow(1 - Math.min(normalized, 1), curveExponent);
            // Apply resistance
            return Math.sign(displacement) * maxOverscroll * (1 - resistanceFactor);
        }
        /**
         * Applies non-linear overscroll resistance for natural rubber band effect
         * Uses exponential curve for more realistic bounce feel
         */
        applyOverscrollResistance(displacement) {
            const maxOverscroll = new vec2(this._windowSize.x * MAX_OVERSHOOT_FACTOR, this._windowSize.y * MAX_OVERSHOOT_FACTOR);
            const resistedX = this.calculateAxisResistance(displacement.x, maxOverscroll.x);
            const resistedY = this.calculateAxisResistance(displacement.y, maxOverscroll.y);
            return new vec3(resistedX, resistedY, 0);
        }
        getPageIndexFromPosition(axis, currentPosition) {
            const snapSize = this.snapRegion[axis];
            const hasBounds = this._scrollDimensions[axis] !== -1;
            if (hasBounds) {
                // Bounded scrolling: calculate page index relative to nearEdge
                const nearEdge = axis === "x" ? this.rightEdge : this.topEdge;
                const currentPageFloat = (currentPosition - nearEdge) / snapSize;
                const currentPageIndex = Math.round(currentPageFloat);
                return currentPageIndex;
            }
            else {
                // Unbounded scrolling: calculate page index relative to center (0)
                const currentPageFloat = currentPosition / snapSize;
                const currentPageIndex = Math.round(Math.abs(currentPageFloat)) * Math.sign(currentPageFloat);
                return currentPageIndex;
            }
        }
        /**
         * Helper to check if velocity directions match for accumulation
         */
        shouldAccumulateAxis(accumulated, current) {
            return accumulated === 0 || Math.sign(current) === Math.sign(accumulated);
        }
        addVelocityToHistory(velocity) {
            // Add to the beginning (most recent)
            this.velocityHistory.unshift(new vec3(velocity.x, velocity.y, velocity.z));
            // Trim to size limit
            if (this.velocityHistory.length > VELOCITY_HISTORY_SIZE) {
                this.velocityHistory.pop();
            }
        }
        /**
         * Calculates weighted average velocity from history for better predictions
         * More recent samples have higher weight
         */
        getWeightedAverageVelocity() {
            if (this.velocityHistory.length === 0) {
                return vec3.zero();
            }
            const weightedVelocity = vec3.zero();
            let totalWeight = 0;
            for (let i = 0; i < this.velocityHistory.length; i++) {
                const weight = VELOCITY_HISTORY_WEIGHTS[i] || 0;
                const sample = this.velocityHistory[i];
                weightedVelocity.x += sample.x * weight;
                weightedVelocity.y += sample.y * weight;
                weightedVelocity.z += sample.z * weight;
                totalWeight += weight;
            }
            // Normalize by total weight (in case we have fewer samples than history size)
            if (totalWeight > 0) {
                weightedVelocity.x /= totalWeight;
                weightedVelocity.y /= totalWeight;
                weightedVelocity.z /= totalWeight;
            }
            return weightedVelocity;
        }
        clearVelocityHistory() {
            this.velocityHistory = [];
        }
        /**
         * Applies overscroll resistance if the position is out of bounds
         */
        applyOverscrollIfNeeded(position) {
            if (!this._hardStopAtEnds) {
                const boundsCheck = this.getClampedBoundsAndCheckOutOfBounds(position);
                if (boundsCheck.isOutOfBounds) {
                    const overshootAmount = position.sub(boundsCheck.clamped);
                    const overshootWithResistance = this.applyOverscrollResistance(overshootAmount);
                    return boundsCheck.clamped.add(overshootWithResistance);
                }
            }
            return position;
        }
        /**
         * Updates velocity based on position change with smoothing and history tracking
         */
        updateVelocityFromPosition(newPosition) {
            const newVelocity = newPosition.sub(this.lastPosition);
            newVelocity.z = 0;
            if (Math.abs(newVelocity.x) > SIGNIFICANT_VELOCITY_THRESHOLD ||
                Math.abs(newVelocity.y) > SIGNIFICANT_VELOCITY_THRESHOLD) {
                // Apply exponential smoothing to reduce jitter
                this.velocity.x = this.velocity.x * (1 - VELOCITY_SMOOTHING) + newVelocity.x * VELOCITY_SMOOTHING;
                this.velocity.y = this.velocity.y * (1 - VELOCITY_SMOOTHING) + newVelocity.y * VELOCITY_SMOOTHING;
                this.velocity.z = 0;
                // Add to velocity history for better fling predictions
                this.addVelocityToHistory(this.velocity);
            }
            this.lastPosition = newPosition;
        }
        /**
         * Resets the drag state for a new interaction (either from direct drag or external control)
         */
        resetDragState() {
            this.startPosition = this.scrollerTransform.getLocalPosition();
            this.lastPosition = this.startPosition;
            this.interactorOffset = vec3.zero();
            this.velocity = vec3.zero();
            this.interactorUpdated = false;
            this.dragAmount = vec2.zero();
            this.clearVelocityHistory();
            // Capture starting page index for deadzone calculation
            if (this._scrollSnapping) {
                this.committedSnapTarget.x = null;
                this.committedSnapTarget.y = null;
                this.startingPageIndex.x = this.getPageIndexFromPosition("x", this.startPosition.x);
                this.startingPageIndex.y = this.getPageIndexFromPosition("y", this.startPosition.y);
            }
        }
        /**
         * Applies accumulated velocity to spring for fling behavior
         */
        applyAccumulatedVelocity() {
            // Use weighted average velocity from history for better predictions
            const predictedVelocity = this.getWeightedAverageVelocity();
            this.accumulateVelocity(predictedVelocity);
            // Apply the accumulated velocity to spring
            this.spring.velocity = this.accumulatedVelocity.uniformScale(FLING_MULTIPLIER);
        }
        accumulateVelocity(currentVelocity) {
            const currentTime = getTime() * 1000;
            const timeSinceLastGesture = currentTime - this.lastGestureEndTime;
            // Reset if too much time passed
            if (timeSinceLastGesture > GESTURE_ACCUMULATION_TIME_MS) {
                this.accumulatedVelocity = currentVelocity;
                this.lastGestureEndTime = currentTime;
                return;
            }
            // Calculate time-based decay factor
            const timeFactor = 1 - timeSinceLastGesture / GESTURE_ACCUMULATION_TIME_MS;
            const decayFactor = VELOCITY_DECAY_FACTOR * timeFactor;
            // Accumulate per axis if directions match
            this.accumulatedVelocity.x = this.shouldAccumulateAxis(this.accumulatedVelocity.x, currentVelocity.x)
                ? this.accumulatedVelocity.x * decayFactor + currentVelocity.x
                : currentVelocity.x;
            this.accumulatedVelocity.y = this.shouldAccumulateAxis(this.accumulatedVelocity.y, currentVelocity.y)
                ? this.accumulatedVelocity.y * decayFactor + currentVelocity.y
                : currentVelocity.y;
            this.accumulatedVelocity.z = 0; // Z-axis not used for scrolling
            this.lastGestureEndTime = currentTime;
        }
        /**
         * Helper method to handle non-snapping friction-based scrolling for a single axis
         * @param axis - 'x' or 'y' to indicate which axis to process
         * @param currentPosition - current scroll position
         * @param clampedPosition - clamped bounds position
         * @returns object with updated position and whether position should be updated
         */
        processFrictionScrolling(axis, currentPosition, clampedPosition) {
            const isHorizontal = axis === "x";
            const velocity = isHorizontal ? this.spring.velocityX : this.spring.velocityY;
            const otherAxisVelocity = isHorizontal ? this.spring.velocityY : this.spring.velocityX;
            if (Math.abs(velocity) > MINIMUM_SCROLLING_VELOCITY) {
                const newVelocity = velocity * FRICTION_FACTOR;
                this.spring.velocity = isHorizontal
                    ? new vec3(newVelocity, otherAxisVelocity, this.spring.velocityZ)
                    : new vec3(otherAxisVelocity, newVelocity, this.spring.velocityZ);
                const positionDelta = isHorizontal ? new vec3(newVelocity, 0, 0) : new vec3(0, newVelocity, 0);
                const newPosition = currentPosition.add(positionDelta);
                return { position: newPosition, shouldUpdate: true };
            }
            else if (Math.abs(velocity) > 0) {
                this.spring.velocity = isHorizontal
                    ? new vec3(0, otherAxisVelocity, this.spring.velocityZ)
                    : new vec3(otherAxisVelocity, 0, this.spring.velocityZ);
                const clampedValue = isHorizontal ? clampedPosition.x : clampedPosition.y;
                const newPosition = isHorizontal
                    ? new vec3(clampedValue, currentPosition.y, currentPosition.z)
                    : new vec3(currentPosition.x, clampedValue, currentPosition.z);
                return { position: newPosition, shouldUpdate: true };
            }
            return { position: currentPosition, shouldUpdate: false };
        }
        /**
         * Helper method to handle snap scrolling logic for a single axis
         * Uses spring physics throughout for smooth, consistent motion
         * Includes dynamic deadzone: must scroll more than 1/4 of a snapRegion to trigger movement
         * Smart boundary handling: ensures snap targets are always within valid scroll boundaries
         * @param axis - 'x' or 'y' to indicate which axis to process
         * @param currentPosition - current scroll position
         * @returns object with updated position and whether position should be updated
         */
        processSnapScrolling(axis, currentPosition) {
            const isHorizontal = axis === "x";
            const snapSize = this.snapRegion[axis];
            const currentAxisPosition = this.scrollPosition[axis];
            const velocity = isHorizontal ? this.spring.velocityX : this.spring.velocityY;
            // Check if we have a committed snap target
            let targetPos = this.committedSnapTarget[axis];
            // Only calculate a new target if we don't have one committed yet
            if (targetPos === null) {
                // Determine which page the current position is in
                const currentPageIndex = this.getPageIndexFromPosition(axis, currentAxisPosition);
                const startPageIndex = this.startingPageIndex[axis];
                const hasBounds = this._scrollDimensions[axis] !== -1;
                // Calculate distance traveled from starting page (convert page index to absolute position)
                let startingPagePosition;
                if (hasBounds) {
                    const nearEdge = isHorizontal ? this.rightEdge : this.topEdge;
                    startingPagePosition = nearEdge + startPageIndex * snapSize;
                }
                else {
                    startingPagePosition = startPageIndex * snapSize;
                }
                const distanceFromStart = Math.abs(currentAxisPosition - startingPagePosition);
                // Check if we've exceeded the deadzone (one-quarter of snapRegion)
                const hasExceededDeadzone = distanceFromStart > snapSize / 4;
                let targetPageIndex = currentPageIndex;
                if (hasExceededDeadzone && Math.abs(velocity) > MINIMUM_SCROLLING_VELOCITY) {
                    // Use velocity direction and magnitude to determine target
                    const velocitySign = Math.sign(velocity);
                    const normalizedVelocity = Math.abs(velocity) / snapSize;
                    // More aggressive page advancement based on velocity
                    // Using ceil ensures even small flicks advance at least one page
                    targetPageIndex = currentPageIndex + Math.ceil(normalizedVelocity) * velocitySign;
                }
                else if (!hasExceededDeadzone) {
                    // Within deadzone, snap back to starting page
                    targetPageIndex = startPageIndex;
                }
                // This ensures we always snap to valid, reachable pages
                if (hasBounds) {
                    const nearEdge = isHorizontal ? this.rightEdge : this.topEdge;
                    const farEdge = isHorizontal ? this.leftEdge : this.bottomEdge;
                    const maxValidPageIndex = Math.floor((farEdge - nearEdge) / snapSize);
                    targetPageIndex = MathUtils.clamp(targetPageIndex, 0, maxValidPageIndex);
                }
                // Convert page index to position (bounded: nearEdge-relative, unbounded: center-relative)
                if (hasBounds) {
                    const nearEdge = isHorizontal ? this.rightEdge : this.topEdge;
                    targetPos = nearEdge + targetPageIndex * snapSize;
                }
                else {
                    targetPos = targetPageIndex * snapSize;
                }
                // Commit to this target
                this.committedSnapTarget[axis] = targetPos;
            }
            const distanceToTarget = targetPos - currentAxisPosition;
            // Use spring physics for smooth approach to target
            if (Math.abs(distanceToTarget) > EPSILON) {
                const targetPosition = isHorizontal
                    ? new vec3(targetPos, currentPosition.y, currentPosition.z)
                    : new vec3(currentPosition.x, targetPos, currentPosition.z);
                const newPosition = new vec3(currentPosition.x, currentPosition.y, currentPosition.z);
                this.spring.evaluate(currentPosition, targetPosition, newPosition);
                return { position: newPosition, shouldUpdate: true };
            }
            else {
                // Reached target, clear commitment and stop velocity on this axis
                this.committedSnapTarget[axis] = null;
                if (isHorizontal) {
                    this.spring.velocity = new vec3(0, this.spring.velocityY, this.spring.velocityZ);
                }
                else {
                    this.spring.velocity = new vec3(this.spring.velocityX, 0, this.spring.velocityZ);
                }
                return { position: currentPosition, shouldUpdate: false };
            }
        }
    };
    __setFunctionName(_classThis, "ScrollWindow");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScrollWindow = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScrollWindow = _classThis;
})();
exports.ScrollWindow = ScrollWindow;
//# sourceMappingURL=ScrollWindow.js.map