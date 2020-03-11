"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let serverGame = server.game;
let spawnScreenEnabled = false;

// ----------------------------------------------------------------------------

let spawnScreenPedPosition = new Vec3(0.0, 0.0, 0.0);
let spawnScreenPedHeading = 0.0;

// ----------------------------------------------------------------------------

let gameAnnounceColours = [
	COLOUR_BLACK,					// Invalid
	COLOUR_SILVER,					// GTA III
	COLOUR_AQUA,					// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	COLOUR_SILVER,					// GTA IV
	COLOUR_SILVER					// GTA IV (EFLC)		
];

// ----------------------------------------------------------------------------

if(serverGame == GAME_GTA_III) {
	spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
	spawnScreenPedHeading = 15.0;
} else if(serverGame == GAME_GTA_VC) {
	spawnScreenPedPosition = new Vec3(-379.16, -535.27, 17.28);
	spawnScreenPedHeading = 0.0;
} else if(serverGame == GAME_GTA_SA) {
	spawnScreenPedPosition = new Vec3(2495.03, -1685.66, 13.51);
	spawnScreenPedHeading = 0.01;	
} else if(serverGame == GAME_GTA_IV || serverGame == GAME_GTA_IV_EFLC) {
	spawnScreenPedPosition = new Vec3(904.27, -498.00, 14.522);
	spawnScreenPedHeading = 3.127;	
}

// ----------------------------------------------------------------------------

let spawnPoints = [
	null,																	// GAME_UNKNOWN
	new Vec3(1449.19, -197.21, 55.62), 										// GTA III
	new Vec3(-379.16, -535.27, 17.28), 										// GTA Vice City
	new Vec3(2495.1884765625, -1687.4456787109, 13.515254974365), 			// GTA San Andreas
	new Vec3(2495.1884765625, -1687.4456787109, 13.515254974365), 			// GTA Underground
	new Vec3(904.27, -498.00, 14.522),							 			// GTA IV
	new Vec3(904.27, -498.00, 14.522),							 			// GTA IV: EFLC
];

// ----------------------------------------------------------------------------

let spawnStartDimension = 129;
let mainWorldDimension = 0;

// ----------------------------------------------------------------------------

let inSpawnScreen = Array(128);
inSpawnScreen.fill(false);

let spawnSkin = Array(128);
if(server.game == GAME_GTA_IV || server.game == GAME_GTA_IV_EFLC) {
	spawnSkin.fill(0);
} else {
	spawnSkin.fill(0);
}

// ----------------------------------------------------------------------------

addNetworkHandler("v.ss.ready", function(client) {
	client.setData("v.ss.ready", true, true);
	if(spawnScreenEnabled) {
		respawnPlayer(client);
	} else {
		inSpawnScreen[client.index] = false;
		respawnPlayer(client);
	}
	triggerNetworkEvent("v.ss.start", client);
});

// ----------------------------------------------------------------------------

function respawnPlayer(client) {
	if(client.player != null) {
		destroyElement(client.player);
	}
	
	spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[client.index], 0, 0);
	if(spawnScreenEnabled) {
		setTimeout(setUpSpawnScreen, 250, client);
	}
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
	if(ped.type == ELEMENT_PLAYER) {
		let client = getClientFromPed(ped);
		if(client != null) {
			if(spawnScreenEnabled) {
				inSpawnScreen[client.index] = true;
			}
			setTimeout(respawnPlayer, 200, client);
		}
	}
});

// ----------------------------------------------------------------------------

// F1 will trigger this...
addNetworkHandler("v.respawn", function(client) {
	if(spawnScreenEnabled) {
		inSpawnScreen[client.index] = true;
	}
	setTimeout(respawnPlayer, 100, client);
});

// ----------------------------------------------------------------------------

// Spawnscreen select this skin
addNetworkHandler("v.ss.sel", function(client, skinId) {
	inSpawnScreen[client.index] = false;
	spawnSkin[client.index] = skinId;
	setTimeout(respawnPlayer, 100, client, skinId);
	message(String(client.name) + " spawned as " + String(getSkinName(skinId)), gameAnnounceColours[server.game]);
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

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(client, disconnectType) {
	spawnSkin[client.index] = 0;
});

// ----------------------------------------------------------------------------

addCommandHandler("spawnscreen", function(cmdName, params, client) {
	if(client.administrator) {
		if(spawnScreenEnabled) {
			spawnScreenEnabled = false;
			message("[SERVER]: Spawn screen has been turned OFF.", COLOUR_YELLOW);	
		} else {
			spawnScreenEnabled = true;
			message("[SERVER]: Spawn screen has been turned ON.", COLOUR_YELLOW);	
		}
	}
});

// ----------------------------------------------------------------------------

function getSkinName(skinId) {
	let sandboxResource = findResourceByName("sandbox");
	if(sandboxResource && sandboxResource.isStarted) {
		return sandboxResource.exports.getSkinName(skinId);
	}
	return false;
}

// ----------------------------------------------------------------------------