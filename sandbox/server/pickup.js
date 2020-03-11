"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.pck.add", function(client, modelID, typeID, x, y, z) {
	let position = new Vec3(x, y, z);
	//let pickup = createPickup(modelID, position, typeID);
	let pickup = gta.createPickup(modelID, position);
	addToWorld(pickup);
	message(client.name + " added a pickup", gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------