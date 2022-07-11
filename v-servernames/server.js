"use strict";

// ===========================================================================

let serverName = "";
let nameTimer = null;
let scriptConfig = null;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
	let scriptConfigFile = loadTextFile("config.json");
	if (scriptConfigFile == null || scriptConfigFile == "") {
		event.preventDefault();
		return false;
	}

	if (scriptConfigFile == null || scriptConfigFile == "") {
		event.preventDefault();
		return false;
	}

	scriptConfig = JSON.parse(scriptConfigFile);

	if (scriptConfig == null) {
		event.preventDefault();
		return false;
	}

	serverName = server.name;
	nameTimer = setInterval(() => {
		let randomName = getRandom(0, scriptConfig.randomNames.length - 1);
		server.name = `${serverName} - ${scriptConfig.randomNames[randomName]}`;
	}, scriptConfig.changeInterval);
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, (event, resource) => {
	if (nameTimer != null) {
		clearInterval(nameTimer);
	}

	server.name = serverName;
	collectAllGarbage();
});

// ===========================================================================

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===========================================================================