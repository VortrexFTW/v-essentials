"use strict";

// ----------------------------------------------------------------------------

let effects = Array(128);
effects.fill({
	baseType: 0,
	position: new Vec3(0.0, 0.0, 0.0),
	effectType: 0,
	exists: false,
	scale: 1.0,
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.add", function(client, effectType, x, y, z) {
	let effect = {
		baseType: 1,
		position: new Vec3(0.0, 0.0, 0.0),
		effectType: 0,
		exists: false,
		scale: 1.0,
	};
	
	let effectID = getFirstEmptyEffectSlot(true);
	effects[effectID] = true;
	
	triggerNetworkEvent("sb.ef.add", null, effectID, effectType, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.add2", function(client, effectType, x, y, z, scale) {
	let effect = {
		baseType: 2,
		position: new Vec3(0.0, 0.0, 0.0),
		effectType: 0,
		exists: false, 
		scale: 1.0,
	};
	
	let effectID = getFirstEmptyEffectSlot(true);
	effects[effectID] = true;
	
	triggerNetworkEvent("sb.ef.add2", null, effectID, effectType, x, y, z, scale);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.del", function(client, effectID) {
	triggerNetworkEvent("sb.ef.del", null, effectID);
});

// ----------------------------------------------------------------------------