"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("pickup", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /pickup <model id> <type id>", gameAnnounceColour);
		return false;
	}
	
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 7.5);
	
	let splitParams = params.split(" ");
	let modelID = Number(splitParams[0]) || 0;
	let typeID = Number(splitParams[1]) || 1;

	if(isConnected) {
		triggerNetworkEvent("sb.pck.add", modelID, typeID, position.x, position.y, position.z);
	} else {
		createPickup(position, modelID, typeID);
		message("Pickup added!", gameAnnounceColour);
	}
});

// ----------------------------------------------------------------------------