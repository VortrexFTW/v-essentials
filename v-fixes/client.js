"use strict";

// ===========================================================================

addEvent("OnPedEnteredSphereEx", 2);
addEvent("OnPedExitedSphereEx", 2);
addEvent("OnPedEnteredVehicleEx", 3); // Called when ped finishes entering vehicle (built-in onPedEnterVehicle is called when they start entering)
addEvent("OnPedExitedVehicleEx", 2); // Called when ped finishes exiting vehicle (built-in onPedExitVehicle is called when they start exiting)
addEvent("OnPedBusted", 1); // Called when police bust a player (immediately when invoked, will be too soon for when released from jail)
addEvent("OnPedEnterSniperMode", 1); // Called when ped starts aiming in sniper scope
addEvent("OnPedExitSniperMode", 1); // Called when ped stops aiming sniper scope, back to normal view
addEvent("OnPedChangeWeapon", 3); // Called on switch weapon
addEvent("OnPedChangeAmmo", 3); // Called when ammo changes for any reason (shooting, reloading, etc)
addEvent("OnPedDeathEx", 1); // Called when ped dies. Some games don't have onPedWasted yet. This one doesn't have killer or anything but it's better than nothing
addEvent("OnPickupPickedUp", 1); // Called when a pickup is picked up

addEvent("OnVehicleLightsChanged", 2); // Called when vehicle lights are toggled
addEvent("OnVehicleSirenChanged", 2); // Called when vehicle siren is toggled
addEvent("OnVehicleLockedStatusChanged", 2); // Called when vehicle locked status is toggled
addEvent("OnVehicleTaxiLightChanged", 2); // Called when vehicle taxi light is toggled
addEvent("OnVehicleInteriorLightChanged", 2); // Called when vehicle interior light is toggled
addEvent("OnVehicleHazardLightsChanged", 2); // Called when vehicle hazard light is toggled
addEvent("OnVehicleHealthChanged", 3); // Called when vehicle health changes

// ===========================================================================

let vehicle = null;
let vehicleSeat = 0;
let sphere = null;
let dead = false;
let weapon = -1;
let weaponAmmo = 0;
let busted = false;
let sniperMode = false;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (localPlayer.vehicle != null) {
		let seat = getPedVehicleSeat(localPlayer);
		vehicle = localPlayer.vehicle;
		vehicleSeat = seat;
	}

	if (typeof localPlayer.weapon != "undefined") {
		weapon = localPlayer.weapon;
	}

	if (typeof localPlayer.weaponAmmo != "undefined") {
		weaponAmmo = localPlayer.weaponAmmo;
	}

	if (game.game == GAME_GTA_III) {
		if (localPlayer.state == 51) {
			busted = true;
		}

		if (localPlayer.state == 12) {
			sniperMode = true;
		}
	}

	if (typeof ELEMENT_MARKER != "undefined") {
		getElementsByType(ELEMENT_MARKER).forEach(function (tempSphere) {
			let position = localPlayer.position;
			if (localPlayer.vehicle) {
				position = localPlayer.vehicle.position;
			}

			if (tempSphere.position.distance(position) <= tempSphere.radius) {
				sphere = tempSphere;
			}
		});
	}
});

// ===========================================================================

addEventHandler("OnEntityProcess", function (event, entity) {
	if (localPlayer != null) {
		if (entity == localPlayer) {
			if (entity.health <= 0) {
				if (dead == false) {
					dead = true;
					triggerEvent("OnPedDeathEx", entity);
					triggerNetworkEvent("OnPedDeathEx", entity.id);
				}
			} else {
				if (dead == true) {
					dead = false;
				}
			}

			if (typeof entity.weapon != "undefined") {
				if (weapon != -1) {
					if (weapon != entity.weapon) {
						triggerEvent("OnPedChangeWeapon", entity, entity, entity.weapon, weapon);
						triggerNetworkEvent("OnPedChangeWeapon", entity.id, entity.weapon, weapon);
						weapon = entity.weapon;
					}
				} else {
					weapon = entity.weapon;
				}
			}

			if (typeof entity.weaponAmmo != "undefined") {
				if (weaponAmmo != -1) {
					if (weaponAmmo != entity.weaponAmmo) {
						triggerEvent("OnPedChangeAmmo", entity, entity, entity.weaponAmmo, weaponAmmo);
						triggerNetworkEvent("OnPedChangeAmmo", entity.id, entity.weaponAmmo, weaponAmmo);
						weaponAmmo = entity.weaponAmmo;
					}
				} else {
					weaponAmmo = entity.weaponAmmo;
				}
			}

			// GTA 3
			if (game.game == 1) {
				if (entity.state == 51) {
					if (busted == false) {
						busted = true;
						triggerEvent("OnPedBusted", entity, entity);
						triggerNetworkEvent("OnPedBusted", entity.id);
					}
				} else {
					if (busted == true) {
						busted = false;
					}
				}

				if (entity.state == 12) {
					if (sniperMode == false) {
						sniperMode = true;
						triggerEvent("OnPedEnterSniperMode", entity, entity);
						triggerNetworkEvent("OnPedEnterSniperMode", entity.id);
					}
				} else {
					if (sniperMode == true) {
						sniperMode = false;
						triggerEvent("OnPedExitSniperMode", entity, entity);
						triggerNetworkEvent("OnPedEnterSniperMode", entity.id);
					}
				}
			}

			if (game.game <= 5) {
				if (entity.vehicle == null) {
					if (vehicle != null) {
						console.log(`[V-FIXES] OnPedEnteredVehicleEx: Ped: ${entity.id}, Vehicle: ${vehicle.id}, Seat: ${vehicleSeat}`);
						triggerEvent("OnPedExitedVehicleEx", entity, entity, vehicle, vehicleSeat);
						triggerNetworkEvent("OnPedExitedVehicleEx", entity.id, vehicle.id, vehicleSeat);
						vehicle = null;
						vehicleSeat = -1;
					}
				} else {
					if (vehicle == null) {
						let seat = getPedVehicleSeat(entity);
						console.log(`[V-FIXES] OnPedEnteredVehicleEx: Ped: ${entity.id}, Vehicle: ${entity.vehicle.id}, Seat: ${seat}`);
						triggerEvent("OnPedEnteredVehicleEx", entity, entity, entity.vehicle, seat);
						triggerNetworkEvent("OnPedEnteredVehicleEx", entity.id, entity.vehicle.id, seat);
						vehicle = entity.vehicle;
						vehicleSeat = seat;
					}
				}
			}

			if (typeof ELEMENT_MARKER != "undefined") {
				getElementsByType(ELEMENT_MARKER).forEach(function (tempSphere) {
					let position = entity.position;
					if (entity.vehicle) {
						position = entity.vehicle.position;
					}

					if (tempSphere.position.distance(position) <= tempSphere.radius) {
						if (sphere == null) {
							triggerEvent("OnPedEnteredSphereEx", entity, entity, tempSphere);
							triggerNetworkEvent("OnPedEnteredSphereEx", entity.id, tempSphere.id);
							sphere = tempSphere;
						}
					} else {
						if (sphere == tempSphere) {
							triggerEvent("OnPedExitedSphereEx", entity, entity, tempSphere);
							triggerNetworkEvent("OnPedExitedSphereEx", entity.id, tempSphere.id);
							sphere = null;
						}
					}
				});
			}

			// Set sphere variable to null, to fix issue when markers were deleted/hidden before exiting them.
			if (sphere && sphere.id == -1) {
				sphere = null;
			}
		}
	}

	if (entity.type == ELEMENT_VEHICLE) {
		if (entity.isSyncer) {
			// Tell server about some vehicle properties that are not synced by default
			if (typeof entity.lights != "undefined") {
				if (entity.getData("v.lights") != entity.lights) {
					triggerEvent("OnVehicleLightsChanged", entity, entity, entity.lights);
					triggerNetworkEvent("OnVehicleLightsChanged", entity.id, entity.lights);
				}
			}

			if (game.game == GAME_GTA_IV) {
				if (typeof entity.siren != "undefined") {
					if (entity.getData("v.siren") != entity.siren) {
						triggerEvent("OnVehicleSirenChanged", entity, entity, entity.siren);
						triggerNetworkEvent("OnVehicleSirenChanged", entity.id, entity.siren);
					}
				}
			}

			if (typeof entity.hazardLights != "undefined") {
				if (entity.getData("v.hazardLights") != entity.hazardLights) {
					triggerEvent("OnVehicleHazardLightsChanged", entity, entity, entity.hazardLights);
					triggerNetworkEvent("OnVehicleHazardLightsChanged", entity.id, entity.hazardLights);
				}
			}

			if (typeof entity.interiorLight != "undefined") {
				if (entity.getData("v.interiorLight") != entity.interiorLight) {
					triggerEvent("OnVehicleInteriorLightChanged", entity, entity, entity.interiorLight);
					triggerNetworkEvent("OnVehicleInteriorLightChanged", entity.id, entity.interiorLight);
				}
			}

			if (game.game <= GAME_GTA_IV) {
				if (typeof entity.lockedStatus != "undefined") {
					if (entity.getData("v.locked") != entity.lockedStatus) {
						triggerEvent("OnVehicleLockedStatusChanged", entity, entity, entity.lockedStatus);
						triggerNetworkEvent("OnVehicleLockedStatusChanged", entity.id, entity.lockedStatus);
					}
				}

				if (typeof entity.taxiLight != "undefined") {
					if (entity.getData("v.taxiLight") != entity.taxiLight) {
						triggerEvent("OnVehicleTaxiLightChanged", entity, entity, entity.taxiLight);
						triggerNetworkEvent("OnVehicleTaxiLightChanged", entity.id, entity.taxiLight);
					}
				}
			}

			if (typeof entity.health != "undefined") {
				if (entity.getData("v.health") != entity.health) {
					triggerEvent("OnVehicleHealthChanged", entity, entity, entity.getData("v.health"), entity.health);
					triggerNetworkEvent("OnVehicleHealthChanged", entity.id, entity.getData("v.health"), entity.health);
				}
			}

			if (game.game == GAME_GTA_IV) {
				if (entity.getData("v.locked") != natives.getCarDoorLockStatus(entity)) {
					triggerEvent("OnVehicleLockChanged", entity, entity, natives.getCarDoorLockStatus(entity));
					triggerNetworkEvent("OnVehicleLockChanged", entity.id, natives.getCarDoorLockStatus(entity));
				}
			}

			if (game.game <= GAME_GTA_IV) {
				let tireStates = entity.getData("v.rp.tires");
				let updatedTireStates = [];
				for (let i = 0; i < 4; i++) {
					if (game.game == GAME_GTA_IV) {
						if (tireStates[i] != natives.isCarTyreBurst(entity, i)) {
							updatedTireStates.push([i, natives.isCarTyreBurst(entity, i)]);
						}
					} else if (game.game <= GAME_GTA_VC) {
						if (tireStates[i] != entity.getWheelStatus(i)) {
							updatedTireStates.push([i, entity.getWheelStatus(i)]);
						}
					}

					if (updatedTireStates.length > 0) {
						triggerNetworkEvent("OnVehicleTireStatesChanged", entity.id, updatedTireStates);
					}
				}

				let doorStates = entity.getData("v.rp.doors");
				let updatedDoorStates = [];
				for (let i = 0; i < 4; i++) {
					if (game.game <= GAME_GTA_VC) {
						if (doorStates[i] != entity.getDoorStatus(i)) {
							updatedDoorStates.push([i, entity.getDoorStatus(i)]);
						}
					}
				}

				let panelStatus = entity.getData("v.rp.panels");
				let updatedPanelStates = [];
				for (let i = 0; i < 4; i++) {
					if (game.game <= GAME_GTA_VC) {
						if (panelStatus[i] != entity.getPanelStatus(i)) {
							updatedPanelStates.push([i, entity.getPanelStatus(i)]);
						}
					}
				}
			}
		}
	}
});

// ===========================================================================

addEventHandler("OnPedEnteredVehicle", function (event, ped, vehicle, seat) {
	triggerNetworkEvent("OnPedEnteredVehicleEx", ped.id, vehicle.id, seat);
});

// ===========================================================================

addEventHandler("OnPedExitedVehicle", function (event, ped, vehicle, seat) {
	triggerNetworkEvent("OnPedExitedVehicleEx", ped.id, vehicle.id, seat);
});

// ===========================================================================

addEventHandler("OnPedEnteringVehicle", function (event, ped, vehicle, seat) {
	triggerNetworkEvent("OnPedEnteringVehicleEx", ped.id, vehicle.id, seat);
});

// ===========================================================================

addEventHandler("OnPedExitingVehicle", function (event, ped, vehicle, seat) {
	triggerNetworkEvent("OnPedExitingVehicleEx", ped.id, vehicle.id, seat);
});

// ===========================================================================

function getPedVehicleSeat(ped) {
	for (let i = 0; i <= 3; i++) {
		if (ped.vehicle.getOccupant(i) == ped) {
			return i;
		}
	}
	return 0;
}

// ===========================================================================

addEventHandler("OnAddIVNetworkEvent", function (event, type, name, data, data2) {
	console.log(`IV Network event: ${name} with type ${type} dataLength: ${data.byteLength}`);
	if (type == 3) {
		triggerNetworkEvent("OnAddIVNetworkEvent", type, name, data, data2);
	}
});

// ===========================================================================

addNetworkHandler("ReceiveIVNetworkEvent", (type, name, data, data2, from) => {
	gta.receiveNetworkEvent(0, from, type, 0, data, data2);
});

// ===========================================================================

addEventHandler("OnElementStreamIn", function (event, element) {


});

// ===========================================================================

function syncElementProperties(element) {
	if (element == null) {
		return false;
	}

	// Check if element is a server element
	if (element.id == -1) {
		return false;
	}

	if (typeof element.interior != "undefined") {
		if (element.getData("v.interior")) {
			if (typeof element.interior != "undefined") {
				element.interior = getEntityData(element, "v.interior");
			}
		}
	}

	if (typeof element.collisionsEnabled != "undefined") {
		if (element.getData("v.collisions")) {
			element.collisionsEnabled = element.getData("v.collisions")
		}
	}

	if (game.game == GAME_MAFIA_ONE) {
		switch (element.type) {
			case ELEMENT_VEHICLE:
				syncVehicleProperties(element);
				break;

			case ELEMENT_PED:
			case ELEMENT_PLAYER:
				syncPedProperties(element);
				break;

			default:
				break;
		}
	} else if (game.game == GAME_GTA_IV) {
		switch (element.type) {
			case ELEMENT_VEHICLE:
				syncVehicleProperties(element);
				break;

			case ELEMENT_PED:
			case ELEMENT_PLAYER:
				syncPedProperties(element);
				break;

			default:
				break;
		}
	} else {
		switch (element.type) {
			case ELEMENT_VEHICLE:
				syncVehicleProperties(element);
				break;

			case ELEMENT_PED:
			case ELEMENT_PLAYER:
				syncPedProperties(element);
				break;

			case ELEMENT_OBJECT:
				syncObjectProperties(element);
				break;

			default:
				break;
		}
	}
}

// ===========================================================================

function syncPedProperties(ped) {
	if (typeof ped == "number") {
		ped = getElementFromId(ped);
	}

	if (ped == null) {
		return false;
	}

	if (ped.getData("v.heading")) {
		let heading = ped.getData("v.heading");
		ped.heading = heading;
	}

	if (typeof ped.matrix != "undefined") {
		if (ped.getData("v.scale")) {
			let scaleFactor = ped.getData("v.scale");
			let tempMatrix = ped.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = ped.position;
			ped.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			ped.position = tempPosition;
		}
	}

	if (typeof ped.setFightStyle != "undefined") {
		if (ped.getData("v.fightStyle")) {
			let fightStyle = ped.getData("v.fightStyle");
			ped.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	if (typeof ped.walkStyle != "undefined") {
		if (ped.getData("v.walkStyle")) {
			let walkStyle = ped.getData("v.walkStyle");
			ped.walkStyle = walkStyle;
		}
	}

	if (typeof ped.changeBodyPart != "undefined") {
		if (ped.getData("v.bodyPartHead")) {
			let bodyPartHead = ped.getData("v.bodyPartHead");
			ped.changeBodyPart(0, toInteger(bodyPartHead[0]), toInteger(bodyPartHead[1]));
		}

		if (ped.getData("v.bodyPartUpper")) {
			let bodyPartUpper = ped.getData("v.bodyPartUpper");
			ped.changeBodyPart(1, toInteger(bodyPartUpper[0]), toInteger(bodyPartUpper[1]));
		}

		if (ped.getData("v.bodyPartLower")) {
			let bodyPartLower = ped.getData("v.bodyPartLower");
			ped.changeBodyPart(2, toInteger(bodyPartLower[0]), toInteger(bodyPartLower[1]));
		}

		if (ped.getData("v.bodyPropHead")) {
			let bodyPropHead = ped.getData("v.bodyPropHead");
			natives.setCharPropIndex(ped, 0, toInteger(bodyPropHead));
		}
	}

	if (game.game <= GAME_GTA_VC || game.game == GAME_GTA_IV) {
		if (ped.getData("v.bleeding")) {
			let bleedingState = ped.getData("v.bleeding");
			if (game.game <= GAME_GTA_VC) {
				ped.bleeding = bleedingState;
			} else if (game.game == GAME_GTA_IV) {
				natives.setCharBleeding(ped, bleedingState);
			}
		}
	}

	if (typeof ped.addAnimation != "undefined") {
		setTimeout(function () {
			if (ped.getData("v.anim")) {
				let animationSlot = ped.getData("v.anim");
				let animationData = getAnimationData(animationSlot);
				if (game.game == GAME_MAFIA_ONE) {
					if (ped.vehicle == null) {
						if (animationData.loop == true) {
							setTimeout(loopPedAnimation, animationData.duration, ped.id);
						}
						ped.addAnimation(animationData.animId);
					}
				} else {
					ped.addAnimation(animationData.groupId, animationData.animId);
				}
			}
		}, 500);
	}

	if (ped.getData("v.weapon")) {
		let weapon = ped.getData("v.weapon");
		setPedWeapon(ped.id, weapon[0], weapon[1], weapon[2], weapon[3]);

		if (game.game == GAME_MAFIA_ONE) {
			ped.giveWeapon(weapon[0], weapon[2], weapon[1]);
		} else {
			ped.giveWeapon(weapon[0], weapon[1] + weapon[2], weapon[3]);
		}
	}

	if (game.game == GAME_GTA_IV && ped.type == ELEMENT_PLAYER) {
		natives.setDisplayPlayerNameAndIcon(natives.getPlayerIdForThisPed(ped), false);
	}

	//if (game.game == GAME_GTA_IV) {
	//	natives.setCharUsesUpperbodyDamageAnimsOnly(ped, false);
	//}
}

// ===========================================================================

function syncVehicleProperties(vehicle) {
	if (vehicle == null) {
		return false;
	}

	// Check if ped is a server element
	if (vehicle.id == -1) {
		return false;
	}

	if (game.game <= GAME_GTA_IV) {
		let colours = vehicle.getData("v.colour");
		if (colours != null) {
			setVehicleColours(vehicle.id, colours[0], colours[1], colours[2], colours[3]);
		}
	}

	if (game.game <= GAME_GTA_VC) {
		let colours = vehicle.getData("v.colour.rgb");
		if (colours != null) {
			vehicle.setRGBColours(colours[0], colours[1]);
		}
	}

	if (typeof vehicle.light != "undefined") {
		let lightStatus = vehicle.getData("v.lights");
		if (lightStatus != null) {
			vehicle.lights = lightStatus;
		}
	}

	if (typeof vehicle.siren != "undefined") {
		let sirenStatus = vehicle.getData("v.siren");
		if (sirenStatus != null) {
			vehicle.siren = sirenStatus;
		}
	}

	if (game.game <= GAME_GTA_IV) {
		let lockStatus = vehicle.getData("v.locked");
		if (lockStatus != null) {
			vehicle.lockedStatus = lockStatus;
		}
	}

	if (typeof vehicle.hazardLights != "undefined") {
		let hazardLightsState = vehicle.getData("v.hazardLights");
		if (hazardLightsState != null) {
			vehicle.hazardLights = hazardLightsState;
		}
	}

	if (typeof vehicle.interiorLight != "undefined") {
		let interiorLightState = vehicle.getData("v.interiorLight");
		if (interiorLightState != null) {
			vehicle.interiorLight = interiorLightState;
		}
	}

	if (game.game <= GAME_GTA_IV) {
		let taxiLightState = vehicle.getData("v.taxiLight");
		if (taxiLightState != null) {
			if (getGame() == V_GAME_GTA_III || getGame() == V_GAME_GTA_VC) {
				natives.SET_TAXI_LIGHTS(vehicle.refId, (state) ? 1 : 0);
			} else if (getGame() == V_GAME_GTA_IV) {
				natives.setTaxiLights(vehicle, state);
			}
		}
	}

	if (game.game <= GAME_GTA_IV) {
		let trunkState = vehicle.getData("v.trunk");
		if (trunkState != null) {
			if (!!trunkState == true) {
				if (getGame() == V_GAME_GTA_III || getGame() == V_GAME_GTA_VC) {
					natives.POP_CAR_BOOT(vehicle.refId);
				} else if (getGame() == V_GAME_GTA_IV) {
					if (state == true) {
						natives.openCarDoor(vehicle, 5);
					} else {
						natives.closeCarDoor(vehicle, 5);
					}
				}
			}
		}
	}

	if (game.game == GAME_GTA_IV && game.game == GAME_GTA_SA) {
		let upgrades = vehicle.getData("v.upgrades");
		if (getGame() == V_GAME_GTA_SA) {
			for (let i in upgrades) {
				if (upgrades[i] != 0) {
					vehicle.addUpgrade(upgrades[i]);
				}
			}
		} else if (getGame() == V_GAME_GTA_IV) {
			for (let i = 0; i < upgrades.length; i++) {
				natives.turnOffVehicleExtra(vehicle, i, (!upgrades[i]) ? 1 : 0);
			}
		}
	}

	if (game.game == GAME_GTA_IV && game.game == GAME_GTA_SA) {
		let livery = vehicle.getData("v.livery");
		if (livery != null) {
			if (getGame() == V_GAME_GTA_SA) {
				vehicle.setPaintJob(livery);
			} else if (getGame() == V_GAME_GTA_IV) {
				natives.setCarLivery(vehicle, livery);
			}
		}
	}
}

// ===========================================================================

addNetworkHandler("ReceiveIVNetworkEvent", (type, name, data, data2, fromClientIndex) => {
	if (fromClientIndex != localClient.index) {
		gta.receiveNetworkEvent(0, fromClientIndex, type, 0, data, data2);
	}
});

// ===========================================================================