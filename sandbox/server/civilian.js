"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.add", function(client, modelID, x, y, z, heading, announce) {
	let position = new Vec3(x, y, z);
	let civilian = createCivilian(modelID, position);
	//civilian.game = serverGame;
	//civilian.position = position;
	civilian.heading = heading;
	civilian.syncer = client.index;
	addToWorld(civilian);
	if(announce) {
		message(client.name + " spawned a " + skinNames[serverGame][modelID] + " ped.", gameAnnounceColours[serverGame]);
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.wander", function(client, civilianID, wanderPath) {
	triggerNetworkEvent("sb.c.wander", null, civilianID, wanderPath);
	getElementFromId(civilianID).setData("wander", wanderPath, false);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stay", function(client, civilianID, stayState) {
	triggerNetworkEvent("sb.c.stay", null, civilianID, stayState);
	getElementFromId(civilianID).setData("stay", stayState, false);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.followme", function(client, civilianID) {
	getElementFromId(civilianID).setData("followingPlayer", client.player.id, true);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.defendme", function(client, civilianID) {
	getElementFromId(civilianID).setData("defendingPlayer", client.player.id);
	//triggerNetworkEvent("sb.c.defendplr", null, civilianID, client.player.id);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.faceme", function(client, civilianID) {
	getElementFromId(civilianID).setData("facingPlayer", client.player.id);
	//triggerNetworkEvent("sb.c.faceplr", null, civilianID, client.player.id);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkto", function(client, civilianID, x, y, z) {
	triggerNetworkEvent("sb.c.walkto", null, civilianID, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.runto", function(client, civilianID, x, y, z) {
	triggerNetworkEvent("sb.c.runto", null, civilianID, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.sprintto", function(client, civilianID, x, y, z) {
	triggerNetworkEvent("sb.c.sprintto", null, civilianID, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.crouch", function(client, civilianID, crouchState) {
	triggerNetworkEvent("sb.c.crouch", null, civilianID, crouchState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.add", function(client, civilianID, threatID) {
	triggerNetworkEvent("sb.c.threat.add", null, civilianID, threatID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.threat.heed", function(client, civilianID, heedThreatState) {
	triggerNetworkEvent("sb.c.threat.heed", null, civilianID, heedThreatState);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stat", function(client, civilianID, pedStat) {
	triggerNetworkEvent("sb.c.stat", null, civilianID, pedStat);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.skin", function(client, civilianID, skinID) {
	triggerNetworkEvent("sb.c.skin", null, civilianID, skinID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.pos", function(client, civilianID, x, y, z) {
	triggerNetworkEvent("sb.c.pos", null, civilianID, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.aimat", function(client, civilianID, elementID) {
	triggerNetworkEvent("sb.c.aimat", null, civilianID, elementID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.warpintoveh", function(client, civilianID, vehicleID, seatID) {
	triggerNetworkEvent("sb.c.warpintoveh", null, civilianID, vehicleID, seatID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.enterveh", function(client, civilianID, vehicleID, driver) {
	triggerNetworkEvent("sb.c.enterveh", null, civilianID, vehicleID, driver);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.exitveh", function(client, civilianID) {
	triggerNetworkEvent("sb.c.exitveh", null, civilianID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.god", function(client, civilianID, godMode) {
	triggerNetworkEvent("sb.c.exitveh", null, civilianID, godMode);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.hailtaxi", function(client, civilianID) {
	triggerNetworkEvent("sb.c.hailtaxi", null, civilianID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.resurrect", function(client, civilianID) {
	triggerNetworkEvent("sb.c.resurrect", null, civilianID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.del", function(client, civilianID) {
	destroyElement(getElementFromId(civilianID));
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.gun", function(client, civilianID, weaponID, ammo, holdGun) {
	triggerNetworkEvent("sb.c.gun", null, civilianID, weaponID, ammo, holdGun);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.walkstyle", function(client, civilianID, walkStyleID) {
	triggerNetworkEvent("sb.c.walkstyle", null, civilianID, walkStyleID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.jump", function(client, civilianID) {
	triggerNetworkEvent("sb.c.jump", null, civilianID);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.stamina", function(client, civilianID, stamina) {
	triggerNetworkEvent("sb.c.stamina", null, civilianID, stamina);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.staminadur", function(client, civilianID, staminaDuration) {
	triggerNetworkEvent("sb.c.staminadur", null, civilianID, staminaDuration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.torsorot", function(client, civilianID, rotation) {
	triggerNetworkEvent("sb.c.torsorot", null, civilianID, rotation);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.scale", function(client, civilianID, scale) {
	triggerNetworkEvent("sb.c.scale", null, civilianID, scale);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.c.syncer", function(client, civilianID, clientName) {
	getElementFromId(civilianID).syncer = getClientFromName(clientName).index;
	message(getClientFromName(clientName).name + " is now the syncer for civ " + String(civilianID), gameAnnounceColours[serverGame]);
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedWasted", function(event, ped) {
	if(ped.isType(ELEMENT_CIVILIAN)) {
		setTimeout(destroyElement, 7500, ped);
	}
});