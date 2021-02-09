`use strict`;

// ----------------------------------------------------------------------------

addEventHandler(`OnPlayerJoin`, function(event, client) {
	client.setData(`sb.p.connecttime`, new Date().getTime());
});

// ----------------------------------------------------------------------------

addCommandHandler(`goto`, function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		messageClient(`/goto <player name/id>`, client, gameAnnounceColours[serverGame]);
		return false;
	}

	let tempClient = getClientFromParams(params);

	if(!tempClient) {
		messageClient(`That player doesn't exist!`, client, errorMessageColour);
		return false;
	}

	if(tempClient.administrator) {
		if(!client.administrator) {
			messageClient(`You can't teleport to an administrator!`, client, errorMessageColour);
			return false;
		}
	}

	if(tempClient == client) {
		messageClient(`You can't teleport to yourself!`, client, errorMessageColour);
		return false;
	}

	setTimeout(function() {
		let position = getPosInFrontOfPos(tempClient.player.position, tempClient.player.heading, 2);
		triggerNetworkEvent(`sb.p.goto`, client, position);
	}, 500);
	outputSandboxMessage(client, `teleported to ${tempClient.name} (Using /goto)`);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler(`get`, function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		messageClient(`/get <player name/id>`, client, gameAnnounceColours[serverGame]);
		return false;
	}

	let tempClient = getClientFromParams(params);

	if(!tempClient) {
		messageClient(`That player doesn't exist!`, client, errorMessageColour);
		return false;
	}

	if(!client.administrator) {
		messageClient(`You need to be an administrator to teleport people to you!`, client, errorMessageColour);
		return false;
	}

	if(tempClient.index == client.index) {
		messageClient(`You can't teleport yourself to yourself!`, client, errorMessageColour);
		return false;
	}

	let position = getPosInFrontOfPos(client.player.position, client.player.heading, 2);
	tempClient.player.interior = client.player.interior;
	tempClient.player.dimension = client.player.dimension;
	setTimeout(function() {
		triggerNetworkEvent(`sb.p.goto`, tempClient, position, client.player.interior, client.player.dimension);
	}, 500);

	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler(`gotopos`, function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		messageClient(`/gotopos <x> <y> <z>`, client, syntaxMessageColour);
		return false;
	}

	let splitParams = params.split(` `);
	let positionX = splitParams[0] || client.player.position.x;
	let positionY = splitParams[1] || client.player.position.y;
	let positionZ = splitParams[2] || client.player.position.z;

	triggerNetworkEvent(`sb.p.goto`, client, parseFloat(positionX), parseFloat(positionY), parseFloat(positionZ));
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.skin`, function(client, skinId, position, heading) {
	if(server.game == GAME_GTA_IV || server.game == GAME_GTA_IV_EFLC) {
		spawnPlayer(client, position, heading, skinId);
	} else {
		client.player.modelIndex = skinId;
	}
	//message(client.name + ` changed their skin to ` + skinNames[server.game][skinId], gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.hp`, function(client, clientId, health) {
	triggerNetworkEvent(`sb.p.hp`, null, clientId, health);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.scale`, function(client, clientId, scaleFactor) {
	triggerNetworkEvent(`sb.p.scale`, null, clientId, scaleFactor);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.ar`, function(client, clientId, armour) {
	triggerNetworkEvent(`sb.p.ar`, null, clientId, armour);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.limb`, function(client, bodyPartId) {
	triggerNetworkEvent(`sb.p.limb`, null, client, bodyPartId);
});

// ----------------------------------------------------------------------------

//addNetworkHandler(`sb.p.crouching`, function(client, player, state) {
//	triggerNetworkEvent(`sb.p.crouching`, null, player, state);
//});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.god`, function(client, clientID, godMode) {
	triggerNetworkEvent(`sb.p.god`, null, clientID, godMode);
});

// ----------------------------------------------------------------------------

addCommandHandler(`underwater`, function(cmdName, params, client) {
	if(gta.game == GAME_GTA_SA) {
		let skin = client.player.modelIndex;
		destroyElement(client.player);
		spawnPlayer(client, new Vec3(2729.91, -2592.13, -12.508), skin);
		return true;
	}
});

// ----------------------------------------------------------------------------

addCommandHandler(`connecttime`, function(command, params, client) {
	if(isParamsInvalid(params)) {
		messageClient(`/connecttime <player name/id>`, client, syntaxMessageColour);
		return false;
	}

	let tempClient = getClientFromParams(params);

	if(!tempClient) {
		messageClient(`That player doesn't exist!`, client, errorMessageColour);
		return false;
	}

	message(`${tempClient.name} has been connected for ${getTimeDifferenceDisplay(new Date().getTime(), tempClient.getData(`sb.p.connecttime`))}`, gameAnnounceColours[serverGame]);
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.walkstyle`, function(client, walkStyle) {
	triggerNetworkEvent(`sb.p.walkstyle`, null, client.player.id, walkStyle);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.helmet`, function(client, helmetState) {
	triggerNetworkEvent(`sb.p.helmet`, null, client.player.id, helmetState);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.lookat`, function(client, x, y, z) {
	triggerNetworkEvent(`sb.p.lookat`, null, client.player.id, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.veh.enter`, function(client, vehicleID, driver) {
	triggerNetworkEvent(`sb.p.veh.enter`, null, client.player.id, vehicleID, driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.p.fatness`, function(client, player, fatness) {
	triggerNetworkEvent(`sb.p.fatness`, null, player, fatness);
});

// ----------------------------------------------------------------------------
