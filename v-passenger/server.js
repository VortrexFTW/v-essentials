"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("v.enterveh", function(client, vehicle, driver) {
	triggerNetworkEvent("v.enterveh", null, client.player.id, vehicle.id, driver);
}

// ----------------------------------------------------------------------------