"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.add`, function(client, modelId, position, heading) {
	let civilian = gta.createCivilian(modelId, position);
	civilian.heading = heading;
	addToWorld(civilian);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.wander`, function(client, civilians, wanderPath) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.wander`, null, civilian, wanderPath);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.stay`, function(client, civilians, stayState) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.stay`, null, civilian, stayState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.follow`, function(client, civilians, entity) {
	civilians.forEach((civilian) => {
		civilian.setData(`sb.c.following`, entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.defend`, function(client, civilians, entity) {
	civilians.forEach((civilian) => {
		civilian.setData(`sb.c.defending`, entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.facing`, function(client, civilians, entity) {
	civilians.forEach((civilian) => {
		civilian.setData(`sb.c.facing`, entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.walkfwd`, function(client, civilians, distance) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.walkfwd`, null, civilian, distance);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.runfwd`, function(client, civilians, distance) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.runfwd`, null, civilian, distance);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.sprintfwd`, function(client, civilians, distance) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.sprintfwd`, null, civilian, distance);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.walkto`, function(client, civilians, position) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.walkto`, null, civilian, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.runto`, function(client, civilians, position) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.runto`, null, civilian, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.sprintto`, function(client, civilians, position) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.sprintto`, null, civilian, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.crouch`, function(client, civilians, crouchState) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.crouch`, null, civilian, crouchState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.threat.add`, function(client, civilians, threatId) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.threat.add`, null, civilian, threatId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.threat.heed`, function(client, civilians, heedThreatState) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.threat.heed`, null, civilian, heedThreatState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.stat`, function(client, civilians, pedStat) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.stat`, null, civilian, pedStat);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.skin`, function(client, civilians, skinId) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.skin`, null, civilian, skinId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.pos`, function(client, civilians, position) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.pos`, null, civilian, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.aimat`, function(client, civilians, element) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.aimat`, null, civilian, element);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.warpintoveh`, function(client, civilians, vehicle, seatID) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.warpintoveh`, null, civilian, vehicle, seatID);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.enterveh`, function(client, civilians, vehicle, driver) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.enterveh`, null, civilian, vehicle, driver);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.exitveh`, function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.exitveh`, null, civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.god`, function(client, civilians, godMode) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.god`, null, civilian, godMode);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.hailtaxi`, function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.hailtaxi`, null, civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.resurrect`, function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.resurrect`, null, civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.del`, function(client, civilians) {
	civilians.forEach(function(civilian) {
		destroyElement(civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.gun`, function(client, civilians, weaponId, ammo, holdGun) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.gun`, null, civilian, weaponId, ammo, holdGun);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.nogun`, function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.gun`, null, civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.walkstyle`, function(client, civilians, walkStyle) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.walkstyle`, null, civilian, walkStyle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.jump`, function(client, civilians) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.jump`, null, civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.stamina`, function(client, civilians, stamina) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.stamina`, null, civilian, stamina);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.staminadur`, function(client, civilians, staminaDuration) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.staminadur`, null, civilian, staminaDuration);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.torsorot`, function(client, civilians, rotation) {
	civilians.forEach((civilian) => {
		triggerNetworkEvent(`sb.c.torsorot`, null, civilian, rotation);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.scale`, function(client, civilians, scale) {
	civilians.forEach(function(civilian) {
		civilian.setData(`sb.scale`, scale, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.syncer`, function(client, civilians, targetClient) {
	civilians.forEach(function(civilian) {
		civilian.setSyncer(targetClient.index, true);
	});
});

// ----------------------------------------------------------------------------

addEventHandler(`OnPedWasted`, function(event, ped) {
	if(ped.isType(ELEMENT_CIVILIAN)) {
		setTimeout(destroyElement, 7500, ped);
	}
});

// ----------------------------------------------------------------------------