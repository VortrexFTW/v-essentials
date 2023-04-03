"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (game.game == GAME_GTA_III) {
		console.error("[Interiors] Interiors are not available on this game!");
		console.log("[Interiors] This resource will now stop.");
		thisResource.stop();
	}
});

// ----------------------------------------------------------------------------

let currentEntryPoint = 0
let entryPoints = [
	false,
	false,

	[ // GTA Vice City
		// Name									Position							Range 	Int		Angle		(Optional) Teleport (for places with blocked doors)
		["North Point Mall", new Vec3(379.66, 998.47, 18.76), 2.0, 4, 3.13, new Vec3(379.62, 1007.00, 19.22), 0.05],
		["North Point Mall", new Vec3(448.95, 999.73, 18.79), 2.0, 4, -3.10, new Vec3(448.24, 1007.20, 19.18), 0.05],
		["North Point Mall", new Vec3(352.85, 1124.52, 18.64), 2.0, 4, 1.61, new Vec3(361.72, 1124.93, 18.93), -1.58],
		["North Point Mall", new Vec3(379.68, 1253.29, 18.85), 2.0, 4, 0.04, new Vec3(379.79, 1246.83, 19.16), -3.06],
		["North Point Mall", new Vec3(448.17, 1253.27, 18.70), 2.0, 4, 0.00, new Vec3(448.60, 1246.43, 19.06), -3.11],
		["North Point Mall", new Vec3(475.04, 1124.36, 17.95), 2.0, 4, 1.65, new Vec3(468.24, 1123.66, 18.34), 1.54],
		["Malibu Club", new Vec3(489.83, -76.49, 11.48), 2.0, 17, 0.79, false, 0.00],
		["Washington Beach Police Station", new Vec3(396.38, -472.96, 12.34), 2.0, 12, 2.40, new Vec3(394.74, -475.02, 12.34), 2.46],
		["Ocean Beach Apartment", new Vec3(26.67, -1328.89, 13.00), 0.5, 11, -0.04, false, 0.00],
		["Ocean View Hotel", new Vec3(228.53, -1277.12, 12.07), 2.0, 1, 1.41, false, 0.00],
		["Biker Bar", new Vec3(-597.41, 651.84, 11.30), 1.0, 11, 0.15, new Vec3(-597.25, 650.79, 11.67), -3.03],
		["Vercetti Mansion Roof Entrance", new Vec3(-340.46, -573.75, 36.94), 1.0, 2, 1.50, false, 0.00],
		["Vercetti Mansion Basement Entrance", new Vec3(-353.67, -590.41, 11.60), 3.12, 2, 0.05, new Vec3(-353.86, -582.82, 11.60), -3.11],
		["Vercetti Mansion Main Entrance", new Vec3(-379.14, -551.65, 19.32), 1.5, 2, 0.10, new Vec3(-378.40, -557.84, 19.57), -3.11],
		["Ammunation Range and Training Area", new Vec3(-667.79, 1217.51, 11.10), 2.0, 10, 0.00, false, 0.00],
		["Bank", new Vec3(-894.52, -341.16, 13.45), 2.0, 3, -1.54, new Vec3(-901.16, -341.15, 13.38), 1.54],
		["Downtown Roof Building", new Vec3(-830.77, 1312.15, 11.54), 2.0, 0, -2.82, new Vec3(-811.81, 1354.21, 66.46), 1.55],
		["Washington Beach VCPD Roof", new Vec3(386.46, -473.03, 21.57), 0.5, 12, 0.93, new Vec3(379.35, -493.53, 12.33), 2.46],
		["Poll Position", new Vec3(97.53, -1472.06, 10.43), 0.5, 5, -2.43, new Vec3(95.68, -1469.00, 10.56), 0.51],
		["Rosenberg's Office", new Vec3(120.82, -827.98, 10.62), 0.5, 6, 0.87, new Vec3(137.12, -1370.16, 13.18), 1.19],
		["Bloodring Arena", new Vec3(-1080.49, 1331.16, 13.91), 3.0, 15, -1.54, new Vec3(-1443.58, 933.22, 262.39), -1.54],
		//["Downtown Police Station", 			new Vec3(-656.88, 762.48, 11.60), 	2.0, 	12, 	0.60,		false, 0.0],
		["Auntie Poulet's House", new Vec3(-962.72, 146.11, 9.395), 0.5, 12, -3.0, new Vec3(-962.83, 146.96, 9.395), 0.0],
	],

	[ // GTA San Andreas
		// Name									Position							Range 	Int		Angle		(Optional) Teleport (for places with blocked doors)
		//["North Point Mall", 					new Vec3(379.66, 998.47, 18.76), 	2.0, 	4, 		3.13,		new Vec3(379.62, 1007.00, 19.22), 0.05],
	],
];



// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function (deltaTime) {
	if (game.game != GAME_GTA_VC) {
		return false;
	}

	if (localPlayer == null) {
		return false;
	}

	if (currentEntryPoint >= 0) {
		if (localPlayer.position.distance(entryPoints[game.game][currentEntryPoint][1]) >= entryPoints[game.game][currentEntryPoint][2] + 2) {
			if (entryPoints[game.game][currentEntryPoint][5] != false) {
				if (localPlayer.position.distance(entryPoints[game.game][currentEntryPoint][5]) >= entryPoints[game.game][currentEntryPoint][2] + 2) {
					currentEntryPoint = -1;
				}
			} else {
				currentEntryPoint = -1;
			}
		}
	}

	for (let i in entryPoints[game.game]) {
		if (currentEntryPoint == -1) {
			if (localPlayer.position.distance(entryPoints[game.game][i][1]) <= entryPoints[game.game][i][2]) {
				// See if there's a second position (to teleport to)
				if (entryPoints[game.game][i][5] == false) {
					// No second position, just fade and set interior
					if (game.cameraInterior == entryPoints[game.game][i][3]) {
						game.setPlayerControl(false);
						localPlayer.invincible = true;
						game.fadeCamera(false, 0.5, toColour(0, 0, 0, 255));
						currentEntryPoint = i;
						setTimeout(switchInteriorAndFadeIn, 500, -1);
					} else {
						game.setPlayerControl(false);
						localPlayer.invincible = true;
						game.fadeCamera(false, 0.5, toColour(0, 0, 0, 255));
						currentEntryPoint = i;
						setTimeout(switchInteriorAndFadeIn, 500, entryPoints[game.game][i][3]);
						console.log(i);
					}
				} else {
					// A second position is provided. Fade, set interior and position
					game.setPlayerControl(false);
					localPlayer.invincible = true;
					game.fadeCamera(false, 0.5, toColour(0, 0, 0, 255));
					currentEntryPoint = i;
					setTimeout(switchInteriorAndFadeIn, 500, entryPoints[game.game][i][3], entryPoints[game.game][i][5], entryPoints[game.game][i][6]);
				}
			} else {
				// See if a second position is available
				if (entryPoints[game.game][i][5] != false) {
					// Yes, so check if in range
					if (localPlayer.position.distance(entryPoints[game.game][i][5]) <= entryPoints[game.game][i][2]) {
						game.setPlayerControl(false);
						localPlayer.invincible = true;
						game.fadeCamera(false, 0.5, toColour(0, 0, 0, 255));
						currentEntryPoint = i;
						setTimeout(switchInteriorAndFadeIn, 500, -1, entryPoints[game.game][i][1], entryPoints[game.game][i][2]);
					}
				}
			}
		}
	}
});

// ----------------------------------------------------------------------------

function switchInteriorAndFadeIn(interiorID, position = false, heading = false) {
	if (interiorID != -1) {
		localPlayer.interior = interiorID;
		game.cameraInterior = interiorID;
	} else {
		localPlayer.interior = 0;
		game.cameraInterior = 0;
	}

	if (position != false) {
		localPlayer.position = position;
	}

	if (heading != false) {
		localPlayer.heading = heading;
	}

	game.fadeCamera(true, 0.5, toColour(0, 0, 0, 255));
	game.setPlayerControl(true);
	localPlayer.invincible = false;
}

// ----------------------------------------------------------------------------