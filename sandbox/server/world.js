"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.weather", function(client, weather, force) {
	currentWeather[server.game] = weather;
	if(force) {
		world.forceWeather(weather);
		message(client.name + " forced the weather to " + weatherNames[server.game][weather], gameAnnounceColours[serverGame]);
	} else {
		world.weather = weather;
		message(client.name + " set the weather to " + weatherNames[server.game][weather], gameAnnounceColours[serverGame]);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.winter", function(client, winter) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}
	
	isWinter[server.game] = winter;
	triggerNetworkEvent("sb.w.winter", null, isWinter[server.game]);
	message(client.name + " has " + String((isWinter[server.game]) ? "enabled" : "disabled") + " winter", gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.snow", function(client, snow) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}	
	
	isSnowing[serverGame] = snow;
	triggerNetworkEvent("sb.w.snow", null, isSnowing[server.game]);
	message(client.name + " has " + String((isSnowing[server.game]) ? "enabled" : "disabled") + " snow", gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.time", function(client, hour, minute) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}	
	
	timeLockHour[server.game] = hour;
	timeLockMinute[server.game] = minute;
	world.hour = hour;
	world.minute = minute;	
	message(client.name + " set the time to " + makeReadableTime(hour, minute), gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.timelock", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}	
	
	timeLocked = state;
	message(client.name + " has " + String((state==true) ? "enabled" : "disabled") + " time lock", gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.trains", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}	
	
	trainsEnabled[server.game] = state;
	world.trainsEnabled = state;
	message(client.name + " has " + String((state==true) ? "enabled" : "disabled") + " trains", gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.planes", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}	
	
	planesEnabled[server.game] = state;
	world.planesEnabled = state;
	message(client.name + " has " + String((state==true) ? "enabled" : "disabled") + " airplanes", gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.w.ssvbridge", function(client, state) {
	if(!client.administrator) {
		messageClient("You must be an administrator to change this!", errorMessageColour);
		return false;
	}		
	
	ssvBridgeEnabled = state;
	world.ssvBridgeEnabled = state;
	message(client.name + " has " + String((state==true) ? "enabled" : "disabled") + " the Shoreside Vale bridge", gameAnnounceColours[server.game]);
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
		],
		garages,
		gameStats[server.game],
	);
});

// ----------------------------------------------------------------------------

//