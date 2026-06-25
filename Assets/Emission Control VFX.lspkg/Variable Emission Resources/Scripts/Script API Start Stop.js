//@input Component.VFXComponent vfxComp

// This function will be called by the Button's callback
script.onButtonToggle = function(isToggled) {
    if (script.vfxComp) {
        // If the button is active/toggled on, emit. Otherwise, stop.
        script.vfxComp.emitting = isToggled;
    }
};