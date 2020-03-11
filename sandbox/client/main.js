"use strict";

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

function outputSandboxMessage(messageText) {
	let name = (isConnected) ? localClient.name : "You";
	let outputMessage = String(name) + " " + messageText;
	if(isConnected) {
		triggerNetworkEvent("sb.msg", outputMessage);
	} else {
		message(outputMessage, gameAnnounceColour);
		console.log(outputMessage);
	}
}

// ----------------------------------------------------------------------------