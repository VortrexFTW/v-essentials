"use strict";

// ----------------------------------------------------------------------------

let blipGameColours = [
	toColour(0, 0, 0, 0),			// Invalid
	toColour(51, 153, 255, 255),	// GTA III
	toColour(186, 85, 211, 255),	// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	//COLOUR_SILVER,					// GTA IV
	//COLOUR_SILVER					// GTA IV (EFLC)	 
];

// ----------------------------------------------------------------------------

let playerColours = [
	toColour(51, 153, 255, 255),
	toColour(255, 255, 255, 255),
	COLOUR_ORANGE,
	toColour(186, 85, 211, 255),
	toColour(144, 255, 96, 255),
	COLOUR_YELLOW,
	COLOUR_AQUA,
	COLOUR_LIME,
	toColour(237, 67, 55, 255),
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

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	//if(resource == thisResource) {
		let clients = getClients();
		for(let i in clients) {	
			if(clients[i].player != null) {
				let colour = COLOUR_WHITE;
				if(clients[i].getData("v.colour") != null) {
					colour = clients[i].player.getData("v.colour");
				}
				
				let tempBlip = createBlipAttachedTo(0, clients[i].player, 2, colour);
				clients[i].setData("blip", tempBlip, true);		
				addToWorld(tempBlip);
			}
		}
	//}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped.type == ELEMENT_PLAYER) {
		setTimeout(setPlayerBlip, 500, ped);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, reason) {
	let tempBlip = client.getData("blip");
	if(tempBlip != null) {
		destroyElement(tempBlip);
		client.removeData("blip");
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element, client) {
	if(element.type == ELEMENT_BLIP) {
		// Prevent player's blip from being streamed to themselves.
		// Make sure the blip is attached to something, and that something is the player.
		if(element.parent != null) {
			if(element.parent == client.player) {
				event.preventDefault();
			}
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

// ----------------------------------------------------------------------------

function setPlayerBlip(player) {
	let client = getClientFromPed(ped);
	let colour = COLOUR_WHITE;
	if(client.player.getData("v.colour") != null) {
		colour = client.getData("colour")
	}
	let tempBlip = createBlipAttachedTo(0, player, 2, colour);
	client.setData("blip", tempBlip, true);		
	addToWorld(tempBlip);				
}