"use strict";

// ----------------------------------------------------------------------------

addEvent("OnPlayerGoAFK", 1);
addEvent("OnPlayerBackFromAFK", 1);

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", (event, client) => {
	client.setData("v.afk", 0, true);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, client) => {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].getData("v.afk") == null) {
			clients[i].setData("v.afk", 0, true);

		}
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.afk", (client, state) => {
	if(state == true) {
		client.setData("v.afk", 1, true);
		if(client.player != null) {
			client.player.setData("v.afk", 1, true);
			triggerEvent("OnPlayerGoAFK", client);
		}
	} else {
		client.setData("v.afk", 0, true);
		if(client.player != null) {
			client.player.setData("v.afk", 0, true);
			triggerEvent("OnPlayerBackFromAFK", client);
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("afk", (command, params, client) => {
	if(client.getData("v.afk") > 0) {
		client.setData("v.afk", 0, true);
		message(`${client.name} is no longer AFK`, COLOUR_YELLOW);
		triggerEvent("OnPlayerBackFromAFK", client);
	} else {
		client.setData("v.afk", 2, true);
		message(`${client.name} is now AFK`, COLOUR_YELLOW);
		triggerEvent("OnPlayerGoAFK", client);
	}
});

// ----------------------------------------------------------------------------