"use strict";

// ----------------------------------------------------------------------------

let godMode = false;
let hudEnabled = true;

addEventHandler("OnMouseWheel", function(event, mouse, offset, flipped) {
	//if(offset) {
	//	gta.forceRadioChannel(
	//}
});

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	//if(gta.game > GAME_GTA_III) {
	//	if(localPlayer != null) {
	//		triggerNetworkEvent("sb.p.crouching", localPlayer, localPlayer.crouching);
	//	}
	//}
});

// ----------------------------------------------------------------------------

//addNetworkHandler("sb.p.crouching", function(player, state) {
//	if(gta.game > GAME_GTA_III) {
//		if(player != null) {
//			if(player != localPlayer) {
//				player.crouching = state;
//			}
//		}
//	}
//});

// ----------------------------------------------------------------------------

addCommandHandler("skin", function(cmdName, params) {
	if(!params || params == "") {
		message("Syntax: /skin <skin id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let skinId = getSkinIdFromParams(splitParams[0], gta.game);

	if(!skinId) {
		skinId = 0;
	}

	if(gta.game == GAME_GTA_III) {
		if(skinId == 26 || skinId == 27 || skinId == 28 || skinId == 29) {
			message("That skin is invalid!", errorMessageColour);
			return false;
		}
	} else if(gta.game == GAME_GTA_VC) {
		if(skinId == 8 || skinId == 141 || skinId == 140) { // || skinID > 100) {
			message("That skin is invalid!", errorMessageColour);
			return false;
		}
	}

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.p.skin", localPlayer.position, localPlayer.heading, skinId);
	} else {
		if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
			let position = localPlayer.position;
			let heading = localPlayer.heading;
			destroyElement(localPlayer);

			console.log(skinId);
			console.log(position.x);
			console.log(heading);

			let player = createPlayer(skinId);
			console.log(player);
			player.position = position;
			player.heading = heading;
			setLocalPlayer(player);

			//destroyElement(oldPlayer);
			
			//spawnPlayer(position, heading, skinId);

			// spawnPlayer position and heading don't seem to work. Forcing it manually for now.
			//localPlayer.position = position;
			//localPlayer.heading = heading;
			//localPlayer.modelIndex = skinId;
		} else {
			localPlayer.skin = skinId;
		}
	}

	let outputText = "set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.skinId)) + " skin to " + String(getSkinNameFromId(skinId));
	outputSandboxMessage(outputText);	
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

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.p.scale", localPlayer.id, scaleFactor);
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("radio", function(cmdName, params) {
	if(!params || params == "") {
		message("Syntax: /radio <station id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let radioStationId = Number(splitParams[0]) || 0;

	gta.forceRadioChannel(radioStationId);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("bikegod", function(cmdName, params) {
	if(!params || params == "") {
		message("Syntax: /bikegod <state 0/1>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let bikeGod = Number(splitParams[0]) || 0;

	localPlayer.canBeKnockedOffBike = !!bikeGod;

	let outputText = String((!!bikeGod) ? "disabled" : "enabled") + " " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " bike fall-off. They can " + String((!!bikeGod) ? "not" : "now") + " be knocked off bikes";
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("mission", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Syntax: /mission <mission id>", syntaxMessageColour);
		return false;
	}

	let missionId = getMissionIdFromParams(params, gta.game);

	if(!missionId) {
		message("That mission doesn't exist!", errorMessageColour);
		return false;
	}

	localClient.setData("sb.p.mission", missionId);
	gta.cancelMission(false);
	gta.startMission(missionId);

	let outputText = "started mission " + String(missionNames[gta.game][missionId]) + " (ID: " + String(missionId) + ")";
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("lastseen", function(cmdName, params) {
	gta.playSuspectLastSeen(localPlayer.position);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("crouch", function(cmdName, params) {
	localPlayer.crouching = !localPlayer.crouching;
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("endmission", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let failMission = Number(splitParams[0]) || 0;

	if(!gta.onMission) {
		message("You are not doing a mission!", errorMessageColour);
		return false;
	}

	let missionId = localClient.getData("sb.p.mission");
	let outputText = "ended " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " mission (Status: " + String((!!failMission) ? "passed" : "failed") + ")";
	if(missionId != null) {
		outputText = "ended mission " + String(missionNames[gta.game][missionId]) + " (ID: " + String(missionId) + ", Status: " + String((!!failMission) ? "passed" : "failed") + ")";
		localClient.removeData("sb.p.mission");
	}
	gta.cancelMission(!!failMission);

	outputSandboxMessage(outputText);
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

	if(ammo > 99999) {
		ammo = 99999;
	}

	localPlayer.giveWeapon(wep, ammo, true);

	let outputText = "has been given a " + getWeaponName(wep, gta.game) + " with " + ammo + " ammo";
	outputSandboxMessage(outputText);
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

	gta.setGameStat(statId, amount);

	let outputText = "set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " " + String(statId) + " stat to " + String(amount);
	outputSandboxMessage(outputText);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("fatness", function(cmdName, params) {
	if(!params || params == "") {
		message("Syntax: /fatness <amount>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");
	let amount = Number(splitParams[0]) || localPlayer.tommyFatness;

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.p.fatness", localPlayer, amount);
	} else {
		localPlayer.tommyFatness = amount;
	}

	let outputText = "set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " " + String(statId) + " fatness to " + String(localPlayer.tommyFatness);
	outputSandboxMessage(outputText);
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

	let outputText = "is " + String((godMode) ? "now" : "no longer") + " invincible";
	outputSandboxMessage(outputText);
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

	let splitParams = params.split(" ");
	let collisionState = Number(splitParams[0]) || 0;

	localPlayer.collisionsEnabled = !!collisionState;

	let outputText = "has " + String((!!collisionState) ? "enabled" : "disabled") + " " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " player ped's collisions.";
	outputSandboxMessage(outputText);
});

// ----------------------------------------------------------------------------

addCommandHandler("health", function(cmdName, params) {
	if(!params || params == "") {
		message("Your health is " + String(localPlayer.health), gameAnnounceColour);
	} else {
		let health = Number(params) || 100;

		if(health > 100) {
			health = 100;
		}

		triggerNetworkEvent("sb.p.hp", localPlayer.id, health);
		let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " health to " + String(health);
		outputSandboxMessage(outputText);
	}

	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("money", function(cmdName, params) {
	if(!params || params == "") {
		message("Your have $" + String(localPlayer.money), gameAnnounceColour);
	} else {
		let cash = Number(params) || 100;

		if(cash > 99999999) {
			cash = 99999999;
		}

		localPlayer.money = cash;
		let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " cash (money) to " + String(money);
		outputSandboxMessage(outputText);
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
		let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " interior to " + String(interior);
		outputSandboxMessage(outputText);
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("armour", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(!params || params == "") {
		message("Your armour is " + String(localPlayer.armour), gameAnnounceColour);
	} else {
		let armour = Number(params) || 100;

		if(armour > 100) {
			armour = 100;
		}

		triggerNetworkEvent("sb.p.ar", localPlayer.id, armour);
		let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " armour to " + String(armour);
		outputSandboxMessage(outputText);
	}

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("warpinveh", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Syntax: /civ_warpinveh <vehicle> <seat id>", syntaxMessageColour);
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

addCommandHandler("warpinveh", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Syntax: /civ_warpinveh <vehicle> <seat id>", syntaxMessageColour);
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

addCommandHandler("enterveh", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(isParamsInvalid(params)) {
		message("Syntax: /civ_enterveh <vehicle> <seat id>", syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(" ");

	let vehicles = getVehiclesFromParams(splitParams[0]);
	let driver = Number(splitParams[1]) || 0;

	if(vehicles.length == 0) {
		message("No vehicles found!", errorMessageColour);
		return false;
	}

	localPlayer.enterVehicle(vehicles[0], !!driver);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("stars", function(cmdName, params) {
	//if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
	//	message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
	//	return false;
	//}

	if(!params || params == "") {
		message("Your wanted level is " + String(localPlayer.wantedLevel), gameAnnounceColour);
	} else {
		if(!isNaN(Number(params))) {

			if(Number(params) <= 0) {
				localPlayer.wantedLevel = 0;
			} else {
				if(Number(params) > 6) {
					localPlayer.wantedLevel = 6;
				} else {
					localPlayer.wantedLevel = Number(params) || localPlayer.wantedLevel + 1;
				}
			}

			let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " wanted level to " + String(params);
			outputSandboxMessage(outputText);
		}
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("limb", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(isParamsInvalid(params)) {
		message("Syntax: /civ_warpinveh <vehicle> <seat id>", syntaxMessageColour);
		return false;
	}

	let bodyPartId = Number(params.split(" ")[0]) || 0;

	if(!isNaN(Number(params))) {
		if(bodyPartId < 0 || bodyPartId > pedComponents[gta.game][bodyPartId].length) {
			message("That limb does not exist!", errorMessageColour);
		}

		triggerNetworkEvent("sb.p.limb", bodyPartId);

		let outputText = "removed " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " " + String(pedComponents[gta.game][bodyPartId]);
		outputSandboxMessage(outputText);
	}
	return true;
});


// ----------------------------------------------------------------------------

addCommandHandler("walkstyle", function(cmdName, params) {
	if(gta.game == GAME_GTA_SA || gta.game == GAME_GTA_UG || gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		message("The /" + cmdName + " command is not available on this game!", errorMessageColour);
		return false;
	}

	if(!params || params == "") {
		message("Your walk style is " + String(localPlayer.walkStyle), gameAnnounceColour);
	} else {
		let walkStyle = Number(params) || 0;
		if(isConnected && gta.game < GAME_GTA_IV) {
			localPlayer.walkStyle = walkStyle;
		} else {
			triggerNetworkEvent("sb.p.walkstyle", walkStyle);
		}

		let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " walk style to " + String(walkStyle);
		outputSandboxMessage(outputText);
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
		let outputText = "has set " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " stamina to " + String(stamina);
		outputSandboxMessage(outputText);
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

addCommandHandler("helmet", function(cmdName, params) {
	if(isParamsInvalid(params)) {
		message("Syntax: /helmet <state 0/1>", syntaxMessageColour);
		return false;
	}

	let helmetState = Number(params) || 0;

	if(isConnected && gta.game < GAME_GTA_IV) {
		triggerNetworkEvent("sb.p.helmet", !!helmetState);
	} else {
		if(!!helmetState) {
			localPlayer.giveHelmet();
		} else {
			localPlayer.removeHelmet(true, true, true);
		}
	}

	let outputText = "";

	if(!!helmetState) {
		outputText = "put on " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " helmet";
	} else {t
		outputText = "took off " + getGenderPossessivePronoun(getGenderForSkin(localPlayer.modelIndex)) + " helmet";
	}
	outputSandboxMessage(outputText);	
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

addCommandHandler("vw", function(cmdName, params) {
	message("Your dimension (virtual world): " + localPlayer.dimension, gameAnnounceColour);
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.limb", function(client, bodyPartId) {
	console.log(client);
	console.log(bodyPartId);
	if(client.player) {
		client.player.removeBodyPart(bodyPartId);
	} else {
		console.warn("Could not remove " + client.name + "'s " + pedComponents[gta.game][bodyPartId] + "! Player object doesn't exist!");
	}
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("int", function(cmdName, params) {
	message("Your interior: " + localPlayer.interior, gameAnnounceColour);
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

addCommandHandler("jail", function(cmdName, params) {
	if(gta.game == GAME_GTA_III) {
		if(localClient.getData("jailed")) {
			localPlayer.position = new Vec3(340.64, -1130.53, 22.981);
			gta.restoreCamera(false);
			localClient.removeData("jailed");
		} else {
			localPlayer.position = new Vec3(326.53, -1093.04, 25.981);
			gta.setCameraLookAtEntity(new Vec3(331.59, -1090.24, 28.981), localPlayer, false);
			localClient.setData("jailed", 1);
		}
	} else if(gta.game == GAME_GTA_VC) {
		
	} else if(gta.game == GAME_GTA_SA) {

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

addCommandHandler("gotopos", function(command, params) {
	let splitParams = params.split(" ");
	let positionX = Number(splitParams[0].replace(",", ""));
	let positionY = Number(splitParams[1].replace(",", ""));
	let positionZ = Number(splitParams[2].replace(",", ""));

	if(localPlayer.vehicle != null) {
		localPlayer.vehicle.velocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.vehicle.turnVelocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.vehicle.position = new Vec3(positionX, positionY, positionZ);
	} else {
		localPlayer.velocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.turnVelocity = new Vec3(0.0, 0.0, 0.0);
		localPlayer.position = new Vec3(positionX, positionY, positionZ);
	}
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.skin", function(playerId, skinId) {
	getElementFromId(playerId).skin = Number(skinId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.scale", function(playerId, scaleFactor) {
	let player = getElementFromId(playerId);
	scaleFactor = Number(scaleFactor);
	let playerMatrix = player.matrix;
	playerMatrix.setScale(new Vec3(scaleFactor, scaleFactor, scaleFactor));
	let playerPosition = player.position;
	player.matrix = playerMatrix;
	player.position = playerPosition;
	console.log("Scale: " + String(scaleFactor));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.hp", function(playerId, health) {
	getElementFromId(playerId).health = Number(health);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.ar", function(playerId, armour) {
	getElementFromId(playerId).armour = Number(armour);
});

// ----------------------------------------------------------------------------

//addNetworkHandler("sb.p.crouch", function(playerID, crouchState) {
//	getElementFromId(playerID).crouching = crouchState;
//});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.walkstyle", function(playerId, walkStyle) {
	getElementFromId(playerId).walkStyle = walkStyle;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.helmet", function(playerID, helmetState) {
	if(helmetState) {
		getElementFromId(playerID).giveHelmet();
	} else {
		getElementFromId(playerID).removeHelmet();
	}
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

addNetworkHandler("sb.p.delplayer", function(player) {
	destroyElement(player);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.fatness", function(player, fatness) {
	gta.tommyFatness = fatness;
});

// ----------------------------------------------------------------------------
