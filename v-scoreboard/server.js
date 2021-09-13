"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	setInterval(updatePlayerScoreboardPing, 3000);
});

// ----------------------------------------------------------------------------

function updatePlayerScoreboardPing() {
	getClients().forEach((client) => {
		client.setData("v.ping", client.ping, true);
	});
}

// ----------------------------------------------------------------------------

function updatePlayerScoreboardGTAIV(client, episode, gameMode) {
	client.setData("v.ivinfo", [episode, gameMode], true);
}

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

// ----------------------------------------------------------------------------

addNetworkHandler("v.ivinfo.", function(client, episode, gameMode) {
	//console.log(`${client.name}'s episode is ${episode} and gamemode is ${gameMode}`);
	updatePlayerScoreboardGTAIV(client, episode, gameMode);
});

// ----------------------------------------------------------------------------