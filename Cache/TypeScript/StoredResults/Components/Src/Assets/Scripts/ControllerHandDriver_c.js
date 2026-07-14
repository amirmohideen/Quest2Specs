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
// @input vec3 calibrationOffsetCm = {0,-25,35} {"hint":"Fixed offset from your head where the hand lands when you click reset (cm: x=right, y=up, z=forward). e.g. (0,-25,35) = 25 down and 35 forward of where you're looking, roughly a controller resting on your thigh. Fine-tune live with the thumbstick slide and A/B height buttons."}
// @input float yawTrimDegrees {"hint":"Manual heading trim (degrees) if left/right feels rotated after calibration."}
// @input float posScale = 1 {"hint":"Movement scale. 1 = physical 1:1. Raise to amplify reach."}
// @input float resetButton = 3 {"hint":"Button that resets / re-anchors THIS hand (Quest: 3 = thumbstick click). Clears stick/height offsets too."}
// @input float nudgeUpButton = 5 {"hint":"Button that raises THIS hand a step (Quest: 5 = B on right / Y on left)."}
// @input float nudgeDownButton = 4 {"hint":"Button that lowers THIS hand a step (Quest: 4 = A on right / X on left)."}
// @input float nudgeStepCm = 3 {"hint":"Centimetres moved per button press."}
// @input vec3 nudgeAxisWorld = {0,1,0} {"hint":"World direction a raise moves this hand (default up = +Y)."}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Stick slide (this hand's thumbstick)"}
// @input bool enableStickMove = true {"hint":"Let this hand's thumbstick slide the hand. Right stick moves the right hand, left stick the left hand."}
// @input float stickSpeedCmPerSec = 30 {"hint":"How fast (cm/sec) the hand slides at full stick deflection."}
// @input float stickDeadzone = 0.15 {"hint":"Ignore stick magnitudes below this (drift)."}
// @input vec3 stickForwardAxisWorld = {0,0,-1} {"hint":"World direction the hand slides when the stick is pushed forward/up (default -Z)."}
// @input vec3 stickRightDir = {1,0,0} {"hint":"World direction the hand slides when the stick is pushed right (default +X, so left = -X)."}
// @input float stickXIndex = 2 {"hint":"Gamepad axis index for stick X (Quest = 2)."}
// @input float stickYIndex = 3 {"hint":"Gamepad axis index for stick Y (Quest = 3)."}
// @input float maxStickOffsetCm = 150 {"hint":"Clamp the total stick slide (cm) so the hand can't fly away."}
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
    checkUndefined("calibrationOffsetCm", []);
    checkUndefined("yawTrimDegrees", []);
    checkUndefined("posScale", []);
    checkUndefined("resetButton", []);
    checkUndefined("nudgeUpButton", []);
    checkUndefined("nudgeDownButton", []);
    checkUndefined("nudgeStepCm", []);
    checkUndefined("nudgeAxisWorld", []);
    checkUndefined("enableStickMove", []);
    checkUndefined("stickSpeedCmPerSec", []);
    checkUndefined("stickDeadzone", []);
    checkUndefined("stickForwardAxisWorld", []);
    checkUndefined("stickRightDir", []);
    checkUndefined("stickXIndex", []);
    checkUndefined("stickYIndex", []);
    checkUndefined("maxStickOffsetCm", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
