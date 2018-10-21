"use strict";

// ----------------------------------------------------------------------------

let spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
let spawnScreenPedHeading = 15.0;
let spawnScreenCamPosition = new Vec3(138.17, -909.90, 28.16);
let spawnScreenCamLookAtPosition = new Vec3(139.54, -903.00, 26.16);

let inSpawnScreen = false;

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

		case SDLK_LCTRL:
			if(inSpawnScreen) {
				event.preventDefault();
				triggerNetworkEvent("v.ss.sel", localPlayer.skin);
				inSpawnScreen = false;
				setHUDEnabled(true);
			}
			break;		
	}
});

// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------

function getTargetPhysical() {
	let vehicle = localPlayer.vehicle;
	if(vehicle != null) {
		return vehicle;
	}
	return localPlayer;
}

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		showSkinSelect();
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.ss.start", function() {
	inSpawnScreen = true;
	setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped == localPlayer) {
		if(inSpawnScreen) {
			setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
			showSkinSelect();
		}
	}
});

// ----------------------------------------------------------------------------

function showSkinSelect() {
	localPlayer.position = spawnScreenPedPosition;
	localPlayer.heading = spawnScreenPedHeading;			
	localPlayer.collisionsEnabled = false;
	localPlayer.stayInSamePlace = false;
	setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
	setHUDEnabled(false);
	inSpawnScreen = true;
}

// ----------------------------------------------------------------------------