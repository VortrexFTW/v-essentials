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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ <skin id>", syntaxMessageColour);
		return false;
	}
	
	let skinID = (Number(params) || 0);
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 10.0);
	let heading = localPlayer.heading;
	
	if(isConnected) {
		triggerNetworkEvent("sb.c.add", skinID, position.x, position.y, position.z, heading, true);
	} else {
		let tempCiv = createCivilian(skinID);

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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civline <skin id> <amount> [gap]", syntaxMessageColour);
		return false;
	}
	
	let group = [ ];
	let splitParams = params.split(" ");
	
	let skinID = (Number(splitParams[0]) || 0);
	let amount = (Number(splitParams[1]) || 8);
	let gap = (Number(splitParams[2]) || 2);
	let tempCiv = null;
	
	if(isConnected) {
		for(let i=1;i<=amount;i++){
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i*gap);
			let heading = localPlayer.heading;
			triggerNetworkEvent("sb.c.add", skinID, position.x, position.y, position.z, heading, false);
		}
	} else {
		for(let i=1;i<=amount;i++) {
			let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, i*gap);
			let heading = localPlayer.heading;			
			tempCiv = createCivilian(skinID);
			tempCiv.position = position;
			tempCiv.heading = position;
		}
	}

	message("Civilians added!", gameAnnounceColour);
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civgrid", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civgrid <skin id> <columns> <rows> [column gap] [row gap]", syntaxMessageColour);
		return false;
	}
	
	let group = [ ];
	let splitParams = params.split(" ");
	
	let skinID = (Number(splitParams[0]) || 0);
	let cols = (Number(splitParams[1]) || 4);
	let rows = (Number(splitParams[2]) || 2);
	let colGap = (Number(splitParams[3]) || 2);
	let rowGap = (Number(splitParams[4]) || 3);
	let tempCiv = null;
	
	if(isConnected) {
		for(let k=1;k<=cols;k++) {
			for(let i=1;i<=rows;i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading,k*rowGap), localPlayer.heading, i*colGap);
				let heading = localPlayer.heading;
				triggerNetworkEvent("sb.c.add", skinID, position.x, position.y, position.z, heading, false);
			}
		}
	} else {
		for(let k=1;k<=cols;k++) {
			for(let i=1;i<=rows;i++) {
				let position = getPosInFrontOfPos(getPosToRightOfPos(localPlayer.position, localPlayer.heading,k*rowGap), localPlayer.heading, i*colGap);
				let heading = localPlayer.heading;			
				tempCiv = createCivilian(skinID);
				tempCiv.position = position;
				tempCiv.heading = position;
			}
		}		
	}
	
	message("Civilian grid added!", gameAnnounceColour);
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_wander", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_wander <civilian> <wander path>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.wander", civilians[i].id, wanderPath);
		}		
		
	} else {
		for(let i in civilians){
			makeCivilianWander(civilians[i], wanderPath);
		}
	}
	
	message("The civilians(s) will wander on path " + String(wanderPath), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_delete", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_delete <civilian>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.del", civilians[i].id);
		}		
		
	} else {
		for(let i in civilians){
			deleteCivilian(civilians[i]);
		}
	}
	
	message("The civilians(s) have been deleted", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_stay", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_stay <civilian> <state>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.stay", civilians[i].id, (stayState == 1) ? true : false);
		}		
		
	} else {
		for(let i in civilians){
			setCivilianStayInSamePlace(civilians[i], (stayState == 1) ? true : false);
		}
	}
	
	message("The civilians(s) will " + String((stayState) ? "now" : "no longer") + " stay in the same place", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_stamina", function(cmdName, params) {
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
		message("Syntax: /civ_stamina <civilian> <stamina>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.stamina", civilians[i].id, stamina);
		}		
		
	} else {
		for(let i in civilians){
			setCivilianStamina(civilians[i], stamina);
		}
	}
	
	message("The civilians(s) stamina is now " + String(stamina), gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_enterveh", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_enterveh <civilian> <vehicle> [driver 0/1]", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.enterveh", civilians[i].id, vehicles[0].id, (driver == 1) ? true : false);
		}		
		
	} else {
		for(let i in civilians){
			civilians[i].enterVehicle(vehicles[0]);
		}
	}
	
	message("The civilians(s) will now enter the specified vehicle(s)", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_lookatveh", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_lookatveh <civilian> <vehicle>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.lookat", civilians[i].id, vehicles[0].position.x, vehicles[0].position.y, vehicles[0].position.z, duration);
		}		
		
	} else {
		for(let i in civilians){
			civilians[i].lookAt(vehicles[0].position, duration);
		}
	}
	
	message("The civilians(s) will now look at the vehicle.", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_exitveh", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_exitveh <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.exitveh", civilians[i].id);
		}		
		
	} else {
		for(let i in civilians){
			setCivilianStamina(civilians[i], stamina);
		}
	}
	
	message("The civilians(s) will now exit their vehicle", gameAnnounceColour);
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
		message("Syntax: /civ_staminadur <civilian> <duration>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.stamina", civilians[i].id, staminaDuration);
		}		
		
	} else {
		for(let i in civilians){
			civilians[i].staminaDuration = staminaDuration;
		}
	}
	
	message("The civilians(s) stamina duration is now " + String(staminaDuration), gameAnnounceColour);
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
		message("Syntax: /civ_torsorot <civilian> <rotation>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.torsorot", civilians[i].id, rotation);
		}		
		
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_walkstyle <civilian> <rotation>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.walkstyle", civilians[i].id, walkStyle);
		}		
		
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_armour <civilian> <rotation>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.armour", civilians[i].id, armour);
		}		
		
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_warpinveh <civilian> <vehicle>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let vehicles = getVehiclesFromParams(splitParams[1]);
	let seatID = Number(splitParams[2]) || 0;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	if(isConnected) {
		for(let i in civilians){
			triggerNetworkEvent("sb.c.warpintoveh", civilians[i].id, vehicles[0].id, seatID);
		}		
		
	} else {
		for(let i in civilians){
			civilians[i].warpIntoVehicle(civilians[i], vehicles[0], seatID);
		}
	}
	
	message("The civilians(s) have been warped into the specified vehicle(s) in seat " + seatID, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_syncer", function(cmdName, params) {	
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	} else {
		message("This command cannot be used offline!", errorMessageColour);
		return false;
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_syncer <civilian> <client>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.syncer", civilians[i].id, clientName);
		}		
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_health", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_health <civilian> <rotation>", syntaxMessageColour);
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
		for(let i in civilians){
			triggerNetworkEvent("sb.c.armour", civilians[i].id, armour);
		}		
		
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_jump <civilian> <distance>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.jump", civilians[i].id);
		}		
	} else {
		for(let i in civilians){
			civilians[i].jumping = true;
		}
	}	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_walkfwd", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_walkfwd <civilian> <distance>", syntaxMessageColour);
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
		for(let i in civilians) {
			let position = getPosInFrontOfPos(civilians[i].position, civilians[i].heading, distance);
			triggerNetworkEvent("sb.c.walkto", civilians[i].id, position.x, position.y, position.z);
		}		
		
	} else {
		for(let i in civilians){
			makeCivilianWalkTo(civilians[i], x, y, z)
		}
	}
	
	message("The civilians(s) will now walk " + String(distance) + " meters forward", gameAnnounceColour);
	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("civ_runfwd", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_runfwd <civilian> <distance>", syntaxMessageColour);
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
		for(let i in civilians) {
			let position = getPosInFrontOfPos(civilians[i].position, civilians[i].heading, distance);
			triggerNetworkEvent("sb.c.runto", civilians[i].id, position.x, position.y, position.z);
		}		
	} else {
		for(let i in civilians){
			makeCivilianRunTo(civilians[i], x, y, z)
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
		message("Syntax: /civ_runfwd <civilian> <distance>", syntaxMessageColour);
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
		for(let i in civilians) {
			let position = getPosInFrontOfPos(civilians[i].position, civilians[i].heading, distance);
			triggerNetworkEvent("sb.c.sprintto", civilians[i].id, position.x, position.y, position.z);
		}		
	} else {
		for(let i in civilians){
			makeCivilianRunTo(civilians[i], x, y, z)
		}
	}
	
	message("The civilians(s) will now sprint " + String(distance) + " meters forward", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_followme", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_followme <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerID = splitParams[1];
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.followme", civilians[i].id);
		}		
	} else {
		for(let i in civilians){
			civilians[i].setData("followingPlayer", true);
		}
	}
	message("The civilians(s) will now follow you", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_defendme", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_defendme <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let playerID = splitParams[1];
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.defendme", civilians[i].id);
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_gun <civilian> <weapon> [ammo] [hold]", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let weaponID = Number(splitParams[1]) || 1;
	let ammo = Number(splitParams[2]) || 100;
	let holdGun = Number(splitParams[3]) || 1;
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.gun", civilians[i].id, weaponID, ammo, !!holdGun);
		}
	} else {
		for(let i in civilians){
			civilians[i].giveWeapon(weaponID, ammo, !!holdGun);
		}
	}
	
	message("The civilians(s) have been given a " + String(weaponNames[game.game][weaponID]) + " with " + String(ammo) + " ammo", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_scale", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_scale <civilian> <scale>", syntaxMessageColour);
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_stats <civ group> <stat>", syntaxMessageColour);
		return false;
	}	
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let statName = splitParams[1] || "player";
	let statID = STAT_PLAYER;
	let statInfo = "normal people";
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}	
	
	switch(statName.toLowerCase()) {
		case "cop":
			statID = STAT_COP;
			statInfo = "cops";
			break;
			
		case "medic":
			statID = STAT_MEDIC;
			statInfo = "paramedics";
			break;	

		case "fireman":
			statID = STAT_MEDIC;
			statInfo = "firefighters";
			break;		

		case "gang1":
			statID = STAT_GANG1;
			statInfo = "gang members";
			break;		
			
		case "gang2":
			statID = STAT_GANG2;
			statInfo = "gang members";
			break;		
			
		case "gang3":
			statID = STAT_GANG3;
			statInfo = "gang members";
			break;		
			
		case "gang4":
			statID = STAT_GANG4;
			statInfo = "gang members";
			break;		
			
		case "gang5":
			statID = STAT_GANG5;
			statInfo = "gang members";
			break;		
			
		case "gang6":
			statID = STAT_GANG6;
			statInfo = "gang members";
			break;		
			
		case "gang7":
			statID = STAT_GANG7;
			statInfo = "gang members";
			break;		
			
		case "mstreet":
			statID = STAT_STREET_GUY;
			statInfo = "street men";
			break;		
			
		case "msuit":
			statID = STAT_SUIT_GUY;
			statInfo = "business men";
			break;		
			
		case "msensible":
			statID = STAT_SENSIBLE_GUY;
			statInfo = "sensible men";
			break;		
			
		case "mgeek":
			statID = STAT_GEEK_GUY;
			statInfo = "geeky men";
			break;		
			
		case "mold":
			statID = STAT_OLD_GUY;
			statInfo = "old men";
			break;		
			
		case "mtough":
			statID = STAT_TOUGH_GUY;
			statInfo = "tough men";
			break;		
			
		case "fstreet":
			statID = STAT_STREET_GIRL;
			statInfo = "street women";
			break;		
			
		case "fsuit":
			statID = STAT_SUIT_GIRL;
			statInfo = "business women";
			break;		
			
		case "fsensible":
			statID = STAT_SENSIBLE_GIRL;
			statInfo = "sensible women";
			break;		
			
		case "fgeek":
			statID = STAT_GEEK_GIRL;
			statInfo = "geeky women";
			break;		
			
		case "fold":
			statID = STAT_OLD_GIRL;
			statInfo = "old women";
			break;		
			
		case "ftough":
			statID = STAT_TOUGH_GIRL;
			statInfo = "tough women";
			break;		
			
		case "mtramp":
			statID = STAT_TRAMP_MALE;
			statInfo = "male tramps";
			break;		
			
		case "ftramp":
			statID = STAT_TRAMP_FEMALE;
			statInfo = "female tramps";
			break;		
			
		case "tourist":
			statID = STAT_TOURIST;
			statInfo = "tourists";
			break;		
			
		case "hooker":
			statID = STAT_PROSTITUTE;
			statInfo = "hookers";
			break;		
			
		case "busker":
			statID = STAT_BUSKER;
			statInfo = "buskers";
			break;		
			
		case "taxidriver":
			statID = STAT_TAXIDRIVER;
			statInfo = "taxi drivers";
			break;		
			
		case "psycho":
			statID = STAT_PSYCHO;
			statInfo = "psychos";
			break;		
			
		case "steward":
			statID = STAT_STEWARD;
			statInfo = "stewards";
			break;		
			
		case "sportsfan":
			statID = STAT_SPORTSFAN;
			statInfo = "sports fans";
			break;		
			
		case "shopper":
			statID = STAT_SHOPPER;
			statInfo = "shoppers";
			break;		
			
		case "oldshopper":
			statID = STAT_OLDSHOPPER;		
			statInfo = "old shoppers";			
			break;		
			
		default:
			statID = STAT_PLAYER;
			statInfo = "normal people";
			break;	
	}	
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.stats", civilians[i].id, statID);
		}
	} else {
		for(let i in civilians){
			civilians[i].setPedStats(civilians[i], statID);
		}
	}	
	
	message("The civilians(s) will now act like " + statInfo, client, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_nogun", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_nogun <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.nogun", civilians[i].id);
		}		
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_god <civilian> <state 0/1>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.god", civilians[i].id, !!godMode);
		}		
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
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_nogun <civilian>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.crouch", civilians[i].id, (crouchState == 1) ? true : false);
		}		
	} else {
		for(let i in civilians){
			civilians[i].crouching = (crouchState == 1) ? true : false;
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_threat", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_nogun <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	let threatText = splitParams[1] || "p1";
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	var threatID = THREAT_PLAYER1;
	var threatInfo = "you";
	
	switch(threatText.toLowerCase()) {
		case "cop":
			threatID = THREAT_COP;
			threatInfo = "cops";
			break;
		
		case "p1":
			threatID = THREAT_PLAYER1;
			threatInfo = "cops";
			break;
			
		case "p2":
			threatID = THREAT_PLAYER2;
			threatInfo = "you";
			break;

		case "p3":
			threatID = THREAT_PLAYER3;
			threatInfo = "you";
			break;

		case "p4":
			threatID = THREAT_PLAYER4;
			threatInfo = "you";
			break;			
			
		case "male":
			threatID = THREAT_CIVMALE;
			threatInfo = "male civs";
			break;

		case "female":
			threatID = THREAT_CIVFEMALE;
			threatInfo = "female civs";
			break;	

		case "mafia":
			threatID = THREAT_GANG_MAFIA;
			threatInfo = "mafia members";
			break;	
			
		case "triad":
			threatID = THREAT_GANG_TRIAD;
			threatInfo = "triads";
			break;	
			
		case "diablo":
			threatID = THREAT_GANG_DIABLO;
			threatInfo = "diablo thugs";
			break;	
			
		case "yakuza":
			threatID = THREAT_GANG_YAKUZA;
			threatInfo = "yakuza members";
			break;		

		case "yardie":
			threatID = THREAT_GANG_YARDIE;
			threatInfo = "yardie bois";
			break;	

		case "cartel":
			threatID = THREAT_GANG_CARTEL;
			threatInfo = "border jumpers";
			break;

		case "hood":
			threatID = THREAT_HOOD;
			threatInfo = "street gangs";
			break;

		case "medic":
			threatID = THREAT_EMERGENCY;
			threatInfo = "medics";
			break;	
			
		case "hooker":
			threatID = THREAT_PROSTITUTE;
			threatInfo = "hookers";
			break;	
			
		case "gun":
			threatID = THREAT_GUN;
			threatInfo = "anybody who shoots a gun";
			break;	
			
		case "copcar":
			threatID = THREAT_COPCAR;
			threatInfo = "fuzzmobiles";			
			break;				
		
		case "fastcar":
			threatID = THREAT_FASTCAR;	
			threatInfo = "rich people cars";			
			break;	
			
		case "fireman":
			threatID = THREAT_FIREMAN;	
			threatInfo = "firefighters";			
			break;	

		case "dead":
			threatID = THREAT_DEADPEDS;
			threatInfo = "dead people";			
			break;	

		default:
			threatID = THREAT_PLAYER1;
			threatInfo = "you";			
			break;	
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_threat <civilian> <threat name>", syntaxMessageColour);
		return false;
	}
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.threat.add", civilians[i].id, threatID);
		}		
	} else {
		for(let i in civilians){
			civilians[i].setThreatSearch(threatID);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("civ_nothreat", function(cmdName, params) {
	if(isConnected) {
		if(!civiliansEnabled[gta.game]) {
			message("Civilians are disabled on this server!", errorMessageColour);
			return false;			
		}
	}
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_nothreat <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.threat.clr", civilians[i].id);
		}		
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
		message("Syntax: /civ_nogun <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.aimat", civilians[i].id, localPlayer.id);
		}		
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
		message("Syntax: /civ_aimatplr <civilian> <player>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.aimat", civilians[i].id, civilians2[0].id);
		}		
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
		message("Syntax: /civ_aimatplr <civilian> <vehicle>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.aimat", civilians[i].id, vehicles[0].id);
		}		
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
		message("Syntax: /civ_nogun <civilian>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.aimatplr", civilians[i].id, playerName);
		}		
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
		message("Syntax: /civ_hailtaxi <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.hailtaxi", civilians[i].id);
		}		
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
		message("Syntax: /civ_resurrect <civilian>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let civilians = getCiviliansFromParams(splitParams[0]);
	
	if(civilians.length == 0) {
		message("No civilians found!", errorMessageColour);
		return false;
	}
	
	if(isConnected) {
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.resurrect", civilians[i].id);
		}		
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
		message("Syntax: /civ_coll <civilian>", syntaxMessageColour);
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
		for(let i in civilians) {
			triggerNetworkEvent("sb.c.coll", civilians[i].id, (collisionsEnabled == 1) ? true : false);
		}		
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

addNetworkHandler("sb.c.wander", function(civilianID, wanderPath) {
	makeCivilianWander(getElementFromId(civilianID), wanderPath);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function(civilianID, stayState) {
	setCivilianStayInSamePlace(getElementFromId(civilianID), stayState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function(civilianID, x, y, z) {
	makeCivilianWalkTo(getElementFromId(civilianID), x, y, z)
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function(civilianID, x, y, z) {
	makeCivilianRunTo(getElementFromId(civilianID), x, y, z)
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function(civilianID, crouchState) {
	getElementFromId(civilianID).crouching = crouchState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function(civilianID, threatID) {
	getElementFromId(civilianID).setThreatSearch(threatID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function(civilianID, heedThreatState) {
	getElementFromId(civilianID).heedThreats = heedThreatState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function(civilianID, pedStat) {
	getElementFromId(civilianID).setPedStats(pedStat);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function(civilianID, skinID) {
	getElementFromId(civilianID).skin = skinID;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function(civilianID, x, y, z) {
	getElementFromId(civilianID).position = new Vec3(x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.lookat", function(civilianID, x, y, z, duration) {
	getElementFromId(civilianID).lookat(new Vec3(x, y, z), duration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function(civilianID, elementID) {
	getElementFromId(civilianID).pointGunAt(getElementFromId(elementID));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function(civilianID, walkStyle) {
	getElementFromId(civilianID).walkStyle = walkStyle;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function(civilianID, scaleFactor) {
	let civilian = getElementFromId(civilianID);
	
	scaleFactor = Number(scaleFactor);
	let civilianMatrix = civilian.matrix;
	civilianMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
	let civilianPosition = civilian.position;
	civilian.matrix = civilianMatrix;
	civilian.position = civilianPosition;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function(civilianID, vehicleID, seatID) {
	getElementFromId(civilianID).warpIntoVehicle(getElementFromId(vehicleID), seatID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function(civilianID, vehicleID, driver) {
	getElementFromId(civilianID).enterVehicle(getElementFromId(vehicleID), driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function(civilianID) {
	getElementFromId(civilianID).exitVehicle();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function(civilianID, godMode) {
	getElementFromId(civilianID).invincible = godMode;
	getElementFromId(civilianID).setProofs(godMode, godMode, godMode, godMode, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function(civilianID) {
	getElementFromId(civilianID).hailTaxi();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function(civilianID, weaponID, ammo, holdGun) {
	getElementFromId(civilianID).giveWeapon(weaponID, ammo, holdGun);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function(civilianID) {
	getElementFromId(civilianID).resurrect();
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function(civilianID) {
	getElementFromId(civilianID).jumping = true;
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


