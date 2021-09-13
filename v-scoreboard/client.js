"use strict";

// ----------------------------------------------------------------------------

// Configuration
let titleFont = null;
let listFont = null;
let updateGTAIVInfo = null;

let listWidth = game.width/4;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	let fontStream = openFile("pricedown.ttf");
	if(fontStream != null) {
		titleFont = lucasFont.createFont(fontStream, 22.0);
		fontStream.close();
	}
	listFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");

	if(typeof gta != "undefined") {
		if(updateGTAIVInfo == null) {
			updateGTAIVInfo = setInterval(function() {
				triggerNetworkEvent("v.ivinfo.", gta.ivEpisode, gta.ivGamemode);
			}, 2500);
		}
	}
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(typeof gta != "undefined") {
		if(updateGTAIVInfo == null) {
			updateGTAIVInfo = setInterval(function() {
				triggerNetworkEvent("v.ivinfo.", gta.ivEpisode, gta.ivGamemode);
			}, 2500);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
	if(isKeyDown(SDLK_TAB)) {
		if(listFont != null && titleFont != null) {
			let scoreboardStart = (game.height/2)-(Math.floor(getClients().length/2)*20);
			let titleSize = titleFont.measure("PLAYERS", listWidth, 0.0, 1.0, 10, false, false);
			titleFont.render("PLAYERS", [game.width/2, scoreboardStart-75], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);

			titleSize = titleFont.measure("___________________________________", listWidth, 0.0, 1.0, 10, false, false);
			titleFont.render("___________________________________", [game.width/2, scoreboardStart-35], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);

			let text = "";
			let size = null;

			let listColumns = ["ID", "Name", "Ping"];
			if(typeof gta != "undefined") {
				// Episode
				text = "Unknown";
				if(gta.game == GAME_GTA_IV) {
					listColumns = ["ID", "Name", "Ping", "Episode", "Gamemode"];
				}
			}

			for(let i in listColumns) {
				size = listFont.measure(listColumns[i], listWidth, 0.0, 1.0, 10, false, false);
				listFont.render(listColumns[i], [(Math.round(game.width/2)-Math.round(listWidth/listColumns.length))+(Math.round(listWidth/listColumns.length))*i, scoreboardStart-30], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);
			}

			let clients = getClients();
			for(let i in clients) {
				if(!clients[i].console) {
					let colour = COLOUR_WHITE;
					if(clients[i].getData("v.colour")) {
						colour = clients[i].getData("v.colour");
					}

					let listColumnData = [String(clients[i].index), String(clients[i].name), String(clients[i].getData("v.ping"))];
					if(typeof gta != "undefined") {
						// Episode
						text = "Unknown";
						if(gta.game == GAME_GTA_IV) {
							listColumnData = [String(clients[i].index), String(clients[i].name), String(clients[i].getData("v.ping")), ivEpisodes[clients[i].getData("v.ivinfo")[0]], ivGamemodes[clients[i].getData("v.ivinfo")[1]]];
						}
					}

					for(let j in listColumnData) {
						size = listFont.measure(listColumnData[j], Math.round(listWidth/listColumns.length), 0.0, 1.0, 10, false, false);
						listFont.render(listColumnData[j], [(Math.round(game.width/2)-Math.round(listWidth/listColumns.length))+(Math.round(listWidth/listColumns.length))*j, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);
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