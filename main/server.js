"use strict";

let welcomeMessageColour = toColour(144, 255, 96, 255);
let spawnSkin = Array(128);
spawnSkin.fill(0);
let spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
let spawnScreenPedHeading = 195.0;
let spawnPoints = [
	null,															// GAME_UNKNOWN
	[1449.19, -197.21, 55.62], 			// GTA III
	[-592.0, 670.0, 11.0], 											// GTA Vice City
	[2495.1884765625, -1687.4456787109, 13.515254974365], 			// GTA San Andreas
	[2495.1884765625, -1687.4456787109, 13.515254974365], 			// GTA Underground
];
let spawnStartDimension = 20;
let mainWorldDimension = 0;
let inSpawnScreen = Array(128);
inSpawnScreen.fill(false);

let playerColours = [
	toColour(51, 153, 255, 255),
	COLOUR_WHITE,
	COLOUR_ORANGE,
	toColour(186, 85, 211, 255),
	toColour(144, 255, 96, 255),
	COLOUR_YELLOW,
	COLOUR_AQUA,
	COLOUR_LIME,
	toColour(237, 67, 55, 255),
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
	
	if(inSpawnScreen[client.index]) {
		client.player.dimension = spawnStartDimension + client.index;
	} else {
		client.player.dimension = mainWorldDimension;
	}
	
	client.player.setData("colour", playerColours[client.index], true);	
}

addEventHandler("OnPlayerJoined", function (event, client) {
	messageClient("Welcome to Vortrex's Test Server!", client, welcomeMessageColour);
	messageClient("Use F1 to respawn.", client, welcomeMessageColour);

	respawnPlayer(client);
	fadeCamera(client, true);
});

addEventHandler("OnPedWasted", function(event, ped, attacker, weapon, pedPiece) {
	let client = getClientFromElement(ped);
	if(client != null) {
		inSpawnScreen[client.index] = true;
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
	inSpawnScreen[client.index] = true;
	respawnPlayer(client);
});

// Spawnscreen select this skin
addNetworkHandler("v.ss.sel", function(client, skinID) {
	inSpawnScreen[client.index] = false;
	spawnSkin[client.index] = skinID;
	respawnPlayer(client);
});