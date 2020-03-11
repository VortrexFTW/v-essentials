"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let welcomeMessageColour = toColour(144, 255, 96, 255);

// ----------------------------------------------------------------------------

let disconnectReasons = [
	"Lost Connection",
	"Disconnected",
	"Unsupported Client",
	"Wrong Game",
	"Incorrect Password",
	"Unsupported Executable",
	"Disconnected",
	"Banned",
	"Failed",
	"Invalid Name",
	"Crashed"
];

// ----------------------------------------------------------------------------

let gameNames = [
	"Unknown", 
	"GTA III", 
	"GTA Vice City", 
	"GTA San Andreas", 
	"GTA Underground", 
	"GTA IV", 
	"GTA IV (EFLC)"
];

// ----------------------------------------------------------------------------

let gameAnnounceColour = [
	COLOUR_BLACK, 
	COLOUR_SILVER, 
	COLOUR_AQUA, 
	COLOUR_ORANGE, 
	COLOUR_ORANGE, 
	COLOUR_SILVER, 
	COLOUR_SILVER
];

// ----------------------------------------------------------------------------

let connectionID = Array(128);
connectionID.fill(-1);

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	client.setData("connectTime", new Date().getTime());
	messageClient("Welcome to Vortrex's Test Server!", client, welcomeMessageColour);
	
	let messageText = client.name + " has joined the game.";
	
	message(messageText, gameAnnounceColour[server.game]);
	console.log(messageText);
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, reason) {
	let messageText = client.name + " left the game (" + disconnectReasons[reason] + ")";
	message(messageText, gameAnnounceColour[server.game]);
	console.log(messageText);
});

// ----------------------------------------------------------------------------
