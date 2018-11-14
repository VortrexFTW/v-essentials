"use strict";

// ----------------------------------------------------------------------------

let aimObject = null;

let cameraAngle = 0.0;
let cameraHeight = 1.0;
let baseCameraHeight = 1.0;
let mouseLookDistance = 3.5;
let mouseVehicleLookDistance = 6.5;

// ----------------------------------------------------------------------------

let mouseAngleSensitivity = 0.3;
let mouseHeightSensitivity = 1;

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		cameraAngle = localPlayer.heading*Math.PI/2;
		message("[SERVER] [#FFFFFF]GTA San Andreas camera and movement enabled", COLOUR_ORANGE);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStop", function(event, resource) {
	if(resource == thisResource) {
		restoreCamera(false);
		message("[SERVER] [#FFFFFF]GTA San Andreas camera and movement disabled", COLOUR_ORANGE);
	}
});

// ----------------------------------------------------------------------------

function moveCamera(mouseSpeed) {
	if(mouseSpeed.x < 0) {
		if(cameraAngle > 0.0) {
			cameraHeight += degToRad(Math.abs(mouseSpeed.y)*mouseHeightSensitivity);
		}		
		cameraAngle += degToRad(Math.abs(mouseSpeed.x*mouseAngleSensitivity));
	}
	
	if(mouseSpeed.x > 0) {
		if(cameraAngle <= Math.PI) {
			cameraHeight += degToRad(Math.abs(mouseSpeed.y)*mouseHeightSensitivity);
		}
		cameraAngle -= degToRad(mouseSpeed.x*mouseAngleSensitivity);
	}
	
	if(mouseSpeed.y < 0) {	
		if(cameraHeight <= 5.0) {
			cameraHeight += degToRad(Math.abs(mouseSpeed.y)*mouseHeightSensitivity);
		}
		
		if(cameraHeight > 5.0) {
			cameraHeight = 5.0;
		}
	}
	
	if(mouseSpeed.y > 0) {
		if(cameraHeight >= 0) {
			cameraHeight -= degToRad(mouseSpeed.y*mouseHeightSensitivity);
		}
	}
	
	if(!localPlayer.vehicle) {
		let basePosition = localPlayer.position;
		basePosition.z += baseCameraHeight;
		let frontPos = getPosInFrontOfPos(localPlayer.position, cameraAngle, mouseLookDistance);
		let cameraPosition = new Vec3(frontPos.x, frontPos.y, localPlayer.position.z+cameraHeight);
		setCameraLookAt(cameraPosition, basePosition, true);
	} else {
		//let basePosition = localPlayer.vehicle.position;
		//basePosition.z += baseCameraHeight;
		//let frontPos = getPosInFrontOfPos(localPlayer.vehicle.position, cameraAngle, mouseVehicleLookDistance);
		//let cameraPosition = new Vec3(frontPos.x, frontPos.y, localPlayer.vehicle.position.z+cameraHeight);
		//setCameraLookAt(cameraPosition, basePosition, true);
		restoreCamera(true);
	}
}

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(!localPlayer) {
		return false;
	}
	
	let mouseSpeed = getMouseSpeed();
	
	if(!localPlayer.vehicle) {
		let position = localPlayer.position;
		if(isKeyDown(SDLK_w)) {
			let newAngle = Math.PI;
			if(isKeyDown(SDLK_a)) {
				newAngle = newAngle+Math.PI/4;
			} else {
				if(isKeyDown(SDLK_d)) {
					newAngle = newAngle-Math.PI/4;
				}
			}
			localPlayer.heading = cameraAngle + newAngle;
			localPlayer.heading += degToRad(-mouseSpeed.x*mouseAngleSensitivity);
			position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 1.0);
		} else if(isKeyDown(SDLK_s)) {
			let newAngle = Math.PI*2;
			if(isKeyDown(SDLK_a)) {
				newAngle = newAngle-Math.PI/4;
			} else {
				if(isKeyDown(SDLK_d)) {
					newAngle = newAngle+Math.PI/4;
				}
			}
			localPlayer.heading = cameraAngle + newAngle;
			localPlayer.heading += degToRad(-mouseSpeed.x*mouseAngleSensitivity);
			position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 1.0);			
		} else if(isKeyDown(SDLK_a)) {
			let newAngle = -Math.PI/2;
			localPlayer.heading = cameraAngle + newAngle;
			localPlayer.heading += degToRad(-mouseSpeed.x*mouseAngleSensitivity);
			position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 1.0);
		} else if(isKeyDown(SDLK_d)) {
			let newAngle = Math.PI/2;
			localPlayer.heading = cameraAngle + newAngle;
			localPlayer.heading += degToRad(-mouseSpeed.x*mouseAngleSensitivity);	
			position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 1.0)
		}
		
		if(isKeyDown(SDLK_LALT) || isKeyDown(SDLK_RALT)) {
			localPlayer.walkTo(vec3ToVec2(position));
		}
		moveCamera(mouseSpeed);
	} else {
		restoreCamera(true);
	}
	
});

addEventHandler("OnKeyDown", function(event, keyCode, scanCode, modifiers) {
	if(!localPlayer.vehicle) {
		if(keyCode == SDLK_LALT || keyCode == SDLK_RALT) {
			if(isKeyDown(SDLK_w) || isKeyDown(SDLK_a) || isKeyDown(SDLK_s) || isKeyDown(SDLK_d)) {
				triggerNetworkEvent("v.walk", true);
			}
		}
	}
});

addEventHandler("OnKeyUp", function(event, keyCode, scanCode, modifiers) {
	if(!localPlayer.vehicle) {
		if(keyCode == SDLK_LALT || keyCode == SDLK_RALT) {
			triggerNetworkEvent("v.walk", false);
		}
	}
});

// ----------------------------------------------------------------------------

function vec3ToVec2(pos) {
	return new Vec2(pos[0], pos[1]);
}

// ----------------------------------------------------------------------------

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------

function getPosInFrontOfPos(pos, angle, distance) {
	let x = (pos.x+((Math.cos(angle+(Math.PI/2)))*distance));
	let y = (pos.y+((Math.sin(angle+(Math.PI/2)))*distance));
	let z = pos.z;
	
	return new Vec3(x,y,z);
}

// ----------------------------------------------------------------------------

function fixAngle(angle) {
	if(angle < 0) {
		angle = Math.abs(angle);
		angle = (Math.PI-angle+1)+Math.PI;
	}
	return angle;
}

// ----------------------------------------------------------------------------

addNetworkHandler("v.walk", function(player, state) {
	if(player != localPlayer) {
		player.walkTo(vec3ToVec2(getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 1.0)));
	}
});

// ----------------------------------------------------------------------------

// AIMING TEST
/*addEventHandler("OnCursorDown", function(event, button) {
	if(button == 1) {
		let worldPosition = getWorldFromScreenPosition(new Vec3(game.width/2, game.height/2, 10.0));
		aimObject = createObject(1323, worldPosition);
		localPlayer.pointGunAt(aimObject);
	}
});

addEventHandler("OnCursorDown", function(event, button) {
	if(button == 1) {
		destroyElement(aimObject);
	}
});
*/