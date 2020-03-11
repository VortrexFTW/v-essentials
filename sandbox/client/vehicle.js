"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(gta.game != GAME_GTA_IV && gta.game != GAME_GTA_IV_EFLC) {
		//if(isConnected) {
		//	if(localPlayer != null) {
		//		if(localPlayer.vehicle) {
		//			if(localPlayer.vehicle.isSyncer) {
		//				//if(localPlayer.vehicle.getData("sb")[vehicleDataStructure.hornState] != localPlayer.vehicle.horn) {
		//				//	triggerNetworkEvent("sb.v.horn", localPlayer.vehicle.id, localPlayer.vehicle.horn);
		//				//}
		//
		//				//if(localPlayer.vehicle.getData("sb")[vehicleDataStructure.sirenState] != localPlayer.vehicle.siren) {
		//				//	triggerNetworkEvent("sb.v.siren", localPlayer.vehicle.id, localPlayer.vehicle.siren);
		//				//}
		//			}
		//		}
		//	}
		//}

		if(isConnected) {
			let vehicles = getVehicles();
			for(let i in vehicles) {
				//if(localPlayer.vehicle != vehicles[i]) {
					if(!vehicles[i].isSyncer) {
						let vehicleData = vehicles[i].getData("sb");

						if(vehicleData != null) {
							if(vehicleData[vehicleDataStructure.alarmState] == true) {
								vehicles[i].alarm = true;
							} else {
								vehicles[i].alarm = false;
							}

							if(vehicleData[vehicleDataStructure.hornState] == true) {
								vehicles[i].horn = true;
							} else {
								vehicles[i].horn = false;
							}
						}
					}
				//}
			}
		}
	}
});

// ----------------------------------------------------------------------------

function spawnVehicleCommand(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <model id/name>", syntaxMessageColour);
		return false;
	}

	let modelId = getVehicleModelIdFromParams(params, gta.game);
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	let heading = localPlayer.heading;

	if(gta.game < GAME_GTA_IV) {
		if(!isValidVehicleModel(modelId)) {
			message("Invalid vehicle model!", errorMessageColour);
			return false;
		}
	}

	if(game.game == GAME_GTA_III) {
		// Make sure boats only go in water!
		if(modelId == MODELVEHICLE_BOAT_PREDATOR || modelId == MODELVEHICLE_BOAT_GHOST || modelId == MODELVEHICLE_BOAT_REEFER || modelId == MODELVEHICLE_BOAT_SPEEDER) {
			if(findGroundZForCoord(position.x, position.y) != 20) {
				message("You need to be next to water to spawn a boat!", errorMessageColour);
				return false;
			}
		}

		// Make sure it isn't a heli
		if(modelId == MODELVEHICLE_HELI_CHOPPER || modelId == MODELVEHICLE_HELI_ESCAPE) {
			if(!onlineHelicoptersEnabled) {
				message("Helicopters have been disabled on this server!", errorMessageColour);
				return false;
			}
		}

		// Make sure it isn't a train
		if(modelId == MODELVEHICLE_TRAIN_TRAIN) {
			message("Use /train to spawn a train!", errorMessageColour);
			return false;
		}

		// Make sure it isn't an airtrain or deaddodo
		if(modelId == MODELVEHICLE_PLANE_AIRTRAIN || modelId == MODELVEHICLE_PLANE_DEADDODO) {
			message("That vehicle has been been disabled!", errorMessageColour);
			return false;
		}

		// Make sure it isn't near the spawn point
		if(getDistance(position, new Vec3(1449.19, -197.21, 55.62)) < 75) {
			message("You are too close to the spawn area to add a vehicle!", errorMessageColour);
			return false;
		}

		// Make sure there aren't too many other vehicles nearby
		if(getVehiclesInRange(position, 50.0).length >= 20) {
			message("There are too many vehicles in the area!", errorMessageColour);
			return false;
		}
	} else if(game.game == GAME_GTA_VC) {
		// Make sure boats only go in water!
		if(modelId == MODELVEHICLE_BOAT_COASTG || modelId == MODELVEHICLE_BOAT_DINGHY || modelId == MODELVEHICLE_BOAT_JETMAX || modelId == MODELVEHICLE_BOAT_MARQUIS || modelId == MODELVEHICLE_BOAT_PREDATOR || modelId == MODELVEHICLE_BOAT_REEFER || modelId == MODELVEHICLE_BOAT_RIO || modelId == MODELVEHICLE_BOAT_SKIMMER || modelId == MODELVEHICLE_BOAT_SQUALO || modelId == MODELVEHICLE_BOAT_TROPIC) {
			if(findGroundZForCoord(position.x, position.y) != 20) {
				message("You need to be next to water to spawn a boat or skimmer!", errorMessageColour);
				return false;
			}
		}

		// Make sure it isn't near the spawn point
		if(getDistance(position, new Vec3(-379.16, -535.27, 17.28)) < 75) {
			message("You are too close to the spawn area to add a vehicle!", errorMessageColour);
			return false;
		}

		// Make sure there aren't too many other vehicles nearby
		if(getVehiclesInRange(position, 50.0).length >= 10) {
			message("There are too many vehicles in the area!", errorMessageColour);
			return false;
		}
	} else if(game.game == GAME_GTA_IV || game.game == GAME_GTA_IV_EFLC) {
		// Make sure it isn't a train
		if(modelId == MODEL_SUBWAY_HI || modelId == MODEL_SUBWAY_LO || modelId == MODEL_CABLECAR) {
			message("Use /train to spawn a train!", errorMessageColour);
			return false;
		}

		// Make sure there aren't too many other vehicles nearby
		if(getVehiclesInRange(position, 50.0).length >= 25) {
			message("There are too many vehicles in the area!", errorMessageColour);
			return false;
		}
	}

	if(isConnected) {		
		triggerNetworkEvent("sb.v.add", modelId, position.x, position.y, position.z, heading);
	} else {
		let thisVeh = gta.createVehicle(modelId, position);
		if(!thisVeh) {
			message("The vehicle could not be added!", errorMessageColour);
			return false;
		}
		thisVeh.heading = heading;
		modelId = thisVeh.modelIndex;
	}
	
	let modelName = getVehicleNameFromModelId(modelId);
	let outputText = "spawned " + String((doesWordStartWithVowel(modelName)) ? "an" : "a") + " " + modelName;
	outputSandboxMessage(outputText);
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

addCommandHandler("veh_fix", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/veh_fix <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.fix", vehicles);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.fix();
		});
	}

	if(vehicles.length > 1) {
		outputText = "repaired " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "repaired " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_delete", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/veh_delete <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	// Need this before so the strings can be had
	if(vehicles.length > 1) {
		outputText = "deleted " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "deleted " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}
	
	outputSandboxMessage(outputText);	

	if(isConnected) {
		triggerNetworkEvent("sb.v.del", vehicles);
	} else {
		vehicles.forEach(function(vehicle) {
			destroyElement(vehicles);
		});
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_siren", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Syntax: /veh_siren <vehicle> <0/1 siren state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let sirenState = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.v.siren", vehicles, !!sirenState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.siren = !!sirenState;
		});
	}	

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's sirens " + String((!!sirenState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s siren " + String((!!sirenState) ? "on" : "off");
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_alarm", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Syntax: /veh_alarm <vehicle> <0/1 alarm state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let alarmState = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.alarm", vehicles, !!alarmState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setData("sb.v.alarm", !!alarmState);
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's alarms " + String((!!alarmState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s alarm " + String((!!alarmState) ? "on" : "off");
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_upgrade", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Syntax: /veh_upgrade <vehicle> <upgrade id/name>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let upgradeId = getVehicleUpgradeIdFromParams(splitParams[1]);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(upgradeId == false) {
		message("That upgrade does not exist!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.upgrade.add", vehicles, Number(upgradeId));
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.addUpgrade(upgradeId);
		});
	}

	if(vehicles.length > 1) {
		outputText = "added " + String(vehicleUpgradeNames[Number(upgradeId)]) + " to " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "added " + String(vehicleUpgradeNames[Number(upgradeId)]) + " to " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_downgrade", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <upgrade id/name>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let upgradeId = getVehicleUpgradeIdFromParams(splitParams[1]);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(upgradeId == false) {
		message("That upgrade does not exist!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.upgrade.del", vehicles, upgradeId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.removeUpgrade(upgradeId);
		});
	}

	if(vehicles.length > 1) {
		outputText = "removed " + String(vehicleUpgradeNames[upgradeId]) + " from " + String(vehicles.length) + " vehicles";
	} else {
		outputText = "removed " + String(vehicleUpgradeNames[upgradeId]) + " from " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_paintjob", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <paintjob id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let paintJobId = splitParams[1] || 3;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.paintjob", vehicles, Number(paintJobId));
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setPaintJob(paintJobId);
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's paintjobs to ID " + String(paintJobId);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s paintjob to ID " + String(paintJobId);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_heading", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <heading>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let heading = splitParams[1] || 0.0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.heading", vehicles, heading);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.heading = heading;
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's heading to " + String(heading);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s heading to " + String(heading);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_pos", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <x> <y> <z>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let positionX = splitParams[1] || 0.0;
	let positionY = splitParams[2] || 0.0;
	let positionZ = splitParams[3] || 0.0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.position", vehicles, positionX, positionY, positionZ);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.position = new Vec3(positionX, positionY, positionZ);
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's position to " + String(positionX) + ", " + String(positionY) + ", " + String(positionZ);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s position to " + String(positionX) + ", " + String(positionY) + ", " + String(positionZ);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_horn", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 horn state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let hornState = Number(splitParams[1]) || 0;

	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.horn", vehicles, !!hornState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setData("sb.v.horn", !!hornState);
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's horns " + String((!!hornState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s horn " + String((!!hornState) ? "on" : "off");
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_locked", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 lock state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lockState = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.locked", vehicles, !!lockState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.locked = !!lockState;
		});
	}

	if(vehicles.length > 1) {
		outputText = String((!!lockState) ? "locked" : "unlocked") + " " + String(vehicles.length) + " vehicle's doors";
	} else {
		outputText = String((!!lockState) ? "locked" : "unlocked") + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s doors";
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_engine", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 engine state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let engineState = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.engine", vehicles, !!engineState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.engine = !!engineState;
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's engines " + String((!!engineState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s engine " + String((!!engineState) ? "on" : "off");
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_light", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <light id> <light state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lightId = (Number(splitParams[1]) || 0);
	let lightState = (Number(splitParams[2]) || 0);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.light", vehicles, lightId, !!lightState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setLightStatus(lightId, !!lightState);
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's " + vehicleLightNames[lightId] + " lights " + String((!!lightState) ? "on" : "off");
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleLightNames[lightId] + " light " + String((!!lightState) ? "on" : "off");
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_panel", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <panel id> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let panelId = Number(splitParams[1]) || 0;
	let panelState = Number(splitParams[2]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.panel", vehicles, panelId, panelState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setPanelStatus(panelId, panelState);
		});
	}

	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's " + vehiclePanelNames[panelId] + " panel states to " + String(panelState);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehiclePanelNames[panelId] + " panel state to " + String(panelState);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_door", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <door id> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let doorId = Number(splitParams[1]) || 0;
	let doorState = Number(splitParams[2]) || vehicles[i].getDoorStatus(doorId);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.v.door", vehicles, doorId, doorState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setDoorStatus(doorId, doorState);
		});
	}	

	if(vehicles.length > 1) {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + String(vehicles.length) + " vehicle's " + vehicleDoorNames[doorId] + " doors";
	} else {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleDoorNames[doorId] + " doors";
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wheel", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <wheel id> <0/1/2 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let wheelId = (Number(splitParams[1]) || 0);
	let wheelState = (Number(splitParams[2]) || 0);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.wheel", vehicles, wheelId, wheelState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setWheelStatus(wheelId, doorState);
		});
	}

	if(vehicles.length > 1) {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + String(vehicles.length) + " vehicle's " + vehicleWheelNames[wheelId] + " wheels to " + vehicleWheelStateNames[wheelState].toLowerCase();
	} else {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleWheelNames[wheelId] + " wheel to " + vehicleWheelStateNames[wheelState].toLowerCase();
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wheels", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1/2 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let wheelState = (Number(splitParams[1]) || 0);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.wheels", vehicles, wheelState);
	} else {
		vehicles.forEach(function(vehicle) {
			for(let i = 0; i < 4 ; i++) {
				vehicle.setWheelStatus(i, wheelState);
			}
		});
	}

	if(vehicles.length > 1) {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + String(vehicles.length) + " vehicle's wheels";
	} else {
		outputText = vehicleWheelStateActionNames[wheelState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s wheels"
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_doors", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let doorState = (Number(splitParams[1]) || 0);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.doors", vehicles, doorState);
	} else {
		vehicles.forEach(function(vehicle) {
			for(let i = 0; i < 4 ; i++) {
				vehicle.setDoorStatus(i, doorState);
			}
		});
	}

	if(vehicles.length > 1) {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + String(vehicles.length) + " vehicle's doors";
	} else {
		outputText = vehicleDoorStateActionNames[doorState].toLowerCase() + " " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s doors";
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_god", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 god mode>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let godMode = (Number(splitParams[1]) || 1);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.god", vehicles, !!godMode);
	} else {
		vehicles.forEach(function(vehicle) {
			//vehicle.invincible = !!godMode;
			vehicle.setProofs(!!godMode, !!godMode, !!godMode, !!godMode, !!godMode);
		});
	}

	if(vehicles.length > 1) {
		outputText = "made " + String(vehicles.length) + " vehicle's " + String((!!godMode) ? "invincible" : "not invincible");
	} else {
		outputText = "made " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " " + String((!!godMode) ? "invincible" : "not invincible");
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_syncer", function(cmdName, params) {
	if(!isConnected) {
		message("This command cannot be used offline!", errorMessageColour);
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <player name/id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let clientName = splitParams[1] || localClient.name;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	triggerNetworkEvent("sb.v.syncer", vehicles, getClientFromName(clientName));
	
	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's syncer to " + String(getClientFromName(clientName).name);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " syncer to " + String(getClientFromName(clientName).name);
	}	
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_lights", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 light state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lightState = Number(splitParams[1]) || 0;

	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.lights", vehicles, !!lightState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.lights = !!lightState;
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's lights " + String((!!lightState) ? "on" : "off" );
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s lights " + String((!!lightState) ? "on" : "off" );
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_taxilight", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 taxi light state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let taxiLightState = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.taxilight", vehicles, !!taxiLightState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.taxiLight = !!taxiLightState;
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's taxi lights " + String((!!taxiLightState) ? "on" : "off" );
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s taxi light " + String((!!taxiLightState)? "on" : "off" );
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_hazardlights", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let hazardLightState = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.v.hazardlights", vehicles, !!hazardLightState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.hazardlights = !!hazardLightState;
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's hazard lights " + String((!!hazardLightState) ? "on" : "off" );
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s hazard light " + String((!!hazardLightState)? "on" : "off" );
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_dirtlevel", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <dirt level>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let dirtLevel = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.dirtlevel", vehicles, dirtLevel);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.dirtLevel = dirtLevel;
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's dirt levels to " + String(dirtLevel);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s dirt level to " + String(dirtLevel);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_radio", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <radio station id> [seek]", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let radioStation = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.radio", vehicles, radioStation);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.radioStation = radioStation;
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's radio stations to " + vehicleRadioStationNames[game.game][radioStation];
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s radio station to " + vehicleRadioStationNames[game.game][radioStation];
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_mission", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <car mission id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let missionId = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.mission", vehicles, missionId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setCarMission(missionId);
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's missions to " + String(missionNames[gta.game][missionId]);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s mission to " + String(missionNames[gta.game][missionId]);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_rgb", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
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

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.colourrgb", vehicles, red, green, blue, alpha);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setRGBColour(toColour(red, green, blue, alpha), toColour(red, green, blue, alpha));
		});
	}

	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's RGB colours to " + String(red) + ", " + String(green) + ", " + String(blue) + ", " + String(alpha);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s RGB colours to " + String(red) + ", " + String(green) + ", " + String(blue) + ", " + String(alpha);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour1", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.colour1", vehicles, colourId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.colour1 = colourId;
		});
	}
		
	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's primary colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s primary colour to " + String(colourId);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour2", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.colour2", vehicles, colourId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.colour2 = colourId;
		});
	}
	
	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's secondary colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s secondary colour to " + String(colourId);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour3", function(cmdName, params) {
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Syntax: /veh_colour3 <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.colour3", vehicles, colourId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.colour3 = colourId;
		});
	}

	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's tertiary (third) colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s tertiary (third) colour to " + String(colourId);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour4", function(cmdName, params) {
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <colour id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.colour4", vehicles, colourId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.colour4 = colourId;
		});
	}

	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's quaternary (fourth) colours to " + String(colourId);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s quaternary (fourth) colour to " + String(colourId);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_collisions", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <0/1 state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let collisionState = Number(splitParams[1] || 1);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.coll", vehicles, !!collisionState);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.collisionsEnabled = !!collisionState;
		});
	}

	if(vehicles.length > 1) {
		outputText = "turned " + String(vehicles.length) + " vehicle's collisions " + String((collisionState) ? "on" : "off" );
	} else {
		outputText = "turned " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s collisions " + String((collisionState) ? "on" : "off" );
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_cruisespeed", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <speed>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let cruiseSpeed = Number(splitParams[1]) || 14.0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.cruisespeed", vehicles, cruiseSpeed);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setCarCruiseSpeed(cruiseSpeed);
		});
	}
	
	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's cruise speed to " + String(cruiseSpeed) + " mph";
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " cruise speed to  " + String(cruiseSpeed) + " mph";
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_drivingstyle", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <style id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let drivingStyle = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.drivingstyle", vehicles, drivingStyle);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setDrivingStyle(drivingStyle);
		});
	}
	
	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's driving styles to " + String(drivingStyle);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s driving style to " + String(drivingStyle);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_livery", function(cmdName, params) {
	if(gta.game != GAME_GTA_IV && gta.game != GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <livery id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let liveryId = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.livery", vehicles, liveryId);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.livery = liveryId;
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's livery designs to " + String(liveryId);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s livery design to " + String(liveryId);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_handling", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <handling index>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let handlingIndex = Number(splitParams[1]) || 0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.handling", vehicles, handlingIndex);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.handlingIndex = handlingIndex;
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicle's handling indexes to " + String(handlingIndex);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s handling index to " + String(handlingIndex);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_drivetopos", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <x> <y> <z>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let x = Number(splitParams[1]) || 0.0;
	let y = Number(splitParams[1]) || 0.0;
	let z = Number(splitParams[1]) || 0.0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.driveto", vehicles, x, y, z);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.driveTo(x, y, z);
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicles drive to " + String(x) + ", " + String(y) + ", " + String(z);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " drive to " + String(x) + ", " + String(y) + ", " + String(z);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

addCommandHandler("veh_driveto", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <location name>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let locationName = splitParams.slice(1, splitParams.length).join(" ") || gameLocations[gta.game][0][0];
	console.log(locationName);
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	let selectedLocation = gameLocations[gta.game][0];
	gameLocations[gta.game].forEach(function(gameLocation) {
		if(gameLocation[0].toLowerCase().indexOf(locationName.toLowerCase()) != -1) {
			selectedLocation = gameLocation;
		}
	});

	if(isConnected) {
		triggerNetworkEvent("sb.v.driveto", vehicles, selectedLocation[1][0], selectedLocation[1][1], selectedLocation[1][2]);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.driveTo(selectedLocation[1][0], selectedLocation[1][1], selectedLocation[1][2]);
		});
	}

	if(vehicles.length > 1) {
		outputText = "set " + String(vehicles.length) + " vehicles to drive to " + String(selectedLocation[0]);
	} else {
		outputText = "set " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " to drive to " + String(selectedLocation[0]);
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_scale", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle> <scale>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let scale = Number(splitParams[1]) || 0.0;
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.scale", vehicles, scale);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.setData("sb.v.scale", scale);
		});
	}
		
	if(vehicles.length > 1) {
		outputText = "changed " + String(vehicles.length) + " vehicle's scales to " + String(scale);
	} else {
		outputText = "changed " + getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s scale to " + String(scale)
	}
	
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wander", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	
	let outputText = "";

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.v.wander", vehicles);
	} else {
		vehicles.forEach(function(vehicle) {
			vehicle.carWanderRandomly();
		});
	}

	if(vehicles.length > 1) {
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

	switch(params.toLowerCase()) {
		case "m":
		case "me":
		case "mine":
			return [localPlayer.vehicle];

		case "last":
		case "new":
		case "newest":
		case "l":
			return [vehicles[vehicles.length-1]];

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
			if(isNaN(params)) {
				let peds = getPeds();
				for(let i in peds) {
					if(peds[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
						return [peds[i].vehicle];
					}
				}
			} else {
				if(typeof vehicles[Number(params)] != "undefined") {
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

addNetworkHandler("sb.v.sync", function(vehicleId) {
	//let vehicle = getElementFromId(vehicleId);
	//if(vehicle != null) {
	//	//resyncVehicle(vehicle);
	//}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.veh.enter", function(playerId, vehicleId, driver) {
	getElementFromId(playerId).enterVehicle(getElementFromId(vehicleId), driver);
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element) {
});

// ----------------------------------------------------------------------------

function updateVehicleSyncData(vehicle, dataIndex, value, subIndex = null) {
	//let vehicleData = vehicle.getData("sb");
	//if(vehicleData != null) {
	//	if(subIndex != null) {
	//		vehicleData[dataIndex][subIndex] = value;
	//	} else {
	//		vehicleData[dataIndex] = value;
	//	}
	//	vehicle.setData("sb", vehicleData);
	//
	//	resyncVehicle(vehicle);
	//}
}

// ----------------------------------------------------------------------------

function resyncVehicle(vehicle) {
	/*
	if(vehicle == null) {
		return false;
	}

	console.log("[Sandbox] Resyncing vehicle " + vehicle.id.toString());

	let vehicleData = vehicle.getData("sb");
	if(vehicleData == null) {
		console.log("[Sandbox] Vehicle resync for ID " + vehicle.id.toString() + " canceled. Sync data does not exist.");
		return false;
	}

	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		if(vehicleData[vehicleDataStructure.livery] != -1) {
			vehicle.livery = vehicleData[vehicleDataStructure.livery];
		}
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " livery resynced");

		if(vehicleData[vehicleDataStructure.dirtLevel] != -1) {
			vehicle.dirtLevel = vehicleData[vehicleDataStructure.dirtLevel];
		}
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " dirt level resynced");

		if(vehicleData[vehicleDataStructure.lightState] == true) {
			vehicle.setLights(1);
		}
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " light state resynced");

		if(vehicleData[vehicleDataStructure.gpsEnabled] == true) {
			vehicle.enableGPS();
		}
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " GPS state resynced");

		vehicle.setHazardLights(vehicleData[vehicleDataStructure.hazardLightState]);
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " hazard light state resynced");

		vehicle.taxiLight = vehicleData[vehicleDataStructure.taxiLight];
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " taxi light state resynced");
	}

	vehicle.siren = vehicleData[vehicleDataStructure.sirenState];
	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " siren state resynced");

	vehicle.locked = vehicleData[vehicleDataStructure.lockState];
	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " light state resynced");

	// Everything else can't be synced yet
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}

	vehicle.lights = vehicleData[vehicleDataStructure.lightState];
	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " light state resynced");

	vehicle.radioStation = vehicleData[vehicleDataStructure.radioStation];
	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " radio station resynced");

	if(vehicleData[vehicleDataStructure.handlingIndex] != -1) {
		vehicle.handlingIndex = vehicleData[vehicleDataStructure.handlingIndex];
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " handling index resynced");
	}

	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC) {
		if(vehicleData[vehicleDataStructure.cruiseSpeed] != -1) {
			vehicle.setCarCruiseSpeed(vehicleData[vehicleDataStructure.cruiseSpeed]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " cruise speed resynced");
		}

		if(vehicleData[vehicleDataStructure.cruiseSpeed] != -1) {
			vehicle.setDrivingStyle(vehicleData[vehicleDataStructure.drivingStyle]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " driving style resynced");
		}

		if(vehicleData[vehicleDataStructure.mission] != -1) {
			vehicle.setCarMission(vehicleData[vehicleDataStructure.mission]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " mission resynced");
		}

		if(vehicleData[vehicleDataStructure.wanderRandomly] == true) {
			vehicle.carWanderRandomly();
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " set to wander randomly because of resync.");
		}

		if(vehicleData[vehicleDataStructure.driveTo][0] != -1) {
			let driveToPosition = new Vec3(
				vehicleData[vehicleDataStructure.driveTo][0],
				vehicleData[vehicleDataStructure.driveTo][1],
				vehicleData[vehicleDataStructure.driveTo][2]
			);
			vehicle.driveTo(driveToPosition.x, driveToPosition.y, driveToPosition.z);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " set to drive to " + String(driveToPosition.x.toFixed(2)) + ", " + String(driveToPosition.y.toFixed(2)) + ", " + String(driveToPosition.z.toFixed(2)) + " because of resync.");
		}
	}

	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		if(vehicleData[vehicleDataStructure.paintJob] != -1) {
			vehicle.setPaintJob(Number(vehicleData[vehicleDataStructure.paintJob]));
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " paint job resynced");
		}
	}

	if(vehicle.subType == VEHICLESUBTYPE_AUTOMOBILE) {
		for(let i=0;i<vehicleData[vehicleDataStructure.lightStatus].length;i++) {
			vehicle.setLightStatus(i, vehicleData[vehicleDataStructure.lightStatus][i]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " light " + String(i) + " state resynced");
		}

		for(let i=0;i<vehicleData[vehicleDataStructure.doorStatus].length;i++) {
			vehicle.setDoorStatus(i, vehicleData[vehicleDataStructure.doorStatus][i]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " door " + String(i) + " state resynced");
		}

		for(let i=0;i<vehicleData[vehicleDataStructure.wheelStatus].length;i++) {
			vehicle.setWheelStatus(i, vehicleData[vehicleDataStructure.wheelStatus][i]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " wheel " + String(i) + " state resynced");
		}

		for(let i=0;i<vehicleData[vehicleDataStructure.panelStatus].length;i++) {
			vehicle.setPanelStatus(i, vehicleData[vehicleDataStructure.panelStatus][i]);
			console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " panel " + String(i) + " state resynced");
		}
	}

	// Scale
	if(vehicleData[vehicleDataStructure.scale] != 1.0) {
		let scaleFactor = vehicleData[vehicleDataStructure.scale];
		scaleFactor = Number(scaleFactor);
		let vehicleMatrix = vehicle.matrix;
		vehicleMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
		let vehiclePosition = vehicle.position;
		vehicle.matrix = vehicleMatrix;
		//vehiclePosition.z += vehicleData[vehicleDataStructure.scale];
		vehicle.position = vehiclePosition;
		vehicle.collisionsEnabled = false;
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " scale resynced");
	}

	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " completely resynced!");
	*/
}

// ----------------------------------------------------------------------------

function oneTimeResyncVehicle(vehicle) {
	//if(vehicle.getData("sb.v.onetimesync") == true) {
	//	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " one-time resync canceled (already synced)");
	//	return false;
	//}

	//console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " syncing with one-time resync data!");
	//let vehicleData = vehicle.getData("sb");
	//for(let i=0;i<vehicleData[vehicleDataStructure.upgrades].length;i++) {
	//	if(vehicleData[vehicleDataStructure.upgrades][i] != -1) {
	//		vehicle.addUpgrade(vehicleData[vehicleDataStructure.upgrades][i]);
	//	}
	//}
	//console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " one-time resync complete!");
	//vehicle.setData("sb.v.onetimesync", true);
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.fix", function(vehicles) {
	vehicles.forEach(function(vehicle) {
		vehicle.fix();
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.siren", function(vehicles, sirenState) {
	vehicles.forEach(function(vehicle) {
		vehicle.siren = sirenState;
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.engine", function(vehicles, engineState) {
	vehicles.forEach(function(vehicle) {
		vehicle.engine = engineState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.alarm", function(vehicles, alarmState) {
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.radio", function(vehicles, radioStation) {
	vehicles.forEach(function(vehicle) {
		vehicle.radioStation = radioStation;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.lights", function(vehicles, lightState) {
	vehicles.forEach(function(vehicle) {
		vehicle.lights = lightState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.taxilight", function(vehicles, taxiLightState) {
	vehicles.forEach(function(vehicle) {
		vehicle.taxiLight = taxiLightState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheels", function(vehicles, wheelState) {
	vehicles.forEach(function(vehicle) {
		for(let i = 0; i <= 4 ; i++) {
			vehicle.setWheelStatus(i, wheelState);
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.doors", function(vehicles, doorState) {
	vehicles.forEach(function(vehicle) {
		for(let i = 0; i <= 6 ; i++) {
			vehicle.setDoorStatus(i, doorState);
		}
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.door", function(vehicles, doorId, doorState) {
	vehicles.forEach(function(vehicle) {
		vehicle.setDoorStatus(doorId, doorState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheel", function(vehicles, wheelId, wheelState) {
	vehicles.forEach(function(vehicle) {
		vehicle.setWheelStatus(wheelId, wheelState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.health", function(vehicles, health) {
	vehicles.forEach(function(vehicle) {
		vehicle.health = health;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.horn", function(vehicles, hornState) {
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.coll", function(vehicles, collisionState) {
	vehicles.forEach(function(vehicle) {
		vehicle.collisionsEnabled = collisionState;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.locked", function(vehicles, lockState) {
	vehicles.forEach(function(vehicle) {
		vehicle.locked = locked;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.cruisespeed", function(vehicles, cruiseSpeed) {
	vehicles.forEach(function(vehicle) {
		vehicle.setCarCruiseSpeed(cruiseSpeed);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.drivingstyle", function(vehicles, drivingStyle) {
	vehicles.forEach(function(vehicle) {
		vehicle.setDrivingStyle(drivingStyle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.mission", function(vehicles, missionId) {
	vehicles.forEach(function(vehicle) {
		vehicle.setCarMission(missionId);
	});
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.livery", function(vehicles, livery) {
	vehicles.forEach(function(vehicle) {
		vehicle.livery = livery;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wander", function(vehicles) {
	vehicles.forEach(function(vehicle) {
		vehicle.carWanderRandomly();
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.driveto", function(vehicles, x, y, z) {
	vehicles.forEach(function(vehicle) {
		vehicle.driveTo(x, y, z);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.god", function(vehicles, godMode) {
	vehicles.forEach(function(vehicle) {
		//vehicle.invincible = godMode;
		vehicle.setProofs(godMode, godMode, godMode, godMode, godMode);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.add", function(vehicles, upgradeId) {
	vehicles.forEach(function(vehicle) {
		vehicle.addUpgrade(paintJobId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.del", function(vehicles, upgradeId) {
	vehicles.forEach(function(vehicle) {
		vehicle.removeUpgrade(paintJobId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.paintjob", function(vehicles, paintJobId) {
	vehicles.forEach(function(vehicle) {
		vehicle.setPaintJob(paintJobId);
	})
});

// ----------------------------------------------------------------------------

function enterVehicle(vehicle, driver) {
	localPlayer.enterVehicle(vehicle, driver);
}

// ----------------------------------------------------------------------------

function getFirstEmptySeat(vehicle) {
	for(let i=1;i<4;i++) {
		if(vehicle.getOccupant(i) == null) {
			return i;
		}
	}
}

// ----------------------------------------------------------------------------