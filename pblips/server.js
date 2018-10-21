"use strict";

// ----------------------------------------------------------------------------

let blipGameColours = [
	toColour(0, 0, 0, 0),			// Invalid
	,	// GTA III
	toColour(186, 85, 211, 255),	// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	//COLOUR_SILVER,					// GTA IV
	//COLOUR_SILVER					// GTA IV (EFLC)	 
];

// ----------------------------------------------------------------------------

let blipGameSizes = [
    0,          		// Invalid
    3,   				// GTA III
    2,    				// GTA Vice City
    3,                  // GTA San Andreas
    3,                  // GTA Underground
    1,                  // GTA IV
    3                   // GTA IV (EFLC)     
];

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		let clients = getClients();
		for(let i in clients) {
			let tempBlip =  createBlipAttachedTo(clients[i].player, 0, 2, toColour(51, 153, 255, 255));
			clients[i].player.setData("playerBlip", tempBlip, true);
			addToWorld(tempBlip);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped.type == ELEMENT_PLAYER) {
		let tempBlip = createBlipAttachedTo(ped, 0, 2, toColour(51, 153, 255, 255));
		ped.setData("playerBlip", tempBlip, true);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, reason) {
	let tempBlip = client.player.getData("playerBlip");
	if(tempBlip != null) {
		destroyElement(tempBlip);
		client.player.removeData("playerBlip");
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element, client) {
	if(element.type == ELEMENT_BLIP) {
		// Prevent player's blip from being streamed to themselves.
		// Make sure the blip is attached to something, and that something is the player.
		if(element.parent != null && element.parent == client.player) {
			event.preventDefault();
		}
	}
});

// ----------------------------------------------------------------------------

function getClientFromPed(ped) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].player == ped) {
			return clients[i];
		}
	}
	
	return false;
}