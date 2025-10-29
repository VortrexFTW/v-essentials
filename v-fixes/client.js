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
addEvent("OnVehicleLockChanged", 2); // Called when vehicle locked status is toggled
addEvent("OnVehicleTaxiLightChanged", 2); // Called when vehicle taxi light is toggled
addEvent("OnVehicleInteriorLightChanged", 2); // Called when vehicle interior light is toggled
addEvent("OnVehicleHazardLightsChanged", 2); // Called when vehicle hazard light is toggled
addEvent("OnVehicleHealthChanged", 3); // Called when vehicle health changes

exportFunction("syncElementProperties", syncElementProperties);

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

// Games
const V_GAME_GTA_III = 1;
const V_GAME_GTA_VC = 2;
const V_GAME_GTA_SA = 3;
const V_GAME_GTA_IV = 5;
const V_GAME_GTA_IV_EFLC = 6;
const V_GAME_GTA_V = 50;
const V_GAME_MAFIA_ONE = 10;
const V_GAME_MAFIA_TWO = 11;
const V_GAME_MAFIA_THREE = 12;
const V_GAME_MAFIA_ONE_DE = 13;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (localPlayer == null) {
		return;
	}

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

	if (game.game == V_GAME_GTA_III) {
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

	exportFunction("code", function (code) {
		let returnValue = "Nothing";
		try {
			returnValue = eval("(" + code + ")");
		} catch (error) {
			message(`${thisResource.name} The code could not be executed! Error: ${error.message} in ${error.stack}`);
			return false;
		}

		return returnValue;
	});
});

// ===========================================================================

addEventHandler("OnEntityProcess", function (event, entity) {
	if (entity == null) {
		console.error(`${thisResource.name} Vehicle process failed for vehicle ${entity} (${entity.id}). Vehicle is null`);
		return false;
	}

	if (localPlayer != null) {
		if (entity == localPlayer) {
			if (entity.health <= 0) {
				if (dead == false) {
					dead = true;
					triggerEvent("OnPedDeathEx", entity, entity);
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

			if (game.game == V_GAME_GTA_IV) {
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

			if (game.game <= V_GAME_GTA_IV) {
				if (typeof entity.lockedStatus != "undefined") {
					if (entity.getData("v.locked") != entity.lockedStatus) {
						triggerEvent("OnVehicleLockChanged", entity, entity, entity.lockedStatus);
						triggerNetworkEvent("OnVehicleLockChanged", entity.id, entity.lockedStatus);
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

			if (game.game == V_GAME_GTA_IV) {
				if (entity.getData("v.locked") != natives.getCarDoorLockStatus(entity)) {
					triggerEvent("OnVehicleLockChanged", entity, entity, natives.getCarDoorLockStatus(entity));
					triggerNetworkEvent("OnVehicleLockChanged", entity.id, natives.getCarDoorLockStatus(entity));
				}
			}

			if (game.game <= V_GAME_GTA_IV) {
				let tireStates = entity.getData("v.tires");
				if (typeof tireStates != "undefined" && tireStates != null) {
					let updatedTireStates = [];
					for (let i = 0; i < 4; i++) {
						if (typeof tireStates[i] != "undefined") {
							if (game.game == V_GAME_GTA_IV) {
								if (tireStates[i] != natives.isCarTyreBurst(entity, i)) {
									updatedTireStates.push([i, natives.isCarTyreBurst(entity, i)]);
								}
							} else if (game.game <= V_GAME_GTA_VC) {
								if (tireStates[i] != entity.getWheelStatus(i)) {
									updatedTireStates.push([i, entity.getWheelStatus(i)]);
								}
							}

							if (updatedTireStates.length > 0) {
								triggerNetworkEvent("OnVehicleTireStatesChanged", entity.id, updatedTireStates);
							}
						}
					}
				}

				let doorStates = entity.getData("v.doors");
				if (typeof doorStates != "undefined") {
					let updatedDoorStates = [];
					for (let i = 0; i < 4; i++) {
						if (game.game <= V_GAME_GTA_VC) {
							if (doorStates[i] != entity.getDoorStatus(i)) {
								updatedDoorStates.push([i, entity.getDoorStatus(i)]);
							}
						}
					}
				}

				let panelStates = entity.getData("v.panels");
				if (typeof panelStates != "undefined") {
					let updatedPanelStates = [];
					for (let i = 0; i < 4; i++) {
						if (game.game <= V_GAME_GTA_VC) {
							if (panelStates[i] != entity.getPanelStatus(i)) {
								updatedPanelStates.push([i, entity.getPanelStatus(i)]);
							}
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
	game.receiveNetworkEvent(0, from, type, 0, data, data2);
});

// ===========================================================================

addEventHandler("OnElementStreamIn", function (event, element) {
	if (element == null) {
		return false;
	}

	syncElementProperties(element);
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
				element.interior = element.getData("v.interior");
			}
		}
	}

	if (typeof element.collisionsEnabled != "undefined") {
		if (element.getData("v.collisions")) {
			element.collisionsEnabled = element.getData("v.collisions")
		}
	}

	if (game.game == V_GAME_MAFIA_ONE) {
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
	} else if (game.game == V_GAME_GTA_IV) {
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

	if (typeof ped.setFightStyle != "undefined") {
		if (ped.getData("v.fightStyle")) {
			let fightStyle = ped.getData("v.fightStyle");
			ped.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	if (typeof ped.walkStyle != "undefined") {
		if (ped.getData("v.walkStyle")) {
			let walkStyle = ped.getData("v.walkStyle");
			console.log(`[${thisResource.name}] Setting ped walk style to ${walkStyle}`);
			ped.walkStyle = walkStyle;
		}
	}

	if (typeof ped.changeBodyPart != "undefined") {
		if (ped.getData("v.bodyPartHead") != null) {
			let bodyPartHead = ped.getData("v.bodyPartHead");
			//console.log(`[${thisResource.name}] Setting ped ${ped.id} head to ${bodyPartHead[0]}, ${bodyPartHead[1]}`);
			ped.changeBodyPart(0, Number(bodyPartHead[0]), Number(bodyPartHead[1]));
		}

		if (ped.getData("v.bodyPartUpper") != null) {
			let bodyPartUpper = ped.getData("v.bodyPartUpper");
			//console.log(`[${thisResource.name}] Setting ped ${ped.id} upper body to ${bodyPartUpper[0]}, ${bodyPartUpper[1]}`);
			ped.changeBodyPart(1, Number(bodyPartUpper[0]), Number(bodyPartUpper[1]));
		}

		if (ped.getData("v.bodyPartLower") != null) {
			let bodyPartLower = ped.getData("v.bodyPartLower");
			//console.log(`[${thisResource.name}] Setting ped ${ped.id} lower body to ${bodyPartLower[0]}, ${bodyPartLower[1]}`);
			ped.changeBodyPart(2, Number(bodyPartLower[0]), Number(bodyPartLower[1]));
		}

		if (ped.getData("v.bodyPropHat") != null) {
			let bodyPropHat = ped.getData("v.bodyPropHat");
			//console.log(`[${thisResource.name}] Setting ped ${ped.id} hat to ${bodyPropHat}`);
			natives.setCharPropIndex(ped, 0, Number(bodyPropHat));
		}
	}

	if (game.game <= V_GAME_GTA_VC || game.game == V_GAME_GTA_IV) {
		if (ped.getData("v.bleeding")) {
			let bleedingState = ped.getData("v.bleeding");
			if (game.game <= V_GAME_GTA_VC) {
				//console.log(`[${thisResource.name}] Setting ped bleeding to ${bleedingState}`);
				ped.bleeding = bleedingState;
			} else if (game.game == V_GAME_GTA_IV) {
				//console.log(`[${thisResource.name}] Setting ped bleeding to ${bleedingState}`);
				natives.setCharBleeding(ped, bleedingState);
			}
		}
	}

	if (ped.getData("v.weapon")) {
		let weapon = ped.getData("v.weapon");
		if (game.game == V_GAME_MAFIA_ONE) {
			//console.log(`[${thisResource.name}] Giving ped weapon ${weapon[0]} with ammo ${weapon[2]}, ${weapon[1]}`);
			ped.giveWeapon(weapon[0], weapon[2], weapon[1]);
		} else {
			//console.log(`[${thisResource.name}] Giving ped weapon ${weapon[0]} with ammo ${weapon[1]}, ${weapon[2]}`);
			ped.giveWeapon(weapon[0], weapon[1] + weapon[2], weapon[3]);
		}
	}

	if (game.game == V_GAME_GTA_IV) {
		if (ped.type != ELEMENT_PLAYER) {
			if (ped.getData("v.wander") == null) {
				//console.log(`[${thisResource.name}] Setting ped to wander`);
				natives.taskStandStill(ped, 9999999);
			} else {
				natives.taskWanderStandard(ped);
			}
		}
	}
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

	if (game.game <= V_GAME_GTA_IV) {
		let colours = vehicle.getData("v.colour");
		if (colours != null) {
			console.log(`[${thisResource.name}] Setting vehicle colour to ${colours.join(", ")}`);
			vehicle.colour1 = colours[0];
			vehicle.colour2 = colours[1];
			vehicle.colour3 = colours[2];
			vehicle.colour4 = colours[3];
		}
	}

	if (game.game <= V_GAME_GTA_VC) {
		let colours = vehicle.getData("v.colour.rgb");
		if (colours != null) {
			console.log(`[${thisResource.name}] Setting vehicle RGB colours to ${colours[0]}, ${colours[1]}`);
			vehicle.setRGBColours(colours[0], colours[1]);
		}
	}

	if (typeof vehicle.light != "undefined") {
		let lightStatus = vehicle.getData("v.lights");
		if (lightStatus != null) {
			console.log(`[${thisResource.name}] Setting vehicle lights to ${lightStatus}`);
			vehicle.lights = lightStatus;
		}
	}

	if (typeof vehicle.siren != "undefined") {
		let sirenStatus = vehicle.getData("v.siren");
		if (sirenStatus != null) {
			console.log(`[${thisResource.name}] Setting vehicle siren to ${sirenStatus}`);
			vehicle.siren = sirenStatus;
		}
	}

	if (game.game < V_GAME_GTA_IV) {
		let lockStatus = vehicle.getData("v.locked");
		if (lockStatus != null) {
			console.log(`[${thisResource.name}] Setting vehicle locked to ${lockStatus}`);
			vehicle.locked = lockStatus;
		}
	}

	if (game.game == V_GAME_GTA_IV) {
		let lockStatus = vehicle.getData("v.locked");
		if (lockStatus != null) {
			console.log(`[${thisResource.name}] Setting vehicle lock status to ${lockStatus}`);
			vehicle.lockedStatus = (lockStatus == false) ? 0 : 1;
		}
	}

	if (typeof vehicle.hazardLights != "undefined") {
		let hazardLightsState = vehicle.getData("v.hazardLights");
		if (hazardLightsState != null) {
			console.log(`[${thisResource.name}] Setting vehicle hazard lights to ${hazardLightsState}`);
			vehicle.hazardLights = hazardLightsState;
		}
	}

	if (typeof vehicle.interiorLight != "undefined") {
		let interiorLightState = vehicle.getData("v.interiorLight");
		if (interiorLightState != null) {
			console.log(`[${thisResource.name}] Setting vehicle interior light to ${interiorLightState}`);
			vehicle.interiorLight = interiorLightState;
		}
	}

	if (game.game <= V_GAME_GTA_IV) {
		let taxiLightState = vehicle.getData("v.taxiLight");
		if (taxiLightState != null) {
			if (game.game == V_GAME_GTA_III || game.game == V_GAME_GTA_VC) {
				console.log(`[${thisResource.name}] Setting vehicle taxi lights to ${taxiLightState}`);
				natives.SET_TAXI_LIGHTS(vehicle.ref, (taxiLightState) ? 1 : 0);
			} else if (game.game == V_GAME_GTA_IV) {
				console.log(`[${thisResource.name}] Setting vehicle taxi lights to ${taxiLightState}`);
				natives.setTaxiLights(vehicle, taxiLightState);
			}
		}
	}

	if (game.game <= V_GAME_GTA_IV) {
		let trunkState = vehicle.getData("v.trunk");
		if (trunkState != null) {
			if (!!trunkState == true) {
				if (game.game == V_GAME_GTA_III || game.game == V_GAME_GTA_VC) {
					console.log(`[${thisResource.name}] Setting vehicle trunk to ${trunkState}`);
					natives.POP_CAR_BOOT(vehicle.ref);
				} else if (game.game == V_GAME_GTA_IV) {
					console.log(`[${thisResource.name}] Setting vehicle trunk to ${trunkState}`);
					if (trunkState == true) {
						natives.openCarDoor(vehicle, 5);
					} else {
						natives.closeCarDoor(vehicle, 5);
					}
				}
			}
		}
	}

	if (game.game == V_GAME_GTA_IV && game.game == V_GAME_GTA_SA) {
		let upgrades = vehicle.getData("v.upgrades");
		if (game.game == V_GAME_GTA_SA) {
			console.log(`[${thisResource.name}] Setting vehicle upgrades to ${upgrades.join(", ")}`);
			for (let i in upgrades) {
				if (upgrades[i] != 0) {
					vehicle.addUpgrade(upgrades[i]);
				}
			}
		} else if (game.game == V_GAME_GTA_IV) {
			console.log(`[${thisResource.name}] Setting vehicle upgrades to ${upgrades.join(", ")}`);
			for (let i = 0; i < upgrades.length; i++) {
				natives.turnOffVehicleExtra(vehicle, i, (!upgrades[i]) ? 1 : 0);
			}
		}
	}

	if (game.game == V_GAME_GTA_IV && game.game == V_GAME_GTA_SA) {
		let livery = vehicle.getData("v.livery");
		if (livery != null) {
			if (game.game == V_GAME_GTA_SA) {
				console.log(`[${thisResource.name}] Setting vehicle livery to ${livery}`);
				vehicle.setPaintJob(livery);
			} else if (game.game == V_GAME_GTA_IV) {
				console.log(`[${thisResource.name}] Setting vehicle livery to ${livery}`);
				natives.setCarLivery(vehicle, livery);
			}
		}
	}

	if (game.game <= V_GAME_GTA_IV) {
		let alarm = vehicle.getData("v.alarm");
		if (alarm != null) {
			if (game.game == V_GAME_GTA_IV) {
				console.log(`[${thisResource.name}] Setting vehicle alarm to ${alarm}`);
				natives.setVehAlarmDuration(vehicle, alarm);
				natives.setVehAlarm(vehicle, (alarm > 0) ? true : false);
			} else if (game.game <= V_GAME_GTA_VC) {
				console.log(`[${thisResource.name}] Setting vehicle alarm to ${alarm}`);
				vehicle.alarm = alarm;
			}
		}
	}
}

// ===========================================================================

addNetworkHandler("ReceiveIVNetworkEvent", (type, name, data, data2, fromClientIndex) => {
	if (fromClientIndex != localClient.index) {
		game.receiveNetworkEvent(0, fromClientIndex, type, 0, data, data2);
	}
});

// ===========================================================================

addEventHandler("OnMapLoaded", function (event, mapName) {
	console.log(`[${thisResource.name}] OnMapLoaded: ${mapName}`);
	triggerNetworkEvent("OnPlayerMapLoaded", mapName);
});

// ===========================================================================

addNetworkHandler("v.sync", function (elementId) {
	let element = getElementFromId(elementId);
	if (element == null) {
		return false;
	}

	syncElementProperties(element);
});

// ===========================================================================

function syncObjectProperties(element) {
	if (typeof element.matrix != "undefined" && game.game < V_GAME_GTA_IV) {
		if (element.getData("v.scale")) {
			let scaleFactor = element.getData("v.scale");
			let tempMatrix = element.matrix;
			tempMatrix.setScale(new Vec3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = element.position;
			element.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			element.position = tempPosition;
		}
	}

	if (typeof element.collisionsEnabled != "undefined" && game < V_GAME_GTA_IV) {
		if (element.getData("v.scale")) {
			element.collisionsEnabled = element.getData("v.scale");
		}
	}
}

// ===========================================================================

addNetworkHandler("v.heading", function (element, heading) {
	if (typeof element == "number") {
		element = getElementFromId(element);
	}

	if (element == null) {
		return false;
	}

	element.heading = heading;
});

// ===========================================================================

addNetworkHandler("v.holsterWeapon", function (ped) {
	if (typeof element == "number") {
		element = getElementFromId(element);
	}

	if (element == null) {
		return false;
	}

	if (typeof ped.holsterWeapon != "undefined") {
		ped.holsterWeapon();
	}
});

// ===========================================================================

addEventHandler("OnPedSpawn", function (event, ped) {
	waitUntil(localPlayer != null).then(function () {
		syncPedProperties(localPlayer);
	});
});

// ===========================================================================

async function waitUntil(condition) {
	return new Promise((resolve) => {
		let interval = setInterval(() => {
			if (!(condition)) {
				return;
			}

			clearInterval(interval);
			resolve();
		}, 1);
	});
}

// ===========================================================================