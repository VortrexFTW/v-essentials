"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(server.game == GAME_GTA_IV || server.game == GAME_GTA_IV_EFLC) {
		console.warn("The v-nametags resource doesn't work on GTA IV or Episodes From Liberty City (EFLC). Stopping resource ...");
		thisResource.stop();
	}
});

// ----------------------------------------------------------------------------


addNetworkHandler("armour", function(client, ped, armour) {
	triggerNetworkEvent("armour", null, ped, armour);
});

// ----------------------------------------------------------------------------