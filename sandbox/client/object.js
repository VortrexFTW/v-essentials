"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("obj", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/obj <model id>", syntaxMessageColour);
		return false;
	}
	
	let modelID = Number(params) || 0;
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	
	if(!isValidObjectModel(modelID)) {
		message("Invalid object model!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.o.add", modelID, position.x, position.y, position.z);
		return true;
	} else {
		let tempObject = createObject(modelID);
		tempObject.position = position;
		
		message("Object added!", gameAnnounceColour);			
	}

	return true;
});

// ----------------------------------------------------------------------------

