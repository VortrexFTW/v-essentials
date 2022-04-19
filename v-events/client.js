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

addEventHandler("OnEntityProcess", function(event, entity) {
	if(entity.isType(ELEMENT_PLAYER) || entity.isType(ELEMENT_PED)) {
		if(entity.health <= 0) {
			if(entity.getData("dead") == null) {
				entity.setData("dead", true);
				triggerEvent("OnPedDeath", entity);
			}
		} else {
			if(entity.getData("dead") != null) {
				entity.removeData("dead");
			}
		}

		if(entity.getData("weapon") != null) {
			if(entity.getData("weapon") != entity.weapon) {
				triggerEvent("OnPedChangeWeapon", entity, entity, entity.weapon, entity.getData("weapon"));
				entity.setData("weapon", entity.weapon);
				triggerNetworkEvent("OnPedChangeWeapon", entity, entity.weapon, entity.getData("weapon"));
			}
		} else {
			entity.setData("weapon", entity.weapon);
		}

		if(entity.getData("ammo") != null) {
			if(entity.getData("ammo") != entity.weaponAmmo) {
				triggerEvent("OnPedChangeAmmo", entity, entity, entity.weaponAmmo, entity.getData("ammo"));
				entity.setData("ammo", entity.weapon);
				triggerNetworkEvent("OnPedChangeAmmo", entity, entity.weaponAmmo, entity.getData("ammo"));
			}
		} else {
			entity.setData("weapon", entity.weapon);
		}

		if(game.game == GAME_GTA_III) {
			if(entity.state == 51) {
				if(entity.getData("busted") == null) {
					entity.setData("busted", true);
					triggerEvent("OnPedBusted", entity, entity);
					triggerNetworkEvent("OnPedBusted", entity);
				}
			} else {
				if(entity.getData("busted") != null) {
					entity.removeData("busted");
				}
			}

			if(entity.state == 12) {
				if(entity.getData("snipermode") == null) {
					entity.setData("snipermode", true);
					triggerEvent("OnPedEnterSniperMode", entity, entity);
					triggerNetworkEvent("OnPedEnterSniperMode", entity);
				}
			} else {
				if(entity.getData("snipermode") != null) {
					entity.removeData("snipermode");
					triggerEvent("OnPedExitSniperMode", entity, entity);
					triggerNetworkEvent("OnPedEnterSniperMode", entity);
				}
			}
		}

		getElementsByType(ELEMENT_VEHICLE).forEach(function(vehicle) {
			if(entity.vehicle == vehicle) {
				if(entity.getData("in.vehicle") == null) {
					triggerEvent("OnPedEnteredVehicle", entity, entity, vehicle, getPedVehicleSeat(entity));
					entity.setData("in.vehicle", vehicle);
				}
			} else {
				if(entity.getData("in.vehicle") == vehicle) {
					triggerEvent("OnPedExitedVehicle", entity, entity, entity.getData("in.vehicle"));
					entity.removeData("in.vehicle");
				}
			}
		});

		getElementsByType(ELEMENT_MARKER).forEach(function(sphere) {
			if(sphere.position.distance(entity.position) <= sphere.radius) {
				if(entity.getData("in.sphere") == null) {
					triggerEvent("OnPedEnterSphere", entity, entity, sphere);
					entity.setData("in.sphere", true);
				}
			} else {
				if(entity.getData("in.sphere") != null) {
					triggerEvent("OnPedExitSphere", entity, entity, sphere);
					entity.removeData("in.sphere");
				}
			}
		});
	}
});

function getPedVehicleSeat(ped) {
	for(let i=0;i<=3;i++) {
		if(ped.vehicle.getOccupant(i) == ped) {
			return i;
		}
	}
	return 0;
}