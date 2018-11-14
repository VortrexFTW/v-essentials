"use strict";

let gameAnnounceColour = [
	COLOUR_BLACK,					// Invalid
	COLOUR_SILVER,					// GTA III
	COLOUR_AQUA,					// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	COLOUR_SILVER,					// GTA IV
	COLOUR_SILVER					// GTA IV (EFLC)		
];

// ----------------------------------------------------------------------------

addNetworkHandler("vce", function(executerID, code) {
    eval(code);
    triggerNetworkEvent("vce.return", executerID);
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("vcr", function(executerID, code) {
    let returnVal = eval("(" + code + ")")
	console.log(returnVal);
    triggerNetworkEvent("vcr.return", executerID, returnVal);
	return true;
});

// ----------------------------------------------------------------------------