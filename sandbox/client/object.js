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

addCommandHandler("obj_pos", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("/obj_pos <abs/rel> <x> <y> <z>", syntaxMessageColour);
		return false;
	}
	
	let objects = getObjectsFromParams(splitParams[0]);
	let positionType = splitParams[1] || "rel";
	let positionX = splitParams[2] || 0.0;
	let positionY = splitParams[3] || 0.0;
	let positionZ = splitParams[4] || 0.0;
	
	let newPosition = new Vec3(positionX, positionY, positionZ);
	
	let outputText = "";
	
	if(objects.length == 0) {
		message("No objects found!", errorMessageColour);
		return false;
	}	
	
	if(newPosition == null) {
		message("The new position is invalid! One of the coordinates may be wrong!", errorMessageColour);
		return false;		
	}
	
	let isAbsolute = false;
	
	if(positionType == "abs" || positionType == "absolute") {
		isAbsolute = true;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.o.pos", objects, isAbsolute, newPosition.x, newPosition.y, newPosition.z);
	} else {
		objects.forEach(function(object) {
			let currentPosition = object.position;
			
			object.position = new Vec3(currentPosition.x+newPosition.x, currentPosition.y+newPosition.y, currentPosition.z+newPosition.z);
		});
	}

	if(objects.length > 1) {
		outputText = "set the position of " + String(objects.length) + " objects to " + String(newPosition.x) + ", " + String(newPosition.y) + ", " + String(newPosition.z) + " " + String((isAbsolute) ? "(absolute)" : "(relative)");
	} else {
		outputText = "set the position of " + getProperObjectPossessionText(splitParams[0]) + " to " + String(newPosition.x) + ", " + String(newPosition.y) + ", " + String(newPosition.z) + " " + String((isAbsolute) ? "(absolute)" : "(relative)");
	}
	
	outputSandboxMessage(outputText);

	return true;
});