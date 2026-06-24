"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropShadowVisual = void 0;
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const Element_1 = require("../Components/Element");
const DropShadow_1 = require("../DropShadow");
const Visual_1 = require("./Visual");
const DEFAULT_SIZE_OFFSET = new vec2(0.5, 0.5);
const DEFAULT_SPREAD = 0.5;
/**
 * Visual implementation that renders a drop shadow quad using the
 * underlying `DropShadow` component. Adds support for stateful
 * `sizeOffset` and `spread` with animated transitions.
 */
class DropShadowVisual extends Visual_1.Visual {
    /**
     * Gets the size of the drop shadow visual.
     *
     * @returns {vec3} The size of the drop shadow visual.
     */
    get size() {
        return super.size;
    }
    /**
     * Sets the size of the drop shadow visual.
     * Updates both the internal `_size` and the `dropShadow.size` properties.
     *
     * @param size - A `vec3` representing the dimensions of the drop shadow visual.
     */
    set size(size) {
        if (size === undefined) {
            return;
        }
        super.size = size;
        if (this.initialized) {
            this.dropShadow.size = size.add(new vec3(this.currentSizeOffset.x, this.currentSizeOffset.y, 0));
        }
    }
    /**
     * Gets the underlying render visual for the drop shadow visual.
     *
     * @returns {RenderMeshVisual} The render mesh visual used to render the shadow.
     */
    get renderMeshVisual() {
        return this.dropShadow?.renderMeshVisual ?? null;
    }
    /**
     * Gets whether the drop shadow visual supports a border.
     *
     * @returns {boolean} Whether the drop shadow visual supports a border.
     */
    get hasBorder() {
        return false;
    }
    /**
     * Gets the border size of the drop shadow visual.
     *
     * @returns {number} The border size of the drop shadow visual.
     */
    get borderSize() {
        return 0;
    }
    /**
     * Gets the corner radius of the drop shadow visual.
     *
     * @returns {number} The corner radius in world units.
     */
    get cornerRadius() {
        return this.dropShadow?.cornerRadius ?? 0;
    }
    /**
     * Sets the corner radius of the drop shadow visual.
     *
     * @param value - The corner radius in world units.
     */
    set cornerRadius(value) {
        this.dropShadow.cornerRadius = value;
    }
    /**
     * Gets the base color of the drop shadow visual.
     *
     * @returns {vec4} The RGBA color.
     */
    get baseColor() {
        return this.dropShadow?.color ?? undefined;
    }
    /**
     * Sets the base color of the drop shadow visual.
     *
     * @param value - A `vec4` representing the RGBA color.
     */
    set baseColor(value) {
        this.dropShadow.color = value;
    }
    /**
     * Creates a `DropShadow` component on the provided `sceneObject` and
     * initializes default state values.
     *
     * @param args - Visual construction arguments including `sceneObject`.
     */
    constructor(args) {
        super(args);
        this.defaultSizeOffset = DEFAULT_SIZE_OFFSET;
        this.hoveredSizeOffset = DEFAULT_SIZE_OFFSET;
        this.triggeredSizeOffset = DEFAULT_SIZE_OFFSET;
        this.inactiveSizeOffset = DEFAULT_SIZE_OFFSET;
        this.toggledDefaultSizeOffset = DEFAULT_SIZE_OFFSET;
        this.toggledHoveredSizeOffset = DEFAULT_SIZE_OFFSET;
        this.toggledTriggeredSizeOffset = DEFAULT_SIZE_OFFSET;
        this.defaultSpread = DEFAULT_SPREAD;
        this.hoveredSpread = DEFAULT_SPREAD;
        this.triggeredSpread = DEFAULT_SPREAD;
        this.inactiveSpread = DEFAULT_SPREAD;
        this.toggledDefaultSpread = DEFAULT_SPREAD;
        this.toggledHoveredSpread = DEFAULT_SPREAD;
        this.toggledTriggeredSpread = DEFAULT_SPREAD;
        this.sizeOffsetCancelSet = new animate_1.CancelSet();
        this.spreadCancelSet = new animate_1.CancelSet();
        this.currentSizeOffset = this.defaultSizeOffset;
        this._state = undefined;
        this.prevState = undefined;
        this._sceneObject = args.sceneObject;
        this.dropShadow = this._sceneObject.createComponent(DropShadow_1.DropShadow.getTypeName());
        this.managedComponents.push(this.dropShadow);
        this._transform = this._sceneObject.getTransform();
        this.initialize();
    }
    /** Cancels in-flight animations and destroys base resources. */
    destroy() {
        this.sizeOffsetCancelSet.cancel();
        this.spreadCancelSet.cancel();
        super.destroy();
    }
    /**
     * Applies a new visual state and animates stateful properties.
     *
     * Updates the current `sizeOffset` and `spread` based on the target state
     * using this visual's `animateDuration` easing.
     *
     * @param stateName - The visual state to apply.
     */
    setState(stateName) {
        if (this._state === this.visualStates.get(stateName)) {
            // skip redundant calls
            return;
        }
        super.setState(stateName);
        this.updateSizeOffset(this._state.sizeOffset);
        this.updateSpread(this._state.spread);
    }
    updateSizeOffset(sizeOffset) {
        this.sizeOffsetCancelSet.cancel();
        const initialSizeOffset = this.currentSizeOffset;
        if (initialSizeOffset.distance(sizeOffset) === 0) {
            return;
        }
        (0, animate_1.default)({
            cancelSet: this.sizeOffsetCancelSet,
            easing: "ease-out-quad",
            update: (t) => {
                this.currentSizeOffset = vec2.lerp(initialSizeOffset, sizeOffset, t);
                this.dropShadow.size = this.size.add(new vec3(this.currentSizeOffset.x, this.currentSizeOffset.y, 0));
            },
            duration: this.prevState
                ? (this.animateDuration * initialSizeOffset.distance(sizeOffset)) /
                    this.prevState.sizeOffset.distance(sizeOffset)
                : this.animateDuration
        });
    }
    updateSpread(spread) {
        this.spreadCancelSet.cancel();
        const initialSpread = this.dropShadow.spread;
        if (Math.abs(initialSpread - spread) === 0) {
            return;
        }
        (0, animate_1.default)({
            cancelSet: this.spreadCancelSet,
            easing: "ease-out-quad",
            update: (t) => {
                this.dropShadow.spread = MathUtils.lerp(initialSpread, spread, t);
            },
            duration: this.prevState
                ? (this.animateDuration * Math.abs(initialSpread - spread)) / Math.abs(this.prevState.spread - spread)
                : this.animateDuration
        });
    }
    applyStyleParameters(parameters) {
        // First call the parent method to handle base VisualState properties
        super.applyStyleParameters(parameters);
        this.applyStyleProperty(parameters, "sizeOffset", {
            default: (value) => (this.defaultSizeOffset = value),
            hovered: (value) => (this.hoveredSizeOffset = value),
            triggered: (value) => (this.triggeredSizeOffset = value),
            inactive: (value) => (this.inactiveSizeOffset = value),
            toggledDefault: (value) => (this.toggledDefaultSizeOffset = value),
            toggledHovered: (value) => (this.toggledHoveredSizeOffset = value),
            toggledTriggered: (value) => (this.toggledTriggeredSizeOffset = value)
        });
        this.applyStyleProperty(parameters, "spread", {
            default: (value) => (this.defaultSpread = value),
            hovered: (value) => (this.hoveredSpread = value),
            triggered: (value) => (this.triggeredSpread = value),
            inactive: (value) => (this.inactiveSpread = value),
            toggledDefault: (value) => (this.toggledDefaultSpread = value),
            toggledHovered: (value) => (this.toggledHoveredSpread = value),
            toggledTriggered: (value) => (this.toggledTriggeredSpread = value)
        });
    }
    /**
     * Gets the map of visual states for the drop shadow visual.
     *
     * @returns {Map<StateName, DropShadowVisualState>} The map of visual states.
     */
    get visualStates() {
        return this._dropShadowVisualStates;
    }
    updateVisualStates() {
        this._dropShadowVisualStates = new Map([
            [
                Element_1.StateName.default,
                {
                    baseColor: this.baseDefaultColor,
                    shouldPosition: this.defaultShouldPosition,
                    shouldScale: this.defaultShouldScale,
                    localScale: this.defaultScale,
                    localPosition: this.defaultPosition,
                    sizeOffset: this.defaultSizeOffset,
                    spread: this.defaultSpread
                }
            ],
            [
                Element_1.StateName.hovered,
                {
                    baseColor: this.baseHoveredColor,
                    shouldPosition: this.hoveredShouldPosition,
                    shouldScale: this.hoveredShouldScale,
                    sizeOffset: this.hoveredSizeOffset,
                    spread: this.hoveredSpread
                }
            ],
            [
                Element_1.StateName.triggered,
                {
                    baseColor: this.baseTriggeredColor,
                    shouldPosition: this.triggeredShouldPosition,
                    shouldScale: this.triggeredShouldScale,
                    sizeOffset: this.triggeredSizeOffset,
                    spread: this.triggeredSpread
                }
            ],
            [
                Element_1.StateName.toggledHovered,
                {
                    baseColor: this.baseToggledHoveredColor,
                    shouldPosition: this.toggledHoveredShouldPosition,
                    shouldScale: this.toggledHoveredShouldScale,
                    sizeOffset: this.toggledHoveredSizeOffset,
                    spread: this.toggledHoveredSpread
                }
            ],
            [
                Element_1.StateName.toggledDefault,
                {
                    baseColor: this.baseToggledDefaultColor,
                    shouldPosition: this.toggledDefaultShouldPosition,
                    shouldScale: this.toggledDefaultShouldScale,
                    sizeOffset: this.toggledDefaultSizeOffset,
                    spread: this.toggledDefaultSpread
                }
            ],
            [
                Element_1.StateName.toggledTriggered,
                {
                    baseColor: this.baseToggledTriggeredColor,
                    shouldPosition: this.toggledTriggeredShouldPosition,
                    shouldScale: this.toggledTriggeredShouldScale,
                    sizeOffset: this.toggledTriggeredSizeOffset,
                    spread: this.toggledTriggeredSpread
                }
            ],
            [
                Element_1.StateName.error,
                {
                    baseColor: this.baseErrorColor,
                    shouldPosition: this.defaultShouldPosition,
                    shouldScale: this.defaultShouldScale,
                    localScale: this.errorScale,
                    localPosition: this.errorPosition,
                    sizeOffset: this.defaultSizeOffset,
                    spread: this.defaultSpread
                }
            ],
            [
                Element_1.StateName.errorHovered,
                {
                    baseColor: this.baseErrorColor,
                    shouldPosition: this.hoveredShouldPosition,
                    shouldScale: this.hoveredShouldScale,
                    localScale: this.hoveredScale,
                    localPosition: this.errorPosition,
                    sizeOffset: this.hoveredSizeOffset,
                    spread: this.hoveredSpread
                }
            ],
            [
                Element_1.StateName.inactive,
                {
                    baseColor: this.baseInactiveColor,
                    shouldPosition: this.inactiveShouldPosition,
                    shouldScale: this.inactiveShouldScale,
                    localScale: this.inactiveScale,
                    localPosition: this.inactivePosition,
                    sizeOffset: this.inactiveSizeOffset,
                    spread: this.inactiveSpread
                }
            ]
        ]);
        super.updateVisualStates();
    }
    /**
     * Gets the underlying `DropShadow` component.
     *
     * @returns {DropShadow} The underlying drop shadow component.
     */
    get dropShadow() {
        return this._visualComponent;
    }
    /**
     * Sets the underlying `DropShadow` component.
     *
     * @param value - The drop shadow component.
     */
    set dropShadow(value) {
        this._visualComponent = value;
    }
}
exports.DropShadowVisual = DropShadowVisual;
//# sourceMappingURL=DropShadowVisual.js.map