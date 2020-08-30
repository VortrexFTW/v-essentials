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
	triggerNetworkEvent("sb.ef.add", null, effectID, effectType, x, y, z);
});

// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.add2", function(client, effectType, scale,duration,  x, y, z, sX, sY, sZ) {
	triggerNetworkEvent("sb.ef.add2", null, effectType, scale, duration, x, y, z, sX, sY, sZ);
});


// ----------------------------------------------------------------------------

addNetworkHandler("sb.ef.del", function(client, effectID) {
	triggerNetworkEvent("sb.ef.del", null, effectID);
});

// ----------------------------------------------------------------------------