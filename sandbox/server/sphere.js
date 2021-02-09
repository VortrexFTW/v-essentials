"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.sph.add", function(client, x, y, z, radius) {
	let position = new Vec3(x, y, z);
	gta.createSphere(position, radius);
	addToWorld(pickup);
	message(`${client.name} added a sphere marker`, gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------