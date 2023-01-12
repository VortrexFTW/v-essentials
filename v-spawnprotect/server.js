"use strict";

// ----------------------------------------------------------------------------

let gameIdentifiers = [
	"invalid",
	"gta:iii",
	"gta:vc",
	"gta:sa",
	"invalid",
	"gta:iv",
	"gta:eflc",
	"invalid",
	"invalid",
	"invalid",
	"mafia:one",
	"mafia:two",
	"mafia:three",
	"mafia:one_de",
];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
	exportFunction("isPlayerInSpawnProtectionArea", isPlayerInSpawnProtectionArea);
	spawnProtectionMessageFont = lucasFont.createDefaultFont(14.0, "Roboto", "Light");

	loadConfig();
});

// ----------------------------------------------------------------------------

function loadConfig() {
	let configFile = loadTextFile("config.json");
	if (configFile == "") {
		logError("Could not load config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}

	logInfo("Loaded config file contents successfully.");

	scriptConfig = JSON.parse(configFile);
	if (scriptConfig == null) {
		logError("Could not parse config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}

	fixMissingConfigStuff();
	logInfo("Parsed config file successfully.");
}

// ----------------------------------------------------------------------------

function saveConfig() {
	let configText = JSON.stringify(scriptConfig, null, '\t');
	if (!configText) {
		console.error(`Config file could not be stringified`);
		return false;
	}

	saveTextFile("config.json", configText);
}

// ----------------------------------------------------------------------------

function fixMissingConfigStuff() {
	if (typeof scriptConfig.spawnProtectionAreas == "undefined") {
		scriptConfig.spawnProtectionAreas = [];
	}

	saveConfig();
}

// ----------------------------------------------------------------------------

function doesGameMatch(game1, game2) {
	let gameId = -1;
	if (isNaN(game1)) {
		gameId = gameIdentifiers.indexOf(game.toLowerCase());
	} else {
		gameId = game1;
	}

	if (gameId == game2) {
		return true;
	}
	return false;
}

// ----------------------------------------------------------------------------