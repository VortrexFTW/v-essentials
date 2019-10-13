"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addEventHandler("OnKeyUp", function(event, keyCode, scanCode, mod) {
	switch(keyCode) {
		case SDLK_g:
			if(localPlayer.vehicle == null) {
				let tempVehicle = getClosestVehicle(localPlayer.position);
				localPlayer.enterVehicle(tempVehicle, false);
				if(gta.game == GAME_GTA_SA) {
					triggerNetworkEvent("v.enterveh", tempVehicle, false);
				}
			}
			break;		
	}
});

// ----------------------------------------------------------------------------

function getClosestVehicle(pos) {
	let vehs = getVehicles();
	let closestVeh = vehs[0];
	for(let i in vehs) {
		if(getDistance(pos, vehs[i].position) <= getDistance(pos, closestVeh.position)) {
			closestVeh = vehs[i];
		}
	}
	
	return closestVeh;
}

// ----------------------------------------------------------------------------

function getDistance(pos1, pos2) {
	let a = Math.pow(pos1.x-pos2.x, 2);
	let b = Math.pow(pos1.y-pos2.y, 2);
	
	return Math.sqrt(a+b);
}

// ----------------------------------------------------------------------------

addNetworkHandler("v.enterveh", function(player, vehicle, driver) {
	if(player != localPlayer.id) {
		getElementById(player).enterVehicle(getElementById(vehicle), driver);
	}
});

// ----------------------------------------------------------------------------