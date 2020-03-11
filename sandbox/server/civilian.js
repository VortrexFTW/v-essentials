"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.add", function(client, modelId, x, y, z, heading, announce) {
	let position = new Vec3(x, y, z);
	let civilian = gta.createCivilian(modelId, position);
	civilian.heading = heading;
	addToWorld(civilian);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.wander", function(client, civilians, wanderPath) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.wander", getClients()[civilian.syncer], civilian, wanderPath);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function(client, civilians, stayState) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.stay", getClients()[civilian.syncer], civilian, stayState);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.follow", function(client, civilians, entity) {
	civilians.forEach((civilian) => {
		civilian.setData("sb.c.following", entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.defend", function(client, civilians, entity) {
	civilians.forEach((civilian) => {
		civilian.setData("sb.c.defending", entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.facing", function(client, civilians, entity) {
	civilians.forEach((civilian) => {
		civilian.setData("sb.c.facing", entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkfwd", function(client, civilians, distance) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.walkfwd", getClients()[civilian.syncer], civilian, distance);
	});		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runfwd", function(client, civilians, distance) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.runfwd", getClients()[civilian.syncer], civilian, distance);
	});		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.sprintfwd", function(client, civilians, distance) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.sprintfwd", getClients()[civilian.syncer], civilian, distance);
	});		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function(client, civilians, x, y, z) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.walkto", getClients()[civilian.syncer], civilian, x, y, z);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function(client, civilians, x, y, z) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.runto", getClients()[civilian.syncer], civilian, x, y, z);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.sprintto", function(client, civilians, x, y, z) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.sprintto", getClients()[civilian.syncer], civilian, x, y, z);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function(client, civilians, crouchState) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.crouch", getClients()[civilian.syncer], civilian, crouchState);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function(client, civilians, threatId) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.threat.add", getClients()[civilian.syncer], civilian, threatId);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function(client, civilians, heedThreatState) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.threat.heed", getClients()[civilian.syncer], civilian, heedThreatState);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function(client, civilians, pedStat) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.stat", getClients()[civilian.syncer], civilian, pedStat);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function(client, civilians, skinId) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.skin", getClients()[civilian.syncer], civilian, skinId);
	});		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function(client, civilians, x, y, z) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.pos", getClients()[civilian.syncer], civilian, x, y, z);
	});		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function(client, civilians, element) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.aimat", getClients()[civilian.syncer], civilian, element);
	});		
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function(client, civilians, vehicle, seatID) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.warpintoveh", getClients()[civilian.syncer], civilian, vehicle, seatID);
	});	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function(client, civilians, vehicle, driver) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.enterveh", getClients()[civilian.syncer], civilian, vehicle, driver);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.exitveh", getClients()[civilian.syncer], civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function(client, civilians, godMode) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.god", getClients()[civilian.syncer], civilian, godMode);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.hailtaxi", getClients()[civilian.syncer], civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.resurrect", getClients()[civilian.syncer], civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.del", function(client, civilians) {
	civilians.forEach(function(civilian) {
		destroyElement(civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function(client, civilians, weaponId, ammo, holdGun) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.gun", getClients()[civilian.syncer], civilian, weaponId, ammo, holdGun);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.nogun", function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.gun", getClients()[civilian.syncer], civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function(client, civilians, walkStyle) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.walkstyle", getClients()[civilian.syncer], civilian, walkStyle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.jump", getClients()[civilian.syncer], civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stamina", function(client, civilians, stamina) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.stamina", getClients()[civilian.syncer], civilian, stamina);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.staminadur", function(client, civilians, staminaDuration) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.staminadur", getClients()[civilian.syncer], civilian, staminaDuration);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.torsorot", function(client, civilians, rotation) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent("sb.c.torsorot", getClients()[civilian.syncer], civilian, rotation);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function(client, civilians, scale) {
	civilians.forEach(function(civilian) {
		civilian.setData("sb.scale", scale, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.syncer", function(client, civilians, clientName) {
	civilians.forEach(function(civilian) {
		civilian.syncer = getClientFromName(clientName).index;
	});
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedWasted", function(event, ped) {
	if(ped.isType(ELEMENT_CIVILIAN)) {
		setTimeout(destroyElement, 7500, ped);
	}
});

// ----------------------------------------------------------------------------