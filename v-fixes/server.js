"use strict";

// ===========================================================================

let supportedGames = [
	GAME_GTA_III,
	GAME_GTA_VC,
	GAME_GTA_SA,
	GAME_GTA_IV,
	GAME_MAFIA_ONE,
];

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
addEvent("OnVehicleLockedStatusChanged", 2); // Called when vehicle locked status is toggled
addEvent("OnVehicleTaxiLightChanged", 2); // Called when vehicle taxi light is toggled
addEvent("OnVehicleHealthChanged", 2); // Called when vehicle health changes

// ===========================================================================

addNetworkHandler("OnPedBusted", function (client, pedId) {
	triggerEvent("OnPedBusted", getElementFromId(pedId), getElementFromId(pedId));
});

// ===========================================================================

addNetworkHandler("OnPedEnteredVehicleEx", function (client, pedId, vehicleId, seat) {
	if (getElementFromId(pedId) == null) {
		return;
	}

	if (getElementFromId(vehicleId) == null) {
		return;
	}

	getElementFromId(pedId).setData("v.seat", seat);
	triggerEvent("OnPedEnteredVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

// ===========================================================================

addNetworkHandler("OnPedExitedVehicleEx", function (client, pedId, vehicleId, seat) {
	if (getElementFromId(pedId) == null) {
		return;
	}

	if (getElementFromId(vehicleId) == null) {
		return;
	}

	getElementFromId(pedId).removeData("v.seat");
	triggerEvent("OnPedExitedVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

// ===========================================================================

addNetworkHandler("OnPedEnteringVehicleEx", function (client, pedId, vehicleId, seat) {
	triggerEvent("OnPedEnteringVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

// ===========================================================================

addNetworkHandler("OnPedExitingVehicleEx", function (client, pedId, vehicleId, seat) {
	triggerEvent("OnPedExitingVehicleEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(vehicleId), seat);
});

// ===========================================================================

addNetworkHandler("OnPedEnteredSphereEx", function (client, pedId, sphereId) {
	triggerEvent("OnPedEnteredSphereEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(sphereId));
});

// ===========================================================================

addNetworkHandler("OnPedExitedSphereEx", function (client, pedId, sphereId) {
	triggerEvent("OnPedExitedSphereEx", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(sphereId));
});

// ===========================================================================

addNetworkHandler("OnPedEnterSniperMode", function (client, pedId) {
	triggerEvent("OnPedEnterSniperMode", getElementFromId(pedId), getElementFromId(pedId));
});

// ===========================================================================

addNetworkHandler("OnPedExitSniperMode", function (client, pedId) {
	triggerEvent("OnPedExitSniperMode", getElementFromId(pedId), getElementFromId(pedId));
});

// ===========================================================================

addNetworkHandler("OnPedDeathEx", function (client, pedId) {
	triggerEvent("OnPedDeathEx", getElementFromId(pedId), getElementFromId(pedId));
	triggerEvent("OnPlayerDeathEx", client, client);
});

// ===========================================================================

addNetworkHandler("OnPedChangeWeapon", function (client, pedId, newWeapon, oldWeapon) {
	triggerEvent("OnPedChangeWeapon", getElementFromId(pedId), getElementFromId(pedId), newWeapon, oldWeapon);
});

// ===========================================================================

addNetworkHandler("OnPedChangeAmmo", function (client, pedId, newAmmo, oldAmmo) {
	triggerEvent("OnPedChangeAmmo", getElementFromId(pedId), newAmmo, oldAmmo);
});

// ===========================================================================

addNetworkHandler("OnPickupPickedUp", function (client, pedId, pickupId) {
	triggerEvent("OnPickupPickedUp", getElementFromId(pedId), getElementFromId(pedId), getElementFromId(pickupId));
});

// ===========================================================================

addEventHandler("OnAddIVNetworkEvent", function (client, type, name, data, data2) {
	/*
	0 - REQUEST_CONTROL_EVENT
	1 - GIVE_CONTROL_EVENT
	2 - OBJECT_ID_FREED_EVENT
	3 - WEAPON_DAMAGE_EVENT
	4 - REQUEST_PICKUP_EVENT
	5 - GAME_CLOCK_AND_WEATHER_EVENT
	6 - RESURRECT_PLAYER_EVENT
	7 - RESURRECTED_LOCAL_PLAYER_EVENT
	8 - GIVE_WEAPON_EVENT
	9 - REMOVE_WEAPON_EVENT
	10 - REMOVE_ALL_WEAPONS_EVENT
	11 - VEHICLE_COMPONENT_CONTROL_EVENT
	12 - REQUEST_FIRE_EVENT
	13 - START_FIRE_EVENT
	14 - REQUEST_EXPLOSION_EVENT
	15 - START_EXPLOSION_EVENT
	16 - START_PROJECTILE_EVENT
	17 - SESSION_SETTINGS_CHANGED_EVENT
	18 - ALTER_WANTED_LEVEL_EVENT
	19 - CREATE_PICKUP_EVENT
	20 - CHANGE_RADIO_STATION_EVENT
	21 - UPDATE_GPS_EVENT
	22 - RAGDOLL_REQUEST_EVENT
	23 - MARK_AS_NO_LONGER_NEEDED_EVENT
	24 - PLAYER_TAUNT_EVENT
	25 - DOOR_BREAK_EVENT
	26 - HOST_VARIABLES_VERIFY_EVENT
	*/

	//if (type == 3) {
	getClients().filter(c => c.index != client.index).forEach(c => {
		triggerNetworkEvent("ReceiveIVNetworkEvent", c, type, name, data, data2, client.index);
	});
	//}
});

// ===========================================================================

addNetworkHandler("OnVehicleHealthChanged", function (client, vehicleId, health) {
	if (getElementFromId(vehicleId) == null) {
		return;
	}

	triggerEvent("OnVehicleHealthChanged", getElementFromId(vehicleId), health);
});

// ===========================================================================

addNetworkHandler("OnVehicleLightsChanged", function (client, vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return;
	}

	triggerEvent("OnVehicleLightsChanged", getElementFromId(vehicleId), state);
});

// ===========================================================================

addNetworkHandler("OnVehicleSirenChanged", function (client, vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return;
	}

	triggerEvent("OnVehicleSirenChanged", getElementFromId(vehicleId), state);
});

// ===========================================================================

addNetworkHandler("OnVehicleLockedStatusChanged", function (client, vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return;
	}

	triggerEvent("OnVehicleLockedStatusChanged", getElementFromId(vehicleId), state);
});

// ===========================================================================

addNetworkHandler("OnVehicleTaxiLightChanged", function (client, vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return;
	}

	triggerEvent("OnVehicleTaxiLightChanged", getElementFromId(vehicleId), state);
});

// ===========================================================================