"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addNetworkHandler("v.p.lookat", function(client, position) {
	triggerNetworkEvent("v.p.lookat", null, client.player, position);
});

// ----------------------------------------------------------------------------