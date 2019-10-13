"use strict";
setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let scriptConfig = null;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	let configFile = openFile("config.json");
	if(configFile == null) {
		console.log("[Chat] Could not load config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}
	
	scriptConfig = JSON.parse(configFile.readBytes(configFile.length));
	configFile.close();
	if(!scriptConfig) {
		console.log("[Chat] Could not load config.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	removeEventHandler("OnDiscordCommand");
});

// ----------------------------------------------------------------------------

addCommandHandler("admin", function(cmdName, params, client) {
	if(params == scriptConfig.adminPassword) {
		client.administrator = true;
		messageClient("You are now administrator!", client, COLOUR_YELLOW);
	} else {
		console.warn(client.name + " failed admin login!");
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("kick", function(cmdName, params, client) {
	if(client.administrator) {
		let player = findResourceByName("v-utils").exports.getClientFromParams(params);
		if(player != false) {
			player.disconnect();
			messageClient(player.name + " has been kicked!", client, COLOUR_YELLOW);
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("makeadmin", function(cmdName, params, client) {
	if(client.administrator) {
		let player = findResourceByName("v-utils").exports.getClientFromParams(params);
		if(player != false) {
			player.administrator = true;
			messageClient(player.name + " is now administrator!", client, COLOUR_YELLOW);
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("unmakeadmin", function(cmdName, params, client) {
	if(client.administrator) {
		let player = findResourceByName("v-utils").exports.getClientFromParams(params);
		if(player != false) {
			player.administrator = false;
			messageClient(player.name + " is no longer administrator!", client, COLOUR_YELLOW);
		}
	}
});

// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	if(typeof server == "undefined") {
		let clients = getClients();
		for(let i in clients) {
			if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
				return clients[i];
			}
		}
	} else {
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
	}
	
	return false;
}