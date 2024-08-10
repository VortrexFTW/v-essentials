// ----------------------------------------------------------------------------

addCommandHandler("time", function (command, params) {
	if (isParamsInvalid(params)) {
		message(`The time is currently ${makeReadableTime(game.time.hour, game.time.minute)}`, gameAnnounceColour);
		message(`To set the time, use /time <hour> [minute]`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let hour = Number(splitParams[0]) || 0;
	let minute = Number(splitParams[1]) || 0;

	if (hour < 0 || hour > 23) {
		message(`The hour must be between 0 and 23!`, errorMessageColour);
		return false;
	}

	if (minute < 0 || minute > 59) {
		message(`The minute must be between 0 and 59!`, errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.w.time", hour, minute);
	} else {
		game.time.hour = hour;
		game.time.minute = minute;
		message(`The time is now set to ${makeReadableTime(hour, minute)}`, gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("garage", function (command, params) {
	let outputText = "";

	let garageId = getGarageIdFromParams(params);
	if (!garageId) {
		message(`That garage doesn't exist!`, errorMessageColour);
		return false;
	}

	if (isGarageClosed(garageId)) {
		triggerNetworkEvent("sb.w.garage", garageId, true);
		outputText = `opened the ${getGarageNameFromId(garageId, game.game)} garage in ${String(getGarageLocationFromId(garageId, game.game))}`;
		outputSandboxMessage(outputText);
	} else {
		triggerNetworkEvent("sb.w.garage", garageId, false);
		outputText = `closed the ${getGarageNameFromId(garageId, game.game)} garage in ${String(getGarageLocationFromId(garageId, game.game))}`;
		outputSandboxMessage(outputText);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("gamespeed", function (command, params) {
	if (isParamsInvalid(params)) {
		message(`The current game speed is: ${game.gameSpeed}`, gameAnnounceColour);
		message(`To set the game speed, use /${command} <speed>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let gameSpeed = Number(splitParams[0]) || 0;

	if (gameSpeed < 0) {
		message(`The game speed cannot be negative!`, errorMessageColour);
		return false;
	}

	if (isConnected) {
		triggerNetworkEvent("sb.w.gamespeed", gameSpeed);
	} else {
		game.gameSpeed = gameSpeed;
		message(`Game speed has been set to ${gameSpeed}`, gameAnnounceColour);
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("planes", function (command, params) {
	if (game.game == GAME_GTA_IV) {
		message(`The /${command} command is not available on this game!`, errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message(`Airplanes are currently turned ${getOnOffText(planesEnabled[game.game])}`, gameAnnounceColour);
		if (game.game == GAME_GTA_VC) {
			message(`To turn airplanes on or off, use /${command} <state 1/0>`, syntaxMessageColour);
		}
		return false;
	}

	let splitParams = params.split(" ");
	let planesState = Number(splitParams[0]);

	if (isConnected) {
		triggerNetworkEvent("sb.w.planes", !!planesState);
	} else {
		planesEnabled[game.game] = !!planesState;
		setPlanesEnabled(planesEnabled[game.game]);
		message(`Planes have been turned ${getOnOffText(planesEnabled[game.game])}`, gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("trains", function (command, params) {
	//if(game.game == GAME_GTA_IV) {
	//	message(`The /${command} command is not available on this game!`, errorMessageColour);
	//	return false;
	//}

	if (isParamsInvalid(params)) {
		message(`Trains are currently turned ${getOnOffText(trainsEnabled[game.game])
			} `, gameAnnounceColour);
		if (game.game != GAME_GTA_VC) {
			message(`To turn trains on or off, use / ${command} <state 1 / 0 > `, syntaxMessageColour);
		} else {
			message(`Trains cannot be enabled in Vice City(they don't exist!)`, syntaxMessageColour);
		}
		return false;
	}

	let splitParams = params.split(" ");
	let trainsState = Number(splitParams[0]) || 0;

	if (isConnected) {
		triggerNetworkEvent("sb.w.trains", !!trainsState);
	} else {
		trainsEnabled[game.game] = !!trainsState;
		setTrainsEnabled(trainsEnabled[game.game]);
		message("Trains have been turned " + getOnOffText(trainsEnabled[game.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("traffic", function (command, params) {
	//if(game.game == GAME_GTA_IV) {
	//	message(`The /${command} command is not available on this game!`, errorMessageColour);
	//	return false;
	//}

	if (isParamsInvalid(params)) {
		message(`Traffic is currently turned ${getOnOffText(trafficEnabled[game.game])}`, gameAnnounceColour);
		message(`To turn traffic on or off, use /${command} <state 1/0>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let trafficState = Number(splitParams[0]) || 0;

	if (isConnected) {
		triggerNetworkEvent("sb.w.traffic", !!trafficState);
	} else {
		trafficEnabled[game.game] = !!trafficState;
		game.setTrafficEnabled(trafficEnabled[game.game]);
		message(`Traffic has been turned ${getOnOffText(trafficEnabled[game.game])}`, gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civilians", function (command, params) {
	//if(game.game == GAME_GTA_IV) {
	//	message(`The /${command} command is not available on this game!`, errorMessageColour);
	//	return false;
	//}

	if (isParamsInvalid(params)) {
		message(`Civilians are currently turned ${getOnOffText(civiliansEnabled[game.game])}`, gameAnnounceColour);
		message(`To turn civilians on or off, use /${command} <state 1/0>`, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let civiliansState = Number(splitParams[0]) || 0;

	if (isConnected) {
		triggerNetworkEvent("sb.w.civilians", !!civiliansState);
	} else {
		civiliansEnabled[game.game] = !!civiliansState;
		game.setCiviliansEnabled(civiliansEnabled[game.game]);
		message(`Civilians have been turned ${getOnOffText(civiliansEnabled[game.game])}`, gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civdensity", function (command, params) {
	if (game.game == GAME_GTA_IV) {
		message(`The /${command} command is not available on this game!`, errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Civilian density is currently " + String(game.civilianDensity), gameAnnounceColour);
		message("To set the civilian density, use /" + String(command) + " <amount>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let civilianDensity = Number(splitParams[0]) || game.civilianDensity;

	if (isConnected) {
		triggerNetworkEvent("sb.w.civiliandensity", civilianDensity);
	} else {
		civilianDensity[game.game] = civilianDensity;
		game.pedDensity = civilianDensity;
		message("Civilian density has been set to " + String(civilianDensity), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("trafficdensity", function (command, params) {
	if (game.game == GAME_GTA_IV) {
		message(`The /${command} command is not available on this game!`, errorMessageColour);
		return false;
	}

	if (isParamsInvalid(params)) {
		message("Traffic density is currently " + String(game.civilianDensity), gameAnnounceColour);
		message("To set the traffic density, use /" + String(command) + " <amount>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let trafficDensity = Number(splitParams[0]) || game.trafficDensity;

	if (isConnected) {
		triggerNetworkEvent("sb.w.trafficdensity", trafficDensity);
	} else {
		civilianDensity[game.game] = trafficDensity;
		game.civilianDensity = trafficDensity;
		message(`Traffic density has been set to ${trafficDensity}`, gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.gamespeed", function (gameSpeed) {
	game.gameSpeed = gameSpeed;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.civilians", function (state) {
	if (game.game == GAME_GTA_IV) {
		return false;
	}

	//if(game.game < GAME_GTA_SA) {
	//	civiliansEnabled[game.game] = state;
	//	game.setCiviliansEnabled(state);
	//}

	if (!state) {
		getPeds().forEach(function (ped) {
			if (ped.isLocal && ped.isType(ELEMENT_CIVILIAN)) {
				destroyElement(ped);
			}
		});
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.traffic", function (state) {
	if (game.game == GAME_GTA_IV) {
		return false;
	}

	//if(game.game < GAME_GTA_SA) {
	//	trafficEnabled[game.game] = state;
	//	game.setTrafficEnabled(state);
	//}

	if (!state) {
		getVehicles().forEach(function (vehicle) {
			if (vehicle.isLocal) {
				destroyElement(vehicle);
			}
		});
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.trains", function (state) {
	game.setTrainsEnabled(state);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.minutedur", function (minuteDuration) {
	if (game.game == GAME_GTA_IV) {
		return false;
	}

	timeMinuteDuration[game.game] = minuteDuration;
	game.time.minuteDuration = minuteDuration
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.garage", function (garageId, state) {
	if (state) {
		openGarage(garageId);
	} else {
		closeGarage(garageId);
	}
});

// ----------------------------------------------------------------------------