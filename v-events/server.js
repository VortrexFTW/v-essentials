addEvent("OnPedEnteredSphere", 2);
addEvent("OnPedExitedSphere", 2);
addEvent("OnPedEnteredVehicle", 3); // Called when ped finishes entering vehicle (built-in onPedEnterVehicle is called when they start entering)
addEvent("OnPedExitedVehicle", 2); // Called when ped finishes exiting vehicle (built-in onPedExitVehicle is called when they start exiting)
addEvent("OnPedBusted", 1); // Called when police bust a player (immediately when invoked, will be too soon for when released from jail)
addEvent("OnPedEnterSniperMode", 1); // Called when ped starts aiming in sniper scope
addEvent("OnPedExitSniperMode", 1); // Called when ped stops aiming sniper scope, back to normal view
addEvent("OnPedChangeWeapon", 3); // Called on switch weapon
addEvent("OnPedChangeAmmo", 3); // Called when ammo changes for any reason (shooting, reloading, etc)
addEvent("OnPedDeath", 1); // Called when ped dies. Some games don't have onPedWasted yet. This one doesn't have killer or anything but it's better than nothing

addNetworkHandler("OnPedBusted", function(client, pedId) {
	triggerEvent("OnPedBusted", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedEnteredVehicle", function(client, pedId, vehicleId, seat) {
	triggerEvent("OnPedEnteredVehicle", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

addNetworkHandler("OnPedExitedVehicle", function(client, pedId, vehicleId, seat) {
	triggerEvent("OnPedExitedVehicle", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

addNetworkHandler("OnPedEnteredSphere", function(client, pedId, sphereId) {
	triggerEvent("OnPedEnteredSphere", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(sphereId));
});

addNetworkHandler("OnPedExitedSphere", function(client, pedId, sphereId) {
	triggerEvent("OnPedExitedSphere", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(sphereId));
});

addNetworkHandler("OnPedEnterSniperMode", function(client, pedId) {
	triggerEvent("OnPedEnterSniperMode", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedExitSniperMode", function(client, pedId) {
	triggerEvent("OnPedExitSniperMode", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedDeath", function(client, pedId) {
	triggerEvent("OnPedDeath", getElementFromId(pedId), getElementFromId(pedId));
});

addNetworkHandler("OnPedChangeWeapon", function(client, pedId, newWeapon, oldWeapon) {
	triggerEvent("OnPedChangeWeapon", getElementFromId(pedId), getElementFromId(pedId), newWeapon, oldWeapon);
});

addNetworkHandler("OnPedChangeAmmo", function(client, pedId, newAmmo, oldAmmo) {
	triggerEvent("OnPedChangeAmmo", getElementFromId(pedId), newAmmo, oldAmmo);
});