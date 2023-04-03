"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game == 10) {
        console.warn("Weather is not available on this game!");
        event.preventDefault();
    }

    game.weather.force(Number(server.getCVar("weather")));
});

// ===========================================================================