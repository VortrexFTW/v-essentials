"use strict";

// ----------------------------------------------------------------------------

// Configuration
let titleFont = null;
let subTitleFont = null;
let listFont = null;
let updateGTAIVInfo = null;

let listWidth = game.width / 3;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	let fontStream = openFile("pricedown.ttf");
	if (fontStream != null) {
		titleFont = lucasFont.createFont(fontStream, 22.0);
		fontStream.close();
	}
	subTitleFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
	listFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");

	if (typeof gta != "undefined") {
		if (updateGTAIVInfo == null) {
			updateGTAIVInfo = setInterval(function () {
				triggerNetworkEvent("v.ivinfo.", game.ivEpisode, game.ivGamemode);
			}, 2500);
		}
	}
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (typeof gta != "undefined") {
		if (updateGTAIVInfo == null) {
			updateGTAIVInfo = setInterval(function () {
				triggerNetworkEvent("v.ivinfo.", game.ivEpisode, game.ivGamemode);
			}, 2500);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
	if (isKeyDown(SDLK_TAB)) {
		if (listFont != null && titleFont != null) {
			let playersText = `PLAYERS`;
			let scoreboardStart = (game.height / 2) - (Math.floor(getClients().length / 2) * 20);
			titleFont.measure(playersText, listWidth, 0.0, 1.0, 10, false, false);
			titleFont.render(playersText, [game.width / 2, scoreboardStart - 85], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);

			let playerCountText = `${getClients().length} connected`;
			subTitleFont.measure(playerCountText, listWidth, 0.0, 1.0, 10, false, false);
			subTitleFont.render(playerCountText, [game.width / 2, scoreboardStart - 55], 0, 0.5, 0.0, subTitleFont.size, COLOUR_WHITE, false, false, false, true);

			let text = "";
			let size = null;

			let listColumns = ["ID", "Name", "Ping"];
			if (typeof gta != "undefined") {
				// Episode
				text = "Unknown";
				if (game.game == GAME_GTA_IV) {
					listColumns = ["ID", "Name", "Ping", "Episode", "Gamemode"];
				}
			}

			let columnWidth = Math.round(listWidth / listColumns.length);
			let listLeft = Math.round(game.width / 2) - (listWidth / 2);

			graphics.drawRectangle(null, [listLeft, scoreboardStart - 5], [listWidth + 50, 1], COLOUR_WHITE);

			for (let i in listColumns) {
				let columnLeft = Math.round(listLeft + (columnWidth * i));
				size = listFont.measure(listColumns[i], columnWidth, 0.5, 1.0, 10, false, false);
				listFont.render(listColumns[i], [columnLeft, scoreboardStart - 30], columnWidth, 0.5, 1.0, listFont.size, COLOUR_WHITE, false, false, false, true);
			}

			let clients = getClients();
			for (let i in clients) {
				let colour = COLOUR_WHITE;
				if (clients[i].getData("v.colour") != null) {
					colour = clients[i].getData("v.colour");
				}

				let name = clients[i].name;
				if (clients[i].getData("v.name") != null) {
					name = clients[i].getData("v.name");
				}

				let listColumnData = [String(clients[i].index), name, String(clients[i].getData("v.ping"))];
				if (typeof gta != "undefined") {
					// Episode
					text = "Unknown";
					if (game.game == GAME_GTA_IV) {
						listColumnData = [String(clients[i].index), name, String(clients[i].getData("v.ping")), ivEpisodes[clients[i].getData("v.ivinfo")[0]], ivGamemodes[clients[i].getData("v.ivinfo")[1]]];
					}
				}

				for (let j in listColumnData) {
					let columnLeft = Math.round(listLeft + (columnWidth * j));
					listFont.measure(listColumnData[j], columnWidth, 0.5, 1.0, 10, false, false);
					listFont.render(listColumnData[j], [columnLeft, scoreboardStart + (i * 20)], columnWidth, 0.5, 1.0, listFont.size, colour, false, false, false, true);
				}

				if (clients[i].getData("v.afk") == true) {
					listFont.measure("PAUSED", columnWidth, 0.5, 1.0, 10, false, false);
					listFont.render("PAUSED", [listLeft + listWidth + 50, scoreboardStart + (i * 20)], columnWidth, 0.5, 1.0, listFont.size, colour, false, false, false, true);
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