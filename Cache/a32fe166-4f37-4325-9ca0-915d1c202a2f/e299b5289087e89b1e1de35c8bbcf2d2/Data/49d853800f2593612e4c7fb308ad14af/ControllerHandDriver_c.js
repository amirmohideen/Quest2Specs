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
// @input string handedness = "right" {"hint":"Which controller this driver listens to. Add one driver per hand.", "widget":"combobox", "values":[{"label":"Right", "value":"right"}, {"label":"Left", "value":"left"}]}
// @input Asset.InternetModule internetModule {"hint":"Internet Module asset used to open the secure WebSocket."}
// @input string url = "wss://YOUR-RELAY-HOST/specs" {"hint":"wss URL of the relay's consumer endpoint, e.g. wss://your-relay-host/specs"}
// @input SceneObject handRoot {"hint":"Root of YOUR cloned hand rig. MUST be a child of the Camera. We drive its local transform."}
// @ui {"widget":"group_start", "label":"Pinch (trigger -> finger curl)"}
// @input SceneObject indexJoint {"hint":"Proximal index joint (e.g. the 'index-0' object of your rig)."}
// @input SceneObject thumbJoint {"hint":"Proximal thumb joint (e.g. the 'thumb-0' object of your rig)."}
// @input vec3 curlAxis = {1,0,0} {"hint":"Local axis each finger curls around. Tune signs after a test pass."}
// @input float maxCurlDegrees = 70 {"hint":"Max curl angle in degrees at trigger = 1."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Tuning"}
// @input float posScale = 1 {"hint":"Scales controller travel. 1 = 1:1. Lower it to keep the hand in a smaller volume."}
// @input float calibrateButton = 4 {"hint":"Button index that triggers calibration (Quest: 4 = A/X). Hold controller in place and press."}
// @ui {"widget":"group_end"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/ControllerHandDriver");
Object.setPrototypeOf(script, Module.ControllerHandDriver.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("handedness", []);
    checkUndefined("internetModule", []);
    checkUndefined("url", []);
    checkUndefined("handRoot", []);
    checkUndefined("curlAxis", []);
    checkUndefined("maxCurlDegrees", []);
    checkUndefined("posScale", []);
    checkUndefined("calibrateButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
