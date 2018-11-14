"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", function(event) {
	triggerNetworkEvent("v.afk", true);
});

// ----------------------------------------------------------------------------

addEventHandler("OnMouseMove", function(event, mouse, absolute, pos) {
	if(localPlayer.getData("v.afk")) {
		localPlayer.removeData("v.afk");
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------

