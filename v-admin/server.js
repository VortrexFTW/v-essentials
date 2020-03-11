"use strict";
setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let scriptConfig = null;
let logMessagePrefix = "ADMIN:"

let adminCommands = [
	"stop",
	"start",
	"restart",
	"refresh",
	"stopall",
	"stopscript",
	"deleteotherplayers"
];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	let configFile = openFile("config.json");
	if(configFile == null) {
		logInfo("Could not load config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}
	
	scriptConfig = JSON.parse(configFile.readBytes(configFile.length));
	configFile.close();
	if(!scriptConfig) {
		logInfo("Could not load config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}	
	
	//addEventHandler("OnDiscordCommand", onDiscordCommand);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	removeEventHandler("OnDiscordCommand");
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	scriptConfig.admins.forEach(function(admin) {
		if(client.ip == admin.ip) {
			client.administrator = true;
			logWarn(client.name + " (IP: " + client.ip + ") was in the admins list, and was given admin access.");
			messageClient("You have been logged in as administrator!", client, COLOUR_YELLOW);
			return true;
		}
	});

	if(!client.administrator) {
		logInfo(client.name + " (IP: " + client.ip + ") is not in the admin list, and has normal player access.");
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("admin", function(command, params, client) {
	if(params == scriptConfig.adminPassword) {
		client.administrator = true;
		messageClient("You are now administrator!", client, COLOUR_YELLOW);
	} else {
		logWarn(client.name + " failed admin login (Used password: " + String(params) + ")");
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("kick", function(command, params, client) {
	if(client.administrator) {
		let player = getClientFromParams(params);
		if(player != false) {
			player.disconnect();
			messageClient(player.name + " has been kicked!", client, COLOUR_YELLOW);
			messageClient(targetClient.name + " is now an administrator!", client, errorMessageColour);
		}
	} else {
		logWarn(client.name + " attempted admin command, but is not an admin and was denied. (String: /" + command + " " + params + ")");
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("makeadmin", function(command, params, client) {
	if(client.administrator) {
		let targetClient = getClientFromParams(params);
		if(targetClient != false) {
			logError("Invalid player name or ID");
			messageClient(targetClient.name + " is now an administrator!", client, errorMessageColour);
			return false;
		}

		targetClient.administrator = true;
		messageClient(targetClient.name + " is now an administrator!", client, COLOUR_YELLOW);
		logWarn(client.name + " made " + targetClient.name + " an administrator!");
		scriptConfig.admins.push({name: targetClient.name, ip: targetClient.ip});
		saveConfig();
	} else {
		logWarn(client.name + " attempted admin command, but is not an admin and was denied. (String: /" + command + " " + params + ")");
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("reloadadmins", function(command, params, client) {
	if(client.administrator) {
		let configFile = openFile("config.json");
		if(configFile == null) {
			logError("Could not load config.json. Admins could not be reloaded! ...");
			return false;
		}
		
		let tempConfig = JSON.parse(configFile.readBytes(configFile.length));
		scriptConfig.admins = tempConfig.admins;
	} else {
		logWarn(client.name + " attempted admin command, but is not an admin and was denied. (String: /" + command + " " + params + ")");
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerCommand", function(event, command, params, client) {
	if(isAdminCommand(command)) {
		if(client.administrator) {
			logWarn(client.name + " used admin command (String: /" + command + " " + params + ")");
		} else {
			logWarn(client.name + " attempted admin command, but is not an admin and was denied. (String: /" + command + " " + params + ")");
		}		
	}
});

// ----------------------------------------------------------------------------

function onAdminCommand(command, params, client) {
	if(client.administrator) {
		logWarn(client.name + " used admin command (String: /" + command + " " + params + ")");
	} else {
		logWarn(client.name + " attempted admin command, but is not an admin and was denied. (String: /" + command + " " + params + ")");
	}
}

// ----------------------------------------------------------------------------

function isAdminCommand(command) {
	if(adminCommands.indexOf(command) != -1) {
		return true;
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function onDiscordCommand(event, author, command, params) {
	let isAdministrator = (author.roles.indexOf("Administrator") != -1);
	let isModerator = (author.roles.indexOf("Moderator") != -1);
	
	switch(command.toLowerCase()) {
		case "kick":
			if(isAdministrator || isModerator) {
				let client = getClientFromParams(params.join(" "));
				if(client != null) {
					console.log("[Discord] " + String(author.name) + " used command '." + command + " " + params.join(" ") + " and kicked " + client.name);
					findResourceByName("v-discord").exports.messageDiscord("Server", String(client.name) + " has been kicked!");
					client.disconnect();
				} else {
					console.log("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but entered an invalid player name/id!");
					findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", that player was not found!");
				}
			} else {
				console.warn("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but did not have permission!");
				findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", you do not have permission to use that command!");
			}
			break;
		
		case "gameadmin":
			if(isAdministrator) {
				let client = getClientFromParams(params.join(" "));
				if(client != null) {
					if(!client.administrator) {
						console.log("[Discord] " + String(author.name) + " used command '." + command + " " + params.join(" ") + " and gave " + client.name + " game-admin permissions");
						findResourceByName("v-discord").exports.messageDiscord("Server", String(client.name) + " has been given game admin permissions!");
						client.administrator = true;
					} else {
						console.log("[Discord] " + String(author.name) + " used command '." + command + " " + params.join(" ") + " and took " + client.name + "'s game-admin permissions");
						findResourceByName("v-discord").exports.messageDiscord("Server", String(client.name) + "'s admin permissions have been revoked!");
						client.administrator = false;						
					}
				} else {
					console.log("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but entered an invalid player name/id!");
					findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", that player was not found!");
				}
			} else {
				console.warn("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but did not have permission!");
				findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", you do not have permission to use that command!");
			}
			break;
			
		case "start":
			if(isAdministrator) {
				let resource = findResourceByName(params.join(" "));
				if(resource != null) {
					if(!resource.isStarted && resource.isStarting) {
						console.log("[Discord] " + String(author.name) + " used command '." + command + " " + params.join(" ") + " and started resource '" + resource.name + "'");
						findResourceByName("v-discord").exports.messageDiscord("Server", String(resource.name) + ", is now starting ...");
						resource.start();
					} else {
						console.log("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " to start resource '" + resource.name + "' but failed. Resource already running!");
						findResourceByName("v-discord").exports.messageDiscord("Server", String(resource.name) + ", is already running!");
					}
				} else {
					console.log("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but entered an invalid player name/id!");
					findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", that resource was not found!");
				}
			} else {
				console.warn("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but did not have permission!");
				findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", you do not have permission to use that command!");
			}
			break;

		case "stop":
			if(isAdministrator) {
				let resource = findResourceByName(params.join(" "));
				if(resource != null) {
					if(!resource.isStarted && resource.isStarting) {
						console.log("[Discord] " + String(author.name) + " used command '." + command + " " + params.join(" ") + " and stopped resource '" + resource.name + "'");
						findResourceByName("v-discord").exports.messageDiscord("Server", String(resource.name) + ", is now stopping ...");
						resource.stop();
					} else {
						console.log("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " to stop resource '" + resource + "'. Resource is not running!");
						findResourceByName("v-discord").exports.messageDiscord("Server", String(resource.name) + ", is already running!");
					}
				} else {
					console.log("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but entered an invalid player name/id!");
					findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", that resource was not found!");
				}
			} else {
				console.warn("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but did not have permission!");
				findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", you do not have permission to use that command!");
			}
			break;

		case "resources":
			if(isAdministrator) {
				console.log("[Discord] " + String(author.name) + " used command '." + command + " " + params.join(" "));
				findResourceByName("v-discord").exports.messageDiscord("Server", String(resource.name) + ", the following resources are currently running: " + getResources().filter(resource => resource.isStarted).join(", "));
			} else {
				console.warn("[Discord] " + String(author.name) + " attempted to use command '." + command + " " + params.join(" ") + " but did not have permission!");
				findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", you do not have permission to use that command!");
			}
			break;
			
		default:
			break;			
	}
}

// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	let clients = getClients();
	if(isNaN(params)) {
		for(let i in clients) {
			if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
				return clients[i];
			}			
		}
	} else {
		let clientID = Number(params) || 0;
		if(typeof clients[clientID] != "undefined") {
			return clients[clientID];
		}
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function saveConfig() {
	let configText = JSON.stringify(scriptConfig);

	let configFile = openFile("config.json");
	if(configFile == null) {
		logError("Could not load config.json. Config will not be saved! ...");
		return false;
	}
	configFile.writeBytes(configText, configText.length);
	configFile.close();
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