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

addNetworkHandler("OnPedBusted", function(client, ped) {
	triggerEvent("OnPedBusted", ped, ped);
});

addNetworkHandler("OnPedEnteredVehicle", function(client, ped, vehicle, seat) {
	triggerEvent("OnPedEnteredVehicle", ped, ped, vehicle, seat);
});

addNetworkHandler("OnPedExitedVehicle", function(client, ped, vehicle, seat) {
	triggerEvent("OnPedExitedVehicle", ped, ped, vehicle, seat);
});

addNetworkHandler("OnPedEnteredSphere", function(client, ped, sphere) {
	triggerEvent("OnPedEnteredSphere", ped, ped, sphere);
});

addNetworkHandler("OnPedExitedSphere", function(client, ped, sphere) {
	triggerEvent("OnPedExitedSphere", ped, ped, sphere);
});

addNetworkHandler("OnPedEnterSniperMode", function(client, ped, sphere) {
	triggerEvent("OnPedEnterSniperMode", ped, ped, sphere);
});

addNetworkHandler("OnPedExitSniperMode", function(client, ped, sphere) {
	triggerEvent("OnPedExitSniperMode", ped, ped, sphere);
});

addNetworkHandler("OnPedDeath", function(client, ped) {
	triggerEvent("OnPedDeath", ped, ped);
});

addNetworkHandler("OnPedChangeWeapon", function(client, ped, newWeapon, oldWeapon) {
	triggerEvent("OnPedChangeWeapon", ped, ped, newWeapon, oldWeapon);
});

addNetworkHandler("OnPedChangeAmmo", function(client, ped, newAmmo, oldAmmo) {
	triggerEvent("OnPedChangeAmmo", ped, ped, newAmmo, oldAmmo);
});