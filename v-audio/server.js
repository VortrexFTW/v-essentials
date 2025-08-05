"use strict";

// ===========================================================================

let startTime = 0;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	startTime = Date.now() / 1000;
});

// ===========================================================================

addNetworkHandler("v.audio.startTime", function (client) {
	// Client is asking for start time
	triggerNetworkEvent("v.audio.startTime", client, startTime);
});

// ===========================================================================