"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (server.game == GAME_GTA_IV) {
		console.warn("The v-nametags resource doesn't work on GTA IV. Stopping resource ...");
		thisResource.stop();
	}
});

// ----------------------------------------------------------------------------


addNetworkHandler("armour", function (client, ped, armour) {
	triggerNetworkEvent("armour", null, ped, armour);
});

// ----------------------------------------------------------------------------