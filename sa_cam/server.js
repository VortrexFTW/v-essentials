"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("v.walk", function(client, state) {
	triggerNetworkEvent("v.walk", null, client.player, state);
});