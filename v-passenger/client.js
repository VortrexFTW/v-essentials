"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	bindKey(SDLK_g, KEYSTATE_UP, enterVehicleAsPassenger);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_g);
});

// ----------------------------------------------------------------------------

function enterVehicleAsPassenger() {
	if(localPlayer.vehicle == null) {
		let tempVehicle = getClosestVehicle(localPlayer.position);
		if(tempVehicle != null) {
			if(game.game == GAME_GTA_SA) {
				for (let seatIndex = 1; seatIndex < 8; seatIndex++) { //seat index starts from 1
					if (tempVehicle.getOccupant(seatIndex) === null) {
						localPlayer.warpIntoVehicle(tempVehicle, seatIndex);
						break;
					}
				}
			} else {
				localPlayer.enterVehicle(tempVehicle, false);
			}
		}
	}
}

// ----------------------------------------------------------------------------

function getClosestVehicle(pos) {
    return getVehicles().reduce((i, j) => (i.position.distance(pos) < j.position.distance(pos)) ? i : j);
}

// ----------------------------------------------------------------------------