"use strict";

// ----------------------------------------------------------------------------

// Configuration
let nametagFont = null;
let afkStatusFont = null;
let pingFont = null;
let nametagDistance = 50.0;
let nametagWidth = 70;
let nametagColour = [
    [0,0,0],                    		// (Invalid game)
    [51, 153, 255],            			// GTA III
    [255, 182, 255],            		// GTA Vice City
    [255, 255, 255],            		// GTA San Andreas
    [255, 255, 255],            		// GTA Underground
	[255, 255, 255],           			// GTA IV
	[255, 255, 255],            		// GTA IV (EFLC)
];

// ----------------------------------------------------------------------------

let playerColours = [
	toColour(51, 153, 255, 255),
	COLOUR_WHITE,
	COLOUR_ORANGE,
	toColour(186, 85, 211, 255),
	toColour(144, 255, 96, 255),
	COLOUR_YELLOW,
	COLOUR_AQUA,
	COLOUR_LIME,
	toColour(237, 67, 55, 255),
];

// ----------------------------------------------------------------------------

addEventHandler("OnResourceReady", function(event, resource) {
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
	return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

// ----------------------------------------------------------------------------

function drawNametag(x, y, health, armour, text, ping, alpha, distance, colour, afk, skin) {
	if(nametagFont == null) {
		return false;
	}
	
	alpha *= 0.75;
	let width = nametagWidth;
	health = Math.max(0.0, Math.min(1.0, health));
    armour = Math.max(0.0, Math.min(1.0, armour));
    
    // Starts at bottom and works it's way up
    // -------------------------------------------
    // Health Bar
	
	if(skin == 109) {
		y -= 20;
	} else {
		y -= 5;
	}	
	
	if(health > 0.0) {
		let hx = x-width/2;
		let hy = y-10/2;
		let colourB = toColour(0, 0, 0, Math.floor(255.0*alpha)); // Background colour (black)
		drawing.drawRectangle(null, [hx, hy], [width, 8], colourB, colourB, colourB, colourB);
		let colour = createColour(Math.floor(255.0*alpha), Math.floor(255.0-(health*255.0)), Math.floor(health*255.0), 0); // Health bar colour (varies, depending on health)
		drawing.drawRectangle(null, [hx+2, hy+2], [(width-4)*health, 10-6], colour, colour, colour, colour);
	}
    
    // Armour Bar
	if (armour > 0.0)
	{
		// Go up 10 pixels to draw the next part
		y -= 10;		
		let hx = x-width/2;
		let hy = y-10/2;
		let colourB = createColour(Math.floor(255.0*alpha), 0, 0, 0); // Background colour (black)
		drawing.drawRectangle(null, [hx, hy], [width, 8], colourB, colourB, colourB, colourB);
		let colour = createColour(Math.floor(255.0*alpha), 255, 255, 255); // Armour bar colour (white)
		drawing.drawRectangle(null, [hx+2, hy+2], [(width-4)*armour, 10-6], colour, colour, colour, colour);
	}
    
	y -= 20;
    
    // Nametag
	if(nametagFont != null) {
		let size = nametagFont.measure(text, game.width, 0.0, 0.0, nametagFont.size, false, false);
		let colourT = createColour(Math.floor(255.0*alpha), 255, 255, 255);
		nametagFont.render(text, [x-size[0]/2, y-size[1]/2], game.width, 0.0, 0.0, nametagFont.size, colour, false, false, false, true);
	}
	
    // Go up another 10 pixels for the next part
    y -= 20;	
	
    // AFK Status
	if(afkStatusFont != null) {
		if(afk) {
			let size = afkStatusFont.measure("PAUSED", game.width, 0.0, 0.0, afkStatusFont.size, false, false);
			afkStatusFont.render("PAUSED", [x-size[0]/2, y-size[1]/2], game.width, 0.0, 0.0, afkStatusFont.size, toColour(255, 0, 0, 255), false, false, false, true);
		}
	}	
	
	// Go up another 50 pixels for the next part
    //y -= 30;
	
	//if(ping != -1) {
	//	if(pingFont != null) {
	//		let size2 = pingFont.measure(ping, game.width, 0.0, 0.0, pingFont.size, false, false);
	//		let colourT2 = createColour(Math.floor(255.0*alpha), 255, 255, 255);
	//		pingFont.render(ping, [x-size2[0]/2, y-size2[1]/2], game.width, 0.0, 0.0, pingFont.size, colourT2, false, false, false, true);			
	//	}
	//}
}

// ----------------------------------------------------------------------------

function updateNametags(element) {
	//if(element.player != null) {
		let playerPos = localPlayer.position;
		let elementPos = element.position;
		
		elementPos[2] += 0.9;
		
		let screenPos = getScreenFromWorldPosition(elementPos);
		if (screenPos[2] >= 0.0) {

			
			let health = element.health/100.0;
			if(health > 1.0) {
				health = 1.0;
			}
			
			let armour = element.armour/100.0;
			if(armour > 1.0) {
				armour = 1.0; 
			}
			
			let distance = getDistance(playerPos, elementPos);
			if(distance < nametagDistance) {
				if(element.type == ELEMENT_PLAYER) {
					
					let colour = COLOUR_WHITE;
					if(element.getData("v.colour")) {
						colour = element.getData("v.colour");
					}
					let afk = false;
					if(element.getData("v.afk")) {
						afk = true;
					}
					drawNametag(screenPos[0], screenPos[1], health, armour, element.name, 0, 1.0-distance/nametagDistance, distance, colour, afk, element.skin);
				}
				// else {
				//	drawNametag(screenPos[0], screenPos[1], health, armour, skinNames[game.game][element.modelIndex], -1, 1.0-distance/nametagDistance, distance, COLOUR_SILVER);
				//}
			}
		}
	//}
}

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function(event) {
	let peds = getPeds();
	for(let i in peds) {
		if(peds[i] != localPlayer) {
			updateNametags(peds[i]);
        }
	}
});

// ----------------------------------------------------------------------------

var skinNames = [
	// Invalid Game (0 does not exist)
	null,
	
	// GTA III
	[								
		"CLAUDE",
		"POLICE OFFICER",
		"SWAT OFFICER",
		"FBI AGENT",
		"ARMY SOLDIER",
		"PARAMEDIC",
		"FIREFIGHTER",
		"WISE GUY",
		"TAXI DRIVER",
		"PIMP",
		"MAFIA MEMBER",
		"MAFIA MEMBER",
		"TRIAD MEMBER",
		"TRIAD MEMBER",
		"DIABLO MEMBER",
		"DIABLO MEMBER",
		"YAKUZA MEMBER",
		"YAKUZA MEMBER",
		"YARDIE MEMBER",
		"YARDIE MEMBER",
		"CARTEL SOLDIER",
		"CARTEL SOLDIER",
		"RED JACKS THUG",
		"PURPLE NINES THUG",
		"STREET CRIMINAL",
		"STREET CRIMINAL",
		"MALE CLIENT",
		"INVALID",
		"RANDOM GUY",
		"VACATIONIST",
		"DJ",
		"YOUNG WOMAN",
		"YOUNG WOMAN",
		"BUSINESS WOMAN",
		"ELDER WOMAN",
		"ELDER WOMAN",
		"PROSTITUTE",
		"PROSTITUTE",
		"RANDOM GUY",
		"DISEASED MAN",
		"DESEASED WOMAN",
		"YOUNG WOMAN",
		"OLD MAN",
		"RANDOM GUY",
		"OLD WOMAN",
		"OLD WOMAN",
		"OLD MAN",
		"RANDOMGUY",
		"OLD WOMAN",
		"YOUNG WOMAN",
		"DOCKS WORKER",
		"DOCKS WORKER",
		"MALE STREET BUM",
		"FEMALE STREET BUM",
		"DELIVERY GUY",
		"DELIVERY GUY",
		"BUSINESS MAN",
		"MARTY CHONKS",
		"CIA AGENT",
		"FEMALE CLIENT",
		"YOUNG WOMAN #5",
		"BUSINESS WOMAN",
		"BUSINESS MAN",
		"FEMALE CLIENT",
		"MALE STEWARD",
		"FEMALE STEWARD",
		"MALE COCKS FAN",
		"MALE COCKS FAN",
		"FEMALE COCKS FAN",
		"MALE PARAMEDICS ASSISTANT",
		"FEMALE PARAMEDICS ASSISTANT",
		"CONSTRUCTION WORKER",
		"CONSTRUCTION WORKER",
		"ZIP CUSTOMER",
		"PARTY WOMAN",
		"PARTY WOMAN",
		"MALE COLLEGE STUDENT",
		"FEMALE COLLEGE STUDENT",
		"OLD MAN",
		"FEMALE JOGGER",
		"ASUKA KASEN",
		"SPANK SUICIDE BOMBER",
		"SALVATORE'S BUTLER",
		"CATALINA",
		"LEE CHONG",
		"COLOMBIAN CARTEL MEMBER",
		"COLOMBIAN CARTEL MEMBER",
		"COLOMBIAN CARTEL MEMBER",
		"COLOMBIAN CARTEL MEMBER",
		"POLICE OFFICER",
		"CURLY BOB",
		"PHIL CASSIDY",
		"DETECTIVE/POTENTIAL CLIENT",
		"8-BALL (PRISON VARIATION)",
		"8-BALL",
		"SALVATORE LEONE",
		"MAFIA MEMBER",
		"JOEY LEONE",
		"JOEY LEONE",
		"BAR OWNER",
		"KENJI KASEN",
		"MIKE FORELLI",
		"DONALD LOVE",
		"DONALD LOVE",
		"LUIGI GOTERELLI",
		"MARIA LATORE",
		"MICKEY HAMFISTS",
		"MIGUEL",
		"MISTY",
		"OLD ORIENTAL GENTLEMAN",
		"OLD ORIENTAL GENTLEMAN",
		"OLD ORIENTAL GENTLEMAN",
		"RAY MACHOWSKI",
		"MAFIA MEMBER",
		"AMMU-NATION CLERK",
		"TANNER",
		"TONI CIPRIANI",
		"DARKEL",
		"CHUFF SECURITY OFFICER",
		"CLAUDE"
	],
	
	// GTA Vice City
	[
		"TOMMY VERCETTI",
		"POLICE OFFICER",
		"SWAT OFFICER",
		"FBI AGENT",
		"ARMY SOLDIER",
		"PARAMEDIC",
		"FIREMAN",
		"GOLFER",
		"RANDOM LADY",
		"BUM",
		"GREASER",
		"RANDOM GUY",
		"RANDOM GUY",
		"RANDOM LADY",
		"RANDOM GUY",
		"RANDOM GUY",
		"BEACH GIRL",
		"FAT BEACH LADY",
		"BEACH GUY",
		"FAT BEACH GUY",
		"RANDOM LADY",
		"RANDOM LADY",
		"RANDOM LADY",
		"PROSTITUTE",
		"BUM",
		"BUM",
		"RANDOM GUY",
		"TAXI DRIVER",
		"HAITIAN",
		"CRIMINAL",
		"RANDOM LADY",
		"RANDOM LADY",
		"RANDOM GUY",
		"RANDOM GUY",
		"RANDOM LADY",
		"RANDOM LADY",
		"RANDOM GUY",
		"BEACH LADY",
		"BEACH GUY",
		"BEACH LADY",
		"BEACH GUY",
		"RANDOM GUY",
		"PROSTITUTE",
		"BUM",
		"BUM",
		"RANDOM GUY",
		"RANDOM GUY",
		"PUNK",
		"PROSTITUTE",
		"RANDOM OLD LADY",
		"PUNK",
		"RANDOM GUY",
		"RANDOM LADY",
		"RANDOM LADY",
		"RANDOM GUY",
		"RANDOM GUY",
		"BEACH LADY",
		"BEACH GUY",
		"BEACH LADY",
		"BEACH GUY",
		"CONSTRUCTION WORKER",
		"GOLFER",
		"GOLFER",
		"GOLFER",
		"BEACH LADY",
		"BEACH GUY",
		"RANDOM LADY",
		"RANDOM GUY",
		"RANDOM GUY",
		"PROSTITUTE",
		"BUM LADY",
		"RANDOM GUY",
		"TAXI DRIVER",
		"CARJACKER",
		"RANDOM WOMAN",
		"SKATER GUY",
		"YOUNG WOMAN SHOPPER",
		"OLD WOMEN SHOPPER",
		"TOURIST",
		"TOURIST",
		"CUBAN",
		"CUBAN",
		"HAITIAN",
		"HAITIAN",
		"SHARK",
		"SHARK",
		"DIAZ GUY",
		"DIAZ GUY",
		"DBP SECURITY",
		"DBP SECURITY",
		"BIKER",
		"BIKER",
		"VERCETTI GUY",
		"VERCETTI GUY",
		"UNDERCOVER COP",
		"UNDERCOVER COP",
		"UNDERCOVER COP",
		"UNDERCOVER COP ",
		"UNDERCOVER COP",
		"UNDERCOVER COP",
		"RANDOM GUY",
		"BODYGUARD",
		"PROSTITUTE",
		"PROSTITUTE",
		"LOVE FIST GUY",
		"KEN ROSENBURG",
		"CANDY SUXX",
		"HILARY",
		"LOVE FIST",
		"PHIL",
		"ROCKSTAR GUY",
		"SONNY",
		"LANCE",
		"MERCADES",
		"LOVE FIST",
		"ALEX SCRUB",
		"LANCE VANCE",
		"LANCE VANCE",
		"CPT. CORTEZ",
		"LOVE FIST",
		"COLUMBIAN",
		"HILARY",
		"MERCADES",
		"CAM",
		"CAM",
		"PHIL",
		"PHIL",
		"BODYGUARD",
		"PIZZA WORKER",
		"TAXI DRIVER",
		"TAXI DRIVER",
		"SAILOR",
		"SAILOR",
		"SAILOR",
		"CHEF",
		"CRIMINAL",
		"FRENCH GUY",
		"WORKER",
		"HATIAN",
		"WAITRESS",
		"FORELLI MEMBER",
		"FORELLI MEMBER",
		"FORELLI MEMBER",
		"COLUMBIAN",
		"RANDOM GUY",
		"BEACH GUY",
		"RANDOM GUY",
		"RANDOM GUY",
		"RANDOM GUY",
		"DRAG QUEEN",
		"DIAZ TRAITOR",
		"RANDOM GUY",
		"RANDOM GUY",
		"STRIPPER",
		"STRIPPER",
		"STRIPPER",
		"STORE CLERK"
	],
	
	// GTA San Andreas - Names coming soon!
	new Array(300, "Unknown"),
];

function getClientFromPlayer(player) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].player == player) {
			return clients[i];
		}
	}
}