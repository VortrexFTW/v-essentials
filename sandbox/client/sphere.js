"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("sphere", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /sphere <radius>", gameAnnounceColour);
		return false;
	}
	
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 7.5);
	
	let splitParams = params.split(" ");
	let radius = Number(splitParams[0]) || 0;
	
	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.sph.add", position.x, position.y, position.z, radius);
	} else {
		createSphere(position, radius);
		message("Sphere added!", gameAnnounceColour);
	}
});

// ----------------------------------------------------------------------------