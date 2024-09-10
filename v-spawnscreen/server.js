"use strict";

// ----------------------------------------------------------------------------

let spawnScreenEnabled = true;

let gameAnnounceColour = gameAnnounceColours[server.game];

// ----------------------------------------------------------------------------

let spawnStartDimension = 0;
let mainWorldDimension = 0;

// ----------------------------------------------------------------------------

addEventHandler("onPedDeathEx", function (event, ped) {
	if (server.game == 5) {
		return false;
	}

	if (ped.type == ELEMENT_PLAYER) {
		let client = getClientFromPed(ped);
		if (client != null) {
			spawnPlayer(client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
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
				spawnPlayer(client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
			}, 1000);
		} else {
			triggerNetworkEvent("v.spawn", client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
		}
	}

	fadeCamera(client, true);
	console.log(`[SPAWN] ${client.name} spawned as ${getSkinName(spawnSkin[server.game])}`);
	spawnPlayer(client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
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

addNetworkHandler("OnMapLoaded", function (client, mapName) {
	if(typeof mapSpawnPoints[mapName] !== "undefined") {
		spawnPlayer(client, mapSpawnPoints[server.game], 0.0, spawnSkin[server.game]);
	} else {
		spawnPlayer(client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
	}
});

// ----------------------------------------------------------------------------