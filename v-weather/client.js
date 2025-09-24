"use strict";

// ===========================================================================

let fallingSnow = false;
let groundSnow = false;
let forceSnow = false;
let heavySnow = false;
let snowConfetti = false;
let snowBumpiness = 1.0;

addNetworkHandler("v.snow", (fallingSnow, groundSnow, forceSnow, heavySnow, snowConfetti, snowBumpiness) => {
	if (snowing != fallingSnow) {
		snowing = fallingSnow;
	}

	if (snow.enabled != groundSnow) {
		snow.enabled = groundSnow;
	}

	if (snow.confetti != snowConfetti) {
		snow.confetti = snowConfetti;
	}

	if (snow.bumpiness != snowBumpiness) {
		snow.bumpiness = snowBumpiness;
	}

	if (heavySnow == true) {
		if (snowing) {
			snow.addFlakes();
		}
	} else {
		snow.clearFlakes();
	}

	if (snow.forced != forceSnow) {
		forceSnowing(forceSnow);
	}
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
	if (server.game < GAME_GTA_III || server.game > GAME_GTA_IV) {
		console.warn("Snow is not supported on this game! Resource stopping ...");
		event.preventDefault();
	}

	// Ask server for snow settings
	triggerNetworkEvent("v.snow");
});

// ===========================================================================