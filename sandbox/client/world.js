"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("time", function(command, params) {
	if(isParamsInvalid(params)) {
		message("The time is currently " + makeReadableTime(gta.time.hour, gta.time.minute), gameAnnounceColour);
		message("To set the time, use /time <hour> [minute]", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let hour = Number(splitParams[0]) || 0;
	let minute = Number(splitParams[1]) || 0;

	if(hour < 0 || hour > 23) {
		message("The hour must be between 0 and 23!", errorMessageColour);
		return false;
	}

	if(minute < 0 || minute > 59) {
		message("The minute must be between 0 and 59!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.w.time", hour, minute);
	} else {
		game.time.hour = hour;
		game.time.minute = minute;
		if(timeLocked[gta.game]) {
			timeLockHour[gta.game] = hour;
			timeLockMinute[gta.game] = minute;
		}
		message("The time is now set to " + makeReadableTime(hour, minute), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("timelock", function(command, params) {
	if(isParamsInvalid(params)) {
		message("Time lock is currently turned " + getOnOffText(timeLocked[gta.game]), gameAnnounceColour);
		message("To turn time lock on or off, use /timelock <state 0/1>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let timeLockState = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.timelock", !!timeLockState);
	} else {
		timeLocked[gta.game] = !!timeLockState;
		if(!!timeLockState) {
			timeLockHour[gta.game] = gta.time.hour;
			timeLockMinute[gta.game] = gta.time.minute;
		}
		message("Time lock has been turned " + getOnOffText(timeLocked[gta.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("weather", function(command, params) {
	if(isParamsInvalid(params)) {
		message("The weather is currently: " + getWeatherName(currentWeather[gta.game]), gameAnnounceColour);
		message("To change the weather, use /weather <weather name/id> [force 0/1]", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let weatherId = (Number(splitParams[0]) || 0);
	let weatherForce = (Number(splitParams[1]) || 1);

	if(weatherId < 0 || weatherId > (weatherNames[gta.game].length-1)) {
		message("The weather must be between 0 and " + String(weatherNames[gta.game].length-1) + "!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.w.weather", weatherId, !!weatherForce);
	} else {
		currentWeather[gta.game] = weatherId;
		if(!!weatherForce) {
			gta.forceWeather(weatherId);
			message("The weather has been forced to " + getWeatherName(currentWeather[gta.game]), gameAnnounceColour);
		} else {
			gta.currentWeather = weatherId;
			message("The weather has been set to " + getWeatherName(currentWeather[gta.game]), gameAnnounceColour);
		}
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("timestep", function(command, params) {
	message("The time step is " + game.timeStep, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("garage", function(command, params) {
	let outputText = "";

	let garageId = getGarageIdFromParams(params);
	if(!garageId) {
		message("That garage doesn't exist!", errorMessageColour);
		return false;
	}

	if(isGarageClosed(garageId)) {
		triggerNetworkEvent("sb.w.garage", garageId, true);
		outputText = "opened the " + getGarageNameFromId(garageId, gta.game) + " garage in " + String(getGarageLocationFromId(garageId, gta.game));
		outputSandboxMessage(outputText);
	} else {
		triggerNetworkEvent("sb.w.garage", garageId, false);
		outputText = "closed the " + getGarageNameFromId(garageId, gta.game) + " garage in " + String(getGarageLocationFromId(garageId, gta.game));
		outputSandboxMessage(outputText);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("winter", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Winter mode is currently turned " + getOnOffText(isWinter[gta.game]), gameAnnounceColour);
		message("To turn winter on or off, use /winter <winter state 0/1>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let winterState = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.winter", !!winterState);
	} else {
		if(typeof forceSnowing !== "undefined") {
			isWinter[gta.game] = !!winterState;
			forceSnowing(!!winterState);
			message("Winter mode has been turned " + getOnOffText(isWinter[gta.game]), gameAnnounceColour);
		}
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("snow", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Snow is currently turned " + getOnOffText(isSnowing[gta.game]), gameAnnounceColour);
		message("To turn snow on or off, use /" + String(command) + " <snow state 1/0>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let snowState = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.snow", !!snowState);
	} else {
		if(typeof snowing !== "undefined") {
			isSnowing[gta.game] = !!snowState;
			snowing = !!snowState;
			message("Snow has been turned " + getOnOffText(isSnowing[gta.game]), gameAnnounceColour);
		}
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("gamespeed", function(command, params) {
	if(isParamsInvalid(params)) {
		message("The current game speed is: " + String(gta.gameSpeed), gameAnnounceColour);
		message("To set the game speed, use /" + String(command) + " <speed>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let gameSpeed = Number(splitParams[0]) || 0;

	if(gameSpeed < 0) {
		message("The game speed cannot be negative!", errorMessageColour);
		return false;
	}

	if(isConnected) {
		triggerNetworkEvent("sb.w.gamespeed", gameSpeed);
	} else {
		gta.gameSpeed = gameSpeed;
		message("Game speed has been set to " + String(gameSpeed), gameAnnounceColour);
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("planes", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Airplanes are currently turned " + getOnOffText(planesEnabled[gta.game]), gameAnnounceColour);
		if(gta.game == GAME_GTA_VC) {
			message("To turn airplanes on or off, use /" + String(command) + " <state 1/0>", syntaxMessageColour);
		}
		return false;
	}

	let splitParams = params.split(" ");
	let planesState = Number(splitParams[0]);

	if(isConnected) {
		triggerNetworkEvent("sb.w.planes", !!planesState);
	} else {
		planesEnabled[gta.game] = !!planesState;
		setPlanesEnabled(planesEnabled[gta.game]);
		message("Planes have been turned " + getOnOffText(planesEnabled[gta.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("trains", function(command, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Trains are currently turned " + getOnOffText(trainsEnabled[gta.game]), gameAnnounceColour);
		if(gta.game != GAME_GTA_VC) {
			message("To turn trains on or off, use /" + String(command) + " <state 1/0>", syntaxMessageColour);
		} else {
			message("Trains cannot be enabled in Vice City (they don't exist!)", syntaxMessageColour);
		}
		return false;
	}

	let splitParams = params.split(" ");
	let trainsState = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.trains", !!trainsState);
	} else {
		trainsEnabled[gta.game] = !!trainsState;
		setTrainsEnabled(trainsEnabled[gta.game]);
		message("Trains have been turned " + getOnOffText(trainsEnabled[gta.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("traffic", function(command, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Traffic is currently turned " + getOnOffText(trafficEnabled[gta.game]), gameAnnounceColour);
		message("To turn traffic on or off, use /" + String(command) + " <state 1/0>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let trafficState = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.traffic", !!trafficState);
	} else {
		trafficEnabled[gta.game] = !!trafficState;
		gta.setTrafficEnabled(trafficEnabled[gta.game]);
		message("Traffic has been turned " + getOnOffText(trafficEnabled[gta.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civilians", function(command, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + command + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Civilians are currently turned " + getOnOffText(civiliansEnabled[gta.game]), gameAnnounceColour);
		message("To turn civilians on or off, use /" + command + " <state 1/0>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let civiliansState = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.civilians", !!civiliansState);
	} else {
		civiliansEnabled[gta.game] = !!civiliansState;
		gta.setCiviliansEnabled(civiliansEnabled[gta.game]);
		message("Civilians have been turned " + getOnOffText(civiliansEnabled[gta.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civdensity", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Civilian density is currently " + String(gta.civilianDensity), gameAnnounceColour);
		message("To set the civilian density, use /" + String(command) + " <amount>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let civilianDensity = Number(splitParams[0]) || gta.civilianDensity;

	if(isConnected) {
		triggerNetworkEvent("sb.w.civiliandensity", civilianDensity);
	} else {
		civilianDensity[gta.game] = civilianDensity;
		gta.pedDensity = civilianDensity;
		message("Civilian density has been set to " + String(civilianDensity), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("trafficdensity", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Traffic density is currently " + String(gta.civilianDensity), gameAnnounceColour);
		message("To set the traffic density, use /" + String(command) + " <amount>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let trafficDensity = Number(splitParams[0]) || gta.trafficDensity;

	if(isConnected) {
		triggerNetworkEvent("sb.w.trafficdensity", trafficDensity);
	} else {
		civilianDensity[gta.game] = trafficDensity;
		gta.civilianDensity = trafficDensity;
		message("Traffic density has been set to " + String(trafficDensity), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("minutedur", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + String(command) + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Minute duration is currently " + String(timeMinuteDuration[gta.game]), gameAnnounceColour);
		message("To set the minute duration, use /" + String(command) + " <time>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let minuteDuration = Number(splitParams[0]) || 0;

	if(isConnected) {
		triggerNetworkEvent("sb.w.minutedur", minuteDuration);
	} else {
		timeMinuteDuration[gta.game] = minuteDuration;
		gta.time.minuteDuration = minuteDuration;
		message("Minute duration has been set to " + String(timeMinuteDuration[gta.game]), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

function resyncWorld() {
	if(gta.game == GAME_GTA_IV) {
		if(gta.ivGamemode != 30) {
			return false;
		}
	}

	game.time.hour = timeLockHour[gta.game];
	game.time.minute = timeLockMinute[gta.game];
	game.time.minuteDuration = timeMinuteDuration[gta.game];

	if(typeof gta.forceWeather != "undefined") {
		gta.forceWeather(currentWeather[gta.game]);
	}

	if(gta.game <= GAME_GTA_SA) {
		gta.setTrafficEnabled(trafficEnabled[gta.game]);
		gta.setCiviliansEnabled(civiliansEnabled[gta.game]);

		gta.trafficDensity = trafficDensity[gta.game];
		gta.pedDensity = civilianDensity[gta.game];
	}

	// Trains are not available in GTA VC
	if(gta.game != GAME_GTA_VC) {
		gta.setTrainsEnabled(trainsEnabled[gta.game]);
	}

	// Winter is not available in > GTA SA
	if(gta.game < GAME_GTA_SA) {
		//if(gta.game == GAME_GTA_III) {
		//	if(isSnowing[gta.game]) {
		//		for(let i = 0; i <= 25; i++) {
		//			gta.setSurfaceTraction(i, gta.getSurfaceTraction(i)/2);
		//		}
		//	}
		//}
		snow.force(isWinter[gta.game]);
		snow.enabled = isSnowing[gta.game];
	}

	if(gta.game < GAME_GTA_IV) {
		for(let i in gameGarages[gta.game]) {
			if(gameGarages[gta.game][i][3]) {
				openGarage(Number(i));
			} else {
				closeGarage(Number(i));
			}
		}
	}

	if(gta.game < GAME_GTA_IV) {
		for(let i in gameStats[gta.game]) {
			gta.setGameStat(gameStats[gta.game][i][0], gameStats[gta.game][i][1]);
		}
	}
}

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function() {
	if(!isConnected) {
		if(timeLocked[gta.game]) {
			game.time.hour = timeLockHour[gta.game];
			game.time.minute = timeLockMinute[gta.game];
		}
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.winter", function(winter) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}

	if(gta.game < GAME_GTA_SA) {
		isWinter[gta.game] = winter;
		snow.force(winter);
	}
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.snow", function(snow) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}

	if(gta.game < GAME_GTA_SA) {
		isSnowing[gta.game] = snow;
		snow.enabled(winter);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.gamespeed", function(gameSpeed) {
	gta.gameSpeed = gameSpeed;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.civilians", function(state) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}

	//if(gta.game < GAME_GTA_SA) {
	//	civiliansEnabled[gta.game] = state;
	//	gta.setCiviliansEnabled(state);
	//}

	if(!state) {
		getPeds().forEach(function(ped) {
			if(ped.isLocal && ped.isType(ELEMENT_CIVILIAN)) {
				destroyElement(ped);
			}
		});
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.traffic", function(state) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}

	//if(gta.game < GAME_GTA_SA) {
	//	trafficEnabled[gta.game] = state;
	//	gta.setTrafficEnabled(state);
	//}

	if(!state) {
		getVehicles().forEach(function(vehicle) {
			if(vehicle.isLocal) {
				destroyElement(vehicle);
			}
		});
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.trains", function(state) {
	gta.setTrainsEnabled(state);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.minutedur", function(minuteDuration) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}

	timeMinuteDuration[gta.game] = minuteDuration;
	gta.time.minuteDuration = minuteDuration
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.garage", function(garageId, state) {
	if(state) {
		openGarage(garageId);
	} else {
		closeGarage(garageId);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.sync", function(weatherData, timeData, ambienceData, garages, stats) {
	console.log(`[Sandbox.Sync] Server game data received. Syncing client game data with server ...`);

	currentWeather[gta.game] = weatherData[0];
	console.log(`[Sandbox.Sync] Weather set to ${getWeatherName(currentWeather[gta.game])}`);

	isSnowing[gta.game] = weatherData[1];
	console.log(`[Sandbox.Sync] Falling snow turned ${getOnOffText(isSnowing[gta.game])}`);

	isWinter[gta.game] = weatherData[2];
	console.log(`[Sandbox.Sync] Ground snow turned ${getOnOffText(isWinter[gta.game])}`);

	//windSpeed[gta.game] = weatherData[3];
	//console.log(`[Sandbox.Sync] Wind speed set to set to ${windSpeed[gta.game]}`);

	timeLocked[gta.game] = timeData[0];
	console.log(`[Sandbox.Sync] Time lock turned ${getOnOffText(timeLocked[gta.game])}`);

	timeLockHour[gta.game] = timeData[1];
	timeLockMinute[gta.game] = timeData[2];
	console.log(`[Sandbox.Sync] Time lock time set to ${makeReadableTime(timeLockHour[gta.game], timeLockMinute[gta.game])}`);

	timeMinuteDuration[gta.game] = timeData[3];
	console.log(`[Sandbox.Sync] Minute duration set to ${timeMinuteDuration[gta.game]}`);

	trainsEnabled[gta.game] = ambienceData[0];
	console.log(`[Sandbox.Sync] Trains turned ${getOnOffText(trainsEnabled[gta.game])}`);

	planesEnabled[gta.game] = ambienceData[1];
	console.log(`[Sandbox.Sync] Airplanes turned ${getOnOffText(planesEnabled[gta.game])}`);

	civiliansEnabled[gta.game] = ambienceData[2];
	console.log(`[Sandbox.Sync] Civilians turned ${getOnOffText(civiliansEnabled[gta.game])}`);

	trafficEnabled[gta.game] = ambienceData[3];
	console.log(`[Sandbox.Sync] Traffic turned ${getOnOffText(trafficEnabled[gta.game])}`);

	civilianDensity[gta.game] = ambienceData[4];
	console.log(`[Sandbox.Sync] Civilian density set to ${civilianDensity[gta.game]}`);

	trafficDensity[gta.game] = ambienceData[5];
	console.log(`[Sandbox.Sync] Traffic density set to ${civilianDensity[gta.game]}`);

	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		for(let i in garages) {
			gameGarages[gta.game][i][3] = garages[i][1];
			if(gameGarages[gta.game][i][3] == true) {
				console.log(`[Sandbox.Sync] Garage ${garages[i][0]} (${gameGarages[gta.game][garages[i][0]][0]} in ${gameGarages[gta.game][garages[i][0]][1]} is open.`);
			} else {
				console.log(`[Sandbox.Sync] Garage ${garages[i][0]} (${gameGarages[gta.game][garages[i][0]][0]} in ${gameGarages[gta.game][garages[i][0]][1]} is closed.`);
			}
		}
	}

	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		for(let i in stats) {
			console.log(`[Sandbox.Sync] Game stat ${stats[i][0]} set to ${stats[i][1]}`);
		}
		gameStats[gta.game] = stats;
	}

	console.log(`[Sandbox.Sync] Game data is now synced with server! Applying changes ...`);
	resyncWorld();
});