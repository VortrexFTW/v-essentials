"use strict";

// ----------------------------------------------------------------------------

// Configuration
let nametagFont = null;
let afkStatusFont = null;
let pingFont = null;
let nametagDistance = 50.0;
let nametagWidth = 70;
let nametagColour = [
	[0, 0, 0],                    		// (Invalid game)
	[51, 153, 255],            			// GTA III
	[255, 182, 255],            		// GTA Vice City
	[255, 255, 255],            		// GTA San Andreas
	[255, 255, 255],            		// GTA Underground
	[255, 255, 255],           			// GTA IV
	[255, 255, 255],            		// GTA IV (EFLC)
];

// ----------------------------------------------------------------------------

addEventHandler("OnResourceReady", function (event, resource) {
	if (resource == thisResource) {
		//let fontFile = openFile("pricedown.ttf", false);
		nametagFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
		afkStatusFont = lucasFont.createDefaultFont(18.0, "Roboto", "Light");
		//nametagFont = lucasFont.createFont(fontFile, 16.0);
		//pingFont = lucasFont.createFont(fontFile, 32.0);
		//fontFile.close();
	}
});

// ----------------------------------------------------------------------------

function createColour(alpha, red, green, blue) {
	return alpha << 24 | red << 16 | green << 8 | blue;
}

// ----------------------------------------------------------------------------

function getDistance(pos1, pos2) {
	let dx = pos1[0] - pos2[0];
	let dy = pos1[1] - pos2[1];
	let dz = pos1[2] - pos2[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ----------------------------------------------------------------------------

function drawNametag(screenPos, health, armour, text, ping, alpha, distance, colour, afk, skin) {
	if (nametagFont == null) {
		return false;
	}

	alpha *= 0.75;
	let width = nametagWidth;
	health = Math.max(0.0, Math.min(1.0, health));
	armour = Math.max(0.0, Math.min(1.0, armour));

	// Starts at bottom and works it's way up
	// -------------------------------------------
	// Health Bar

	if (health > 0.0) {
		let hx = screenPos.x - width / 2;
		let hy = screenPos.y - 10 / 2;
		let colourB = toColour(0, 0, 0, Math.floor(255.0 * alpha)); // Background colour (black)
		drawing.drawRectangle(null, [hx, hy], [width, 8], colourB, colourB, colourB, colourB);
		let colour = toColour(Math.floor(255.0 - (health * 255.0)), Math.floor(health * 255.0), 0, Math.floor(255.0 * alpha)); // Health bar colour (varies, depending on health)
		drawing.drawRectangle(null, [hx + 2, hy + 2], [(width - 4) * health, 10 - 6], colour, colour, colour, colour);
	}

	// Armour Bar
	if (armour > 0.0) {
		// Go up 10 pixels to draw the next part
		screenPos.y -= 10;
		let hx = screenPos.x - width / 2;
		let hy = screenPos.y - 10 / 2;
		let colourB = toColour(0, 0, 0, Math.floor(255.0 * alpha)); // Background colour (black)
		drawing.drawRectangle(null, [hx, hy], [width, 8], colourB, colourB, colourB, colourB);
		let colour = toColour(255, 255, 255, Math.floor(255.0 * alpha)); // Armour bar colour (white)
		drawing.drawRectangle(null, [hx + 2, hy + 2], [(width - 4) * armour, 10 - 6], colour, colour, colour, colour);
	}

	screenPos.y -= 20;

	// Nametag
	if (nametagFont != null) {
		let size = nametagFont.measure(text, game.width, 0.0, 0.0, nametagFont.size, false, false);
		nametagFont.render(text, [screenPos.x - size[0] / 2, screenPos.y - size[1] / 2], game.width, 0.0, 0.0, nametagFont.size, colour, false, false, false, true);
	}

	// Go up another 10 pixels for the next part
	screenPos.y -= 20;

	// AFK Status
	if (afkStatusFont != null) {
		if (afk) {
			let size = afkStatusFont.measure("PAUSED", game.width, 0.0, 0.0, afkStatusFont.size, false, false);
			afkStatusFont.render("PAUSED", [screenPos.x - size[0] / 2, screenPos.y - size[1] / 2], game.width, 0.0, 0.0, afkStatusFont.size, toColour(255, 0, 0, 255), false, false, false, true);
		}
	}
}

// ----------------------------------------------------------------------------

function updateNametags(element) {
	if (localPlayer != null) {
		let playerPos = (game.game == 10) ? localPlayer.neckPosition : localPlayer.position;
		let elementPos = (game.game == 10 && typeof element.neckPosition != "undefined") ? element.neckPosition : element.position;
		//let client = getClientFromPlayer(element);

		if(game.game != 10) {
			elementPos.z += 0.9;
		} else {
			elementPos.y += 0.4;
		}

		let screenPos = getScreenFromWorldPosition(elementPos);
		if (screenPos.z >= 0.0 || game.game == 10) {
			let health = element.health / 100.0;
			if (health > 1.0) {
				health = 1.0;
			}

			let armour = 0;
			if(game.game != 10) {
				armour = element.armour / 100.0;
				if (armour > 1.0) {
					armour = 1.0;
				}
			}

			if (game.game == GAME_GTA_III && skin == 109) {
				// Mickey Hamfists is ridiculously tall. Raise the nametag for him a bit
				screenPos.y -= 20;
			} else {
				screenPos.y -= 5;
			}

			let distance = getDistance(playerPos, elementPos);
			if (distance < nametagDistance) {
				if (element.type == ELEMENT_PLAYER) {
					let afk = false;
					if (element.getData("v.afk") > 0) {
						afk = true;
					}

					let colour = COLOUR_WHITE;
					if (element.getData("v.colour")) {
						colour = element.getData("v.colour");
					}
					drawNametag(screenPos, health, armour, element.name, 0, 1.0 - distance / nametagDistance, distance, colour, afk);
				}
			}
		}
	}
}

// ----------------------------------------------------------------------------

function getClientFromPlayer(player) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player == player) {
			return clients[i];
		}
	}
}

// ----------------------------------------------------------------------------

addNetworkHandler("armour", function (client, ped, armour) {
	if (ped != null) {
		ped.armour = armour;
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
	let peds = getElementsByType(ELEMENT_PLAYER);
	for (let i in peds) {
		if (peds[i] != localPlayer) {
			updateNametags(peds[i]);
		}
	}
});

// ----------------------------------------------------------------------------