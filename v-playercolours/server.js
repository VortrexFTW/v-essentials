"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let playerColours = [
	toColour(51, 153, 255, 255),
	toColour(252, 145, 58, 255),
	toColour(186, 85, 211, 255),
	toColour(144, 255, 96, 255),
	toColour(255, 252, 127, 255),
	toColour(131, 189, 209, 255),
	toColour(237, 67, 55, 255),
	toColour(255, 188, 218, 225),
];

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	client.setData("v.colour", getRandomColour(), true);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	let clients = getClients();
	for(let i in clients) {
		let clientIndex = clients[i].index;
		clients[i].setData("v.colour", getRandomColour(), true);
		if(clients[i].player != null) {
			clients[i].player.setData("v.colour", getRandomColour(), true);
		}
	}
	triggerNetworkEvent("v.colour", null);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	let clients = getClients();
	for(let i in clients) {
		clients[i].removeData("v.colour");
		if(clients[i].player != null) {
			clients[i].player.removeData("v.colour");
		}
	}
	triggerNetworkEvent("v.colour", null);
});

// ----------------------------------------------------------------------------

function setPlayerColour(player) {
	let client = getPlayerClient(player);
	if(client != null) {
		client.setData("v.colour", client.getData("v.colour"), true);
		if(server.game == GAME_GTA_IV) {
			triggerNetworkEvent("v.colour", null);
		}
	}
}

// ----------------------------------------------------------------------------

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped.isType(ELEMENT_PLAYER)) {
		setTimeout(setPlayerColour, 500, ped);
	}
});

// ----------------------------------------------------------------------------

function getPlayerClient(player) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].player == player) {
			return clients[i];
		}
	}

	return null;
}

// ----------------------------------------------------------------------------

function getRandomColour() {
	return toColour(getRandom(32, 255), getRandom(32, 255), getRandom(32, 255), 255);
}

// ----------------------------------------------------------------------------

function getRandom(min, max) {
	return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min)
}

// ----------------------------------------------------------------------------