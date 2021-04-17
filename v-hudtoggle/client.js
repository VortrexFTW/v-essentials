"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let hudEnabled = true;
let chatEnabled = false;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	setHUDEnabled(hudEnabled);
	setChatWindowEnabled(hudEnabled);
	bindKey(SDLK_F7, KEYSTATE_UP, toggleHUD);
	bindKey(SDLK_F8, KEYSTATE_UP, toggleChatBox);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_F7);
	unbindKey(SDLK_F8);
});

// ----------------------------------------------------------------------------

function toggleHUD() {
	hudEnabled = !hudEnabled;
	setHUDEnabled(hudEnabled);
}

// ----------------------------------------------------------------------------

function toggleChatBox() {
	chatEnabled = !chatEnabled;
	setChatWindowEnabled(chatEnabled);
}

// ----------------------------------------------------------------------------
