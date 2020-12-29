"use strict";

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[game.game];
let gameName = gameNames[game.game];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(isConnected) {
		triggerNetworkEvent("sb.clientready");
	} else {
		resyncWorld();
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("clear", function(cmdName, params, client) {
	for(let i=0;i<=19;i++) {
		global.message("", COLOUR_BLACK);
	}
	console.log("[Sandbox] Chatbox cleared");
});

// ----------------------------------------------------------------------------

function outputSandboxMessage(messageText) {
	if(isConnected) {
		console.log("[Sandbox] " + String(localClient.name) + " " + messageText);
		triggerNetworkEvent("sb.msg", messageText);
	} else {
		console.log("[Sandbox] You " + messageText);
		message("You " + messageText, gameAnnounceColour);
		
	}
}

// ----------------------------------------------------------------------------

