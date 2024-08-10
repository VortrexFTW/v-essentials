"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game == 10) {
        console.warn("Time is not available on this game!");
        event.preventDefault();
    }

    game.time.hour = Number(server.getCVar("hour"));
    game.time.minute = Number(server.getCVar("minute"));
});

// ===========================================================================