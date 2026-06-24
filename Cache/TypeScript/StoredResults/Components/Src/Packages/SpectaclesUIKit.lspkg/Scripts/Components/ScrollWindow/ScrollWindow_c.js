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
// @input bool _vertical = true {"hint":"Enable Vertical Scrolling"}
// @input bool _horizontal {"hint":"Enable Horizontal Scrolling"}
// @input vec2 _windowSize = "{32,32}" {"hint":"Size of masked window viewport in local space. <br><br>Note: to set dynamically, use <code>setWindowSize</code>"}
// @input vec2 _scrollDimensions = "{32,100}" {"hint":"Size of total scrollable area. <br><br>Note: to set dynamically, use <code>setScrollDimensions</code>"}
// @input vec2 _scrollPosition {"label":"Scroll Position", "hint":"Scroll Position in pixels in local space"}
// @input bool _scrollSnapping
// @input vec2 _snapRegion = {8,8} {"showIf":"_scrollSnapping"}
// @input bool _edgeFade {"hint":"Add black fade to edges <code>(rendering trick for transparency)</code>"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Packages/SpectaclesUIKit.lspkg/Scripts/Components/ScrollWindow/ScrollWindow");
Object.setPrototypeOf(script, Module.ScrollWindow.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("_vertical", []);
    checkUndefined("_horizontal", []);
    checkUndefined("_windowSize", []);
    checkUndefined("_scrollDimensions", []);
    checkUndefined("_scrollPosition", []);
    checkUndefined("_scrollSnapping", []);
    checkUndefined("_snapRegion", [["_scrollSnapping",true]]);
    checkUndefined("_edgeFade", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
