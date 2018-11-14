"use strict";

let serverGame = GAME_GTA_III;

// ----------------------------------------------------------------------------

let spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
let spawnScreenPedHeading = 195.0;
let spawnPoints = [
	null,															// GAME_UNKNOWN
	new Vec3(1449.19, -197.21, 55.62), 			// GTA III
	new Vec3(-592.0, 670.0, 11.0), 											// GTA Vice City
	new Vec3(2495.1884765625, -1687.4456787109, 13.515254974365), 			// GTA San Andreas
	new Vec3(2495.1884765625, -1687.4456787109, 13.515254974365), 			// GTA Underground
];

// ----------------------------------------------------------------------------

let spawnStartDimension = 129;
let mainWorldDimension = 0;

// ----------------------------------------------------------------------------

let inSpawnScreen = Array(128);
inSpawnScreen.fill(false);

let spawnSkin = Array(128);
spawnSkin.fill(0);

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	respawnPlayer(client);
});

// ----------------------------------------------------------------------------

function respawnPlayer(client) {
	if(client.player != null) {
		destroyElement(client.player);
	}
	
	spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[client.index], 0, 0);
	setTimeout(setUpSpawnScreen, 250, client);
}

// ----------------------------------------------------------------------------

function setUpSpawnScreen(client) {
	if(inSpawnScreen[client.index]) {
		triggerNetworkEvent("v.ss.start", client);
		client.player.dimension = spawnStartDimension + client.index;
	} else {
		client.player.dimension = mainWorldDimension;
	}
}

// ----------------------------------------------------------------------------

addEventHandler("OnPedWasted", function(event, ped, attacker, weapon, pedPiece) {
	let client = getClientFromPed(ped);
	if(client != null) {
		inSpawnScreen[client.index] = true;
		setTimeout(respawnPlayer, 200, client);
	}
});

// ----------------------------------------------------------------------------

// F1 will trigger this...
addNetworkHandler("v.respawn", function(client) {
	inSpawnScreen[client.index] = true;
	setTimeout(respawnPlayer, 100, client);
});

// ----------------------------------------------------------------------------

// Spawnscreen select this skin
addNetworkHandler("v.ss.sel", function(client, skinID) {
	inSpawnScreen[client.index] = false;
	spawnSkin[client.index] = skinID;
	setTimeout(respawnPlayer, 100, client);
});

// ----------------------------------------------------------------------------

function getClientFromPed(ped) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].player == ped) {
			return clients[i];
		}
	}
	
	return false;
}