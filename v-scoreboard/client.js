"use strict";

// ----------------------------------------------------------------------------

// Configuration
let titleFont = null;
let listFont = null;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	let fontStream = openFile("pricedown.ttf");
	if(fontStream != null) {
		titleFont = lucasFont.createFont(fontStream, 22.0);
		fontStream.close();
	}
	listFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
	if(isKeyDown(SDLK_TAB)) {
		if(listFont != null && titleFont != null) {
			let scoreboardStart = (game.height/2)-(Math.floor(getClients().length/2)*20);
			let titleSize = titleFont.measure("PLAYERS", game.width, 0.0, 1.0, 10, false, false);
			titleFont.render("PLAYERS", [game.width/2, scoreboardStart-50], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);		

			titleSize = titleFont.measure("____________________________", game.width, 0.0, 1.0, 10, false, false);
			titleFont.render("____________________________", [game.width/2, scoreboardStart-35], 0, 0.5, 0.0, titleFont.size, COLOUR_WHITE, false, false, false, true);				
			
			let clients = getClients();
			for(let i in clients) {
				let colour = COLOUR_WHITE;
				if(clients[i].getData("v.colour")) {
					colour = clients[i].getData("v.colour");
				}
				
				// Player ID
				let text = String(clients[i].index);
				let size = listFont.measure(text, 75, 0.0, 1.0, 10, false, false);
				listFont.render(text, [game.width/2-100, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);				
				
				// Player Name
				text = clients[i].name;
				size = listFont.measure(text, 100, 0.0, 1.0, 10, false, false);
				listFont.render(text, [game.width/2, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, colour, false, false, false, true);
				
				// Ping
				let ping = "0";
				if(clients[i].getData("v.ping")) {
					ping = String(clients[i].getData("v.ping"));
				}
				size = listFont.measure(ping, 75, 0.0, 1.0, 10, false, false);
				listFont.render(ping, [game.width/2+100, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_WHITE, false, false, false, true);							
				
				// PAUSED Status (depends on resource "afk")
				if(clients[i].getData("v.afk") > 0) {
					size = listFont.measure("PAUSED", 100, 0.0, 1.0, 10, false, false);
					listFont.render("PAUSED", [game.width/2+200, scoreboardStart + (i*20)], 0, 0.5, 0.0, listFont.size, COLOUR_RED, false, false, false, true);							
				}
			}
		}
	}
});

// ----------------------------------------------------------------------------