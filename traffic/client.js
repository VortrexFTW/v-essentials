"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element) {
	setTimeout(resyncTrafficElement, 500, element);
});

function resyncTrafficElement(element) {
	if(element.isType(ELEMENT_CIVILIAN)) {
		if(element.getData("AI.V")) {
			if(element.getData("AI.V")) {
				let vehicle = getElementFromId(element.getData("AI.V"));
				if(vehicle != null) {
					element.stayInSamePlace = false;
					element.enterVehicle(vehicle, true);
					setTimeout(startWander, 4000, vehicle);
				}
			}
		}
	}
}

function startWander(vehicle) {
	vehicle.setCarCruiseSpeed(16.0);
	vehicle.setDrivingStyle(0);
	vehicle.carWanderRandomly();
}

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		setTimeout(startupTraffic, 1000);
	}
});

function startupTraffic() {
	let peds = getPeds();
	for(let i in peds) {
		//if(element.isType(ELEMENT_CIVILIAN)) {
			if(peds[i].getData("AI.V")) {
				if(peds[i].getData("AI.V")) {
					let vehicle = getElementFromId(peds[i].getData("AI.V"));
					if(vehicle != null) {
						peds[i].stayInSamePlace = false;
						peds[i].enterVehicle(vehicle, true);
						vehicle.setCarCruiseSpeed(16.0);
						vehicle.setDrivingStyle(0);
						vehicle.carWanderRandomly();						
						setTimeout(startWander, 4000, vehicle);
					}
				}
			}
		//}
	}
}

// ----------------------------------------------------------------------------