`use strict`;

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.add`, function (client, modelID, position, heading) {
	let tempVehicle = gta.createVehicle(Number(modelID), position);
	tempVehicle.heading = heading;
	addToWorld(tempVehicle);

	setTimeout(function () {
		tempVehicle.setData(`sb.v.addedby`, client, false);
	}, 500);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.fix`, function (client, vehicles) {
	triggerNetworkEvent(`sb.v.fix`, null, vehicles);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.del`, function (client, vehicles) {
	vehicles.forEach(function (vehicle) {
		destroyElement(vehicle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.siren`, function (client, vehicleIds, sirenState) {
	triggerNetworkEvent(`sb.v.siren`, null, vehicleIds, sirenState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.engine`, function (client, vehicleIds, engineState) {
	triggerNetworkEvent(`sb.v.engine`, null, vehicleIds, engineState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.radio`, function (client, vehicleIds, radioStation) {
	triggerNetworkEvent(`sb.v.radio`, null, vehicleIds, radioStation);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.lights`, function (client, vehicleIds, lightState) {
	triggerNetworkEvent(`sb.v.lights`, null, vehicleIds, lightState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.light`, function (client, vehicleIds, lightID, lightState) {
	triggerNetworkEvent(`sb.v.light`, null, vehicleIds, lightID, lightState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.syncer`, function (client, vehicleIds, targetClient) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).setSyncer(targetClient.index, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.wheels`, function (client, vehicleIds, wheelState) {
	triggerNetworkEvent(`sb.v.wheels`, null, vehicleIds, wheelState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.upgrade.add`, function (client, vehicleIds, upgradeId) {
	console.log(vehicles);
	triggerNetworkEvent(`sb.v.upgrade.add`, null, vehicleIds, upgradeId);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.upgrade.del`, function (client, vehicleIds, upgradeId) {
	triggerNetworkEvent(`sb.v.upgrade.del`, null, vehicleIds, upgradeId);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.paintjob`, function (client, vehicleIds, paintjobId) {
	triggerNetworkEvent(`sb.v.paintjob`, null, vehicleIds, paintjobId);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.doors`, function (client, vehicleIds, doorState) {
	triggerNetworkEvent(`sb.v.doors`, null, vehicleIds, doorState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.mission`, function (client, vehicleIds, missionID) {
	triggerNetworkEvent(`sb.v.mission`, null, vehicleIds, missionID);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.handling`, function (client, vehicleIds, handlingIndex) {
	triggerNetworkEvent(`sb.v.handling`, null, vehicleIds, handlingIndex);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.door`, function (client, vehicleIds, doorID, doorState) {
	triggerNetworkEvent(`sb.v.door`, null, vehicleIds, doorID, doorState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.wheel`, function (client, vehicleIds, wheelID, wheelState) {
	triggerNetworkEvent(`sb.v.wheel`, null, vehicleIds, doorID, doorState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.alarm`, function (client, vehicleIds, alarmState) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).setData(`sb.v.alarm`, alarmState, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.horn`, function (client, vehicleIds, hornState) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).setData(`sb.v.horn`, hornState, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.health`, function (client, vehicleIds, health) {
	triggerNetworkEvent(`sb.v.health`, null, vehicleIds, health);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.colour1`, function (client, vehicleIds, colour1) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).colour1 = colour1;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.colour2`, function (client, vehicleIds, colour2) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).colour2 = colour2;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.colour3`, function (client, vehicleIds, colour3) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).colour3 = colour3;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.colour4`, function (client, vehicleIds, colour4) {
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).colour4 = colour4;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.colour`, function (client, vehicleIds, red, green, blue, alpha) {
	let colour = toColour(red, green, blue, alpha);
	vehicleIds.forEach(function (vehicleId) {
		getElementFromId(vehicleId).setRGBColours(colour, colour);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.coll`, function (client, vehicleIds, collisionState) {
	triggerNetworkEvent(`sb.v.coll`, null, vehicleIds, collisionState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.locked`, function (client, vehicleIds, lockState) {
	triggerNetworkEvent(`sb.v.locked`, null, vehicleIds, lockState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.god`, function (client, vehicleIds, godMode) {
	triggerNetworkEvent(`sb.v.god`, null, vehicleIds, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.cruisespeed`, function (client, vehicleIds, cruiseSpeed) {
	triggerNetworkEvent(`sb.v.cruisespeed`, null, vehicleIds, cruiseSpeed);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.petroltankhealth`, function (client, vehicleIds, patrolTankHealth) {
	triggerNetworkEvent(`sb.v.petroltankhealth`, null, vehicleIds, patrolTankHealth);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.enginehealth`, function (client, vehicleIds, engineHealth) {
	triggerNetworkEvent(`sb.v.enginehealth`, null, vehicleIds, engineHealth);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.enablegps`, function (client, vehicles) {
	triggerNetworkEvent(`sb.v.enablegps`, null, vehicles);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.opentrunk`, function (client, vehicles) {
	triggerNetworkEvent(`sb.v.opentrunk`, null, vehicles);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.scale`, function (client, vehicleIds, scale) {
	vehicleIds.forEach(function (vehicleId) {
		if (scale != 0) {
			getElementFromId(vehicleId).setData(`sb.v.scale`, scale, true);
		} else {
			getElementFromId(vehicleId).removeData(`sb.v.scale`);
		}
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.drivingstyle`, function (client, vehicleIds, drivingStyle) {
	triggerNetworkEvent(`sb.v.drivingstyle`, null, vehicleIds, drivingStyle);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.livery`, function (client, vehicleIds, livery) {
	triggerNetworkEvent(`sb.v.livery`, null, vehicleIds, livery);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.dirtlevel`, function (client, vehicleIds, dirtLevel) {
	triggerNetworkEvent(`sb.v.dirtlevel`, null, vehicleIds, dirtLevel);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.hazardlights`, function (client, vehicleIds, hazardLightState) {
	triggerNetworkEvent(`sb.v.hazardlights`, null, vehicleIds, hazardLightState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.indicatorlights`, function (client, vehicleIds, indicatorLightState) {
	triggerNetworkEvent(`sb.v.indicatorlights`, null, vehicleIds, indicatorLightState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.driveto`, function (client, vehicleIds, x, y, z) {
	triggerNetworkEvent(`sb.v.driveto`, null, vehicleIds, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.position`, function (client, vehicleIds, x, y, z) {
	vehicleIds.forEach(function (vehicleId) {
		triggerNetworkEvent(`sb.v.position`, getVehicleFromId(vehicleId).syncer, vehicleId, x, y, z);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.heading`, function (client, vehicleIds, heading) {
	vehicleIds.forEach(function (vehicleId) {
		triggerNetworkEvent(`sb.v.heading`, getVehicleFromId(vehicleId).syncer, vehicleId, heading);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.v.wander`, function (client, vehicles) {
	triggerNetworkEvent(`sb.v.wander`, null, vehicles);
});

// ----------------------------------------------------------------------------