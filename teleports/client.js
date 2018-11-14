"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("kenjiroof", function(cmdName, params) {
	let position = new Vec3(459.41, -1388.14, 68.39);
	teleportToPosition(position);	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("kenji", function(cmdName, params) {
	let position = new Vec3(459.34, -1415.93, 26.13);
	teleportToPosition(position);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("lcpd2", function(cmdName, params) {
	let position = new Vec3(340.52, -1120.88, 25.98);
	teleportToPosition(position);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("toilet", function(cmdName, params) {
	let position = new Vec3(39.71, -731.87, 22.72);
	teleportToPosition(position);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("parkcabin", function(cmdName, params) {
	let position = new Vec3(88.59, -591.06, 25.97);
	teleportToPosition(position);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("stadium", function(cmdName, params) {
	let position = new Vec3(-18.69, -222.58, 29.83);
	teleportToPosition(position);
	return true;
});

// ----------------------------------------------------------------------------

function teleportToPosition(position) {
	if(localPlayer.vehicle != null) {
		localPlayer.vehicle.position = position;
	} else {
		localPlayer.position = position;
	}
	return true;
}

// ----------------------------------------------------------------------------
 