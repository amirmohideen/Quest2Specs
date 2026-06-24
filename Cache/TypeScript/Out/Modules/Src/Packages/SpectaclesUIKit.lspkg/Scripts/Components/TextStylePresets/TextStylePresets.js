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
exports.TextStylePresets = exports.FontWeight = exports.Ranking = exports.Distance = void 0;
var __selfType = requireType("./TextStylePresets");
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
var Distance;
(function (Distance) {
    Distance["Near"] = "near";
    Distance["Far"] = "far";
})(Distance || (exports.Distance = Distance = {}));
var Ranking;
(function (Ranking) {
    Ranking["Title1"] = "Title 1";
    Ranking["Title2"] = "Title 2";
    Ranking["HeadlineXL"] = "Headline XL";
    Ranking["Headline1"] = "Headline 1";
    Ranking["Headline2"] = "Headline 2";
    Ranking["Subheadline"] = "Subheadline";
    Ranking["Button"] = "Button";
    Ranking["Callout"] = "Callout";
    Ranking["Body"] = "Body";
    Ranking["Caption"] = "Caption";
})(Ranking || (exports.Ranking = Ranking = {}));
var FontWeight;
(function (FontWeight) {
    FontWeight[FontWeight["Thin"] = 100] = "Thin";
    FontWeight[FontWeight["ExtraLight"] = 200] = "ExtraLight";
    FontWeight[FontWeight["Light"] = 300] = "Light";
    FontWeight[FontWeight["Normal"] = 400] = "Normal";
    FontWeight[FontWeight["Medium"] = 500] = "Medium";
    FontWeight[FontWeight["SemiBold"] = 600] = "SemiBold";
    FontWeight[FontWeight["Bold"] = 700] = "Bold";
    FontWeight[FontWeight["ExtraBold"] = 800] = "ExtraBold";
    FontWeight[FontWeight["Black"] = 900] = "Black";
})(FontWeight || (exports.FontWeight = FontWeight = {}));
// sizes predefined for Objectiv, by design
const RankingDistanceToSettings = {
    [Ranking.Title1]: { [Distance.Near]: { size: 76 }, [Distance.Far]: { size: 105 } },
    [Ranking.Title2]: { [Distance.Near]: { size: 62 }, [Distance.Far]: { size: 93 } },
    [Ranking.HeadlineXL]: { [Distance.Near]: { size: 55 }, [Distance.Far]: { size: 62 } },
    [Ranking.Headline1]: { [Distance.Near]: { size: 48 }, [Distance.Far]: { size: 54 } },
    [Ranking.Headline2]: { [Distance.Near]: { size: 41 }, [Distance.Far]: { size: 48 } },
    [Ranking.Subheadline]: { [Distance.Near]: { size: 36 }, [Distance.Far]: { size: 41 } },
    [Ranking.Button]: { [Distance.Near]: { size: 34 }, [Distance.Far]: { size: 39 } },
    [Ranking.Callout]: {
        [Distance.Near]: { size: 32, weight: FontWeight.Bold },
        [Distance.Far]: { size: 39, weight: FontWeight.Bold }
    },
    [Ranking.Body]: { [Distance.Near]: { size: 32 }, [Distance.Far]: { size: 39 } },
    [Ranking.Caption]: { [Distance.Near]: { size: 29 }, [Distance.Far]: { size: 36 } }
};
/**
 * TextStylePresets is a utility component designed to standardize and easily apply consistent text styles
 * (including font size and optionally font weight) to a Text component based on a selected "ranking" (such as Title1, Headline, Body, etc.)
 * and a preset "distance" (Near or Far) that accounts for different viewing contexts in AR experiences.
 *
 * The component uses a predefined mapping from ranking and distance to font settings,
 * ensuring design consistency throughout the UI.
 *
 * Intended usage: Attach to a SceneObject that already contains a Text component above this component. Select the desired ranking
 * and distance using the inspector properties to instantly update styling to match design guidelines.
 */
let TextStylePresets = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var TextStylePresets = _classThis = class extends _classSuper {
        constructor() {
            super();
            this._distance = this._distance;
            this._ranking = this._ranking;
            this.initialized = false;
        }
        __initialize() {
            super.__initialize();
            this._distance = this._distance;
            this._ranking = this._ranking;
            this.initialized = false;
        }
        /**
         * get current viewing distance
         */
        get distance() {
            return this._distance;
        }
        /**
         * set current viewing distance
         */
        set distance(value) {
            if (value === undefined || value === this._distance)
                return;
            this._distance = value;
            if (this.initialized) {
                this.updateTextStyle();
            }
        }
        /**
         * get current text ranking
         */
        get ranking() {
            return this._ranking;
        }
        /**
         * set current text ranking
         */
        set ranking(value) {
            if (value === undefined || value === this._ranking)
                return;
            this._ranking = value;
            if (this.initialized) {
                this.updateTextStyle();
            }
        }
        onAwake() {
            this.textComponent = this.sceneObject.getComponent("Text");
            if (!this.textComponent) {
                throw "TextStylePresets requires an existing Text component on the same SceneObject";
            }
            this.updateTextStyle();
        }
        /** Returns the current distance style ("near" or "far") selected for the text. */
        updateTextStyle() {
            const thisSettings = RankingDistanceToSettings[Ranking[this._ranking]][this._distance];
            this.textComponent.size = thisSettings.size;
            // if this is 5.16 and above
            if (!isNull(this.textComponent.weight)) {
                ;
                this.textComponent.weight = thisSettings.weight;
                this.textComponent.size = this.convert516Size(thisSettings);
            }
        }
        // text sizing works different ls version >5.15
        // here is math for conversion to match glyph height for the specs system font
        // for 5.15
        // line height in cm = sizeA / 32.0
        // for 5.16
        // em square height in cm = sizeB / 43.88571429
        // objektiv em square 0.69492703
        // so sizeB = (0.69492703 * sizeA * 43.8851329) / 32
        convert516Size(size) {
            const lineHeightDivisor = 32;
            const emSquareDivisor = 43.88571429;
            const objektivEmSquare = 0.69492703;
            return (objektivEmSquare * size * emSquareDivisor) / lineHeightDivisor;
        }
    };
    __setFunctionName(_classThis, "TextStylePresets");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TextStylePresets = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TextStylePresets = _classThis;
})();
exports.TextStylePresets = TextStylePresets;
//# sourceMappingURL=TextStylePresets.js.map