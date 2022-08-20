"use strict";

// ----------------------------------------------------------------------------

let hudEnabled = true;
let chatEnabled = true;
let chatHidden = false;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	setHUDEnabled(hudEnabled);
	setChatWindowEnabled(chatEnabled);
	bindKey(SDLK_F7, KEYSTATE_UP, toggleHUD);
	bindKey(SDLK_F8, KEYSTATE_UP, toggleChatBox);
	bindKey(SDLK_TAB, KEYSTATE_DOWN, hideChatBox);
	bindKey(SDLK_TAB, KEYSTATE_UP, showChatBox);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
	unbindKey(SDLK_F7);
	unbindKey(SDLK_F8);

	unbindKey(SDLK_TAB);
});

// ----------------------------------------------------------------------------

function toggleHUD() {
	hudEnabled = !hudEnabled;
	setHUDEnabled(hudEnabled);
	if (game.game == GAME_GTA_IV) {
		natives.displayCash(hudEnabled);
		natives.displayAmmo(hudEnabled);
		natives.displayHud(hudEnabled);
		natives.displayRadar(hudEnabled);
		natives.displayAreaName(hudEnabled);
	}
}

// ----------------------------------------------------------------------------

function toggleChatBox() {
	chatEnabled = !chatEnabled;
	setChatWindowEnabled(chatEnabled);
}

// ----------------------------------------------------------------------------

function hideChatBox() {
	chatEnabled = true;
	setChatWindowEnabled(false);
}

// ----------------------------------------------------------------------------

function showChatBox() {
	chatHidden = false;
	setChatWindowEnabled(true);
}

// ----------------------------------------------------------------------------
