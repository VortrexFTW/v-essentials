"use strict";

// ===========================================================================

const MAX_CHAT_HISTORY = 500;
const MAX_CHAT_LINES = 6;

// ===========================================================================

let chatBoxHistory = [];
let bottomMessageIndex = 0;
let scrollAmount = 1;
let scrollFastMultiplier = 3;
let scrollUpKey = SDLK_PAGEUP;
let scrollDownKey = SDLK_PAGEDOWN;
let scrollFastKey = SDLK_LEFTSHIFT;

// ===========================================================================

addEventHandler("OnChatOutput", function(event, messageString, colour) {
	event.preventDefault();

	if(chatBoxHistory.length >= MAX_CHAT_HISTORY) {
		chatBoxHistory.shift();
	}

	chatBoxHistory.push([messageString, colour]);

	// Only show new message if player isn't scrolling back in the chat history
	if(bottomMessageIndex >= chatBoxHistory.length-1) {
		message(messageString, colour);		
	}
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(scrollUpKey);
	unbindKey(scrollDownKey);
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	bindKey(scrollUpKey, KEYSTATE_DOWN, chatBoxScrollUp);
	bindKey(scrollDownKey, KEYSTATE_DOWN, chatBoxScrollDown);
});

// ===========================================================================

function chatBoxScrollUp() {
	if (bottomMessageIndex > MAX_CHAT_LINES) {
		let tempScrollAmount = scrollAmount;
		if(isKeyDown(scrollFastKey)) {
			tempScrollAmount *= scrollFastMultiplier;
		}
		bottomMessageIndex = bottomMessageIndex - scrollAmount;
		updateChatBox();
	}
}

// ===========================================================================

function chatBoxScrollDown() {
	if (bottomMessageIndex < chatBoxHistory.length - 1) {
		let tempScrollAmount = scrollAmount;
		if(isKeyDown(scrollFastKey)) {
			tempScrollAmount *= scrollFastMultiplier;
		}
		bottomMessageIndex = bottomMessageIndex + scrollAmount;
		updateChatBox();
	}
}

// ===========================================================================

function clearChatBox() {
	for (let i = 0; i <= MAX_CHAT_LINES; i++) {
		message("", COLOUR_WHITE);
	}
}

// ===========================================================================

function updateChatBox() {
	clearChatBox();
	for (let i = bottomMessageIndex - MAX_CHAT_LINES; i <= bottomMessageIndex; i++) {
		if (typeof chatBoxHistory[i] != "undefined") {
			message(chatBoxHistory[i][0], chatBoxHistory[i][1]);
		} else {
			message("", COLOUR_WHITE);
		}
	}
}

// ===========================================================================

addEventHandler("OnMouseWheel", function(event, mouseId, deltaCoordinates, flipped) {
	// There isn't a built-in way to detect whether chat input is active in GTA IV, but mouse cursor is forced shown when typing so ¯\_(ツ)_/¯
	if (!gui.cursorEnabled) {
		return false;
	}

	if (!flipped) {
		if (deltaCoordinates.y > 0) {
			chatBoxScrollUp();
		} else {
			chatBoxScrollDown();
		}
	} else {
		if (deltaCoordinates.y > 0) {
			chatBoxScrollDown();
		} else {
			chatBoxScrollUp();
		}
	}
});

// ===========================================================================