"use strict";

let lastVehicleSpawn = 0;

// ----------------------------------------------------------------------------

addEventHandler("OnEntityProcess", function (event, entity) {
	if (entity.isType(ELEMENT_VEHICLE)) {
		resyncVehicle(entity);
	}
});

// ----------------------------------------------------------------------------

function spawnVehicleCommand(cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <name or id>", syntaxMessageColour);
		return false;
	}

	//if(getCurrentUnixTimestamp()-lastVehicleSpawn < 15000) {
	//	message("You must wait before spawning another vehicle!", errorMessageColour);
	//	return false;
	//}

	let modelId = getVehicleModelIdFromParams(params, gta.game);
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	let heading = localPlayer.heading;

	if (gta.game < GAME_GTA_IV) {
		if (!isValidVehicleModel(modelId)) {
			message("Invalid vehicle model!", errorMessageColour);
			return false;
		}
	}

	if (gta.game == GAME_GTA_III) {
		// Make sure boats only go in water!
		if (modelId == MODELVEHICLE_BOAT_PREDATOR || modelId == MODELVEHICLE_BOAT_GHOST || modelId == MODELVEHICLE_BOAT_REEFER || modelId == MODELVEHICLE_BOAT_SPEEDER) {
			if (gta.findGroundZForCoord(position.x, position.y) != 20) {
				message("You need to be next to water to spawn a boat!", errorMessageColour);
				return false;
			}
		}

		// Make sure it isn't a heli
		if (modelId == MODELVEHICLE_HELI_CHOPPER || modelId == MODELVEHICLE_HELI_ESCAPE) {
			if (!onlineHelicoptersEnabled) {
				message("Helicopters have been disabled on this server!", errorMessageColour);
				return false;
			}
		}

		// Make sure it isn't a train
		if (modelId == MODELVEHICLE_TRAIN_TRAIN) {
			message("Use /train to spawn a train!", errorMessageColour);
			return false;
		}

		// Make sure it isn't an airtrain or deaddodo
		if (modelId == MODELVEHICLE_PLANE_AIRTRAIN || modelId == MODELVEHICLE_PLANE_DEADDODO) {
			message("That vehicle has been been disabled!", errorMessageColour);
			return false;
		}

		// Make sure it isn't near the spawn point
		if (position.distance(new Vec3(1449.19, -197.21, 55.62)) < 75) {
			if (!localClient.administrator) {
				message("You are too close to the spawn area to add a vehicle!", errorMessageColour);
				return false;
			}
		}

		// Make sure there aren't too many other vehicles nearby
		if (getVehiclesInRange(position, 50.0).length >= 15) {
			if (!localClient.administrator) {
				message("There are too many vehicles in the area!", errorMessageColour);
				return false;
			}
		}
	} else if (gta.game == GAME_GTA_VC) {
		// Make sure boats only go in water!
		if (modelId == MODELVEHICLE_BOAT_COASTG || modelId == MODELVEHICLE_BOAT_DINGHY || modelId == MODELVEHICLE_BOAT_JETMAX || modelId == MODELVEHICLE_BOAT_MARQUIS || modelId == MODELVEHICLE_BOAT_PREDATOR || modelId == MODELVEHICLE_BOAT_REEFER || modelId == MODELVEHICLE_BOAT_RIO || modelId == MODELVEHICLE_BOAT_SKIMMER || modelId == MODELVEHICLE_BOAT_SQUALO || modelId == MODELVEHICLE_BOAT_TROPIC) {
			if (gta.findGroundZForCoord(position.x, position.y) != 20) {
				message("You need to be next to water to spawn a boat or skimmer!", errorMessageColour);
				return false;
			}
		}

		// Make sure it isn't near the spawn point
		if (position.distance(new Vec3(-379.16, -535.27, 17.28)) < 75) {
			if (!localClient.administrator) {
				message("You are too close to the spawn area to add a vehicle!", errorMessageColour);
				return false;
			}
		}

		// Make sure there aren't too many other vehicles nearby
		if (getVehiclesInRange(position, 50.0).length >= 10) {
			if (!localClient.administrator) {
				message("There are too many vehicles in the area!", errorMessageColour);
				return false;
			}
		}
	} else if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		// Make sure it isn't a train
		if (modelId == MODEL_SUBWAY_HI || modelId == MODEL_SUBWAY_LO || modelId == MODEL_CABLECAR) {
			message("Use /train to spawn a train!", errorMessageColour);
			return false;
		}

		// Make sure there aren't too many other vehicles nearby
		if (getVehiclesInRange(position, 50.0).length >= 25) {
			if (!localClient.administrator) {
				message("There are too many vehicles in the area!", errorMessageColour);
				return false;
			}
		}

		let spawnProtectionResource = findResourceByName("v-spawnprotect");
		if (spawnProtectionResource != null) {
			if (spawnProtectionResource.isStarted) {
				if (spawnProtectionResource.exports.canSpawnVehiclesInProtectedArea() == true) {
					if (spawnProtectionResource.exports.isPlayerInSpawnProtectionArea() == true) {
						message("Leave the spawn area first!", errorMessageColour);
						return false;
					}
				}
			}
		}
	}

	let thisVeh = false;
	if (gta.game == GAME_GTA_IV) {
		thisVeh = createVehicle2(modelId, position, true);
		thisVeh.heading = heading;
		lastVehicleSpawn = getCurrentUnixTimestamp();
	} else {
		if (isConnected) {
			triggerNetworkEvent("sb.v.add", modelId, position, heading);
		} else {
			thisVeh = gta.createVehicle(modelId, position);
			thisVeh.heading = heading;
		}
	}

	if (thisVeh == null) {
		message("The vehicle could not be added!", errorMessageColour);
		return false;
	}

	let modelName = getVehicleNameFromModelId(modelId);
	let outputText = `spawned ${(doesWordStartWithVowel(modelName)) ? "an" : "a"} ${modelName} (using /${cmdName})`;
	outputSandboxMessage(outputText);

	//canSpawnVehicle = false;
	//setTimeout(function() { canSpawnVehicle = true; }, 15000);
	return true;
};
addCommandHandler("veh", spawnVehicleCommand);
addCommandHandler("vehicle", spawnVehicleCommand);
addCommandHandler("car", spawnVehicleCommand);
addCommandHandler("v", spawnVehicleCommand);
addCommandHandler("spawncar", spawnVehicleCommand);
addCommandHandler("spawnveh", spawnVehicleCommand);
addCommandHandler("addcar", spawnVehicleCommand);
addCommandHandler("addveh", spawnVehicleCommand);

// ----------------------------------------------------------------------------

addCommandHandler("veh_fix", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("/veh_fix <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.fix", getVehicleIdsArray(vehicles));
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.fix();
		});
	}

	if (vehicles.length > 1) {
		outputText = "repaired " + String(vehicles.length) + " vehicles (using /veh_fix)";
	} else {
		outputText = "repaired " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using /veh_fix)";
	}

	outputSandboxMessage(outputText);
	return true;
});

addCommandHandler("veh_explode", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("/veh_explode <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.explode", getVehicleIdsArray(vehicles));
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.blow();
		});
	}

	if (vehicles.length > 1) {
		outputText = "exploded " + String(vehicles.length) + " vehicles (using /veh_explode)";
	} else {
		outputText = "exploded " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using /veh_explode)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_delete", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("/veh_delete <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	// Need this before so the strings can be had
	if (vehicles.length > 1) {
		outputText = "deleted " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "deleted " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using /veh_delete)";
	}

	outputSandboxMessage(outputText);

	if (isConnected) {
		triggerNetworkEvent("sb.v.del", getVehicleIdsArray(vehicles));
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_siren", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Syntax: /veh_siren <vehicle> <0/1 siren state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let sirenState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.siren", getVehicleIdsArray(vehicles), !!sirenState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.siren = !!sirenState;
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's sirens " + String((!!sirenState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s siren " + String((!!sirenState) ? "on" : "off") + " (using /veh_siren)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_alarm", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Syntax: /veh_alarm <vehicle> <0/1 alarm state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let alarmState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		if (game.game != GAME_GTA_IV) {
			triggerNetworkEvent("sb.v.alarm", getVehicleIdsArray(vehicles), !!alarmState);
		} else {
			vehicles.forEach(function (vehicle) {
				natives.setVehAlarm(vehicle, !!alarmState);
				natives.setVehAlarmDuration(vehicle, (!!alarmState == true) ? 99999999 : 0);
			});
		}
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setData("sb.v.alarm", !!alarmState);
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's alarms " + String((!!alarmState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s alarm " + String((!!alarmState) ? "on" : "off") + " (using /veh_alarm)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_upgrade", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Syntax: /veh_upgrade <vehicle> <upgrade id/name>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let upgradeId = getVehicleUpgradeIdFromParams(splitParams.slice(1).join(" "));

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (upgradeId == false) {
		message("That upgrade does not exist!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.upgrade.add", getVehicleIdsArray(vehicles), Number(upgradeId));
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.addUpgrade(upgradeId);
		});
	}

	if (vehicles.length > 1) {
		outputText = "added " + String(vehicleUpgradeNames[Number(upgradeId)]) + " to " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "added " + String(vehicleUpgradeNames[Number(upgradeId)]) + " to " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using /veh_upgrade)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_downgrade", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <upgrade id/name>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let upgradeId = getVehicleUpgradeIdFromParams(splitParams.slice(1).join(" "));

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (upgradeId == false) {
		message("That upgrade does not exist!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.upgrade.del", getVehicleIdsArray(vehicles), upgradeId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.removeUpgrade(upgradeId);
		});
	}

	if (vehicles.length > 1) {
		outputText = "removed " + String(vehicleUpgradeNames[upgradeId]) + " from " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "removed " + String(vehicleUpgradeNames[upgradeId]) + " from " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using /veh_downgrade)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_paintjob", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <paintjob id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let paintJobId = splitParams[1] || 3;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.paintjob", getVehicleIdsArray(vehicles), Number(paintJobId));
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setPaintJob(paintJobId);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's paintjobs to ID " + String(paintJobId);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s paintjob to ID " + String(paintJobId) + " (using /veh_paintjob)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_heading", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <heading>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let heading = splitParams[1] || 0.0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.heading", getVehicleIdsArray(vehicles), heading);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.heading = heading;
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's heading to " + String(heading);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s heading to " + String(heading) + " (using /veh_heading)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_pos", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <x> <y> <z>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let positionX = splitParams[1] || 0.0;
	let positionY = splitParams[2] || 0.0;
	let positionZ = splitParams[3] || 0.0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.position", getVehicleIdsArray(vehicles), positionX, positionY, positionZ);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.position = new Vec3(positionX, positionY, positionZ);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's position to " + String(positionX) + ", " + String(positionY) + ", " + String(positionZ);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s position to " + String(positionX) + ", " + String(positionY) + ", " + String(positionZ) + " (using /veh_pos)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_lock", function (cmdName, params) {
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lockType = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.locked", getVehicleIdsArray(vehicles), lockType);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.carLock = lockType;
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's door locks to " + String(lockType);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s door locks to " + String(lockType) + " (using /veh_lock)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_engine", function (cmdName, params) {
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let engineState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.engine", getVehicleIdsArray(vehicles), !!engineState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.engine = !!engineState;
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's engines " + String((!!engineState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s engine " + String((!!engineState) ? "on" : "off") + " (using /veh_engine)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_light", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <light id> <light state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lightId = (Number(splitParams[1]) || 0);
	let lightState = (Number(splitParams[2]) || 0);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.light", getVehicleIdsArray(vehicles), lightId, !!lightState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setLightStatus(lightId, !!lightState);
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's " + vehicleLightNames[lightId] + " lights " + String((!!lightState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleLightNames[lightId] + " light " + String((!!lightState) ? "on" : "off") + " (using /veh_light)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_panel", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <panel id> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let panelId = Number(splitParams[1]) || 0;
	let panelState = Number(splitParams[2]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.panel", getVehicleIdsArray(vehicles), panelId, panelState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setPanelStatus(panelId, panelState);
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's " + vehiclePanelNames[panelId] + " panel states to " + String(panelState);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehiclePanelNames[panelId] + " panel state to " + String(panelState) + " (using /veh_panel)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_door", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <door id> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let doorId = Number(splitParams[1]) || 0;
	let doorState = Number(splitParams[2]) || vehicles[i].getDoorStatus(doorId);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.door", getVehicleIdsArray(vehicles), doorId, doorState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setDoorStatus(doorId, doorState);
		});
	}

	if (vehicles.length > 1) {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + String(vehicles.length) + " vehicle's " + vehicleDoorNames[doorId] + " door";
	} else {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleDoorNames[doorId] + " door (using /veh_door)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wheel", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <wheel id> <0/1/2 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let wheelId = (Number(splitParams[1]) || 0);
	let wheelState = (Number(splitParams[2]) || 0);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.wheel", getVehicleIdsArray(vehicles), wheelId, wheelState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setWheelStatus(wheelId, doorState);
		});
	}

	if (vehicles.length > 1) {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + String(vehicles.length) + " vehicle's " + vehicleWheelNames[wheelId] + " wheels to " + vehicleWheelStateNames[wheelState].toLowerCase();
	} else {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleWheelNames[wheelId] + " wheel to " + vehicleWheelStateNames[wheelState].toLowerCase() + " (using /veh_wheel)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wheels", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1/2 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let wheelState = (Number(splitParams[1]) || 0);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.wheels", getVehicleIdsArray(vehicles), wheelState);
	} else {
		vehicles.forEach(function (vehicle) {
			for (let i = 0; i < 4; i++) {
				vehicle.setWheelStatus(i, wheelState);
			}
		});
	}

	if (vehicles.length > 1) {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + String(vehicles.length) + " vehicle's wheels";
	} else {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s wheels (using /veh_wheels)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_doors", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let doorState = (Number(splitParams[1]) || 0);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.doors", getVehicleIdsArray(vehicles), doorState);
	} else {
		vehicles.forEach(function (vehicle) {
			for (let i = 0; i < 4; i++) {
				vehicle.setDoorStatus(i, doorState);
			}
		});
	}

	if (vehicles.length > 1) {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + String(vehicles.length) + " vehicle's doors";
	} else {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s doors (using /veh_doors)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_god", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 god mode>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let godMode = (Number(splitParams[1]) || 1);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.god", getVehicleIdsArray(vehicles), !!godMode);
	} else {
		vehicles.forEach(function (vehicle) {
			//vehicle.invincible = !!godMode;
			vehicle.setProofs(!!godMode, !!godMode, !!godMode, !!godMode, !!godMode);
		});
	}

	if (vehicles.length > 1) {
		outputText = "made " + String(vehicles.length) + " vehicle's " + String((!!godMode) ? "invincible" : "not invincible");
	} else {
		outputText = "made " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " " + String((!!godMode) ? "invincible" : "not invincible") + " (using /veh_god)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_syncer", function (cmdName, params) {
	if (!isConnected) {
		message("This command cannot be used offline!", errorMessageColour);
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <player name/id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let clientName = splitParams[1] || localClient.name;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	triggerNetworkEvent("sb.v.syncer", getVehicleIdsArray(vehicles), getClientFromName(clientName));

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's syncer to " + String(getClientFromName(clientName).name);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " syncer to " + String(getClientFromName(clientName).name) + " (using /veh_syncer)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_lights", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 light state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lightState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.lights", getVehicleIdsArray(vehicles), !!lightState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.lights = !!lightState;
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's lights " + String((!!lightState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s lights " + String((!!lightState) ? "on" : "off") + " (using /veh_lights)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_taxilight", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 taxi light state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let taxiLightState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.taxilight", getVehicleIdsArray(vehicles), !!taxiLightState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.taxiLight = !!taxiLightState;
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's taxi lights " + String((!!taxiLightState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s taxi light " + String((!!taxiLightState) ? "on" : "off") + " (using /veh_taxilight)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_hazardlights", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let hazardLightState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.hazardlights", getVehicleIdsArray(vehicles), !!hazardLightState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.hazardLights = !!hazardLightState;
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's hazard lights " + String((!!hazardLightState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s hazard light " + String((!!hazardLightState) ? "on" : "off") + " (using /veh_hazardlight)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_indicator", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let indicatorLightState = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.indicatorlights", getVehicleIdsArray(vehicles), !!indicatorLightState);
	} else {
		vehicles.forEach(function (vehicle) {
			if (game.game == GAME_GTA_IV) {
				natives.setVehIndicatorlights(getVehicleFromId(vehicleId), indicatorLightState);
			}
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's indicator lights " + String((!!indicatorLightState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s indicator light " + String((!!indicatorLightState) ? "on" : "off") + " (using /veh_indicator)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_dirtlevel", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <dirt level>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let dirtLevel = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.dirtlevel", getVehicleIdsArray(vehicles), dirtLevel);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.dirtLevel = dirtLevel;
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's dirt levels to " + String(dirtLevel);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s dirt level to " + String(dirtLevel) + " (using /veh_dirtlevel)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_radio", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <radio station id> [seek]", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let radioStation = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.radio", getVehicleIdsArray(vehicles), radioStation);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.radioStation = radioStation;
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's radio stations to " + vehicleRadioStationNames[gta.game][radioStation];
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s radio station to " + vehicleRadioStationNames[gta.game][radioStation] + " (using /veh_radio)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_mission", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <car mission id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let missionId = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.mission", getVehicleIdsArray(vehicles), missionId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setCarMission(missionId);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's missions to " + String(missionNames[gta.game][missionId]);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s mission to " + String(missionNames[gta.game][missionId]) + " (using /veh_mission)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_rgb", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <red> <blue> <green> <alpha>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let red = Number(splitParams[1]) || 0;
	let green = Number(splitParams[2]) || 0;
	let blue = Number(splitParams[3]) || 0;
	let alpha = Number(splitParams[4]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.colourrgb", getVehicleIdsArray(vehicles), red, green, blue, alpha);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setRGBColour(toColour(red, green, blue, alpha), toColour(red, green, blue, alpha));
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's RGB colours to " + String(red) + ", " + String(green) + ", " + String(blue) + ", " + String(alpha);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s RGB colours to " + String(red) + ", " + String(green) + ", " + String(blue) + ", " + String(alpha) + + " (using /veh_rgb)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour1", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	console.log(localPlayer.vehicle);

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.colour1", getVehicleIdsArray(vehicles), colourId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.colour1 = colourId;
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's primary colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s primary colour to " + String(colourId) + " (using /veh_colour1)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour2", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.colour2", getVehicleIdsArray(vehicles), colourId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.colour2 = colourId;
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's secondary colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s secondary colour to " + String(colourId) + " (using /veh_colour2)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour3", function (cmdName, params) {
	if (gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Syntax: /veh_colour3 <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.colour3", getVehicleIdsArray(vehicles), colourId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.colour3 = colourId;
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's tertiary (third) colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s tertiary (third) colour to " + String(colourId) + " (using /veh_colour3)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour4", function (cmdName, params) {
	if (gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.colour4", getVehicleIdsArray(vehicles), colourId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.colour4 = colourId;
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's quaternary (fourth) colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s quaternary (fourth) colour to " + String(colourId) + " (using /veh_colour4)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_collisions", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let collisionState = Number(splitParams[1] || 1);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.coll", getVehicleIdsArray(vehicles), !!collisionState);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.collisionsEnabled = !!collisionState;
		});
	}

	if (vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's collisions " + String((collisionState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s collisions " + String((collisionState) ? "on" : "off") + " (using /veh_collisions)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_cruisespeed", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <speed>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let cruiseSpeed = Number(splitParams[1]) || 14.0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.cruisespeed", getVehicleIdsArray(vehicles), cruiseSpeed);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setCarCruiseSpeed(cruiseSpeed);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's cruise speed to " + String(cruiseSpeed) + " mph";
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " cruise speed to  " + String(cruiseSpeed) + " mph (using /veh_cruisespeed)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_drivingstyle", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <style id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let drivingStyle = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.drivingstyle", getVehicleIdsArray(vehicles), drivingStyle);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setDrivingStyle(drivingStyle);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's driving styles to " + String(drivingStyle);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s driving style to " + String(drivingStyle) + " (using /veh_drivingstyle)";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_livery", function (cmdName, params) {
	if (gta.game != GAME_GTA_IV && gta.game != GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <livery id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let liveryId = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.livery", getVehicleIdsArray(vehicles), liveryId);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.livery = liveryId;
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's livery designs to " + String(liveryId);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s livery design to " + String(liveryId);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_handling", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <handling index>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let handlingIndex = Number(splitParams[1]) || 0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.handling", getVehicleIdsArray(vehicles), handlingIndex);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.handlingIndex = handlingIndex;
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's handling indexes to " + String(handlingIndex);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s handling index to " + String(handlingIndex);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_drivetopos", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <x> <y> <z>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let x = Number(splitParams[1]) || 0.0;
	let y = Number(splitParams[1]) || 0.0;
	let z = Number(splitParams[1]) || 0.0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.driveto", getVehicleIdsArray(vehicles), x, y, z);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.driveTo(x, y, z, 20.0);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicles drive to " + String(x) + ", " + String(y) + ", " + String(z);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " drive to " + String(x) + ", " + String(y) + ", " + String(z);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_driveto", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <location name>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let locationName = splitParams.slice(1).join(" ");

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	let selectedLocation = false;
	for (let i in gameLocations[gta.game]) {
		if (gameLocations[gta.game][i][0].toLowerCase().indexOf(locationName.toLowerCase()) != -1) {
			selectedLocation = gameLocations[gta.game][i];
		}
	}

	if (!selectedLocation) {
		message("Invalid location name!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.driveto", getVehicleIdsArray(vehicles), selectedLocation[1][0], selectedLocation[1][1], selectedLocation[1][2]);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.driveTo(selectedLocation[1][0], selectedLocation[1][1], selectedLocation[1][2], 20.0);
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicles to drive to " + String(selectedLocation[0]);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " to drive to " + String(selectedLocation[0]);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_scale", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <scale>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let scale = Number(splitParams[1]) || 1.0;

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.scale", getVehicleIdsArray(vehicles), scale);
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.setData("sb.v.scale", scale);
		});
	}

	if (vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's scales to " + String(scale);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s scale to " + String(scale)
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wander", function (cmdName, params) {
	if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);

	let outputText = "";

	if (vehicles.length == 0) {
		message("No vehicles found! Use '/help vehicle' for information.", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.v.wander", getVehicleIdsArray(vehicles));
	} else {
		vehicles.forEach(function (vehicle) {
			vehicle.carWanderRandomly();
		});
	}

	if (vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicles to drive around aimlessly when a ped driver is available.";
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " to drive around aimlessly when a ped driver is available.";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

function getVehiclesFromParams(params) {
	let vehicles = getVehicles();

	switch (params.toLowerCase()) {
		case "m":
		case "me":
		case "mine":
			return [localPlayer.vehicle];

		case "last":
		case "new":
		case "newest":
		case "l":
			return [vehicles[vehicles.length - 1]];

		case "n":
		case "c":
		case "closest":
		case "nearest":
			return [getClosestVehicle(localPlayer.position)];

		case "r":
		case "range":
		case "near":
		case "within":
			return getVehiclesInRange(localPlayer.position, 20.0);

		case "a":
		case "all":
			return getVehicles();

		case "r":
		case "random":
		case "any":
			return [getRandomVehicle()];

		default:
			if (isNaN(params)) {
				let peds = getPeds();
				for (let i in peds) {
					if (peds[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
						return [peds[i].vehicle];
					}
				}
			} else {
				if (typeof vehicles[Number(params)] != "undefined") {
					return [vehicles[Number(params)]];
				}
			}
			return [];
	}

	return false;
}

/*

function getVehiclesFromParams(params) {
	let parsedParams = parseParams(params);

	let vehicles = getVehicles();
	let selectedVehicles = [];

	parsedParams.forEach(function(parsedParam) {
		switch(parsedParam[0].toLowerCase()) {
			case "m":
			case "me":
			case "mine":
				selectedVehicles.push(localPlayer.vehicle);
				break;

			case "l":
				selectedVehicles.push(vehicles[vehicles.length-1]);
				break;

			case "c":
				selectedVehicles.push(getClosestVehicle(localPlayer.position));
				break;

			case "pr":
				selectedVehicles.push(getClosestVehicle(localPlayer.position));
				break;

			case "r":
				selectedVehicles.concat(getVehiclesInRange(localPlayer.position, parsedParam[1] || 20.0));
				break;

			case "a":
			case "all":
				selectedVehicles.concat(getVehicles());
				break;

			case "r":
			case "random":
			case "any":
				selectedVehicles.push(getRandomVehicle());
				break;

			case "p":
				let player = getPlayerFromParams(parsedParam[1]);
				if(player != null) {

				}
				break;

			default:
				break;
		}
	});

	return selectedVehicles;
}
*/

// ----------------------------------------------------------------------------

/*addEventHandler("OnKeyDown", function(event, keyCode, scanCode, mod) {

});*/

/*
addEventHandler("OnKeyUp", function(event, keyCode, scanCode, mod) {
	switch(keyCode) {
		case SDLK_g:
			if(localPlayer.vehicle == null) {
				let tempVehicle = getClosestVehicle(localPlayer.position);
				if(getDistance(localPlayer.position, tempVehicle.position) <= 6) {
					localPlayer.enterVehicle(tempVehicle, false);
				}
			}
			break;

		case SDLK_f:
			if(localPlayer.vehicle != null) {
				if(localPlayer.vehicle.getOccupant(1) == localPlayer || localPlayer.vehicle.getOccupant(2) == localPlayer || localPlayer.vehicle.getOccupant(3) == localPlayer) {
					localPlayer.exitVehicle();
				}
			}
			break;
	}
});
*/

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.sync", function (vehicleId) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle != null) {
		resyncVehicle(vehicle);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.veh.enter", function (playerId, vehicleId, driver) {
	getElementFromId(playerId).enterVehicle(getElementFromId(vehicleId), driver);
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function (event, element) {
});

// ----------------------------------------------------------------------------

function resyncVehicle(vehicle) {
	if (vehicle.getData("sb.v.scale") != null) {
		let scaleFactor = vehicle.getData("sb.v.scale");
		let vehicleMatrix = vehicle.matrix;
		vehicleMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
		let vehiclePosition = vehicle.position;
		vehicle.matrix = vehicleMatrix;
		//vehiclePosition.z += vehicleData[vehicleDataStructure.scale];
		vehicle.position = vehiclePosition;
		//vehicle.collisionsEnabled = false;
		//console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " scale resynced");
	}
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.fix", function (vehicleIds) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).fix();
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.siren", function (vehicleIds, sirenState) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).siren = sirenState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.engine", function (vehicleIds, engineState) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).engine = engineState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.alarm", function (vehicleIds, alarmState) {
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.radio", function (vehicleIds, radioStation) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).radioStation = radioStation;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.lights", function (vehicleIds, lightState) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).lights = lightState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.taxilight", function (vehicleIds, taxiLightState) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).taxiLight = taxiLightState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheels", function (vehicleIds, wheelState) {
	vehicles.forEach(function (vehicle) {
		for (let i = 0; i <= 8; i++) {
			vehicle.setWheelStatus(i, wheelState);
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.doors", function (vehicleIds, doorState) {
	vehicles.forEach(function (vehicle) {
		for (let i = 0; i <= 6; i++) {
			vehicle.setDoorStatus(i, doorState);
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.door", function (vehicleIds, doorId, doorState) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).setDoorStatus(doorId, doorState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheel", function (vehicleIds, wheelId, wheelState) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).setWheelStatus(wheelId, wheelState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.health", function (vehicleIds, health) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.setCarHealth(getVehicleFromId(vehicleId), health);
		} else {
			getVehicleFromId(vehicleId).health = health;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.horn", function (vehicleIds, hornState) {
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.coll", function (vehicleIds, collisionState) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.setCarCollision(getVehicleFromId(vehicleId), collisionState);
		} else {
			getVehicleFromId(vehicleId).collisionsEnabled = collisionState;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.locked", function (vehicleIds, lockState) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.lockCarDoors(getVehicleFromId(vehicleId), lockState);
		} else {
			getVehicleFromId(vehicleId).locked = locked;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.cruisespeed", function (vehicleIds, cruiseSpeed) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).setCarCruiseSpeed(cruiseSpeed);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.drivingstyle", function (vehicleIds, drivingStyle) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).setDrivingStyle(drivingStyle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.mission", function (vehicleIds, missionId) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).setCarMission(missionId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.dirtlevel", function (vehicleIds, dirtLevel) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.setVehicleDirtLevel(getVehicleFromId(vehicleId), dirtLevel);
		} else {
			getVehicleFromId(vehicleId).livery = livery;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.livery", function (vehicleIds, livery) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.setCarLivery(getVehicleFromId(vehicleId), livery);
		} else {
			getVehicleFromId(vehicleId).livery = livery;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.hazardlights", function (vehicleIds, hazardLightState) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.setVehHazardlights(getVehicleFromId(vehicleId), hazardLightState);
		} else {
			getVehicleFromId(vehicleId).hazardLights = hazardLightState;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.indicatorlights", function (vehicleIds, indicatorState) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.setVehIndicatorlights(getVehicleFromId(vehicleId), indicatorState);
		} else {
			getVehicleFromId(vehicleId).hazardLights = hazardLightState;
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wander", function (vehicleIds) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).carWanderRandomly();
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.driveto", function (vehicleIds, x, y, z) {
	vehicleIds.forEach(function (vehicleId) {
		if (game.game == GAME_GTA_IV) {
			natives.taskCarDriveToCoord(getVehicleFromId(vehicleId), indicatorState);
		} else {
			getVehicleFromId(vehicleId).driveTo(x, y, z, 20.0);
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.god", function (vehicleIds, godMode) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).invincible = godMode;
		getVehicleFromId(vehicleId).setProofs(godMode, godMode, godMode, godMode, godMode);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.add", function (vehicleIds, upgradeId) {
	console.log(vehicles);
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).addUpgrade(upgradeId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.del", function (vehicleIds, upgradeId) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).removeUpgrade(upgradeId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.paintjob", function (vehicleIds, paintJobId) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).setPaintJob(paintJobId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour1", function (vehicleIds, colour1) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).colour1 = colour1;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour2", function (vehicleIds, colour2) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).colour2 = colour2;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour3", function (vehicleIds, colour3) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).colour3 = colour3;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour4", function (vehicleIds, colour4) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).colour4 = colour4;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.enablegps", function (vehicles) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).enableGPS();
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.opentrunk", function (vehicles) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).openTrunk();
	})
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.petroltankhealth", function (vehicleIds, petrolTankHealth) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).petrolTankHealth = petrolTankHealth;
	})
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.engineHealth", function (vehicleIds, engineHealth) {
	vehicleIds.forEach(function (vehicleId) {
		getVehicleFromId(vehicleId).engineHealth = engineHealth;
	})
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.del", function (vehicles) {
	vehicles.forEach(function (vehicle) {
		destroyElement(vehicle);
	});
});

// ----------------------------------------------------------------------------

function enterVehicle(vehicle, driver) {
	localPlayer.enterVehicle(vehicle, driver);
}

// ----------------------------------------------------------------------------

function getFirstEmptySeat(vehicle) {
	for (let i = 1; i < 4; i++) {
		if (vehicle.getOccupant(i) == null) {
			return i;
		}
	}
}

// ----------------------------------------------------------------------------

function createVehicle2(hash, position, sync) {
	if (natives.isModelInCdimage(hash)) {
		natives.requestModel(hash);
		natives.loadAllObjectsNow();
		return natives.createCar(hash, position, sync);
	}
}

// ----------------------------------------------------------------------------

function getVehicleIdsArray(vehicles) {
	let tempArray = [];
	for (let i in vehicles) {
		tempArray.push((game.game == GAME_GTA_IV) ? natives.getNetworkIdFromVehicle(vehicles[i]) : vehicles[i].id);
	}
	return tempArray;
}

// ----------------------------------------------------------------------------

function getVehicleFromId(vehicleId) {
	return (game.game == GAME_GTA_IV) ? natives.getVehicleFromNetworkId(vehicleId) : getElementFromId(vehicleId);
}

// ----------------------------------------------------------------------------