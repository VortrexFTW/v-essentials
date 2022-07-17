"use strict";

// ===========================================================================

let timer = null;
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

	timer = setInterval(() => {
		let randomId = getRandom(0, scriptConfig.messages.length - 1);
		message(scriptConfig.messages[randomId], COLOUR_WHITE);
	}, scriptConfig.interval);
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, (event, resource) => {
	if (timer != null) {
		clearInterval(timer);
	}

	collectAllGarbage();
});

// ===========================================================================

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===========================================================================