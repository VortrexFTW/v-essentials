"use strict";

// ===========================================================================

addEvent("OnPedEnteredSphereEx", 2);
addEvent("OnPedExitedSphereEx", 2);
addEvent("OnPedEnteredVehicleEx", 3); // Called when ped finishes entering vehicle
addEvent("OnPedExitedVehicleEx", 3); // Called when ped finishes exiting vehicle
addEvent("OnPedEnteringVehicleEx", 3); // Called when ped starts entering vehicle
addEvent("OnPedExitingVehicleEx", 3); // Called when ped starts exiting vehicle
addEvent("OnPedBusted", 1); // Called when police bust a player (immediately when invoked, will be too soon for when released from jail)
addEvent("OnPedEnterSniperMode", 1); // Called when ped starts aiming in sniper scope
addEvent("OnPedExitSniperMode", 1); // Called when ped stops aiming sniper scope, back to normal view
addEvent("OnPedChangeWeapon", 3); // Called on switch weapon
addEvent("OnPedChangeAmmo", 3); // Called when ammo changes for any reason (shooting, reloading, etc)
addEvent("OnPedDeathEx", 1); // Called when ped dies. Some games don't have onPedWasted yet. This one doesn't have killer or anything but it's better than nothing
addEvent("OnPlayerDeathEx", 1); // Called when a player dies. Some games don't have onPedWasted yet. This one doesn't have killer or anything but it's better than nothing
addEvent("OnPickupPickedUp", 2); // Called when a pickup is picked up
addEvent("OnVehicleLightsChanged", 2); // Called when vehicle lights are toggled
addEvent("OnVehicleSirenChanged", 2); // Called when vehicle siren is toggled
addEvent("OnVehicleLockChanged", 2); // Called when vehicle locked status is toggled
addEvent("OnVehicleTaxiLightChanged", 2); // Called when vehicle taxi light is toggled
addEvent("OnVehicleHealthChanged", 2); // Called when vehicle health changes
addEvent("OnPlayerMapLoaded", 2); // Called when a map is loaded, used for Mafia 1

// ===========================================================================

addNetworkHandler("OnPedBusted", function (client, pedId) {
	triggerEvent("OnPedBusted", getElementFromId(pedId), getElementFromId(pedId));
});

// ===========================================================================

addNetworkHandler("OnPedEnteredVehicleEx", function (client, pedId, vehicleId, seat) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return;
	}

	ped.setData("v.seat", seat);
	triggerEvent("OnPedEnteredVehicleEx", ped, ped, vehicle, seat);
});

// ===========================================================================

addNetworkHandler("OnPedExitedVehicleEx", function (client, pedId, vehicleId, seat) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return;
	}

	ped.removeData("v.seat");
	triggerEvent("OnPedExitedVehicleEx", ped, ped, vehicle, seat);
});

// ===========================================================================

addNetworkHandler("OnPedEnteringVehicleEx", function (client, pedId, vehicleId, seat) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return;
	}

	triggerEvent("OnPedEnteringVehicleEx", ped, ped, vehicle, seat);
});

// ===========================================================================

addNetworkHandler("OnPedExitingVehicleEx", function (client, pedId, vehicleId, seat) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return;
	}

	triggerEvent("OnPedExitingVehicleEx", ped, ped, vehicle, seat);
});

// ===========================================================================

addNetworkHandler("OnPedEnteredSphereEx", function (client, pedId, sphereId) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let sphere = getElementFromId(sphereId);
	if (sphere == null) {
		return;
	}

	triggerEvent("OnPedEnteredSphereEx", ped, ped, sphere);
});

// ===========================================================================

addNetworkHandler("OnPedExitedSphereEx", function (client, pedId, sphereId) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let sphere = getElementFromId(sphereId);
	if (sphere == null) {
		return;
	}

	triggerEvent("OnPedExitedSphereEx", ped, ped, sphere);
});

// ===========================================================================

addNetworkHandler("OnPedEnterSniperMode", function (client, pedId) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	triggerEvent("OnPedEnterSniperMode", ped, ped);
});

// ===========================================================================

addNetworkHandler("OnPedExitSniperMode", function (client, pedId) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	triggerEvent("OnPedExitSniperMode", ped, ped);
});

// ===========================================================================

addNetworkHandler("OnPedDeathEx", function (client, pedId) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	triggerEvent("OnPedDeathEx", ped, ped);

	if (ped.isType(ELEMENT_PLAYER)) {
		triggerEvent("OnPlayerDeathEx", client, client);
	}
});

// ===========================================================================

addNetworkHandler("OnPedChangeWeapon", function (client, pedId, newWeapon, oldWeapon) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	triggerEvent("OnPedChangeWeapon", ped, ped, newWeapon, oldWeapon);
});

// ===========================================================================

addNetworkHandler("OnPedChangeAmmo", function (client, pedId, newAmmo, oldAmmo) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	triggerEvent("OnPedChangeAmmo", ped, ped, newAmmo, oldAmmo);
});

// ===========================================================================

addNetworkHandler("OnPickupPickedUp", function (client, pedId, pickupId) {
	let ped = getElementFromId(pedId);
	if (ped == null) {
		return;
	}

	if (ped.syncer != client) {
		return;
	}

	let pickup = getElementFromId(pickupId);
	if (pickup == null) {
		return;
	}

	triggerEvent("OnPickupPickedUp", ped, ped, pickup);
});

// ===========================================================================

addEventHandler("OnAddIVNetworkEvent", function (event, client, type, name, data, data2) {
	getClients().filter(c => c.index != client.index).forEach(c => {
		triggerNetworkEvent("ReceiveIVNetworkEvent", c, type, name, data, data2, client.index);
	});
});

// ===========================================================================

addNetworkHandler("OnVehicleHealthChanged", function (client, vehicleId, oldHealth, newHealth) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	vehicle.setData("v.health", newHealth, true);
	triggerEvent("OnVehicleHealthChanged", vehicle, vehicle, oldHealth, newHealth);
});

// ===========================================================================

addNetworkHandler("OnVehicleLightsChanged", function (client, vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	//vehicle.setData("v.lights", state, true);
	//triggerEvent("OnVehicleLightsChanged", vehicle, vehicle, state);
});

// ===========================================================================

addNetworkHandler("OnVehicleSirenChanged", function (client, vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	vehicle.setData("v.siren", state, true);
	triggerEvent("OnVehicleSirenChanged", vehicle, vehicle, state);
});

// ===========================================================================

addNetworkHandler("OnVehicleLockChanged", function (client, vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	vehicle.setData("v.locked", state, true);
	triggerEvent("OnVehicleLockChanged", vehicle, vehicle, state);
});

// ===========================================================================

addNetworkHandler("OnVehicleTaxiLightChanged", function (client, vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	vehicle.setData("v.taxiLight", state, true);
	triggerEvent("OnVehicleTaxiLightChanged", vehicle, vehicle, state);
});

// ===========================================================================

addNetworkHandler("OnVehicleHazardLightsChanged", function (client, vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	vehicle.setData("v.hazardLights", state, true);
	triggerEvent("OnVehicleHazardLightsChanged", vehicle, vehicle, state);
});

// ===========================================================================

addNetworkHandler("OnVehicleInteriorLightChanged", function (client, vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);
	if (vehicle == null) {
		return false;
	}

	if (vehicle.syncer != client) {
		return false;
	}

	vehicle.setData("v.interiorLight", state, true);
	triggerEvent("OnVehicleInteriorLightChanged", vehicle, vehicle, state);
});

// ===========================================================================

addNetworkHandler("OnPlayerMapLoaded", function (client, mapName) {
	console.log(`[${thisResource.name}] OnPlayerMapLoaded: ${client.name} has loaded map: ${mapName}`);
	triggerEvent("OnPlayerMapLoaded", client, client, mapName);
});

// ===========================================================================