// ----------------------------------------------------------------------------

let serverGame = server.game;

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[serverGame];
let gameName = gameNames[serverGame];

// ----------------------------------------------------------------------------

addNetworkHandler("sb.e.del", function (client, element) {
	destroyElement(element);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.e.syncer", function (client, element) {
	element.syncer = client.index;
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (serverGame != GAME_GTA_IV && serverGame != GAME_GTA_IV_EFLC) {
		game.forceWeather(currentWeather[serverGame]);
		game.hour = timeLockHour[serverGame];
		game.minute = timeLockMinute[serverGame];
		if (serverGame != GAME_GTA_VC) {
			game.trainsEnabled = trainsEnabled[serverGame];
		}
		game.planesEnabled = planesEnabled[serverGame];
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function (event, resource) {
	//console.warn("[Sandbox] Resource '" + resource.name + "' started!");
});

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStop", function (event, resource) {
	//console.warn("[Sandbox] Resource '" + resource.name + "' stopping!!");
	collectAllGarbage();
});

// ----------------------------------------------------------------------------

function getSyncerFromID(syncerID) {
	let clients = getClients();
	for (let i in clients) {
		if (i == syncerID) {
			return clients[i];
		}
	}
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.msg", function (client, messageText) {
	console.log("[Sandbox] " + String(client.name) + " " + messageText);
	outputSandboxMessage(client, messageText);
});

// ----------------------------------------------------------------------------

function outputSandboxMessage(client, messageText) {
	message(`${client.name} ${messageText}`, gameAnnounceColour);
}

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function (event, client, disconnectReason) {
	setTimeout(beginSandboxCleanup, 5000);
});

// ----------------------------------------------------------------------------

function beginSandboxCleanup() {
	if (getClients().length == 0) {
		console.log(`[Sandbox] Server is empty. Restarting sandbox to clean up.`);
		thisResource.restart();
	}

	collectAllGarbage();
}

// ----------------------------------------------------------------------------
