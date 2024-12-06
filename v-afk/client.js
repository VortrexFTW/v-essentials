"use strict";

let isFocused = true;

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", (event) => {
	isFocused = false;
	if (isConnected) {
		triggerNetworkEvent("v.afk", true);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnFocus", (event) => {
	isFocused = true;
	if (isConnected) {
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------
