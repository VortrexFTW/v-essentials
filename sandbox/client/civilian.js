"use strict";
//setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

let civGroup = [];
let civGroupFollow = [];
let civGroupFacing = [];
let civGroupThreat = [];
let civGroupFuckU = [];
let civGroupStay = [];
let civGroupCollision = [];
let civGroupGod = [];

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	let peds = getPeds();
	for(let i in peds) {
		if(peds[i].type == ELEMENT_CIVILIAN) {
			updateCivilianMovement(peds[i]);
		}
	}
});

// ----------------------------------------------------------------------------

function updateCivilianMovement(civilian) {
	if(!civiliansEnabled[gta.game]) {
		return false;			
	}
	
	if(civilianFollowEnabled) {
		if(civilian.getData("followingPlayer") != null) {
			let followingPlayer = getElementFromId(civilian.getData("followingPlayer"));
			if(civilian.isInVehicle) {
				if(followingPlayer.vehicle) {
					if(civilian.vehicle != followingPlayer.vehicle) {
						civilian.exitVehicle();
						civilian.enterVehicle(followingPlayer.vehicle, (followingPlayer.vehicle.getOccupant(0) == null) ? true : false);
					}
				} else {
					civilian.exitVehicle();
				}
			} else {
				if(followingPlayer.vehicle) {
					civilian.enterVehicle(followingPlayer.vehicle, (followingPlayer.vehicle.getOccupant(0) == null) ? true : false);
				}
			}
			
			if(getDistance(followingPlayer.position, civilian.position) <= civilianFollowStopDistance) {
				civilian.walkTo(vec3ToVec2(civilian.position));					
			} else {
				if(getDistance(followingPlayer.position, civilian.position) > civilianFollowRunDistance) {
					if(game.game == GAME_GTA_VC) {
						if(getDistance(followingPlayer.position, civilian.position) > civilianFollowSprintDistance) {
							civilian.sprintTo(vec3ToVec2(followingPlayer.position));
						} else {
							civilian.runTo(vec3ToVec2(followingPlayer.position));
						}
					} else {
						civilian.runTo(vec3ToVec2(followingPlayer.position));
					}
				} else {
					civilian.walkTo(vec3ToVec2(followingPlayer.position));
				}
			}
		}
	}
	
	if(civilianFacingEnabled) {
		if(civilian.getData("facingPlayer") != null) {
			let facingPlayer = getElementFromId(civilian.getData("facingPlayer"));
			civilian.heading = getHeadingFromPosToPos(facingPlayer.position, facingPlayer.position);
		}
	}
}

// ----------------------------------------------------------------------------

addCommandHandler("civ", function(cmdName, params) {
	//if(isConnected) {
		//if(!civiliansEnabled[gta.game]) {
		//	message("Civilians are disabled on this server!", errorMessageColour);
		//	return false;			
		//}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <skin id>", syntaxMessageColour);
		return false;
	}
	
	let skinId = (Number(params) || 0);
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	let heading = localPlayer.heading;
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.add", skinId, position.x, position.y, position.z, heading, true);
	} else {
		let tempCiv = createCivilian(skinId);

		if(!tempCiv) {
			message("The civilian could not be added!", errorMessageColour);
			return false;			
		}
		
		tempCiv.position = position;
		tempCiv.heading = heading;
		
		message("Civilian added!", gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civline", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <skin id> <amount> [gap]", syntaxMessageColour);
		return false;
	}
	
	let group = [ ];
	let splitParams = params.split(" ");
	
	let skinId = (Number(splitParams[0]) || 0);
	let amount = (Number(splitParams[1]) || 8);
	let gap = (Number(splitParams[2]) || 2);
	let tempCiv = null;
	
	if(isConnected) {
		for(let i=1;i<=amount;i++){
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i*gap);
			let heading = localPlayer.heading;
			triggerNetworkEvent("sb.c.add", skinId, position.x, position.y, position.z, heading, false);
		}
	} else {
		for(let i=1;i<=amount;i++) {
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i*gap);
			let heading = localPlayer.heading;			
			tempCiv = createCivilian(skinId);
			tempCiv.position = position;
			tempCiv.heading = position;
		}
	}

	message("Civilians added!", gameAnnounceColour);
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civgrid", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <skin id> <columns> <rows> [column gap] [row gap]", syntaxMessageColour);
		return false;
	}
	
	let group = [ ];
	let splitParams = params.split(" ");
	
	let skinId = (Number(splitParams[0]) || 0);
	let cols = (Number(splitParams[1]) || 4);
	let rows = (Number(splitParams[2]) || 2);
	let colGap = (Number(splitParams[3]) || 2);
	let rowGap = (Number(splitParams[4]) || 3);
	let tempCiv = null;
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.add.grid", skinId, cols, rows, colGap, rowGap);
	} else {
		for(let k=1;k<=cols;k++) {
			for(let i=1;i<=rows;i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading,k*rowGap), localPlayer.heading, i*colGap);
				let heading = localPlayer.heading;			
				tempCiv = createCivilian(skinId);
				tempCiv.position = position;
				tempCiv.heading = position;
			}
		}		
	}
	
	if(vehicles.length > 1) {
		message(String(vehicles.length) + " , gameAnnounceColour);
	} else {
		message(getProperVehiclePossessionText(splitParams[0]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex) + "'s siren is now " + String((!!sirenState) ? "on" : "off"), gameAnnounceColour);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_wander", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <wander path>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let wanderPath = Number(splitParams[1]) || 0;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.wander", civilians, wanderPath);	
	} else {
		for(let i in civilians){
			makeCivilianWander(civilians[i], wanderPath);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians will now wander on path " + String(wanderPath), gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " will now wander on path " + String(wanderPath), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_delete", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let stayState = Number(splitParams[1]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.del", civilians);
	} else {
		for(let i in civilians){
			deleteCivilian(civilians[i]);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians have been deleted.", gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " has been deleted " + String(wanderPath), gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_stay", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <state>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let stayState = Number(splitParams[1]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.stay", civilians, !!stayState);
	} else {
		for(let i in civilians){
			setCivilianStayInSamePlace(civilians[i], !!stayState);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians will " + String((!!stayState) ? "now" : "no longer") + " stay in the same place", gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " will " + String((!!stayState) ? "now" : "no longer") + " stay in the same place", gameAnnounceColour);
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_stamina", function(cmdName, params) {
	//if(gta.game == GAME_GTA_III) {
	//	message("Ped stamina does not work on GTA 3!", errorMessageColour);
	//	return false;
	//}
	
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <stamina>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let stamina = Number(splitParams[1]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.stamina", civilians, stamina);
	} else {
		for(let i in civilians){
			setCivilianStamina(civilians[i], stamina);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians's stamina has been set to " + String(stamina), gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " stamina has been set to " + String(stamina), gameAnnounceColour);
	}		
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_enterveh", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <vehicle> [driver 0/1]", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let driver = Number(splitParams[1]) || 1;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.enterveh", civilians, vehicles[0].id, !!driver);
	} else {
		for(let i in civilians){
			civilians[i].enterVehicle(vehicles[0], !!driver);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians will now enter " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex), gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + "  will now enter " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex), gameAnnounceColour);
	}		
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_lookatveh", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <vehicle>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let duration = Number(splitParams[1]) || 5000;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.lookat", civilians, vehicles[0].position.x, vehicles[0].position.y, vehicles[0].position.z, duration);
	} else {
		for(let i in civilians){
			civilians[i].lookAt(vehicles[0].position, duration);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians will now look at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex), gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " will now look at " + getProperVehiclePossessionText(splitParams[1]) + " " + getVehicleNameFromModelId(vehicles[0].modelIndex), gameAnnounceColour);
	}		
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_exitveh", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.exitveh", civilians);
	} else {
		for(let i in civilians){
			setCivilianStamina(civilians[i], stamina);
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians will now exit their vehicle", gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " will now exit their vehicle", gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_staminadur", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("Ped stamina does not work on GTA 3!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <duration>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let staminaDuration = Number(splitParams[1]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.stamina", civilians, staminaDuration);
	} else {
		for(let i in civilians){
			civilians[i].staminaDuration = staminaDuration;
		}
	}
	
	if(civilians.length > 1) {
		message(String(civilians.length) + " civilians will now exit their vehicle", gameAnnounceColour);
	} else {
		message(getProperCivilianPossessionText(splitParams[0]) + " " + getCivilianName(civilians[0].skin) + " will now exit their vehicle", gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_torsorot", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("Ped torso rotation does not work on GTA 3!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <rotation>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let rotation = Number(splitParams[1]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.torsorot", civilians, rotation);
	} else {
		for(let i in civilians){
			civilians[i].torsoRotation = rotation;
		}
	}
	
	message("The civilians(s) torso rotation is now " + String(rotation), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_walkstyle", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <rotation>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let walkStyle = Number(splitParams[1]) || 1;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.walkstyle", civilians, walkStyle);
	} else {
		for(let i in civilians){
			civilians[i].walkStyle = walkStyle;
		}
	}
	
	message("The civilians(s) walk style is now " + String(walkStyle), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_armour", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <rotation>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let armour = Number(splitParams[1]) || 100;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.armour", civilians, armour);
	} else {
		for(let i in civilians){
			civilians[i].armour = armour;
		}
	}
	
	message("The civilians(s) armour is now " + String(armour), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_warpinveh", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <vehicle>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let seatId = Number(splitParams[2]) || 0;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.warpintoveh", civilians, vehicles[0].id, seatId);
	} else {
		for(let i in civilians){
			civilians[i].warpIntoVehicle(civilians[i], vehicles[0], seatId);
		}
	}
	
	message("The civilians(s) have been warped into the specified vehicle(s) in seat " + seatId, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_syncer", function(cmdName, params) {	
	if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	} else {
		message("This command cannot be used offline!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <client>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let clientName = splitParams[1] || localClient.name;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.syncer", civilians, clientName);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_health", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <rotation>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let armour = Number(splitParams[1]) || 100;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.armour", civilians, armour);
	} else {
		for(let i in civilians){
			civilians[i].armour = armour;
		}
	}
	
	message("The civilians(s) health is now " + String(health), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_jump", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <distance>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.jump", civilians);
	} else {
		for(let i in civilians){
			civilians[i].jumping = true;
		}
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_walkfwd", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <distance>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.walkfwd", civilians, distance);
	} else {
		for(let i in civilians) {
			let position = getPosInFrontOfPos(civilians[i].position, civilians[i].heading, distance);
			makeCivilianWalkTo(civilians[i], position.x, position.y, position.z);
		}
	}
	
	message("The civilians(s) will now walk " + String(distance) + " meters forward", gameAnnounceColour);
	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("civ_runfwd", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <distance>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;
	
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.runfwd", civilians, distance);
	} else {
		for(let i in civilians) {
			let position = getPosInFrontOfPos(civilians[i].position, civilians[i].heading, distance);
			makeCivilianRunTo(civilians[i], position.x, position.y, position.z);
		}
	}
	
	message("The civilians(s) will now run " + String(distance) + " meters forward", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_sprintfwd", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("Civilian sprint is not supported in GTA 3!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <distance>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let distance = Number(splitParams[1]) || 10.0;
	
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.sprintfwd", civilians, distance);
	} else {
		for(let i in civilians) {
			let position = getPosInFrontOfPos(civilians[i].position, civilians[i].heading, distance);		
			makeCivilianSprintTo(civilians[i], position.x, position.y, position.z)
		}
	}
	
	message("The civilians(s) will now sprint " + String(distance) + " meters forward", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_follow", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <player name/id>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1];
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.follow", civilians, playerId);	
	} else {
		for(let i in civilians) {
			civilians[i].setData("followingPlayer", 0);
		}
	}
	message("The civilians(s) will now follow you", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_defendme", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerId = splitParams[1];
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.defend", civilians, playerId);
		}		
	} else {
		for(let i in civilians){
			civilians[i].setData("defendingPlayer", true);
		}
	}
	message("The civilians(s) will now defend you", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_gun", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <weapon> [ammo] [hold]", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let weaponId = Number(splitParams[1]) || 1;
	let ammo = Number(splitParams[2]) || 100;
	let holdGun = Number(splitParams[3]) || 1;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.gun", civilians[i].id, weaponId, ammo, !!holdGun);
		}
	} else {
		for(let i in civilians){
			civilians[i].giveWeapon(weaponId, ammo, !!holdGun);
		}
	}
	
	message("The civilians(s) have been given a " + String(weaponNames[game.game][weaponId]) + " with " + String(ammo) + " ammo", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_scale", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <scale>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let scaleFactor = Number(splitParams[1]) || 1;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.scale", civilians[i].id, scaleFactor);
		}
	} else {
		for(let i in civilians){
			scaleFactor = Number(scaleFactor);
			let civilianMatrix = civilian.matrix;
			civilianMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
			let civilianPosition = civilian.position;
			civilian.matrix = civilianMatrix;
			civilian.position = civilianPosition;
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_stats", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civ group> <stat>", syntaxMessageColour);
		return false;
	}	
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let statName = splitParams[1] || "player";
	let statId = STAT_PLAYER;
	let statInfo = "normal people";
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}	
	
	switch(statName.toLowerCase()) {
		case "cop":
			statId = STAT_COP;
			statInfo = "cops";
			break;
			
		case "medic":
			statId = STAT_MEDIC;
			statInfo = "paramedics";
			break;	

		case "fireman":
			statId = STAT_MEDIC;
			statInfo = "firefighters";
			break;		

		case "gang1":
			statId = STAT_GANG1;
			statInfo = "gang members";
			break;		
			
		case "gang2":
			statId = STAT_GANG2;
			statInfo = "gang members";
			break;		
			
		case "gang3":
			statId = STAT_GANG3;
			statInfo = "gang members";
			break;		
			
		case "gang4":
			statId = STAT_GANG4;
			statInfo = "gang members";
			break;		
			
		case "gang5":
			statId = STAT_GANG5;
			statInfo = "gang members";
			break;		
			
		case "gang6":
			statId = STAT_GANG6;
			statInfo = "gang members";
			break;		
			
		case "gang7":
			statId = STAT_GANG7;
			statInfo = "gang members";
			break;		
			
		case "mstreet":
			statId = STAT_STREET_GUY;
			statInfo = "street men";
			break;		
			
		case "msuit":
			statId = STAT_SUIT_GUY;
			statInfo = "business men";
			break;		
			
		case "msensible":
			statId = STAT_SENSIBLE_GUY;
			statInfo = "sensible men";
			break;		
			
		case "mgeek":
			statId = STAT_GEEK_GUY;
			statInfo = "geeky men";
			break;		
			
		case "mold":
			statId = STAT_OLD_GUY;
			statInfo = "old men";
			break;		
			
		case "mtough":
			statId = STAT_TOUGH_GUY;
			statInfo = "tough men";
			break;		
			
		case "fstreet":
			statId = STAT_STREET_GIRL;
			statInfo = "street women";
			break;		
			
		case "fsuit":
			statId = STAT_SUIT_GIRL;
			statInfo = "business women";
			break;		
			
		case "fsensible":
			statId = STAT_SENSIBLE_GIRL;
			statInfo = "sensible women";
			break;		
			
		case "fgeek":
			statId = STAT_GEEK_GIRL;
			statInfo = "geeky women";
			break;		
			
		case "fold":
			statId = STAT_OLD_GIRL;
			statInfo = "old women";
			break;		
			
		case "ftough":
			statId = STAT_TOUGH_GIRL;
			statInfo = "tough women";
			break;		
			
		case "mtramp":
			statId = STAT_TRAMP_MALE;
			statInfo = "male tramps";
			break;		
			
		case "ftramp":
			statId = STAT_TRAMP_FEMALE;
			statInfo = "female tramps";
			break;		
			
		case "tourist":
			statId = STAT_TOURIST;
			statInfo = "tourists";
			break;		
			
		case "hooker":
			statId = STAT_PROSTITUTE;
			statInfo = "hookers";
			break;		
			
		case "busker":
			statId = STAT_BUSKER;
			statInfo = "buskers";
			break;		
			
		case "taxidriver":
			statId = STAT_TAXIdRIVER;
			statInfo = "taxi drivers";
			break;		
			
		case "psycho":
			statId = STAT_PSYCHO;
			statInfo = "psychos";
			break;		
			
		case "steward":
			statId = STAT_STEWARD;
			statInfo = "stewards";
			break;		
			
		case "sportsfan":
			statId = STAT_SPORTSFAN;
			statInfo = "sports fans";
			break;		
			
		case "shopper":
			statId = STAT_SHOPPER;
			statInfo = "shoppers";
			break;		
			
		case "oldshopper":
			statId = STAT_OLDSHOPPER;		
			statInfo = "old shoppers";			
			break;		
			
		default:
			statId = STAT_PLAYER;
			statInfo = "normal people";
			break;	
	}	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.stats", civilians, statId);
	} else {
		for(let i in civilians){
			civilians[i].setPedStats(civilians[i], statId);
		}
	}	
	
	message("The civilians(s) will now act like " + statInfo, client, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_nogun", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.nogun", civilians);	
	} else {
		for(let i in civilians){
			civilians[i].clearWeapons();
		}
	}
	message("The civilians(s) weapons have been removed", client, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_god", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <state 0/1>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let godMode = Number(splitParams[1]) || 1;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.god", civilians, !!godMode);
	} else {
		for(let i in civilians){
			civilians[i].invincible = !!godMode;
			civilians[i].setProofs(!!godMode, !!godMode, !!godMode, !!godMode, !!godMode);
		}
	}
	message("The civilians(s) are " + String((!!godMode == 1) ? "now" : "no longer") + " invincible", client, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_crouch", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let crouchState = Number(splitParams[1]) || 0;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.crouch", civilians, !!crouchState);
	} else {
		for(let i in civilians){
			civilians[i].duck();
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_threat", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let threatText = splitParams[1] || "p1";
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	var threatId = THREAT_PLAYER1;
	var threatInfo = "you";
	
	switch(threatText.toLowerCase()) {
		case "cop":
			threatId = THREAT_COP;
			threatInfo = "cops";
			break;
		
		case "p1":
			threatId = THREAT_PLAYER1;
			threatInfo = "cops";
			break;
			
		case "p2":
			threatId = THREAT_PLAYER2;
			threatInfo = "you";
			break;

		case "p3":
			threatId = THREAT_PLAYER3;
			threatInfo = "you";
			break;

		case "p4":
			threatId = THREAT_PLAYER4;
			threatInfo = "you";
			break;			
			
		case "male":
			threatId = THREAT_CIVMALE;
			threatInfo = "male civs";
			break;

		case "female":
			threatId = THREAT_CIVFEMALE;
			threatInfo = "female civs";
			break;	

		case "mafia":
			threatId = THREAT_GANG_MAFIA;
			threatInfo = "mafia members";
			break;	
			
		case "triad":
			threatId = THREAT_GANG_TRIAD;
			threatInfo = "triads";
			break;	
			
		case "diablo":
			threatId = THREAT_GANG_DIABLO;
			threatInfo = "diablo thugs";
			break;	
			
		case "yakuza":
			threatId = THREAT_GANG_YAKUZA;
			threatInfo = "yakuza members";
			break;		

		case "yardie":
			threatId = THREAT_GANG_YARDIE;
			threatInfo = "yardies";
			break;	

		case "cartel":
			threatId = THREAT_GANG_CARTEL;
			threatInfo = "cartel members";
			break;

		case "hood":
			threatId = THREAT_HOOD;
			threatInfo = "street gangs";
			break;

		case "medic":
			threatId = THREAT_EMERGENCY;
			threatInfo = "medics";
			break;	
			
		case "hooker":
			threatId = THREAT_PROSTITUTE;
			threatInfo = "hookers";
			break;	
			
		case "gun":
			threatId = THREAT_GUN;
			threatInfo = "anybody who shoots a gun";
			break;	
			
		case "copcar":
			threatId = THREAT_COPCAR;
			threatInfo = "police cars";			
			break;				
		
		case "fastcar":
			threatId = THREAT_FASTCAR;	
			threatInfo = "fast cars";			
			break;	
			
		case "fireman":
			threatId = THREAT_FIREMAN;	
			threatInfo = "firefighters";			
			break;	

		case "dead":
			threatId = THREAT_DEADPEDS;
			threatInfo = "dead people";			
			break;	

		default:
			threatId = THREAT_PLAYER1;
			threatInfo = "you";			
			break;	
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <threat name>", syntaxMessageColour);
		return false;
	}
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.threat.add", civilians, threatId);
	} else {
		for(let i in civilians){
			civilians[i].setThreatSearch(threatId);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_nothreat", function(cmdName, params) {
	//if(isConnected) {
	//	if(!civiliansEnabled[gta.game]) {
	//		message("Civilians are disabled on this server!", errorMessageColour);
	//		return false;			
	//	}
	//}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.threat.clr", civilians);	
	} else {
		for(let i in civilians){
			civilians[i].clearThreatSearch();
			civilians[i].heedThreats = false;
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_aimatme", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " " + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.aimat", civilians, localPlayer.id);
	} else {
		for(let i in civilians){
			civilians[i].pointGunAt(localPlayer);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_aimatciv", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <player>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let civilians2 = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(civilians2.length == 0) {
		message("No target civilians found!", errorMessageColour);
		return false;
	}
	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.aimat", civilians, civilians2[0].id);		
	} else {
		for(let i in civilians) {
			civilians[i].pointGunAt(civilians2[0]);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_aimatveh", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian> <vehicle>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(vehicles.length == 0) {
		message("No target civilians found!", errorMessageColour);
		return false;
	}
	
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.aimat", civilians, vehicles[0].id);	
	} else {
		for(let i in civilians) {
			civilians[i].pointGunAt(vehicles[0]);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_aimatplr", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerName = splitParams[1];
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.aimatplr", civilians, playerName);
	} else {
		message("This command can't be used offline!", errorMessageColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_hailtaxi", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.hailtaxi", civilians);
	} else {
		for(let i in civilians){
			civilians[i].hailTaxi();
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_resurrect", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.resurrect", civilians);
	} else {
		for(let i in civilians){
			civilians[i].resurrect();
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_coll", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("/" + String(cmdName) + " <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let collisionState = Number(splitParams[1]) || 0;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.coll", civilians, !!collisionsEnabled);	
	} else {
		for(let i in civilians){
			civilians[i].collisionsEnabled = (collisionsEnabled == 1) ? true : false;
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

function getCiviliansFromParams(params) {	
	let civilians = getCivilians();
	
	switch(params.toLowerCase()) {
		case "last":
		case "new":
		case "newest":
		case "l":
			return [civilians[civilians.length-1]];

		case "n":
		case "c":
		case "closest":
		case "nearest":
			return [getClosestCivilian(localPlayer.position)];
			
		case "r":
		case "range":
		case "near":
		case "within":
			return getCiviliansInRange(localPlayer.position, 20.0);		

		case "a":
		case "all":
			return getCivilians();
			
		case "r":
		case "random":
		case "any":
			return [getRandomCivilian()];						
			
		default:
			if(typeof civilians[Number(params)] != "undefined") {
				return [civilians[Number(params)]];
			}
			return [];
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function getCivilians() {
	let peds = getPeds();
	let civilians = [];
	for(let i in peds) {
		if(peds[i].isType(ELEMENT_CIVILIAN) && !peds[i].isType(ELEMENT_PLAYER)) {
			civilians.push(peds[i]);
		}
	}
	
	return civilians;
}

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.wander", function(civilianId, wanderPath) {
	makeCivilianWander(getElementFromId(civilianId), wanderPath);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function(civilianId, stayState) {
	setCivilianStayInSamePlace(getElementFromId(civilianId), stayState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function(civilianId, x, y, z) {
	makeCivilianWalkTo(getElementFromId(civilianId), x, y, z)
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function(civilianId, x, y, z) {
	makeCivilianRunTo(getElementFromId(civilianId), x, y, z)
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function(civilianId, crouchState) {
	getElementFromId(civilianId).crouching = crouchState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function(civilianId, threatId) {
	getElementFromId(civilianId).setThreatSearch(threatId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function(civilianId, heedThreatState) {
	getElementFromId(civilianId).heedThreats = heedThreatState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function(civilianId, pedStat) {
	getElementFromId(civilianId).setPedStats(pedStat);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function(civilianId, skinId) {
	getElementFromId(civilianId).skin = skinId;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function(civilianId, x, y, z) {
	getElementFromId(civilianId).position = new Vec3(x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.lookat", function(civilianId, x, y, z, duration) {
	getElementFromId(civilianId).lookat(new Vec3(x, y, z), duration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function(civilianId, elementId) {
	getElementFromId(civilianId).pointGunAt(getElementFromId(elementId));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function(civilianId, walkStyle) {
	getElementFromId(civilianId).walkStyle = walkStyle;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function(civilianId, scaleFactor) {
	let civilian = getElementFromId(civilianId);
	
	scaleFactor = Number(scaleFactor);
	let civilianMatrix = civilian.matrix;
	civilianMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
	let civilianPosition = civilian.position;
	civilian.matrix = civilianMatrix;
	civilian.position = civilianPosition;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function(civilianId, vehicleId, seatId) {
	getElementFromId(civilianId).warpIntoVehicle(getElementFromId(vehicleId), seatId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function(civilianId, vehicleId, driver) {
	getElementFromId(civilianId).enterVehicle(getElementFromId(vehicleId), driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function(civilianId) {
	getElementFromId(civilianId).exitVehicle();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function(civilianId, godMode) {
	getElementFromId(civilianId).invincible = godMode;
	getElementFromId(civilianId).setProofs(godMode, godMode, godMode, godMode, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function(civilianId) {
	getElementFromId(civilianId).hailTaxi();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function(civilianId, weaponId, ammo, holdGun) {
	getElementFromId(civilianId).giveWeapon(weaponId, ammo, holdGun);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function(civilianId) {
	getElementFromId(civilianId).resurrect();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function(civilianId) {
	getElementFromId(civilianId).jumping = true;
});

// ----------------------------------------------------------------------------

function makeCivilianWander(civilian, wanderPath) {
	civilian.setWanderPath(wanderPath);
}

// ----------------------------------------------------------------------------

function setCivilianStayInSamePlace(civilian, stayState) {
	civilian.stayInSamePlace = stayState;
}

// ----------------------------------------------------------------------------

function makeCivilianWalkTo(civilian, x, y, z) {
	let position = new Vec2(x, y);	
	civilian.walkTo(position);
}

// ----------------------------------------------------------------------------

function makeCivilianRunTo(civilian, x, y, z) {
	let position = new Vec2(x, y);
	civilian.runTo(position);
}


