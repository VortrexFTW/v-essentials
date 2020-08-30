"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(server.game != GAME_GTA_SA) {
		console.warn("The v-lookat resource only works on GTA San Andreas. Stopping resource ...");
		thisResource.stop();
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.p.lookat", function(client, ped, position) {
	triggerNetworkEvent("v.p.lookat", null, ped, position);
});

// ----------------------------------------------------------------------------