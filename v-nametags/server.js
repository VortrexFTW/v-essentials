"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (server.game == GAME_GTA_IV) {
		console.warn(`[${thisResource.name}] resource doesn't work on GTA IV. Stopping resource ...`);
		thisResource.stop();
		return false;
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("armour", function (client, ped, armour) {
	triggerNetworkEvent("armour", null, ped, armour);
});

// ----------------------------------------------------------------------------