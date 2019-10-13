"use strict";

// ----------------------------------------------------------------------------

let isServer = false;

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[game.game];
let gameName = gameNames[game.game];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	//if(resource == thisResource) {
		if(isConnected) {
			triggerNetworkEvent("sb.clientready");
		}
	//}
});

// ----------------------------------------------------------------------------

addCommandHandler("clear", function(cmdName, params, client) {
	for(let i=0;i<=19;i++) {
		global.message("", COLOUR_BLACK);
	}
});

// ----------------------------------------------------------------------------