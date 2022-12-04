"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    triggerNetworkEvent("v.snow", null, !!server.getCVar("fallingsnow"), !!server.getCVar("groundsnow"));
});

// ===========================================================================

addEventHandler("OnPlayerJoined", (event, client) => {
    triggerNetworkEvent("v.snow", client, !!server.getCVar("fallingsnow"), !!server.getCVar("groundsnow"));
});

// ===========================================================================