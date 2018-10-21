"use strict";

// ----------------------------------------------------------------------------

let spawnScreenPedPosition = new Vec3(139.54, -903.00, 26.16);
let spawnScreenPedHeading = 15.0;
let spawnScreenCamPosition = new Vec3(138.17, -909.90, 28.16);
let spawnScreenCamLookAtPosition = new Vec3(139.54, -903.00, 26.16);

let inSpawnScreen = false;
let spawnCivilian = false;

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
			
		case SDLK_2:
			if(localPlayer != null) {
				speedKey(null, 2);
			}
			break;
			
		case SDLK_3:
			if(localPlayer != null) {
				speedKey(null, 0);
			}
			break;
			
		case SDLK_5:
			if(localPlayer != null) {
				speedKey(null, -1);
			}
			break;		
			
		case SDLK_6:
			if(localPlayer != null) {
				localPlayer.health = 100;
				let vehicle = localPlayer.vehicle;
				if(vehicle != null && vehicle.isSyncer) {
					if(vehicle.isType(ELEMENT_TRAIN)) {
						vehicle.speed = 0;
						vehicle.derailed = false;
					}
					vehicle.fix();
				}
			}
			break;
		case SDLK_7:
			if(localPlayer != null) {
				vehicleJump();
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

function getTargetPhysical() {
	let vehicle = localPlayer.vehicle;
	if(vehicle != null) {
		return vehicle;
	}
	return localPlayer;
}

function speedKey(physical, multiplier) {
	if(physical == null) {
		physical = getTargetPhysical();
	}

	if(physical.isSyncer) {
		// set train speed
		if(physical.isType(ELEMENT_TRAIN)) {
			physical.speed *= multiplier;
		}

		let velocity = physical.velocity;
		velocity[0] *= multiplier;
		velocity[1] *= multiplier;
		velocity[2] *= multiplier;
		physical.velocity = velocity;

		let turnVelocity = physical.turnVelocity;
		turnVelocity[0] *= multiplier;
		turnVelocity[1] *= multiplier;
		turnVelocity[2] *= multiplier;
		physical.turnVelocity = turnVelocity;
	}
}

function vehicleJump(physical) {
	if(physical == null) {
		physical = getTargetPhysical();
	}

	if(physical.isSyncer){
		if(physical.isType(ELEMENT_TRAIN)) {
			physical.derailed = true;
		}

		let mat = physical.matrix;

		let velocity = physical.velocity;
		velocity[0] += mat.getElement(1*4+0)*0.3;
		velocity[1] += mat.getElement(1*4+1)*0.3;
		velocity[2] += mat.getElement(1*4+2)*0.3;
		velocity[2] += 0.25;
		physical.velocity = velocity;
	}
}

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		showSkinSelect();
	}
});

addNetworkHandler("v.ss.start", function() {
	inSpawnScreen = true;
	setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
});

addEventHandler("OnPedSpawn", function(event, ped) {
	if(ped == localPlayer) {
		if(inSpawnScreen) {
			setCameraLookAt(spawnScreenCamPosition, spawnScreenCamLookAtPosition, true);
			showSkinSelect();
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