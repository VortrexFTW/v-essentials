"use strict";

addNetworkHandler("v.p.lookat", function(client, x, y, z) {
	triggerNetworkEvent("v.p.lookat", null, client.player.id, x, y, z);
});