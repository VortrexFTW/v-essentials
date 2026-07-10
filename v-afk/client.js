"use strict";

let isFocused = true;

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", (event) => {
	isFocused = false;
	if (isConnected) {
		console.log(`[${thisResource.name}] AFK`);
		triggerNetworkEvent("v.afk", true);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnFocus", (event) => {
	isFocused = true;
	if (isConnected) {
		console.log(`[${thisResource.name}] Not AFK`);
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------
