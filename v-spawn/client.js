"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnMapLoaded", function (event, mapName) {
	if (!isConnected) {
		triggerNetworkEvent("OnMapLoaded", mapName);
	} else {
		game.createPlayer(mapSpawnPoints[mapName], 0.0, spawnSkins[game.game]);
	}
});

// ----------------------------------------------------------------------------