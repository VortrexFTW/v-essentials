"use strict";

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
	"GTA IV (EFLC)",
	"Unknown",
	"Unknown",
	"Unknown",
	"Mafia: The City of Lost Heaven",
	"Mafia II",
	"Mafia III",
	"Mafia Definitive Edition",
];

// ----------------------------------------------------------------------------

let gameAnnounceColour = [
	COLOUR_BLACK,
	COLOUR_SILVER,
	COLOUR_AQUA,
	COLOUR_ORANGE,
	COLOUR_ORANGE,
	COLOUR_SILVER,
	COLOUR_SILVER,
	COLOUR_BLACK,
	COLOUR_BLACK,
	COLOUR_BLACK,
	COLOUR_RED,
	COLOUR_RED,
	COLOUR_RED,
	COLOUR_RED,
];

// ----------------------------------------------------------------------------

let connectionID = Array(128);
connectionID.fill(-1);

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	client.setData("connectTime", new Date().getTime());
	messageClient(`Welcome to ${server.name}!`, client, welcomeMessageColour);
	messageClient(`Use /help for commands and info`, client, COLOUR_YELLOW);

	let messageText = `${client.name} has joined the game.`;
	if(typeof module.geoip != "undefined") {
		let countryName = module.geoip.getCountryName("geoip-country.mmdb", client.ip) || "Unknown";
		if(countryName != "Unknown") {
			messageText = `👋 [#0099FF]${client.name} [#FFFFFF]has joined the game from ${countryName}`;
		}
	}

	message(messageText, gameAnnounceColour[server.game]);
	console.log(messageText);
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, reason) {
	let messageText = `👋 [#0099FF]${client.name} [#FFFFFF]left the game [#999999](${disconnectReasons[reason]})`;
	message(messageText, gameAnnounceColour[server.game]);
	console.log(messageText);
});

// ----------------------------------------------------------------------------
