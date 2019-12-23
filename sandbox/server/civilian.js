"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.add", function(client, modelID, x, y, z, heading, announce) {
	let position = new Vec3(x, y, z);
	let civilian = gta.createCivilian(modelID, position);
	civilian.heading = heading;
	addToWorld(civilian);

	if(announce) {
		message(client.name + " spawned a " + skinNames[server.game][modelID] + " NPC ped.", gameAnnounceColours[server.game]);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.wander", function(client, civilianId, wanderPath) {
	triggerNetworkEvent("sb.c.wander", null, civilianId, wanderPath);
	getElementFromId(civilianId).setData("wander", wanderPath, false);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function(client, civilianId, stayState) {
	triggerNetworkEvent("sb.c.stay", null, civilianId, stayState);
	getElementFromId(civilianId).setData("stay", stayState, false);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.followme", function(client, civilianId) {
	getElementFromId(civilianId).setData("followingPlayer", client.player.id, true);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.defendme", function(client, civilianId) {
	getElementFromId(civilianId).setData("defendingPlayer", client.player.id);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.faceme", function(client, civilianId) {
	getElementFromId(civilianId).setData("facingPlayer", client.player.id);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function(client, civilianId, x, y, z) {
	triggerNetworkEvent("sb.c.walkto", null, civilianId, x, y, z);
	let civilianData = getElementFromId(civilianId).getData("sb");
	civilianData[civilianDataStructure.moveToCoords] = [x, y, z];
	civilianData[civilianDataStructure.moveToMethod] = civilianMoveMethod.walk;
	getElementFromId(civilianId).setData("sb", civilianData, true);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function(client, civilianId, x, y, z) {
	triggerNetworkEvent("sb.c.runto", null, civilianId, x, y, z);
	let civilianData = getElementFromId(civilianId).getData("sb");
	civilianData[civilianDataStructure.moveToCoords] = [x, y, z];
	civilianData[civilianDataStructure.moveToMethod] = civilianMoveMethod.run;
	getElementFromId(civilianId).setData("sb", civilianData, true);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.sprintto", function(client, civilianId, x, y, z) {
	triggerNetworkEvent("sb.c.sprintto", null, civilianId, x, y, z);
	let civilianData = getElementFromId(civilianId).getData("sb");
	civilianData[civilianDataStructure.moveToCoords] = [x, y, z];
	civilianData[civilianDataStructure.moveToMethod] = civilianMoveMethod.sprint;
	getElementFromId(civilianId).setData("sb", civilianData, true);	
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function(client, civilianId, crouchState) {
	triggerNetworkEvent("sb.c.crouch", null, civilianId, crouchState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function(client, civilianId, threatID) {
	triggerNetworkEvent("sb.c.threat.add", null, civilianId, threatID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function(client, civilianId, heedThreatState) {
	triggerNetworkEvent("sb.c.threat.heed", null, civilianId, heedThreatState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function(client, civilianId, pedStat) {
	triggerNetworkEvent("sb.c.stat", null, civilianId, pedStat);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function(client, civilianId, skinID) {
	triggerNetworkEvent("sb.c.skin", null, civilianId, skinID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function(client, civilianId, x, y, z) {
	triggerNetworkEvent("sb.c.pos", null, civilianId, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function(client, civilianId, elementID) {
	triggerNetworkEvent("sb.c.aimat", null, civilianId, elementID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function(client, civilianId, vehicleID, seatID) {
	triggerNetworkEvent("sb.c.warpintoveh", null, civilianId, vehicleID, seatID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function(client, civilianId, vehicleID, driver) {
	triggerNetworkEvent("sb.c.enterveh", null, civilianId, vehicleID, driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function(client, civilianId) {
	triggerNetworkEvent("sb.c.exitveh", null, civilianId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function(client, civilianId, godMode) {
	triggerNetworkEvent("sb.c.exitveh", null, civilianId, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function(client, civilianId) {
	triggerNetworkEvent("sb.c.hailtaxi", null, civilianId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function(client, civilianId) {
	triggerNetworkEvent("sb.c.resurrect", null, civilianId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.del", function(client, civilianId) {
	destroyElement(getElementFromId(civilianId));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function(client, civilianId, weaponID, ammo, holdGun) {
	triggerNetworkEvent("sb.c.gun", null, civilianId, weaponID, ammo, holdGun);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function(client, civilianId, walkStyleID) {
	triggerNetworkEvent("sb.c.walkstyle", null, civilianId, walkStyleID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function(client, civilianId) {
	triggerNetworkEvent("sb.c.jump", null, civilianId);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stamina", function(client, civilianId, stamina) {
	triggerNetworkEvent("sb.c.stamina", null, civilianId, stamina);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.staminadur", function(client, civilianId, staminaDuration) {
	triggerNetworkEvent("sb.c.staminadur", null, civilianId, staminaDuration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.torsorot", function(client, civilianId, rotation) {
	triggerNetworkEvent("sb.c.torsorot", null, civilianId, rotation);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function(client, civilianId, scale) {
	triggerNetworkEvent("sb.c.scale", null, civilianId, scale);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.syncer", function(client, civilianId, clientName) {
	getElementFromId(civilianId).syncer = getClientFromName(clientName).index;
	message(getClientFromName(clientName).name + " is now the syncer for civ " + String(civilianId), gameAnnounceColours[server.game]);
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedWasted", function(event, ped) {
	if(ped.isType(ELEMENT_CIVILIAN)) {
		setTimeout(destroyElement, 7500, ped);
	}
});