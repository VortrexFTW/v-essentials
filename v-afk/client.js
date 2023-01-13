"use strict";

let isFocused = true;

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", (event) => {
	isFocused = false;
	triggerNetworkEvent("v.afk", true);
});

// ----------------------------------------------------------------------------

addEventHandler("OnFocus", (event) => {
	isFocused = true;
	triggerNetworkEvent("v.afk", false);
});

// ----------------------------------------------------------------------------
