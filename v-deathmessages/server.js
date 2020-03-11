"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let deathMessageColour = toColour(237, 67, 55, 255);

// ----------------------------------------------------------------------------

// This code will work for any named ped...
addEventHandler("OnPedWasted", function(event, ped, attacker, weapon, pedPiece) {
	if(ped.isType(ELEMENT_PLAYER)) {
		if(attacker) {
			if(attacker.name != "") {
				message(attacker.name + " killed " + ped.name + ".", deathMessageColour);
			} else {
				message("Something killed " + ped.name + ".", deathMessageColour);
			}
		} else {
			message(ped.name + " died.", deathMessageColour);
		}
	}
});
