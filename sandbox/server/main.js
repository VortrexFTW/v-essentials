"use strict";

// ----------------------------------------------------------------------------

let serverGame = server.game;

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[server.game];
let gameName = gameNames[server.game];

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
		gta.forceWeather(currentWeather[serverGame]);
		gta.hour = timeLockHour[serverGame];
		gta.minute = timeLockMinute[serverGame];
		if(serverGame != GAME_GTA_VC) {
			gta.trainsEnabled = trainsEnabled[serverGame];
		}
		gta.planesEnabled = planesEnabled[serverGame];
	}
});

// ----------------------------------------------------------------------------

//addEventHandler("OnResourceStart", function(event, resource) {
//	console.log("[Sandbox] Resource '" + resource.name + "' started!");
//});

// ----------------------------------------------------------------------------

//addEventHandler("OnResourceStop", function(event, resource) {
//	console.log("[Sandbox] Resource '" + resource.name + "' stopped!");
//});

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(timeLocked[serverGame]) {
		gta.time.hour = timeLockHour[serverGame];
		gta.time.minute = timeLockMinute[serverGame];
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.clientready", function(client) {
	triggerNetworkEvent("sb.w.winter", client, isSnowing[serverGame], isWinter[serverGame]);
	
	//customEffects.forEach(function(customEffect) {
	//	if(customEffect.exists) {
	//		triggerNetworkEvent("sb.ef.add", client, customEffect.effectID, customEffect.effectType, customEffect.position.x, customEffect.position.y, customEffect.position.z);
	//	}
	//});
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

// ----------------------------------------------------------------------------

addNetworkHandler("sb.msg", function(client, messageText) {
	outputSandboxMessage(messageText);
});

// ----------------------------------------------------------------------------

function outputSandboxMessage(messageText) {
	console.log(messageText);
	message(messageText, gameAnnounceColour);
}

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, disconnectReason) {
	setTimeout(beginSandboxCleanup, 5000);
});

// ----------------------------------------------------------------------------

function beginSandboxCleanup() {
	if(getClients().length == 0) {
		console.log("[Sandbox] Performing cleanup. Removing all player spawned vehicles.");
		let vehicles = getElementsByType(ELEMENT_VEHICLE).filter(vehicle => vehicle.getData("sb.v.addedby") != null);
		vehicles.forEach(function(vehicle2) { 
			destroyElement(vehicle2);
		});
		console.log("[Sandbox] Removed " + String(vehicles.length) + " player spawned vehicles");
		
		if(findResourceByName("v-parkedcars") != null) {
			if(findResourceByName("v-parkedcars").isStarted) {
				findResourceByName("v-parkedcars").restart();
			}
		}
		console.log("[Sandbox] Removed " + String(vehicles.length) + " player spawned vehicles");
	}
}

// ----------------------------------------------------------------------------