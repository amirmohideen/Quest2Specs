"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capsule3DVisual = void 0;
const color_1 = require("SpectaclesInteractionKit.lspkg/Utils/color");
const Element_1 = require("../../../Components/Element");
const Visual_1 = require("../../../Visuals/Visual");
const Capsule3D_1 = require("./Capsule3D");
/**
 * The `CapsuleVisual` class represents a visual component in the form of a capsule.
 * It extends the `Visual` class and provides functionality for managing the capsule's
 * appearance, size, and state transitions.
 *
 * @extends Visual
 */
class Capsule3DVisual extends Visual_1.Visual {
    get visualStates() {
        return this._capsuleVisualStates;
    }
    /**
     * Gets the size of the Capsule3DVisual.
     *
     * @returns A `vec3` representing the dimensions of the Capsule3DVisual.
     */
    get size() {
        return super.size;
    }
    /**
     * Sets the size of the Capsule3DVisual.
     * Updates both the internal `_size` property.
     *
     * @param size - A `vec3` object representing the dimensions of the Capsule3DVisual.
     */
    set size(size) {
        if (size === undefined) {
            return;
        }
        super.size = size;
        if (this.initialized) {
            this.capsuleSize = size;
        }
    }
    /**
     * Gets the `RenderMeshVisual` associated with the capsule.
     *
     * @returns {RenderMeshVisual} The visual representation of the capsule's mesh.
     */
    get renderMeshVisual() {
        return this.capsule.renderMeshVisual;
    }
    /**
     * Gets the base color of the capsule visual.
     *
     * @returns {vec4} The background color of the capsule as a 4-component vector.
     */
    get baseColor() {
        return this.capsule.backgroundColor;
    }
    /**
     * Indicates whether the capsule visual has a border.
     *
     * @returns {boolean} The border property always returns false for the `CapsuleVisual` class,
     */
    get hasBorder() {
        return false;
    }
    /**
     * Gets the size of the border for the capsule visual.
     *
     * @returns The border size as a number. Currently, this always returns 0.
     */
    get borderSize() {
        return 0;
    }
    constructor(args) {
        super(args);
        this._sceneObject = args.sceneObject;
        this.capsule = this._sceneObject.createComponent(Capsule3D_1.Capsule3D.getTypeName());
        this.managedComponents.push(this.capsule);
        this.capsule.initialize();
        this._transform = this._sceneObject.getTransform();
        this.capsule.depth = this.size.z;
        this.capsule.size = new vec2(this.size.x, this.size.y);
        this.initialize();
    }
    set baseColor(value) {
        this.capsule.backgroundColor = value;
    }
    get capsuleSize() {
        return new vec3(this.capsule.size.x, this.capsule.size.y, this.capsule.depth);
    }
    set capsuleSize(value) {
        if (value === undefined) {
            return;
        }
        this.capsule.depth = value.z;
        this.capsule.size = new vec2(value.x, value.y);
    }
    updateVisualStates() {
        this._capsuleVisualStates = new Map([
            [
                Element_1.StateName.default,
                {
                    baseColor: (0, color_1.withAlpha)(this.baseDefaultColor, 1),
                    localScale: this.defaultScale,
                    localPosition: this.defaultPosition
                }
            ],
            [
                Element_1.StateName.hovered,
                {
                    baseColor: (0, color_1.withAlpha)(this.baseHoveredColor, 1),
                    localScale: this.hoveredScale,
                    localPosition: this.hoveredPosition
                }
            ],
            [
                Element_1.StateName.triggered,
                {
                    baseColor: (0, color_1.withAlpha)(this.baseTriggeredColor, 1),
                    localScale: this.triggeredScale,
                    localPosition: this.triggeredPosition
                }
            ],
            [
                Element_1.StateName.error,
                {
                    baseColor: (0, color_1.withAlpha)(this.baseErrorColor, 1),
                    localScale: this.errorScale,
                    localPosition: this.errorPosition
                }
            ],
            [
                Element_1.StateName.errorHovered,
                {
                    baseColor: (0, color_1.withAlpha)(this.baseErrorColor, 1),
                    localScale: this.hoveredScale,
                    localPosition: this.hoveredPosition
                }
            ],
            [
                Element_1.StateName.inactive,
                {
                    baseColor: (0, color_1.withAlpha)(this.baseInactiveColor, 1),
                    localScale: this.inactiveScale,
                    localPosition: this.inactivePosition
                }
            ]
        ]);
        super.updateVisualStates();
    }
    get capsule() {
        return this._visualComponent;
    }
    set capsule(value) {
        this._visualComponent = value;
    }
}
exports.Capsule3DVisual = Capsule3DVisual;
//# sourceMappingURL=Capsule3DVisual.js.map