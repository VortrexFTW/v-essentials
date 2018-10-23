"use strict";

// ----------------------------------------------------------------------------

let spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
let spawnScreenPedHeading = 15.0;
let spawnScreenCamPosition = new Vec3(138.17, -909.90, 28.16);
let spawnScreenCamLookAtPosition = new Vec3(139.54, -903.00, 26.16);

let inSpawnScreen = false;
let spawnCivilian = false;

let skinSelectFont = null;

// ----------------------------------------------------------------------------

addEventHandler("OnKeyUp", function (event, keyCode, scanCode, mod) {
	switch(keyCode) {
		case SDLK_F1:
			if(isConnected) {
				if(!inSpawnScreen) {
					inSpawnScreen = true;				
					triggerNetworkEvent("v.respawn");
					setTimeout(showSkinSelect, 500);
				}
			}
			break;
			
		case SDLK_RIGHT:
			if(inSpawnScreen) {
				event.preventDefault();
				localPlayer.heading = spawnScreenPedHeading;
				if(localPlayer.skin >= 122) {
					localPlayer.skin = 0;
				} else {
					if(localPlayer.skin == 25) {
						localPlayer.skin = 30;
					} else {
						localPlayer.skin++;
					}					
				}
				localPlayer.heading = spawnScreenPedHeading;								
			}
			break;
			
		case SDLK_LEFT:
			if(inSpawnScreen) {
				event.preventDefault();
				localPlayer.heading = spawnScreenPedHeading;
				if(localPlayer.skin <= 0) {
					localPlayer.skin = 122;
				} else {
					if(localPlayer.skin == 30) {
						localPlayer.skin = 25;
					} else {
						localPlayer.skin--;
					}
				}
				localPlayer.heading = spawnScreenPedHeading;				
			}
			break;
			
		case SDLK_v:
			localPlayer.crouching = true;
			break;

		case SDLK_RETURN:
		case SDLK_LCTRL:
			if(inSpawnScreen) {
				event.preventDefault();
				triggerNetworkEvent("v.ss.sel", localPlayer.skin);
				inSpawnScreen = false;
				setHUDEnabled(true);
				message("You spawned as " + skinNames[game.game][localPlayer.skin], gameAnnounceColour);
			}
			break;		
	}
});

addEventHandler("OnStartMission", function(event, mission) {
	switch (game.game) {
		case GAME_GTA_III:
			if (mission == 0) { // use 19 if you want the introduction movie
				fadeCamera(true);
				event.preventDefault();
			}
			break;
			
		case GAME_GTA_VC:
			if (mission == 1) {
				fadeCamera(true);
				event.preventDefault();
			}
			break;
			
		case GAME_GTA_SA:
			if (mission == 2) {
				fadeCamera(true);
				event.preventDefault();
			}
			break;
			
		case GAME_GTA_UG:
			if (mission == 2) {
				fadeCamera(true);
				event.preventDefault();
			}
			break;
			
		default:
			break;
	}
});

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		let fontStream = openFile("pricedown.ttf");
		if(fontStream != null) {
			skinSelectFont = lucasFont.createFont(fontStream, 28.0);
			fontStream.close();
		}
		
		setTimeout(showSkinSelect, 1000);
	}
});

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped.type == ELEMENT_PLAYER) {
		if(ped == localPlayer) {
			if(inSpawnScreen) {
				setTimeout(showSkinSelect, 300);
			}
		}
	}
});

addEventHandler("OnPedWasted", function(event, ped) {
	if(ped.type == ELEMENT_PLAYER) {
		if(ped == localPlayer) {
			inSpawnScreen = true;
			setTimeout(showSkinSelect, 500);
		}
	}
});

function showSkinSelect() {
	localPlayer.position = spawnScreenPedPosition;
	localPlayer.heading = spawnScreenPedHeading;			
	localPlayer.collisionsEnabled = false;
	localPlayer.stayInSamePlace = false;
	setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
	setHUDEnabled(false);
	inSpawnScreen = true;
}

addEventHandler("OnDrawnHUD", function (event) {
	if(inSpawnScreen) {
		if(skinSelectFont != null) {			
			let text = skinNames[game.game][localPlayer.skin];
			let size = skinSelectFont.measure(text, 200, 0.0, 1.0, 28, false, false);
			skinSelectFont.render(text, [96, game.height-128], 300, 0.0, 0.0, skinSelectFont.size, COLOUR_WHITE, false, false, false, true);
		}
	}
});

let skinNames = [
	[],
	["Claude", "Police Officer", "SWAT Officer", "FBI Agent", "Army Soldier", "Paramedic", "Firefighter", "Wise Guy", "Taxi Driver", "Pimp", "Mafia Member", "Mafia Member", "Triad Member", "Triad Member", "Diablo Member", "Diablo Member", "Yakuza Member", "Yakuza Member", "Yardie Member", "Yardie Member", "Cartel Soldier", "Cartel Soldier", "Red Jacks Thug", "Purple Nines Thug", "Street Criminal", "Street Criminal", "INVALID", "INVALID", "INVALID", "INVALID", "Male Client", "Random Guy", "Vacationist", "Dj", "Young Woman", "Young Woman", "Business Woman", "Elder Woman", "Elder Woman", "Prostitute", "Prostitute", "Random Guy", "Diseased Man", "Deseased Woman", "Young Woman", "Old Man", "Random Guy", "Old Woman", "Old Woman", "Old Man", "Random Guy", "Old Woman", "Young Woman", "Docks Worker", "Docks Worker", "Male Street Bum", "Female Street Bum", "Delivery Guy", "Delivery Guy", "Business Man", "Marty Chonks", "Cia Agent", "Female Client", "Young Woman", "Business Woman", "Business Man", "Female Client", "Male Steward", "Female Steward", "Male Cocks Fan", "Male Cocks Fan", "Female Cocks Fan", "Male Paramedics Assistant", "Female Paramedics Assistant", "Construction Worker", "Construction Worker", "Zip Customer", "Party Woman", "Party Woman", "Male College Student", "Female College Student", "Old Man", "Female Jogger", "Asuka Kasen", "Spank Suicide Bomber", "Salvatore's Butler", "Catalina", "Lee Chong", "Colombian Cartel Member", "Colombian Cartel Member", "Colombian Cartel Member", "Colombian Cartel Member", "Police Officer", "Curly Bob", "Phil Cassidy", "Detective", "8-Ball", "8-Ball", "Salvatore Leone", "Mafia Member", "Joey Leone", "Joey Leone", "Bar Owner", "Kenji Kasen", "Mike Forelli", "Donald Love", "Donald Love", "Luigi Goterelli", "Maria Latore", "Mickey Hamfists", "Miguel", "Misty", "Old Oriental Gentleman", "Old Oriental Gentleman", "Old Oriental Gentleman", "Ray Machowski", "Mafia Member", "Ammu-Nation Clerk", "Tanner", "Toni Cipriani", "Darkel", "Chuff Security Officer", "Prisoner Claude"],
	["Tommy Vercetti", "Police Officer", "SWAT Officer", "FBI Agent", "Army Soldier", "Paramedic", "Fireman", "Golfer", "Random Lady", "Bum", "Greaser", "Random Guy", "Random Guy", "Random Lady", "Random Guy", "Random Guy", "Beach Girl", "Fat Beach Lady", "Beach Guy", "Fat Beach Guy", "Random Lady", "Random Lady", "Random Lady", "Prostitute", "Bum", "Bum", "Random Guy", "Taxi Driver", "Haitian", "Criminal", "Random Lady", "Random Lady", "Random Guy", "Random Guy", "Random Lady", "Random Lady", "Random Guy", "Beach Lady", "Beach Guy", "Beach Lady", "Beach Guy", "Random Guy", "Prostitute", "Bum", "Bum", "Random Guy", "Random Guy", "Punk", "Prostitute", "Random Old Lady", "Punk", "Random Guy", "Random Lady", "Random Lady", "Random Guy", "Random Guy", "Beach Lady", "Beach Guy", "Beach Lady", "Beach Guy", "Construction Worker", "Golfer", "Golfer", "Golfer", "Beach Lady", "Beach Guy", "Random Lady", "Random Guy", "Random Guy", "Prostitute", "Bum Lady", "Random Guy", "Taxi Driver", "Carjacker", "Random Woman", "Skater Guy", "Young Woman Shopper", "Old Women Shopper", "Tourist", "Tourist", "Cuban", "Cuban", "Haitian", "Haitian", "Shark", "Shark", "Diaz Guy", "Diaz Guy", "Security Guard", "Security Guard", "Biker", "Biker", "Vercetti Guy", "Vercetti Guy", "Undercover Cop", "Undercover Cop", "Undercover Cop", "Undercover Cop ", "Undercover Cop", "Undercover Cop", "Random Guy", "Bodyguard", "Prostitute", "Prostitute", "Love Fist Guy", "Ken Rosenburg", "Candy Suxx", "Hilary", "Love Fist", "Phil", "Rockstar Guy", "Sonny", "Lance", "Mercades", "Love Fist", "Alex Scrub", "Lance Vance", "Lance Vance", "Cpt. Cortez", "Love Fist", "Columbian", "Hilary", "Mercades", "Cam", "Cam", "Phil", "Phil", "Bodyguard", "Pizza Worker", "Taxi Driver", "Taxi Driver", "Sailor", "Sailor", "Sailor", "Chef", "Criminal", "French Guy", "Worker", "Hatian", "Waitress", "Forelli Member", "Forelli Member", "Forelli Member", "Columbian", "Random Guy", "Beach Guy", "Random Guy", "Random Guy", "Random Guy", "Drag Queen", "Diaz Traitor", "Random Guy", "Random Guy", "Stripper", "Stripper", "Stripper", "Store Clerk"],
];

let gameAnnounceColours = [
	COLOUR_BLACK,					// Invalid
	COLOUR_SILVER,					// GTA III
	COLOUR_AQUA,					// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	//COLOUR_SILVER,				// GTA IV
	//COLOUR_SILVER					// GTA IV (EFLC)		
];
let gameAnnounceColour = gameAnnounceColours[game.game];