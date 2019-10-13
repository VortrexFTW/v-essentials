"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("cv", function(cmdName, params) {
	if(!params || params === "") {
		message("Command usage is /cv <cvar name> <value>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let cvarName = splitParams[0];
	let cvarValue = splitParams[1];

	consoleCommand("/cvar " + cvarName + " " + cvarValue);
	message("CVar '" + cvarName + "' is now set to " + cvarValue, gameAnnounceColour);
	
	return true;	
});

// ----------------------------------------------------------------------------