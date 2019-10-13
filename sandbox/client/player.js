"use strict";

// ----------------------------------------------------------------------------

let godMode = false;
let hudEnabled = true;

// ----------------------------------------------------------------------------

addCommandHandler("skin", function(cmdName, params) {
	if(!params || params == "") {
		message("Syntax: /skin <skin id>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let skinID = (Number(splitParams[0])) || 0;
	
	if(gta.game == GAME_GTA_III) {
		if(skinID == 26 || skinID == 27 || skinID == 28 || skinID == 29) {
			message("That skin is invalid!", errorMessageColour);
			return false;
		}		
	} else if(gta.game == GAME_GTA_VC) {
		if(skinID == 8 || skinID == 141 || skinID == 140 || skinID > 100) {
			message("That skin is invalid!", errorMessageColour);
			return false;
		}
	} else if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		skinID = gtaivSkinModels[skinID][1];
	}
	
	if(isConnected) {
		triggerNetworkEvent("sb.p.skin", localPlayer.id, skinID);
	} else {
		if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
			let position = localPlayer.position;
			let heading = localPlayer.heading;
			spawnPlayer(position, heading, skinNames[i][1]);
			
			// spawnPlayer position and heading don't seem to work. Forcing it manually for now.
			localPlayer.position = position;
			localPlayer.heading = heading;
		} else {
			localPlayer.skin = skinID;
		}
		
		message("You set your skin to " + skinNames[gta.game][skinID] + " (" + String(skinID) + ")" , gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("scale", function(cmdName, params) {
	if(!params || params == "") {
		message("Syntax: /scale <scale>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let scaleFactor = (Number(splitParams[0])) || 0;
	
	if(isConnected) {
		triggerNetworkEvent("sb.p.scale", localPlayer.id, scaleFactor);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("mission", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(!params || params == "") {
		message("Syntax: /mission <mission id>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let missionId = (Number(splitParams[0])) || 0;
	
	gta.cancelMission(false);
	gta.startMission(missionId);
	message("Mission ID " + String(missionNames[gta.game][missionId]) + " started!" , gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("endmission", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	gta.cancelMission(!!(Number(params) || 0));
	message("Mission ended!" , gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("gun", function(cmdName, params) {	
	if(!params || params == "") {
		message("Syntax: /gun <weapon> <ammo>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let wep = Number(splitParams[0]) || 2;
	let ammo = Number(splitParams[1]) || 100;
	
	if(wep > weaponNames[game.game].length-1 || wep < 0) {
		message("Invalid weapon ID! Use /guns for weapon ID's" , errorMessageColour);
		return false;
	}

	localPlayer.giveWeapon(wep, ammo, true);
	message("You have been given a " + getWeaponName(wep, gta.game) + " with " + ammo + " ammo", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("stat", function(cmdName, params) {	
	if(!params || params == "") {
		message("Syntax: /stat <stat id> <stat>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let statId = Number(splitParams[0]) || 0;
	let amount = Number(splitParams[1]) || 100;

	gta.setGameStat( statId, amount);
	message("Stat " + String(statId) + " is now " + String(amount) + " ammo", gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("guns", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		message("1: Bat, 2: Pistol, 3: Uzi, 4: Shotgun, 5: AK-47, 6: M16", gameAnnounceColour);
		message("7: Sniper Rifle8: Rocket Launcher, 9: Flame Thrower", gameAnnounceColour);
		message("10: Molotov Cocktail, 11: Grenade", gameAnnounceColour);
	} else {
		message("This command is only available on GTA III. Others games coming soon.", gameAnnounceColour);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("clear", function(cmdName, params) {
	gta.messages.clear();
	for(let i = 0; i <= 20; i++) {
		message(" ", COLOUR_WHITE);
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("god", function(cmdName, params) {
	godMode = !godMode;
	localPlayer.invincible = godMode;
	localPlayer.setProofs(godMode, godMode, godMode, godMode, godMode);
	triggerNetworkEvent("sb.p.god", localPlayer.id, godMode);
	
	message("You are " + String((godMode) ? "now" : "no longer") + " invincible" , gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("input", function(cmdName, params) {
	if(params == "0") {
		gta.setPlayerControl(false);
		message("Your controls have been locked.", gameAnnounceColour);
	} else if (params == "1") {
		gta.setPlayerControl(true);
		message("Your controls have been restored.", gameAnnounceColour);
	} else {
		message("Please enter 1 or 0 for player controls!", errorMessageColour);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("collisions", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(params == "0") {
		localPlayer.collisionsEnabled = false;
		message("Your collisions have been turned off.", gameAnnounceColour);
	} else if (params == "1") {
		localPlayer.collisionsEnabled = true;
		message("Your collisions have been turned on.", gameAnnounceColour);
	} else {
		message("Please enter 1 or 0 for collision state!", errorMessageColour);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("health", function(cmdName, params) {
	if(!params || params == "") {
		message("Your health is " + String(localPlayer.health), gameAnnounceColour);
	} else {
		let health = Number(params) || 100;
		triggerNetworkEvent("sb.p.hp", localPlayer.id, health);
		message("Your health has been set to " + String(health), gameAnnounceColour);		
	}

	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("money", function(cmdName, params) {
	if(!params || params == "") {
		message("Your have $" + String(localPlayer.money), gameAnnounceColour);
	} else {
		let cash = Number(params) || 100;
		localPlayer.money = cash;
		message("Your cash has been set to $" + String(cash), gameAnnounceColour);		
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("interior", function(cmdName, params) {
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(!params || params == "") {
		message("Your interior is " + String(cameraInterior), gameAnnounceColour);
	} else {
		let interior = Number(params) || 0;
		localPlayer.interior = interior;
		cameraInterior = interior;
		message("Your interior has been set to " + String(cameraInterior), gameAnnounceColour);		
	}
	
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("armour", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}
	
	if(!params || params == "") {
		message("Your armour is " + String(localPlayer.armour), gameAnnounceColour);
	} else {
		let armour = Number(params) || 100;
		triggerNetworkEvent("sb.p.ar", localPlayer.id, armour);
		message("Your armour has been set to " + String(armour), gameAnnounceColour);		
	}
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("warpinveh", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(isParamsInvalid(params)) {
		message("Syntax: /civ_warpinveh <civilian> <vehicle>", syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	
	let vehicles = getVehiclesFromParams(splitParams[0]);
	let seatID = Number(splitParams[1]) || 0;
	
	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}	
	
	localPlayer.warpIntoVehicle(vehicles[0], seatID);
	
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("stars", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}		
	
	if(!params || params == "") {
		message("Your wanted level is " + String(localPlayer.wantedLevel), gameAnnounceColour);
	} else {
		if(Number(params) == 0) {
			localPlayer.wantedLevel = 0;
		} else {
			localPlayer.wantedLevel = Number(params) || localPlayer.wantedLevel + 1;
		}
		
		message("Your wanted level has been set to " + String(localPlayer.wantedLevel), gameAnnounceColour);		
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("walkstyle", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}
	

	
	if(!params || params == "") {
		message("Your walk style is " + String(localPlayer.walkStyle), gameAnnounceColour);
	} else {
		let walkStyle = Number(params) || 0;
		if(isConnected) {
			localPlayer.walkStyle = walkStyle;
		} else {
			triggerNetworkEvent("sb.p.walkstyle", walkStyle);
		}			
		
		message("Your walk style has been set to " + String(localPlayer.walkStyle), gameAnnounceColour);		
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("stamina", function(cmdName, params) {
	if(gta.game == GAME_GTA_III || gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG || gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}	
	
	if(!params || params == "") {
		message("Your stamina is " + String(localPlayer.stamina), gameAnnounceColour);
	} else {
		let stamina = Number(params) || 0;
		localPlayer.stamina = stamina;	
		message("Your stamina has been set to " + String(localPlayer.stamina), gameAnnounceColour);		
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("hud", function(cmdName, params) {
	hudEnabled = !hudEnabled;
	setHUDEnabled(hudEnabled);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("fr", function(cmdName, params) {
	localPlayer.position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, Number(params) || 5);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("ba", function(cmdName, params) {
	localPlayer.position = getPosBehindPos(localPlayer.position, localPlayer.heading, Number(params) || 5);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("up", function(cmdName, params) {
	localPlayer.position = getPosAbovePos(localPlayer.position, localPlayer.heading, Number(params) || 2);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("dn", function(cmdName, params) {
	localPlayer.position = getPosBelowPos(localPlayer.position, localPlayer.heading, Number(params) || 2);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("pos", function(cmdName, params) {
	if(!params) {
		params = "Your position";
	}
	let output = '["' + params + '", [' + localPlayer.position.x.toFixed(2) + ', ' + localPlayer.position.y.toFixed(2) + ', ' + localPlayer.position.z.toFixed(3) + '], ' + localPlayer.heading.toFixed(3) + ']';
	message(output.toString(), gameAnnounceColour);	
	console.log(output.toString());
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("gotoloc", function(cmdName, params){
	for(let i in gameLocations[gta.game]) {
		if(gameLocations[gta.game][i][0].toLowerCase().indexOf(params.toLowerCase()) != -1) {
			if(localPlayer.vehicle) {
				localPlayer.vehicle.position = gameLocations[gta.game][i][1];
			} else {
				localPlayer.position = gameLocations[gta.game][i][1];
			}
			break;
		}
	}    
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.goto", function(x, y, z, interior, dimension) {
	if(localPlayer.vehicle != null) {
		localPlayer.vehicle.velocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.vehicle.turnVelocity = new Vec3(0.0, 0.0, 0.0);		
		localPlayer.vehicle.position = new Vec3(x, y, z);
		//localPlayer.vehicle.interior = interior;
		//localPlayer.vehicle.dimension = dimension;
		//cameraInterior = interior;
	} else {
		localPlayer.velocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.turnVelocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.position = new Vec3(x, y, z);
		//localPlayer.interior = interior;
		//localPlayer.dimension = dimension;
		//cameraInterior = interior;
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.skin", function(playerID, skinID) {
	getElementFromId(playerID).skin = Number(skinID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.scale", function(playerID, scaleFactor) {
	let player = getElementFromId(playerID);
	scaleFactor = Number(scaleFactor);
	let playerMatrix = player.matrix;
	playerMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
	let playerPosition = player.position;
	player.matrix = playerMatrix;
	player.position = playerPosition;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.hp", function(playerID, health) {
	getElementFromId(playerID).health = Number(health);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.ar", function(playerID, armour) {
	getElementFromId(playerID).armour = Number(armour);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.crouch", function(playerID, crouchState) {
	getElementFromId(playerID).crouching = crouchState;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.walkstyle", function(playerID, walkStyle) {
	getElementFromId(playerID).walkStyle = walkStyle;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.god", function(playerID, godMode) {
	getElementFromId(playerID).invincible = godMode;
	getElementFromId(playerID).setProofs(godMode, godMode, godMode, godMode, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.warpintoveh", function(playerID, vehicleID, seatID) {
	getElementFromId(playerID).warpIntoVehicle(getElementFromId(vehicleID), seatID);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.lookat", function(playerID, x, y, z) {
	getElementFromId(playerID).lookAt(new Vec3(x, y, z));
});

// ----------------------------------------------------------------------------
