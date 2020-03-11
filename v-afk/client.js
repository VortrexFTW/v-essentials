"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", function(event) {
	triggerNetworkEvent("v.afk", true);
	if(localPlayer != null) {
		//localPlayer.collisionsEnabled = false;
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnFocus", function(event) {
	if(localPlayer != null) {
		if(localClient.getData("v.afk") == 1) {
			//localPlayer.collisionsEnabled = true;
			triggerNetworkEvent("v.afk", false);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnMouseMove", function(event, mouseId, absolute, position) {
	if(localClient.getData("v.afk") > 0) {
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnKeyDown", function(event, virtualKey, physicalKey, keyModifiers) {
	if(localClient.getData("v.afk") > 0) {
		triggerNetworkEvent("v.afk", false);
	}
});