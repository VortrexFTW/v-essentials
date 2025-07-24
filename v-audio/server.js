"use strict";

// ===========================================================================

let startTime = 0;

let scriptConfig = null;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (typeof ELEMENT_DUMMY === "undefined") {
		event.preventDefault();
		return false; // Ensure ELEMENT_DUMMY is defined before proceeding
	}

	startTime = Date.now() / 1000;
});

// ===========================================================================

addNetworkHandler("v.startTime", function (client, event) {
	// Client is asking for start time
	triggerNetworkEvent("v.startTime", client, startTime);
});

// ===========================================================================