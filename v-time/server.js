"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game == 10) {
        console.warn("Weather is not available on this game!");
        event.preventDefault();
    }

    gta.time.hour = Number(server.getCVar("hour"));
    gta.time.minute = Number(server.getCVar("minute"));
});

// ===========================================================================