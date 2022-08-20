addEvent("OnPedEnteredSphereEx", 2);
addEvent("OnPedExitedSphereEx", 2);
addEvent("OnPedEnteredVehicleEx", 3); // Called when ped finishes entering vehicle (built-in onPedEnterVehicle is called when they start entering)
addEvent("OnPedExitedVehicleEx", 2); // Called when ped finishes exiting vehicle (built-in onPedExitVehicle is called when they start exiting)
addEvent("OnPedBusted", 1); // Called when police bust a player (immediately when invoked, will be too soon for when released from jail)
addEvent("OnPedEnterSniperMode", 1); // Called when ped starts aiming in sniper scope
addEvent("OnPedExitSniperMode", 1); // Called when ped stops aiming sniper scope, back to normal view
addEvent("OnPedChangeWeapon", 3); // Called on switch weapon
addEvent("OnPedChangeAmmo", 3); // Called when ammo changes for any reason (shooting, reloading, etc)
addEvent("OnPedDeath", 1); // Called when ped dies. Some games don't have onPedWasted yet. This one doesn't have killer or anything but it's better than nothing
addEvent("OnPickupPickedUp", 1); // Called when a pickup is picked up

let vehicle = null;
let vehicleSeat = 0;
let sphere = null;
let dead = false;
let weapon = -1;
let weaponAmmo = 0;
let busted = false;
let sniperMode = false;

addEventHandler("OnEntityProcess", function (event, entity) {
	if (localPlayer != null) {
		if (entity == localPlayer) {
			if (entity.health <= 0) {
				if (dead == false) {
					dead = true;
					triggerEvent("OnPedDeath", entity);
					triggerNetworkEvent("OnPedDeath", entity.id);
				}
			} else {
				if (dead == true) {
					dead = false;
				}
			}

			if (typeof entity.weapon != "undefined") {
				if (weapon != -1) {
					if (weapon != entity.weapon) {
						triggerEvent("OnPedChangeWeapon", entity, entity, entity.weapon, weapon);
						triggerNetworkEvent("OnPedChangeWeapon", entity.id, entity.weapon, weapon);
						weapon = entity.weapon;
					}
				} else {
					weapon = entity.weapon;
				}
			}

			if (typeof entity.weaponAmmo != "undefined") {
				if (weaponAmmo != -1) {
					if (weaponAmmo != entity.weaponAmmo) {
						triggerEvent("OnPedChangeAmmo", entity, entity, entity.weaponAmmo, weaponAmmo);
						triggerNetworkEvent("OnPedChangeAmmo", entity.id, entity.weaponAmmo, weaponAmmo);
						weaponAmmo = entity.weaponAmmo;
					}
				} else {
					weaponAmmo = entity.weaponAmmo;
				}
			}

			// GTA 3
			if (game.game == 1) {
				if (entity.state == 51) {
					if (busted == false) {
						busted = true;
						triggerEvent("OnPedBusted", entity, entity);
						triggerNetworkEvent("OnPedBusted", entity.id);
					}
				} else {
					if (busted == true) {
						busted = false;
					}
				}

				if (entity.state == 12) {
					if (sniperMode == false) {
						sniperMode = true;
						triggerEvent("OnPedEnterSniperMode", entity, entity);
						triggerNetworkEvent("OnPedEnterSniperMode", entity.id);
					}
				} else {
					if (sniperMode == true) {
						sniperMode = false;
						triggerEvent("OnPedExitSniperMode", entity, entity);
						triggerNetworkEvent("OnPedEnterSniperMode", entity.id);
					}
				}
			}

			if (entity.vehicle == null) {
				if (vehicle != null) {
					triggerEvent("OnPedExitedVehicleEx", entity, entity, vehicle, vehicleSeat);
					triggerNetworkEvent("OnPedExitedVehicleEx", entity.id, vehicle.id, vehicleSeat);
					vehicle = null;
					vehicleSeat = -1;
				}
			} else {
				if (vehicle == null) {
					let seat = getPedVehicleSeat(entity);
					triggerEvent("OnPedEnteredVehicleEx", entity, entity, entity.vehicle, seat);
					triggerNetworkEvent("OnPedEnteredVehicleEx", entity.id, entity.vehicle.id, seat);
					vehicle = entity.vehicle
					vehicleSeat = seat;
				}
			}

			if (typeof gta != "undefined") {
				getElementsByType(ELEMENT_MARKER).forEach(function (tempSphere) {
					let position = entity.position;
					if (entity.vehicle) {
						position = entity.vehicle.position;
					}

					if (tempSphere.position.distance(position) <= tempSphere.radius) {
						if (sphere == null) {
							triggerEvent("OnPedEnteredSphereEx", entity, entity, tempSphere);
							triggerNetworkEvent("OnPedEnteredSphereEx", entity.id, tempSphere.id);
							sphere = tempSphere;
						}
					} else {
						if (sphere != null) {
							triggerEvent("OnPedExitedSphereEx", entity, entity, tempSphere);
							triggerNetworkEvent("OnPedExitedSphereEx", entity.id, tempSphere.id);
							sphere = null;
						}
					}
				});
			}
		}
	}
});

addEventHandler("OnPickupCollected", function (event, pickup, ped) {
	triggerEvent("OnPickupPickedUp", pickup, pickup);
	triggerNetworkEvent("OnPickupPickedUp", pickup.id, ped.id);
});

function getPedVehicleSeat(ped) {
	for (let i = 0; i <= 3; i++) {
		if (ped.vehicle.getOccupant(i) == ped) {
			return i;
		}
	}
	return 0;
}