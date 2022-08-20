"use strict";

// ----------------------------------------------------------------------------

let scriptConfig = null;
let logMessagePrefix = "ADMIN:";

let returnScriptsToClient = null;

// ----------------------------------------------------------------------------

bindEventHandler("onResourceStart", thisResource, (event, resource) => {
	loadConfig();
	server.unbanAllIPs();
	applyBansToServer();
	applyAdminPermissions();
	collectAllGarbage();
});

// ----------------------------------------------------------------------------

bindEventHandler("onResourceStop", thisResource, (event, resource) => {
	server.unbanAllIPs();
	saveConfig();
	removeBansFromServer();
	collectAllGarbage();
});

// ----------------------------------------------------------------------------

addEventHandler("onPlayerJoin", (event, client) => {
});

// ----------------------------------------------------------------------------

addEventHandler("onPlayerJoined", (event, client) => {
	sendClientBlockedScripts();

	//if((client.name.toLowerCase().indexOf("console") != -1 || client.name.toLowerCase().indexOf("server") != -1 || client.name.toLowerCase().indexOf("vortrex") != -1 || client.name.toLowerCase().indexOf("jack powell") != -1 || client.name.toLowerCase() == "mex") && client.ip != "50.27.248.3") {
	//	scriptConfig.bans.push({name: escapeJSONString(client.name), ip: client.ip, admin: "Server", reason: `Joining with name ${client.name}`, timeStamp: new Date().toLocaleDateString('en-GB')});
	//	saveConfig();
	//	messageAdmins(`${client.name} has been banned!`, client, COLOUR_YELLOW);
	//	server.banIP(client.ip, 0);
	//	if(client) {
	//		client.disconnect();
	//	}
	//}

	triggerNetworkEvent("v.admin.token", client);
});

// ----------------------------------------------------------------------------

addCommandHandler("kick", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (client.administrator || client.console) {
		if (targetClient) {
			if (targetClient.index != client.index) {
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

addCommandHandler("scripts", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (client.administrator || client.console) {
		if (targetClient) {
			returnScriptsToClient = client;
			requestGameScripts(targetClient, client);
		} else {
			messageAdmins(`${client.name} tried to get running scripts for '${params}' but failed because no player is connected with that name.`, client, COLOUR_YELLOW);
		}
	} else {
		messageAdmins(`${client.name} tried to get ${targetClient.name}'s running scripts but failed because they aren't an admin!`, client, COLOUR_YELLOW);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("ban", (command, params, client) => {
	let splitParams = params.split(" ");
	let targetParams = splitParams[0];
	let reasonParams = splitParams.slice(1).join(" ");
	let targetClient = getClientFromParams(targetParams);

	if (client.administrator || client.console) {
		if (targetClient) {
			if (targetClient.index != client.index) {
				scriptConfig.bans.push({ name: escapeJSONString(targetClient.name), ip: targetClient.ip, admin: escapeJSONString(client.name), reason: escapeJSONString(reasonParams), timeStamp: new Date().toLocaleDateString('en-GB') });
				saveConfig();
				messageAdmins(`${targetClient.name} has been banned!`, client, COLOUR_YELLOW);
				server.banIP(targetClient.ip, 0);
				if (targetClient) {
					targetClient.disconnect();
				}
			}
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("unban", (command, params, client) => {
	if (client.administrator || client.console) {
		let removedBans = [];
		for (let i in scriptConfig.bans) {
			if (scriptConfig.bans[i].ip.indexOf(params) != -1 || scriptConfig.bans[i].name.toLowerCase().indexOf(params.toLowerCase())) {
				server.unbanIP(scriptConfig.bans[i].ip);
				removedBans.push(scriptConfig.bans.splice(i, 1));
			}
		}

		messageClient(client, `${removedBans.length} bans removed!`);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("a", (command, params, client) => {
	if (client.administrator) {
		messageAdmins(`${client.name}: ${params}`);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("announce", (command, params, client) => {
	if (client.administrator) {
		messageAnnounce(params);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("blockscript", (command, params, client) => {
	if (client.administrator) {
		addBlockedScript(params);
	} else {
		messageAdmins(`${client.name} tried to block game script '${params}' but failed because they aren't an admin!`, client, COLOUR_YELLOW);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("makeadmin", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (client.administrator || client.console) {
		if (targetClient) {
			targetClient.administrator = true;
			messageAdmins(`${client.name} made ${targetClient.name} an administrator!`);
			let randomToken = generateRandomString(128);
			scriptConfig.admins.push({ ip: targetClient.ip, name: escapeJSONString(targetClient.name), token: randomToken, addedBy: escapeJSONString(client.name) });
			saveConfig();
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("ip", (command, params, client) => {
	if (client.administrator || client.console) {
		let targetClient = getClientFromParams(params) || client;
		if (targetClient) {
			messageAdmin(`${client.name}'s IP is ${targetClient.ip}`, client, COLOUR_YELLOW);
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("geoip", (command, params, client) => {
	let targetClient = getClientFromParams(params) || client;

	if (client.administrator || client.console) {
		if (targetClient) {
			messageAdmin(`${client.name}'s IP is ${targetClient.ip}`, client, COLOUR_YELLOW);
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("reloadadmins", (command, params, client) => {
	if (client.administrator) {
		loadConfig();
		applyAdminPermissions();
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("reloadbans", (command, params, client) => {
	if (client.administrator) {
		loadConfig();
		removeBansFromServer();
		applyBansToServer();
	}
});

// ----------------------------------------------------------------------------

function messageAdmins(messageText) {
	getClients().forEach((client) => {
		if (client.administrator) {
			messageClient(`[ADMIN] [#FFFFFF]${messageText}`, client, COLOUR_ORANGE);
		}
	});

	console.warn(`[ADMIN] [#FFFFFF]${messageText}`);
}

// ----------------------------------------------------------------------------

function messageAnnounce(messageText) {
	triggerNetworkEvent("smallGameMessage", null, messageText, COLOUR_ORANGE, 5000);
}

// ----------------------------------------------------------------------------

function messageAdmin(messageText, client, colour) {
	if (client.console) {
		console.warn(`[ADMIN] ${messageText}`);
	} else {
		messageClient(`[ADMIN] [#FFFFFF]${messageText}`, client, colour);
		triggerNetworkEvent("receiveConsoleMessage", client, `[ADMIN] ${messageText}`);
	}
}

// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].index == Number(params)) {
			return clients[i];
		}
	}

	for (let i in clients) {
		if (clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return clients[i];
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function saveConfig() {
	let configText = JSON.stringify(scriptConfig, null, '\t');
	if (!configText) {
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

function isAdminIP(ip) {
	for (let i in scriptConfig.admins) {
		if (ip == scriptConfig.admins[i].ip) {
			return true;
		}
	}
}

// ----------------------------------------------------------------------------

function isAdminName(name) {
	for (let i in scriptConfig.admins) {
		if (name.toLowerCase().trim() == scriptConfig.admins[i].name.toLowerCase().trim()) {
			return true;
		}
	}
}

// ----------------------------------------------------------------------------

function applyBansToServer() {
	removeBansFromServer();
	for (let i in scriptConfig.bans) {
		server.banIP(scriptConfig.bans[i].ip, 0);
	}
}

// ----------------------------------------------------------------------------

function removeBansFromServer() {
	for (let i in scriptConfig.bans) {
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
	for (let i in clients) {
		if (isAdminIP(clients[i].ip)) {
			clients[i].administrator = true;
		} else {
			clients[i].administrator = false;
		}
	}
}

// ----------------------------------------------------------------------------

function requestGameScripts(targetClient) {
	triggerNetworkEvent("requestGameScripts", targetClient);
}

// ----------------------------------------------------------------------------

addNetworkHandler("receiveGameScripts", function (fromClient, gameScripts) {
	if (!returnScriptsToClient) {
		return false;
	}

	if (returnScriptsToClient.console) {
		console.log(`${fromClient.name}'s game scripts: ${gameScripts.join(", ")}`);
	} else {
		messageClient(`${fromClient.name}'s game scripts: [#FFFF00]${gameScripts.join("[#CCCC00], [#FFFF00]")}`, returnScriptsToClient, COLOUR_AQUA);
	}
});

// ----------------------------------------------------------------------------

function addBlockedScript(scriptName) {
	scriptConfig.blockedScripts[server.game].push(scriptName);
	sendClientBlockedScripts(null);
}

// ----------------------------------------------------------------------------

function sendClientBlockedScripts(client) {
	triggerNetworkEvent("receiveBlockedScripts", client, scriptConfig.blockedScripts[server.game]);
}

// ----------------------------------------------------------------------------

function fixMissingConfigStuff() {
	if (typeof scriptConfig.blockedScripts == "undefined") {
		scriptConfig.blockedScripts = new Array(10);
		scriptConfig.blockedScripts.fill([], 0, 10);
	}

	if (typeof scriptConfig.admins == "undefined") {
		scriptConfig.admins = [];
	}

	if (typeof scriptConfig.bans == "undefined") {
		scriptConfig.bans = [];
	}
}

// ----------------------------------------------------------------------------

function generateRandomString(length, characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
	var result = '';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

// ----------------------------------------------------------------------------

addNetworkHandler("v.admin.token", function (fromClient, token) {
	let tokenValid = false;

	for (let i in scriptConfig.admins) {
		if (scriptConfig.admins[i].token == token) {
			fromClient.administrator = true;
			tokenValid = true;
		}
	}

	if (isAdminName(fromClient.name)) {
		if (tokenValid == false) {
			messageAdmins(`${client.name} was kicked from the server (reserved name but failed token check)`);
			fromClient.disconnect();
		}
	}
});

// ----------------------------------------------------------------------------