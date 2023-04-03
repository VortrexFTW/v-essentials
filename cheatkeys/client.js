"use strict";

function GetTargetPhysical() {
	let vehicle = localPlayer.vehicle;
	if (vehicle != null)
		return vehicle;
	return localPlayer;
}

function SpeedKey(physical, multiplier) {
	if (physical == null)
		physical = GetTargetPhysical();

	if (physical.isSyncer) {
		// set train speed
		if (physical.isType(ELEMENT_TRAIN))
			physical.speed *= multiplier;

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

function VehicleJump(physical) {
	if (physical == null)
		physical = GetTargetPhysical();

	if (physical.isSyncer) {
		//if (physical.isType(ELEMENT_TRAIN))
		//	physical.derailed = true;

		let mat = physical.matrix;

		let multiplier = 1.0;
		if (game.game == GAME_GTA_IV || game.game == GAME_GTA_IV_EFLC)
			multiplier = 20.0;
		let velocity = physical.velocity;
		velocity[0] += mat.getElement(1 * 4 + 0) * 0.3 * multiplier;
		velocity[1] += mat.getElement(1 * 4 + 1) * 0.3 * multiplier;
		velocity[2] += mat.getElement(1 * 4 + 2) * 0.3 * multiplier;
		velocity[2] += 0.7 * multiplier;
		physical.velocity = velocity;
	}
}

bindKey(SDLK_7, KEYSTATE_DOWN, (key) => {
	if (localPlayer != null)
		VehicleJump();
}, true);

addEventHandler("OnKeyDown", (event, keyCode, scanCode, mod) => {
	switch (keyCode) {
		case SDLK_F8:
			{
				let Peds = getPeds();
				for (let i = 0; i < Peds.length; i++)
					if (Peds[i] != localPlayer)
						destroyElement(Peds[i]);

				let Vehicles = getVehicles();
				for (let i = 0; i < Vehicles.length; i++)
					if (localPlayer == null || Vehicles[i] != localPlayer.vehicle)
						destroyElement(Vehicles[i]);
			}
			break;
		case SDLK_2:
			if (localPlayer != null)
				SpeedKey(null, 2);
			break;
		case SDLK_3:
			if (localPlayer != null)
				SpeedKey(null, 0);
			break;
		case SDLK_5:
			if (localPlayer != null)
				SpeedKey(null, -1);
			break;
		case SDLK_6:
			{
				if (localPlayer != null) {
					localPlayer.health = 100;
					let vehicle = localPlayer.vehicle;
					if (vehicle != null && vehicle.isSyncer) {
						if (vehicle.isType(ELEMENT_TRAIN)) {
							vehicle.speed = 0;
							vehicle.derailed = false;
						}
						vehicle.fix();
					}
				}
			}
			break;
	}
});
