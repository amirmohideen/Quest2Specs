"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphereVisual = void 0;
const Element_1 = require("../../../Components/Element");
const UIKitUtilities_1 = require("../../../Utility/UIKitUtilities");
const Visual_1 = require("../../../Visuals/Visual");
const Sphere_1 = require("./Sphere");
const Colors = {
    darkGray: new vec4(0.1, 0.1, 0.1, 1),
    lightGray: new vec4(0.4, 0.4, 0.4, 1),
    lighterGray: new vec4(0.8, 0.8, 0.8, 1),
    brightYellow: new vec4(1, 0.8, 0, 1),
    yellow: new vec4(0.7, 0.6, 0.1, 1)
};
const SphereColors = {
    default: {
        base: Colors.darkGray
    },
    hovered: {
        base: Colors.darkGray,
        second: Colors.lightGray
    },
    triggered: {
        base: Colors.yellow
    },
    toggledHovered: {
        base: Colors.yellow,
        second: Colors.lighterGray
    }
};
/**
 * The `SphereVisual` class represents a visual component in the form of a sphere.
 * It extends the `Visual` class and provides functionality for managing the sphere's
 * appearance, size, and state transitions.
 *
 * @extends Visual
 */
class SphereVisual extends Visual_1.Visual {
    get visualStates() {
        return this._sphereVisualStates;
    }
    /**
     * Gets the size of the SphereVisual.
     *
     * @returns A `vec3` representing the dimensions of the SphereVisual.
     */
    get size() {
        return super.size;
    }
    /**
     * Sets the size of the SphereVisual.
     * Updates both the internal `_size` property.
     *
     * @param size - A `vec3` object representing the dimensions of the SphereVisual.
     */
    set size(size) {
        if (size === undefined) {
            return;
        }
        super.size = size;
        if (this.initialized) {
            this.sphere.radius = this.size.x / 2;
        }
    }
    /**
     * Gets the `RenderMeshVisual` associated with the sphere.
     *
     * @returns {RenderMeshVisual} The visual representation of the sphere's mesh.
     */
    get renderMeshVisual() {
        return this.sphere.renderMeshVisual;
    }
    /**
     * Gets the base color of the sphere visual.
     *
     * @returns {vec4} The background color of the sphere as a 4-component vector.
     */
    get baseColor() {
        return this.sphere.backgroundColor;
    }
    /**
     * Indicates whether the sphere visual has a border.
     *
     * @returns {boolean} The border property always returns false for the `SphereVisual` class,
     */
    get hasBorder() {
        return false;
    }
    /**
     * Gets the size of the border for the sphere visual in world space units.
     *
     * @returns The border size as a number. Currently, this always returns 0.
     */
    get borderSize() {
        return 0;
    }
    /**
     * @returns vec4 default second color
     */
    get defaultSecondColor() {
        return this._defaultSecondColor;
    }
    /**
     * @returns vec4 hovered second color
     */
    get hoveredSecondColor() {
        return this._hoveredSecondColor;
    }
    /**
     * @returns vec4 triggered second color
     */
    get triggeredSecondColor() {
        return this._triggeredSecondColor;
    }
    get toggledDefaultSecondColor() {
        return this._toggledDefaultSecondColor;
    }
    /**
     * @returns vec4 toggled hovered second color
     */
    get toggledHoveredSecondColor() {
        return this._toggledHoveredSecondColor;
    }
    /**
     * @params vec4 default second color
     */
    set defaultSecondColor(defaultSecondColor) {
        if (defaultSecondColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultSecondColor, defaultSecondColor)) {
            return;
        }
        this._defaultSecondColor = defaultSecondColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * @params vec4 hovered second color
     */
    set hoveredSecondColor(hoveredSecondColor) {
        if (hoveredSecondColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredSecondColor, hoveredSecondColor)) {
            return;
        }
        this._hoveredSecondColor = hoveredSecondColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * @params vec4 triggered second color
     */
    set triggeredSecondColor(triggeredSecondColor) {
        if (triggeredSecondColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredSecondColor, triggeredSecondColor)) {
            return;
        }
        this._triggeredSecondColor = triggeredSecondColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * @params vec4 toggled second color
     */
    set toggledDefaultSecondColor(toggledDefaultSecondColor) {
        if (toggledDefaultSecondColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledDefaultSecondColor, toggledDefaultSecondColor)) {
            return;
        }
        this._toggledDefaultSecondColor = toggledDefaultSecondColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * @params vec4 toggled second color
     */
    set toggledHoveredSecondColor(toggledHoveredSecondColor) {
        if (toggledHoveredSecondColor === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._toggledHoveredSecondColor, toggledHoveredSecondColor)) {
            return;
        }
        this._toggledHoveredSecondColor = toggledHoveredSecondColor;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Updates the state of the SphereVisual component and refreshes the associated icon.
     *
     * @param stateName - The name of the state to set for the component.
     */
    setState(stateName) {
        super.setState(stateName);
        if (this.initialized) {
            this.updateIcon(this._state.icon);
            this.updateSecondColor(this._state.secondColor);
        }
    }
    constructor(args) {
        super(args);
        this._defaultColor = SphereColors.default.base;
        this._hoveredColor = SphereColors.hovered.base;
        this._triggeredColor = SphereColors.triggered.base;
        this._toggledDefaultColor = SphereColors.triggered.base;
        this._toggledHoveredColor = SphereColors.toggledHovered.base;
        this._defaultSecondColor = SphereColors.default.base;
        this._hoveredSecondColor = SphereColors.hovered.second;
        this._triggeredSecondColor = SphereColors.triggered.base;
        this._toggledDefaultSecondColor = SphereColors.triggered.base;
        this._toggledHoveredSecondColor = SphereColors.toggledHovered.second;
        this._sceneObject = args.sceneObject;
        this.sphere = this._sceneObject.createComponent(Sphere_1.Sphere.getTypeName());
        this.managedComponents.push(this.sphere);
        this.sphere.radius = this.size.x / 2;
        this.sphere.initialize();
        this._transform = this._sceneObject.getTransform();
        this.initialize();
    }
    set baseColor(value) {
        this.sphere.backgroundColor = value;
    }
    /********** Sphere Specific **************/
    /**
     * Gets the scale factor for the back of the sphere along the z-axis.
     *
     * @returns {number} The scale factor for the back of the sphere.
     */
    get zBackScale() {
        return this.sphere?.zBackScale ?? 0;
    }
    /**
     * Sets the scale factor for the back of the sphere along the z-axis.
     * This property adjusts the depth scaling of the sphere's back side.
     *
     * @param zBackScale - The new scale factor for the z-axis back scaling.
     */
    set zBackScale(zBackScale) {
        if (zBackScale === undefined) {
            return;
        }
        this.sphere.zBackScale = zBackScale;
    }
    /**
     * Gets the default icon for the sphere visual.
     *
     * @returns {Texture} The default icon for the sphere visual.
     */
    get defaultIcon() {
        return this._defaultIcon ?? undefined;
    }
    /**
     * Sets the default icon for the sphere visual and updates its visual states.
     *
     * @param icon - The texture to be used as the default icon.
     */
    set defaultIcon(icon) {
        if (icon === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._defaultIcon, icon)) {
            return;
        }
        this._defaultIcon = icon;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the hovered icon for the sphere visual.
     *
     * @returns {Texture} The hovered icon for the sphere visual.
     */
    get hoveredIcon() {
        return this._hoveredIcon ?? undefined;
    }
    /**
     * Sets the hovered icon for the sphere visual and updates its visual states.
     *
     * @param hoveredIcon - The texture to be used as the hovered icon.
     */
    set hoveredIcon(hoveredIcon) {
        if (hoveredIcon === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._hoveredIcon, hoveredIcon)) {
            return;
        }
        this._hoveredIcon = hoveredIcon;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the triggered icon for the sphere visual.
     *
     * @returns {Texture} The triggered icon for the sphere visual.
     */
    get triggeredIcon() {
        return this._triggeredIcon ?? undefined;
    }
    /**
     * Sets the triggered icon for the sphere visual and updates its visual states.
     *
     * @param icon - The texture to be used as the triggered icon.
     */
    set triggeredIcon(icon) {
        if (icon === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._triggeredIcon, icon)) {
            return;
        }
        this._triggeredIcon = icon;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the inactive icon for the sphere visual.
     *
     * @returns {Texture} The inactive icon for the sphere visual.
     */
    get inactiveIcon() {
        return this._inactiveIcon ?? undefined;
    }
    /**
     * Sets the inactive icon for the sphere visual and updates its visual states.
     *
     * @param icon - The texture to be used as the inactive icon.
     */
    set inactiveIcon(icon) {
        if (icon === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._inactiveIcon, icon)) {
            return;
        }
        this._inactiveIcon = icon;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Gets the error icon for the sphere visual.
     *
     * @returns {Texture} The error icon for the sphere visual.
     */
    get errorIcon() {
        return this._errorIcon ?? undefined;
    }
    /**
     * Sets the error icon for the sphere visual and updates its visual states.
     *
     * @param icon - The texture to be used as the error icon.
     */
    set errorIcon(icon) {
        if (icon === undefined) {
            return;
        }
        if ((0, UIKitUtilities_1.isEqual)(this._errorIcon, icon)) {
            return;
        }
        this._errorIcon = icon;
        if (this.initialized) {
            this.needsVisualStateUpdate = true;
        }
    }
    /**
     * Updates the icon of the sphere visual.
     *
     * @param icon - The texture to be used as the new icon.
     */
    updateIcon(icon) {
        this.sphere.icon = icon;
    }
    updateSecondColor(color) {
        if (color) {
            this.renderMeshVisual.mainPass.secondColor = color;
            this.renderMeshVisual.mainPass.hasSecondColor = 1;
        }
        else {
            this.renderMeshVisual.mainPass.hasSecondColor = 0;
        }
    }
    updateVisualStates() {
        this._sphereVisualStates = new Map([
            [
                Element_1.StateName.default,
                {
                    baseColor: this.baseDefaultColor,
                    secondColor: this.defaultSecondColor,
                    localScale: this.defaultScale,
                    localPosition: this.defaultPosition,
                    icon: this._defaultIcon
                }
            ],
            [
                Element_1.StateName.hovered,
                {
                    baseColor: this.baseHoveredColor,
                    secondColor: this.hoveredSecondColor,
                    localScale: this.hoveredScale,
                    localPosition: this.hoveredPosition,
                    icon: this._hoveredIcon
                }
            ],
            [
                Element_1.StateName.triggered,
                {
                    baseColor: this.baseTriggeredColor,
                    secondColor: this.triggeredSecondColor,
                    localScale: this.triggeredScale,
                    localPosition: this.triggeredPosition,
                    icon: this._triggeredIcon
                }
            ],
            [
                Element_1.StateName.toggledHovered,
                {
                    baseColor: this.baseToggledHoveredColor,
                    secondColor: this.toggledHoveredSecondColor,
                    localScale: this.toggledHoveredScale,
                    localPosition: this.toggledPosition,
                    icon: this._triggeredIcon
                }
            ],
            [
                Element_1.StateName.toggledDefault,
                {
                    baseColor: this.baseToggledDefaultColor,
                    secondColor: this.toggledDefaultSecondColor,
                    localScale: this.toggledScale,
                    localPosition: this.toggledPosition,
                    icon: this._triggeredIcon
                }
            ],
            [
                Element_1.StateName.error,
                {
                    baseColor: this.baseErrorColor,
                    secondColor: this.baseErrorColor,
                    localScale: this.errorScale,
                    localPosition: this.errorPosition,
                    icon: this._errorIcon
                }
            ],
            [
                Element_1.StateName.errorHovered,
                {
                    baseColor: this.baseErrorColor,
                    secondColor: this.baseErrorColor,
                    localScale: this.hoveredScale,
                    localPosition: this.hoveredPosition,
                    icon: this._errorIcon
                }
            ],
            [
                Element_1.StateName.inactive,
                {
                    baseColor: this.baseErrorColor,
                    secondColor: this.baseErrorColor,
                    localScale: this.inactiveScale,
                    localPosition: this.inactivePosition,
                    icon: this._inactiveIcon
                }
            ]
        ]);
        super.updateVisualStates();
    }
    get sphere() {
        return this._visualComponent;
    }
    set sphere(value) {
        this._visualComponent = value;
    }
}
exports.SphereVisual = SphereVisual;
//# sourceMappingURL=SphereVisual.js.map