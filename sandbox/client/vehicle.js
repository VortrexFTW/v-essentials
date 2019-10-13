"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(gta.game != GAME_GTA_IV && gta.game != GAME_GTA_IV_EFLC) {
		if(isConnected) {
			if(localPlayer != null) {
				if(localPlayer.vehicle) {
					if(localPlayer.vehicle.isSyncer) {
						if(localPlayer.vehicle.getData("sb")[vehicleDataStructure.hornState] != localPlayer.vehicle.horn) {
							triggerNetworkEvent("sb.v.horn", localPlayer.vehicle.id, localPlayer.vehicle.horn);
						}
						
						if(localPlayer.vehicle.getData("sb")[vehicleDataStructure.sirenState] != localPlayer.vehicle.siren) {
							triggerNetworkEvent("sb.v.siren", localPlayer.vehicle.id, localPlayer.vehicle.siren);
						}
					}
				}
			}
		}

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
							
							if(vehicleData[vehicleDataStructure.sirenState] == true) {
								vehicles[i].siren = true;
							} else {
								vehicles[i].siren = false;
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
		message("/" + cmdName + " <model id/name>", syntaxMessageColour);
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
		//if(getDistance(position, new Vec3(1449.19, -197.21, 55.62)) < 75) {
		//	message("Please move away from the spawn point!", errorMessageColour);
		//	return false;
		//}

		// Make sure there aren't too many other vehicles nearby
		if(getVehiclesInRange(position, 50.0).length >= 25) {
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
		//if(getDistance(position, new Vec3(-379.16, -535.27, 17.28)) < 75) {
		//	message("You are too close to the spawn area to add a vehicle!", errorMessageColour);
		//	return false;
		//}		

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
	
	if(isConnected) { // && game.game != GAME_GTA_IV && game.game != GAME_GTA_IV_EFLC) {
		triggerNetworkEvent("sb.v.add", modelId, position.x, position.y, position.z, heading);
		return true;
	} else {
		let thisVeh = createVehicle(modelId, position);
		if(!thisVeh) {
			message("The vehicle could not be added!", errorMessageColour);
			return false;
		}
		thisVeh.heading = heading;
		modelId = thisVeh.modelIndex;
		createDefaultVehicleData(thisVeh);
		
		message("You have spawned a " + getVehicleNameFromModelId(modelId, gta.game), gameAnnounceColour);			
	}
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

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.fix", vehicles[i].id);
		} else {
			vehicles[i].fix();
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicles have been repaired", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " has been repaired", gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_id", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/veh_id <vehicle>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s ID is " + String(vehicles[0].id), gameAnnounceColour);
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

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	// Need this before so the strings can be had
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicles have been deleted", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " has been deleted", gameAnnounceColour);
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.del", vehicles[i].id);
		} else {
			destroyElement(vehicles[i]);
		}
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
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.siren", vehicles[i].id, !!sirenState);
		} else {
			vehicles[i].siren = !!sirenState;
			vehicles[i].setData("sb.v.siren", !!sirenState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's sirens are now " + String((!!sirenState) ? "on" : "off"), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s siren is now " + String((!!sirenState) ? "on" : "off"), gameAnnounceColour);
	}
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
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.alarm", vehicles[i].id, !!alarmState);
		} else {
			vehicles[i].alarm = !!alarmState;
			vehicles[i].setData("sb.v.alarm", !!alarmState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's alarms are now " + String((!!alarmState) ? "on" : "off"), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s alarm is now " + String((!!alarmState) ? "on" : "off"), gameAnnounceColour);
	}
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
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
		
	if(upgradeId == false) {
		message("That upgrade does not exist!", errorMessageColour);
		return false;
	}				
	
	console.log(upgradeId);
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.upgrade.add", vehicles[i].id, Number(upgradeId));
		} else {
			vehicles[i].addUpgrade(Number(upgradeId));
			let newUpgradesArray = vehicle.getData("sb")[vehicleDataStructure.upgrades].push(Number(upgradeId));
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.upgrades, newUpgradesArray);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's have been upgraded with " + String(vehicleUpgradeNames[Number(upgradeId)]), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " has been upgraded with " + String(vehicleUpgradeNames[Number(upgradeId)]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_downgrade", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_downgrade <vehicle> <upgrade id/name>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let upgradeId = getVehicleUpgradeIdFromParams(splitParams[1]);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
		
	if(upgradeId == false) {
		message("That upgrade does not exist!", errorMessageColour);
		return false;
	}		
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.upgrade.del", vehicles[i].id, upgradeId);
		} else {
			vehicles[i].removeUpgrade(Number(upgradeId));
			let newUpgradesArray = vehicle.getData("sb")[vehicleDataStructure.upgrades].filter(upgrade => upgrade == Number(upgradeId));
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.upgrades, newUpgradesArray);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's " + String(vehicleUpgradeNames[upgradeId]) + " upgrades have been removed", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + String(vehicleUpgradeNames[upgradeId]) + " upgrades have been removed", gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_paintjob", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_paintjob <vehicle> <paintjob id>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let paintJobId = splitParams[1] || 3;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.paintjob", vehicles[i].id, Number(paintJobId));
		} else {
			vehicles[i].setPaintJob(modId);
			vehicles[i].setData("sb.v.paintjob", vehicles[i].id, Number(paintJobId));
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's paintjobs have been set to " + String(paintJobId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s paintjob has been set to " + String(paintJobId), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_horn", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_horn <vehicle> <0/1 horn state>", syntaxMessageColour);
		return false;		
	}	 
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let hornState = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.horn", vehicles[i].id, !!hornState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.hornState, !!hornState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's horns are now " + String((!!hornState) ? "on" : "off"), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s horn is now " + String((!!hornState) ? "on" : "off"), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_locked", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_locked <vehicle> <0/1 lock state>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lockState = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.locked", vehicles[i].id, !!lockState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.lockState, !!lockState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's doors are now " + String((!!lockState) ? "locked" : "unlocked"), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s doors are now " + String((!!lockState) ? "locked" : "unlocked"), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_engine", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_engine <vehicle> <0/1 engine state>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let engineState = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.engine", vehicles[i].id, !!engineState);
		} else {		
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.engineState, !!engineState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's engines are now " + String((!!engineState) ? "on" : "off"), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s engine is now " + String((!!engineState) ? "on" : "off"), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_sb_data", function(cmdName, params) {	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_sb_data <vehicle> <name> [new value]", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let dataName = splitParams[1] || "health";
	let newValue = splitParams[2];
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s vehicle's sandbox data '" + dataName + "' is " + vehicles[0].getData('sb')[vehicleDataStructure[dataName]].toString(), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_data", function(cmdName, params) {	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_data <vehicle> <name> [new value]", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let dataName = splitParams[1] || "health";
	let newValue = splitParams[2];
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s vehicle's data '" + String(dataName) + "' is " + String(vehicles[0].getData(dataName)), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_light", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_light <vehicle> <light id> <state>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lightId = (Number(splitParams[1]) || 0);
	let lightState = (Number(splitParams[2]) || 0)
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.light", vehicles[i].id, lightId, !!lightState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.lightStatus, !!lightState, lightId);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's " + vehicleLightNames[lightId] + " lights are now " + String((!!lightState) ? "on" : "off"), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleLightNames[lightId] + " light is now " + String((!!lightState) ? "on" : "off"), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_panel", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_panel <vehicle> <panel id> <state>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let panelId = Number(splitParams[1]) || 0;
	let panelState = Number(splitParams[2]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.panel", vehicles[i].id, panelId, panelState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.panelStatus, panelState, panelId);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's panel " + panelId + " are now at state " + panelState, gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s panel " + vehiclePanelNames[panelId] + " is now at state " + panelState, gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_door", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_door <vehicle> <door id> <state>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let doorId = Number(splitParams[1]) || 0;
	let doorState = Number(splitParams[2]) || vehicles[i].getDoorStatus(doorId);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.door", vehicles[i].id, doorId, doorState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.doorStatus, doorState, panelId);
		}
	}
	
	message("The vehicle(s) " + vehicleDoorNames[doorId] + " door is now " + vehicleDoorStateNames[doorState].toLowerCase(), gameAnnounceColour);
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's " + vehicleDoorNames[doorId] + " doors are now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleDoorNames[doorId] + " door is now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wheel", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_wheel <vehicle> <wheel id> <state>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let wheelId = (Number(splitParams[1]) || 0);
	let wheelState = (Number(splitParams[2]) || 0);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.wheel", vehicles[i].id, wheelId, wheelState);
		} else {	
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.wheelStatus, wheelState, wheelId);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's " + vehicleWheelNames[wheelId] + " wheel are now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s " + vehicleWheelNames[wheelId] + " wheel is now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wheels", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_wheels <vehicle> <0/1/2 wheel state>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let wheelState = (Number(splitParams[1]) || 0);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.wheels", vehicles[i].id, wheelState);
		} else {		
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.wheelsState, wheelState);
		}
	}

	message("The vehicle(s) wheels are now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's wheels are now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s wheels are now " + vehicleWheelStateNames[wheelState].toLowerCase(), gameAnnounceColour);
	}		
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_doors", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_doors <vehicle> <0/1/2 wheel state>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let doorState = (Number(splitParams[1]) || 0);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.doors", vehicles[i].id, doorState);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.doorsState, doorState);
		}
	}

	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's doors are now " + vehicleDoorStateNames[doorState], gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s doors are now " + vehicleDoorStateNames[doorState], gameAnnounceColour);
	}		
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_god", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_god <vehicle> <0/1 state>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let godMode = (Number(splitParams[1]) || 1);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.god", vehicles[i].id, !!godMode);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.godMode, !!godMode);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's god modes have been turned " + String((!!godMode) ? "on" : "off" ), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s god mode has been turned " + String((!!godMode) ? "on" : "off" ), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_syncer", function(cmdName, params) {
	if(!isConnected) {
		message("This command cannot be used offline!", errorMessageColour);
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_syncer <vehicle> <player name>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let clientName = splitParams[1] || localClient.name;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.syncer", vehicles[i].id, clientName);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_lights", function(cmdName, params) {	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_lights <vehicle> <0/1 light state>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let lightState = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.lights", vehicles[i].id, !!lightState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.lightsState, !!lightState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's lights have been turned " + String((!!lightState) ? "on" : "off" ), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s lights have been turned " + String((!!lightState) ? "on" : "off" ), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_taxilight", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_taxilight <vehicle> <0/1 light state>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let taxiLightState = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.taxilight", vehicles[i].id, !!taxiLightState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.taxiLight, !!taxiLightState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's taxi lights have been turned " + String((!!taxiLightState) ? "on" : "off" ), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s taxi light has been turned " + String((!!taxiLightState)? "on" : "off" ), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_hazardlights", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_hazardlights <vehicle> <0/1 light state>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let hazardLightState = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.hazardlights", vehicles[i].id, !!hazardLightState);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.hazardLightState, !!hazardLightState);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's hazard lights have been turned " + String((!!hazardLightState) ? "on" : "off" ), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s hazard light has been turned " + String((!!hazardLightState)? "on" : "off" ), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_dirtlevel", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_dirtlevel <vehicle> <dirt level>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let dirtLevel = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.dirtlevel", vehicles[i].id, dirtLevel);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.dirtLevel, dirtLevel);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's dirt levels have been set to " + String(dirtLevel), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s dirt level has been set to " + String(dirtLevel), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_radio", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_radio <vehicle> <radio station id>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let radioStation = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.radio", vehicles[i].id, radioStation);
		} else {		
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.radioStation, radioStation);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's radio stations have been set to " + vehicleRadioStationNames[game.game][radioStation], gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s radio station has been set to " + vehicleRadioStationNames[game.game][radioStation], gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_mission", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_mission <vehicle> <mission id>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let missionId = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.mission", vehicles[i].id, missionId);
		} else {		
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.mission, missionId);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's missions have been set to " + String(missionId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s mission has been set to " + String(missionId), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_rgb", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_rgba <vehicle> <red> <blue> <green> <alpha>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let red = Number(splitParams[1]) || 0;
	let green = Number(splitParams[2]) || 0;
	let blue = Number(splitParams[3]) || 0;
	let alpha = Number(splitParams[4]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.colourrgb", vehicles[i].id, red, green, blue, alpha);
		} else {	
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.rgbColour1, [red, green, blue, alpha]);
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.rgbColour2, [red, green, blue, alpha]);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's RGB colours have been set to " + String(red) + ", " + String(green) + ", " + String(blue) + ", " + String(alpha), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s RGB colours have been set to " + String(red) + ", " + String(green) + ", " + String(blue) + ", " + String(alpha), gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour1", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_colour1 <vehicle> <colour Id>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.colour1", vehicles[i].id, colourId);
		} else {
			let currentColours = vehicles[i].getData("sb")[vehicleDataStructure.colour];
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.colour, [colourId, currentColours[1], currentColours[2], currentColours[3]]);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's primary colours have been set to " + String(colourId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s primary colour has been set to " + String(colourId), gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour2", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_colour2 <vehicle> <colour Id>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.colour2", vehicles[i].id, colourId);
		} else {	
			let currentColours = vehicles[i].getData("sb")[vehicleDataStructure.colour];
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.colour, [currentColours[0], colourId, currentColours[2], currentColours[3]]);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's secondary colours have been set to " + String(colourId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s secondary colour has been set to " + String(colourId), gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour3", function(cmdName, params) {
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_colour3 <vehicle> <colour id>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.colour3", vehicles[i].id, colourId);
		} else {	
			let currentColours = vehicles[i].getData("sb")[vehicleDataStructure.colour];
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.colour, [currentColours[0], currentColours[1], colourId, currentColours[3]]);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's secondary colours have been set to " + String(colourId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s secondary colour has been set to " + String(colourId), gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_colour4", function(cmdName, params) {
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_colour4 <vehicle> <colour Id>", syntaxMessageColour);
		return false;		
	}

	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let colourId = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.colour4", vehicles[i].id, colourId);
		} else {	
			let currentColours = vehicles[i].getData("sb")[vehicleDataStructure.colour];
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.colour, [currentColours[0], currentColours[1], currentColours[2], colourId]);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's secondary colours have been set to " + String(colourId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s secondary colour has been set to " + String(colourId), gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_collisions", function(cmdName, params) {	
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_collisions <vehicle> <0/1>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let collisionState = Number(splitParams[1] || 1);	
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
		
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.coll", vehicles[i].id, (collisionState == 1) ? true : false);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.collisionsEnabled, (collisionState == 1) ? true : false);
		}
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.cruisespeed", vehicles[i].id, cruiseSpeed);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.cruiseSpeed, cruiseSpeed);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's collisions have been turned " + String((collisionState) ? "on" : "off" ), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s collisions have been turned " + String((collisionState) ? "on" : "off" ), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_cruisespeed", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_cruisespeed <vehicle> <speed>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let cruiseSpeed = Number(splitParams[1]) || 14.0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.cruisespeed", vehicles[i].id, cruiseSpeed);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.cruiseSpeed, cruiseSpeed);
		}
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.cruisespeed", vehicles[i].id, cruiseSpeed);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.cruiseSpeed, cruiseSpeed);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's will now cruise at " + String(cruiseSpeed) + " mph", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " will now cruise at " + String(cruiseSpeed) + " mph", gameAnnounceColour);
	}		
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_drivingstyle", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_drivingstyle <vehicle> <style Id>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let drivingStyle = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.drivingstyle", vehicles[i].id, drivingStyle);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.drivingStyle, drivingStyle);
		}
	}

	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's driving styles have been set to " + String(drivingStyle), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s driving style has been set to " + String(drivingStyle), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_livery", function(cmdName, params) {
	if(gta.game != GAME_GTA_IV && gta.game != GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_livery <vehicle> <livery Id>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let liveryId = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.livery", vehicles[i].id, liveryId);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.livery, liveryId);
		}
	}

	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's livery designs have been set to " + String(liveryId), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s livery design has been set to " + String(liveryId), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_handling", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_handling <vehicle> <handling Id>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let handlingIndex = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.handling", vehicles[i].id, handlingIndex);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.handlingIndex, handlingIndex);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's handling indexes have been set to " + String(handlingIndex), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s handling index has been set to " + String(handlingIndex), gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_driveto", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_driveto <vehicle> <x> <y> <z>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let x = Number(splitParams[1]) || 0.0;
	let y = Number(splitParams[1]) || 0.0;
	let z = Number(splitParams[1]) || 0.0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.driveto", vehicles[i].id, x, y, z);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.driveTo, [x, y, z]);
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.wanderRandomly, false);
		}
	}	
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicles will now drive to " + String(x) + ", " + String(y) + ", " + String(z), gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " will now drive to " + String(x) + ", " + String(y) + ", " + String(z), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_scale", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_scale <vehicle> <scale>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let scale = Number(splitParams[1]) || 0.0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.scale", vehicles[i].id, scale);
		} else {
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.scale, scale);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's scales have been updated.", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s scale has been updated", gameAnnounceColour);
	}	
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_wander", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_wander <vehicle>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		if(isConnected && !vehicles[i].isLocal) {
			triggerNetworkEvent("sb.v.wander", vehicles[i].id);
		} else {			
			updateVehicleSyncData(vehicles[i], vehicleDataStructure.wanderRandomly, true);
		}
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's will now drive around aimlessly (if they have a civilian driver).", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " will now drive around aimlessly (if they have a civilian driver).", gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("veh_resync", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /veh_resync <vehicle>", syntaxMessageColour);
		return false;		
	}
	
	let splitParams = params.split(" ");
	let vehicles = getVehiclesFromParams(splitParams[0]);
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}
	
	for(let i in vehicles) {
		resyncVehicle(vehicles[i]);
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " vehicle's have been resynced.", gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " has been resynced", gameAnnounceColour);
	}	
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
	let vehicle = getElementFromId(vehicleId);
	if(vehicle != null) {
		resyncVehicle(vehicle);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.veh.enter", function(playerId, vehicleId, driver) {
	getElementFromId(playerId).enterVehicle(getElementFromId(vehicleId), driver);
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element) {
	if(element.type == ELEMENT_VEHICLE) {
		resyncVehicle(element);
		oneTimeResyncVehicle(element);
	}
});

// ----------------------------------------------------------------------------

function updateVehicleSyncData(vehicle, dataIndex, value, subIndex = null) {
	let vehicleData = vehicle.getData("sb");
	if(vehicleData != null) {
		if(subIndex != null) {
			vehicleData[dataIndex][subIndex] = value;
		} else {
			vehicleData[dataIndex] = value;
		}
		vehicle.setData("sb", vehicleData);
		
		resyncVehicle(vehicle);
	}
}

// ----------------------------------------------------------------------------

function resyncVehicle(vehicle) {
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
}

// ----------------------------------------------------------------------------

function oneTimeResyncVehicle(vehicle) {
	if(vehicle.getData("sb.v.onetimesync") == true) {
		console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " one-time resync canceled (already synced)");
		return false;
	}

	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " syncing with one-time resync data!");
	let vehicleData = vehicle.getData("sb");
	for(let i=0;i<vehicleData[vehicleDataStructure.upgrades].length;i++) {
		if(vehicleData[vehicleDataStructure.upgrades][i] != -1) {
			vehicle.addUpgrade(vehicleData[vehicleDataStructure.upgrades][i]);
		}
	}
	console.log("[Sandbox] Vehicle " + vehicle.id.toString() + " one-time resync complete!");
	vehicle.setData("sb.v.onetimesync", true);
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.fix", function(vehicle) {
	getElementFromId(vehicle).fix();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.siren", function(vehicle, sirenState) {
	if(sirenState == true) {
		getElementFromId(vehicle).setData("sb.v.siren", true);
		getElementFromId(vehicle).siren = sirenState;
	} else {
		getElementFromId(vehicle).removeData("sb.v.siren");
		getElementFromId(vehicle).siren = sirenState;
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.engine", function(vehicle, engineState) {
	getElementFromId(vehicle).engine = engineState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.alarm", function(vehicle, alarmState) {
	getElementFromId(vehicle).alarm = false;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.radio", function(vehicle, radioStation) {
	getElementFromId(vehicle).radioStation = radioStation;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.lights", function(vehicle, lightState) {
	getElementFromId(vehicle).lights = lightState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.taxilight", function(vehicle, taxiLightState) {
	getElementFromId(vehicle).taxiLight = taxiLightState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheels", function(vehicle, wheelState) {
	for(let i = 0; i <= 4 ; i++) {
		getElementFromId(vehicle).setWheelStatus(i, wheelState);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.doors", function(vehicle, doorState) {
	for(let i = 0; i <= 6 ; i++) {
		getElementFromId(vehicle).setDoorStatus(i, doorState);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.door", function(vehicle, doorId, doorState) {
	getElementFromId(vehicle).setDoorStatus(doorId, doorState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheel", function(vehicle, wheelId, wheelState) {
	getElementFromId(vehicle).setWheelStatus(wheelId, wheelState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.health", function(vehicle, health) {
	getElementFromId(vehicle).health = health;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.horn", function(vehicle, hornState) {
	if(hornState) {
		getElementFromId(vehicle).setData("sb.v.horn", hornState);
	} else {
		getElementFromId(vehicle).removeData("sb.v.horn");
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.coll", function(vehicle, collisionState) {
	console.log(collisionState);
	getElementFromId(vehicle).collisionsEnabled = collisionState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.locked", function(vehicle, lockState) {
	getElementFromId(vehicle).locked = lockState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.cruisespeed", function(vehicle, cruiseSpeed) {
	getElementFromId(vehicle).setCarCruiseSpeed(cruiseSpeed);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.drivingstyle", function(vehicle, drivingStyle) {
	getElementFromId(vehicle).setDrivingStyle(drivingStyle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.mission", function(vehicle, missionId) {
	getElementFromId(vehicle).setCarMission(missionId);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.livery", function(vehicle, livery) {
	getElementFromId(vehicle).livery = livery;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wander", function(vehicle) {
	getElementFromId(vehicle).carWanderRandomly();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.driveto", function(vehicle, x, y, z) {
	getElementFromId(vehicle).driveTo(x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.god", function(vehicle, godMode) {
	getElementFromId(vehicle).setProofs(godMode, godMode, godMode, godMode, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.add", function(vehicleId, upgradeId) {
	getElementFromId(vehicleId).setData("sb.v.onetimesync", true);
	console.log("[Sandbox] Adding upgrade " + vehicleUpgradeNames[upgradeId] + " (" + String(upgradeId) + ") to vehicle " + vehicleId);
	getElementFromId(vehicleId).addUpgrade(upgradeId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.del", function(vehicleId, upgradeId) {
	getElementFromId(vehicleId).setData("sb.v.onetimesync", true);
	console.log("[Sandbox] Removing upgrade " + vehicleUpgradeNames[upgradeId] + " (" + String(upgradeId) + ") from vehicle " + vehicleId);
	getElementFromId(vehicleId).removeUpgrade(upgradeId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.paintjob", function(vehicle, paintJobId) {
	getElementFromId(vehicle).setPaintJob(paintJobId);
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