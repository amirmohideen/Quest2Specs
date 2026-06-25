//@input Component.VFXComponent vfxComp

// 1. On start, explicitly turn off emission to match your button's default state
if (script.vfxComp) {
    script.vfxComp.emitting = false;
}

// 2. This function continues to handle the toggles when clicked
script.onButtonToggle = function(isToggled) {
    if (script.vfxComp) {
        script.vfxComp.emitting = isToggled;
    }
};