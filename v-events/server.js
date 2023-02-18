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
addEvent("OnPickupPickedUp", 2); // Called when a pickup is picked up

addNetworkHandler("OnPedBusted", function (client, pedId) {
	triggerEvent("OnPedBusted", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedEnteredVehicleEx", function (client, pedId, vehicleId, seat) {
	triggerEvent("OnPedEnteredVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

addNetworkHandler("OnPedExitedVehicleEx", function (client, pedId, vehicleId, seat) {
	triggerEvent("OnPedExitedVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

addNetworkHandler("OnPedEnteringVehicleEx", function (client, pedId, vehicleId, seat) {
	triggerEvent("OnPedEnteringVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

addNetworkHandler("OnPedExitingVehicleEx", function (client, pedId, vehicleId, seat) {
	triggerEvent("OnPedExitingVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

addNetworkHandler("OnPedEnteredSphereEx", function (client, pedId, sphereId) {
	triggerEvent("OnPedEnteredSphereEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(sphereId));
});

addNetworkHandler("OnPedExitedSphereEx", function (client, pedId, sphereId) {
	triggerEvent("OnPedExitedSphereEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(sphereId));
});

addNetworkHandler("OnPedEnterSniperMode", function (client, pedId) {
	triggerEvent("OnPedEnterSniperMode", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedExitSniperMode", function (client, pedId) {
	triggerEvent("OnPedExitSniperMode", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedDeathEx", function (client, pedId) {
	triggerEvent("OnPedDeathEx", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedChangeWeapon", function (client, pedId, newWeapon, oldWeapon) {
	triggerEvent("OnPedChangeWeapon", getElementFromId(pedId), getElementFromId(pedId), newWeapon, oldWeapon);
});

addNetworkHandler("OnPedChangeAmmo", function (client, pedId, newAmmo, oldAmmo) {
	triggerEvent("OnPedChangeAmmo", getElementFromId(pedId), newAmmo, oldAmmo);
});

addNetworkHandler("OnPickupPickedUp", function (client, pedId, pickupId) {
	triggerEvent("OnPickupPickedUp", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(pickupId));
});