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

	getElementsByType(ELEMENT_PLAYER).forEach(player => {
		syncElementProperties(player);
	});

	getElementsByType(ELEMENT_VEHICLE).forEach(vehicle => {
		syncElementProperties(vehicle);
	});

	getElementsByType(ELEMENT_PED).forEach(ped => {
		syncElementProperties(ped);
	});

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
			if (game.game == V_GAME_MAFIA_ONE) {
				reportVehicleStateChanges(entity);
			}

			// Tell server about some vehicle properties that are not synced by default
			/*
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
			*/

			//if (game.game <= V_GAME_GTA_IV) {
			//if (typeof entity.locked != "undefined") {
			//	if (entity.getData("v.locked") != entity.locked) {
			//		triggerEvent("OnVehicleLockChanged", entity, entity, entity.locked);
			//		triggerNetworkEvent("OnVehicleLockChanged", entity.id, entity.locked);
			//	}
			//}

			//if (typeof entity.taxiLight != "undefined") {
			//	if (entity.getData("v.taxiLight") != entity.taxiLight) {
			//		//triggerEvent("OnVehicleTaxiLightChanged", entity, entity, entity.taxiLight);
			//		triggerNetworkEvent("OnVehicleTaxiLightChanged", entity.id, entity.taxiLight);
			//	}
			//}
			//}

			//if (typeof entity.health != "undefined") {
			//	if (entity.getData("v.health") != entity.health) {
			//		triggerEvent("OnVehicleHealthChanged", entity, entity, entity.getData("v.health"), entity.health);
			//		triggerNetworkEvent("OnVehicleHealthChanged", entity.id, entity.getData("v.health"), entity.health);
			//	}
			//}

			//if (game.game == V_GAME_GTA_IV) {
			//	if (entity.getData("v.locked") != natives.getCarDoorLockStatus(entity)) {
			//		triggerEvent("OnVehicleLockChanged", entity, entity, natives.getCarDoorLockStatus(entity));
			//		triggerNetworkEvent("OnVehicleLockChanged", entity.id, natives.getCarDoorLockStatus(entity));
			//	}
			//}

			/*
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
			*/
		}
	}
});

// ===========================================================================

addEventHandler("OnPedEnteredVehicle", function (event, ped, vehicle, seat) {
	console.log(`[${thisResource.name}] Ped ${ped.id} entered vehicle ${vehicle.id} in seat ${seat}`);
	triggerNetworkEvent("OnPedEnteredVehicleEx", ped.id, vehicle.id, seat);
});

// ===========================================================================

addEventHandler("OnPedExitedVehicle", function (event, ped) {
	console.log(`[${thisResource.name}] Ped ${ped.id} exited vehicle`);
	triggerNetworkEvent("OnPedExitedVehicleEx", ped.id);
});

// ===========================================================================

addEventHandler("OnPedEnteringVehicle", function (event, ped, vehicle, seat) {
	console.log(`[${thisResource.name}] Ped ${ped.id} is entering vehicle ${vehicle.id} in seat ${seat}`);
	triggerNetworkEvent("OnPedEnteringVehicleEx", ped.id, vehicle.id, seat);
});

// ===========================================================================

addEventHandler("OnPedExitingVehicle", function (event, ped, vehicle, seat) {
	console.log(`[${thisResource.name}] Ped ${ped.id} is exiting vehicle`);
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

addEventHandler("OnElementStreamIn", function (event, element) {
	console.log(`[${thisResource.name}] OnElementStreamIn for element ${element.id}`);

	syncElementProperties(element);
});

// ===========================================================================

// Element data keys that get applied again when an element streams in
const syncedElementDataKeys = {
	generic: [
		"v.interior",
		"v.collisions",
	],
	ped: [
		"v.heading",
		"v.fightStyle",
		"v.walkStyle",
		"v.bodyPartHead",
		"v.bodyPartUpper",
		"v.bodyPartLower",
		"v.bodyPropHat",
		"v.bleeding",
		"v.weapon",
		"v.wander",
	],
	vehicle: [
		"v.colour",
		"v.colour.rgb",
		"v.engine",
		"v.lights",
		"v.siren",
		"v.sirenLight",
		"v.indicatorLeft",
		"v.indicatorRight",
		"v.locked",
		"v.hazardLights",
		"v.interiorLight",
		"v.taxiLight",
		"v.trunk",
		"v.upgrades",
		"v.livery",
		"v.dirtLevel",
		"v.engineDamage",
		"v.alarm",
		"v.tow",
		"v.roof",
		"v.damage",
		"v.beacons",
		"v.headlightScale",
	],
	object: [
		"v.scale",
	],
};

// These are applied even when not set, since having no value means something (i.e. stop wandering, detach from tow)
const nullableElementDataKeys = [
	"v.wander",
	"v.tow",
];

// ===========================================================================

function getElementDataCategory(element) {
	switch (element.type) {
		case ELEMENT_PED:
		case ELEMENT_PLAYER:
			return "ped";

		case ELEMENT_VEHICLE:
			return "vehicle";

		default:
			if (typeof ELEMENT_OBJECT != "undefined" && element.type == ELEMENT_OBJECT) {
				return "object";
			}
			return null;
	}
}

// ===========================================================================

function syncElementProperties(element) {
	if (typeof element == "number") {
		element = getElementFromId(element);
	}

	if (element == null) {
		return false;
	}

	let keys = syncedElementDataKeys.generic;
	let category = getElementDataCategory(element);
	if (category != null) {
		keys = keys.concat(syncedElementDataKeys[category]);
	}

	keys.forEach(key => {
		let value = element.getData(key);
		if (value != null || nullableElementDataKeys.indexOf(key) != -1) {
			applyElementData(element, key, value);
		}
	});

	if (game.game == V_GAME_GTA_IV && element.type == ELEMENT_PLAYER) {
		let playerClient = getClientFromPlayerElement(element);
		if (playerClient != null) {
			natives.setDisplayPlayerNameAndIcon(playerClient.index, false);
		}
	}
}

// ===========================================================================

function applyElementData(element, key, value) {
	switch (key) {
		case "v.interior":
			if (typeof element.interior != "undefined" && value != null) {
				element.interior = value;
			}
			return;

		case "v.collisions":
			if (typeof element.collisionsEnabled != "undefined" && value != null) {
				element.collisionsEnabled = value;
			}
			return;

		case "v.position":
			if (element.isSyncer && value != null) {
				element.position = value;
			}
			return;

		case "v.velocity":
			if (typeof element.velocity != "undefined" && value != null) {
				element.velocity = value;
			}
			return;

		case "v.heading":
			if (typeof element.heading != "undefined" && value != null) {
				element.heading = value;
			}
			return;

		default:
			break;
	}

	switch (getElementDataCategory(element)) {
		case "ped":
			applyPedData(element, key, value);
			break;

		case "vehicle":
			applyVehicleData(element, key, value);
			break;

		case "object":
			applyObjectData(element, key, value);
			break;

		default:
			break;
	}
}

// ===========================================================================

function applyPedData(ped, key, value) {
	// Only v.wander does anything with an empty value
	if (value == null && key != "v.wander") {
		return;
	}

	switch (key) {
		case "v.fightStyle":
			if (typeof ped.setFightStyle != "undefined") {
				ped.setFightStyle(value[0], value[1]);
			}
			break;

		case "v.walkStyle":
			// For GTA SA
			if (typeof ped.walkStyle != "undefined") {
				ped.walkStyle = value;
			}

			// For GTA IV
			if (game.game == V_GAME_GTA_IV) {
				natives.requestAnims(value);
				natives.setAnimGroupForChar(ped, value);
			}
			break;

		case "v.bodyPartHead":
			if (typeof ped.changeBodyPart != "undefined") {
				ped.changeBodyPart(0, Number(value[0]), Number(value[1]));
			}
			break;

		case "v.bodyPartUpper":
			if (typeof ped.changeBodyPart != "undefined") {
				ped.changeBodyPart(1, Number(value[0]), Number(value[1]));
			}
			break;

		case "v.bodyPartLower":
			if (typeof ped.changeBodyPart != "undefined") {
				ped.changeBodyPart(2, Number(value[0]), Number(value[1]));
			}
			break;

		case "v.bodyPropHat":
			if (game.game == V_GAME_GTA_IV) {
				natives.setCharPropIndex(ped, 0, Number(value));
			}
			break;

		case "v.bleeding":
			if (game.game <= V_GAME_GTA_VC) {
				ped.bleeding = value;
			} else if (game.game == V_GAME_GTA_IV) {
				natives.setCharBleeding(ped, value);
			}
			break;

		case "v.weapon":
			if (typeof ped.giveWeapon != "undefined") {
				if (game.game == V_GAME_MAFIA_ONE) {
					ped.giveWeapon(value[0], value[2], value[1]);
				} else {
					ped.giveWeapon(value[0], value[1] + value[2], value[3]);
				}
			}
			break;

		case "v.wander":
			if (ped.type == ELEMENT_PLAYER) {
				break;
			}

			if (game.game == V_GAME_GTA_IV) {
				if (value == null) {
					natives.taskStandStill(ped, 9999999);
				} else {
					natives.taskWanderStandard(ped);
				}
			} else if (game.game <= V_GAME_GTA_SA && value != null) {
				ped.wanderRandomly = true;
			}
			break;

		default:
			break;
	}
}

// ===========================================================================

function applyVehicleData(vehicle, key, value) {
	// Only v.tow does anything with an empty value
	if (value == null && key != "v.tow") {
		return;
	}

	switch (key) {
		case "v.colour":
			if (game.game <= V_GAME_GTA_IV) {
				vehicle.colour1 = value[0];
				vehicle.colour2 = value[1];

				if (value[2] != -1) {
					vehicle.colour3 = value[2];
				}

				if (value[3] != -1) {
					vehicle.colour4 = value[3];
				}
			}
			break;

		case "v.colour.rgb":
			if (game.game <= V_GAME_GTA_VC) {
				vehicle.setRGBColours(value[0], value[1]);
			}
			break;

		case "v.engine":
			if (game.game != V_GAME_MAFIA_ONE) {
				vehicle.engine = value;
			}
			break;

		case "v.lights":
			if (typeof vehicle.lights != "undefined") {
				vehicle.lights = value;
			}
			break;

		case "v.siren":
			if (typeof vehicle.siren != "undefined" && game.game != V_GAME_MAFIA_ONE) {
				vehicle.siren = value;
			}
			break;

		case "v.sirenLight":
			if (game.game <= V_GAME_GTA_VC) {
				vehicle.sirenLight = value;
			}
			break;

		case "v.indicatorLeft":
			vehicle.indicatorsEnabled = true;
			vehicle.indicatorLeft = value;
			break;

		case "v.indicatorRight":
			vehicle.indicatorsEnabled = true;
			vehicle.indicatorRight = value;
			break;

		case "v.locked":
			if (game.game <= V_GAME_GTA_SA) {
				let lockStatus = (value == 2) ? false : value;
				vehicle.locked = (typeof lockStatus == "number") ? !!lockStatus : lockStatus;
			} else if (game.game == V_GAME_GTA_IV) {
				vehicle.lockedStatus = (value == true) ? 2 : 1;
			}
			break;

		case "v.hazardLights":
			if (game.game == V_GAME_GTA_IV) {
				natives.setVehHazardlights(vehicle, !!value);
			}
			break;

		case "v.interiorLight":
			if (game.game == V_GAME_GTA_IV) {
				natives.setVehInteriorlight(vehicle, !!value);
			}
			break;

		case "v.taxiLight":
			if (game.game == V_GAME_GTA_III || game.game == V_GAME_GTA_VC) {
				natives.SET_TAXI_LIGHTS(vehicle.ref, (value) ? 1 : 0);
			} else if (game.game == V_GAME_GTA_IV) {
				natives.setTaxiLights(vehicle, value);
			}
			break;

		case "v.trunk":
			if (game.game == V_GAME_GTA_III || game.game == V_GAME_GTA_VC) {
				if (value == true) {
					natives.POP_CAR_BOOT(vehicle.ref);
				}
			} else if (game.game == V_GAME_GTA_IV) {
				if (value == true) {
					natives.openCarDoor(vehicle, 5);
				} else {
					natives.shutCarDoor(vehicle, 5);
				}
			}
			break;

		case "v.upgrades":
			if (game.game == V_GAME_GTA_SA) {
				for (let i in value) {
					if (value[i] != 0) {
						vehicle.addUpgrade(value[i]);
					}
				}
			} else if (game.game == V_GAME_GTA_IV) {
				for (let i = 0; i < value.length; i++) {
					natives.turnOffVehicleExtra(vehicle, i, (value[i] == 1) ? false : true);
				}
			}
			break;

		case "v.livery":
			if (game.game == V_GAME_GTA_SA) {
				vehicle.setPaintJob(value);
			} else if (game.game == V_GAME_GTA_IV) {
				natives.setCarLivery(vehicle, value);
			}
			break;

		case "v.dirtLevel":
			if (game.game == V_GAME_GTA_IV) {
				natives.setVehicleDirtLevel(vehicle, value);
			}
			break;

		case "v.engineDamage":
			// Engine damage is the inverse of engine health (0 = no damage, 1000 = dead)
			if (game.game == V_GAME_GTA_IV) {
				natives.setEngineHealth(vehicle, 1000 - value);
			} else if (typeof vehicle.engineHealth != "undefined") {
				vehicle.engineHealth = 1000 - value;
			}
			break;

		case "v.alarm":
			if (game.game == V_GAME_GTA_IV) {
				natives.setVehAlarmDuration(vehicle, value);
				natives.setVehAlarm(vehicle, (value > 0) ? true : false);
			} else if (game.game <= V_GAME_GTA_VC) {
				vehicle.alarm = value;
			}
			break;

		case "v.tow":
			if (game.game == V_GAME_GTA_IV) {
				let towedByVehicle = (value != null) ? getElementFromId(value) : null;
				if (towedByVehicle != null) {
					let towOffsets = natives.getOffsetsForAttachCarToCar(vehicle, towedByVehicle);
					let dimensions = natives.getModelDimensions(natives.getCarModel(vehicle));
					natives.attachCarToCar(vehicle, towedByVehicle, 0, new Vec3(0.0, (dimensions[0].y / 2), 0.7), towOffsets[1]);
				} else {
					natives.detachCar(vehicle);
				}
			}
			break;

		// Mafia 1 vehicle state added after MafiaC 2.2.0. The getters/setters throw when the car isn't spawned (and
		// damage throws when the data is invalid or from another model), so they're all guarded.
		case "v.roof":
			if (game.game == V_GAME_MAFIA_ONE) {
				try {
					if (vehicle.roof != value) {
						vehicle.roof = value;
					}
					setReportedVehicleState(vehicle, "roof", value);
				} catch (error) {
					console.warn(`[${thisResource.name}] Couldn't set roof on vehicle ${vehicle.id}: ${error.message}`);
				}
			}
			break;

		case "v.damage":
			if (game.game == V_GAME_MAFIA_ONE) {
				try {
					if (vehicle.damage != value) {
						vehicle.damage = value;
					}
					setReportedVehicleState(vehicle, "damage", value);
				} catch (error) {
					console.warn(`[${thisResource.name}] Couldn't set damage on vehicle ${vehicle.id}: ${error.message}`);
				}
			}
			break;

		case "v.beacons":
			if (game.game == V_GAME_MAFIA_ONE) {
				try {
					vehicle.beacons = value;
				} catch (error) {
					console.warn(`[${thisResource.name}] Couldn't set beacons on vehicle ${vehicle.id}: ${error.message}`);
				}
			}
			break;

		case "v.headlightScale":
			if (game.game == V_GAME_MAFIA_ONE) {
				try {
					vehicle.headlightScale = new Vec3(value.x, value.y, value.z);
				} catch (error) {
					console.warn(`[${thisResource.name}] Couldn't set headlight scale on vehicle ${vehicle.id}: ${error.message}`);
				}
			}
			break;

		default:
			break;
	}
}

// ===========================================================================

// Mafia 1: roof and damage can change on the syncer's side (roof toggled, car crashed), so the syncer tells the
// server, which keeps v.roof/v.damage current. Otherwise a stream-in would put old data back on the car.
// Per vehicle id: the last roof/damage the server knows about, and when the damage was last checked.
let reportedVehicleState = {};

// Reading the damage builds the whole blob, so it's only checked this often (ms)
const vehicleDamageCheckInterval = 2000;

// Damage blobs are at most 65536 bytes (VEHICLEDAMAGE_MAX_SIZE), so this much base64
const maxVehicleDamageLength = 87384;

function setReportedVehicleState(vehicle, key, value) {
	if (typeof reportedVehicleState[vehicle.id] != "undefined") {
		reportedVehicleState[vehicle.id][key] = value;
	}
}

function reportVehicleStateChanges(vehicle) {
	try {
		let state = reportedVehicleState[vehicle.id];
		if (typeof state == "undefined") {
			// Nothing stored yet means the car is as it spawned, so that's the starting point rather than a change
			let roof = vehicle.getData("v.roof");
			let damage = vehicle.getData("v.damage");
			state = {
				roof: (roof != null) ? roof : vehicle.roof,
				damage: (damage != null) ? damage : vehicle.damage,
				lastDamageCheck: Date.now(),
			};
			reportedVehicleState[vehicle.id] = state;
		}

		let roof = vehicle.roof;
		if (roof != state.roof) {
			state.roof = roof;
			triggerNetworkEvent("OnVehicleRoofChanged", vehicle.id, roof);
		}

		if (Date.now() - state.lastDamageCheck >= vehicleDamageCheckInterval) {
			state.lastDamageCheck = Date.now();

			let damage = vehicle.damage;
			if (damage != state.damage && damage.length <= maxVehicleDamageLength) {
				state.damage = damage;
				triggerNetworkEvent("OnVehicleDamageChanged", vehicle.id, damage);
			}
		}
	} catch (error) {
		// Not spawned yet
	}
}

addEventHandler("OnElementStreamOut", function (event, element) {
	if (element != null) {
		delete reportedVehicleState[element.id];
	}
});

// ===========================================================================

function applyObjectData(element, key, value) {
	if (value == null) {
		return;
	}

	switch (key) {
		case "v.scale":
			if (typeof element.matrix != "undefined" && game.game < V_GAME_GTA_IV) {
				let tempMatrix = element.matrix;
				tempMatrix.setScale(new Vec3(value.x, value.y, value.z));
				let tempPosition = element.position;
				element.matrix = tempMatrix;
				tempPosition.z += value.z;
				element.position = tempPosition;
			}
			break;

		default:
			break;
	}
}

// ===========================================================================

addEventHandler("OnElementSetData", function (event, element, key, value) {
	if (element == null) {
		return false;
	}

	applyElementData(element, key, value);
});

// ===========================================================================

if (game.game == V_GAME_MAFIA_ONE) {
	addEventHandler("OnMapLoaded", function (event, mapName) {
		console.log(`[${thisResource.name}] OnMapLoaded: ${mapName}`);
		// Server doesn't receive a packet when a player's map loads, so we'll need to do it manually.
		triggerNetworkEvent("OnPlayerMapLoaded", mapName);
	});
}

// ===========================================================================

addNetworkHandler("v.sync", function (elementId) {
	syncElementProperties(elementId);
});

// ===========================================================================

// This is for Mafia 1 only.
addNetworkHandler("v.holsterWeapon", function (element) {
	console.log(`[${thisResource.name}] Attempting to force ped ${element} to holster weapon.`);

	if (typeof element == "number") {
		element = getElementFromId(element);
	}

	if (element == null) {
		console.warn(`[${thisResource.name}] Aborting ped.holsterWeapon() because ped is null.`);
		return false;
	}

	if (typeof element.holsterWeapon != "undefined") {
		if (element.holsterWeapon()) {
			console.log(`[${thisResource.name}] Forced ped ${element} to holster weapon.`);
		}
	}
});

// ===========================================================================

// Repairing is a one-off action rather than a property, so it stays a network event
addNetworkHandler("v.veh.repair", function (vehicle) {
	if (typeof vehicle == "number") {
		vehicle = getElementFromId(vehicle);
	}

	if (vehicle == null) {
		return false;
	}

	vehicle.fix();
});

// ===========================================================================

// This is for GTA IV only. Changes the ticker text display in Star Junction (IRL Times Square)
addNetworkHandler("v.news", function (newsText) {
	if (game.game == V_GAME_GTA_IV) {
		natives.clearNewsScrollbar();
		natives.addStringToNewsScrollbar(newsText);
	}
});

// ===========================================================================

addNetworkHandler("v.interior", function (interior) {
	if (game.game == V_GAME_MAFIA_ONE) {
		return false;
	}

	localPlayer.interior = interior;
	game.cameraInterior = interior;
});

// ===========================================================================

addEventHandler("OnPedSpawn", function (event, ped) {
	waitUntil(localPlayer != null).then(function () {
		syncElementProperties(localPlayer);
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
