// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.add`, function (client, modelId, position, heading) {
	let civilian = game.createCivilian(modelId, position);
	civilian.heading = heading;
	addToWorld(civilian);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.wander`, function (client, civilianIds, wanderPath) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.wander`, null, civilianId, wanderPath);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.stay`, function (client, civilianIds, stayState) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.stay`, null, civilianId, stayState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.follow`, function (client, civilianIds, entityId) {
	civilianIds.forEach((civilianId) => {
		getElementFromId(civilianId).setData(`sb.c.following`, entityId, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.defend`, function (client, civilianIds, entity) {
	civilianIds.forEach((civilianId) => {
		getElementFromId(civilianId).setData(`sb.c.defending`, entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.facing`, function (client, civilianIds, entity) {
	civilianIds.forEach((civilianId) => {
		civilian.setData(`sb.c.facing`, entity, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.walkfwd`, function (client, civilianIds, distance) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.walkfwd`, null, civilianId, distance);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.runfwd`, function (client, civilianIds, distance) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.runfwd`, null, civilianId, distance);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.sprintfwd`, function (client, civilianIds, distance) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.sprintfwd`, null, civilianId, distance);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.walkto`, function (client, civilianIds, position) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.walkto`, null, civilianId, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.runto`, function (client, civilianIds, position) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.runto`, null, civilianId, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.sprintto`, function (client, civilianIds, position) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.sprintto`, null, civilianId, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.crouch`, function (client, civilianIds, crouchState) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.crouch`, null, civilianId, crouchState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.threat.add`, function (client, civilianIds, threatId) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.threat.add`, null, civilianId, threatId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.threat.heed`, function (client, civilianIds, heedThreatState) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.threat.heed`, null, civilianId, heedThreatState);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.stat`, function (client, civilianIds, pedStat) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.stat`, null, civilianId, pedStat);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.skin`, function (client, civilianIds, skinId) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.skin`, null, civilianId, skinId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.pos`, function (client, civilianIds, position) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.pos`, null, civilianId, position);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.aimat`, function (client, civilianIds, elementId) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.aimat`, null, civilianId, getElementFromId(elementId));
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.warpintoveh`, function (client, civilianIds, vehicle, seatID) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.warpintoveh`, null, civilianId, vehicle, seatID);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.enterveh`, function (client, civilianIds, vehicle, driver) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.enterveh`, null, civilianId, vehicle, driver);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.exitveh`, function (client, civilianIds) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.exitveh`, null, civilianId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.god`, function (client, civilianIds, godMode) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.god`, null, civilianId, godMode);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.hailtaxi`, function (client, civilianIds) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.hailtaxi`, null, civilianId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.resurrect`, function (client, civilianIds) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.resurrect`, null, civilianId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.del`, function (client, civilians) {
	civilians.forEach(function (civilian) {
		destroyElement(civilian);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.gun`, function (client, civilianIds, weaponId, ammo, holdGun) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.gun`, null, civilianId, weaponId, ammo, holdGun);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.nogun`, function (client, civilianIds) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.gun`, null, civilianId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.walkstyle`, function (client, civilianIds, walkStyle) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.walkstyle`, null, civilianId, walkStyle);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.jump`, function (client, civilianIds) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.jump`, null, civilianId);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.stamina`, function (client, civilianIds, stamina) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.stamina`, null, civilianId, stamina);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.staminadur`, function (client, civilianIds, staminaDuration) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.staminadur`, null, civilianId, staminaDuration);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.torsorot`, function (client, civilianIds, rotation) {
	civilianIds.forEach((civilianId) => {
		triggerNetworkEvent(`sb.c.torsorot`, null, civilianId, rotation);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.scale`, function (client, civilianIds, scale) {
	civilianIds.forEach(function (civilianId) {
		getElementFromId(civilianId).setData(`sb.scale`, scale, true);
	});
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.c.syncer`, function (client, civilianIds, targetClient) {
	civilianIds.forEach(function (civilianId) {
		getElementFromId(civilianId).setSyncer(targetClient.index, true);
	});
});

// ----------------------------------------------------------------------------

addEventHandler(`OnPedWasted`, function (event, ped) {
	if (!ped.isType(ELEMENT_PLAYER)) {
		setTimeout(destroyElement, 7500, ped);
	}
});

// ----------------------------------------------------------------------------