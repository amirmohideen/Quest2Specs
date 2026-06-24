if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @input string _distance = "far" {"hint":"Viewing distance preset (affects text size). 'Near' for objects at 55cm, 'Far' at 110cm.", "widget":"combobox", "values":[{"label":"Near", "value":"near"}, {"label":"Far", "value":"far"}]}
// @input string _ranking {"hint":"Preset text style ranking (e.g. Title, Headline, Caption). Applies a consistent font size and weight by design.", "widget":"combobox", "values":[{"label":"Title 1", "value":"Title1"}, {"label":"Title 2", "value":"Title2"}, {"label":"Headline XL", "value":"HeadlineXL"}, {"label":"Headline 1", "value":"Headline1"}, {"label":"Headline 2", "value":"Headline2"}, {"label":"Subheadline", "value":"Subheadline"}, {"label":"Button", "value":"Button"}, {"label":"Callout", "value":"Callout"}, {"label":"Body", "value":"Body"}, {"label":"Caption", "value":"Caption"}]}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Packages/SpectaclesUIKit.lspkg/Scripts/Components/TextStylePresets/TextStylePresets");
Object.setPrototypeOf(script, Module.TextStylePresets.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_distance", []);
    checkUndefined("_ranking", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
