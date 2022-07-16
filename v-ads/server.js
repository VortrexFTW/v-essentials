"use strict";

// ===========================================================================

let adTimer = null;
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

	adTimer = setInterval(() => {
		let randomId = getRandom(0, scriptConfig.advertisements.length - 1);
		message(scriptConfig.advertisements[randomId], COLOUR_WHITE);
	}, scriptConfig.interval);
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, (event, resource) => {
	if (adTimer != null) {
		clearInterval(adTimer);
	}

	collectAllGarbage();
});

// ===========================================================================

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===========================================================================