"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	client.setData("v.colour", getRandomColour(), true);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	getClients().forEach(function(client) {
		let colour = getRandomColour();
		client.removeData("v.colour");
		client.setData("v.colour", colour, true);
		if(client.player != null) {
			client.player.removeData("v.colour");
			client.player.setData("v.colour", colour, true);
		}
	});

	if(server.game == GAME_GTA_IV) {
		triggerNetworkEvent("v.colour", null);
	}
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	getClients().forEach(function(client) {
		client.removeData("v.colour");
		if(client.player != null) {
			client.player.removeData("v.colour");
		}
	});

	if(server.game == GAME_GTA_IV) {
		triggerNetworkEvent("v.colour", null);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped.isType(ELEMENT_PLAYER)) {
		setTimeout(function() {
			let client = getPlayerClient(player);
			if(client != null) {
				let colour = client.getData("v.colour");
				player.setData("v.colour", colour, true);
				
				if(server.game == GAME_GTA_IV) {
					triggerNetworkEvent("v.colour", null);
				}
			}
		}, 500);
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
