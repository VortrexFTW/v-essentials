"use strict";

let welcomeMessageColour = toColour(144, 255, 96, 255);
let spawnSkin = Array(128);
spawnSkin.fill(0);
let spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
let spawnScreenPedHeading = 195.0;
let spawnPoints = [
	null,															// GAME_UNKNOWN
	[1040.037109375,-665.473876953125,14.972699165344238], 			// GTA III
	[-592.0, 670.0, 11.0], 											// GTA Vice City
	[2495.1884765625, -1687.4456787109, 13.515254974365], 			// GTA San Andreas
	[2495.1884765625, -1687.4456787109, 13.515254974365], 			// GTA Underground
];

// There is no better way currently so we define this crappy util function...
function getClientFromElement(element) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].player == element) {
			return clients[i];
		}
	}
	return null;
}

// Just so I don't repeat calls to spawnPlayer everywhere...
function respawnPlayer(client) {
	if(client.player != null) {
		destroyElement(client.player);
	}
	
	spawnPlayer(client, spawnPoints[client.game], 0.0, spawnSkin[client.index], 0, 0);
	//spawnPlayer(client, spawnPoints[client.game], 0.0, 0, 0, 0);
}

addEventHandler("OnPlayerJoined", function (event, client) {
	messageClient("Welcome to Vortrex's Test Server!", client, welcomeMessageColour);
	messageClient("Use F1 to respawn.", client, welcomeMessageColour);

	respawnPlayer(client);
	//triggerNetworkEvent("v.ss.start", client);
	fadeCamera(client, true);
});

addEventHandler("OnPedWasted", function(event, ped, attacker, weapon, pedPiece) {
	let client = getClientFromElement(ped);
	if(client != null) {
		respawnPlayer(client);
		triggerNetworkEvent("v.ss.start", client);
	}
});

// If there is a respawn timer then clear it!
addEventHandler("OnElementDestroy", function(event, element) {
	if(element.type == ELEMENT_PED) {
		let respawnTimer = element.getData("respawnTimer");
		if(respawnTimer) {
			clearTimeout(respawnTimer);
			element.removeData("respawnTimer");
		}
	}
});

// F1 will trigger this...
addNetworkHandler("v.respawn", function(client) {
	respawnPlayer(client);
	triggerNetworkEvent("v.ss.start", client);
});

// Spawnscreen select this skin
addNetworkHandler("v.ss.sel", function(client, skinID) {
	spawnSkin[client.index] = skinID;
	respawnPlayer(client);
});

addNetworkHandler("v.mainmenu.sel", function(client, menuOption) {
	switch(menuOption) {
		case 0: // Spawn
			respawnPlayer(client);
			break;
		case 1: // Quit
			triggerNetworkEvent("v.exitgame", client);
			break;			
	}
});