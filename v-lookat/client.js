"use strict";

// WARNING: This resource is VERY buggy on GTA 3 and Vice City. I haven't had a chance to finish tweaking it.
// You will often find yourself unable to aim or punch. I'll try to fix this soon ;)

// GTA 3 and Vice City do not have "look" functions like SA has, so I made this work by using ped.pointGunAt()
// and since it only accepts an element (not a position), it spawns a client-side invisible object (just placed in another dimension) and
// moves it around to be aligned with the camera to world calculation, and ped.pointGunAt() can be used with that.
// Without a weapon it looks cool and they will turn their upper body and/or head to look at the object's position

// Oh, and it works fine on GTA SA but sometimes the head moves a little fast.

// ----------------------------------------------------------------------------

let aimObjects = new Array(256);

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(localPlayer != null) {
		let centerCameraPos = getWorldFromScreenPosition(new Vec3(gta.width/2, gta.height/2, 0));
		let lookAtPos = getWorldFromScreenPosition(new Vec3(gta.width/2, gta.height/2, centerCameraPos.distance(localPlayer.position)+20));
		triggerNetworkEvent("v.p.lookat", lookAtPos.x, lookAtPos.y, lookAtPos.z);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.p.lookat", function(playerId, x, y, z) {
	let player = getElementFromId(playerId);
	if(player != null) {
		if(gta.game == GAME_GTA_SA) {
			player.lookAt(new Vec3(x, y, z), 1000);
		} else if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_VC) {
			let position = new Vec3(x, y, z);
			if(aimObjects[player.id] == null) {
				aimObjects[player.id] = createObject((gta.game == GAME_GTA_III)?1361:365, position);
				aimObjects[player.id].dimension = localPlayer.dimension + 1;
			}
			aimObjects[player.id].position = position;
			if(gta.game == GAME_GTA_III) {
				player.pointGunAt(aimObjects[player.id])
			}
		}
	}
});

// ----------------------------------------------------------------------------