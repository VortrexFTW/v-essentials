"use strict";

// ----------------------------------------------------------------------------

let isSwimming = false;
let lastSwimTick = false;

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(!localPlayer) {
		isSwimming = false;	
		return false;
	}
	
	let groundZ = findGroundZForCoord(localPlayer.position.x, localPlayer.position.y);
	if(groundZ == 20 || groundZ == false) {
		if(localPlayer.vehicle == null) {
			localPlayer.invincible = true;
			isSwimming = true;
			lastSwimTick = game.tickCount;
		} else {
			localPlayer.invincible = false;
			isSwimming = false;			
		}
	} else {
		if(isSwimming) {
			if((game.tickCount - lastSwimTick) > 2000) {
				localPlayer.invincible = false;
				isSwimming = false;
			}
		}
	}
	
	if(isSwimming) {
		setCameraLookAt(getPosBehindPos(new Vec3(localPlayer.position.x, localPlayer.position.y, localPlayer.position.z+2), localPlayer.heading, 5), localPlayer.position, true);
		let swimSpeed = 0.1;
		if(isKeyDown(SDLK_LSHIFT) || isKeyDown(SDLK_RSHIFT)) {
			swimSpeed = 0.2;
		}
		
		if(isKeyDown(SDLK_w)) {
			localPlayer.position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, swimSpeed);
		}
		
		if(isKeyDown(SDLK_d)) {
			localPlayer.heading = (localPlayer.heading <= Math.PI/2) ? localPlayer.heading + 0.01745329 : localPlayer.heading - 0.01745329;
		}

		if(isKeyDown(SDLK_a)) {
			localPlayer.heading = (localPlayer.heading >= Math.PI/2) ? localPlayer.heading - 0.01745329 : localPlayer.heading + 0.01745329;
		}
	} else {
		localPlayer.invincible = false; // Make sure they don't remain in god mode
		restoreCamera(true);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnKeyUp", function(event, keyCode, scanCode, mod) {
	if(isSwimming) {
		if(keyCode == SDLK_SPACE) {
			localPlayer.position = new Vec3(localPlayer.position.x, localPlayer.position.y, localPlayer.position.z+2);
		}
	}
});

// ----------------------------------------------------------------------------

function getPosInFrontOfPos(pos, angle, distance) {
	let x = (pos[0]+((Math.cos(angle+(Math.PI/2)))*distance));
	let y = (pos[1]+((Math.sin(angle+(Math.PI/2)))*distance));
	let z = pos[2];
	
	return new Vec3(x,y,z);
}

// ----------------------------------------------------------------------------

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ----------------------------------------------------------------------------

function getPosBehindPos(pos, angle, distance) {
	let x = (pos[0]+((Math.cos(angle-(Math.PI/2)))*distance));
	let y = (pos[1]+((Math.sin(angle-(Math.PI/2)))*distance));
	let z = pos[2];
	
	return new Vec3(x,y,z);
}

// ----------------------------------------------------------------------------