"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let hudEnabled = true;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	setHUDEnabled(hudEnabled);
	setChatWindowEnabled(hudEnabled);
	bindKey(SDLK_F7, KEYSTATE_UP, toggleHUD);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_F7);
});

// ----------------------------------------------------------------------------

function toggleHUD() {
	hudEnabled = !hudEnabled;
	setHUDEnabled(hudEnabled);
	setChatWindowEnabled(hudEnabled);
}

// ----------------------------------------------------------------------------
