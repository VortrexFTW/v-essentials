"use strict";

// ----------------------------------------------------------------------------

let playerColours = [
	toColour(51, 153, 255, 255),
	COLOUR_ORANGE,
	toColour(186, 85, 211, 255),
	toColour(144, 255, 96, 255),
	COLOUR_YELLOW,
	COLOUR_AQUA,
	COLOUR_LIME,
	toColour(237, 67, 55, 255),
];

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	client.setData("v.colour", playerColours[client.index], true);	
	
	setTimeout(setPlayerColour, 500, client);
});

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	//if(resource == thisResource) {
		let clients = getClients();
		for(let i in clients) {
			clients[i].setData("v.colour", playerColours[clients[i].index], true);	
			clients[i].player.setData("v.colour", playerColours[clients[i].index], true);	
		}
	//}
});

function setPlayerColour(client) {
	client.player.setData("v.colour", playerColours[client.index], true);		
}