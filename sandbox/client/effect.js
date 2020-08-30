"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("effect", function(cmdName, params){
	if(isParamsInvalid(params)) {
		message("Syntax: /effect <effect id>", syntaxMessageColour);
		return false;
	}	
	
	let effectType = Number(params) || 0;
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 5);
	
	if(isConnected) {
		triggerNetworkEvent("sb.ef.add", effectType, position.x, position.y, position.z);
	} else {
		addParticleEffect(effectType, position);
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("effect2", function(cmdName, params){
	if(isParamsInvalid(params)) {
		message("Syntax: /effect2 <effect id> <scale> <duration> <strength x> <strength y> <strength z>", syntaxMessageColour);
		return false;
	}		
	
	let splitParams = params.split(" ");
	let effectType = Number(splitParams[0]) || 0;
	let scale = Number(splitParams[1]) || 1.0;
	let duration = Number(splitParams[2]) || 5000;
	let strengthX = Number(splitParams[3]) || 1.0;
	let strengthY = Number(splitParams[4]) || 1.0;
	let strengthZ = Number(splitParams[5]) || 1.0;
	
	let position = getPosInFrontOfPos(localPlayer.position, localPlayer.heading, 5);
	
	if(isConnected) {
		triggerNetworkEvent("sb.ef.add2", effectType, scale, duration, position.x, position.y, position.z, strengthX, strengthY, strengthZ);
	} else {
		addMovingParticleEffect(effectType, position, new Vec3(strengthX, strengthY, strengthZ), scale, duration);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.add", function(effectID, effectType, x, y, z) {
	let position = new Vec3(x, y, z);
	let effect = addParticleEffect(effectType, position);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.add2", function(effectType, scale, duration, positionX, positionY, positionZ, strengthX, strengthY, strengthZ) {
	let position = new Vec3(positionX, positionY, positionZ);
	addMovingParticleEffect(effectType, position, new Vec3(strengthX, strengthY, strengthZ), scale, duration);
});

// ----------------------------------------------------------------------------