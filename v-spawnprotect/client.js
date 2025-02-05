"use strict";

// ----------------------------------------------------------------------------

let scriptConfig = null;

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

let spawnProtectionMessageEnabled = true;
let spawnProtectionMessageFont = null;
let spawnProtectionMessageText = `SPAWN PROTECTION ENABLED`;
let spawnProtectionMessageColour = COLOUR_ORANGE;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    exportFunction("isPlayerInSpawnProtectionArea", isPlayerInSpawnProtectionArea);
    exportFunction("canSpawnVehiclesInProtectedArea", canSpawnVehiclesInProtectedArea);
    spawnProtectionMessageFont = lucasFont.createDefaultFont(14.0, "Roboto", "Light");
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, (event, resource) => {
    loadConfig();
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event, deltaTime) {
    if (isPlayerInSpawnProtectionArea()) {
        if (scriptConfig.showSpawnProtectionMessage == true) {
            if (spawnProtectionMessageFont != null) {
                spawnProtectionMessageFont.render(spawnProtectionMessageText, [0, game.height - 30], game.width, 0.5, 0.0, spawnProtectionMessageFont.size, spawnProtectionMessageColour, true, true, false, true);
            }
        }
        natives.setCharProofs(localPlayer, true, true, true, true, true);
    } else {
        natives.setCharProofs(localPlayer, false, false, false, false, false);
    }
});

// ----------------------------------------------------------------------------

function isPlayerInSpawnProtectionArea() {
    if (scriptConfig == null) {
        return false;
    }

    for (let i in scriptConfig.spawnProtectionAreas) {
        if (doesGameMatch(scriptConfig.spawnProtectionAreas[i][0]), game.game) {
            if (localPlayer.position.distance(scriptConfig.spawnProtectionAreas[i][1]) <= scriptConfig.spawnProtectionAreas[i][2]) {
                if (game.game == GAME_GTA_IV) {
                    if (scriptConfig.spawnProtectionAreas[i][3] == game.ivGamemode) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }

    return false;
}

// ----------------------------------------------------------------------------

function canSpawnVehiclesInProtectedArea() {
    if (scriptConfig == null) {
        return false;
    }

    return scriptConfig.canSpawnVehiclesInProtectedArea;
}

// ----------------------------------------------------------------------------

function loadConfig() {
    let configFile = loadTextFile("config.json");
    if (configFile == "") {
        console.error("Could not load config.json. Resource stopping ...");
        thisResource.stop();
        return false;
    }

    //console.log("Loaded config file contents successfully.");

    scriptConfig = JSON.parse(configFile);
    if (scriptConfig == null) {
        console.error("Could not parse config.json. Resource stopping ...");
        thisResource.stop();
        return false;
    }

    fixMissingConfigStuff();
    //console.log("Parsed config file successfully.");
}

// ----------------------------------------------------------------------------

function fixMissingConfigStuff() {
    if (typeof scriptConfig.spawnProtectionAreas == "undefined") {
        scriptConfig.spawnProtectionAreas = [];
    }

    if (typeof scriptConfig.canSpawnVehiclesInProtectedArea == "undefined") {
        scriptConfig.canSpawnVehiclesInProtectedArea = false;
    }

    if (typeof scriptConfig.showSpawnProtectionMessage == "undefined") {
        scriptConfig.showSpawnProtectionMessage = true;
    }
}

// ----------------------------------------------------------------------------

function doesGameMatch(game1, game2) {
    let gameId = -1;
    if (isNaN(game1)) {
        gameId = gameIdentifiers.indexOf(game1.toLowerCase());
    } else {
        gameId = game1;
    }

    if (gameId == game2) {
        return true;
    }
    return false;
}

// ----------------------------------------------------------------------------