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
// @input SceneObject[] nativeHandObjects = {} {"hint":"SIK hand visual root object(s) to disable when using the controller (e.g. left/right HandVisual roots)."}
// @input AssignableType[] controllerDrivers = {} {"hint":"The ControllerHandDriver(s) to enable in controller mode (e.g. right + left)."}
// @input bool startInControllerMode {"hint":"Start in controller mode? Usually false (native tracking by default)."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/HandModeToggle");
Object.setPrototypeOf(script, Module.HandModeToggle.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("nativeHandObjects", []);
    checkUndefined("controllerDrivers", []);
    checkUndefined("startInControllerMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
