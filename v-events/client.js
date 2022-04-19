addEvent("OnPedEnteredSphere", 2);
addEvent("OnPedExitedSphere", 2);
addEvent("OnPedEnteredVehicle", 3);
addEvent("OnPedExitedVehicle", 2);
addEvent("OnPedBusted", 1);
addEvent("OnPedEnterSniperMode", 1);
addEvent("OnPedExitSniperMode", 1);

addEventHandler("OnEntityProcess", function(event, entity) {
	if(entity.isType(ELEMENT_PLAYER) || entity.isType(ELEMENT_PED)) {
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