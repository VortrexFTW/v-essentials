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
		message("/train <track id> <track position> <amount of traincars>", gameAnnounceColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let trackID = (Number(splitParams[0]) || 0);
	let trackPosition = (Number(splitParams[1]) || 0);
	let trainCount = (Number(splitParams[2]) || 1);

	for(let i = 0; i < trainCount; i++) {
		let thisTrain = createVehicle(124);
		thisTrain.track = trackID;
		thisTrain.trackPosition = trackPosition + (i*singleTrainCarLength);		
		trains.push(thisTrain);
	}

	message("Train " + String(trains.length-1) + " added!", gameAnnounceColour);
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
	
	let trainID = (Number(params) || 0);

	if(typeof trains[trainID] == "undefined") {
		message("That train doesn't exist!", errorMessageColour);
		return false;
	}

	let trainPosition = trains[trainID].position;
	trainPosition.z += 2;
	localPlayer.position = trainPosition;
	
	message("Teleported you to train " + String(trainID), gameAnnounceColour);
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
		message("/train_speed <train id> <speed>", gameAnnounceColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let trainID = (Number(splitParams[0]) || 0);
	let speed = (Number(splitParams[1]) || 0);

	if(typeof trains[trainID] == "undefined") {
		message("That train doesn't exist!", errorMessageColour);
		return false;
	}

	trains[trainID].speed = speed;
	
	message("Changed train " + String(trainID) + " speed to " + speed, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------