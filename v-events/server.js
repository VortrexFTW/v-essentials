addEvent("OnPedEnteredSphere", 2);
addEvent("OnPedExitedSphere", 2);
addEvent("OnPedEnteredVehicle", 3);
addEvent("OnPedExitedVehicle", 2);
addEvent("OnPedBusted", 1);
addEvent("OnPedEnterSniperMode", 1);
addEvent("OnPedExitSniperMode", 1);

addNetworkHandler("OnPedBusted", function(client, ped)) {
	triggerEvent("OnPedBusted", ped);
});

addNetworkHandler("OnPedEnteredVehicle", function(client, ped, vehicle, seat)) {
	triggerEvent("OnPedEnteredVehicle", ped, vehicle, seat);
});

addNetworkHandler("OnPedExitedVehicle", function(client, ped, vehicle, seat)) {
	triggerEvent("OnPedExitedVehicle", ped, vehicle, seat);
});

addNetworkHandler("OnPedEnteredSphere", function(client, ped, sphere)) {
	triggerEvent("OnPedEnteredSphere", ped, sphere);
});

addNetworkHandler("OnPedExitedSphere", function(client, ped, sphere)) {
	triggerEvent("OnPedExitedSphere", ped, sphere);
});

addNetworkHandler("OnPedEnterSniperMode", function(client, ped, sphere)) {
	triggerEvent("OnPedEnterSniperMode", ped, sphere);
});

addNetworkHandler("OnPedExitSniperMode", function(client, ped, sphere)) {
	triggerEvent("OnPedExitSniperMode", ped, sphere);
});