"use strict";

// ===========================================================================

let nameTimer = null;
bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
	let scriptConfigFile = loadTextFile("config.json");
	if(scriptConfigFile == null || scriptConfigFile == "") {
		thisResource.stop();
		return false;
	}

	if(scriptConfigFile == null || scriptConfigFile == "") {
		scriptConfig = JSON.parse(scriptConfigFile);
		return false;
	}

    serverName = server.name;
    nameTimer = setInterval(() => {
        let randomName = getRandom(0, scriptConfig.randomNames.length-1);
        server.name = `${serverName} - ${scriptConfig.randomNames[randomName]}`;
    }, changeInterval);
});

bindEventHandler("OnResourceStop", thisResource, (event, resource) => {
    clearInterval(nameTimer);
    server.name = serverName;
    collectAllGarbage();
});

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===========================================================================