"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (typeof gta != "undefined") {
        gta.weather.force(Number(server.getCVar("weather")));
    }
});

// ===========================================================================