"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", function(event) {
	triggerNetworkEvent("v.afk", true);
	if(localPlayer != null) {
		localPlayer.collisionsEnabled = false;
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnMouseMove", function(event, mouse, absolute, pos) {
	if(localPlayer != null) {
		if(localClient.getData("v.afk") == 1) {
			localPlayer.collisionsEnabled = true;
			triggerNetworkEvent("v.afk", false);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnKeyDown", function(event, mouse, absolute, pos) {
	if(localPlayer != null) {
		if(localClient.getData("v.afk") == 1) {
			localPlayer.collisionsEnabled = true;
			triggerNetworkEvent("v.afk", false);
		}
	}
});

// ----------------------------------------------------------------------------

