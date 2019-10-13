"use strict";

// ----------------------------------------------------------------------------

let isServer = true;
let serverGame = server.game;

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[serverGame];
let gameName = gameNames[serverGame];

// ----------------------------------------------------------------------------

addNetworkHandler("sb.e.del", function(client, element) {
	destroyElement(element);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.e.syncer", function(client, element) {
	element.syncer = client.index;
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(serverGame != GAME_GTA_IV && serverGame != GAME_GTA_IV_EFLC) {
		world.forceWeather(currentWeather[serverGame]);
		world.hour = timeLockHour[serverGame];
		world.minute = timeLockMinute[serverGame];
		if(serverGame != GAME_GTA_VC) {
			world.trainsEnabled = trainsEnabled[serverGame];
		}
		world.planesEnabled = planesEnabled[serverGame];
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(timeLocked) {
		world.hour = timeLockHour[serverGame];
		world.minute = timeLockMinute[serverGame];
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.clientready", function(client) {
	triggerNetworkEvent("sb.w.winter", client, isSnowing[serverGame], isWinter[serverGame]);
	
	for(let i in effects) {
		if(effects[i].exists) {
			triggerNetworkEvent("sb.ef.add", client, effects[i].effectID, effects[i].effectType, effects[i].position.x, effects[i].position.y, effects[i].position.z);
		}
	}
});

// ----------------------------------------------------------------------------

function getSyncerFromID(syncerID) {
	let clients = getClients();
	for(let i in clients) {
		if(i == syncerID) {
			return clients[i];
		}
	}
}