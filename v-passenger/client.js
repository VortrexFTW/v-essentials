"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(game.game == 10) {
		console.warn(`[${thisResource.name}] This resource does not work on Mafia 1, which has it's own passenger entry mechanism`);
		event.preventDefault();
		return false;
	}

	bindKey(SDLK_g, KEYSTATE_UP, enterVehicleAsPassenger);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_g);
});

// ----------------------------------------------------------------------------

// In case other resources want to use this
exportFunction("enterPassenger", enterVehicleAsPassenger);
addNetworkHandler("v.passenger", function(pedId) { enterVehicleAsPassenger(getElementFromId(pedId))});

// ----------------------------------------------------------------------------

function enterVehicleAsPassenger(ped = localPlayer) {
	if(ped == null) {
		return false;
	}

	if(ped.vehicle == null) {
		let vehicle = getClosestVehicle(localPlayer.position);
		if(vehicle != null) {
			if(game.game == GAME_GTA_SA) {
				// GTA SA crashes when entering as passenger, just warp directly into the car instead
				for (let seatIndex = 1; seatIndex < 8; seatIndex++) { //seat index starts from 1
					if (vehicle.getOccupant(seatIndex) === null) {
						localPlayer.warpIntoVehicle(vehicle, seatIndex);
						break;
					}
				}
			} else if(game.game <= GAME_GTA_VC) {
				localPlayer.enterVehicle(vehicle, false);
			} else if(game.game == GAME_GTA_IV) {
				let seatOffsets = [
					new Vec3(1.0, 0.0, 0.0),
					new Vec3(-1.0, -0.3, 0.0),
					new Vec3(1.0, -0.3, 0.0)
				];

				let closestSeat = seatOffsets.filter((offset, i) => {
					console.log(`Checking seat ${i+1}`);
					natives.isCarPassengerSeatFree(vehicle, i+1)})
				.reduce((i, j) => {
					(natives.getOffsetFromCarInWorldCoords(vehicle, seatOffsets.findIndex(seat => seat == i)+1).distance(ped.position) < natives.getOffsetFromCarInWorldCoords(vehicle, seatOffsets.findIndex(seat => seat == j)+1).distance(ped.position)) ? i : j
				});

				natives.disablePlayerAutoVehicleExit(ped, true);
				natives.taskEnterCarAsPassenger(ped, vehicle, 5000, seatOffsets.findIndex(seat => seat == closestSeat) + 1);
			}
		}
	}
}

// ----------------------------------------------------------------------------

function getClosestVehicle(pos) {
	return getElementsByType(ELEMENT_VEHICLE).reduce((i, j) => (i.position.distance(pos) < j.position.distance(pos)) ? i : j);
}

// ----------------------------------------------------------------------------