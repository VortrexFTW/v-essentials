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
			forceWeather(weatherId);	
			message("The weather has been forced to " + getWeatherName(currentWeather[gta.game]), gameAnnounceColour);
		} else {
			currentWeather = weatherId;	
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

addCommandHandler("winter", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + command + " command is not available on this game!", errorMessageColour);
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
		isWinter[gta.game] = !!winterState;
		forceSnowing(!!winterState);
		message("Winter mode has been turned " + getOnOffText(isWinter[gta.game]), gameAnnounceColour);
	}
	
	return true;	
});

// ----------------------------------------------------------------------------

addCommandHandler("snow", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + command + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Snow is currently turned " + getOnOffText(isSnowing[gta.game]), gameAnnounceColour);
		message("To turn snow on or off, use /" + command + " <snow state 1/0>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let snowState = Number(splitParams[0]) || 0;
	
	if(isConnected) {
		triggerNetworkEvent("sb.w.snow", !!snowState);
	} else {
		isSnowing[gta.game] = !!snowState;
		forceSnowing(!!snowState);
		message("Snow has been turned " + getOnOffText(isSnowing[gta.game]), gameAnnounceColour);
	}
	
	return true;	
});

// ----------------------------------------------------------------------------

addCommandHandler("gamespeed", function(command, params) {
	if(isParamsInvalid(params)) {
		message("The current game speed is: " + String(gta.gameSpeed), gameAnnounceColour);
		message("To set the game speed, use /" + command + " <speed>", syntaxMessageColour);
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
		message("The /" + command + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(isParamsInvalid(params)) {
		message("Airplanes are currently turned " + getOnOffText(trainsEnabled[gta.game]), gameAnnounceColour);
		if(gta.game == GAME_GTA_VC) {
			message("To turn airplanes on or off, use /" + command + " <state 1/0>", syntaxMessageColour);
		}
		return false;
	}		
	
	let splitParams = params.split(" ");
	let planesState = Number(splitParams[0]) || 0;	
	
	if(isConnected) {
		triggerNetworkEvent("sb.w.planes", planesEnabled[gta.game]);
	} else {
		planesEnabled[gta.game] = !!planesState;
		setPlanesEnabled(planesEnabled[gta.game]);
		message("Planes have been turned " + getOnOffText(planesEnabled[gta.game]), gameAnnounceColour);
	}
	return true;	
});

// ----------------------------------------------------------------------------

addCommandHandler("trains", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + command + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Trains are currently turned " + getOnOffText(trainsEnabled[gta.game]), gameAnnounceColour);
		if(gta.game != GAME_GTA_VC) {
			message("To turn trains on or off, use /" + command + " <state 1/0>", syntaxMessageColour);
		} else {
			message("Trains cannot be enabled in Vice City (they don't exist!)", syntaxMessageColour);
		}
		return false;
	}	
	
	let splitParams = params.split(" ");
	let planesState = Number(splitParams[0]) || 0;
	
	trainsEnabled[gta.game] = !trainsEnabled[gta.game];
	
	if(isConnected) {
		triggerNetworkEvent("sb.w.planes", trainsEnabled[gta.game]);
	} else {
		trainsEnabled[gta.game] = !!trainsState;
		setTrainsEnabled(trainsEnabled[gta.game]);
		message("Trains have been turned " + getOnOffText(trainsEnabled[gta.game]), gameAnnounceColour);
	}
	return true;	
});

// ----------------------------------------------------------------------------

addCommandHandler("traffic", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + command + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Traffic is currently turned " + getOnOffText(trafficEnabled[gta.game]), gameAnnounceColour);
		message("To turn traffic on or off, use /" + command + " <state 1/0>", syntaxMessageColour);
		return false;
	}	
	
	let splitParams = params.split(" ");
	let trafficState = Number(splitParams[0]) || 0;
	
	if(isConnected) {
		triggerNetworkEvent("sb.w.traffic", trafficEnabled[gta.game]);
	} else {
		trafficEnabled[gta.game] = !!trafficState;
		gta.setTrafficEnabled(trafficEnabled[gta.game]);
		message("Traffic has been turned " + getOnOffText(trafficEnabled[gta.game]), gameAnnounceColour);
	}
	return true;	
});

// ----------------------------------------------------------------------------

addCommandHandler("civilians", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + command + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Civilians are currently turned " + getOnOffText(civiliansEnabled[gta.game]), gameAnnounceColour);
		message("To turn traffic on or off, use /" + command + " <state 1/0>", syntaxMessageColour);
		return false;
	}	
	
	let splitParams = params.split(" ");
	let civiliansState = Number(splitParams[0]) || 0;
	
	if(isConnected) {
		triggerNetworkEvent("sb.w.civilians", civiliansEnabled[gta.game]);
	} else {
		civiliansEnabled[gta.game] = !!civiliansState;
		gta.setCiviliansEnabled(civiliansEnabled[gta.game]);
		message("Civilians have been turned " + getOnOffText(civiliansEnabled[gta.game]), gameAnnounceColour);
	}
	return true;	
});

// ----------------------------------------------------------------------------

addCommandHandler("minutedur", function(command, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + command + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Minute duration is currently " + String(timeMinuteDuration[gta.game]), gameAnnounceColour);
		message("To set the minute duration, use /" + command + " <time>", syntaxMessageColour);
		return false;
	}	
	
	let splitParams = params.split(" ");
	let minuteDuration = Number(splitParams[0]) || 0;
	
	if(isConnected) {
		triggerNetworkEvent("sb.w.minutedur", timeMinuteDuration[gta.game]);
	} else {
		timeMinuteDuration[gta.game] = minuteDuration;
		gta.time.minuteDuration = minuteDuration;
		message("Minute duration has been set to " + String(timeMinuteDuration[gta.game]), gameAnnounceColour);
	}
	return true;	
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	if(isConnected) {
		triggerNetworkEvent("sb.w.sync");
	} else {
		resyncWorld();
	}
});

// ----------------------------------------------------------------------------

function resyncWorld() {
	game.time.hour = timeLockHour[gta.game];
	game.time.minute = timeLockMinute[gta.game];
	game.time.minuteDuration = timeMinuteDuration[gta.game];
	
	if(typeof forceWeather != "undefined") {
		forceWeather(currentWeather[gta.game]);
	}
	
	setTrafficEnabled(trafficEnabled[gta.game]);
	setCiviliansEnabled(civiliansEnabled[gta.game]);
	
	// Trains are not available in GTA VC
	if(gta.game != GAME_GTA_VC) {
		setTrainsEnabled(trainsEnabled[gta.game]);
	}
	
	// Winter is not available in GTA SA or higher
	if(gta.game < GAME_GTA_SA) {
		forceSnowing(isWinter[gta.game]);
		snowing = isSnowing[gta.game];					
	}
	
	if(gta.game < GAME_GTA_IV) {
		for(let i in gameGarages[gta.game]) {
			console.log(gameGarages[gta.game][i][3]);
			if(gameGarages[gta.game][i][3]) {
				if(isGarageClosed(Number(i))) {
					openGarage(Number(i));
				}
			} else {
				if(!isGarageClosed(Number(i))) {
					closeGarage(Number(i));
				}
			}	
		}
	}
	
	for(let i in gameStats[gta.game]) {
		gta.setGameStat(gameStats[gta.game][i][0], gameStats[gta.game][i][1]);
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
	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG || gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}
	
	isWinter[gta.game] = winter;
	forceSnowing(winter);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.snow", function(snow) {
	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG || gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}	
	
	isSnowing[gta.game] = snow;
	snowing = snow;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.minutedur", function(minuteDuration) {
	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG || gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}
	
	timeMinuteDuration[gta.game] = minuteDuration;
	gta.time.minuteDuration = minuteDuration
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.sync", function(weatherData, timeData, ambienceData, garages, stats) {
	console.log("[Sandbox.Sync] Server game data received. Syncing client game data with server ...");
	
	currentWeather[gta.game] = weatherData[0];
	console.log("[Sandbox.Sync] Weather set to " + getWeatherName(currentWeather[gta.game]));
	
	isSnowing[gta.game] = weatherData[1];
	console.log("[Sandbox.Sync] Falling snow turned " + getOnOffText(isSnowing[gta.game]));
	
	isWinter[gta.game] = weatherData[2];
	console.log("[Sandbox.Sync] Ground snow turned " + getOnOffText(isWinter[gta.game]));	
	
	//windSpeed[gta.game] = weatherData[3];	
	//console.log("[Sandbox.Sync] Wind speed set to set to " + String(windSpeed[gta.game]);	
	
	timeLocked[gta.game] = timeData[0];
	console.log("[Sandbox.Sync] Time lock turned " + getOnOffText(timeLocked[gta.game]));
	
	timeLockHour[gta.game] = timeData[1];
	timeLockMinute[gta.game] = timeData[2];
	console.log("[Sandbox.Sync] Time lock time set to " + makeReadableTime(timeLockHour[gta.game], timeLockMinute[gta.game]));
	
	timeMinuteDuration[gta.game] = timeData[3];	
	console.log("[Sandbox.Sync] Minute duration set to " + String(timeMinuteDuration[gta.game]));
	
	trainsEnabled[gta.game] = ambienceData[0];
	console.log("[Sandbox.Sync] Trains turned " + getOnOffText(trainsEnabled[gta.game]));
	
	planesEnabled[gta.game] = ambienceData[1];
	console.log("[Sandbox.Sync] Airplanes turned " + getOnOffText(planesEnabled[gta.game]));
	
	civiliansEnabled[gta.game] = ambienceData[2];
	console.log("[Sandbox.Sync] Client-side civilians turned " + getOnOffText(civiliansEnabled[gta.game]));
	
	trafficEnabled[gta.game] = ambienceData[3];
	console.log("[Sandbox.Sync] Client-side traffic turned " + getOnOffText(trafficEnabled[gta.game]));

	
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		for(let i in garages) {
			gameGarages[gta.game][i][3] = garages[i][1];
			if(gameGarages[gta.game][i][3] == true) {
				console.log("[Sandbox.Sync] Garage " + String(garages[i][0]) + " (" + gameGarages[gta.game][garages[i][0]][0] + " in " + gameGarages[gta.game][garages[i][0]][1] + ") is open.");
			} else {
				console.log("[Sandbox.Sync] Garage " + String(garages[i][0]) + " (" + gameGarages[gta.game][garages[i][0]][0] + " in " + gameGarages[gta.game][garages[i][0]][1] + ") is closed.");
			}
		}
	}
	
	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG) {
		for(let i in stats) {
			console.log("[Sandbox.Sync] Game stat " + String(stats[i][0]) + " set to " + String(stats[i][1]));
		}
		gameStats[gta.game] = stats;
	}
	
	console.log("[Sandbox.Sync] Game data is now synced with server! Applying changes ...");
	resyncWorld();
});