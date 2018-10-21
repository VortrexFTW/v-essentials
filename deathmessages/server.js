"use strict";

// ----------------------------------------------------------------------------

let deathMessageColour = toColour(237, 67, 55, 255);

// ----------------------------------------------------------------------------

// This code will work for any named ped...
addEventHandler("OnPedWasted", function(event, ped, attacker, weapon, pedPiece) {
	if (ped.name) { // && ped.isType(ELEMENT_PLAYER) <<-- add this bit to the if to only announce player deaths
		if (attacker) {
			if (attacker.name != "") {
				message(attacker.name + " killed " + ped.name + ".", deathMessageColour);
			} else {
				message("Something killed " + ped.name + ".", deathMessageColour);
			}
		} else
			message(ped.name + " died.", deathMessageColour);
	}
});
