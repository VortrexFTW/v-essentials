"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (server.game == GAME_GTA_IV || server.game == 10) {
		console.warn(`[${thisResource.name}] resource doesn't work on GTA IV or Mafia 1. Stopping resource ...`);
		thisResource.stop();
		return false;
	}
});

// ----------------------------------------------------------------------------


addNetworkHandler("armour", function (client, ped, armour) {
	triggerNetworkEvent("armour", null, ped, armour);
});

// ----------------------------------------------------------------------------