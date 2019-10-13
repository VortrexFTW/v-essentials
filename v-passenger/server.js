"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addNetworkHandler("v.enterveh", function(client, vehicle, driver) {
	triggerNetworkEvent("v.enterveh", null, client.player.id, vehicle.id, driver);
}

// ----------------------------------------------------------------------------