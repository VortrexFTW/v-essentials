"use strict";

let scriptConfig = {};

// ----------------------------------------------------------------------------

let gameIdentifierStrings = {
	[GAME_GTA_III]: "gta:iii",
	[GAME_GTA_VC]: "gta:vc",
	[GAME_GTA_SA]: "gta:sa",
	[GAME_GTA_IV]: "gta:iv",
	[GAME_MAFIA_ONE]: "mafia:one",
};

// ----------------------------------------------------------------------------

let defaultSpawns = {
	"gta:iii": [[1449.19, -197.21, 55.62, 0.0, "Leone Mansion"]],
	"gta:vc": [[-379.16, -535.27, 17.28, 0.0, "Vercetti Estate"]],
	"gta:sa": [[2495.03, -1685.66, 13.51, 0.0, "CJ's House, Grove Street"]],
	"gta:iv": [[900.94, -506.06, 15.04, 0.0, "Hove Beach Safe House"]],
	"mafia:one": [[-1981.51, -4.66, 29.37, 0.0, "Freeride Default Spawn"]],
};

let defaultSkins = {
	"gta:iii": [-1],
	"gta:vc": [-1],
	"gta:sa": [-1],
	"gta:iv": [-1],
	"mafia:one": [-1],
};

let defaultBlockedSkins = {
	"gta:iii": [],
	"gta:vc": [],
	"gta:sa": [],
	"gta:iv": [0, -1],
	"mafia:one": [],
};

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	let fixesResource = findResourceByName("v-fixes");
	if (fixesResource != null) {
		if (!fixesResource.isStarted) {
			fixesResource.start();
		}
	} else {
		console.warn(`The ${thisResource.name} needs the v-fixes resource for death respawn to work properly.`);
	}

	loadScriptConfig();
	fixMissingConfigStuff();
});

// ----------------------------------------------------------------------------

addEventHandler("onPlayerDeathEx", function (event, client) {
	if (server.game == 5) {
		if (game.ivGamemode != -1 && game.ivGamemode != 33) {
			return false;
		}
	}

	if (typeof fadeCamera != "undefined") {
		setTimeout(function () {
			fadeCamera(client, false, scriptConfig.fadeCameraTime);
			setTimeout(function () {
				spawnPlayerEx(client);
				fadeCamera(client, true, scriptConfig.fadeCameraTime);
			}, 1000);
		}, 1000);
	} else {
		spawnPlayerEx(client);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("onPlayerJoined", function (event, client) {
	if (typeof fadeCamera != "undefined") {
		fadeCamera(client, true, scriptConfig.fadeCameraTime);
	}
	spawnPlayerEx(client);
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
	if (typeof mapSpawnPoints[mapName] !== "undefined") {
		console.log(`[${thisResource.name}] ${client.name} spawned as ${getSkinName(spawnSkin[server.game])}`);
		spawnPlayer(client, mapSpawnPoints[server.game], 0.0, spawnSkin[server.game]);
	} else {
		console.log(`[${thisResource.name}] ${client.name} spawned as ${getSkinName(spawnSkin[server.game])}`);
		spawnPlayer(client, spawnPoints[server.game], 0.0, spawnSkin[server.game]);
	}
});

// ----------------------------------------------------------------------------

function getRandomSpawnPoint() {
	let spawnPoint = scriptConfig.spawnPoints[server.game][Math.floor(Math.random() * spawnPoints[server.game].length)];
	return spawnPoint;
}

// ----------------------------------------------------------------------------

function loadScriptConfig() {
	let configFile = loadTextFile("config.json");
	if (configFile != null) {
		scriptConfig = JSON.parse(configFile);
	}

	return true;
}

// ----------------------------------------------------------------------------

function saveScriptConfig() {
	let configText = JSON.stringify(scriptConfig, null, '\t');
	if (!configText) {
		console.log(`[${thisResource.name}] Config file could not be stringified`);
		return false;
	}

	saveTextFile("config.json", configText);
	console.log(`[${thisResource.name}] Config file saved`);
}

// ----------------------------------------------------------------------------

function fixMissingConfigStuff() {
	let oldConfig = JSON.stringify(scriptConfig, null, '\t');

	if (typeof scriptConfig.fadeCameraTime == "undefined") {
		scriptConfig.fadeCameraTime = 0.5; // In seconds
	}

	if (typeof scriptConfig.spawns == "undefined") {
		scriptConfig.spawns = {};

		if (typeof scriptConfig.spawns[gameIdentifierStrings[server.game]] == "undefined") {
			scriptConfig.spawns[gameIdentifierStrings[server.game]] = [];
			for (let i in defaultSpawns[gameIdentifierStrings[server.game]]) {
				scriptConfig.spawns[gameIdentifierStrings[server.game]].push({
					x: defaultSpawns[gameIdentifierStrings[server.game]][i][0],
					y: defaultSpawns[gameIdentifierStrings[server.game]][i][1],
					z: defaultSpawns[gameIdentifierStrings[server.game]][i][2],
					heading: defaultSpawns[gameIdentifierStrings[server.game]][i][3],
					name: defaultSpawns[gameIdentifierStrings[server.game]][i][4],
				});
			}
		};
	}

	if (typeof scriptConfig.skins == "undefined") {
		scriptConfig.skins = {};

		if (typeof scriptConfig.skins[gameIdentifierStrings[server.game]] == "undefined") {
			scriptConfig.skins[gameIdentifierStrings[server.game]] = [];
			for (let i in defaultSkins[gameIdentifierStrings[server.game]]) {
				scriptConfig.skins[gameIdentifierStrings[server.game]].push(defaultSkins[gameIdentifierStrings[server.game]][i]);
			}
		};
	}

	if (typeof scriptConfig.blockedSkins == "undefined") {
		scriptConfig.blockedSkins = {};

		if (typeof scriptConfig.blockedSkins[gameIdentifierStrings[server.game]] == "undefined") {
			scriptConfig.blockedSkins[gameIdentifierStrings[server.game]] = [];
			for (let i in defaultBlockedSkins[gameIdentifierStrings[server.game]]) {
				scriptConfig.blockedSkins[gameIdentifierStrings[server.game]].push(defaultBlockedSkins[gameIdentifierStrings[server.game]][i]);
			}
		};
	}

	let newConfig = JSON.stringify(scriptConfig, null, '\t');
	if (oldConfig != newConfig) {
		console.log(`[${thisResource.name}] Fixed missing config stuff`);
		saveScriptConfig();
	}
}

// ----------------------------------------------------------------------------

addCommandHandler("addspawn", function (command, params, client) {
	if (!client.administrator) {
		return false;
	}

	if (client.player == null) {
		messageClient('You need to be spawned first!', client, COLOUR_RED);
		return false;
	}

	let spawnPosition = client.player.position;
	let spawnRotation = client.player.heading;

	let name = "";
	if (params.length == 0) {
		messageClient('Provide a name for the spawn: /addspawn <name>', client, COLOUR_RED);
		return false;
	}

	name = params;

	scriptConfig.spawns[gameIdentifierStrings[server.game]].push({
		x: spawnPosition.x,
		y: spawnPosition.y,
		z: spawnPosition.z,
		heading: spawnRotation,
		name: name,
	});
	saveScriptConfig();

	messageClient(`Spawn ${name} added`, client, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("delspawn", function (command, params, client) {
	if (!client.administrator) {
		return false;
	}

	let index = scriptConfig.spawns[gameIdentifierStrings[server.game]].findIndex(spawn => spawn.name.toLowerCase().indexOf(params.toLowerCase()) != -1);
	let name = scriptConfig.spawns[gameIdentifierStrings[server.game]][index].name;
	scriptConfig.spawns[gameIdentifierStrings[server.game]].splice(index);
	saveScriptConfig();

	messageClient(`Spawn ${name} deleted`, client, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("listspawns", function (command, params, client) {
	if (!client.administrator) {
		return false;
	}

	let spawnList = scriptConfig.spawns[gameIdentifierStrings[server.game]].map(spawn => spawn.name);
	messageClient(`Spawns: ${spawnList.join(", ")}`, client, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("respawn", function (command, params, client) {
	if (!client.administrator) {
		return false;
	}

	if (client.player == null) {
		messageClient('You need to be spawned first!', client, COLOUR_RED);
		return false;
	}

	spawnPlayerEx(client);
});

// ----------------------------------------------------------------------------

function spawnPlayerEx(client) {
	let skinId = (gameIdentifierStrings[server.game].indexOf(-1) != -1) ? getRandomSkin(server.game) : scriptConfig.skins[Math.floor(Math.random() * scriptConfig.skins[gameIdentifierStrings[server.game]].length)];
	let spawnIndex = Math.floor(Math.random() * scriptConfig.spawns[gameIdentifierStrings[server.game]].length);
	let spawnData = scriptConfig.spawns[gameIdentifierStrings[server.game]][spawnIndex];

	spawnPlayer(client,
		new Vec3(spawnData.x, spawnData.y, spawnData.z),
		Number(spawnData.heading),
		Number(skinId)
	);

	console.log(`[${thisResource.name}] ${client.name} spawned as ${getSkinName(skinId)}(${skinId}) at ${spawnData.name}`);
}

// ----------------------------------------------------------------------------