"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i] != localClient) {
			setClientBlip(clients[i], clients[i].getData("v.colour"));
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function (event, ped) {
	//if(ped.type == ELEMENT_PLAYER) {
	//	if(ped != localPlayer) {
	//		if(ped.getData("v.blip") == null) {
	//			setPlayerBlip(ped);
	//		}
	//	} else {
	//		setTimeout(destroyElement, 500, ped.getData("v.blip"));
	//	}
	//}
});

// ----------------------------------------------------------------------------

function getClientFromPed(ped) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player != null) {
			if (clients[i].player == ped) {
				return clients[i];
			}
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function setPlayerBlip(player) {
	if (localPlayer == player) {
		return false;
	}

	let colour = COLOUR_WHITE;
	if (player.getData("v.colour")) {
		colour = player.getData("v.colour");
	}
	let tempBlip = createBlipAttachedTo(player, 0, 2, colour);
	player.getData("v.blip", tempBlip)
}

// ----------------------------------------------------------------------------

function setClientBlip(client, colour) {
	let tempBlip = createBlipAttachedTo(client.player, 0, 2, colour);
}

// ----------------------------------------------------------------------------