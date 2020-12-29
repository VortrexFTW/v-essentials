"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.weather", function(client, weather, force) {
	let outputMessage = "";
	
	currentWeather[server.game] = weather;
	if(force) {
		gta.forceWeather(weather);
		outputMessage = "forced the weather to " + weatherNames[server.game][weather];
	} else {
		gta.weather = weather;
		outputMessage = "set the weather to " + weatherNames[server.game][weather];
	}
	
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.winter", function(client, winter) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}
	
	let outputMessage = "";
	
	isWinter[server.game] = winter;
	
	triggerNetworkEvent("sb.w.winter", null, isWinter[server.game]);
	outputMessage = String((isWinter[server.game]) ? "enabled" : "disabled") + " winter";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.garage", function(client, garageId, state) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}
	
	let outputMessage = "";
	
	gameGarages[server.game][garageId][3] = state;
	
	triggerNetworkEvent("sb.w.garage", null, garageId, gameGarages[server.game][garageId][3]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.snow", function(client, snow) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}	
	
	let outputMessage = "";
	
	isSnowing[serverGame] = snow;
	
	triggerNetworkEvent("sb.w.snow", null, isSnowing[server.game]);
	outputMessage = String((isSnowing[server.game]) ? "enabled" : "disabled") + " falling snow";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.garage", function(client, garageId, state) {
	let outputMessage = "";
	
	triggerNetworkEvent("sb.w.garage", null, state);
	outputMessage = String((state) ? "opened" : "closed") + " '" + String(garageNames[server.game][garageId]);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.time", function(client, hour, minute) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}	
	
	let outputMessage = "";
	
	timeLockHour[server.game] = hour;
	timeLockMinute[server.game] = minute;
	gta.time.hour = hour;
	gta.time.minute = minute;	
	
	outputMessage = "set the time to " + makeReadableTime(hour, minute);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.minutedur", function(client, minuteDuration) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}
	
	let outputMessage = "";
	
	timeMinuteDuration[server.game] = minuteDuration;	
	
	triggerNetworkEvent("sb.w.minutedur", null, timeMinuteDuration[server.game]);
	outputMessage = "set the minute duration to " + String(minuteDuration);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.timelock", function(client, state) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}	
	
	let outputMessage = "";
	
	timeLocked[server.game] = !!state;
	
	outputMessage = String((timeLocked[server.game]) ? "enabled" : "disabled") + " time lock";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.trains", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}	

	let outputMessage = "";

	trainsEnabled[server.game] = state;
	gta.trainsEnabled = state;

	triggerNetworkEvent("sb.w.trains", null, state);
	
	outputMessage = String((trainsEnabled[server.game]) ? "enabled" : "disabled") + " trains";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.planes", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}
	
	let outputMessage = "";
	
	planesEnabled[server.game] = state;
	gta.planesEnabled = state;
	
	outputMessage = String((planesEnabled[server.game]) ? "enabled" : "disabled") + " airplanes";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.ssvbridge", function(client, state) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}

	let outputMessage = "";	
	
	ssvBridgeEnabled = state;
	gta.ssvBridgeEnabled = state;
	
	outputMessage = String((state) ? "enabled" : "disabled") + " the Shoreside Vale bridge";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.civilians", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}
	
	let outputMessage = "";
	
	civiliansEnabled[server.game] = state;
	triggerNetworkEvent("sb.w.civilians", null, state);	
	
	outputMessage = String((state) ? "enabled" : "disabled") + " civilians";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.traffic", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}
	
	let outputMessage = "";
	
	trafficEnabled[server.game] = state;
	triggerNetworkEvent("sb.w.traffic", null, state);	
	
	outputMessage = String((state==true) ? "enabled" : "disabled") + " traffic";
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.civiliandensity", function(client, density) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}
	
	let outputMessage = "";
	
	civilianDensity[server.game] = density;
	triggerNetworkEvent("sb.w.civiliandensity", null, civilianDensity[server.game]);
	
	outputMessage = "set civilian density to " + String(density);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.gamespeed", function(client, gamespeed) {
	//if(!client.administrator) {
	//	messageClient("You must be an administrator to change this!", client, errorMessageColour);
	//	return false;
	//}
	
	let outputMessage = "";
	
	triggerNetworkEvent("sb.w.gamespeed", null, gamespeed);
	
	outputMessage = "set game speed to " + String(gamespeed);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.trafficdensity", function(client, density) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", client, errorMessageColour);
		return false;
	}
	
	let outputMessage = "";
	
	trafficDensity[server.game] = density;
	triggerNetworkEvent("sb.w.trafficdensity", null, trafficDensity[server.game]);
	
	outputMessage = "set traffic density to " + String(density);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

//weatherId, timeLock, timeHour, timeMinute, trains, planes, snowing, winter, civilians, traffic, garages, stats
addNetworkHandler("sb.w.sync", function(client) {
	let garages = [];
	for(let i in gameGarages[server.game]) {
		garages.push([i, gameGarages[server.game][i][3]]);
	}
	
	triggerNetworkEvent("sb.w.sync", client, 
		[
			currentWeather[server.game], 
			isSnowing[server.game],
			isWinter[server.game],
			windSpeed[server.game],
		],
		[
			timeLocked[server.game], 
			timeLockHour[server.game], 
			timeLockMinute[server.game],
			timeMinuteDuration[server.game],
		],
		[
			trainsEnabled[server.game],
			planesEnabled[server.game],
			civiliansEnabled[server.game],
			trafficEnabled[server.game],
			civilianDensity[server.game],
			trafficDensity[server.game],	
		],
		garages,
		gameStats[server.game],
	);
});

// ----------------------------------------------------------------------------

//