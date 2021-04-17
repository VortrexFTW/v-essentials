"use strict";
setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let scriptConfig = null;
let logMessagePrefix = "ADMIN:";

// ----------------------------------------------------------------------------

bindEventHandler("onResourceStart", thisResource, (event, resource) => {
	loadConfig();
	applyBansToServer();
	applyAdminPermissions();
	collectAllGarbage();
});

// ----------------------------------------------------------------------------

bindEventHandler("onResourceStop", thisResource, (event, resource) => {
	saveConfig();
	removeBansFromServer();
	collectAllGarbage();
});

// ----------------------------------------------------------------------------

addEventHandler("onPlayerJoined", (event, client) => {
	if(isAdminIP(client.ip)) {
		messageAdmins(`${client.name} was in the admins list, and was given admin access.`);
		client.administrator = true;
		messageClient(`You have been logged in as administrator!`, client, COLOUR_YELLOW);
		return true;
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("kick", (command, params, client) => {
	if(client.administrator || client.console) {
		let targetClient = getClientFromParams(params);
		if(targetClient) {
			if(targetClient.index != client.index) {
				messageAdmins(`${targetClient.name} has been kicked!`, client, COLOUR_YELLOW);
				targetClient.disconnect();
			} else {
				messageAdmins(`${client.name} tried to kick ${targetClient.name} but failed because they tried to kick themselves.`, client, COLOUR_YELLOW);
			}
		} else {
			messageAdmins(`${client.name} tried to kick params but failed because no player is connected with that name.`, client, COLOUR_YELLOW);
		}
	} else {
		messageAdmins(`${client.name} tried to kick ${targetClient.name} but failed because they aren't an admin.`, client, COLOUR_YELLOW);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("ban", (command, params, client) => {
	if(client.administrator || client.console) {
		let splitParams = params.split(" ");
		let targetParams = splitParams[0];
		let reasonParams = splitParams.slice(1).join(" ");

		let targetClient = getClientFromParams(targetParams);
		if(targetClient) {
			if(targetClient.index != client.index) {
				scriptConfig.bans.push({name: escapeJSONString(targetClient.name), ip: targetClient.ip, admin: escapeJSONString(client.name), reason: escapeJSONString(reasonParams), timeStamp: new Date().toLocaleDateString('en-GB')});
				saveConfig();
				messageAdmins(`${targetClient.name} has been banned!`, client, COLOUR_YELLOW);
				server.banIP(targetClient.ip);
			}
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("unban", (command, params, client) => {
	if(client.administrator || client.console) {
		let removedBans = [];
		for(let i in scriptConfig.bans) {
			if(scriptConfig.bans[i].ip.indexOf(params) != -1 || scriptConfig.bans[i].name.toLowerCase().indexOf(params.toLowerCase())) {
				server.unbanIP(scriptConfig.bans[i].ip);
				removedBans.push(scriptConfig.bans.splice(i, 1));
			}
		}

		messageClient(client, `${removedBans.length} bans removed!`);
	}
});


// ----------------------------------------------------------------------------

addCommandHandler("a", (command, params, client) => {
	if(client.administrator) {
		message(`[#FF9900][ADMIN]: ${params}`, COLOUR_WHITE);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("makeadmin", (command, params, client) => {
	if(client.administrator || client.console) {
		let targetClient = getClientFromParams(params);
		if(targetClient) {
			targetClient.administrator = true;
			messageAdmins(`${client.name} made ${targetClient.name} an administrator!`);

			scriptConfig.admins.push({ip: targetClient.ip, name: escapeJSONString(targetClient.name), addedBy: escapeJSONString(client.name)});
			saveConfig();
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("ip", (command, params, client) => {
	if(client.administrator || client.console) {
		let targetClient = getClientFromParams(params) || client;
		if(targetClient) {
			messageAdmin(`${client.name}'s IP is ${targetClient.ip}`, client, COLOUR_YELLOW);
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("geoip", (command, params, client) => {
	if(client.administrator) {
		if(typeof module.geoip == "undefined") {
			return false;
		}

		let targetClient = getClientFromParams(params) || client;
		let countryName = module.geoip.getCountryName("geoip-country.mmdb", targetClient.ip) || "Unknown";
		let cityName = module.geoip.getCityName("geoip-city.mmdb", targetClient.ip) || "Unknown";
		messageAdmin(`${targetClient.name} is from ${cityName}, ${countryName}`, client, COLOUR_YELLOW);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("docmd", (command, params, client) => {
	if(client.administrator) {
		let splitParams = params.split(" ");
		let commandString = splitParams.slice(1).join(" ");
		let targetClient = getClientFromParams(splitParams[0]) || client;
		triggerNetworkEvent("v.admin.docmd", targetClient, );
		messageAdmin(`Command simulated for ${targetClient.name} (${commandString})`, client, COLOUR_YELLOW);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("reloadadmins", (command, params, client) => {
	if(client.administrator) {
		loadConfig();
		applyAdminPermissions();
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("reloadbans", (command, params, client) => {
	if(client.administrator) {
		loadConfig();
		removeBansFromServer();
		applyBansToServer();
	}
});

// ----------------------------------------------------------------------------

function messageAdmins(messageText) {
	getClients().forEach((client) => {
		if(client.administrator) {
			messageClient(`[ADMIN] [#FFFFFF]${messageText}`, client, COLOUR_ORANGE);
		}
	});

	console.warn(`[ADMIN] [#FFFFFF]${messageText}`);
}

// ----------------------------------------------------------------------------

function messageAdmin(messageText, client, colour) {
	if(client.console) {
		console.warn(`[ADMIN] [#FFFFFF]${messageText}`);
	} else {
		messageClient(`[ADMIN] [#FFFFFF]${messageText}`, client, colour);
	}
}

// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return clients[i];
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function saveConfig() {
	let configText = JSON.stringify(scriptConfig);
	if(!configText) {
		logInfo(`Config file could not be stringified`);
		return false;
	}

	logInfo(`Config file stringified successfully`);
	saveTextFile("config.json", configText);
	logInfo(`Config file saved successfully`);
}

// ----------------------------------------------------------------------------

function logInfo(messageText) {
	console.log(logMessagePrefix.trim() + " " + messageText);
}

// ----------------------------------------------------------------------------

function logWarn(messageText) {
	console.warn(logMessagePrefix.trim() + " " + messageText);
}

// ----------------------------------------------------------------------------

function logError(messageText) {
	console.error(logMessagePrefix.trim() + " " + messageText);
}

// ----------------------------------------------------------------------------

let errorMessageColour = toColour(237, 67, 55, 255);

// ----------------------------------------------------------------------------

function loadConfig() {
	let configFile = loadTextFile("config.json");
	if(configFile == "") {
		logError("Could not load config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}

	logInfo("Loaded config file contents successfully.");

	scriptConfig = JSON.parse(configFile);
	if(scriptConfig == null) {
		logError("Could not parse config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}
	logInfo("Parsed config file successfully.");
}

// ----------------------------------------------------------------------------

function isAdminIP(ip) {
	for(let i in scriptConfig.admins) {
		if(ip == scriptConfig.admins[i].ip) {
			return true;
		}
	}
}

// ----------------------------------------------------------------------------

function isAdminName(name) {
	for(let i in scriptConfig.admins) {
		if(name == scriptConfig.admins[i].name) {
			return true;
		}
	}
}

// ----------------------------------------------------------------------------

function applyBansToServer() {
	removeBansFromServer();
	for(let i in scriptConfig.bans) {
		server.banIP(scriptConfig.bans[i].ip, 0);
	}
}

// ----------------------------------------------------------------------------

function removeBansFromServer() {
	for(let i in scriptConfig.bans) {
		server.unbanIP(scriptConfig.bans[i].ip);
	}
}

// ----------------------------------------------------------------------------

function escapeJSONString(str) {
	return str.replace(/\\n/g, "\\n")
	.replace(/\\'/g, "\\'")
	.replace(/\\"/g, '\\"')
	.replace(/\\&/g, "\\&")
	.replace(/\\r/g, "\\r")
	.replace(/\\t/g, "\\t")
	.replace(/\\b/g, "\\b")
	.replace(/\\f/g, "\\f");
}

// ----------------------------------------------------------------------------

function applyAdminPermissions() {
	let clients = getClients();
	for(let i in clients) {
		if(isAdminIP(clients[i].ip)) {
			clients[i].administrator = true;
		} else {
			clients[i].administrator = false;
		}
	}
}

// ----------------------------------------------------------------------------