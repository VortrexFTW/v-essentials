"use strict";

// ----------------------------------------------------------------------------

addEvent("OnPlayerGameFocused", 1); // When game is focused (game is now the active window)
addEvent("OnPlayerGameDefocused", 1); // When the game is defocused (game is NOT the active window anymore, player probably ALT+TAB to something else)

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", (event, client) => {
	client.setData("v.afk", 0, true);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, client) => {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].getData("v.afk") == null) {
			clients[i].setData("v.afk", 0, true);
		}
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.afk", (client, state) => {
	if (state == true) {
		client.setData("v.afk", 1, true);
		if (client.player != null) {
			client.player.setData("v.afk", 1, true);
			triggerEvent("OnPlayerGameDefocused", client, client);
		}
	} else {
		client.setData("v.afk", 0, true);
		if (client.player != null) {
			client.player.setData("v.afk", 0, true);
			triggerEvent("OnPlayerGameFocused", client, client);
		}
	}
});

// ----------------------------------------------------------------------------