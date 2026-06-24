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
// @input SceneObject handRoot {"hint":"Root of YOUR cloned hand rig. Must be in WORLD space (NOT a child of the Camera)."}
// @input SceneObject camera {"hint":"The Spectacles Camera SceneObject (the head). Used as the world reference for alignment."}
// @ui {"widget":"group_start", "label":"Pinch — Index (trigger)"}
// @input SceneObject[] indexJoints = {} {"hint":"Index joints to curl, base-first, e.g. [index-0, index-1]."}
// @input vec3 indexCurlAxis = {1,0,0}
// @input float indexMaxDegrees = 70
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Pinch — Thumb (trigger)"}
// @input SceneObject[] thumbJoints = {} {"hint":"Thumb joints to curl, base-first, e.g. [thumb-0, thumb-1]."}
// @input vec3 thumbCurlAxis = {1,0,0}
// @input float thumbMaxDegrees = 45
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Fist — Middle/Ring/Pinky (grip)"}
// @input SceneObject[] fistJoints = {} {"hint":"Other finger joints to curl when gripping, e.g. [mid-0, mid-1, ring-0, ring-1, pinky-0, pinky-1]."}
// @input vec3 fistCurlAxis = {1,0,0}
// @input float fistMaxDegrees = 80
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"World-lock tuning"}
// @input float anchorDistanceCm = 40 {"hint":"How far in front of you (cm) the hand sits at the moment you calibrate."}
// @input float yawTrimDegrees {"hint":"Manual heading trim (degrees) if left/right feels rotated after calibration."}
// @input float posScale = 1 {"hint":"Movement scale. 1 = physical 1:1. Raise to amplify reach."}
// @input float calibrateButton = 4 {"hint":"Button index that calibrates (Quest: 4 = A/X). Point controller forward, hold still, press."}
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
    checkUndefined("camera", []);
    checkUndefined("indexCurlAxis", []);
    checkUndefined("indexMaxDegrees", []);
    checkUndefined("thumbCurlAxis", []);
    checkUndefined("thumbMaxDegrees", []);
    checkUndefined("fistCurlAxis", []);
    checkUndefined("fistMaxDegrees", []);
    checkUndefined("anchorDistanceCm", []);
    checkUndefined("yawTrimDegrees", []);
    checkUndefined("posScale", []);
    checkUndefined("calibrateButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
