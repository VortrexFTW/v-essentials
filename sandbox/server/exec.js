"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("se", function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		message("/se <code>", gameAnnounceColours[serverGame]);
		return false;
	}
	
	eval(String(params));
	message("Server code executed! (" + String(params) + ")", COLOUR_WHITE);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("sr", function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		message("/sr <code>", gameAnnounceColour[serverGame]);
		return false;
	}
	
	let returnVal = eval("(" + String(params) + ")");
	message("Server code executed! (" + String(params) + ")", COLOUR_WHITE);
	message("Returns: " + String(returnVal), COLOUR_WHITE);
	return true;
});

// ----------------------------------------------------------------------------