"use strict";

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    gta.time.hour = Number(server.getCVar("hour"));
    gta.time.minute = Number(server.getCVar("minute"));
});

// ===========================================================================