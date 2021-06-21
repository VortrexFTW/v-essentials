"use strict";

// ----------------------------------------------------------------------------

let spawnScreenPedPosition = new Vec3(0.0, 0.0, 0.0);
let spawnScreenPedHeading = 0.0;
let spawnScreenCamPosition = new Vec3(0.0, 0.0, 0.0);
let spawnScreenCamLookAtPosition = new Vec3(0.0, 0.0, 0.0);

// ----------------------------------------------------------------------------

if(gta.game == GAME_GTA_III) {
	spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
	spawnScreenPedHeading = 15.0;
	spawnScreenCamPosition = new Vec3(138.17, -909.90, 28.16);
	spawnScreenCamLookAtPosition = new Vec3(139.54, -903.00, 26.16);
} else if(gta.game == GAME_GTA_VC) {
	spawnScreenPedPosition = new Vec3(-379.16, -535.27, 17.28);
	spawnScreenPedHeading = 0.0;
	spawnScreenCamPosition = new Vec3(-378.66, -524.57, 18.02);
	spawnScreenCamLookAtPosition = new Vec3(-379.16, -535.27, 17.28);
} else if(gta.game == GAME_GTA_SA) {
	spawnScreenPedPosition = new Vec3(2495.03, -1685.66, 13.51);
	spawnScreenPedHeading = 0.01;
	spawnScreenCamPosition = new Vec3(2494.54, -1677.83, 15.33);
	spawnScreenCamLookAtPosition = spawnScreenPedPosition;
} else if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	spawnScreenPedPosition = new Vec3(904.27, -498.00, 14.522);
	spawnScreenPedHeading = 3.127;
	spawnScreenCamPosition = new Vec3(908.48, -501.24, 15.146);
	spawnScreenCamLookAtPosition = spawnScreenPedPosition;
}

// ----------------------------------------------------------------------------

let inSpawnScreen = false;

let skinSelectFont = null;
let skinSelectExplainFont = null;
let lastKeyPressTick = 0;
let keyPressDelay = 75;
let spawnScreenTextEnabled = true;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
	let fontStream = openFile("pricedown.ttf");
	if(fontStream != null) {
		skinSelectFont = lucasFont.createFont(fontStream, 28.0);
		fontStream.close();
	}

	skinSelectExplainFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");

	if(gta.game == GAME_GTA_IV) {
		localPlayer.setData("v.ss.ivskinindex", 0);
	}

	setTimeout(showSkinSelect, 500);
});

// ----------------------------------------------------------------------------

addEventHandler("OnKeyUp", function (event, keyCode, scanCode, mod) {
	switch(keyCode) {
		case SDLK_F1:
			if(isConnected) {
				if(!inSpawnScreen) {
					triggerNetworkEvent("v.respawn");
				}
			}
			break;

		case SDLK_RIGHT:
			if(inSpawnScreen) {
				if(sdl.ticks-lastKeyPressTick >= keyPressDelay) {
					if(gta.game == GAME_GTA_III) {
						if(localPlayer.skin >= 122) {
							localPlayer.skin = 0;
						} else {
							if(localPlayer.skin == 25) {
								localPlayer.skin = 30;
							} else {
								localPlayer.skin++;
							}
						}
					} else if(gta.game == GAME_GTA_VC) {
						if(localPlayer.skin >= 100) {
							localPlayer.skin = 0;
						} else {
							if(localPlayer.skin == 7) {
								localPlayer.skin = 9;
							} else if(localPlayer.skin == 139) {
								localPlayer.skin = 142;
							} else {
								localPlayer.skin++;
							}
						}
					} else if(gta.game == GAME_GTA_SA) {
						if(localPlayer.skin >= 288) {
							localPlayer.skin = 0;
						} else {
							localPlayer.skin++;
						}
					} else if(gta.game == GAME_GTA_IV) {
						if(localPlayer.getData("v.ss.ivskinindex") >= gtaivSkinModels.length) {
							localPlayer.setData("v.ss.ivskinindex", 0);
							triggerNetworkEvent("v.ss.ivskinsel", gtaivSkinModels[localPlayer.getData("v.ss.ivskinindex")][1]);
						} else {
							localPlayer.setData("v.ss.ivskinindex", localPlayer.getData("v.ss.ivskinindex")+1);
							triggerNetworkEvent("v.ss.ivskinsel", gtaivSkinModels[localPlayer.getData("v.ss.ivskinindex")][1]);
						}
					}

					localPlayer.heading = spawnScreenPedHeading;
					lastKeyPressTick = sdl.ticks;
				}
			}
			break;

		case SDLK_LEFT:
			if(inSpawnScreen) {
				if(sdl.ticks-lastKeyPressTick >= keyPressDelay) {
					if(gta.game == GAME_GTA_III) {
						if(localPlayer.skin <= 0) {
							localPlayer.skin = 122;
						} else {
							if(localPlayer.skin == 30) {
								localPlayer.skin = 25;
							} else {
								localPlayer.skin--;
							}
						}
					} else if(gta.game == GAME_GTA_VC) {
						if(localPlayer.skin <= 0) {
							localPlayer.skin = 100;
						} else {
							if(localPlayer.skin == 9) {
								localPlayer.skin = 7;
							} else if(localPlayer.skin == 142) {
								localPlayer.skin = 139;
							} else {
								localPlayer.skin--;
							}
						}
					} else if(gta.game == GAME_GTA_SA) {
						if(localPlayer.skin <= 0) {
							localPlayer.skin = 313;
						} else if(localPlayer.skin == 9) {
							localPlayer.skin = 2;
						} else if(localPlayer.skin == 43) {
							localPlayer.skin = 41;
						} else if(localPlayer.skin == 66) {
							localPlayer.skin = 64;
						} else if(localPlayer.skin == 75) {
							localPlayer.skin = 73;
						} else if(localPlayer.skin == 87) {
							localPlayer.skin = 85;
						} else if(localPlayer.skin == 120) {
							localPlayer.skin = 118;
						} else if(localPlayer.skin == 150) {
							localPlayer.skin = 148;
						} else if(localPlayer.skin == 207) {
							localPlayer.skin = 209;
						} else {
							localPlayer.skin--;
						}
					} else if(gta.game == GAME_GTA_IV) {
						if(localPlayer.getData("v.ss.ivskinindex") <= 0) {
							localPlayer.setData("v.ss.ivskinindex", 0);
							triggerNetworkEvent("v.ss.ivskinsel", gtaivSkinModels[localPlayer.getData("v.ss.ivskinindex")][1]);
						} else {
							localPlayer.setData("v.ss.ivskinindex", localPlayer.getData("v.ss.ivskinindex")-1);
							triggerNetworkEvent("v.ss.ivskinsel", gtaivSkinModels[localPlayer.getData("v.ss.ivskinindex")][1]);
						}
					}
					localPlayer.heading = spawnScreenPedHeading;
					lastKeyPressTick = sdl.ticks;
				}
			}
			break;

		case SDLK_RETURN:
		case SDLK_LCTRL:
			if(inSpawnScreen) {
				if(sdl.ticks-lastKeyPressTick >= keyPressDelay) {
					inSpawnScreen = false;
					triggerNetworkEvent("v.ss.sel", localPlayer.skin);
					setHUDEnabled(true);
					//let skinName = getSkinName(localPlayer.skin);
					//if(skinName != false) {
					//	message("You spawned as " + skinName, gameAnnounceColour);
					//}
					lastKeyPressTick = sdl.ticks;
					gta.setPlayerControl(true);
					gui.showCursor(false, true);
				}
			}
			break;
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedWasted", function(event, ped) {
	if(ped == localPlayer) {
		setTimeout(showSkinSelect, 500);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.spawn", function(position, heading, skin) {
	spawnPlayer(position, heading, skin);
});

// ----------------------------------------------------------------------------

function showSkinSelect() {
	if(gta.game < GAME_GTA_IV) {
		localPlayer.collisionsEnabled = false;
		localPlayer.stayInSamePlace = true;
		localPlayer.skin = 0;
	}

	gta.setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
	setHUDEnabled(false);
	inSpawnScreen = true;
	gta.fadeCamera(true);
	gta.setPlayerControl(false);
	gui.showCursor(true, false);
	return true;
}

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
	if(spawnScreenTextEnabled) {
		if(inSpawnScreen) {
			if(skinSelectFont != null && skinSelectExplainFont != null) {
				// Skin Name
				let text = getSkinName(localPlayer.skin);
				let size = false;

				if(text != false) {
					size = skinSelectFont.measure(text, 200, 0.0, 1.0, 28, false, false);
					skinSelectFont.render(text, [96, game.height-128], 300, 0.0, 0.0, skinSelectFont.size, COLOUR_WHITE, false, false, false, true);
				}

				// Help text
				text = "Use LEFT/RIGHT to select a skin, and ENTER to spawn."
				size = skinSelectExplainFont.measure(text, 200, 0.0, 1.0, 12, false, false);
				skinSelectExplainFont.render(text, [96, game.height-78], 300, 0.0, 0.0, skinSelectExplainFont.size, COLOUR_WHITE, false, false, false, true);
			}
		}
	}
});

// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------

let gtaivSkinModels = [
	//["Nico Bellic", 1862763509],
	["Male Multiplayer", -2020305438],
	["Female Multiplayer", -641875910],
	["MODEL_SUPERLOD", -1370810922],
	["Anna", 1853617247],
	["Anthony", -1646893330],
	["Badman", 1495769888],
	["Bernie Crane", 1500493064],
	["Bledar", 1731510984],
	["Brian", 422305098],
	["Brucie", -1729980128],
	["Bulgarin", 237511807],
	["Charise", 88667657],
	["Charlie Undercover", -1328445565],
	["Clarence", 1343144208],
	["Dardan", 1468450703],
	["Darko", 386513184],
	["Derric", 1169442297],
	["Dmitri", 237497537],
	["Dwayne", -617264103],
	["Eddie", -1600585231],
	["Faustin", 57218969],
	["Francis", 1710545037],
	["French Tom", 1424670436],
	["Gordon", 2129490787],
	["Gracie", -357652594],
	["Hossan", 980768434],
	["Ilyena", -835225126],
	["Issac", -479595866],
	["Ivan", 1166762483],
	["Jay", 364686627],
	["Jason", 170756246],
	["Jeff", 390357829],
	["Jimmy", -366421228],
	["Johnny Klebitz", -911507684],
	["Kate", -773750838],
	["Kenny", 995576506],
	["Lil Jacob", 1487004273],
	["Lil Jacob 2", -1275031987],
	["Luca", -681942840],
	["Luis", -492470690],
	["Mallorie", -1040287406],
	["Mam", -322700377],
	["Manny", 1445589009],
	["Marnie", 411185872],
	["Mel", -807339118],
	["Michael", 735211577],
	["Michelle", -1080659212],
	["Mickey", -636669566],
	["Packie", 1690783035],
	["Pathos", -165448092],
	["Petrovic", -1947682830],
	["Phil Bell", -1826458934],
	["Playboy X", 1794146792],
	["Ray Boccino", 954215094],
	["Ricky", -587324132],
	["Roman", -1992728631],
	["Roman 2", 558221221],
	["Sarah", -17823883],
	["Tuna", 1384833284],
	["Vinny Spaz", -1014976873],
	["Vlad", 896408642],
	["MODEL_M_Y_GAFR_LO_01", -301223260],
	["MODEL_M_Y_GAFR_LO_02", -1143910864],
	["MODEL_M_Y_GAFR_HI_01", 869501081],
	["MODEL_M_Y_GAFR_HI_02", 632613980],
	["MODEL_M_Y_GALB_LO_01", -503930010],
	["MODEL_M_Y_GALB_LO_02", -235584669],
	["MODEL_M_Y_GALB_LO_03", 207714363],
	["MODEL_M_Y_GALB_LO_04", 514268366],
	["MODEL_M_M_GBIK_LO_03", 43005364],
	["MODEL_M_Y_GBIK_HI_01", 1346668127],
	["MODEL_M_Y_GBIK_HI_02", -1677255197],
	["MODEL_M_Y_GBIK02_LO_02", -1461281345],
	["MODEL_M_Y_GBIK_LO_01", 1574850459],
	["MODEL_M_Y_GBIK_LO_02", -1953289472],
	["MODEL_M_Y_GIRI_LO_01", 280474699],
	["MODEL_M_Y_GIRI_LO_02", -19263344],
	["MODEL_M_Y_GIRI_LO_03", 1844702918],
	["MODEL_M_M_GJAM_HI_01", 1609755055],
	["MODEL_M_M_GJAM_HI_02", -330497431],
	["MODEL_M_M_GJAM_HI_03", 1117105909],
	["MODEL_M_Y_GJAM_LO_01", -1500397869],
	["MODEL_M_Y_GJAM_LO_02", -881358690],
	["MODEL_M_Y_GKOR_LO_01", 1540383669],
	["MODEL_M_Y_GKOR_LO_02", 764249904],
	["MODEL_M_Y_GLAT_LO_01", 492147228],
	["MODEL_M_Y_GLAT_LO_02", -1926041127],
	["MODEL_M_Y_GLAT_HI_01", 1168388225],
	["MODEL_M_Y_GLAT_HI_02", -1746774780],
	["MODEL_M_Y_GMAF_HI_01", -302362397],
	["MODEL_M_Y_GMAF_HI_02", -1616890832],
	["MODEL_M_Y_GMAF_LO_01", 64730935],
	["MODEL_M_Y_GMAF_LO_02", 510389335],
	["MODEL_M_O_GRUS_HI_01", -1836006237],
	["MODEL_M_Y_GRUS_LO_01", -2088164056],
	["MODEL_M_Y_GRUS_LO_02", 1976502708],
	["MODEL_M_Y_GRUS_HI_02", 1543404628],
	["MODEL_M_M_GRU2_HI_01", 1865532596],
	["MODEL_M_M_GRU2_HI_02", 431692232],
	["MODEL_M_M_GRU2_LO_02", 1724587620],
	["MODEL_M_Y_GRU2_LO_01", -1180674815],
	["MODEL_M_M_GTRI_HI_01", 871281791],
	["MODEL_M_M_GTRI_HI_02", 683712035],
	["MODEL_M_Y_GTRI_LO_01", -1084007777],
	["MODEL_M_Y_GTRI_LO_02", -164935626],
	["Female Maid", -751071255],
	["Female Binco Worker", -109247258],
	["Female Bank Teller", 1366257926],
	["Female Doctor", 346338575],
	["Female Gym Worker", 1350216795],
	["Female Burger Shot Worker", 924926104],
	["Female Cluckin Bell Worker", -346378101],
	["Female Rockstar Cafe Worker", -2104311883],
	["Female TW@ Cafe Worker", 212900845],
	["Female Well Stacked Pizza Worker", -290070895],
	["Hooker", 552542187],
	["Hooker 2", 996267216],
	["Nurse", -1193778389],
	["Stripper 1", 1113677074],
	["Stripper 2", 1353709999],
	["Waitress", 24233425],
	["Alcoholic Man", -1761003415],
	["Armoured Truck Driver", 1075583233],
	["Bus Driver", 134077503],
	["Generic Asian Man", 757349871],
	["Black Crackhead", -1827421800],
	["Doctor (Scrubs)", 219393781],
	["Doctor", -1186940778],
	["Doctor (Blood Covered Coat)", 375732086],
	["Cook", 2105015949],
	["Italian Mob Enforcer", -200234085],
	["Factory Worker", 800131009],
	["FIB Agent", -999506922],
	["Fat Delivery Driver", -1993909080],
	["Fire Chief", 610888851],
	["Mercenary Soldier", 486302863],
	["Helicopter Pilot", -778316080],
	["Hotel Doorman", 624314380],
	["Korean Cook", -1784833142],
	["Lawyer 1", -1852976689],
	["Lawyer 2", -1134712978],
	["Loony Black Man", 379171768],
	["Pilot", -1945168882],
	["Generic Man", 807236245],
	["Postal Worker", -284362863],
	["Saxophone Player", -1188246269],
	["Security Guard", -1870989171],
	["Stadium Food Vendor", 420915580],
	["Stadium Food Cook", 1878085135],
	["Street Food Vendor", 142730876],
	["Street Sweeper Driver", -690681764],
	["Taxi Driver", 8772846],
	["Telephone Company Worker", 1186270890],
	["Tennis Player", -379234846],
	["Train Conductor", 1159759556],
	["Homeless Black Man", -142386662],
	["Trucker", -46564867],
	["Janitor", -1284047560],
	["Hotel Doorman 2", 22944263],
	["Mob Boss", 1178487645],
	["Airport Worker", -1464712858],
	["Bartender", -2139064254],
	["Biker Bouncer", -1780698891],
	["High End Club Bouncer", -409283472],
	["Bowling Alley Worker", -799229885],
	["Bowling Alley Worker 2", -434183225],
	["Chinese Food Vendor", 768442188],
	["Club Security", 676448572],
	["Construction Worker", -722019798],
	["Construction Worker 2", -1015957728],
	["Construction Worker 3", -714220780],
	["Police Officer", -183203150],
	["Traffic Officer", -1518937979],
	["Fat Police Officer", -370395528],
	["Courier", -1371133859],
	["Cowboy 1", -573788283],
	["Drug Dealer 1", -1283406538],
	["Drug Dealer 2", 1448755353],
	["Male Burger Shot Worker", 989485],
	["Male Cluckin Bell Worker", -1011530423],
	["Male Rockstar Cafe Worker", 1979561477],
	["Male TW@ Cafe Worker", -786449781],
	["Male Well Stacked Pizza Worker", 206941425],
	["Firefighter", -610224615],
	["Garbage Collector", 1136499716],
	["Goon", 897868981],
	["Male Gym Worker", -1902758612],
	["Mechanic 2", -356904519],
	["Male Modo Worker", -1056268969],
	["Helicopter Pilot", 1201610759],
	["Perseus", -151000142],
	["Generic Male 1", 501136335],
	["Generic Male 2", 186619473],
	["Generic Male 3", -111611196],
	["Paramedic", -1175077216],
	["Prisoner", -1676937780],
	["Prisoner 2", 215190023],
	["Roman's Taxi Service Driver", 1552970117],
	["Male Runner", -1481923910],
	["Male Shop Assistant 1", 357919731],
	["State Trooper", -89302119],
	["SWAT", -1004762946],
	["Sword Swallower", -64233032],
	["Thief", -1292254815],
	["Valet", 271284208],
	["Vendor", -186113957],
	["French Tom", -2015686009],
	["Jim Fitz", 1977784957],
	["East European Woman", -203833294],
	["East European Woman 2", 189853472],
	["Woman", -349043578],
	["Jersey Woman", -114937692],
	["Oriental Woman", -1697333660],
	["Rich Woman", 100706569],
	["Business Woman 1", 155063868],
	["Business Woman 2", 394310337],
	["Chinatown Woman", 1375728805],
	["Business Woman 3", -284229525],
	["East European Woman 3", 677687516],
	["Fat Black Woman", -1188238883],
	["Jersey Woman 1", -2075220936],
	["Jersey Woman 2", -1356924456],
	["Fat Hispanic Woman 1", 812112483],
	["Fat Hispanic Woman 2", -129242580],
	["White Manhattan Woman", 852423121],
	["Black Manhattan Woman", 76551508],
	["Old Asian Woman", -2118501976],
	["Old Rich Woman", 1616769823],
	["Business Woman 4", 453889158],
	["Asian Woman in Dress", 824245375],
	["Fat Black Bronx Woman", -1362442041],
	["Random White Woman", -1788328884],
	["Random Hispanic Woman", -1523915823],
	["Random Eastern European Woman", -949987237],
	["Random Black Woman", -1926577323],
	["Black Harlem Woman 1", 168065679],
	["MODEL_F_Y_PJERSEY_02", 441464],
	["MODEL_F_Y_PLATIN_01", 54114008],
	["MODEL_F_Y_PLATIN_02", -292713088],
	["MODEL_F_Y_PLATIN_03", 1743814728],
	["MODEL_F_Y_PMANHAT_01", 1670568326],
	["MODEL_F_Y_PMANHAT_02", 1354281938],
	["MODEL_F_Y_PMANHAT_03", 1056837725],
	["MODEL_F_Y_PORIENT_01", -1193633577],
	["Random Black Woman 2", 713691120],
	["Rich White Woman 1", -1780385799],
	["Random Asian Woman", -952185135],
	["Random Female Shopper 1", 1586287288],
	["Random Female Shopper 2", 1848013291],
	["Random Female Shopper 3", -1702036227],
	["Random Female Socialite 1", 1182843182],
	["Random Street Woman 1", -900623157],
	["Random Street Woman 2", 286007875],
	["Random Street Woman 3", 1473654742],
	["Random Street Woman 4", -1850743775],
	["Random Street Woman 5", 1290755317],
	["Random Street Woman 6", 1872110126],
	["MODEL_F_Y_TOURIST_01", 1754440500],
	["MODEL_F_Y_VILLBO_01", 761763258],
	["MODEL_M_M_BUSINESS_02", -636579119],
	["MODEL_M_M_BUSINESS_03", -1754526315],
	["MODEL_M_M_EE_HEAVY_01", -1516474414],
	["MODEL_M_M_EE_HEAVY_02", -1821258883],
	["MODEL_M_M_FATMOB_01", 1952671026],
	["MODEL_M_M_GAYMID", -1991603022],
	["MODEL_M_M_GENBUM_01", -1080673049],
	["MODEL_M_M_LOONYWHITE", 495499562],
	["MODEL_M_M_MIDTOWN_01", -1984134881],
	["MODEL_M_M_PBUSINESS_01", 1063816580],
	["MODEL_M_M_PEASTEURO_01", 208763854],
	["MODEL_M_M_PHARBRON_01", -1020237172],
	["MODEL_M_M_PINDUS_02", 1782277836],
	["MODEL_M_M_PITALIAN_01", -1402442039],
	["MODEL_M_M_PITALIAN_02", -1628417063],
	["MODEL_M_M_PLATIN_01", 1158569407],
	["MODEL_M_M_PLATIN_02", 1969438324],
	["MODEL_M_M_PLATIN_03", 1621955848],
	["MODEL_M_M_PMANHAT_01", -657489059],
	["MODEL_M_M_PMANHAT_02", -1307068958],
	["MODEL_M_M_PORIENT_01", 734334931],
	["MODEL_M_M_PRICH_01", 1865082075],
	["MODEL_M_O_EASTEURO_01", -432593815],
	["MODEL_M_O_HASID_01", -1639359785],
	["MODEL_M_O_MOBSTER", 1656087115],
	["MODEL_M_O_PEASTEURO_02", 2034185905],
	["MODEL_M_O_PHARBRON_01", 1316404726],
	["MODEL_M_O_PJERSEY_01", 980990533],
	["MODEL_M_O_STREET_01", -1298691925],
	["MODEL_M_O_SUITED", 243672348],
	["MODEL_M_Y_BOHO_01", 2085884255],
	["MODEL_M_Y_BOHOGUY_01", 221246143],
	["MODEL_M_Y_BRONX_01", 52357603],
	["MODEL_M_Y_BUSINESS_01", 1530937394],
	["MODEL_M_Y_BUSINESS_02", 690281432],
	["MODEL_M_Y_CHINATOWN_03", -1149743642],
	["MODEL_M_Y_CHOPSHOP_01", -314369597],
	["MODEL_M_Y_CHOPSHOP_02", -552829610],
	["MODEL_M_Y_DODGY_01", -1097188138],
	["MODEL_M_Y_DORK_02", -1775659292],
	["MODEL_M_Y_DOWNTOWN_01", 1207402441],
	["MODEL_M_Y_DOWNTOWN_02", 1500619449],
	["MODEL_M_Y_DOWNTOWN_03", 594261682],
	["MODEL_M_Y_GAYYOUNG", -747824291],
	["MODEL_M_Y_GENSTREET_11", -677160979],
	["MODEL_M_Y_GENSTREET_16", -1678614360],
	["MODEL_M_Y_GENSTREET_20", 989044076],
	["MODEL_M_Y_GENSTREET_34", 1180218190],
	["MODEL_M_Y_HARDMAN_01", -1420592428],
	["MODEL_M_Y_HARLEM_01", -1222963415],
	["MODEL_M_Y_HARLEM_02", -1746153269],
	["MODEL_M_Y_HARLEM_04", 2104499156],
	["MODEL_M_Y_HASID_01", -1874580889],
	["MODEL_M_Y_LEASTSIDE_01", -1055386282],
	["MODEL_M_Y_PBRONX_01", 575808580],
	["MODEL_M_Y_PCOOL_01", -71980543],
	["MODEL_M_Y_PCOOL_02", -195159218],
	["MODEL_M_Y_PEASTEURO_01", 697247370],
	["MODEL_M_Y_PHARBRON_01", 670406267],
	["MODEL_M_Y_PHARLEM_01", 26615298],
	["MODEL_M_Y_PJERSEY_01", 1542927558],
	["MODEL_M_Y_PLATIN_01", -1806886352],
	["MODEL_M_Y_PLATIN_02", -1022920796],
	["MODEL_M_Y_PLATIN_03", -1326394505],
	["MODEL_M_Y_PMANHAT_01", 607901190],
	["MODEL_M_Y_PMANHAT_02", 1968470106],
	["MODEL_M_Y_PORIENT_01", -344136289],
	["MODEL_M_Y_PQUEENS_01", 560413584],
	["MODEL_M_Y_PRICH_01", 1352017873],
	["MODEL_M_Y_PVILLBO_01", 223726252],
	["MODEL_M_Y_PVILLBO_02", -1252681043],
	["MODEL_M_Y_PVILLBO_03", -1562020391],
	["MODEL_M_Y_QUEENSBRIDGE", 1223224881],
	["MODEL_M_Y_SHADY_02", -1220737489],
	["MODEL_M_Y_SKATEBIKE_01", 1755322862],
	["MODEL_M_Y_SOHO_01", 386690478],
	["MODEL_M_Y_STREET_01", 62496225],
	["MODEL_M_Y_STREET_03", 523785438],
	["MODEL_M_Y_STREET_04", 813889395],
	["MODEL_M_Y_STREETBLK_02", -1552214124],
	["MODEL_M_Y_STREETBLK_03", -650575089],
	["Street Punk 1", -740078918],
	["Street Punk 2", -1927496394],
	["Street Punk 3", 1374242512],
	["Tough Guy", -1139941790],
	["Male Tourist", 809067472],
];

// ----------------------------------------------------------------------------

function getSkinName(skinId) {
	let sandboxResource = findResourceByName("sandbox");
	if(sandboxResource && sandboxResource.isStarted) {
		return sandboxResource.exports.getSkinName(skinId);
	}
	return false;
}

// ----------------------------------------------------------------------------