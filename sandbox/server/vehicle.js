"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	//let vehicles = getElementsByType(ELEMENT_VEHICLE);
	//for(let i in vehicles) {
	//	if(vehicles[i].getData("sb") == null) {
	//		//createDefaultVehicleData(vehicles[i]);
	//	}
	//}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.add", function(client, modelID, x, y, z, heading) {
	let position = new Vec3(x, y, z);
	let tempVehicle = createVehicle(Number(modelID), position);
	tempVehicle.heading = heading;
	addToWorld(tempVehicle);
	
	//let modelName = getVehicleNameFromModelId(tempVehicle.modelIndex);
	//message(client.name + " spawned " + String((doesWordStartWithVowel(modelName)) ? "an" : "a") + " " + modelName, gameAnnounceColours[serverGame]);
	
	setTimeout(function() {
		tempVehicle.setData("sb.v.addedby", client, false);
	}, 500);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.fix", function(client, vehicles) {
	triggerNetworkEvent("sb.v.fix", null, vehicles);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.del", function(client, vehicles) {
	vehicles.forEach(function(vehicle) {
		destroyElement(vehicle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.siren", function(client, vehicles, sirenState) {
	triggerNetworkEvent("sb.v.siren", null, vehicles, sirenState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.engine", function(client, vehicles, engineState) {
	triggerNetworkEvent("sb.v.engine", null, vehicles, engineState);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.radio", function(client, vehicles, radioStation) {
	triggerNetworkEvent("sb.v.radio", null, vehicles, radioStation);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.lights", function(client, vehicles, lightState) {
	triggerNetworkEvent("sb.v.lights", null, vehicles, lightState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.light", function(client, vehicles, lightID, lightState) {
	triggerNetworkEvent("sb.v.light", null, vehicles, lightID, lightState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.syncer", function(client, vehicles, targetClient) {
	vehicles.forEach(function(vehicle) {
		vehicle.syncer = targetClient.index;
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheels", function(client, vehicles, wheelState) {
	triggerNetworkEvent("sb.v.wheels", null, vehicles, wheelState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.add", function(client, vehicles, upgradeId) {
	triggerNetworkEvent("sb.v.upgrade.add", null, vehicles, upgradeId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.del", function(client, vehicles, upgradeId) {
	triggerNetworkEvent("sb.v.upgrade.del", null, vehicles, upgradeId);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.paintjob", function(client, vehicles, paintjobId) {
	triggerNetworkEvent("sb.v.paintjob", null, vehicles, paintjobId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.doors", function(client, vehicles, doorState) {
	triggerNetworkEvent("sb.v.doors", null, vehicles, doorState);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.mission", function(client, vehicles, missionID) {
	triggerNetworkEvent("sb.v.mission", null, vehicles, missionID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.handling", function(client, vehicles, handlingIndex) {
	triggerNetworkEvent("sb.v.handling", null, vehicles, handlingIndex);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.door", function(client, vehicles, doorID, doorState) {
	triggerNetworkEvent("sb.v.door", null, vehicles, doorID, doorState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheel", function(client, vehicles, wheelID, wheelState) {
	triggerNetworkEvent("sb.v.wheel", null, vehicles, doorID, doorState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.alarm", function(client, vehicles, alarmState) {
	vehicles.forEach(function(vehicle) {
		vehicle.setData("sb.v.alarm", alarmState, true);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.horn", function(client, vehicles, hornState) {	
	vehicles.forEach(function(vehicle) {
		vehicle.setData("sb.v.horn", hornState, true);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.health", function(client, vehicles, health) {
	triggerNetworkEvent("sb.v.health", null, vehicles, health);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour1", function(client, vehicles, colour1) {
	vehicles.forEach(function(vehicle) {
		vehicle.colour1 = colour1;
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour2", function(client, vehicles, colour2) {
	vehicles.forEach(function(vehicle) {
		vehicle.colour2 = colour2;
	});					
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour3", function(client, vehicles, colour3) {
	vehicles.forEach(function(vehicle) {
		vehicle.colour3 = colour3;
	});			
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour4", function(client, vehicles, colour4) {
	vehicles.forEach(function(vehicle) {
		vehicle.colour4 = colour4;
	});					
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour", function(client, vehicles, colourID, red, green, blue, alpha) {
	let colour = toColour(red, green, blue, alpha);
	vehicles.forEach(function(vehicle) {
		vehicle.setRGBColours(colour, colour);
	});			
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.coll", function(client, vehicles, collisionState) {
	triggerNetworkEvent("sb.v.coll", null, vehicles, collisionState);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.locked", function(client, vehicles, lockState) {
	triggerNetworkEvent("sb.v.locked", null, vehicles, lockState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.god", function(client, vehicles, godMode) {
	triggerNetworkEvent("sb.v.god", null, vehicles, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.cruisespeed", function(client, vehicles, cruiseSpeed) {
	triggerNetworkEvent("sb.v.cruisespeed", null, vehicles, cruiseSpeed);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.petroltankhealth", function(client, vehicles, patrolTankHealth) {
	triggerNetworkEvent("sb.v.petroltankhealth", null, vehicles, patrolTankHealth);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.enginehealth", function(client, vehicles, engineHealth) {
	triggerNetworkEvent("sb.v.enginehealth", null, vehicles, engineHealth);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.enablegps", function(client, vehicles) {
	triggerNetworkEvent("sb.v.enablegps", null, vehicles);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.opentrunk", function(client, vehicles) {
	triggerNetworkEvent("sb.v.opentrunk", null, vehicles);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.scale", function(client, vehicles, scale) {
	vehicles.forEach(function(vehicle) {
		vehicle.setData("sb.v.scale", scale, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.drivingstyle", function(client, vehicles, drivingStyle) {
	triggerNetworkEvent("sb.v.drivingstyle", null, vehicles, drivingStyle);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.livery", function(client, vehicles, livery) {
	triggerNetworkEvent("sb.v.livery", null, vehicles, livery);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.dirtlevel", function(client, vehicles, dirtLevel) {
	triggerNetworkEvent("sb.v.dirtlevel", null, vehicles, dirtLevel);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.hazardlights", function(client, vehicles, hazardLightState) {
	triggerNetworkEvent("sb.v.hazardlights", null, vehicles, hazardLightState);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.driveto", function(client, vehicles, x, y, z) {
	triggerNetworkEvent("sb.v.driveto", null, vehicles, x, y, z);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.position", function(client, vehicles, x, y, z) {
	vehicles.forEach(function(vehicle) {
		triggerNetworkEvent("sb.v.position", vehicle.syncer, vehicle, x, y, z);	
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.heading", function(client, vehicles, heading) {
	vehicles.forEach(function(vehicle) {
		triggerNetworkEvent("sb.v.heading", vehicle.syncer, vehicle, heading);	
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wander", function(client, vehicles) {
	triggerNetworkEvent("sb.v.wander", null, vehicles);	
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element, client) {

});

// ----------------------------------------------------------------------------