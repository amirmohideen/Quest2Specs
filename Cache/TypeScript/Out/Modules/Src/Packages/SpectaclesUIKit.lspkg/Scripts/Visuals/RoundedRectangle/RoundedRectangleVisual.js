"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundedRectangleVisual = void 0;
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const color_1 = require("SpectaclesInteractionKit.lspkg/Utils/color");
const Element_1 = require("../../Components/Element");
const UIKitUtilities_1 = require("../../Utility/UIKitUtilities");
const Visual_1 = require("../Visual");
const RoundedRectangle_1 = require("./RoundedRectangle");
const BACKGROUND_GRADIENT_PARAMETERS = {
    default: {
        enabled: true,
        type: "Rectangle",
        stop0: { enabled: true, percent: 0, color: Visual_1.COLORS.darkGray },
        stop1: { enabled: true, percent: 0.5, color: Visual_1.COLORS.darkGray },
        stop2: { enabled: true, percent: 0.95, color: Visual_1.COLORS.darkGray },
        stop3: { enabled: true, percent: 0.99, color: Visual_1.COLORS.darkGray }
    },
    hovered: {
        enabled: true,
        type: "Rectangle",
        stop0: { enabled: true, percent: 0, color: Visual_1.COLORS.darkGray },
        stop1: { enabled: true, percent: 0.5, color: Visual_1.COLORS.darkGray },
        stop2: { enabled: true, percent: 0.95, color: Visual_1.COLORS.darkGray },
        stop3: { enabled: true, percent: 0.99, color: Visual_1.COLORS.darkGray }
    },
    toggled: {
        enabled: true,
        type: "Rectangle",
        stop0: { enabled: true, percent: -1, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.3), 1) },
        stop1: { enabled: true, percent: -1, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.3), 1) },
        stop2: { enabled: true, percent: -1, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.3), 1) },
        stop3: { enabled: true, percent: 3, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.9), 1) }
    }
};
const BORDER_GRADIENT_PARAMETERS = {
    default: {
        enabled: true,
        start: new vec2(-1, 0),
        end: new vec2(1, 0),
        stop0: { enabled: true, percent: 0, color: Visual_1.COLORS.lightGray },
        stop1: { enabled: true, percent: 0.5, color: (0, color_1.withAlpha)(Visual_1.COLORS.lightGray.uniformScale(0.66), 1) },
        stop2: { enabled: true, percent: 1, color: Visual_1.COLORS.lightGray }
    },
    hovered: {
        enabled: true,
        start: new vec2(-1, 0),
        end: new vec2(1, 0),
        stop0: { enabled: true, percent: 0, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.9), 1) },
        stop1: { enabled: true, percent: 0.5, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.66), 1) },
        stop2: { enabled: true, percent: 1, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.9), 1) }
    },
    toggled: {
        enabled: true,
        start: new vec2(-1, 0),
        end: new vec2(1, 0),
        stop0: { enabled: true, percent: 0, color: Visual_1.COLORS.brightYellow },
        stop1: { enabled: true, percent: 0.5, color: Visual_1.COLORS.brightYellow },
        stop2: { enabled: true, percent: 1, color: Visual_1.COLORS.brightYellow }
    },
    toggledHovered: {
        enabled: true,
        start: new vec2(-1, 0),
        end: new vec2(1, 0),
        stop0: { enabled: true, percent: 0, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.9), 1) },
        stop1: { enabled: true, percent: 0.5, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.66), 1) },
        stop2: { enabled: true, percent: 1, color: (0, color_1.withAlpha)(Visual_1.COLORS.brightYellow.uniformScale(0.9), 1) }
    }
};
/**
 * The `RoundedRectangleVisual` class represents a visual component that renders a rounded rectangle
 * with customizable properties such as border, gradients, and colors. It extends the base `Visual` class
 * and provides additional functionality specific to rounded rectangles.
 *
 * @extends Visual
 */
class RoundedRectangleVisual extends Visual_1.Visual {
    get visualStates() {
        return this._roundedRectangleVisualStates;
    }
    /**
     * Gets the size of the RoundedRectangleVisual.
     *
     * @returns A `vec3` representing the dimensions of the RoundedRectangleVisual.
     */
    get size() {
        return super.size;
    }
    /**
     * Sets the size of the RoundedRectangleVisual.
     * Updates both the internal `_size` property.
     *
     * @param size - A `vec3` object representing the dimensions of the RoundedRectangleVisual.
     */
    set size(size) {
        if (size === undefined) {
            return;
        }
        super.size = size;
        if (this.initialized) {
            this.roundedRectangle.size = new vec2(size.x, size.y);
        }
    }
    /**
     * Gets the `RenderMeshVisual` associated with the rounded rectangle.
     *
     * @returns {RenderMeshVisual} The visual representation of the rounded rectangle's mesh.
     */
    get renderMeshVisual() {
        return this.roundedRectangle.renderMeshVisual;
    }
    /**
     * Retrieves the base color of the rounded rectangle visual.
     *
     * @returns {vec4} The background color of the rounded rectangle as a `vec4` value.
     */
    get baseColor() {
        return this.roundedRectangle.backgroundColor;
    }
    /**
     * Indicates whether the rounded rectangle visual has a border.
     *
     * @returns `true` if the visual has a border; otherwise, `false`.
     */
    get hasBorder() {
        return this._hasBorder;
    }
    /**
     * Gets the size of the border for the rounded rectangle.
     *
     * @returns The border size as a number.
     */
    get borderSize() {
        return this.roundedRectangle.borderSize;
    }
    /**
     * Updates the visual state of the RoundedRectangleVisual component.
     *
     * This method overrides the base `setState` method to apply visual updates
     * specific to the RoundedRectangleVisual, such as gradients and border colors.
     *
     * @param stateName - The new state to apply, represented as a `stateName` object.
     */
    setState(stateName) {
        super.setState(stateName);
        if (this.initialized) {
            this.updateBaseType(this._state.baseType);
            this.updateGradient(this._state.baseGradient);
            this.updateBaseTexture(this._state.baseTexture);
            this.updateHasBorder(this._state.hasBorder);
            this.updateBorderType(this._state.borderType);
            this.updateBorderColors(this._state.borderColor);
            this.updateBorderGradient(this._state.borderGradient);
            this.updateBorderSize(this._state.borderSize);
        }
    }
    /**
     * Constructs a new instance of the `RoundedRectangleVisual` class.
     *
     * @param sceneObject - The parent `SceneObject` to which this visual will be attached.
     */
    constructor(args) {
        super(args);
        this._defaultBaseType = "Color";
        this._hoveredBaseType = "Color";
        this._triggeredBaseType = "Color";
        this._inactiveBaseType = "Color";
        this._toggledDefaultBaseType = "Color";
        this._toggledHoveredBaseType = "Color";
        this._toggledTriggeredBaseType = "Color";
        this._defaultGradient = BACKGROUND_GRADIENT_PARAMETERS.default;
        this._hoveredGradient = BACKGROUND_GRADIENT_PARAMETERS.default;
        this._triggeredGradient = BACKGROUND_GRADIENT_PARAMETERS.toggled;
        this._inactiveGradient = BACKGROUND_GRADIENT_PARAMETERS.default;
        this._toggledDefaultGradient = BACKGROUND_GRADIENT_PARAMETERS.default;
        this._toggledHoveredGradient = BACKGROUND_GRADIENT_PARAMETERS.default;
        this._toggledTriggeredGradient = BACKGROUND_GRADIENT_PARAMETERS.toggled;
        this._defaultTexture = null;
        this._hoveredTexture = null;
        this._triggeredTexture = null;
        this._inactiveTexture = null;
        this._toggledDefaultTexture = null;
        this._toggledHoveredTexture = null;
        this._toggledTriggeredTexture = null;
        this._defaultHasBorder = false;
        this._hoveredHasBorder = false;
        this._triggeredHasBorder = false;
        this._inactiveHasBorder = false;
        this._toggledDefaultHasBorder = false;
        this._toggledHoveredHasBorder = false;
        this._toggledTriggeredHasBorder = false;
        this._defaultBorderType = "Gradient";
        this._hoveredBorderType = "Gradient";
        this._triggeredBorderType = "Gradient";
        this._inactiveBorderType = "Gradient";
        this._toggledDefaultBorderType = "Gradient";
        this._toggledHoveredBorderType = "Gradient";
        this._toggledTriggeredBorderType = "Gradient";
        this._defaultBorderSize = 0.1;
        this._hoveredBorderSize = 0.1;
        this._triggeredBorderSize = 0.1;
        this._inactiveBorderSize = 0.1;
        this._toggledDefaultBorderSize = 0.1;
        this._toggledHoveredBorderSize = 0.1;
        this._toggledTriggeredBorderSize = 0.1;
        this._borderDefaultColor = Visual_1.COLORS.lightGray;
        this._borderHoveredColor = Visual_1.COLORS.brightYellow;
        this._borderTriggeredColor = Visual_1.COLORS.brightYellow;
        this._borderInactiveColor = Visual_1.INACTIVE_COLOR;
        this._borderToggledDefaultColor = Visual_1.COLORS.brightYellow;
        this._borderToggledHoveredColor = Visual_1.COLORS.brightYellow;
        this._borderToggledTriggeredColor = Visual_1.COLORS.brightYellow;
        this._borderDefaultGradient = BORDER_GRADIENT_PARAMETERS.default;
        this._borderHoveredGradient = BORDER_GRADIENT_PARAMETERS.hover;
        this._borderTriggeredGradient = BORDER_GRADIENT_PARAMETERS.toggled;
        this._borderInactiveGradient = BORDER_GRADIENT_PARAMETERS.default;
        this._borderToggledDefaultGradient = BORDER_GRADIENT_PARAMETERS.toggled;
        this._borderToggledHoveredGradient = BORDER_GRADIENT_PARAMETERS.toggledHovered;
        this._borderToggledTriggeredGradient = BORDER_GRADIENT_PARAMETERS.toggled;
        this._gradientChangeCancelSet = new animate_1.CancelSet();
        this.currentGradient = this.defaultGradient;
        this._hasBorder = false;
        this._borderColorChangeCancelSet = new animate_1.CancelSet();
        this._borderGradientChangeCancelSet = new animate_1.CancelSet();
        this.currentBorderGradient = this.borderDefaultGradient;
        this._state = undefined;
        this.prevState = undefined;
        this._sceneObject = args.sceneObject;
        this.roundedRectangle = this._sceneObject.createComponent(RoundedRectangle_1.RoundedRectangle.getTypeName());
        this.managedComponents.push(this.roundedRectangle);
        this.roundedRectangle.initialize();
        this.roundedRectangle.size = new vec2(this.size.x, this.size.y);
        this._transform = this._sceneObject.getTransform();
        if (args.transparent) {
            this.renderMeshVisual.mainPass.colorMask = new vec4b(true, true, true, true);
            this.renderMeshVisual.mainPass.blendMode = BlendMode.PremultipliedAlphaAuto;
        }
        this.initialize();
    }
    destroy() {
        this._gradientChangeCancelSet.cancel();
        this._borderColorChangeCancelSet.cancel();
        this._borderGradientChangeCancelSet.cancel();
        super.destroy();
    }
    set baseColor(value) {
        this.roundedRectangle.backgroundColor = value;
    }
    updateColors(meshColor) {
        if (this.baseType !== "Color") {
            return;
        }
        super.updateColors(meshColor);
    }
    /****  Rounded Rectangle explicit  ******************/
    /**
     * Gets the corner radius of the rounded rectangle.
     *
     * @returns The current corner radius of the rounded rectangle in pixels.
     */
    get cornerRadius() {
        return this.roundedRectangle.cornerRadius;
    }
    /**
     * Sets the corner radius of the rounded rectangle.
     *
     * @param cornerRadius - The radius of the corners in pixels.
     */
    set cornerRadius(cornerRadius) {
        if (cornerRadius === undefined) {
            return;
        }
        this.roundedRectangle.cornerRadius = cornerRadius;
    }
    /**
     * Whether the rounded rectangle uses a gradient for its base(background).
     */
    get baseType() {
        if (this.roundedRectangle.useTexture) {
            return "Texture";
        }
        else if (this.roundedRectangle.gradient) {
            return "Gradient";
        }
        else {
            return "Color";
        }
    }
    /**
     * Whether the rounded rectangle uses a gradient for its base(background).
     *
     * @param gradient - A boolean indicating whether to use a gradient (`true`) or a solid color (`false`).
     */
    set baseType(gradient) {
        if (gradient === undefined) {
            return;
        }
        switch (gradient) {
            case "Color":
                this.roundedRectangle.gradient = false;
                this.roundedRectangle.useTexture = false;
                break;
            case "Gradient":
                this.roundedRectangle.gradient = true;
                this.roundedRectangle.useTexture = false;
                break;
            case "Texture":
                this.roundedRectangle.gradient = false;
                this.roundedRectangle.useTexture = true;
                break;
        }
    }
    /**
     * Gets the default gradient parameters for the visual.
     *
     * @returns The default gradient parameters.
     */
    get defaultGradient() {
        return this._defaultGradient;
    }
    /**
     * Sets the default gradient parameters for the visual and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set as the default.
     */
    set defaultGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultGradient, gradient)) {
            return;
        }
        this._defaultGradient = gradient;
        if (!this.shouldColorChange && this.baseType === "Gradient") {
            this.roundedRectangle.setBackgroundGradient(gradient);
        }
        else if (this.shouldColorChange) {
            if (this.initialized) {
                this.needsVisualStateUpdate = true;
            }
        }
    }
    /**
     * Gets the hovered gradient parameters for the visual.
     *
     * @returns The hovered gradient parameters.
     */
    get hoveredGradient() {
        return this._hoveredGradient;
    }
    /**
     * Sets the hovered gradient parameters for the visual and initializes the visual states.
     *
     * @param hoveredGradient - The gradient parameters to be set for the hovered state.
     */
    set hoveredGradient(hoveredGradient) {
        if (hoveredGradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredGradient, hoveredGradient)) {
            return;
        }
        this._hoveredGradient = hoveredGradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the triggered gradient parameters for the visual.
     *
     * @returns The triggered gradient parameters.
     */
    get triggeredGradient() {
        return this._triggeredGradient;
    }
    /**
     * Sets the triggered gradient parameters for the visual and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the triggered state.
     */
    set triggeredGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredGradient, gradient)) {
            return;
        }
        this._triggeredGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the toggled default gradient parameters for the visual.
     *
     * @returns The toggled default gradient parameters.
     */
    get toggledDefaultGradient() {
        return this._toggledDefaultGradient;
    }
    /**
     * Sets the toggled default gradient parameters for the visual and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the toggled default state.
     */
    set toggledDefaultGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultGradient, gradient)) {
            return;
        }
        this._toggledDefaultGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the toggled hovered gradient parameters for the visual.
     *
     * @returns The toggled hovered gradient parameters.
     */
    get toggledHoveredGradient() {
        return this._toggledHoveredGradient;
    }
    /**
     * Sets the toggled hovered gradient parameters for the visual and initializes the visual states.
     *
     * @param toggledHoveredGradient - The gradient parameters to be set for the toggled hovered state.
     */
    set toggledHoveredGradient(toggledHoveredGradient) {
        if (toggledHoveredGradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredGradient, toggledHoveredGradient)) {
            return;
        }
        this._toggledHoveredGradient = toggledHoveredGradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the toggled triggered gradient parameters for the visual.
     *
     * @returns The toggled triggered gradient parameters.
     */
    get toggledTriggeredGradient() {
        return this._toggledTriggeredGradient;
    }
    /**
     * Sets the toggled triggered gradient parameters for the visual and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the toggled triggered state.
     */
    set toggledTriggeredGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledTriggeredGradient, gradient)) {
            return;
        }
        this._toggledTriggeredGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the inactive gradient parameters for the visual.
     *
     * @returns The inactive gradient parameters.
     */
    get inactiveGradient() {
        return this._inactiveGradient;
    }
    /**
     * Sets the inactive gradient parameters for the visual and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the inactive state.
     */
    set inactiveGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveGradient, gradient)) {
            return;
        }
        this._inactiveGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Sets the gradient start and end positions for the base of the rounded rectangle.
     *
     * @param gradientStartPosition - A 2D vector representing the starting position of the gradient.
     * @param gradientEndPosition - A 2D vector representing the ending position of the gradient.
     */
    setBaseGradientPositions(gradientStartPosition, gradientEndPosition) {
        this.roundedRectangle.gradientStartPosition = gradientStartPosition;
        this.roundedRectangle.gradientEndPosition = gradientEndPosition;
    }
    /**
     * Gets the default texture for the rounded rectangle.
     *
     * @returns The default texture as a `Texture` value.
     */
    get defaultTexture() {
        return this._defaultTexture;
    }
    /**
     * Sets the default texture for the rounded rectangle.
     *
     * @param texture - The texture to be set for the default state.
     */
    set defaultTexture(texture) {
        if (texture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultTexture, texture)) {
            return;
        }
        this._defaultTexture = texture;
    }
    /**
     * Gets the hovered texture for the rounded rectangle.
     *
     * @returns The hovered texture as a `Texture` value.
     */
    get hoveredTexture() {
        return this._hoveredTexture;
    }
    /**
     * Sets the hovered texture for the rounded rectangle.
     *
     * @param hoveredTexture - The texture to be set for the hovered state.
     */
    set hoveredTexture(hoveredTexture) {
        if (hoveredTexture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredTexture, hoveredTexture)) {
            return;
        }
        this._hoveredTexture = hoveredTexture;
    }
    /**
     * Gets the triggered texture for the rounded rectangle.
     *
     * @returns The triggered texture as a `Texture` value.
     */
    get triggeredTexture() {
        return this._triggeredTexture;
    }
    /**
     * Sets the triggered texture for the rounded rectangle.
     *
     * @param texture - The texture to be set for the triggered state.
     */
    set triggeredTexture(texture) {
        if (texture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredTexture, texture)) {
            return;
        }
        this._triggeredTexture = texture;
    }
    /**
     * Gets the inactive texture for the rounded rectangle.
     *
     * @returns The inactive texture as a `Texture` value.
     */
    get inactiveTexture() {
        return this._inactiveTexture;
    }
    /**
     * Sets the inactive texture for the rounded rectangle.
     *
     * @param texture - The texture to be set for the inactive state.
     */
    set inactiveTexture(texture) {
        if (texture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveTexture, texture)) {
            return;
        }
        this._inactiveTexture = texture;
    }
    /**
     * Gets the toggled default texture for the rounded rectangle.
     *
     * @returns The toggled default texture as a `Texture` value.
     */
    get toggledDefaultTexture() {
        return this._toggledDefaultTexture;
    }
    /**
     * Sets the toggled default texture for the rounded rectangle.
     *
     * @param texture - The texture to be set for the toggled default state.
     */
    set toggledDefaultTexture(texture) {
        if (texture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultTexture, texture)) {
            return;
        }
        this._toggledDefaultTexture = texture;
    }
    /**
     * Gets the toggled hovered texture for the rounded rectangle.
     *
     * @returns The toggled hovered texture as a `Texture` value.
     */
    get toggledHoveredTexture() {
        return this._toggledHoveredTexture;
    }
    /**
     * Sets the toggled hovered texture for the rounded rectangle.
     *
     * @param toggledHoveredTexture - The texture to be set for the toggled hovered state.
     */
    set toggledHoveredTexture(toggledHoveredTexture) {
        if (toggledHoveredTexture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredTexture, toggledHoveredTexture)) {
            return;
        }
        this._toggledHoveredTexture = toggledHoveredTexture;
    }
    /**
     * Gets the toggled triggered texture for the rounded rectangle.
     *
     * @returns The toggled triggered texture as a `Texture` value.
     */
    get toggledTriggeredTexture() {
        return this._toggledTriggeredTexture;
    }
    /**
     * Sets the toggled triggered texture for the rounded rectangle.
     *
     * @param texture - The texture to be set for the toggled triggered state.
     */
    set toggledTriggeredTexture(texture) {
        if (texture === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledTriggeredTexture, texture)) {
            return;
        }
        this._toggledTriggeredTexture = texture;
    }
    /**
     * Gets the type of border for the rounded rectangle.
     *
     * @returns The type of border, which can be either "Color" or "Gradient".
     */
    get isBorderGradient() {
        return this.roundedRectangle.borderType === "Gradient";
    }
    /**
     * Sets whether the rounded rectangle uses a gradient for its border.
     *
     * @param gradient - A boolean indicating whether to use a gradient (`true`) or a solid color (`false`) for the border.
     */
    set isBorderGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        this.roundedRectangle.borderType = gradient ? "Gradient" : "Color";
    }
    /**
     * Gets the default color for the border of the rounded rectangle.
     *
     * @returns The default border color as a `vec4` value.
     */
    get borderDefaultColor() {
        return this._borderDefaultColor;
    }
    /**
     * Sets the default color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param color - The default color to be set for the border.
     */
    set borderDefaultColor(color) {
        if (color === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderDefaultColor, color)) {
            return;
        }
        this._borderDefaultColor = color;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the hovered color for the border of the rounded rectangle.
     *
     * @returns The hovered border color as a `vec4` value.
     */
    get borderHoveredColor() {
        return this._borderHoveredColor;
    }
    /**
     * Sets the hovered color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param borderHoveredColor - The hovered color to be set for the border.
     */
    set borderHoveredColor(borderHoveredColor) {
        if (borderHoveredColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderHoveredColor, borderHoveredColor)) {
            return;
        }
        this._borderHoveredColor = borderHoveredColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the triggered color for the border of the rounded rectangle.
     *
     * @returns The triggered border color as a `vec4` value.
     */
    get borderTriggeredColor() {
        return this._borderTriggeredColor;
    }
    /**
     * Sets the triggered color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param color - The triggered color to be set for the border.
     */
    set borderTriggeredColor(color) {
        if (color === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderTriggeredColor, color)) {
            return;
        }
        this._borderTriggeredColor = color;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the gradient parameters for the toggled default state of the border.
     */
    get borderToggledDefaultGradient() {
        return this._borderToggledDefaultGradient;
    }
    /**
     * Sets the gradient parameters for the toggled default state of the border
     */
    set borderToggledDefaultGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderToggledDefaultGradient, gradient)) {
            return;
        }
        this._borderToggledDefaultGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the gradient parameters for the toggled hovered state of the border.
     */
    get borderToggledHoveredGradient() {
        return this._borderToggledHoveredGradient;
    }
    /**
     * Sets the gradient parameters for the toggled hovered state of the border and initializes the visual states.
     */
    set borderToggledHoveredGradient(borderToggledHoveredGradient) {
        if (borderToggledHoveredGradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderToggledHoveredGradient, borderToggledHoveredGradient)) {
            return;
        }
        this._borderToggledHoveredGradient = borderToggledHoveredGradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the gradient parameters for the toggled triggered state of the border.
     */
    get borderToggledTriggeredGradient() {
        return this._borderToggledTriggeredGradient;
    }
    /**
     * Sets the gradient parameters for the toggled triggered state of the border and initializes the visual states.
     */
    set borderToggledTriggeredGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderToggledTriggeredGradient, gradient)) {
            return;
        }
        this._borderToggledTriggeredGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the inactive color for the border of the rounded rectangle.
     *
     * @returns The inactive border color as a `vec4` value.
     */
    get borderInactiveColor() {
        return this._borderInactiveColor;
    }
    /**
     * Sets the inactive color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param color - The inactive color to be set for the border.
     */
    set borderInactiveColor(color) {
        if (color === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderInactiveColor, color)) {
            return;
        }
        this._borderInactiveColor = color;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the toggled default color for the border of the rounded rectangle.
     *
     * @returns The toggled default border color as a `vec4` value.
     */
    get borderToggledDefaultColor() {
        return this._borderToggledDefaultColor;
    }
    /**
     * Sets the toggled default color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param color - The toggled default color to be set for the border.
     */
    set borderToggledDefaultColor(color) {
        if (color === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderToggledDefaultColor, color)) {
            return;
        }
        this._borderToggledDefaultColor = color;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the toggled hovered color for the border of the rounded rectangle.
     *
     * @returns The toggled hovered border color as a `vec4` value.
     */
    get borderToggledHoveredColor() {
        return this._borderToggledHoveredColor;
    }
    /**
     * Sets the toggled hovered color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param borderToggledHoveredColor - The toggled hovered color to be set for the border.
     */
    set borderToggledHoveredColor(borderToggledHoveredColor) {
        if (borderToggledHoveredColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderToggledHoveredColor, borderToggledHoveredColor)) {
            return;
        }
        this._borderToggledHoveredColor = borderToggledHoveredColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the toggled triggered color for the border of the rounded rectangle.
     *
     * @returns The toggled triggered border color as a `vec4` value.
     */
    get borderToggledTriggeredColor() {
        return this._borderToggledTriggeredColor;
    }
    /**
     * Sets the toggled triggered color for the border of the rounded rectangle and initializes the visual states.
     *
     * @param color - The toggled triggered color to be set for the border.
     */
    set borderToggledTriggeredColor(color) {
        if (color === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderToggledTriggeredColor, color)) {
            return;
        }
        this._borderToggledTriggeredColor = color;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the default gradient parameters for the border of the rounded rectangle.
     *
     * @returns The default border gradient parameters.
     */
    get borderDefaultGradient() {
        return this._borderDefaultGradient;
    }
    /**
     * Sets the gradient parameters for the default state of the border and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the default state of the border.
     */
    set borderDefaultGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderDefaultGradient, gradient)) {
            return;
        }
        this._borderDefaultGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the gradient parameters for the hovered state of the border.
     *
     * @returns The hovered border gradient parameters.
     */
    get borderHoveredGradient() {
        return this._borderHoveredGradient;
    }
    /**
     * Sets the gradient parameters for the hovered state of the border and initializes the visual states.
     *
     * @param borderHoveredGradient - The gradient parameters to be set for the hovered state of the border.
     */
    set borderHoveredGradient(borderHoveredGradient) {
        if (borderHoveredGradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderHoveredGradient, borderHoveredGradient)) {
            return;
        }
        this._borderHoveredGradient = borderHoveredGradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the gradient parameters for the triggered state of the border.
     *
     * @returns The triggered border gradient parameters.
     */
    get borderTriggeredGradient() {
        return this._borderTriggeredGradient;
    }
    /**
     * Sets the gradient parameters for the triggered state of the border and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the triggered state of the border.
     */
    set borderTriggeredGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderTriggeredGradient, gradient)) {
            return;
        }
        this._borderTriggeredGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the gradient parameters for the inactive state of the border.
     *
     * @returns The inactive border gradient parameters.
     */
    get borderInactiveGradient() {
        return this._borderInactiveGradient;
    }
    /**
     * Sets the gradient parameters for the inactive state of the border and initializes the visual states.
     *
     * @param gradient - The gradient parameters to be set for the inactive state of the border.
     */
    set borderInactiveGradient(gradient) {
        if (gradient === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._borderInactiveGradient, gradient)) {
            return;
        }
        this._borderInactiveGradient = gradient;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Sets the start and end positions for the border gradient of the rounded rectangle.
     *
     * @param gradientStartPosition - A 2D vector representing the starting position of the border gradient.
     * @param gradientEndPosition - A 2D vector representing the ending position of the border gradient.
     */
    setBorderGradientPositions(gradientStartPosition, gradientEndPosition) {
        this.roundedRectangle.borderGradientStartPosition = gradientStartPosition;
        this.roundedRectangle.borderGradientEndPosition = gradientEndPosition;
    }
    /**
     * Gets the base type for the default state.
     *
     * @returns The base type for the default state.
     */
    get defaultBaseType() {
        return this._defaultBaseType;
    }
    /**
     * Sets the base type for the default state and initializes the visual states.
     *
     * @param baseType - The base type to be set for the default state.
     */
    set defaultBaseType(baseType) {
        if (baseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultBaseType, baseType)) {
            return;
        }
        this._defaultBaseType = baseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the base type for the hovered state.
     *
     * @returns The base type for the hovered state.
     */
    get hoveredBaseType() {
        return this._hoveredBaseType;
    }
    /**
     * Sets the base type for the hovered state and initializes the visual states.
     *
     * @param hoveredBaseType - The base type to be set for the hovered state.
     */
    set hoveredBaseType(hoveredBaseType) {
        if (hoveredBaseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredBaseType, hoveredBaseType)) {
            return;
        }
        this._hoveredBaseType = hoveredBaseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the base type for the triggered state.
     *
     * @returns The base type for the triggered state.
     */
    get triggeredBaseType() {
        return this._triggeredBaseType;
    }
    /**
     * Sets the base type for the triggered state and initializes the visual states.
     *
     * @param baseType - The base type to be set for the triggered state.
     */
    set triggeredBaseType(baseType) {
        if (baseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredBaseType, baseType)) {
            return;
        }
        this._triggeredBaseType = baseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the base type for the inactive state.
     *
     * @returns The base type for the inactive state.
     */
    get inactiveBaseType() {
        return this._inactiveBaseType;
    }
    /**
     * Sets the base type for the inactive state and initializes the visual states.
     *
     * @param baseType - The base type to be set for the inactive state.
     */
    set inactiveBaseType(baseType) {
        if (baseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveBaseType, baseType)) {
            return;
        }
        this._inactiveBaseType = baseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the base type for the toggled default state.
     *
     * @returns The base type for the toggled default state.
     */
    get toggledDefaultBaseType() {
        return this._toggledDefaultBaseType;
    }
    /**
     * Sets the base type for the toggled default state and initializes the visual states.
     *
     * @param baseType - The base type to be set for the toggled default state.
     */
    set toggledDefaultBaseType(baseType) {
        if (baseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultBaseType, baseType)) {
            return;
        }
        this._toggledDefaultBaseType = baseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the base type for the toggled hovered state.
     *
     * @returns The base type for the toggled hovered state.
     */
    get toggledHoveredBaseType() {
        return this._toggledHoveredBaseType;
    }
    /**
     * Sets the base type for the toggled hovered state and initializes the visual states.
     *
     * @param toggledHoveredBaseType - The base type to be set for the toggled hovered state.
     */
    set toggledHoveredBaseType(toggledHoveredBaseType) {
        if (toggledHoveredBaseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredBaseType, toggledHoveredBaseType)) {
            return;
        }
        this._toggledHoveredBaseType = toggledHoveredBaseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the base type for the toggled triggered state.
     *
     * @returns The base type for the toggled triggered state.
     */
    get toggledTriggeredBaseType() {
        return this._toggledTriggeredBaseType;
    }
    /**
     * Sets the base type for the toggled triggered state and initializes the visual states.
     *
     * @param baseType - The base type to be set for the toggled triggered state.
     */
    set toggledTriggeredBaseType(baseType) {
        if (baseType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledTriggeredBaseType, baseType)) {
            return;
        }
        this._toggledTriggeredBaseType = baseType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the default state has a border.
     *
     * @returns `true` if the default state has a border; otherwise, `false`.
     */
    get defaultHasBorder() {
        return this._defaultHasBorder;
    }
    /**
     * Sets whether the default state has a border and initializes the visual states.
     *
     * @param hasBorder - A boolean indicating whether the default state should have a border.
     */
    set defaultHasBorder(hasBorder) {
        if (hasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultHasBorder, hasBorder)) {
            return;
        }
        this._defaultHasBorder = hasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the hovered state has a border.
     *
     * @returns `true` if the hovered state has a border; otherwise, `false`.
     */
    get hoveredHasBorder() {
        return this._hoveredHasBorder;
    }
    /**
     * Sets whether the hovered state has a border and initializes the visual states.
     *
     * @param hoveredHasBorder - A boolean indicating whether the hovered state should have a border.
     */
    set hoveredHasBorder(hoveredHasBorder) {
        if (hoveredHasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredHasBorder, hoveredHasBorder)) {
            return;
        }
        this._hoveredHasBorder = hoveredHasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the triggered state has a border.
     *
     * @returns `true` if the triggered state has a border; otherwise, `false`.
     */
    get triggeredHasBorder() {
        return this._triggeredHasBorder;
    }
    /**
     * Sets whether the triggered state has a border and initializes the visual states.
     *
     * @param hasBorder - A boolean indicating whether the triggered state should have a border.
     */
    set triggeredHasBorder(hasBorder) {
        if (hasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredHasBorder, hasBorder)) {
            return;
        }
        this._triggeredHasBorder = hasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the inactive state has a border.
     *
     * @returns `true` if the inactive state has a border; otherwise, `false`.
     */
    get inactiveHasBorder() {
        return this._inactiveHasBorder;
    }
    /**
     * Sets whether the inactive state has a border and initializes the visual states.
     *
     * @param hasBorder - A boolean indicating whether the inactive state should have a border.
     */
    set inactiveHasBorder(hasBorder) {
        if (hasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveHasBorder, hasBorder)) {
            return;
        }
        this._inactiveHasBorder = hasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the toggled default state has a border.
     *
     * @returns `true` if the toggled default state has a border; otherwise, `false`.
     */
    get toggledDefaultHasBorder() {
        return this._toggledDefaultHasBorder;
    }
    /**
     * Sets whether the toggled default state has a border and initializes the visual states.
     *
     * @param hasBorder - A boolean indicating whether the toggled default state should have a border.
     */
    set toggledDefaultHasBorder(hasBorder) {
        if (hasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultHasBorder, hasBorder)) {
            return;
        }
        this._toggledDefaultHasBorder = hasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the toggled hovered state has a border.
     *
     * @returns `true` if the toggled hovered state has a border; otherwise, `false`.
     */
    get toggledHoveredHasBorder() {
        return this._toggledHoveredHasBorder;
    }
    /**
     * Sets whether the toggled hovered state has a border and initializes the visual states.
     *
     * @param toggledHoveredHasBorder - A boolean indicating whether the toggled hovered state should have a border.
     */
    set toggledHoveredHasBorder(toggledHoveredHasBorder) {
        if (toggledHoveredHasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredHasBorder, toggledHoveredHasBorder)) {
            return;
        }
        this._toggledHoveredHasBorder = toggledHoveredHasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets whether the toggled triggered state has a border.
     *
     * @returns `true` if the toggled triggered state has a border; otherwise, `false`.
     */
    get toggledTriggeredHasBorder() {
        return this._toggledTriggeredHasBorder;
    }
    /**
     * Sets whether the toggled triggered state has a border and initializes the visual states.
     *
     * @param hasBorder - A boolean indicating whether the toggled triggered state should have a border.
     */
    set toggledTriggeredHasBorder(hasBorder) {
        if (hasBorder === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledTriggeredHasBorder, hasBorder)) {
            return;
        }
        this._toggledTriggeredHasBorder = hasBorder;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the default state.
     *
     * @returns The border type for the default state.
     */
    get defaultBorderType() {
        return this._defaultBorderType;
    }
    /**
     * Sets the border type for the default state and initializes the visual states.
     *
     * @param borderType - The border type to be set for the default state.
     */
    set defaultBorderType(borderType) {
        if (borderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultBorderType, borderType)) {
            return;
        }
        this._defaultBorderType = borderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the hovered state.
     *
     * @returns The border type for the hovered state.
     */
    get hoveredBorderType() {
        return this._hoveredBorderType;
    }
    /**
     * Sets the border type for the hovered state and initializes the visual states.
     *
     * @param hoveredBorderType - The border type to be set for the hovered state.
     */
    set hoveredBorderType(hoveredBorderType) {
        if (hoveredBorderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredBorderType, hoveredBorderType)) {
            return;
        }
        this._hoveredBorderType = hoveredBorderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the triggered state.
     *
     * @returns The border type for the triggered state.
     */
    get triggeredBorderType() {
        return this._triggeredBorderType;
    }
    /**
     * Sets the border type for the triggered state and initializes the visual states.
     *
     * @param borderType - The border type to be set for the triggered state.
     */
    set triggeredBorderType(borderType) {
        if (borderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredBorderType, borderType)) {
            return;
        }
        this._triggeredBorderType = borderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the inactive state.
     *
     * @returns The border type for the inactive state.
     */
    get inactiveBorderType() {
        return this._inactiveBorderType;
    }
    /**
     * Sets the border type for the inactive state and initializes the visual states.
     *
     * @param borderType - The border type to be set for the inactive state.
     */
    set inactiveBorderType(borderType) {
        if (borderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveBorderType, borderType)) {
            return;
        }
        this._inactiveBorderType = borderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the toggled default state.
     *
     * @returns The border type for the toggled default state.
     */
    get toggledDefaultBorderType() {
        return this._toggledDefaultBorderType;
    }
    /**
     * Sets the border type for the toggled default state and initializes the visual states.
     *
     * @param borderType - The border type to be set for the toggled default state.
     */
    set toggledDefaultBorderType(borderType) {
        if (borderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultBorderType, borderType)) {
            return;
        }
        this._toggledDefaultBorderType = borderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the toggled hovered state.
     *
     * @returns The border type for the toggled hovered state.
     */
    get toggledHoveredBorderType() {
        return this._toggledHoveredBorderType;
    }
    /**
     * Sets the border type for the toggled hovered state and initializes the visual states.
     *
     * @param toggledHoveredBorderType - The border type to be set for the toggled hovered state.
     */
    set toggledHoveredBorderType(toggledHoveredBorderType) {
        if (toggledHoveredBorderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredBorderType, toggledHoveredBorderType)) {
            return;
        }
        this._toggledHoveredBorderType = toggledHoveredBorderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border type for the toggled triggered state.
     *
     * @returns The border type for the toggled triggered state.
     */
    get toggledTriggeredBorderType() {
        return this._toggledTriggeredBorderType;
    }
    /**
     * Sets the border type for the toggled triggered state and initializes the visual states.
     *
     * @param borderType - The border type to be set for the toggled triggered state.
     */
    set toggledTriggeredBorderType(borderType) {
        if (borderType === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledTriggeredBorderType, borderType)) {
            return;
        }
        this._toggledTriggeredBorderType = borderType;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the default state.
     *
     * @returns The border size for the default state.
     */
    get defaultBorderSize() {
        return this._defaultBorderSize;
    }
    /**
     * Sets the border size for the default state and initializes the visual states.
     *
     * @param borderSize - The border size to be set for the default state.
     */
    set defaultBorderSize(borderSize) {
        if (borderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultBorderSize, borderSize)) {
            return;
        }
        this._defaultBorderSize = borderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the hovered state.
     *
     * @returns The border size for the hovered state.
     */
    get hoveredBorderSize() {
        return this._hoveredBorderSize;
    }
    /**
     * Sets the border size for the hovered state and initializes the visual states.
     *
     * @param hoveredBorderSize - The border size to be set for the hovered state.
     */
    set hoveredBorderSize(hoveredBorderSize) {
        if (hoveredBorderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredBorderSize, hoveredBorderSize)) {
            return;
        }
        this._hoveredBorderSize = hoveredBorderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the triggered state.
     *
     * @returns The border size for the triggered state.
     */
    get triggeredBorderSize() {
        return this._triggeredBorderSize;
    }
    /**
     * Sets the border size for the triggered state and initializes the visual states.
     *
     * @param borderSize - The border size to be set for the triggered state.
     */
    set triggeredBorderSize(borderSize) {
        if (borderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredBorderSize, borderSize)) {
            return;
        }
        this._triggeredBorderSize = borderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the inactive state.
     *
     * @returns The border size for the inactive state.
     */
    get inactiveBorderSize() {
        return this._inactiveBorderSize;
    }
    /**
     * Sets the border size for the inactive state and initializes the visual states.
     *
     * @param borderSize - The border size to be set for the inactive state.
     */
    set inactiveBorderSize(borderSize) {
        if (borderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveBorderSize, borderSize)) {
            return;
        }
        this._inactiveBorderSize = borderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the toggled default state.
     *
     * @returns The border size for the toggled default state.
     */
    get toggledDefaultBorderSize() {
        return this._toggledDefaultBorderSize;
    }
    /**
     * Sets the border size for the toggled default state and initializes the visual states.
     *
     * @param borderSize - The border size to be set for the toggled default state.
     */
    set toggledDefaultBorderSize(borderSize) {
        if (borderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultBorderSize, borderSize)) {
            return;
        }
        this._toggledDefaultBorderSize = borderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the toggled hovered state.
     *
     * @returns The border size for the toggled hovered state.
     */
    get toggledHoveredBorderSize() {
        return this._toggledHoveredBorderSize;
    }
    /**
     * Sets the border size for the toggled hovered state and initializes the visual states.
     *
     * @param toggledHoveredBorderSize - The border size to be set for the toggled hovered state.
     */
    set toggledHoveredBorderSize(toggledHoveredBorderSize) {
        if (toggledHoveredBorderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredBorderSize, toggledHoveredBorderSize)) {
            return;
        }
        this._toggledHoveredBorderSize = toggledHoveredBorderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the border size for the toggled triggered state.
     *
     * @returns The border size for the toggled triggered state.
     */
    get toggledTriggeredBorderSize() {
        return this._toggledTriggeredBorderSize;
    }
    /**
     * Sets the border size for the toggled triggered state and initializes the visual states.
     *
     * @param borderSize - The border size to be set for the toggled triggered state.
     */
    set toggledTriggeredBorderSize(borderSize) {
        if (borderSize === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledTriggeredBorderSize, borderSize)) {
            return;
        }
        this._toggledTriggeredBorderSize = borderSize;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    updateGradient(gradient) {
        if (!this.shouldColorChange || this.baseType !== "Gradient") {
            return;
        }
        const initalGradient = this.currentGradient;
        const remaining = RoundedRectangle_1.GradientParameters.distance(gradient, initalGradient);
        const full = this.prevState?.baseGradient
            ? RoundedRectangle_1.GradientParameters.distance(gradient, this.prevState.baseGradient)
            : remaining;
        const ratio = full > 1e-6 ? Math.min(Math.max(remaining / full, 0), 1) : 0;
        this._gradientChangeCancelSet.cancel();
        (0, animate_1.default)({
            duration: ratio * this.animateDuration,
            cancelSet: this._gradientChangeCancelSet,
            update: (t) => {
                this.currentGradient = RoundedRectangle_1.GradientParameters.lerp(initalGradient, gradient, t);
                this.roundedRectangle.setBackgroundGradient(this.currentGradient);
            },
            ended: () => {
                this.currentGradient = gradient;
                this.roundedRectangle.setBackgroundGradient(this.currentGradient);
            }
        });
    }
    updateBaseTexture(texture) {
        if (this.baseType !== "Texture") {
            return;
        }
        this.roundedRectangle.texture = texture;
    }
    updateBorderColors(borderColor) {
        if (!this.shouldColorChange || !this.hasBorder || this.isBorderGradient) {
            return;
        }
        const initialBorderColor = this.roundedRectangle.borderColor;
        const remaining = (0, UIKitUtilities_1.colorDistance)(borderColor, initialBorderColor);
        const full = this.prevState?.borderColor ? (0, UIKitUtilities_1.colorDistance)(borderColor, this.prevState.borderColor) : remaining;
        const ratio = full > 1e-6 ? Math.min(Math.max(remaining / full, 0), 1) : 0;
        this._borderColorChangeCancelSet.cancel();
        (0, animate_1.default)({
            duration: ratio * this.animateDuration,
            cancelSet: this._borderColorChangeCancelSet,
            update: (t) => {
                this.roundedRectangle.borderColor = (0, UIKitUtilities_1.colorLerp)(initialBorderColor, borderColor, t);
            }
        });
    }
    updateBorderGradient(gradient) {
        if (!this.hasBorder || !this.isBorderGradient) {
            return;
        }
        const initalGradient = this.currentBorderGradient;
        const remaining = RoundedRectangle_1.GradientParameters.distance(gradient, initalGradient);
        const full = this.prevState?.borderGradient
            ? RoundedRectangle_1.GradientParameters.distance(gradient, this.prevState.borderGradient)
            : remaining;
        const ratio = full > 1e-6 ? Math.min(Math.max(remaining / full, 0), 1) : 0;
        this._borderGradientChangeCancelSet.cancel();
        (0, animate_1.default)({
            duration: ratio * this.animateDuration,
            cancelSet: this._borderGradientChangeCancelSet,
            update: (t) => {
                this.currentBorderGradient = RoundedRectangle_1.GradientParameters.lerp(initalGradient, gradient, t);
                this.roundedRectangle.setBorderGradient(this.currentBorderGradient);
            },
            ended: () => {
                this.currentBorderGradient = gradient;
                this.roundedRectangle.setBorderGradient(this.currentBorderGradient);
            }
        });
    }
    updateBorderSize(borderSize) {
        if (!this.hasBorder) {
            return;
        }
        this.roundedRectangle.borderSize = borderSize;
    }
    updateHasBorder(hasBorder) {
        if (hasBorder === undefined) {
            return;
        }
        this._hasBorder = hasBorder;
        if (this.initialized) {
            this.roundedRectangle.border = hasBorder;
        }
    }
    updateBaseType(isBaseGradient) {
        if (isBaseGradient !== undefined) {
            this.baseType = isBaseGradient;
        }
    }
    updateBorderType(borderType) {
        if (borderType !== undefined) {
            this.isBorderGradient = borderType === "Gradient";
        }
    }
    /**
     * Prints the configuration of the rounded rectangle visual to the console.
     */
    printConfig() {
        this.roundedRectangle.printConfig();
    }
    applyStyleParameters(parameters) {
        // First call the parent method to handle base VisualState properties
        super.applyStyleParameters(parameters);
        // Then handle RoundedRectangle-specific properties
        // BaseType flags
        this.applyStyleProperty(parameters, "baseType", {
            default: (value) => (this.defaultBaseType = value),
            hovered: (value) => (this.hoveredBaseType = value),
            triggered: (value) => (this.triggeredBaseType = value),
            inactive: (value) => (this.inactiveBaseType = value),
            toggledDefault: (value) => (this.toggledDefaultBaseType = value),
            toggledHovered: (value) => (this.toggledHoveredBaseType = value),
            toggledTriggered: (value) => (this.toggledTriggeredBaseType = value)
        });
        // Base gradient parameters
        this.applyStyleProperty(parameters, "baseGradient", {
            default: (value) => (this.defaultGradient = value),
            hovered: (value) => (this.hoveredGradient = value),
            triggered: (value) => (this.triggeredGradient = value),
            inactive: (value) => (this.inactiveGradient = value),
            toggledDefault: (value) => (this.toggledDefaultGradient = value),
            toggledHovered: (value) => (this.toggledHoveredGradient = value),
            toggledTriggered: (value) => (this.toggledTriggeredGradient = value)
        });
        // Base texture parameters
        this.applyStyleProperty(parameters, "baseTexture", {
            default: (value) => (this.defaultTexture = value),
            hovered: (value) => (this.hoveredTexture = value),
            triggered: (value) => (this.triggeredTexture = value),
            inactive: (value) => (this.inactiveTexture = value),
            toggledDefault: (value) => (this.toggledDefaultTexture = value),
            toggledHovered: (value) => (this.toggledHoveredTexture = value),
            toggledTriggered: (value) => (this.toggledTriggeredTexture = value)
        });
        // HasBorder flags
        this.applyStyleProperty(parameters, "hasBorder", {
            default: (value) => (this.defaultHasBorder = value),
            hovered: (value) => (this.hoveredHasBorder = value),
            triggered: (value) => (this.triggeredHasBorder = value),
            inactive: (value) => (this.inactiveHasBorder = value),
            toggledDefault: (value) => (this.toggledDefaultHasBorder = value),
            toggledHovered: (value) => (this.toggledHoveredHasBorder = value),
            toggledTriggered: (value) => (this.toggledTriggeredHasBorder = value)
        });
        // Border types
        this.applyStyleProperty(parameters, "borderType", {
            default: (value) => (this.defaultBorderType = value),
            hovered: (value) => (this.hoveredBorderType = value),
            triggered: (value) => (this.triggeredBorderType = value),
            inactive: (value) => (this.inactiveBorderType = value),
            toggledDefault: (value) => (this.toggledDefaultBorderType = value),
            toggledHovered: (value) => (this.toggledHoveredBorderType = value),
            toggledTriggered: (value) => (this.toggledTriggeredBorderType = value)
        });
        // Border sizes
        this.applyStyleProperty(parameters, "borderSize", {
            default: (value) => (this.defaultBorderSize = value),
            hovered: (value) => (this.hoveredBorderSize = value),
            triggered: (value) => (this.triggeredBorderSize = value),
            inactive: (value) => (this.inactiveBorderSize = value),
            toggledDefault: (value) => (this.toggledDefaultBorderSize = value),
            toggledHovered: (value) => (this.toggledHoveredBorderSize = value),
            toggledTriggered: (value) => (this.toggledTriggeredBorderSize = value)
        });
        // Border colors
        this.applyStyleProperty(parameters, "borderColor", {
            default: (value) => (this.borderDefaultColor = value),
            hovered: (value) => (this.borderHoveredColor = value),
            triggered: (value) => (this.borderTriggeredColor = value),
            inactive: (value) => (this.borderInactiveColor = value),
            toggledDefault: (value) => (this.borderToggledDefaultColor = value),
            toggledHovered: (value) => (this.borderToggledHoveredColor = value),
            toggledTriggered: (value) => (this.borderToggledTriggeredColor = value)
        });
        // Border gradients
        this.applyStyleProperty(parameters, "borderGradient", {
            default: (value) => (this.borderDefaultGradient = value),
            hovered: (value) => (this.borderHoveredGradient = value),
            triggered: (value) => (this.borderTriggeredGradient = value),
            inactive: (value) => (this.borderInactiveGradient = value),
            toggledDefault: (value) => (this.borderToggledDefaultGradient = value),
            toggledHovered: (value) => (this.borderToggledHoveredGradient = value),
            toggledTriggered: (value) => (this.borderToggledTriggeredGradient = value)
        });
    }
    updateVisualStates() {
        this._roundedRectangleVisualStates = new Map([
            [
                Element_1.StateName.default,
                {
                    baseColor: this.baseDefaultColor,
                    baseType: this.defaultBaseType,
                    hasBorder: this.defaultHasBorder,
                    borderSize: this.defaultBorderSize,
                    borderType: this.defaultBorderType,
                    baseGradient: this.defaultGradient,
                    baseTexture: this.defaultTexture,
                    borderColor: this.borderDefaultColor,
                    borderGradient: this.borderDefaultGradient,
                    shouldPosition: this.defaultShouldPosition,
                    shouldScale: this.defaultShouldScale,
                    localScale: this.defaultScale,
                    localPosition: this.defaultPosition
                }
            ],
            [
                Element_1.StateName.hovered,
                {
                    baseColor: this.baseHoveredColor,
                    baseGradient: this.hoveredGradient,
                    baseTexture: this.hoveredTexture,
                    hasBorder: this.hoveredHasBorder,
                    borderSize: this.hoveredBorderSize,
                    borderColor: this.borderHoveredColor,
                    borderGradient: this.borderHoveredGradient,
                    shouldPosition: this.hoveredShouldPosition,
                    shouldScale: this.hoveredShouldScale,
                    localScale: this.hoveredScale,
                    localPosition: this.hoveredPosition
                }
            ],
            [
                Element_1.StateName.triggered,
                {
                    baseColor: this.baseTriggeredColor,
                    baseGradient: this.triggeredGradient,
                    baseTexture: this.triggeredTexture,
                    hasBorder: this.triggeredHasBorder,
                    borderSize: this.triggeredBorderSize,
                    borderColor: this.borderTriggeredColor,
                    borderGradient: this.borderTriggeredGradient,
                    shouldPosition: this.triggeredShouldPosition,
                    shouldScale: this.triggeredShouldScale,
                    localScale: this.triggeredScale,
                    localPosition: this.triggeredPosition
                }
            ],
            [
                Element_1.StateName.toggledHovered,
                {
                    baseColor: this.baseToggledHoveredColor,
                    baseGradient: this.toggledHoveredGradient,
                    baseTexture: this.toggledHoveredTexture,
                    hasBorder: this.toggledHoveredHasBorder,
                    borderSize: this.toggledHoveredBorderSize,
                    borderColor: this.borderToggledHoveredColor,
                    borderGradient: this.borderToggledHoveredGradient,
                    shouldPosition: this.toggledHoveredShouldPosition,
                    shouldScale: this.toggledHoveredShouldScale,
                    localScale: this.toggledHoveredScale,
                    localPosition: this.toggledHoveredPosition
                }
            ],
            [
                Element_1.StateName.toggledDefault,
                {
                    baseColor: this.baseTriggeredColor,
                    baseGradient: this.toggledDefaultGradient,
                    baseTexture: this.toggledDefaultTexture,
                    hasBorder: this.toggledDefaultHasBorder,
                    borderSize: this.toggledDefaultBorderSize,
                    borderColor: this.borderToggledDefaultColor,
                    borderGradient: this.borderToggledDefaultGradient,
                    shouldPosition: this.toggledDefaultShouldPosition,
                    shouldScale: this.toggledDefaultShouldScale,
                    localScale: this.toggledScale,
                    localPosition: this.toggledPosition
                }
            ],
            [
                Element_1.StateName.toggledTriggered,
                {
                    baseColor: this.baseTriggeredColor,
                    baseGradient: this.toggledTriggeredGradient,
                    baseTexture: this.toggledTriggeredTexture,
                    hasBorder: this.toggledTriggeredHasBorder,
                    borderSize: this.toggledTriggeredBorderSize,
                    borderColor: this.borderToggledTriggeredColor,
                    borderGradient: this.borderToggledTriggeredGradient,
                    shouldPosition: this.toggledTriggeredShouldPosition,
                    shouldScale: this.toggledTriggeredShouldScale,
                    localScale: this.toggledTriggeredScale,
                    localPosition: this.toggledTriggeredPosition
                }
            ],
            [
                Element_1.StateName.error,
                {
                    baseColor: this.baseErrorColor,
                    baseGradient: this.defaultGradient,
                    baseTexture: this.defaultTexture,
                    hasBorder: this.defaultHasBorder,
                    borderSize: this.defaultBorderSize,
                    borderColor: this.baseErrorColor,
                    borderGradient: this.borderDefaultGradient,
                    shouldPosition: this.defaultShouldPosition,
                    shouldScale: this.defaultShouldScale,
                    localScale: this.errorScale,
                    localPosition: this.errorPosition
                }
            ],
            [
                Element_1.StateName.errorHovered,
                {
                    baseColor: this.baseErrorColor,
                    baseGradient: this.hoveredGradient,
                    baseTexture: this.hoveredTexture,
                    hasBorder: this.hoveredHasBorder,
                    borderSize: this.hoveredBorderSize,
                    borderColor: this.baseErrorColor,
                    borderGradient: this.borderHoveredGradient,
                    shouldPosition: this.hoveredShouldPosition,
                    shouldScale: this.hoveredShouldScale,
                    localScale: this.hoveredScale,
                    localPosition: this.errorPosition
                }
            ],
            [
                Element_1.StateName.inactive,
                {
                    baseColor: this.baseInactiveColor,
                    baseGradient: this.inactiveGradient,
                    baseTexture: this.inactiveTexture,
                    hasBorder: this.inactiveHasBorder,
                    borderSize: this.inactiveBorderSize,
                    borderColor: this.borderInactiveColor,
                    borderGradient: this.borderInactiveGradient,
                    shouldPosition: this.inactiveShouldPosition,
                    shouldScale: this.inactiveShouldScale,
                    localScale: this.inactiveScale,
                    localPosition: this.inactivePosition
                }
            ]
        ]);
        super.updateVisualStates();
    }
    get roundedRectangle() {
        return this._visualComponent;
    }
    set roundedRectangle(value) {
        this._visualComponent = value;
    }
}
exports.RoundedRectangleVisual = RoundedRectangleVisual;
//# sourceMappingURL=RoundedRectangleVisual.js.map