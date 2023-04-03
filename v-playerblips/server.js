"use strict";

// ----------------------------------------------------------------------------

function destroyBlipsAttachedTo(element) {
	element.children.forEach(function (value, index, array) {
		if (value.isType(ELEMENT_BLIP)) {
			destroyElement(value);
		}
	});
}

// ----------------------------------------------------------------------------

function attachBlipToPed(ped) {
	let colour = COLOUR_WHITE;
	if (ped.getData("v.colour") != null) {
		colour = ped.getData("v.colour");
	} else {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			colour = client.getData("v.colour");
		}
	}
	let blip = game.createBlipAttachedTo(ped, 0, 2, Number(colour), true, false);
	blip.streamInDistance = 999998;
	blip.streamOutDistance = 999999;
	//blip.existsFor(client, false);

	return blip;
}

// ----------------------------------------------------------------------------

// Add blips to existing players
bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
	getClients().forEach(function (client) {
		if (client.player != null) {
			client.player.streamInDistance = 999998;
			client.player.streamOutDistance = 999999;
			attachBlipToPed(client.player);
		}
	});
});

// ----------------------------------------------------------------------------

// Add blips to players when they spawn
addEventHandler("OnPedSpawn", (event, ped) => {
	if (ped.isType(ELEMENT_PLAYER)) {
		attachBlipToPed(ped);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementDestroy", (event, element) => {
	destroyBlipsAttachedTo(element);
});

// ----------------------------------------------------------------------------

// Stop players getting their own blips
addEventHandler("OnElementStreamIn", (event, element, client) => {
	if (element.isType(ELEMENT_BLIP)) {
		let attachee = element.parent;
		if (attachee != null && attachee == client.player) {
			event.preventDefault();
		}
	}
});

// ----------------------------------------------------------------------------
