"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.o.add", function(client, modelID, x, y, z) {
	let position = new Vec3(x, y, z+1);
	let tempObject = createObject(Number(modelID), position);
	//tempObject.position = position;
	addToWorld(tempObject);
	
	message(client.name + " spawned an object with model ID " + modelID, gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------

