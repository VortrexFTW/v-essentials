"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game < GAME_GTA_III || server.game > GAME_GTA_SA) {
        console.warn("Snow is not supported on this game! Resource stopping ...");
        event.preventDefault();
    }

    triggerNetworkEvent("v.snow", null, !!server.getCVar("fallingsnow"), !!server.getCVar("groundsnow"));
});

// ===========================================================================

addEventHandler("OnPlayerJoined", (event, client) => {
    triggerNetworkEvent("v.snow", client, !!server.getCVar("fallingsnow"), !!server.getCVar("groundsnow"));
});

// ===========================================================================