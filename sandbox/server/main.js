"use strict";

// ----------------------------------------------------------------------------

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

addEventHandler("OnResourceStart", function(event, resource) {
	console.warn("[Sandbox] Resource '" + resource.name + "' started!");
});

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStop", function(event, resource) {
	console.warn("[Sandbox] Resource '" + resource.name + "' stopping!!");
	
	collectAllGarbage();
});

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
	console.log("[Sandbox] " + String(client.name) + " " + messageText);
	outputSandboxMessage(client, messageText);
});

// ----------------------------------------------------------------------------

function outputSandboxMessage(client, messageText) {
	//console.log(client.name + " " + messageText);
	//if(findResourceByName("v-chat").isStarted) {
	//	if(typeof findResourceByName("v-chat").exports.translateSandboxMessage != "undefined") {
	//		findResourceByName("v-chat").exports.translateSandboxMessage(client, messageText, gameAnnounceColour);
	//		return true;
	//	}
	//}
	
	message(String(client.name) + " " + messageText, gameAnnounceColour);
}

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, disconnectReason) {
	setTimeout(beginSandboxCleanup, 5000);
});

// ----------------------------------------------------------------------------

function beginSandboxCleanup() {
	if(getClients().length == 0) {
		console.log("[Sandbox] Server is empty. Performing cleanup.");
		//let vehicles = getElementsByType(ELEMENT_VEHICLE).filter(vehicle => vehicle.getData("sb.v.addedby") != null);
		getVehicles().forEach(function(vehicle) { 
			destroyElement(vehicle);
		});

		//let civilians = getElementsByType(ELEMENT_CIVILIAN).filter(civilian => civilian.getData("sb.c.addedby") != null);
		getCivilians().forEach(function(civilian) { 
			destroyElement(civilian);
		});		
	}

	collectAllGarbage();
}

// ----------------------------------------------------------------------------