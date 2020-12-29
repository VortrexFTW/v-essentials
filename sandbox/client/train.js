"use strict";

// ----------------------------------------------------------------------------

let trains = [];
let singleTrainCarLength = 20;

// ----------------------------------------------------------------------------

addCommandHandler("train", function(cmdName, params) {
	if(game.game == GAME_GTA_VC) {
		message("Trains don't exist in Vice City!", errorMessageColour);
		return false;
	}
	
	if(isConnected && !customTrainsEnabled) {
		message("Custom trains are disabled on this server!", errorMessageColour);
		return true;
	}
	
	if(!params || params === "") {
		message("/train <track id> <track position> <amount of train cars>", gameAnnounceColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let trackId = (Number(splitParams[0]) || 0);
	let trackPosition = (Number(splitParams[1]) || 0);
	let trainCarCount = (Number(splitParams[2]) || 1);

	let fullTrain = [];

	for(let i = 0; i < trainCarCount; i++) {
		fullTrain.push({trackId: trackId, trackPosition: trackPosition + (i*singleTrainCarLength)});
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.t.add", trackId, trackPosition, fullTrain);
	} else {
		fullTrain.forEach(function(trainCarData) {
			let trainCar = gta.createVehicle(124);
			trainCar.track = trainCarData.trackId;
			trainCar.trackPosition = trainCarData.trackPosition;
		});
	}
	
	let modelName = getVehicleNameFromModelId(modelId);
	let outputText = "spawned a train with " + String(trainCarCount) + " cars.";
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("train_goto", function(cmdName, params) {
	if(game.game == GAME_GTA_VC) {
		message("Trains don't exist in Vice City!", errorMessageColour);
		return false;
	}
	
	if(isConnected && !customTrainsEnabled) {
		message("Custom trains are disabled on this server!", errorMessageColour);
		return true;
	}	
	
	if(!params || params === "") {
		message("/train_goto <train id>", gameAnnounceColour);
		return false;
	}
	
	let trainId = (Number(params) || 0);

	if(typeof getElementsByType(ELEMENT_TRAIN)[trainId] == "undefined") {
		message("That train doesn't exist!", errorMessageColour);
		return false;
	}

	let trainPosition = getElementsByType(ELEMENT_TRAIN)[trainId].position;
	trainPosition.z += 2;
	localPlayer.position = trainPosition;
	
	message("Teleported you to train " + String(trainId), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("train_speed", function(cmdName, params) {
	if(game.game == GAME_GTA_VC) {
		message("Trains don't exist in Vice City!", errorMessageColour);
		return false;
	}
	
	if(isConnected && !customTrainsEnabled) {
		message("Custom trains are disabled on this server!", errorMessageColour);
		return true;
	}	
	
	if(!params || params === "") {
		message("/train_speed <train> <speed>", gameAnnounceColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let trainId = (Number(splitParams[0]) || 0);
	let speed = (Number(splitParams[1]) || 0);

	if(typeof getElementsByType(ELEMENT_TRAIN)[trainId] == "undefined") {
		message("That train doesn't exist!", errorMessageColour);
		return false;
	}

	getElementsByType(ELEMENT_TRAIN)[trainId].speed = speed;
	
	let outputText = "set train " + String(trainCarCount) + "'s speed to " + String(speed);
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("train_speed", function(cmdName, params) {
	if(game.game == GAME_GTA_VC) {
		message("Trains don't exist in Vice City!", errorMessageColour);
		return false;
	}
	
	if(isConnected && !customTrainsEnabled) {
		message("Custom trains are disabled on this server!", errorMessageColour);
		return true;
	}	
	
	if(!params || params === "") {
		message("/train_speed <train> <speed>", gameAnnounceColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let trainId = (Number(splitParams[0]) || 0);
	let trackId = (Number(splitParams[1]) || 0);

	if(typeof getElementsByType(ELEMENT_TRAIN)[trainId] == "undefined") {
		message("That train doesn't exist!", errorMessageColour);
		return false;
	}

	getElementsByType(ELEMENT_TRAIN)[trainId].track = trackId;
	
	let outputText = "set train " + String(trainCarCount) + "'s track to ID " + String(trackId);
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("train_derail", function(cmdName, params) {
	if(game.game == GAME_GTA_VC) {
		message("Trains don't exist in Vice City!", errorMessageColour);
		return false;
	}
	
	if(isConnected && !customTrainsEnabled) {
		message("Custom trains are disabled on this server!", errorMessageColour);
		return true;
	}	
	
	if(!params || params === "") {
		message("/train_derail <train> <speed>", gameAnnounceColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let trainId = (Number(splitParams[0]) || 0);
	let trackId = (Number(splitParams[1]) || 0);

	if(typeof getElementsByType(ELEMENT_TRAIN)[trainId] == "undefined") {
		message("That train doesn't exist!", errorMessageColour);
		return false;
	}

	getElementsByType(ELEMENT_TRAIN)[trainId].derailed;
	
	let outputText = "derailed train " + String(trainCarCount);
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------