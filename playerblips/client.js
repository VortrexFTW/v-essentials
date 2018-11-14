"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	//if(resource == thisResource) {
		let peds = getPeds();
		for(let i in peds) {	
			if(peds[i] != localPlayer) {
				if(peds[i].type == ELEMENT_PLAYER) {
					setTimeout(setPlayerBlip, 1000, peds[i]);
				}
			}
		}
	//}
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, ped) {
	if(ped.type == ELEMENT_PLAYER) {
		if(ped != localPlayer) {
			if(ped.getData("v.blip") == null) {
				setTimeout(setPlayerBlip, 1000, ped);
			}
		} else {
			setTimeout(destroyElement, 500, ped.getData("v.blip"));
		}
	}
});

// ----------------------------------------------------------------------------

function getClientFromPed(ped) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].player != null) {
			if(clients[i].player == ped) {
				return clients[i];
			}
		}
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function setPlayerBlip(player) {
	if(localPlayer == player) {
		return false;
	}
	
	let colour = COLOUR_WHITE;
	if(player.getData("v.colour")) {
		colour = player.getData("v.colour");
	}
	let tempBlip = createBlipAttachedTo(player, 0, 2, colour);				
	player.getData("v.blip", tempBlip)
}

// ----------------------------------------------------------------------------