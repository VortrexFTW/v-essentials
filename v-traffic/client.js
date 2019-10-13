"use strict";

// ----------------------------------------------------------------------------

let trafficCruiseSpeed = 16.0;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	initTraffic();
});

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element) {
	resyncTrafficElement(element);
});

// ----------------------------------------------------------------------------

function resyncTrafficElement(element) {
	if(element.isType(ELEMENT_VEHICLE)) {
		if(element.getData("traffic")) {
			startWander(element);
		}
	}
}

// ----------------------------------------------------------------------------

function startWander(vehicle) {
	vehicle.setProofs(true, true, true, true, true);
	vehicle.setCarCruiseSpeed(trafficCruiseSpeed);
	vehicle.setDrivingStyle(0);
	vehicle.carWanderRandomly();
}

// ----------------------------------------------------------------------------

function initTraffic() {
	let vehicles = getVehicles();
	for(let i in vehicles) {
		resyncTrafficElement(vehicles[i]);
	}
}

// ----------------------------------------------------------------------------

