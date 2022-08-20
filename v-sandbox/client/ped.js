"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function (event, deltaTime) {
	getPeds().filter(ped => !ped.isType(ELEMENT_PLAYER)).forEach((civilian) => {
		updateCivilianMovement(civilian);
	});
});

// ----------------------------------------------------------------------------

function updateCivilianMovement(civilian) {
	if (!customCiviliansEnabled[game.game]) {
		return false;
	}

	if (civilianFollowEnabled[game.game]) {
		if (civilian.getData("sb.c.following")) {
			let following = getElementFromId(civilian.getData("sb.c.following"));
			if (following != null) {
				if (civilian.isInVehicle) {
					if (following.isType(ELEMENT_PLAYER) || following.isType(ELEMENT_PED)) {
						if (following.vehicle) {
							if (civilian.vehicle != following.vehicle) {
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
					if (following.isType(ELEMENT_PLAYER) || following.isType(ELEMENT_PED)) {
						if (following.vehicle) {
							civilian.enterVehicle(following.vehicle, (following.vehicle.getOccupant(0) == null) ? true : false);
						}
					} else {
						if (following.isType(ELEMENT_VEHICLE)) {
							civilian.enterVehicle(following, (following.getOccupant(0) == null) ? true : false);
						}
					}
				}

				if (following.position.distance(civilian.position) <= civilianFollowStopDistance[game.game]) {
					civilian.walkTo(civilian.position);
				} else {
					if (following.position.distance(civilian.position) > civilianFollowRunDistance[game.game]) {
						if (game.game >= GAME_GTA_VC) {
							if (following.position.distance(civilian.position) > civilianFollowSprintDistance[game.game]) {
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

	if (civilianFacingEnabled[game.game]) {
		if (civilian.getData("sb.c.facing") != null) {
			let facingPlayer = getElementFromId(civilian.getData("sb.c.facing"));
			if (facingPlayer != null) {
				civilian.heading = getHeadingFromPosToPos(facingPlayer.position, facingPlayer.position);
			} else {
				console.error(`Ped ${civilian.id}'s entity facing data is set, but the entity doesn't exist. Removing data.`);
				triggerNetworkEvent("sb.c.stopfacing", civilian);
			}
		}
	}
}

// ----------------------------------------------------------------------------

function updateCivilianScale(civilian) {
	if (civilian.getData("sb.c.scale") != null) {
		if (civilian.getData("sb.c.scale") != -1) {
			let scaleFactor = Number(civilian.getData("sb.c.scale"));
			let civilianMatrix = civilian.matrix;
			civilianMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
			let civilianPosition = civilian.position;
			civilian.matrix = civilianMatrix;
			civilian.position = new Vec3(civilianPosition.x, civilian.Position.y, civilianPosition.z + Math.round(scaleFactor));
		}
	}
}

// ----------------------------------------------------------------------------

addCommandHandler("ped", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <skin id>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let skinId = getSkinIdFromParams(splitParams[0], game.game);
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	let heading = localPlayer.heading;

	// Make sure there aren't too many other peds nearby
	//if(getCiviliansInRange(localPlayer.position, 50.0).length >= 20) {
	//	message("There are already enough peds in the area!", errorMessageColour);
	//	return false;
	//}

	if (isConnected) {
		if (game.game == GAME_GTA_IV) {
			let tempCiv = false;

			natives.requestModel(skinId);
			natives.loadAllObjectsNow();
			if (natives.hasModelLoaded(skinId)) {
				tempCiv = natives.createChar(1, skinId, position, true);
			}

			if (!tempCiv) {
				message("The civilian could not be added!", errorMessageColour);
				return false;
			}

			tempCiv.position = position;
			tempCiv.heading = heading;

			natives.setCharAsMissionChar(tempCiv, true);
			natives.setCharStayInCarWhenJacked(tempCiv, true);
		} else {
			triggerNetworkEvent("sb.c.add", Number(skinId), position, heading);
		}
	} else {
		if (game.game == GAME_GTA_IV) {
			let tempCiv = false;

			natives.requestModel(skinId);
			natives.loadAllObjectsNow();
			if (natives.hasModelLoaded(skinId)) {
				tempCiv = natives.createChar(1, skinId, position, true);
			}

			if (!tempCiv) {
				message("The civilian could not be added!", errorMessageColour);
				return false;
			}

			tempCiv.position = position;
			tempCiv.heading = heading;

			natives.setCharAsMissionChar(tempCiv, true);
			natives.setCharStayInCarWhenJacked(tempCiv, true);
		}
	}

	let outputText = `spawned a ${getSkinNameFromId(skinId, game.game)} ped.`;
	outputSandboxMessage(outputText);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("pedline", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <skin id> <amount> [gap]`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let skinId = getSkinIdFromParams(splitParams[0], game.game);
	let amount = (Number(splitParams[1]) || 8);
	let gap = (Number(splitParams[2]) || 2);
	let tempCiv = null;

	// Make sure there aren't too many other peds nearby
	//if((getCiviliansInRange(localPlayer.position, 50.0).length >= 50) && !client.administrator) {
	//	message("There are already enough peds in the area!", errorMessageColour);
	//	return false;
	//}

	if (isConnected) {
		for (let i = 1; i <= amount; i++) {
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i * gap);
			let heading = localPlayer.heading;

			if (game.game == GAME_GTA_IV) {
				let tempCiv = false;

				natives.requestModel(skinId);
				natives.loadAllObjectsNow();
				if (natives.hasModelLoaded(skinId)) {
					tempCiv = natives.createChar(1, skinId, position, true);
				}

				if (!tempCiv) {
					message("The civilian could not be added!", errorMessageColour);
					return false;
				}

				tempCiv.position = position;
				tempCiv.heading = heading;

				natives.setCharAsMissionChar(tempCiv, true);
				natives.setCharStayInCarWhenJacked(tempCiv, true);
			} else {
				triggerNetworkEvent("sb.c.add", skinId, new Vec3(position.x, position.y, position.z), heading, false);
			}
		}
	} else {
		for (let i = 1; i <= amount; i++) {
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i * gap);
			let heading = localPlayer.heading;
			tempCiv = createCivilian(skinId);
			tempCiv.position = position;
			tempCiv.heading = heading;
		}
	}

	let outputText = `spawned a line of ${amount} ${getSkinNameFromId(skinId, game.game)} peds, spaced apart by ${gap} meters`;
	outputSandboxMessage(outputText);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("pedgrid", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <skin id> <columns> <rows> [column gap] [row gap]`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let skinId = getSkinIdFromParams(splitParams[0], game.game);
	let cols = (Number(splitParams[1]) || 4);
	let rows = (Number(splitParams[2]) || 2);
	let colGap = (Number(splitParams[3]) || 2);
	let rowGap = (Number(splitParams[4]) || 3);
	let tempCiv = null;

	if (isConnected) {
		for (let k = 1; k <= cols; k++) {
			for (let i = 1; i <= rows; i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading, k * rowGap), localPlayer.heading, i * colGap);
				let heading = localPlayer.heading;

				if (game.game == GAME_GTA_IV) {
					let tempCiv = false;

					natives.requestModel(skinId);
					natives.loadAllObjectsNow();
					if (natives.hasModelLoaded(skinId)) {
						tempCiv = natives.createChar(1, skinId, position, true);
					}

					if (!tempCiv) {
						message("The civilian could not be added!", errorMessageColour);
						return false;
					}

					tempCiv.position = position;
					tempCiv.heading = heading;

					natives.setCharAsMissionChar(tempCiv, true);
					natives.setCharStayInCarWhenJacked(tempCiv, true);
				} else {
					triggerNetworkEvent("sb.c.add", skinId, new Vec3(position.x, position.y, position.z), heading, false);
				}
			}
		}
	} else {
		for (let k = 1; k <= cols; k++) {
			for (let i = 1; i <= rows; i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading, k * rowGap), localPlayer.heading, i * colGap);
				let heading = localPlayer.heading;
				tempCiv = gta.createCivilian(skinId);
				tempCiv.position = position;
				tempCiv.heading = heading;
			}
		}
	}

	let outputText = `spawned a ${cols}x${rows} grid of ${getSkinNameFromId(skinId, game.game)} peds, spaced apart by ${colGap}x${rowGap} meters. Total peds: ${cols * rows}`;
	outputSandboxMessage(outputText);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_wander", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <wander path>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let wanderPath = Number(splitParams[1]) || 0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.wander", getPedsIdsArray(civilians), wanderPath);
	} else {
		civilians.forEach(function (civilian) {
			makeCivilianWander(civilian, wanderPath);
		});
	}

	if (civilians.length > 1) {
		outputText = `set ${civilians.length} civilians to wander on path ${wanderPath} (using /${cmdName.toLowerCase()})`;
	} else {
		outputText = `set ${getProperCivilianPossessionText(splitParams[0]).toLowerCase()} ${getSkinNameFromId(civilians[0].skin)} to wander on path ${wanderPath} (using /${cmdName.toLowerCase()})`;
	}
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_delete", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.del", civilians);
	} else {
		civilians.forEach(function (civilian) {
			deleteCivilian(civilian);
		});
	}

	if (civilians.length > 1) {
		outputText = "deleted " + String(civilians.length) + " peds.";
	} else {
		outputText = "deleted a " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_stay", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <state>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let stayState = Number(splitParams[1]);

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.stay", getPedsIdsArray(civilians), !!stayState);
	} else {
		civilians.forEach(function (civilian) {
			setCivilianStayInSamePlace(civilian, !!stayState);
		});
	}

	if (civilians.length > 1) {
		outputText = `set ${civilians.length} civilians to ${(stayState) ? "stay in the same place" : " not stay in the same place"} (using /${cmdName.toLowerCase()})`;
	} else {
		outputText = `set ${getProperCivilianPossessionText(splitParams[0]).toLowerCase()} ${getSkinNameFromId(civilians[0].skin)} to ${(stayState) ? "stay in the same place" : " not stay in the same place"} (using /${cmdName.toLowerCase()})`;
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_stamina", function (cmdName, params) {
	if (isConnected) {
		if (!civiliansEnabled[game.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <stamina>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let stamina = Number(splitParams[1]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.stamina", getPedsIdsArray(civilians), stamina);
	} else {
		civilians.forEach(function (civilian) {
			setCivilianStamina(civilian, stamina);
		});
	}

	if (civilians.length > 1) {
		outputText = `set ${civilians.length} civilians stamina to ${stamina} (using /${cmdName.toLowerCase()})`;
	} else {
		outputText = `set ${getProperCivilianPossessionText(splitParams[0]).toLowerCase()} ${getSkinNameFromId(civilians[0].skin)} stamina to ${stamina} (using /${cmdName.toLowerCase()})`;
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_enterveh", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <vehicle> [driver 0/1]`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let driver = Number(splitParams[1]) || 1;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.enterveh", getPedsIdsArray(civilians), vehicles[0], !!driver);
	} else {
		civilians.forEach(function (civilian) {
			civilian.enterVehicle(vehicles[0], !!driver);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to enter " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to enter " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_lookatveh", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <vehicle>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let duration = Number(splitParams[1]) || 5000;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.lookat", getPedsIdsArray(civilians), vehicles[0].position.x, vehicles[0].position.y, vehicles[0].position.z, duration);
	} else {
		civilians.forEach(function (civilian) {
			civilian.lookAt(vehicles[0].position, duration);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to look at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to look at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_exitveh", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.exitveh", civilians);
	} else {
		civilians.forEach(function (civilian) {
			setCivilianStamina(civilian, stamina);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to exit their vehicle (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to exit its vehicle" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_staminadur", function (cmdName, params) {
	if (game.game == GAME_GTA_III) {
		message("Ped stamina does not work on GTA 3!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		if (!civiliansEnabled[game.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <duration>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let staminaDuration = Number(splitParams[1]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.stamina", getPedsIdsArray(civilians), staminaDuration);
	} else {
		civilians.forEach(function (civilian) {
			civilian.staminaDuration = staminaDuration;
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds stamina to " + String(stamina) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's stamina to " + String(stamina) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_torsorot", function (cmdName, params) {
	if (game.game == GAME_GTA_III) {
		message("Ped torso rotation does not work on GTA 3!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		if (!civiliansEnabled[game.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <rotation>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let rotation = Number(splitParams[1]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.torsorot", getPedsIdsArray(civilians), rotation);
	} else {
		civilians.forEach(function (civilian) {
			civilian.torsoRotation = rotation;
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds torso rotation to " + String(rotation) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's torso rotation to " + String(rotation) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_walkstyle", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <rotation>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let walkStyle = Number(splitParams[1]) || 1;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.walkstyle", getPedsIdsArray(civilians), walkStyle);
	} else {
		civilians.forEach(function (civilian) {
			civilian.walkStyle = walkStyle;
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds walk style to " + String(walkStyle) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's walk style to " + String(walkStyle) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_armour", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <rotation>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let armour = Number(splitParams[1]) || 100;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.armour", getPedsIdsArray(civilians), armour);
	} else {
		civilians.forEach(function (civilian) {
			civilian.armour = armour;
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds armour to " + String(armour) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's armour to " + String(armour) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_warpinveh", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <vehicle>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let seatId = Number(splitParams[2]) || 0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.nofollow", getPedsIdsArray(civilians));
		triggerNetworkEvent("sb.c.warpintoveh", getPedsIdsArray(civilians), vehicles[0], seatId);
	} else {
		civilians.forEach(function (civilian) {
			civilian.warpIntoVehicle(vehicles[0], seatId);
		});
	}

	if (civilians.length > 1) {
		outputText = "warped " + String(civilians.length) + " peds into the " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " vehicle in the " + seatNames[seatId].toLowerCase() + " seat" + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "warped " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped into the " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " vehicle in the " + seatNames[seatId].toLowerCase() + " seat" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_syncer", function (cmdName, params) {
	if (!isConnected) {
		message("This command cannot be used offline!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <client>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let clientName = splitParams[1] || localClient.name;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.syncer", getPedsIdsArray(civilians), clientName);
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds syncer to " + getClientFromParams(clientName).name + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's syncer to " + getClientFromParams(clientName).name + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_health", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <rotation>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let armour = Number(splitParams[1]) || 100;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.armour", getPedsIdsArray(civilians), armour);
	} else {
		civilians.forEach(function (civilian) {
			civilian.armour = armour;
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds health to " + String(health) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's health to " + String(health) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_jump", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <distance>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.jump", civilians);
	} else {
		civilians.forEach(function (civilian) {
			civilian.jumping = true;
		});
	}

	if (civilians.length > 1) {
		outputText = "forced " + String(civilians.length) + " peds to jump";
	} else {
		outputText = "forced " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to jump" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_walkfwd", function (cmdName, params) {
	//if(game.game == GAME_GTA_SA || game.game == GAME_GTA_UG) {
	//	message("This feature is not available in San Andreas!", errorMessageColour);
	//	return false;
	//}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <distance>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.nofollow", getPedsIdsArray(civilians));
		triggerNetworkEvent("sb.c.walkfwd", getPedsIdsArray(civilians), distance);
	} else {
		civilians.forEach(function (civilian) {
			let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
			makeCivilianWalkTo(civilian, position.x, position.y, position.z);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to walk forward " + String(distance) + " meters.";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to walk forward " + String(distance) + " meters." + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("ped_runfwd", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <distance>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.nofollow", getPedsIdsArray(civilians));
		triggerNetworkEvent("sb.c.runfwd", getPedsIdsArray(civilians), distance);
	} else {
		civilians.forEach(function (civilian) {
			let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
			makeCivilianRunTo(civilian, position.x, position.y, position.z);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to run forward " + String(distance) + " meters.";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to run forward " + String(distance) + " meters." + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_sprintfwd", function (cmdName, params) {
	if (game.game == GAME_GTA_III) {
		message("Civilian sprint is not supported in GTA 3!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		if (!civiliansEnabled[game.game]) {
			message("Peds are disabled on this server!", errorMessageColour);
			return false;
		}
	}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <distance>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.nofollow", getPedsIdsArray(civilians));
		triggerNetworkEvent("sb.c.sprintfwd", getPedsIdsArray(civilians), distance);
	} else {
		civilians.forEach(function (civilian) {
			let position = getPosInFrontOfPos(civilian.position, civilian.heading, distance);
			makeCivilianSprintTo(civilian, position.x, position.y, position.z)
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to sprint forward " + String(distance) + " meters.";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to sprint forward " + String(distance) + " meters." + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_follow", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <player name/id>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1] || localClient.index;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.follow", getPedsIdsArray(civilians), localPlayer.id);
	} else {
		civilians.forEach(function (civilian) {
			civilian.setData("sb.c.following", localPlayer.id);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to follow " + String((playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : getClients()[playerId].name) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to follow " + String((playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : getClients()[playerId].name) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_follow", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <player name/id>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1] || localClient.index;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.nofollow", getPedsIdsArray(civilians), localPlayer.id);
	} else {
		civilians.forEach(function (civilian) {
			civilian.removeData("sb.c.following");
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to stop following";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to stop following";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_defend", function (cmdName, params) {
	if (game.game == GAME_GTA_SA || game.game == GAME_GTA_UG) {
		message("This feature is not available in San Andreas!", errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1];

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.defend", getPedsIdsArray(civilians), playerId);
	} else {
		civilians.forEach(function (civilian) {
			civilian.setData("sb.c.defending", true);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to defend " + (playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : String(getClients()[playerId].name) + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to defend " + (playerId == localClient.index) ? getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) : String(getClients()[playerId].name) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_gun", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <weapon> [ammo] [hold]`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let weaponId = Number(splitParams[1]) || 1;
	let ammo = Number(splitParams[2]) || 100;
	let holdGun = Number(splitParams[3]) || 1;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.gun", getPedsIdsArray(civilians), weaponId, ammo, !!holdGun);
	} else {
		civilians.forEach(function (civilian) {
			civilian.giveWeapon(weaponId, ammo, !!holdGun);
		});
	}

	if (civilians.length > 1) {
		let weaponAmmoOutput = String(getWeaponName(weaponId, game.game)) + "'s with " + String(ammo) + " ammo";
		if (!isAmmoWeapon(weaponId, game.game)) {
			weaponAmmoOutput = String(getWeaponName(weaponId, game.game)) + "s";
		}
		outputText = "gave " + String(civilians.length) + " peds " + weaponAmmoOutput;
	} else {
		let weaponAmmoOutput = "a " + String(getWeaponName(weaponId, game.game)) + " with " + String(ammo) + " ammo";
		if (!isAmmoWeapon(weaponId, game.game)) {
			weaponAmmoOutput = "a " + String(getWeaponName(weaponId, game.game));
		}
		outputText = "gave " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped " + weaponAmmoOutput + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_scale", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <scale>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let scaleFactor = Number(splitParams[1]) || 1.0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.scale", getPedsIdsArray(civilians), scaleFactor);
	} else {
		civilians.forEach(function (civilian) {
			civilian.setData("sb.c.scale", scaleFactor);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds scale to " + String(scaleFactor);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's scale to " + String(scaleFactor) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_stats", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <civ group> <stat>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let statName = splitParams[1] || "player";
	let statId = STAT_PLAYER;
	let statInfo = "normal people";

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	switch (statName.toLowerCase()) {
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

	if (isConnected) {
		triggerNetworkEvent("sb.c.stats", getPedsIdsArray(civilians), statId);
	} else {
		civilians.forEach(function (civilian) {
			civilian.setPedStats(civilian, statId);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to act like " + String(statInfo);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to act like " + String(statInfo) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_nogun", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.nogun", civilians);
	} else {
		civilians.forEach(function (civilian) {
			civilian.clearWeapons();
		});
	}

	if (civilians.length > 1) {
		outputText = "took " + String(civilians.length) + " peds weapons";
	} else {
		outputText = "took " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped's weapons" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_god", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <state 0/1>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let godMode = Number(splitParams[1]) || 1;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.god", getPedsIdsArray(civilians), !!godMode);
	} else {
		civilians.forEach(function (civilian) {
			civilian.invincible = !!godMode;
			civilian.setProofs(!!godMode, !!godMode, !!godMode, !!godMode, !!godMode);
		});
	}

	if (civilians.length > 1) {
		outputText = "made " + String(civilians.length) + " peds " + String((!!godMode) ? "invincible" : "not invincible");
	} else {
		outputText = "made " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped " + String((!!godMode == 1) ? "invincible" : "not invincible") + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_crouch", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let crouchState = Number(splitParams[1]) || 1;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.crouch", getPedsIdsArray(civilians), !!crouchState);
	} else {
		civilians.forEach(function (civilian) {
			civilian.crouching = !!crouchState;
		});
	}

	if (civilians.length > 1) {
		outputText = "made " + String(civilians.length) + " peds " + String((!!crouchState) ? "crouch" : "stand up");
	} else {
		outputText = "made " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped " + String((!!crouchState) ? "crouch" : "stand up") + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_waitstate", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <wait state> <time>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let waitState = Number(splitParams[1]) || 0;
	let time = Number(splitParams[1]) || 10000;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.waitstate", getPedsIdsArray(civilians), waitState, time);
	} else {
		civilians.forEach(function (civilian) {
			civilian.setWaitState(waitState, time);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds wait state to " + String(getPedWaitStateName(waitState, game.game)) + " for " + Sring(time) + " milliseconds" + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped wait state to " + String(getPedWaitStateName(waitState, game.game)) + " for " + String(time) + " milliseconds" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_threat", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let threatText = splitParams[1] || "p1";

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	var threatId = 1;
	var threatInfo = "players";

	switch (threatText.toLowerCase()) {
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

	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <threat name>`, syntaxMessageColour);
		return false;
	}

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.threat.add", getPedsIdsArray(civilians), threatId);
	} else {
		civilians.forEach(function (civilian) {
			civilian.setThreatSearch(threatId);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to attack " + String(threatInfo);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to attack " + String(threatInfo) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_nothreat", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.threat.clr", getPedsIdsArray(civilians));
	} else {
		civilians.forEach(function (civilian) {
			civilian.clearThreatSearch();
			civilian.heedThreats = false;
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to attack nobody";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to attack nobody" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatme", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} " + String(cmdName) + " <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.aimat", getPedsIdsArray(civilians), localPlayer.id);
	} else {
		civilians.forEach(function (civilian) {
			civilian.pointGunAt(localPlayer);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to point their guns at " + getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin));
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to point their guns at " + getGenderObjectivePronoun(getGenderForSkin(localPlayer.skin)) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatciv", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <player>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let civilians2 = getCiviliansFromParams(splitParams[1]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (civilians2.length == 0) {
		message("No target peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.aimat", getPedsIdsArray(civilians), civilians2[0].id);
	} else {
		civilians.forEach(function (civilian) {
			civilian.pointGunAt(civilians2[0]);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to aim their guns at " + getProperCivilianPossessionText(splitParams[1]) + " " + getCivilianName(civilians[1].skin) + " ped";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to aim their guns at " + getProperCivilianPossessionText(splitParams[1]) + " " + getCivilianName(civilians[1].skin) + " ped" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatveh", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped> <vehicle>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (vehicles.length == 0) {
		message("No target peds found!", errorMessageColour);
		return false;
	}


	if (isConnected) {
		triggerNetworkEvent("sb.c.aimat", getPedsIdsArray(civilians), vehicles[0].id);
	} else {
		civilians.forEach(function (civilian) {
			civilian.pointGunAt(vehicles[0]);
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to aim their guns at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex);
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to aim their guns at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_aimatplr", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let targetClient = getClientFromParams(splitParams.slice(1).join(" "));
	console.log(`ARG ${splitParams.slice(1).join(" ")}`);
	console.log(`SELECTING ${targetClient.name}`);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.aimat", getPedsIdsArray(civilians), targetClient.player.id);
	} else {
		message("This command can't be used offline!", errorMessageColour);
	}

	if (civilians.length > 1) {
		outputText = `set ${civilians.length} peds to aim their guns at ${targetClient.name}`;
	} else {
		outputText = `set ${getProperCivilianPossessionText(splitParams[0]).toLowerCase()} ${getSkinNameFromId(civilians[0].skin)} ped to aim their guns at ${targetClient.name}`;
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_hailtaxi", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.hailtaxi", civilians);
	} else {
		civilians.forEach(function (civilian) {
			civilian.hailTaxi();
		});
	}

	if (civilians.length > 1) {
		outputText = "set " + String(civilians.length) + " peds to hail a taxi" + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "set " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped to hail a taxi" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_resurrect", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.resurrect", civilians);
	} else {
		civilians.forEach(function (civilian) {
			civilian.resurrect();
		});
	}

	if (civilians.length > 1) {
		outputText = "resurrected " + String(civilians.length) + " peds" + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "resurrected " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ped_coll", function (cmdName, params) {
	if (isParamsInvalid(params)) {
		message(`Command: /${String(cmdName)} <ped>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let civilians = getCiviliansFromParams(splitParams[0]);
	let collisionsEnabled = Number(splitParams[1]) || 0;

	let outputText = "";

	if (civilians.length == 0) {
		message("No peds found!", errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.c.coll", getPedsIdsArray(civilians), !!collisionsEnabled);
	} else {
		civilians.forEach(function (civilian) {
			civilian.collisionsEnabled = (collisionsEnabled == 1) ? true : false;
		});
	}

	if (civilians.length > 1) {
		outputText = "turned " + String(civilians.length) + " peds collisions " + (!!collisionsEnabled) ? "on" : "off" + " (using " + String(cmdName.toLowerCase()) + ")";
	} else {
		outputText = "turned " + getProperCivilianPossessionText(splitParams[0]).toLowerCase() + " " + getSkinNameFromId(civilians[0].skin) + " ped collision " + (!!collisionsEnabled) ? "on" : "off" + " (using " + String(cmdName.toLowerCase()) + ")";
	}

	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

function getCiviliansFromParams(params) {
	let civilians = getCivilians();
	let selected = [];

	switch (params.toLowerCase()) {
		case "last":
		case "new":
		case "newest":
		case "l":
			selected.push(civilians[civilians.length - 1]);
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
			selected = civilians;
			break;

		case "r":
		case "random":
		case "any":
			selected.push(getRandomCivilian());
			break;

		default:
			if (typeof civilians[Number(params)] != "undefined") {
				selected.push(civilians[Number(params)]);
			}
			return [];
	}

	return (selected.length > 0) ? selected : false;
}

// ----------------------------------------------------------------------------

function getCivilians() {
	return getPeds().filter((ped) => !ped.isType(ELEMENT_PLAYER));
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.wander", function (civilianId, wanderPath) {
	makeCivilianWander(getElementFromId(civilianId), wanderPath);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.nogun", function (civilianId, wanderPath) {
	civilian.clearWeapons();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function (civilianId, stayState) {
	setCivilianStayInSamePlace(getElementFromId(civilianId), stayState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function (civilianId, position) {
	makeCivilianWalkTo(getElementFromId(civilianId), position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkfwd", function (civilianId, distance) {
	let position = getPosInFrontOfPos(getElementFromId(civilianId).position, getElementFromId(civilianId).heading, distance);
	makeCivilianWalkTo(getElementFromId(civilianId), position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runfwd", function (civilianId, distance) {
	let position = getPosInFrontOfPos(getElementFromId(civilianId).position, getElementFromId(civilianId).heading, distance);
	makeCivilianRunTo(getElementFromId(civilianId), position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.sprintfwd", function (civilianId, distance) {
	let position = getPosInFrontOfPos(getElementFromId(civilianId).position, getElementFromId(civilianId).heading, distance);
	makeCivilianSprintTo(getElementFromId(civilianId), position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function (civilianId, x, y, z) {
	makeCivilianRunTo(getElementFromId(civilianId), x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function (civilianId, crouchState) {
	getElementFromId(civilianId).crouching = crouchState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function (civilianId, threatId) {
	getElementFromId(civilianId).setThreatSearch(threatId);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.clr", function (civilianId, threatId) {
	getElementFromId(civilianId).setThreatSearch(threatId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function (civilianId, heedThreatState) {
	getElementFromId(civilianId).clearThreatSearch();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function (civilianId, pedStat) {
	getElementFromId(civilianId).setPedStats(pedStat);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function (civilianId, skinId) {
	getElementFromId(civilianId).skin = skinId;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function (civilianId, position) {
	getElementFromId(civilianId).position = position;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.lookat", function (civilianId, position, duration) {
	getElementFromId(civilianId).lookat(position, duration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function (civilianId, elementId) {
	getElementFromId(civilianId).pointGunAt(getElementFromId(elementId));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function (civilianId, walkStyle) {
	getElementFromId(civilianId).walkStyle = walkStyle;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function (civilian, scaleFactor) {
	//civilians.forEach(function(civilian) {
	//	/civilian.setData("sb.scale", scaleFactor);
	//});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function (civilianId, vehicle, seatId) {
	getElementFromId(civilianId).warpIntoVehicle(vehicle, seatId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function (civilianId, vehicle, driver) {
	getElementFromId(civilianId).enterVehicle(vehicle, driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function (civilianId) {
	getElementFromId(civilianId).exitVehicle();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function (civilianId) {
	getElementFromId(civilianId).hailTaxi();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function (civilianId) {
	getElementFromId(civilianId).invincible = godMode;
	getElementFromId(civilianId).setProofs(godMode, godMode, godMode, godMode, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function (civilianId, weaponId, ammo, holdGun) {
	getElementFromId(civilianId).giveWeapon(weaponId, ammo, holdGun);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.waitstate", function (civilianId, waitState, time) {
	getElementFromId(civilianId).setWaitState(waitState, time);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function (civilianId) {
	getElementFromId(civilianId).resurrect();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function (civilianId) {
	getElementFromId(civilianId).jumping = true;
});

// ----------------------------------------------------------------------------

function makeCivilianWander(civilian, wanderPath) {
	if (game.game == GAME_GTA_IV) {
		natives.taskWanderStandard(civilian);
	} else {
		civilian.setWanderPath(wanderPath);
		civilian.setWanderRandomly();
	}
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

function getPedsIdsArray(peds) {
	let tempArray = [];
	for (let i in peds) {
		tempArray.push((game.game == GAME_GTA_IV) ? natives.getNetworkIdFromPed(peds[i]) : peds[i].id);
	}
	return tempArray;
}

// ----------------------------------------------------------------------------

function getPedFromId(pedId) {
	return (game.game == GAME_GTA_IV) ? natives.getPedFromNetworkId(pedId) : getElementFromId(pedId);
}

// ----------------------------------------------------------------------------