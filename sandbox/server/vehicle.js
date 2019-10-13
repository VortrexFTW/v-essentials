"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
		if(vehicles[i].getData("sb") == null) {
			createDefaultVehicleData(vehicles[i]);
		}
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.add", function(client, modelID, x, y, z, heading) {
	//let vehicles = getVehicles();
	//if(vehicles.length >= maxVehicles) {
	//	messageClient("This server only allows " + maxVehicles + " vehicles!", errorMessageColour, client);
	//	return false;
	//}
	
	let position = new Vec3(x, y, z);
	let tempVehicle = createVehicle(Number(modelID), position);
	tempVehicle.position = new Vec3(x, y, z);
	tempVehicle.heading = heading;
	createDefaultVehicleData(tempVehicle);
	addToWorld(tempVehicle);
	
	let modelName = getVehicleNameFromModelId(tempVehicle.modelIndex);
	message(client.name + " spawned " + String((doesWordStartWithVowel(modelName)) ? "an" : "a") + " " + modelName, gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.fix", function(client, vehicle) {
	triggerNetworkEvent("sb.v.fix", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.del", function(client, vehicle) {
	destroyElement(getElementFromId(vehicle));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.siren", function(client, vehicle, sirenState) {
	triggerNetworkEvent("sb.v.siren", null, vehicle, sirenState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.sirenState] = sirenState;
	getElementFromId(vehicle).setData("sb",	 vehicleData);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.engine", function(client, vehicle, engineState) {
	triggerNetworkEvent("sb.v.engine", null, vehicle, engineState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.engineState] = engineState;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.radio", function(client, vehicle, radioStation) {
	triggerNetworkEvent("sb.v.radio", null, vehicle, radioStation);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.radioStation] = radioStation;
	getElementFromId(vehicle).setData("sb", vehicleData);		
	triggerNetworkEvent("sb.v.sync", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.lights", function(client, vehicle, lightState) {
	triggerNetworkEvent("sb.v.lights", null, vehicle, lightState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.lightState] = lightState;
	getElementFromId(vehicle).setData("sb", vehicleData);		
	triggerNetworkEvent("sb.v.sync", null, vehicle);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.light", function(client, vehicle, lightID, lightState) {
	triggerNetworkEvent("sb.v.light", null, vehicle, lightID, lightState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.lightStatus][lightID] = lightState;
	getElementFromId(vehicle).setData("sb", vehicleData);	
	triggerNetworkEvent("sb.v.sync", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.syncer", function(client, vehicleID, clientName) {
	getElementFromId(vehicleID).syncer = getClientFromName(clientName).index;
	message(getClientFromName(clientName).name + " is now the syncer for vehicle " + String(vehicleID), gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheels", function(client, vehicle, wheelState) {
	triggerNetworkEvent("sb.v.wheels", null, vehicle, wheelState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.wheelsState] = wheelState;
	getElementFromId(vehicle).setData("sb", vehicleData);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.add", function(client, vehicleId, upgradeId) {
	triggerNetworkEvent("sb.v.upgrade.add", null, vehicleId, upgradeId);

	let vehicleData = getElementFromId(vehicleId).getData("sb");
	vehicleData[vehicleDataStructure.upgrades].push(upgradeId);
	getElementFromId(vehicleId).setData("sb", vehicleData);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.upgrade.del", function(client, vehicleId, upgradeId) {
	triggerNetworkEvent("sb.v.upgrade.del", null, vehicleId, upgradeId);

	let vehicleData = getElementFromId(vehicleId).getData("sb");
	vehicleData[vehicleDataStructure.upgrades] = vehicleData[vehicleDataStructure.upgrades].filter(upgrade => upgrade == Number(upgradeId));
	getElementFromId(vehicleId).setData("sb", vehicleData);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.paintjob", function(client, vehicle, paintjobId) {
	triggerNetworkEvent("sb.v.paintjob", null, vehicle, paintjobId);

	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.paintJob] = paintjobId;
	getElementFromId(vehicle).setData("sb", vehicleData);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.doors", function(client, vehicle, doorState) {
	triggerNetworkEvent("sb.v.doors", null, vehicle, doorState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.doorsState] = doorState;
	getElementFromId(vehicle).setData("sb", vehicleData);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.mission", function(client, vehicle, missionID) {
	triggerNetworkEvent("sb.v.mission", null, vehicle, missionID);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.mission] = missionID;
	getElementFromId(vehicle).setData("sb", vehicleData);	
	triggerNetworkEvent("sb.v.sync", null, vehicle);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.handling", function(client, vehicle, handlingIndex) {
	triggerNetworkEvent("sb.v.handling", null, vehicle, handlingIndex);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.handlingIndex] = handlingIndex;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.door", function(client, vehicle, doorID, doorState) {
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.doorStatus][doorID] = doorState;
	getElementFromId(vehicle).setData("sb", vehicleData);	
	triggerNetworkEvent("sb.v.sync", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wheel", function(client, vehicle, wheelID, wheelState) {
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.wheelStatus][wheelID] = wheelState;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.alarm", function(client, vehicle, alarmState) {
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.alarmState] = !!alarmState;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.horn", function(client, vehicle, hornState) {	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.hornState] = hornState;
	getElementFromId(vehicle).setData("sb", vehicleData);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.health", function(client, vehicle, health) {
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.health] = health;
	getElementFromId(vehicle).setData("sb", vehicleData);	
	triggerNetworkEvent("sb.v.sync", null, vehicle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour1", function(client, vehicle, colour1) {
	getElementFromId(vehicle).colour1 = colour1;		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour2", function(client, vehicle, colour2) {
	getElementFromId(vehicle).colour2 = colour2;				
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour3", function(client, vehicle, colour3) {
	getElementFromId(vehicle).colour3 = colour3;		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour4", function(client, vehicle, colour4) {
	getElementFromId(vehicle).colour4 = colour4;				
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.colour", function(client, vehicle, colourID, red, green, blue, alpha) {
	let colour = toColour(red, green, blue, alpha);
	getElementFromId(vehicle).setRGBColours(colour, colour);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.coll", function(client, vehicle, collisionState) {
	triggerNetworkEvent("sb.v.coll", null, vehicle, collisionState);

	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.collisionsEnabled] = !!collisionState;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.locked", function(client, vehicle, lockState) {
	triggerNetworkEvent("sb.v.locked", null, vehicle, lockState);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.lockState] = !!lockState;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.god", function(client, vehicle, godMode) {
	triggerNetworkEvent("sb.v.god", null, vehicle, godMode);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.godMode] = !!godMode;
	getElementFromId(vehicle).setData("sb", vehicleData);	
	triggerNetworkEvent("sb.v.sync", null, vehicle);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.cruisespeed", function(client, vehicle, cruiseSpeed) {
	triggerNetworkEvent("sb.v.cruisespeed", null, vehicle, cruiseSpeed);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.cruiseSpeed] = cruiseSpeed;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.scale", function(client, vehicle, scale) {
	//triggerNetworkEvent("sb.v.scale", null, vehicle, scale);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.scale] = scale;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.drivingstyle", function(client, vehicle, drivingStyle) {
	triggerNetworkEvent("sb.v.drivingstyle", null, vehicle, drivingStyle);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.drivingStyle] = drivingStyle;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.driveto", function(client, vehicle, x, y, z) {
	triggerNetworkEvent("sb.v.driveto", null, vehicle, x, y, z);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.driveTo][0] = x;
	vehicleData[vehicleDataStructure.driveTo][1] = x;
	vehicleData[vehicleDataStructure.driveTo][2] = x;
	getElementFromId(vehicle).setData("sb", vehicleData);
	triggerNetworkEvent("sb.v.sync", null, vehicle);		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.v.wander", function(client, vehicle) {
	triggerNetworkEvent("sb.v.wander", null, vehicle);
	
	let vehicleData = getElementFromId(vehicle).getData("sb");
	vehicleData[vehicleDataStructure.wanderRandomly] = true;
	getElementFromId(vehicle).setData("sb", vehicleData);		
	triggerNetworkEvent("sb.v.sync", null, vehicle);	
});

addNetworkHandler("sb.p.veh.enter", function(client, vehicleID, driver) {
	triggerNetworkEvent("sb.p.veh.enter", null, client.player.id, vehicleID, driver);	
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
		if(!vehicles[i].getData("sb")) {
			createDefaultVehicleData(vehicles[i]);
			triggerNetworkEvent("sb.v.sync", null, vehicles[i]);	
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element, client) {
	if(element.isType(ELEMENT_VEHICLE)) {
		triggerNetworkEvent("sb.v.sync", client, element.id);	
	}
});

// ----------------------------------------------------------------------------