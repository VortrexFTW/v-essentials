"use strict";

let spawnProtectPosition = new Vec3(0.0, 0.0, 0.0);
let spawnProtectRadius = 100.0;

// ----------------------------------------------------------------------------

if (gta.game == GAME_GTA_III) {
	spawnProtectPosition = new Vec3(139.54, -903.00, 26.16);
	spawnProtectRadius = 100.0;
} else if (gta.game == GAME_GTA_VC) {
	spawnProtectPosition = new Vec3(-379.16, -535.27, 17.28);
	spawnProtectRadius = 100.0;
} else if (gta.game == GAME_GTA_SA) {
	spawnScreenPosition = new Vec3(2495.03, -1685.66, 13.51);
	spawnProtectRadius = 100.0;
} else if (gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	spawnProtectPosition = new Vec3(-1166.20, 1873.51, 6.648);
	spawnProtectRadius = 100.0;
} else if (game.game == 10) { // Will be changed to GAME_MAFIA_ONE after next GTAC update
	spawnProtectPosition = new Vec3(-1981.51, -4.66, 29.37);
	spawnProtectRadius = 100.0;
}

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function (event, deltaTime) {
	if (localPlayer == null) {
		return false;
	}

	if (game.game == GAME_GTA_IV || game.game == GAME_GTA_IV_EFLC) {
		if (game.ivGamemode == 8) {
			if (localPlayer.position.distance(spawnProtectPosition) <= spawnProtectRadius) {
				//localPlayer.invincible = true;
				natives.setCharProofs(localPlayer, true, true, true, true, true);
			} else {
				//localPlayer.invincible = false;
				natives.setCharProofs(localPlayer, false, false, false, false, false);
			}
		}
	} else {
		if (localPlayer.position.distance(spawnProtectPosition) <= spawnProtectRadius) {
			localPlayer.invincible = true;
		} else {
			localPlayer.invincible = false;
		}
	}
});

// ----------------------------------------------------------------------------