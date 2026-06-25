//@input Asset.VFXAsset vfx
//@input Component.Text debugText

var setSpawnAmount = false;
script.createEvent("TapEvent").bind(function(){

    setSpawnAmount = true;

})

script.createEvent("UpdateEvent").bind(function(){

    script.vfx.properties.spawnAmount = 0;
    
    if (setSpawnAmount) {
        var spawnAmount = Math.floor(Math.random() * 10);
        script.vfx.properties.spawnAmount = spawnAmount;
        setSpawnAmount = false;
        if (script.debugText)
            script.debugText.text = "Spawn Amount: " + spawnAmount.toFixed(0);        
    }    
        
})

