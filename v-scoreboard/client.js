"use strict";

// ----------------------------------------------------------------------------

// Configuration
let titleFont = null;
let listFont = null;
let updateGTAIVInfo = null;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	let fontStream = openFile("pricedown.ttf");
	if(fontStream != null) {
		titleFont = lucasFont.createFont(fontStream, 22.0);
		fontStream.close();
	}
	listFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");

	if(updateGTAIVInfo == null) {
		updateGTAIVInfo = setInterval(function() {
			triggerNetworkEvent("v.ivinfo.", gta.ivEpisode, gta.ivGamemode);
		}, 2500);
	}
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(updateGTAIVInfo == null) {
		updateGTAIVInfo = setInterval(function() {
			triggerNetworkEvent("v.ivinfo.", gta.ivEpisode, gta.ivGamemode);
		}, 2500);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
	if(isKeyDown(SDLK_TAB)) {
		if(listFont != null && titleFont != null) {
			let scoreboardStart = (game.height/2)-(Math.floor(getClients().length/2)*20);
			let titleSize = titleFont.measure("PLAYERS", game.width, 0.0, 1.0, 10, false, false);
			titleFont.render("PLAYERS", [game.width/2, scoreboardStart-75], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);

			titleSize = titleFont.measure("___________________________________", game.width, 0.0, 1.0, 10, false, false);
			titleFont.render("___________________________________", [game.width/2, scoreboardStart-35], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);

			let text = "";
			let size = null;

			// Player ID
			size = listFont.measure("ID", 100, 0.0, 1.0, 10, false, false);
			listFont.render("ID", [game.width/2-200, scoreboardStart-30], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

			// Player Name
			size = listFont.measure("Name", 100, 0.0, 1.0, 10, false, false);
			listFont.render("Name", [game.width/2-100, scoreboardStart-30], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

			// Ping
			size = listFont.measure("Ping", 100, 0.0, 1.0, 10, false, false);
			listFont.render("Ping", [game.width/2, scoreboardStart-30], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

			// Episode
			size = listFont.measure("Episode", 100, 0.0, 1.0, 10, false, false);
			listFont.render("Episode", [game.width/2+100, scoreboardStart-30], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

			// GameMode
			size = listFont.measure("Gamemode", 100, 0.0, 1.0, 10, false, false);
			listFont.render("Gamemode", [game.width/2+200, scoreboardStart-30], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

			let clients = getClients();
			for(let i in clients) {
				if(!clients[i].console) {
					let colour = COLOUR_WHITE;
					if(clients[i].getData("v.colour")) {
						colour = clients[i].getData("v.colour");
					}

					// Player ID
					text = String(clients[i].index);
					size = listFont.measure(text, 100, 0.0, 1.0, 10, false, false);
					listFont.render(text, [game.width/2-200, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

					// Player Name
					text = clients[i].name;
					size = listFont.measure(text, 100, 0.0, 1.0, 10, false, false);
					listFont.render(text, [game.width/2-100, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, colour, false, false, false, true);

					// Ping
					text = "0";
					if(clients[i].getData("v.ping")) {
						text = String(clients[i].getData("v.ping"));
					}
					size = listFont.measure(text, 100, 0.0, 1.0, 10, false, false);
					listFont.render(text, [game.width/2, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

					// Episode
					text = "Unknown";
					if(gta.game == GAME_GTA_IV) {
						if(clients[i].getData("v.ivinfo") != null) {
							if(clients[i].getData("v.ivinfo")[1] == -1) {
								text = "None";
							} else {
								let episodeId = clients[i].getData("v.ivinfo")[0];
								text = ivEpisodes[episodeId];
							}
						}
					}
					size = listFont.measure(text, 100, 0.0, 1.0, 10, false, false);
					listFont.render(text, [game.width/2+100, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

					// GameMode
					text = "Unknown";
					if(gta.game == GAME_GTA_IV) {
						if(clients[i].getData("v.ivinfo") != null) {
							if(clients[i].getData("v.ivinfo")[1] == -1) {
								text = "None";
							} else {
								let gameModeId = clients[i].getData("v.ivinfo")[1];
								text = ivGamemodes[gameModeId];
							}
						}
					}
					size = listFont.measure(text, 100, 0.0, 1.0, 10, false, false);
					listFont.render(text, [game.width/2+200, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);

					// PAUSED Status (depends on resource "afk")
					if(clients[i].getData("v.afk") > 0) {
						size = listFont.measure("PAUSED", 100, 0.0, 1.0, 10, false, false);
						listFont.render("PAUSED", [game.width/2+300, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_RED, false, false, false, true);
					}
				}
			}
		}
	}
});

// ----------------------------------------------------------------------------

let ivEpisodes = [
	"IV",
	"TLAD",
	"TBoGT",
]

// ----------------------------------------------------------------------------

let ivGamemodes = [
	"Deathmatch",
	"Team Deathmatch",
	"Mafiya Work",
	"Team Mafiya Work",
	"Team Car Jack City",
	"Car Jack City",
	"Race",
	"GTA Race",
	"Party Mode",
	"Invalid (9)",
	"Cops n' Crooks",
	"Invalid (11)",
	"Turf War",
	"Deal Breaker",
	"Hangman's NOOSE",
	"Bomb da Base II",
	"Freemode",
	"Chopper v Chopper",
	"Witness Protection",
	"Club Business",
	"Races",
	"Team Deathmatch",
	"Own the City",
	"Lone Wolf Biker",
	"Deathmatch",
	"Instant Play",
	"Deathmatch",
	"Team Deathmatch",
	"Races",
	"GTA Races",
	"Custom (Sandbox)",
];

// ----------------------------------------------------------------------------