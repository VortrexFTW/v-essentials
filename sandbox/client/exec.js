"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("ce", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/ce <code>", gameAnnounceColour);
		return false;
	}
	
	eval(String(params));
	message("Client code executed! (" + String(params) + ")", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("cr", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/cr <code>", gameAnnounceColour);
		return false;
	}
	
	let returnVal = eval("(" + String(params) + ")");
	message("Client code executed! (" + String(params) + ")", gameAnnounceColour);
	message("Returns: " + String(returnVal), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------