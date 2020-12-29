"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	getCivilians().forEach(function(civilian) {
		updateCivilianMovement(civilian);
	});
});

let canSpawnCivilian = true;

// ----------------------------------------------------------------------------

function updateCivilianMovement(civilian) {
	if(!customCiviliansEnabled[gta.game]) {
		return false;
	}
	
	if(civilianFollowEnabled[gta.game]) {
		if(civilian.getData("sb.c.following")) {
			let following = civilian.getData("sb.c.following");
			if(following != null) {
				if(civilian.isInVehicle) {
					if(following.isType(ELEMENT_PLAYER) || following.isType(ELEMENT_CIVILIAN)) {
						if(following.vehicle) {
							if(civilian.vehicle != following.vehicle) {
								civilian.exitVehicle();
								civilian.enterVehicle(following.vehicle, (following.vehicle.getOccupant(0) == null) ? true : false);
							}
						} else {
							civilian.exitVehicle();
						}
					} else {
						civilian.exitVehicle();
					}
				} else {
					if(following.isType(ELEMENT_PLAYER) || following.isType(ELEMENT_CIVILIAN)) {
						if(following.vehicle) {
							civilian.enterVehicle(following.vehicle, (following.vehicle.getOccupant(0) == null) ? true : false);
						}
					} else {
						if(following.isType(ELEMENT_VEHICLE)) {
							civilian.enterVehicle(following, (following.getOccupant(0) == null) ? true : false);
						}
					}
				}

				if(following.position.distance(civilian.position) <= civilianFollowStopDistance[gta.game]) {
					civilian.walkTo(civilian.position);
				} else {
					if(following.position.distance(civilian.position) > civilianFollowRunDistance[gta.game]) {
						if(game.game >= GAME_GTA_VC) {
							if(following.position.distance(civilian.position) > civilianFollowSprintDistance[gta.game]) {
								civilian.sprintTo(following.position);
							} else {
								civilian.runTo(following.position);
							}
						} else {
							civilian.runTo(following.position);
						}
					} else {
						civilian.walkTo(following.position);
					}
				}
			} else {
				console.error("Ped " + String(civilian.id) + "'s entity following data is set, but the entity could not be found. Removing data.");
				triggerNetworkEvent("sb.c.stopfollowing", civilian);
			}
		}
	}

	if(civilianFacingEnabled[gta.game]) {
		if(civilian.getData("sb.c.facing") != null) {
			let facingPlayer = civilian.getData("sb.c.facing");
			if(facingPlayer != null) {
				civilian.heading = getHeadingFromPosToPos(facingPlayer.position, facingPlayer.position);
			} else {
				console.error("Ped " + String(civilian.id) + "'s entity facing data is set, but the entity doesn't exist. Removing data.");
				triggerNetworkEvent("sb.c.stopfacing", civilian);
			}
		}
	}
}

// ----------------------------------------------------------------------------

function updateCivilianScale(civilian) {
	if(civilian.getData("sb.c.scale") != null) {
		if(civilian.getData("sb.c.scale") != -1) {
			let scaleFactor = Number(civilian.getData("sb.c.scale"));
			let civilianMatrix = civilian.matrix;
			civilianMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
			let civilianPosition = civilian.position;
			civilian.matrix = civilianMatrix;
			civilian.position = new Vec3(civilianPosition.x, civilian.Position.y, civilianPosition.z+Math.round(scaleFactor));
		}
	}
}

// ----------------------------------------------------------------------------

addCommandHandler("ped", function(cmdName, params) {
	//if(isConnected && gta.game < GAME_GTA_IV) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Peds are disabled on this server!", errorMessageColour);
	//		return false;
	//	}
	//}
	
	if(!canSpawnCivilian) {
		message("Please wait before spawning another ped!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <skin id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let skinId = getSkinIdFromParams(splitParams[0], gta.game);
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	let heading = localPlayer.heading;
	
	// Make sure there aren't too many other peds nearby
	if(getCiviliansInRange(position, 50.0).length >= 20) {
		message("There are already enough peds in the area!", errorMessageColour);
		return false;
	}	

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.add", skinId, position, heading);
	} else {
		let tempCiv = gta.createCivilian(skinId);

		if(!tempCiv) {
			message("The civilian could not be added!", errorMessageColour);
			return false;
		}

		tempCiv.position = position;
		tempCiv.heading = heading;
	}
	
	let outputText = "spawned a " + getSkinNameFromId(skinId, gta.game) + " ped.";
	outputSandboxMessage(outputText);
	
	canSpawnCivilian = false;
	setTimeout(function() { canSpawnCivilian = true; }, 15000);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("pedline", function(cmdName, params) {
	//if(isConnected && gta.game < GAME_GTA_IV) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Peds are disabled on this server!", errorMessageColour);
	//		return false;
	//	}
	//}

	if(!canSpawnCivilian) {
		message("Please wait before spawning another ped!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <skin id> <amount> [gap]", syntaxMessageColour);
		return false;
	}

	let group = [ ];
	let splitParams = params.split(" ");

	let skinId = (Number(splitParams[0]) || 0);
	let amount = (Number(splitParams[1]) || 8);
	let gap = (Number(splitParams[2]) || 2);
	let tempCiv = null;
	
	// Make sure there aren't too many other peds nearby
	if((getCiviliansInRange(position, 50.0).length >= 25) && !client.administrator) {
		message("There are already enough peds in the area!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		for(let i=1;i<=amount;i++){
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i*gap);
			let heading = localPlayer.heading;
			triggerNetworkEvent("sb.c.add", skinId, position.x, position.y, position.z, heading, false);
		}
	} else {
		for(let i=1;i<=amount;i++) {
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i*gap);
			let heading = localPlayer.heading;
			tempCiv = createCivilian(skinId);
			tempCiv.position = position;
			tempCiv.heading = position;
		}
	}
	
	let outputText = "spawned a line of " + String(amount) + " " + getSkinNameFromParams(skinId, gta.game) + " peds, spaced apart by " + String(gap) + " meters";
	outputSandboxMessage(outputText);	
	
	canSpawnCivilian = false;
	setTimeout(function() { canSpawnCivilian = true; }, 15000);	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("pedgrid", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <skin id> <columns> <rows> [column gap] [row gap]", syntaxMessageColour);
		return false;
	}

	if(!canSpawnCivilian) {
		message("Please wait before spawning another ped!", errorMessageColour);
		return false;
	}

	let group = [ ];
	let splitParams = params.split(" ");

	let skinId = (Number(splitParams[0]) || 0);
	let cols = (Number(splitParams[1]) || 4);
	let rows = (Number(splitParams[2]) || 2);
	let colGap = (Number(splitParams[3]) || 2);
	let rowGap = (Number(splitParams[4]) || 3);
	let tempCiv = null;

	if(isConnected && gta.game < GAME_GTA_IV) {
		for(let k=1;k<=cols;k++) {
			for(let i=1;i<=rows;i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading,k*rowGap), localPlayer.heading, i*colGap);
				let heading = localPlayer.heading;
				triggerNetworkEvent("sb.c.add", skinId, position.x, position.y, position.z, heading, false);
			}
		}
	} else {
		for(let k=1;k<=cols;k++) {
			for(let i=1;i<=rows;i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading,k*rowGap), localPlayer.heading, i*colGap);
				let heading = localPlayer.heading;
				tempCiv = gta.createCivilian(skinId);
				tempCiv.position = position;
				tempCiv.heading = position;
			}
		}
	}
	
	let outputText = "spawned a " + String(cols) + "x" + String(rows) + " grid of " + getSkinNameFromParams(skinId, gta.game) + " peds, spaced apart by " + String(colGap) + "x" + String(rowGap) + " meters. Total: " + String(cols*rows);
	outputSandboxMessage(outputText);
	
	canSpawnCivilian = false;
	setTimeout(function() { canSpawnCivilian = true; }, 15000);	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_wander", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <wander path>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let wanderPath = Number(splitParams[1]) || 0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.wander", civilians, wanderPath);
	} else {
		civilians.forEach(function(civilian) {
			makeCivilianWander(civilians[i], wanderPath);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " civilians to wander on path " + String(wanderPath);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " to wander on path " + String(wanderPath);
	}
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_delete", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let stayState = Number(splitParams[1]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.del", civilians);
	} else {
		civilians.forEach(function(civilian) {
			deleteCivilian(civilians[i]);
		});
	}

	if(civilians.length > 1) {
		outputText = "deleted " + String(civilians.length) + " peds.";
	} else {
		outputText = "deleted a " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_stay", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <state>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let stayState = Number(splitParams[1]);

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.stay", civilians, !!stayState);
	} else {
		civilians.forEach(function(civilian) {
			setCivilianStayInSamePlace(civilians[i], !!stayState);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " civilians to " + (stayState) ? "stay in the same place" : " not stay in the same place";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " to " + (stayState) ? "stay in the same place" : " not stay in the same place";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_stamina", function(cmdName, params) {
	if(isConnected && gta.game < GAME_GTA_IV) {
		if(!civiliansEnabled[gta.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <stamina>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let stamina = Number(splitParams[1]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.stamina", civilians, stamina);
	} else {
		civilians.forEach(function(civilian) {
			setCivilianStamina(civilians[i], stamina);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " civilians stamina to " + String(stamina);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " stamina to " + String(stamina);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_enterveh", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <vehicle> [driver 0/1]", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let driver = Number(splitParams[1]) || 1;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.enterveh", civilians, vehicles[0], !!driver);
	} else {
		civilians.forEach(function(civilian) {
			civilian.enterVehicle(vehicles[0], !!driver);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to enter " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to enter " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_lookatveh", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let duration = Number(splitParams[1]) || 5000;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.lookat", civilians, vehicles[0].position.x, vehicles[0].position.y, vehicles[0].position.z, duration);
	} else {
		civilians.forEach(function(civilian) {
			civilian.lookAt(vehicles[0].position, duration);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to look at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to look at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_exitveh", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.exitveh", civilians);
	} else {
		civilians.forEach(function(civilian) {
			setCivilianStamina(civilians[i], stamina);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to exit their vehicle";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to exit its vehicle";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_staminadur", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("Ped stamina does not work on GTA 3!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		if(!civiliansEnabled[gta.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <duration>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let staminaDuration = Number(splitParams[1]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.stamina", civilians, staminaDuration);
	} else {
		civilians.forEach(function(civilian) {
			civilian.staminaDuration = staminaDuration;
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds stamina to " + String(stamina);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's stamina to " + String(stamina);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_torsorot", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("Ped torso rotation does not work on GTA 3!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		if(!civiliansEnabled[gta.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <rotation>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let rotation = Number(splitParams[1]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.torsorot", civilians, rotation);
	} else {
		civilians.forEach(function(civilian) {
			civilian.torsoRotation = rotation;
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds torso rotation to " + String(rotation);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's torso rotation to " + String(rotation);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_walkstyle", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <rotation>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let walkStyle = Number(splitParams[1]) || 1;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.walkstyle", civilians, walkStyle);
	} else {
		civilians.forEach(function(civilian) {
			civilian.walkStyle = walkStyle;
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds walk style to " + String(walkStyle);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's walk style to " + String(walkStyle);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_armour", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <rotation>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let armour = Number(splitParams[1]) || 100;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.armour", civilians, armour);
	} else {
		civilians.forEach(function(civilian) {
			civilian.armour = armour;
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds armour to " + String(armour);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's armour to " + String(armour);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_warpinveh", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let seatId = Number(splitParams[2]) || 0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.warpintoveh", civilians, vehicles[0], seatId);
	} else {
		civilians.forEach(function(civilian) {
			civilian.warpIntoVehicle(civilians[i], vehicles[0], seatId);
		});
	}

	if(civilians.length > 1) {
		outputText = "warped " + String(civilians.length) + " peds into the " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " vehicle in the " + seatNames[seatId].toLowerCase() + " seat";
	} else {
		outputText = "warped " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped into the " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " vehicle in the " + seatNames[seatId].toLowerCase() + " seat";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_syncer", function(cmdName, params) {
	if(!isConnected) {
		message("This command cannot be used offline!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <client>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let clientName = splitParams[1] || localClient.name;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.syncer", civilians, clientName);
	}
	
	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds syncer to " + getClientFromParams(clientName).name;
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's syncer to " + getClientFromParams(clientName).name;
	}

	outputSandboxMessage(outputText);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_health", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <rotation>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let armour = Number(splitParams[1]) || 100;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.armour", civilians, armour);
	} else {
		civilians.forEach(function(civilian) {
			civilian.armour = armour;
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds health to " + String(health);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's health to " + String(health);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_jump", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <distance>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.jump", civilians);
	} else {
		civilians.forEach(function(civilian) {
			civilian.jumping = true;
		});
	}

	if(civilians.length > 1) {
		outputText = "forced " + String(civilians.length) + " peds to jump";
	} else {
		outputText = "forced " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to jump";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_walkfwd", function(cmdName, params) {
	//if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
	//	message("This feature is not available in San Andreas!", errorMessageColour);
	//	return false;
	//}	

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <distance>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.walkfwd", civilians, distance);
	} else {
		civilians.forEach(function(civilian) {
			let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
			makeCivilianWalkTo(civilians[i], position.x, position.y, position.z);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to walk forward " + String(distance) + " meters.";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to walk forward " + String(distance) + " meters.";
	}

	outputSandboxMessage(outputText);
	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("ped_runfwd", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <distance>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.runfwd", civilians, distance);
	} else {
		civilians.forEach(function(civilian) {
			let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
			makeCivilianRunTo(civilians[i], position.x, position.y, position.z);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to run forward " + String(distance) + " meters.";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to run forward " + String(distance) + " meters.";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_sprintfwd", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("Civilian sprint is not supported in GTA 3!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		if(!civiliansEnabled[gta.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <distance>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.sprintfwd", civilians, distance);
	} else {
		civilians.forEach(function(civilian) {
			let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
			makeCivilianSprintTo(civilians[i], position.x, position.y, position.z)
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to sprint forward " + String(distance) + " meters.";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to sprint forward " + String(distance) + " meters.";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_follow", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <player name/id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1] || localClient.index;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.follow", civilians, localPlayer);
	} else {
		civilians.forEach(function(civilian) {
			civilian.setData("sb.c.following", localPlayer);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to follow " + String((playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : getClients()[playerId].name);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to follow " + String((playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : getClients()[playerId].name)
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_defendme", function(cmdName, params) {
	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		message("This feature is not available in San Andreas!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1];

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.defend", civilians, playerId);
	} else {
		civilians.forEach(function(civilian) {
			civilian.setData("sb.c.defending", true);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to defend " + (playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : String(getClients()[playerId].name);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to defend " + (playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : String(getClients()[playerId].name);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_gun", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <weapon> [ammo] [hold]", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let weaponId = Number(splitParams[1]) || 1;
	let ammo = Number(splitParams[2]) || 100;
	let holdGun = Number(splitParams[3]) || 1;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.gun", civilians, weaponId, ammo, !!holdGun);
	} else {
		civilians.forEach(function(civilian) {
			civilian.giveWeapon(weaponId, ammo, !!holdGun);
		});
	}

	if(civilians.length > 1) {
		let weaponAmmoOutput = String(getWeaponName(weaponId, gta.game)) + "'s with " + String(ammo) + " ammo";
		if(!isAmmoWeapon(weaponId, gta.game)) {
			weaponAmmoOutput = String(getWeaponName(weaponId, gta.game)) + "s";
		}
		outputText = "gave " + String(civilians.length) + " peds " + weaponAmmoOutput;
	} else {
		let weaponAmmoOutput = "a " + String(getWeaponName(weaponId, gta.game)) + " with " + String(ammo) + " ammo";
		if(!isAmmoWeapon(weaponId, gta.game)) {
			weaponAmmoOutput = "a " + String(getWeaponName(weaponId, gta.game));
		}		
		outputText = "gave " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped " + weaponAmmoOutput;
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_scale", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <scale>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let scaleFactor = Number(splitParams[1]) || 1.0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.scale", civilians, scaleFactor);
	} else {
		civilians.forEach(function(civilian) {
			civilian.setData("sb.c.scale", scaleFactor);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds scale to " + String(scaleFactor);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's scale to " + String(scaleFactor)
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_stats", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <civ group> <stat>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let statName = splitParams[1] || "player";
	let statId = STAT_PLAYER;
	let statInfo = "normal people";

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	switch(statName.toLowerCase()) {
		case "cop":
			statId = STAT_COP;
			statInfo = "cops";
			break;

		case "medic":
			statId = STAT_MEDIC;
			statInfo = "paramedics";
			break;

		case "fireman":
			statId = STAT_MEDIC;
			statInfo = "firefighters";
			break;

		case "gang1":
			statId = STAT_GANG1;
			statInfo = "gang members";
			break;

		case "gang2":
			statId = STAT_GANG2;
			statInfo = "gang members";
			break;

		case "gang3":
			statId = STAT_GANG3;
			statInfo = "gang members";
			break;

		case "gang4":
			statId = STAT_GANG4;
			statInfo = "gang members";
			break;

		case "gang5":
			statId = STAT_GANG5;
			statInfo = "gang members";
			break;

		case "gang6":
			statId = STAT_GANG6;
			statInfo = "gang members";
			break;

		case "gang7":
			statId = STAT_GANG7;
			statInfo = "gang members";
			break;

		case "mstreet":
			statId = STAT_STREET_GUY;
			statInfo = "street men";
			break;

		case "msuit":
			statId = STAT_SUIT_GUY;
			statInfo = "business men";
			break;

		case "msensible":
			statId = STAT_SENSIBLE_GUY;
			statInfo = "sensible men";
			break;

		case "mgeek":
			statId = STAT_GEEK_GUY;
			statInfo = "geeky men";
			break;

		case "mold":
			statId = STAT_OLD_GUY;
			statInfo = "old men";
			break;

		case "mtough":
			statId = STAT_TOUGH_GUY;
			statInfo = "tough men";
			break;

		case "fstreet":
			statId = STAT_STREET_GIRL;
			statInfo = "street women";
			break;

		case "fsuit":
			statId = STAT_SUIT_GIRL;
			statInfo = "business women";
			break;

		case "fsensible":
			statId = STAT_SENSIBLE_GIRL;
			statInfo = "sensible women";
			break;

		case "fgeek":
			statId = STAT_GEEK_GIRL;
			statInfo = "geeky women";
			break;

		case "fold":
			statId = STAT_OLD_GIRL;
			statInfo = "old women";
			break;

		case "ftough":
			statId = STAT_TOUGH_GIRL;
			statInfo = "tough women";
			break;

		case "mtramp":
			statId = STAT_TRAMP_MALE;
			statInfo = "male tramps";
			break;

		case "ftramp":
			statId = STAT_TRAMP_FEMALE;
			statInfo = "female tramps";
			break;

		case "tourist":
			statId = STAT_TOURIST;
			statInfo = "tourists";
			break;

		case "hooker":
			statId = STAT_PROSTITUTE;
			statInfo = "hookers";
			break;

		case "busker":
			statId = STAT_BUSKER;
			statInfo = "buskers";
			break;

		case "taxidriver":
			statId = STAT_TAXIdRIVER;
			statInfo = "taxi drivers";
			break;

		case "psycho":
			statId = STAT_PSYCHO;
			statInfo = "psychos";
			break;

		case "steward":
			statId = STAT_STEWARD;
			statInfo = "stewards";
			break;

		case "sportsfan":
			statId = STAT_SPORTSFAN;
			statInfo = "sports fans";
			break;

		case "shopper":
			statId = STAT_SHOPPER;
			statInfo = "shoppers";
			break;

		case "oldshopper":
			statId = STAT_OLDSHOPPER;
			statInfo = "old shoppers";
			break;

		default:
			statId = STAT_PLAYER;
			statInfo = "normal people";
			break;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.stats", civilians, statId);
	} else {
		civilians.forEach(function(civilian) {
			civilian.setPedStats(civilians[i], statId);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to act like " + String(statInfo);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to act like " + String(statInfo);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_nogun", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.nogun", civilians);
	} else {
		civilians.forEach(function(civilian) {
			civilian.clearWeapons();
		});
	}

	if(civilians.length > 1) {
		outputText = "took " + String(civilians.length) + " peds weapons";
	} else {
		outputText = "took " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's weapons";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_god", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <state 0/1>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let godMode = Number(splitParams[1]) || 1;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.god", civilians, !!godMode);
	} else {
		civilians.forEach(function(civilian) {
			civilian.invincible = !!godMode;
			civilian.setProofs(!!godMode, !!godMode, !!godMode, !!godMode, !!godMode);
		});
	}

	if(civilians.length > 1) {
		outputText = "made " + String(civilians.length) + " peds " + String((!!godMode) ? "invincible" : "not invincible");
	} else {
		outputText = "made " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped " + String((!!godMode == 1) ? "invincible" : "not invincible");
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_crouch", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let crouchState = Number(splitParams[1]) || 1;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.crouch", civilians, !!crouchState);
	} else {
		civilians.forEach(function(civilian) {
			civilian.crouching = !!crouchState;
		});
	}

	if(civilians.length > 1) {
		outputText = "made " + String(civilians.length) + " peds " + String((!!crouchState) ? "crouch" : "stand up");
	} else {
		outputText = "made " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped " + String((!!crouchState) ? "crouch" : "stand up");
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_waitstate", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <wait state> <time>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let waitState = Number(splitParams[1]) || 0;
	let time = Number(splitParams[1]) || 10000;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.waitstate", civilians, waitState, time);
	} else {
		civilians.forEach(function(civilian) {
			civilian.setWaitState(waitState, time);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds wait state to " + String(getPedWaitStateName(waitState, gta.game)) + " for " + Sring(time) + " milliseconds";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped wait state to " + String(getPedWaitStateName(waitState, gta.game)) + " for " + String(time) + " milliseconds";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_threat", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let threatText = splitParams[1] || "p1";

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	var threatId = 1;
	var threatInfo = "players";

	switch(threatText.toLowerCase()) {
		case "cop":
			threatId = 64;
			threatInfo = "cops";
			break;

		case "p1":
			threatId = 1;
			threatInfo = "players";
			break;

		case "p2":
			threatId = 2;
			threatInfo = "players";
			break;

		case "p3":
			threatId = 4;
			threatInfo = "players";
			break;

		case "p4":
			threatId = 8;
			threatInfo = "players";
			break;

		case "male":
			threatId = 16;
			threatInfo = "male civs";
			break;

		case "female":
			threatId = 32;
			threatInfo = "female civs";
			break;

		case "mafia":
			threatId = 128;
			threatInfo = "mafia members";
			break;

		case "triad":
			threatId = 256;
			threatInfo = "triads";
			break;

		case "diablo":
			threatId = 512;
			threatInfo = "diablo thugs";
			break;

		case "yakuza":
			threatId = 1024;
			threatInfo = "yakuza members";
			break;

		case "yardie":
			threatId = 2048;
			threatInfo = "yardies";
			break;

		case "cartel":
			threatId = 4096;
			threatInfo = "cartel members";
			break;

		case "hood":
			threatId = 8192;
			threatInfo = "street gangs";
			break;

		case "medic":
			threatId = 65536;
			threatInfo = "medics";
			break;

		case "hooker":
			threatId = 131072;
			threatInfo = "hookers";
			break;

		case "gun":
			threatId = 1048576;
			threatInfo = "anybody who shoots a gun";
			break;

		case "copcar":
			threatId = 2097152;
			threatInfo = "police cars";
			break;

		case "fastcar":
			threatId = 4194304;
			threatInfo = "fast cars";
			break;

		case "fireman":
			threatId = 16777216;
			threatInfo = "firefighters";
			break;

		case "dead":
			threatId = 33554432;
			threatInfo = "dead people";
			break;
	}

	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <threat name>", syntaxMessageColour);
		return false;
	}

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.threat.add", civilians, threatId);
	} else {
		civilians.forEach(function(civilian) {
			civilian.setThreatSearch(threatId);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to attack " + String(threatInfo);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to attack " + String(threatInfo);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_nothreat", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.threat.clr", civilians);
	} else {
		civilians.forEach(function(civilian) {
			civilian.clearThreatSearch();
			civilian.heedThreats = false;
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to attack nobody";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to attack nobody";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatme", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " " + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.aimat", civilians, localPlayer.id);
	} else {
		civilians.forEach(function(civilian) {
			civilian.pointGunAt(localPlayer);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to point their guns at " + getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin));
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to point their guns at " + getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin));
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatciv", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <player>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let civilians2 = getCiviliansFromParams(splitParams[1]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(civilians2.length == 0) {
		message("No target peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.aimat", civilians, civilians2[0]);
	} else {
		civilians.forEach(function(civilian) {
			civilian.pointGunAt(civilians2[0]);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to aim their guns at " + getProperCivilianPossessionText(splitParams[1]) + " " + getCivilianName(civilians[1].skin) + " ped";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to aim their guns at " + getProperCivilianPossessionText(splitParams[1]) + " " + getCivilianName(civilians[1].skin) + " ped";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatveh", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped> <vehicle>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(vehicles.length == 0) {
		message("No target peds found!", errorMessageColour);
		return false;
	}


	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.aimat", civilians, vehicles[0]);
	} else {
		civilians.forEach(function(civilian) {
			civilian.pointGunAt(vehicles[0]);
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to aim their guns at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to aim their guns at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatplr", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerName = splitParams[1];

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.aimatplr", civilians, playerName);
	} else {
		message("This command can't be used offline!", errorMessageColour);
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_hailtaxi", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.hailtaxi", civilians);
	} else {
		civilians.forEach(function(civilian) {
			civilian.hailTaxi();
		});
	}

	if(civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to hail a taxi";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to hail a taxi";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_resurrect", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.resurrect", civilians);
	} else {
		civilians.forEach(function(civilian) {
			civilian.resurrect();
		});
	}

	if(civilians.length > 1) {
		outputText = "resurrected " + String(civilians.length) + " peds";
	} else {
		outputText = "resurrected " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_coll", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Command: /" + String(cmdName) + " <ped>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let collisionState = Number(splitParams[1]) || 0;

	let outputText = "";

	if(civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.c.coll", civilians, !!collisionsEnabled);
	} else {
		civilians.forEach(function(civilian) {
			civilian.collisionsEnabled = (collisionsEnabled == 1) ? true : false;
		});
	}

	if(civilians.length > 1) {
		outputText = "turned " + String(civilians.length) + " peds collisions " + (!!collisionsEnabled) ? "on" : "off";
	} else {
		outputText = "turned " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped collision " + (!!collisionsEnabled) ? "on" : "off";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

function getCiviliansFromParams(params) {
	let civilians = getCivilians();
	let selected = [];

	switch(params.toLowerCase()) {
		case "last":
		case "new":
		case "newest":
		case "l":
			selected.push(civilians[civilians.length-1]);
			break;

		case "n":
		case "c":
		case "closest":
		case "nearest":
			selected.push(getClosestCivilian(localPlayer.position));
			break;

		case "r":
		case "range":
		case "near":
		case "within":
			selected.concat(getCiviliansInRange(localPlayer.position, 20.0));
			break;		

		case "a":
		case "all":
			selected = getCivilians();
			break;	

		case "r":
		case "random":
		case "any":
			selected.push(getRandomCivilian());
			break;

		default:
			if(typeof civilians[Number(params)] != "undefined") {
				selected.push(civilians[Number(params)]);
			}
			return [];
	}

	return (selected.length > 0) ? selected : false;
}

// ----------------------------------------------------------------------------

function getCivilians() {
	return getElementsByType(ELEMENT_CIVILIAN);
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.wander", function(civilian, wanderPath) {
	makeCivilianWander(civilian, wanderPath);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.nogun", function(civilian, wanderPath) {
	civilian.clearWeapons();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function(civilian, stayState) {
	setCivilianStayInSamePlace(civilian, stayState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function(civilian, position) {
	makeCivilianWalkTo(civilian, position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkfwd", function(civilian, distance) {
	let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
	makeCivilianWalkTo(civilian, position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runfwd", function(civilian, distance) {
	let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
	makeCivilianRunTo(civilian, position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.sprintfwd", function(civilian, distance) {
	let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
	makeCivilianSprintTo(civilian, position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function(civilian, x, y, z) {
	makeCivilianRunTo(civilian, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function(civilian, crouchState) {
	civilian.crouching = crouchState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function(civilian, threatId) {
	civilian.setThreatSearch(threatId);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.clr", function(civilian, threatId) {
	civilian.setThreatSearch(threatId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function(civilian, heedThreatState) {
	civilian.clearThreatSearch();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function(civilian, pedStat) {
	civilian.setPedStats(pedStat);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function(civilian, skinId) {
	civilian.skin = skinId;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function(civilian, position) {
	civilian.position = position;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.lookat", function(civilian, position, duration) {
	civilian.lookat(position, duration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function(civilian, elementId) {
	civilian.pointGunAt(getElementFromId(elementId));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function(civilian, walkStyle) {
	civilian.walkStyle = walkStyle;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function(civilian, scaleFactor) {
	//civilians.forEach(function(civilian) {
	//	/civilian.setData("sb.scale", scaleFactor);
	//});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function(civilian, vehicle, seatId) {
	civilian.warpIntoVehicle(vehicle, seatId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function(civilian, vehicle, driver) {
	civilian.enterVehicle(vehicle, driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function(civilian) {
	civilian.exitVehicle();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function(civilian, godMode) {
	civilians.forEach(function(civilian) {
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function(civilian) {
	civilian.invincible = godMode;
	civilian.setProofs(godMode, godMode, godMode, godMode, godMode);
	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function(civilian, weaponId, ammo, holdGun) {
	civilian.giveWeapon(weaponId, ammo, holdGun);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.waitstate", function(civilian, waitState, time) {
	civilian.setWaitState(waitState, time);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function(civilian) {
	civilian.resurrect();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function(civilian) {
	civilian.jumping = true;
});

// ----------------------------------------------------------------------------

function makeCivilianWander(civilian, wanderPath) {
	civilian.setWanderPath(wanderPath);
}

// ----------------------------------------------------------------------------

function setCivilianStayInSamePlace(civilian, stayState) {
	civilian.stayInSamePlace = stayState;
}

// ----------------------------------------------------------------------------

function makeCivilianWalkTo(civilian, position) {
	civilian.walkTo(position);
}

// ----------------------------------------------------------------------------

function makeCivilianRunTo(civilian, position) {
	civilian.runTo(position);
}

// ----------------------------------------------------------------------------

function makeCivilianSprintTo(civilian, position) {
	civilian.sprintTo(position);
}

// ----------------------------------------------------------------------------
