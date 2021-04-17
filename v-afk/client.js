"use strict";

let isFocused = true;

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

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

addEventHandler("OnMouseMove", (event, mouseId, absolute, position) => {
	if(localClient.getData("v.afk") > 0) {
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnKeyDown", (event, virtualKey, physicalKey, keyModifiers) => {
	if(localClient.getData("v.afk") > 0) {
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------