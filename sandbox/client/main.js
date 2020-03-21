"use strict";

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[game.game];
let gameName = gameNames[game.game];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	if(isConnected) {
		triggerNetworkEvent("sb.clientready");
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
		message("You " + messageText, gameAnnounceColour);
		console.log("[Sandbox] You " + messageText);
	}
}

// ----------------------------------------------------------------------------

