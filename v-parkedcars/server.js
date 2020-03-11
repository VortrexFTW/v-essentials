"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	let sandboxResource = findResourceByName("sandbox");
	
	let vehiclesFile = openFile("vehicles.json");
	console.log("[ParkedCars] Data file opened.");
	let vehiclesData = false;
	
	if(vehiclesFile != null) {
		let vehiclesDataText = vehiclesFile.readBytes(vehiclesFile.length);
		console.log("[ParkedCars] Data file read to variable.")
		vehiclesFile.close();
		console.log("[ParkedCars] Data file closed.")
		let vehiclesDataRoot = JSON.parse(vehiclesDataText);
		vehiclesData = vehiclesDataRoot.vehicles;
		console.log("[ParkedCars] Vehicle data contents parsed into JSON.");
	}

	let parkedCarCount = 0;
	for(let i in vehiclesData) {
		if(server.game == vehiclesData[i].game) {
			let vehicleName = "model " + String(vehiclesData[i].model);
			if(sandboxResource != null && sandboxResource.isStarted) {
				vehicleName = sandboxResource.exports.getVehicleModelName(Number(vehiclesData[i].model));
			}
				
			console.log("[ParkedCars] Vehicle '" + vehicleName + "' spawned at " + vehiclesData[i].x + ", " + vehiclesData[i].y + ", " + vehiclesData[i].z);
			let position = new Vec3(Number(vehiclesData[i].x), Number(vehiclesData[i].y), Number(vehiclesData[i].z));
			let tempVehicle = createVehicle(Number(vehiclesData[i].model), position, Number(vehiclesData[i].game));
			tempVehicle.heading = degToRad(Number(vehiclesData[i].angle));	
			addToWorld(tempVehicle);

			parkedCarCount++;
		}
	}

	console.log("[ParkedCars] " + String(parkedCarCount) + " parked vehicles added!");
});

// ----------------------------------------------------------------------------

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------
