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
// @input string url = "wss://YOUR-RELAY-HOST/specs" {"hint":"wss URL of the relay's consumer endpoint, e.g. wss://your-host/specs"}
// @input SceneObject handRoot {"hint":"Root of YOUR cloned hand rig. MUST be a child of the Camera. We drive its local transform."}
// @ui {"widget":"group_start", "label":"Pinch — Index (trigger)"}
// @input SceneObject[] indexJoints = {} {"hint":"Index joints to curl, base-first, e.g. [index-0, index-1]. Start with just index-0."}
// @input vec3 indexCurlAxis = {1,0,0} {"hint":"Local axis the index curls around. Flip a sign if it bends the wrong way / try (0,0,1) if it twists."}
// @input float indexMaxDegrees = 70 {"hint":"Index curl angle in degrees at full trigger."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Pinch — Thumb (trigger)"}
// @input SceneObject[] thumbJoints = {} {"hint":"Thumb joints to curl, base-first, e.g. [thumb-0, thumb-1]. Start with just thumb-0."}
// @input vec3 thumbCurlAxis = {1,0,0} {"hint":"Local axis the thumb curls around. Tune so the thumb meets the index."}
// @input float thumbMaxDegrees = 45 {"hint":"Thumb curl angle in degrees at full trigger."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Fist — Middle/Ring/Pinky (grip)"}
// @input SceneObject[] fistJoints = {} {"hint":"All other finger joints to curl when gripping, e.g. [mid-0, mid-1, ring-0, ring-1, pinky-0, pinky-1]."}
// @input vec3 fistCurlAxis = {1,0,0} {"hint":"Local axis these fingers curl around (usually same as index)."}
// @input float fistMaxDegrees = 80 {"hint":"Fist curl angle in degrees at full grip."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Tuning"}
// @input float posScale = 1 {"hint":"Scales controller travel. 1 = 1:1. Lower it to keep the hand in a smaller volume."}
// @input float calibrateButton = 4 {"hint":"Button index that re-zeroes the rest spot (Quest: 4 = A/X). Hold still and press."}
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
    checkUndefined("indexCurlAxis", []);
    checkUndefined("indexMaxDegrees", []);
    checkUndefined("thumbCurlAxis", []);
    checkUndefined("thumbMaxDegrees", []);
    checkUndefined("fistCurlAxis", []);
    checkUndefined("fistMaxDegrees", []);
    checkUndefined("posScale", []);
    checkUndefined("calibrateButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
