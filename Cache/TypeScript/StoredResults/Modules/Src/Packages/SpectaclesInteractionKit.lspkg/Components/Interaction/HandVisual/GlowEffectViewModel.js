"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlowEffectViewModel = void 0;
const InteractionManager_1 = require("../../../Core/InteractionManager/InteractionManager");
const Interactor_1 = require("../../../Core/Interactor/Interactor");
const HandInputData_1 = require("../../../Providers/HandInputData/HandInputData");
const ColliderUtils_1 = require("../../../Utils/ColliderUtils");
const StateMachine_1 = require("../../../Utils/StateMachine");
const HandVisual_1 = require("./HandVisual");
/**
 * GlowEffectViewModel manages the state and logic for the hand glow effect.
 */
class GlowEffectViewModel {
    constructor(config) {
        this.config = config;
        this.pokePinchBlend = 0;
        this.isMeshVisibilityDesired = true;
        this.isIndexGlowVisible = true;
        this.isThumbGlowVisible = true;
        this.debugLines = [];
        // Internal state
        this.handInputData = HandInputData_1.HandInputData.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this.pokeLerpTime = 0;
        this.pinchLerpTime = 0;
        this.globalLerpTime = 0;
        this.pokeValidLerpTime = 0;
        this.pinchValidLerpTime = 0;
        this.lastPinchValidState = false;
        this.lastProximityValue = 0;
        this.finalColor = new vec4(0, 0, 0, 0);
        this.closestPokeInteractableDistance = Infinity;
        this.closestPinchInteractableDistance = Infinity;
        this.isPalmTapping = false;
        this.colliderProcessIndex = 0;
        this.currentOverlappingColliders = [];
        this.minPokeDistanceSq = Infinity;
        this.minPinchDistanceSq = Infinity;
        this.foundPokeInteractable = false;
        this.foundPinchInteractable = false;
        this.closestPokePoint = null;
        this.closestPinchPoint = null;
        this.cachedIndexTipPosition = new vec3(0, 0, 0);
        this.foundBestPoke = false;
        this.foundBestPinch = false;
        this.fingerHighlightLeftMaterial = requireAsset("../../../Assets/Materials/BaseHandVisualsMaterials/FingerHighlightLeft.mat");
        this.fingerHighlightRightMaterial = requireAsset("../../../Assets/Materials/BaseHandVisualsMaterials/FingerHighlightRight.mat");
        this.handInteractor = config.handInteractor;
        this.hand = this.handInputData.getHand(config.handType);
        this.style = config.style;
        this.debugModeEnabled = config.debugModeEnabled;
        this.proximitySensor = config.proximitySensor;
        this.indexTipSceneObject = config.indexTipSceneObject;
        this.overrideMap = config.overrideMap;
        this.handVisuals = config.handVisuals;
        this.currentHighlightGradientMaskPosition = this.style.pokeHighlightGradientMaskMin;
        this.currentOccludeGradientMaskPosition = this.style.pokeOccludeGradientMaskMin;
        this.pokeNearSq = this.style.pokeHighlightThresholdNear * this.style.pokeHighlightThresholdNear;
        this.pinchNearSq = this.style.pinchHighlightThresholdNear * this.style.pinchHighlightThresholdNear;
        // Initialize properties
        this.pinchProps = {
            brightness: 0,
            color: this.style.hoverColor,
            glowBrightness: 0,
            glowColor: this.style.hoverColor,
            exponent: this.style.pinchExponent
        };
        this.pokeProps = {
            brightness: 0,
            color: this.style.hoverColor,
            glowBrightness: 0,
            glowColor: this.style.hoverColor,
            depthFactor: 0,
            highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
            occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
            exponent: this.style.pokeExponent
        };
        // Set up the state machine
        this.stateMachine = new StateMachine_1.default("GlowEffectViewModel");
        this.setupStates();
        this.setVisualSelection(config.initialHandVisualSelection);
        this.hand.onHandFound.add(() => {
            this.stateMachine.updateEvent.enabled = true;
            this.stateMachine.lateUpdateEvent.enabled = true;
        });
        this.hand.onHandLost.add(() => {
            this.stateMachine.updateEvent.enabled = false;
            this.stateMachine.lateUpdateEvent.enabled = false;
            this.isMeshVisibilityDesired = false;
            this.isIndexGlowVisible = false;
            this.isThumbGlowVisible = false;
            this.pinchProps.brightness = 0;
            this.pinchProps.glowBrightness = 0;
            this.pokeProps.brightness = 0;
            this.pokeProps.glowBrightness = 0;
            this.closestPokeInteractableDistance = Infinity;
            this.closestPinchInteractableDistance = Infinity;
            this.colliderProcessIndex = 0;
            this.currentOverlappingColliders = [];
        });
        this.stateMachine.updateEvent.enabled = this.hand.isTracked();
        this.stateMachine.lateUpdateEvent.enabled = this.hand.isTracked();
    }
    /**
     * Cleans up the view model.
     */
    destroy() {
        this.stateMachine.destroy();
    }
    /**
     * Correctly maps the HandVisualSelection enum to the state machine's state names.
     */
    setVisualSelection(selection) {
        let stateName;
        switch (selection) {
            case HandVisual_1.HandVisualSelection.AlwaysOn:
                stateName = "AlwaysOn";
                break;
            case HandVisual_1.HandVisualSelection.Occluder:
                stateName = "Occluder";
                break;
            case HandVisual_1.HandVisualSelection.None:
                stateName = "None";
                break;
            default:
                stateName = "Interactive";
                break;
        }
        this.stateMachine.enterState(stateName);
    }
    setupStates() {
        this.stateMachine.addState({
            name: "AlwaysOn",
            onEnter: () => this.resetToBaseState(true),
            onUpdate: () => this.updateInteractionEffects(true)
        });
        this.stateMachine.addState({
            name: "Interactive",
            onEnter: () => this.resetToBaseState(false),
            onUpdate: () => this.updateInteractionEffects(false)
        });
        this.stateMachine.addState({
            name: "Occluder",
            onEnter: () => {
                this.isMeshVisibilityDesired = true;
                this.isIndexGlowVisible = false;
                this.isThumbGlowVisible = false;
            }
        });
        this.stateMachine.addState({
            name: "None",
            onEnter: () => {
                this.isMeshVisibilityDesired = false;
                this.isIndexGlowVisible = false;
                this.isThumbGlowVisible = false;
            }
        });
    }
    updateInteractionEffects(isAlwaysOn) {
        if (!isAlwaysOn && !this.hand.isTracked()) {
            this.pinchProps.brightness = 0;
            this.pinchProps.glowBrightness = 0;
            this.pokeProps.brightness = 0;
            this.pokeProps.glowBrightness = 0;
            this.isMeshVisibilityDesired = false;
            this.isIndexGlowVisible = false;
            this.isThumbGlowVisible = false;
            this.pokePinchBlend = 0;
            this.closestPokeInteractableDistance = Infinity;
            this.closestPinchInteractableDistance = Infinity;
            return;
        }
        if (isAlwaysOn) {
            this.pokePinchBlend = this.hand.getPinchStrength() ?? 0.0;
            this.isMeshVisibilityDesired = true;
            this.isIndexGlowVisible = true;
            this.isThumbGlowVisible = true;
            return;
        }
        this.updateClosestInteractableDistances();
        const isPinching = this.hand.isPinching();
        const isPoking = this.handInteractor.isPoking();
        const pinchStrength = this.hand.getPinchStrength() ?? 0.0;
        const isPokeValid = this.handInteractor.pokeIsValid;
        const hasIndirectTarget = this.handInteractor.activeTargetingMode === Interactor_1.TargetingMode.Indirect && this.handInteractor.targetHitInfo !== null;
        const normalizedPokeDepth = this.handInteractor.normalizedPokeDepth ?? 0;
        const pokeDistance = isPoking ? 0 : this.closestPokeInteractableDistance;
        const pinchDistance = this.closestPinchInteractableDistance;
        const isTriggered = isPoking || isPinching || this.isPalmTapping;
        const deltaTime = getDeltaTime();
        this.globalLerpTime = this.updateLerpTime(this.globalLerpTime, isTriggered, deltaTime, this.style.triggeredLerpDurationSeconds);
        const globalTriggerFactor = this.globalLerpTime / this.style.triggeredLerpDurationSeconds;
        this.lerpColor(this.style.hoverColor, this.style.triggerColor, globalTriggerFactor, this.finalColor);
        // Update pinch validity and proximity
        const isPinchValid = pinchDistance !== Infinity || hasIndirectTarget || isAlwaysOn;
        let currentProximity = 0;
        if (pinchDistance !== Infinity) {
            currentProximity = MathUtils.clamp(1.0 - pinchDistance / this.style.pinchHighlightThresholdFar, 0.0, 1.0);
            this.lastProximityValue = currentProximity;
        }
        else if (hasIndirectTarget) {
            this.lastProximityValue = 1.0;
        }
        if (this.lastPinchValidState && !isPinchValid) {
            this.pinchValidLerpTime = this.lastProximityValue * this.style.pinchValidLerpDurationSeconds;
        }
        else if (!this.lastPinchValidState && isPinchValid) {
            // When gaining a target, start from zero
            this.pinchValidLerpTime = 0;
        }
        this.pinchValidLerpTime = this.updateLerpTime(this.pinchValidLerpTime, isPinchValid, deltaTime, this.style.pinchValidLerpDurationSeconds);
        this.lastPinchValidState = isPinchValid;
        const pinchValidFactor = this.pinchValidLerpTime / this.style.pinchValidLerpDurationSeconds;
        // Calculate and apply final effect properties
        this.pinchProps = this.calculatePinchEffects(isPinching, pinchStrength, pinchDistance, deltaTime, isAlwaysOn, pinchValidFactor, this.finalColor, hasIndirectTarget);
        this.pokeProps = this.calculatePokeEffects(isPoking, isPokeValid, pokeDistance, deltaTime, isAlwaysOn, this.finalColor, normalizedPokeDepth);
        this.pokePinchBlend = pinchStrength;
        this.updateVisibilityState(this.pinchProps, this.pokeProps, this.pokePinchBlend, isAlwaysOn);
    }
    calculatePinchEffects(isPinching, pinchStrength, distance, deltaTime, isAlwaysOn, pinchValidFactor, finalColor, hasIndirectTarget) {
        if (distance === Infinity && !hasIndirectTarget && !isAlwaysOn && this.pinchValidLerpTime === 0) {
            this.pinchLerpTime = this.updateLerpTime(this.pinchLerpTime, false, deltaTime, this.style.triggeredLerpDurationSeconds);
            return {
                brightness: 0,
                color: finalColor,
                glowBrightness: 0,
                glowColor: finalColor,
                exponent: this.style.pinchExponent
            };
        }
        // Update pinch trigger state
        this.pinchLerpTime = this.updateLerpTime(this.pinchLerpTime, isPinching, deltaTime, this.style.triggeredLerpDurationSeconds);
        const pinchTriggerFactor = this.pinchLerpTime / this.style.triggeredLerpDurationSeconds;
        // Calculate proximity and strength
        const brightnessRampStrength = MathUtils.clamp(pinchStrength / this.style.pinchBrightnessMaxStrength, 0.0, 1.0);
        const isPinchValid = distance !== Infinity || hasIndirectTarget || isAlwaysOn;
        // Calculate the proximity based on the direct distance (which includes the override scaling)
        const normalizedProximity = MathUtils.clamp(1.0 - distance / this.style.pinchHighlightThresholdFar, 0.0, 1.0);
        // An active indirect target has a conceptual proximity of 1.0
        const indirectProximity = hasIndirectTarget ? 1.0 : 0.0;
        // The final target proximity is the MAXIMUM of the available interaction signals.
        // This ensures the override works, and an indirect target can still keep the brightness high.
        const targetProximity = Math.max(normalizedProximity, indirectProximity);
        // Apply the master lerp factor for smooth fades
        const effectiveProximity = isPinchValid ? targetProximity * pinchValidFactor : pinchValidFactor;
        // Calculate base brightness
        let baseBrightness;
        let baseGlowBrightness;
        if (isAlwaysOn) {
            baseBrightness = this.style.pinchBrightnessMax;
            baseGlowBrightness = this.style.pinchGlowBrightnessMax;
        }
        else {
            baseBrightness = effectiveProximity * brightnessRampStrength * this.style.pinchBrightnessMax;
            baseGlowBrightness = effectiveProximity * brightnessRampStrength * this.style.pinchGlowBrightnessMax;
        }
        // Calculate triggered brightness and exponent
        const triggeredBrightness = baseBrightness * this.style.pinchTriggeredMult;
        const triggeredGlowBrightness = baseGlowBrightness * this.style.pinchTriggeredMult;
        const finalPinchExponent = MathUtils.lerp(this.style.pinchExponent, this.style.pinchExponentTriggered, pinchTriggerFactor);
        // Return final lerped properties
        return {
            brightness: MathUtils.lerp(baseBrightness, triggeredBrightness, pinchTriggerFactor),
            color: finalColor,
            glowBrightness: MathUtils.lerp(baseGlowBrightness, triggeredGlowBrightness, pinchTriggerFactor),
            glowColor: finalColor,
            exponent: finalPinchExponent
        };
    }
    calculatePokeEffects(isPoking, isPokeValid, distance, deltaTime, isAlwaysOn, finalColor, normalizedPokeDepth) {
        if (distance === Infinity && !isAlwaysOn && !this.isPalmTapping) {
            // Reset lerp times if we have no target
            this.pokeLerpTime = this.updateLerpTime(this.pokeLerpTime, false, deltaTime, this.style.triggeredLerpDurationSeconds);
            this.pokeValidLerpTime = this.updateLerpTime(this.pokeValidLerpTime, false, deltaTime, this.style.pokeValidLerpDurationSeconds);
            // Let gradients lerp back to their min
            const minHighlight = this.style.pokeHighlightGradientMaskMin;
            if (this.currentHighlightGradientMaskPosition !== minHighlight) {
                this.currentHighlightGradientMaskPosition = MathUtils.lerp(this.currentHighlightGradientMaskPosition, minHighlight, this.style.pokeGradientMaskLerpSpeed * deltaTime);
            }
            const minOcclude = this.style.pokeOccludeGradientMaskMin;
            if (this.currentOccludeGradientMaskPosition !== minOcclude) {
                this.currentOccludeGradientMaskPosition = MathUtils.lerp(this.currentOccludeGradientMaskPosition, minOcclude, this.style.pokeGradientMaskLerpSpeed * deltaTime);
            }
            return {
                brightness: 0,
                color: finalColor,
                glowBrightness: 0,
                glowColor: finalColor,
                highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
                depthFactor: 0,
                occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
                exponent: this.style.pokeExponent
            };
        }
        // We have a target, update poke trigger and validity states
        this.pokeLerpTime = this.updateLerpTime(this.pokeLerpTime, isPoking || this.isPalmTapping, deltaTime, this.style.triggeredLerpDurationSeconds);
        const pokeTriggerFactor = this.pokeLerpTime / this.style.triggeredLerpDurationSeconds;
        this.pokeValidLerpTime = this.updateLerpTime(this.pokeValidLerpTime, isPokeValid || this.isPalmTapping, deltaTime, this.style.pokeValidLerpDurationSeconds);
        const pokeValidFactor = this.pokeValidLerpTime / this.style.pokeValidLerpDurationSeconds;
        const pokeBrightnessFactor = this.isPalmTapping ? 1.0 : pokeValidFactor;
        // Update poke gradient mask positions
        this.currentHighlightGradientMaskPosition = MathUtils.lerp(this.currentHighlightGradientMaskPosition, this.calculateHighlightGradientMaskPosition(distance), this.style.pokeGradientMaskLerpSpeed * deltaTime);
        this.currentOccludeGradientMaskPosition = MathUtils.lerp(this.currentOccludeGradientMaskPosition, this.calculateOccludeGradientMaskPosition(distance), this.style.pokeGradientMaskLerpSpeed * deltaTime);
        // Calculate proximity and depth
        const normalizedProximity = MathUtils.clamp(1.0 - distance / this.style.pokeHighlightThresholdFar, 0.0, 1.0);
        const pokeDepthFactor = MathUtils.clamp((normalizedPokeDepth - this.style.pokeDepthMaskStart) / this.style.pokeDepthMaskRange, 0, 1);
        // Calculate base poke brightness
        const basePokeBrightness = isAlwaysOn || this.isPalmTapping
            ? this.style.pokeBrightnessMax
            : normalizedProximity * this.style.pokeBrightnessMax;
        const basePokeGlowBrightness = isAlwaysOn || this.isPalmTapping
            ? this.style.pokeGlowBrightnessMax
            : normalizedProximity * this.style.pokeGlowBrightnessMax;
        // Calculate triggered poke brightness
        const triggeredPokeBrightness = this.style.pokeBrightnessMax * this.style.pokeTriggeredMult;
        const triggeredPokeGlowBrightness = this.style.pokeGlowBrightnessMax * this.style.pokeTriggeredMult;
        const finalPokeBrightness = MathUtils.lerp(basePokeBrightness, triggeredPokeBrightness, pokeTriggerFactor);
        const finalPokeGlowBrightness = MathUtils.lerp(basePokeGlowBrightness, triggeredPokeGlowBrightness, pokeTriggerFactor);
        const finalPokeExponent = MathUtils.lerp(this.style.pokeExponent, this.style.pokeExponentTriggered, pokeTriggerFactor);
        // Return final lerped and validated properties
        return {
            brightness: finalPokeBrightness * pokeBrightnessFactor,
            color: finalColor,
            glowBrightness: finalPokeGlowBrightness * pokeBrightnessFactor,
            glowColor: finalColor,
            highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
            depthFactor: pokeDepthFactor,
            occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
            exponent: finalPokeExponent
        };
    }
    shouldAlwaysShowMesh() {
        const activeMeshMaterial = this.handVisuals.meshType === HandVisual_1.HandMeshType.Full
            ? this.handVisuals.handMeshFull.mainMaterial
            : this.handVisuals.handMeshIndexThumb.mainMaterial;
        return !(activeMeshMaterial.isSame(this.fingerHighlightLeftMaterial) ||
            activeMeshMaterial.isSame(this.fingerHighlightRightMaterial));
    }
    updateVisibilityState(pinchProps, pokeProps, pokePinchBlend, isAlwaysOn) {
        const shouldAlwaysShow = this.shouldAlwaysShowMesh();
        if (isAlwaysOn || shouldAlwaysShow) {
            this.isMeshVisibilityDesired = true;
            this.isIndexGlowVisible = true;
            this.isThumbGlowVisible = true;
        }
        else {
            const isProximityActive = pokeProps.highlightGradientMaskPosition >
                this.style.pokeHighlightGradientMaskMin + this.style.pokeGradientMaskCutoff;
            if (pokePinchBlend < this.style.pokeGradientMaskCutoff) {
                this.isMeshVisibilityDesired = pokeProps.brightness > this.style.pokeGradientMaskCutoff || isProximityActive;
                this.isIndexGlowVisible = pokeProps.glowBrightness > this.style.pokeGradientMaskCutoff;
                this.isThumbGlowVisible = false;
            }
            else {
                const isPinchGlowActive = pinchProps.glowBrightness > this.style.pokeGradientMaskCutoff;
                this.isMeshVisibilityDesired =
                    pinchProps.brightness > this.style.pokeGradientMaskCutoff || isProximityActive || this.isPalmTapping;
                this.isIndexGlowVisible = isPinchGlowActive;
                this.isThumbGlowVisible = isPinchGlowActive;
            }
        }
    }
    resetToBaseState(isAlwaysOn) {
        const pinchStartBrightness = isAlwaysOn ? this.style.pinchBrightnessMax : 0;
        const pinchStartGlowBrightness = isAlwaysOn ? this.style.pinchGlowBrightnessMax : 0;
        const pokeStartBrightness = isAlwaysOn ? this.style.pokeBrightnessMax : 0;
        const pokeStartGlowBrightness = isAlwaysOn ? this.style.pokeGlowBrightnessMax : 0;
        this.pinchProps = {
            brightness: pinchStartBrightness,
            color: this.style.hoverColor,
            glowBrightness: pinchStartGlowBrightness,
            glowColor: this.style.hoverColor,
            exponent: this.style.pinchExponent
        };
        this.currentHighlightGradientMaskPosition = this.style.pokeHighlightGradientMaskMin;
        this.currentOccludeGradientMaskPosition = this.style.pokeOccludeGradientMaskMin;
        this.pokeProps = {
            brightness: pokeStartBrightness,
            color: this.style.hoverColor,
            glowBrightness: pokeStartGlowBrightness,
            glowColor: this.style.hoverColor,
            depthFactor: 0,
            highlightGradientMaskPosition: this.currentHighlightGradientMaskPosition,
            occludeGradientMaskPosition: this.currentOccludeGradientMaskPosition,
            exponent: this.style.pokeExponent
        };
        this.pokePinchBlend = this.hand.getPinchStrength() ?? 0.0;
        const isPokeValid = this.handInteractor.pokeIsValid;
        this.pokeValidLerpTime = isPokeValid ? this.style.pokeValidLerpDurationSeconds : 0;
        const hasIndirectTarget = this.handInteractor.targetHitInfo !== null;
        const isPinchValid = this.closestPinchInteractableDistance !== Infinity || hasIndirectTarget || isAlwaysOn;
        this.lastPinchValidState = isPinchValid;
        this.lastProximityValue = 0;
        this.pinchValidLerpTime = isPinchValid ? this.style.pinchValidLerpDurationSeconds : 0;
        this.isPalmTapping = false;
    }
    updateClosestInteractableDistances() {
        if (!this.indexTipSceneObject || !this.proximitySensor) {
            this.closestPokeInteractableDistance = Infinity;
            this.closestPinchInteractableDistance = Infinity;
            this.currentOverlappingColliders = [];
            this.colliderProcessIndex = 0;
            return;
        }
        if (this.colliderProcessIndex === 0) {
            this.currentOverlappingColliders = this.proximitySensor.getOverlappingColliders();
            this.minPokeDistanceSq = Infinity;
            this.minPinchDistanceSq = Infinity;
            this.foundPokeInteractable = false;
            this.foundPinchInteractable = false;
            this.closestPokePoint = null;
            this.closestPinchPoint = null;
            this.cachedIndexTipPosition = this.indexTipSceneObject.getTransform().getWorldPosition();
            this.foundBestPoke = false;
            this.foundBestPinch = false;
            if (this.debugModeEnabled) {
                this.debugLines = [];
            }
        }
        const eligibleCount = this.currentOverlappingColliders.length;
        if (eligibleCount === 0) {
            this.closestPokeInteractableDistance = Infinity;
            this.closestPinchInteractableDistance = Infinity;
            this.colliderProcessIndex = 0;
            return;
        }
        const chunkSize = Math.max(1, Math.floor(Math.sqrt(eligibleCount)));
        const endIndex = Math.min(this.colliderProcessIndex + chunkSize, eligibleCount);
        for (let i = this.colliderProcessIndex; i < endIndex; i++) {
            if (this.foundBestPoke && this.foundBestPinch) {
                this.colliderProcessIndex = eligibleCount;
                break;
            }
            const collider = this.currentOverlappingColliders[i];
            const interactable = this.interactionManager.getInteractableByCollider(collider);
            if (interactable) {
                const override = this.overrideMap.get(interactable.sceneObject);
                let pokeDistanceOverride = null;
                let pinchDistanceOverride = null;
                let disablePoke = false;
                let forcePoke = false;
                let disablePinch = false;
                let forcePinch = false;
                if (override) {
                    for (const item of override.overrides) {
                        switch (item.overrideType) {
                            case HandVisual_1.HandVisualOverrideType.DisablePokeVisual:
                                disablePoke = true;
                                break;
                            case HandVisual_1.HandVisualOverrideType.ForcePokeVisual:
                                forcePoke = true;
                                break;
                            case HandVisual_1.HandVisualOverrideType.PokeDistanceOverride:
                                pokeDistanceOverride = item.pokeDistance ?? null;
                                break;
                            case HandVisual_1.HandVisualOverrideType.DisablePinchVisual:
                                disablePinch = true;
                                break;
                            case HandVisual_1.HandVisualOverrideType.ForcePinchVisual:
                                forcePinch = true;
                                break;
                            case HandVisual_1.HandVisualOverrideType.PinchDistanceOverride:
                                pinchDistanceOverride = item.pinchDistance ?? null;
                                break;
                        }
                    }
                }
                const canPoke = ((interactable.targetingMode & Interactor_1.TargetingMode.Poke) !== 0 || forcePoke) && !disablePoke;
                const canPinch = ((interactable.targetingMode & Interactor_1.TargetingMode.Direct) !== 0 || forcePinch) && !disablePinch;
                const effectiveCanPoke = canPoke && !this.foundBestPoke;
                const effectiveCanPinch = canPinch && !this.foundBestPinch;
                if (!effectiveCanPoke && !effectiveCanPinch) {
                    if (this.debugModeEnabled && !canPoke && !canPinch) {
                        const colliderCenter = collider.getTransform().getWorldPosition();
                        this.debugLines.push({
                            start: this.cachedIndexTipPosition,
                            end: colliderCenter,
                            color: new vec4(1, 0, 0, 1)
                        });
                    }
                    continue;
                }
                const closestPoint = ColliderUtils_1.ColliderUtils.getClosestPointOnColliderToPoint(collider, this.cachedIndexTipPosition);
                const baseDistanceSq = this.cachedIndexTipPosition.distanceSquared(closestPoint);
                if ((!effectiveCanPoke || baseDistanceSq > this.minPokeDistanceSq) &&
                    (!effectiveCanPinch || baseDistanceSq > this.minPinchDistanceSq)) {
                    continue;
                }
                if (effectiveCanPoke) {
                    this.foundPokeInteractable = true;
                    let pokeDistanceSq = baseDistanceSq;
                    const epsilon = 1e-6;
                    if (pokeDistanceOverride !== null && pokeDistanceOverride > epsilon) {
                        const pokeDistanceOverrideSq = pokeDistanceOverride * pokeDistanceOverride;
                        const scaledDistanceSq = (baseDistanceSq / pokeDistanceOverrideSq) *
                            (this.style.pokeHighlightThresholdFar * this.style.pokeHighlightThresholdFar);
                        pokeDistanceSq = scaledDistanceSq;
                    }
                    if (pokeDistanceSq < this.minPokeDistanceSq) {
                        this.minPokeDistanceSq = pokeDistanceSq;
                        this.closestPokePoint = closestPoint;
                        if (this.minPokeDistanceSq <= this.pokeNearSq) {
                            this.foundBestPoke = true;
                        }
                    }
                }
                if (effectiveCanPinch) {
                    this.foundPinchInteractable = true;
                    let pinchDistanceSq = baseDistanceSq;
                    if (pinchDistanceOverride !== null && pinchDistanceOverride > 1e-6) {
                        const pinchDistanceOverrideSq = pinchDistanceOverride * pinchDistanceOverride;
                        if (baseDistanceSq > pinchDistanceOverrideSq) {
                            pinchDistanceSq = Infinity;
                        }
                        else {
                            const scaledDistanceSq = (baseDistanceSq / pinchDistanceOverrideSq) *
                                (this.style.pinchHighlightThresholdFar * this.style.pinchHighlightThresholdFar);
                            pinchDistanceSq = scaledDistanceSq;
                        }
                    }
                    if (pinchDistanceSq < this.minPinchDistanceSq) {
                        this.minPinchDistanceSq = pinchDistanceSq;
                        this.closestPinchPoint = closestPoint;
                        if (this.minPinchDistanceSq <= this.pinchNearSq) {
                            this.foundBestPinch = true;
                        }
                    }
                }
            }
        }
        this.colliderProcessIndex = endIndex;
        const currentPokeDistance = this.foundPokeInteractable ? Math.sqrt(this.minPokeDistanceSq) : Infinity;
        const currentPinchDistance = this.foundPinchInteractable ? Math.sqrt(this.minPinchDistanceSq) : Infinity;
        if (this.colliderProcessIndex >= eligibleCount) {
            this.closestPokeInteractableDistance = currentPokeDistance;
            this.closestPinchInteractableDistance = currentPinchDistance;
            this.colliderProcessIndex = 0;
            if (this.debugModeEnabled) {
                if (this.closestPokePoint) {
                    this.debugLines.push({
                        start: this.cachedIndexTipPosition,
                        end: this.closestPokePoint,
                        color: new vec4(1, 0.5, 0, 1)
                    });
                }
                if (this.closestPinchPoint) {
                    this.debugLines.push({
                        start: this.cachedIndexTipPosition,
                        end: this.closestPinchPoint,
                        color: new vec4(0, 1, 0.5, 1)
                    });
                }
            }
        }
        else {
            this.closestPokeInteractableDistance = Math.min(this.closestPokeInteractableDistance, currentPokeDistance);
            this.closestPinchInteractableDistance = Math.min(this.closestPinchInteractableDistance, currentPinchDistance);
        }
    }
    calculateHighlightGradientMaskPosition(distance) {
        return this.calculateGradientMaskPosition(distance, this.style.pokeHighlightThresholdNear, this.style.pokeHighlightThresholdFar, this.style.pokeHighlightGradientMaskMin, this.style.pokeHighlightGradientMaskMax);
    }
    calculateOccludeGradientMaskPosition(distance) {
        return this.calculateGradientMaskPosition(distance, this.style.pokeOccludeThresholdNear, this.style.pokeOccludeThresholdFar, this.style.pokeOccludeGradientMaskMin, this.style.pokeOccludeGradientMaskMax);
    }
    calculateGradientMaskPosition(distance, thresholdNear, thresholdFar, maskMin, maskMax) {
        if (distance === Infinity || distance >= thresholdFar)
            return maskMin;
        return MathUtils.clamp(MathUtils.remap(distance, thresholdNear, thresholdFar, maskMax, maskMin), maskMin, maskMax);
    }
    updateLerpTime(currentLerpTime, isTriggered, deltaTime, maxDuration) {
        const targetTime = isTriggered ? maxDuration : 0;
        const direction = Math.sign(targetTime - currentLerpTime);
        const newTime = currentLerpTime + deltaTime * direction;
        return MathUtils.clamp(newTime, 0, maxDuration);
    }
    lerpColor(a, b, t, out) {
        const factor = MathUtils.clamp(t, 0, 1);
        out.x = a.x + (b.x - a.x) * factor;
        out.y = a.y + (b.y - a.y) * factor;
        out.z = a.z + (b.z - a.z) * factor;
        out.w = a.w + (b.w - a.w) * factor;
    }
}
exports.GlowEffectViewModel = GlowEffectViewModel;
//# sourceMappingURL=GlowEffectViewModel.js.map