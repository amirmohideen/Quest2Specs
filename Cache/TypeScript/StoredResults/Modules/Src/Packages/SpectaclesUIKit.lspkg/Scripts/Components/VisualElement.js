"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualElement = void 0;
const FunctionTimingUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils");
const SceneObjectUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/SceneObjectUtils");
const SnapOS2_1 = require("../Themes/SnapOS-2.0/SnapOS2");
const Tooltip_1 = require("../Tooltip");
const UIKitUtilities_1 = require("../Utility/UIKitUtilities");
const DropShadowVisual_1 = require("../Visuals/DropShadowVisual");
const RoundedRectangleVisual_1 = require("../Visuals/RoundedRectangle/RoundedRectangleVisual");
const Element_1 = require("./Element");
const DEFAULT_SHADOW_STYLE = {
    default: {
        baseColor: new vec4(0.043, 0.043, 0.043, 0.4),
        shouldPosition: false,
        shouldScale: false,
        sizeOffset: new vec2(0.05, 0.05),
        spread: 0.2
    },
    hovered: {
        sizeOffset: new vec2(0.35, 0.35),
        spread: 0.5
    },
    triggered: {
        sizeOffset: new vec2(0.2, 0.2),
        spread: 0.3
    },
    toggledHovered: {
        sizeOffset: new vec2(0.35, 0.35),
        spread: 0.5
    },
    toggledTriggered: {
        sizeOffset: new vec2(0.2, 0.2),
        spread: 0.3
    }
};
/**
 * This constant determines how long the user must hover or interact with an element before the tooltip appears.
 */
const TOOLTIP_ACTIVATION_DELAY = 50; //in milliseconds
/**
 * Represents an abstract base class for visual elements in the UI framework.
 * This class extends the `Element` class and provides functionality for managing
 * a visual representation (`Visual`) and handles initialization and event binding for the visual element.
 *
 * @abstract
 */
class VisualElement extends Element_1.Element {
    constructor() {
        super();
        this._style = this._style;
        this._hasShadow = this._hasShadow;
        this._shadowPositionOffset = this._shadowPositionOffset;
        this.visualEventHandlerUnsubscribes = [];
        this.shadow = undefined;
        this.shadowEventHandlerUnsubscribes = [];
    }
    __initialize() {
        super.__initialize();
        this._style = this._style;
        this._hasShadow = this._hasShadow;
        this._shadowPositionOffset = this._shadowPositionOffset;
        this.visualEventHandlerUnsubscribes = [];
        this.shadow = undefined;
        this.shadowEventHandlerUnsubscribes = [];
    }
    /**
     * Gets the type string of the visual element.
     *
     * @returns {string} The type string of the visual element.
     */
    get typeString() {
        return this.constructor.name;
    }
    /**
     * Gets the associated `Visual` instance for this component.
     *
     * @returns {Visual} The `Visual` instance linked to this component.
     */
    get visual() {
        return this._visual;
    }
    /**
     * Gets the style of the visual element.
     *
     * @returns {string} The style of the visual element.
     */
    get style() {
        return this._style;
    }
    /**
     * Sets the associated `Visual` instance for this component.
     *
     * @param value - The `Visual` instance to assign.
     */
    set visual(value) {
        if (value === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._visual, value)) {
            return;
        }
        this.destroyVisual();
        this._visual = value;
        if (this._initialized) {
            this.configureVisual();
            this.setState(this.stateName); // set the new visual to current state
        }
    }
    /**
     * Gets the size of the visual element.
     *
     * @returns {vec3} The size of the visual element.
     */
    get size() {
        return this._size;
    }
    /**
     * Sets the size of the visual element.
     *
     * @param size - A `vec3` representing the dimensions of the visual element.
     */
    set size(size) {
        if (size === undefined) {
            return;
        }
        super.size = size;
        if (this._initialized) {
            this._visual.size = size;
            if (this.shadow) {
                this.shadow.size = size;
            }
        }
    }
    /**
     * Gets the render order of the visual element.
     *
     * @returns {number} The render order of the visual element.
     */
    get renderOrder() {
        return this._renderOrder;
    }
    /**
     * Sets the render order of the visual element.
     *
     * @param value - The render order of the visual element.
     */
    set renderOrder(value) {
        if (value === undefined) {
            return;
        }
        this._renderOrder = value;
        if (this._initialized) {
            this._visual.renderMeshVisual.renderOrder = value;
            if (this._hasShadow && this.shadow) {
                this.shadow.renderMeshVisual.renderOrder = value - 1;
            }
        }
    }
    /**
     * Gets whether the visual element has a shadow.
     *
     * @returns {boolean} Whether the visual element has a shadow.
     */
    get hasShadow() {
        return this._hasShadow;
    }
    /**
     * Sets whether the visual element has a shadow.
     * If the hasShadow is set to true, the shadowVisual object will be created and configured.
     *
     * @param value - Whether the visual element has a shadow.
     */
    set hasShadow(value) {
        if (value === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hasShadow, value)) {
            return;
        }
        this._hasShadow = value;
        if (this._initialized) {
            if (value) {
                this.createShadow();
                this.configureShadow();
                this.shadow.setState(this.stateName);
            }
            else {
                this.destroyShadow();
            }
        }
    }
    /**
     * Gets the associated `DropShadowVisual` instance for this component.
     *
     * @returns {DropShadowVisual | undefined} The `DropShadowVisual` instance linked to this component, if any.
     */
    get shadowVisual() {
        return this.shadow;
    }
    /**
     * Gets the position offset of the shadow.
     *
     * @returns {vec3} The position offset of the shadow.
     */
    get shadowPositionOffset() {
        return this._shadowPositionOffset;
    }
    /**
     * Sets the position offset of the shadow.
     *
     * @param value - The position offset of the shadow.
     */
    set shadowPositionOffset(value) {
        if (value === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._shadowPositionOffset, value)) {
            return;
        }
        this._shadowPositionOffset = value;
        if (this._initialized && this.shadow) {
            this.shadow.transform.setLocalPosition(this.currentPosition.uniformScale(-1).add(this._shadowPositionOffset));
        }
    }
    /**
     * Initializes the visual element and its associated properties and events.
     *
     * @override
     */
    initialize() {
        if (this._initialized) {
            return;
        }
        this.createDefaultVisual();
        this.createShadow();
        this._visual.renderMeshVisual.renderOrder = this._renderOrder;
        if (this.shadow) {
            this.shadow.renderMeshVisual.renderOrder = this._renderOrder - 1;
        }
        super.initialize();
        this.configureVisual();
        this.configureShadow();
        this.visual.onPositionChanged.add((args) => {
            this.currentPosition = args.current;
            this.updateCollider();
        });
        this.visual.onScaleChanged.add((args) => {
            this.currentScale = args.current;
            this.updateCollider();
        });
        if (!this.tooltip) {
            const tooltipComponents = (0, SceneObjectUtils_1.findAllComponentsInSelfOrChildren)(this.sceneObject, Tooltip_1.Tooltip.getTypeName());
            if (tooltipComponents.length > 0) {
                this.registerTooltip(tooltipComponents[0]);
            }
        }
        this.setState(this.stateName);
    }
    /**
     * Registers a tooltip instance with the current component
     *
     * @param tooltip - The Tooltip instance to associate with this component.
     */
    registerTooltip(tooltip) {
        this.tooltip = tooltip;
        this.tooltip.setOn(false);
    }
    /**
     * Sets the tooltip text for the visual element.
     *
     * @param text - The text to be displayed in the tooltip.
     */
    setTooltip(text) {
        if (this.tooltip) {
            if (this.tooltip.tip !== text) {
                this.tooltip.tip = text;
            }
        }
    }
    configureVisual() {
        if (this._visual) {
            this.visualEventHandlerUnsubscribes.push(this._visual.onDestroyed.add(() => {
                this._visual = null;
            }));
            this._visual.initialize();
            this._visual.size = this._size;
        }
    }
    createShadow() {
        if (this._hasShadow) {
            const shadowObject = global.scene.createSceneObject(this.sceneObject.name + " Shadow");
            this.managedSceneObjects.add(shadowObject);
            shadowObject.setParent(this.sceneObject);
            this.shadow = new DropShadowVisual_1.DropShadowVisual({ sceneObject: shadowObject, style: DEFAULT_SHADOW_STYLE });
        }
    }
    configureShadow() {
        if (this.shadow) {
            this.shadowEventHandlerUnsubscribes.push(this.shadow.onDestroyed.add(() => {
                this.shadow = undefined;
            }), this.visual.onPositionChanged.add((args) => {
                this.shadow.transform.setLocalPosition(args.current.uniformScale(-1).add(this._shadowPositionOffset));
            }));
            this.shadow.size = this.size;
            if (this.visual instanceof RoundedRectangleVisual_1.RoundedRectangleVisual) {
                this.shadow.cornerRadius = this.visual.cornerRadius;
            }
            const shadowTransform = this.shadow.transform;
            shadowTransform.setLocalPosition(this.currentPosition.uniformScale(-1).add(this._shadowPositionOffset));
            shadowTransform.setLocalRotation(quat.quatIdentity());
        }
    }
    onEnabled() {
        super.onEnabled();
        this.enableVisuals();
    }
    onDisabled() {
        super.onDisabled();
        this.disableVisuals();
    }
    enableVisuals() {
        if (this._initialized) {
            if (!isNull(this.visual) && this.visual) {
                this.visual.enable();
            }
            if (!isNull(this.shadow) && this.shadow) {
                this.shadow.enable();
            }
        }
    }
    disableVisuals() {
        if (this._initialized) {
            if (!isNull(this.visual) && this.visual) {
                this.visual.disable();
            }
            if (!isNull(this.shadow) && this.shadow) {
                this.shadow.disable();
            }
        }
    }
    destroyVisual() {
        this.visualEventHandlerUnsubscribes.forEach((unsubscribe) => unsubscribe());
        this.visualEventHandlerUnsubscribes = [];
        if (this._visual) {
            this._visual.destroy();
        }
    }
    destroyShadow() {
        this.shadowEventHandlerUnsubscribes.forEach((unsubscribe) => unsubscribe());
        this.shadowEventHandlerUnsubscribes = [];
        if (this.shadow) {
            this.shadow.destroy();
        }
    }
    release() {
        if (!isNull(this._visual) && this._visual) {
            this._visual.destroy();
        }
        if (!isNull(this.shadow) && this.shadow) {
            this.shadow.destroy();
        }
        super.release();
    }
    setState(stateName) {
        this._visual?.setState(stateName);
        if (this.shadow) {
            this.shadow.setState(stateName);
        }
        super.setState(stateName);
    }
    onHoverEnterHandler(event) {
        this.setTooltipState(true);
        super.onHoverEnterHandler(event);
    }
    onHoverExitHandler(event) {
        this.setTooltipState(false);
        super.onHoverExitHandler(event);
    }
    updateCollider() {
        if (this._colliderFitElement) {
            const delta = this.deltaPosition.div(this.deltaScale);
            this.colliderShape.size = this._size.add(delta);
            this.collider.shape = this.colliderShape;
            this.colliderTransform.setLocalPosition(delta.uniformScale(-1 / 2));
        }
    }
    setTooltipState(isOn) {
        if (this.tooltip) {
            if (isOn) {
                this.tooltipCancelToken = (0, FunctionTimingUtils_1.setTimeout)(() => {
                    if (this.tooltipCancelToken && !this.tooltipCancelToken.cancelled) {
                        this.tooltip.setOn(true);
                    }
                }, TOOLTIP_ACTIVATION_DELAY);
            }
            else {
                (0, FunctionTimingUtils_1.clearTimeout)(this.tooltipCancelToken);
                this.tooltip.setOn(false);
            }
            const unsubscribe = this.tooltip.onDestroy.add(() => {
                (0, FunctionTimingUtils_1.clearTimeout)(this.tooltipCancelToken);
                this.tooltipCancelToken = null;
                this.tooltip = null;
                unsubscribe();
            });
        }
    }
}
exports.VisualElement = VisualElement;
//# sourceMappingURL=VisualElement.js.map