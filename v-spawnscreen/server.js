"use strict";

// ----------------------------------------------------------------------------

let serverGame = server.game;
let spawnScreenEnabled = true;

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

if (serverGame == GAME_GTA_III) {
	spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
	spawnScreenPedHeading = 15.0;
} else if (serverGame == GAME_GTA_VC) {
	spawnScreenPedPosition = new Vec3(-379.16, -535.27, 17.28);
	spawnScreenPedHeading = 0.0;
} else if (serverGame == GAME_GTA_SA) {
	spawnScreenPedPosition = new Vec3(2495.03, -1685.66, 13.51);
	spawnScreenPedHeading = 0.01;
} else if (serverGame == GAME_GTA_IV || serverGame == GAME_GTA_IV_EFLC) {
	spawnScreenPedPosition = new Vec3(900.94, -506.06, 15.044);
	spawnScreenPedHeading = -1.642;
}

// ----------------------------------------------------------------------------

let spawnPoints = [
	null,																	// GAME_UNKNOWN
	new Vec3(1449.19, -197.21, 55.62), 										// GTA III
	new Vec3(-379.16, -535.27, 17.28), 										// GTA Vice City
	new Vec3(2495.1884765625, -1687.4456787109, 13.515254974365), 			// GTA San Andreas
	new Vec3(2495.1884765625, -1687.4456787109, 13.515254974365), 			// GTA Underground
	new Vec3(900.94, -506.06, 15.044),							 			// GTA IV
	new Vec3(900.94, -506.06, 15.044),							 			// GTA IV: EFLC
];

// ----------------------------------------------------------------------------

let spawnStartDimension = 0;
let mainWorldDimension = 0;

// ----------------------------------------------------------------------------

let spawnSkin = [null, 0, 0, 0, 0, -142386662, -142386662];

// ----------------------------------------------------------------------------

addEventHandler("onPedDeath", function (event, ped) {
	if (server.game == 5) {
		return false;
	}

	if (ped.type == ELEMENT_PLAYER) {
		let client = getClientFromPed(ped);
		if (client != null) {
			spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[server.game], 0, 0);
			destroyElement(ped);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("onPlayerJoined", function (event, client) {
	if (spawnScreenEnabled) {
		if (server.game < GAME_GTA_IV) {
			setTimeout(function () {
				fadeCamera(client, true);
				console.log(`[SPAWN] ${client.name} spawned as ${getSkinName(spawnSkin[server.game])}`);
				spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[server.game], 0, 0);
			}, 1000);
		} else {
			triggerNetworkEvent("v.spawn", client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
		}
	}

	fadeCamera(client, true);
	console.log(`[SPAWN] ${client.name} spawned as ${getSkinName(spawnSkin[server.game])}`);
	spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[server.game], 0, 0);
});

// ----------------------------------------------------------------------------

function getClientFromPed(ped) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player == ped) {
			return clients[i];
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function getSkinName(skinId) {
	let sandboxResource = findResourceByName("sandbox");
	if (sandboxResource && sandboxResource.isStarted) {
		return sandboxResource.exports.getSkinName(skinId);
	}
	return false;
}

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	//if(server.game == GAME_GTA_IV || server.game == GAME_GTA_IV_EFLC) {
	//	console.warn("The v-spawnscreen resource doesn't work on GTA IV or Episodes From Liberty City (EFLC). Stopping resource ...");
	//	thisResource.stop();
	//}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.ss.ivskinsel", function (client, skinId) {
	spawnPlayer(client, spawnScreenPedPosition, spawnScreenPedHeading, skinId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.ss.ivskinsel", function (client, skinId) {
	spawnPlayer(client, spawnScreenPedPosition, spawnScreenPedHeading, skinId);
});

// ----------------------------------------------------------------------------