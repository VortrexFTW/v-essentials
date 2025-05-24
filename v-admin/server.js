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
	if (typeof gta != "undefined") {
		sendClientBlockedScripts();
	}

	triggerNetworkEvent("v.admin.token", client, scriptConfig.serverToken);
});

// ----------------------------------------------------------------------------

addCommandHandler("kick", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to kick params but failed because no player is connected with that name.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to kick ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	if (targetClient.index == client.index) {
		messageAdmins(`${client.name} tried to kick ${targetClient.name} but failed because they tried to kick themselves.`);
		return false;
	}

	messageAdmins(`${targetClient.name} has been kicked!`);
	targetClient.disconnect();
});

// ----------------------------------------------------------------------------

addCommandHandler("scripts", (command, params, client) => {
	if (typeof gta == "undefined") {
		messageClient(`This command is only available on GTA Connected`, client, errorMessageColour);
		return false;
	}

	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to running scripts for '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to get running scripts for ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	returnScriptsToClient = client;
	requestGameScripts(targetClient, client);
});

// ----------------------------------------------------------------------------

addCommandHandler("ban", (command, params, client) => {
	let splitParams = params.split(" ");
	let targetParams = splitParams[0];
	let reasonParams = splitParams.slice(1).join(" ");
	let targetClient = getClientFromParams(targetParams);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to ban '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to ban ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	scriptConfig.bans.push({ name: escapeJSONString(targetClient.name), ip: targetClient.ip, admin: escapeJSONString(client.name), reason: escapeJSONString(reasonParams), timeStamp: new Date().toLocaleDateString('en-GB') });
	saveConfig();
	messageAdmins(`${targetClient.name}[${targetClient.index}] (IP: ${targetClient.ip}) has been banned by ${client.name}!`);
	server.banIP(targetClient.ip, 0);
	if (targetClient) {
		targetClient.disconnect();
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("unban", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to unban '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to unban ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	let removedBans = [];
	for (let i in scriptConfig.bans) {
		if (scriptConfig.bans[i].ip.indexOf(params) != -1 || scriptConfig.bans[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
			server.unbanIP(scriptConfig.bans[i].ip);
			let removedBan = scriptConfig.bans.splice(i, 1);
			removedBans.push(removedBan);
		}
	}

	saveConfig();
	if (removedBans.length == 1) {
		messageAdmins(`${removedBans[0].name} (IP: ${removedBans[0].ip}) has been unbanned by ${client.name}!`);
	} else {
		messageAdmins(`${removedBans.length} bans matching '${params}' removed by ${client.name}!`);
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
	if (typeof gta == "undefined") {
		messageClient(`This command is only available on GTA Connected`, client, errorMessageColour);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to block game script '${params}' but failed because they aren't an admin.`);
		return false;
	}

	addBlockedScript(params);
});

// ----------------------------------------------------------------------------

addCommandHandler("makeadmin", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to change admin status for '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to change admin status for ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	if (targetClient.administrator == false) {
		targetClient.administrator = true;
		messageAdmins(`${client.name} made ${targetClient.name} an administrator!`);
		let token = generateRandomString(128);
		scriptConfig.admins.push({ ip: targetClient.ip, name: escapeJSONString(targetClient.name), token: token, addedBy: escapeJSONString(client.name) });
		triggerNetworkEvent("v.admin.token.save", targetClient, token, scriptConfig.serverToken);
	} else {
		let token = getTokenFromName(targetClient.name);
		scriptConfig.admins = scriptConfig.admins.splice(scriptConfig.admins.findIndex(admin => admin.token != token), 1);
		targetClient.administrator = false;
		messageAdmins(`${client.name} removed ${targetClient.name} from administrators!`);
	}

	saveConfig();
});

// ----------------------------------------------------------------------------

addCommandHandler("trainers", (command, params, client) => {
	if (server.game != GAME_GTA_IV) {
		messageClient(`This command is only available on GTA IV`, client, errorMessageColour);
		return false;
	}

	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to change trainer state for '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to change trainer state for ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	targetClient.trainers = !targetClient.trainers;
	messageAdmins(`${client.name} ${(targetClient.trainers) ? "enabled" : "disabled"} trainers for ${targetClient.name}`);

	if (targetClient.trainers == true) {
		let token = generateRandomString(128);
		if (isPlayerAdmin(targetClient)) {
			token = getTokenFromName(targetClient.name);
		}

		scriptConfig.trainers.push({ ip: targetClient.ip, name: escapeJSONString(targetClient.name), token: token, addedBy: escapeJSONString(client.name) });
		triggerNetworkEvent("v.admin.token.save", targetClient, token, scriptConfig.serverToken);
	} else {
		scriptConfig.trainers = scriptConfig.trainers.filter(trainers => trainers.ip != targetClient.ip);
	}

	saveConfig();
});

// ----------------------------------------------------------------------------

addCommandHandler("ip", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to get IP address for '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to get IP address for ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	messageAdmin(`${targetClient.name}'s IP is ${targetClient.ip}`, client, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("geoip", (command, params, client) => {
	let targetClient = getClientFromParams(params);

	if (targetClient == null) {
		messageAdmins(`${client.name} tried to get GeoIP (location) information for '${params}' but failed because no player is connected with that name/ID.`);
		return false;
	}

	if (!client.administrator && !client.console) {
		messageAdmins(`${client.name} tried to get GeoIP (location) information for ${targetClient.name} but failed because they aren't an admin.`);
		return false;
	}

	if (targetClient.ip.slice(0, 7) == "127.0.0" || targetClient.ip.slice(0, 7) == "192.168") {
		messageAdmins(`${client.name} tried to get GeoIP (location) information for ${targetClient.name} but failed because the IP address is a localhost or LAN IP`);
		return false;
	}

	let countryName = "Unknown";
	let subDivisionName = "Unknown";
	let cityName = "Unknown";

	try {
		countryName = module.geoip.getCountryName(scriptConfig.geoip.countryFile, targetClient);
		subDivisionName = module.geoip.getSubdivisionName(scriptConfig.geoip.subDivisionFile, targetClient);
		cityName = module.geoip.getCityName(scriptConfig.geoip.cityFile, targetClient);

		messageAdmin(`${targetClient.name}'s location is ${cityName}, ${subDivisionName}, ${countryName}`, client, COLOUR_YELLOW);
	} catch (err) {
		messageAdmin(`There was an error getting the geoip information for ${targetClient.name}`, client, errorMessageColour);
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

	return null;
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

function isAdminToken(token) {
	for (let i in scriptConfig.admins) {
		if (token.toLowerCase().trim() == scriptConfig.admins[i].token.toLowerCase().trim()) {
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
		clients[i].administrator = false;

		if (typeof clients[i].trainers != "undefined") {
			clients[i].trainers = areTrainersEnabledForEverybody();
		}
	}

	triggerNetworkEvent("v.admin.token", null, scriptConfig.serverToken);
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
	let oldConfig = JSON.stringify(scriptConfig, null, '\t');

	if (typeof scriptConfig.serverToken == "undefined") {
		scriptConfig.serverToken = generateRandomString(32);
	}

	if (typeof scriptConfig.geoip == "undefined") {
		scriptConfig.geoip = {
			countryFile: "geoip/GeoLite2-Country.mmdb",
			subDivisionFile: "geoip/GeoLite2-City.mmdb",
			cityFile: "geoip/GeoLite2-City.mmdb"
		};
	}

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

	if (typeof scriptConfig.trainers == "undefined") {
		scriptConfig.trainers = [];
	}

	let newConfig = JSON.stringify(scriptConfig, null, '\t');
	if (oldConfig != newConfig) {
		console.log("[V.ADMIN] Fixed missing config stuff");
		saveConfig();
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

function getTokenFromName(name) {
	const matchedAdmin = scriptConfig.admins.find((admin) => admin.name === name);
	return matchedAdmin ? matchedAdmin.token : null;
}

// ----------------------------------------------------------------------------

function getTokenFromIP(ip) {
	return scriptConfig.admins.find((admin) => admin.ip == ip) ? admin.token : false;
}

// ----------------------------------------------------------------------------

addNetworkHandler("v.admin.token", function (fromClient, token) {
	let tokenValid = false;
	const matchedAdmin = scriptConfig.admins.find((admin) => admin.token === token);
	if (matchedAdmin) {
		fromClient.administrator = true;
		tokenValid = true;
	} else {
		fromClient.administrator = false;
	}

	if (typeof fromClient.trainers != "undefined") {
		const matchedTrainers = scriptConfig.trainers.find((t) => t.token === token);
		fromClient.trainers = matchedTrainers ? true : areTrainersEnabledForEverybody();
	}

	if (isAdminName(fromClient.name)) {
		if (!tokenValid || getTokenFromName(fromClient.name) !== token) {
			messageAdmins(`${fromClient.name} was kicked from the server (reserved name but failed token check)`);
			fromClient.disconnect();
			return false;
		}
	}

	if (tokenValid) {
		messageAdmins(`${fromClient.name} passed the token check and was given admin permissions!`);
	}
});

// ----------------------------------------------------------------------------

function areTrainersEnabledForEverybody() {
	if (server.getCVar("trainers") == null) {
		return false;
	} else {
		return !!Number(server.getCVar("trainers")) == true;
	}
}

// ----------------------------------------------------------------------------
