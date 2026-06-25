//@input Component.VFXComponent vfxComp
//@input Component.Text debugText

var threshold = 1.0;
var transform = script.vfxComp.getSceneObject().getTransform();
var prevPos = transform.getWorldPosition();

script.createEvent("UpdateEvent").bind(function(){
    var currPos = transform.getWorldPosition();
    var dist = currPos.sub(prevPos).length;
    
    if (dist > threshold) {
        script.vfxComp.asset.properties.spawnAmount = dist;
        script.vfxComp.asset.properties.prevPos = prevPos;
        if (script.debugText)
            script.debugText.text = "Spawn Amount: " + dist.toFixed(0);
    }
    else {
        script.vfxComp.asset.properties.spawnAmount = 0;        
    }

    prevPos = currPos;
    
})

