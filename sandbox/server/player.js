"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("OnPlayerJoin", function(event, client) {
	client.setData("sb.p.connecttime", new Date().getTime());
});

// ----------------------------------------------------------------------------

addCommandHandler("goto", function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		messageClient("/goto <player name/id>", client, gameAnnounceColours[serverGame]);
		return false;
	}
	
	let tempClient = getClientFromParams(params);
	
	if(!tempClient) {
		messageClient("That player doesn't exist!", client, errorMessageColour);
		return false;
	}
	
	if(tempClient.administrator) {
		if(!client.administrator) {
			messageClient("You can't teleport to an administrator!", client, errorMessageColour);
			return false;
		}
	}
	
	if(tempClient.index == client.index) {
		messageClient("You can't teleport to yourself!", client, errorMessageColour);
		return false;
	}
	
	let position = getPosInFrontOfPos(tempClient.player.position, tempClient.player.heading, 2);
	client.player.interior = tempClient.player.interior;
	client.player.dimension = tempClient.player.dimension;
	setTimeout(function() {
		triggerNetworkEvent("sb.p.goto", client, position.x, position.y, position.z, tempClient.player.interior, tempClient.player.dimension);
	}, 500);
	return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("gotopos", function(cmdName, params, client) {
	if(isParamsInvalid(params)) {
		messageClient("/gotopos <x> <y> <z>", client, syntaxMessageColour);
		return false;
	}
	
	let splitParams = params.split(" ");
	let positionX = splitParams[0] || client.player.position.x;
	let positionY = splitParams[1] || client.player.position.y;
	let positionZ = splitParams[2] || client.player.position.z;
	
	triggerNetworkEvent("sb.p.goto", client, parseFloat(positionX), parseFloat(positionY), parseFloat(positionZ));
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.skin", function(client, clientID, skinId) {
	/*
	if(server.game == GAME_GTA_IV || server.game == GAME_GTA_IV_EFLC) {
		let position = client.player.position;
		let heading = client.player.heading;
		spawnPlayer(client, position, heading, skinId, 0, 0);
	} else {
		triggerNetworkEvent("sb.p.skin", null, clientID, skinId);
	}
	*/
	let position = client.player.position;
	let heading = client.player.heading;
	spawnPlayer(client, position, heading, skinId, 0, 0);
	message(client.name + " changed their skin to " + skinNames[server.game][skinId], gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.hp", function(client, clientID, health) {
	triggerNetworkEvent("sb.p.hp", null, clientID, health);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.scale", function(client, clientID, scaleFactor) {
	triggerNetworkEvent("sb.p.scale", null, clientID, scaleFactor);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.ar", function(client, clientID, armour) {
	triggerNetworkEvent("sb.p.ar", null, clientID, armour);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.crouch", function(client, clientID, crouchState) {
	triggerNetworkEvent("sb.p.crouch", null, clientID, crouchState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.god", function(client, clientID, godMode) {
	triggerNetworkEvent("sb.p.god", null, clientID, godMode);
});

// ----------------------------------------------------------------------------

addCommandHandler("underwater", function(cmdName, params, client) {
	if(gta.game == GAME_GTA_SA) {
		let skin = client.player.modelIndex;
		destroyElement(client.player);
		spawnPlayer(client, new Vec3(2729.91, -2592.13, -12.508), skin);
		return true;
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("connecttime", function(command, params, client) {
	if(isParamsInvalid(params)) {
		messageClient("/connecttime <player name/id>", client, syntaxMessageColour);
		return false;
	}	
	
	let tempClient = getClientFromParams(params);
	
	if(!tempClient) {
		messageClient("That player doesn't exist!", client, errorMessageColour);
		return false;
	}
	
	message(tempClient.name + " has been connected for " + getTimeDifferenceDisplay(new Date().getTime(), tempClient.getData("sb.p.connecttime")), gameAnnounceColours[serverGame]);
	return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.walkstyle", function(client, walkStyle) {
	triggerNetworkEvent("sb.p.walkstyle", null, client.player.id, walkStyle);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.p.lookat", function(client, x, y, z) {
	triggerNetworkEvent("sb.p.lookat", null, client.player.id, x, y, z);
});