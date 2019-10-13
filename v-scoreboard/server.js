"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	setInterval(setPlayerPingData, 3000);
});

// ----------------------------------------------------------------------------

function setPlayerPingData() {
	let clients = getClients();
	for(let i in clients) {
		clients[i].setData("v.ping", clients[i].ping);
	}
}

// ----------------------------------------------------------------------------

/*
addEventHandler("OnDiscordCommand", function(event, author, command, params) {
	findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", you used command '" + command + "'");
	switch(command.toLowerCase()) {
		case "players":
			let clients = getClients();
			if(clients > 0) {
				let clientList = "";
				for(let i in clients){
					clientList += clients[i].name + ", ";
				}
				findResourceByName("v-discord").exports.messageDiscord("Server", "Players currently in game: " + clientList);
			} else {
				findResourceByName("v-discord").exports.messageDiscord("Server", "There are no players in game! :(");
			}
			return true;
		
		case "ping":
			let client = getClientFromParams(params.join(" "));
			if(client != null) {
				findResourceByName("v-discord").exports.messageDiscord("Server", String(client.name) + "'s ping is " + String(client.ping));
			} else {
				findResourceByName("v-discord").exports.messageDiscord("Server", String(author.name) + ", that player was not found!");
			}
			return true;		
	}
	
	return false;
});
*/

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