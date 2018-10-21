"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnKeyUp", function (event, keyCode, scanCode, mod) {
	switch(keyCode) {
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

// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------