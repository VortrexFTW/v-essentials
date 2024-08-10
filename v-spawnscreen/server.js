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
	COLOUR_SILVER,					// GTA IV (EFLC)
	COLOUR_BLACK,					// Invalid
	COLOUR_BLACK,					// Invalid
	COLOUR_BLACK,					// Invalid
	COLOUR_RED,						// Mafia 1
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
} else if (serverGame == GAME_GTA_IV) {
	spawnScreenPedPosition = new Vec3(900.94, -506.06, 15.04);
	spawnScreenPedHeading = -1.642;
} else if (serverGame == GAME_MAFIA_ONE) { // Will be changed to GAME_MAFIA_ONE after next GTAC update
	spawnScreenPedPosition = new Vec3(-1981.51, -4.66, 29.37);
	spawnScreenPedHeading = 0.0;
}

// ----------------------------------------------------------------------------

let spawnPoints = [
	null,																	// GAME_UNKNOWN
	new Vec3(1449.19, -197.21, 55.62), 										// GTA III
	new Vec3(-379.16, -535.27, 17.28), 										// GTA Vice City
	new Vec3(2495.03, -1685.66, 13.51), 									// GTA San Andreas
	new Vec3(2495.03, -1685.66, 13.51), 									// GTA Underground (Removed)
	new Vec3(900.94, -506.06, 15.04),							 			// GTA IV
	new Vec3(900.94, -506.06, 15.04),							 			// GTA IV: EFLC
	null,
	null,
	null,
	new Vec3(-1981.51, -4.66, 29.37),										// Mafia 1
];

// ----------------------------------------------------------------------------

let spawnStartDimension = 0;
let mainWorldDimension = 0;

// ----------------------------------------------------------------------------

let spawnSkin = [null, 0, 0, 0, 0, -142386662, -142386662, null, null, null, "TommyCOATHAT.i3d"];

// ----------------------------------------------------------------------------

addEventHandler("onPedDeathEx", function (event, ped) {
	if (server.game == 5) {
		return false;
	}

	if (ped.type == ELEMENT_PLAYER) {
		let client = getClientFromPed(ped);
		if (client != null) {
			spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[server.game]);
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
				spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[server.game]);
			}, 1000);
		} else {
			triggerNetworkEvent("v.spawn", client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
		}
	}

	fadeCamera(client, true);
	console.log(`[SPAWN] ${client.name} spawned as ${getSkinName(spawnSkin[server.game])}`);
	spawnPlayer(client, spawnPoints[serverGame], 0.0, spawnSkin[server.game]);
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
	//if(server.game == GAME_GTA_IV) {
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