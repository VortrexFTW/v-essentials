"use strict";

let fallingSnow = false;
let groundSnow = false;
let forceSnow = false;
let heavySnow = false;
let snowConfetti = false;
let snowBumpiness = 1.0;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game < GAME_GTA_III || server.game > GAME_GTA_IV) {
        console.warn("Snow is not supported on this game! Resource stopping ...");
        event.preventDefault();
    }

    fallingSnow = !!server.getCVar("FallingSnow");
    groundSnow = !!server.getCVar("GroundSnow");
    forceSnow = !!server.getCVar("ForceSnow");
    heavySnow = !!server.getCVar("HeavySnow");
    snowConfetti = !!server.getCVar("SnowConfetti");
    snowBumpiness = server.getCVar("SnowBumpiness");

    updateClientSnow(null);
});

// ===========================================================================

addEventHandler("OnPlayerJoined", (event, client) => {
    updateClientSnow(client);
});

// ===========================================================================

addNetworkHandler("v.snow", (event, client) => {
    updateClientSnow(client);
});

// ===========================================================================

addCommandHandler("fallingsnow", (command, params, client) => {
    if (!!server.getCVar("SnowAdmin")) {
        if (!client.administrator && !client.console) {
            return false;
        }
    }

    fallingSnow = !fallingSnow;
    updateClientSnow(null);
});

// ===========================================================================

addCommandHandler("groundsnow", (command, params, client) => {
    if (!!server.getCVar("SnowAdmin")) {
        if (!client.administrator && !client.console) {
            return false;
        }
    }

    groundSnow = !groundSnow;
    updateClientSnow(null);
});

// ===========================================================================

addCommandHandler("forcesnow", (command, params, client) => {
    if (!!server.getCVar("SnowAdmin")) {
        if (!client.administrator && !client.console) {
            return false;
        }
    }

    forceSnow = !forceSnow;
    updateClientSnow(null);
});

// ===========================================================================

addCommandHandler("heavysnow", (command, params, client) => {
    if (!!server.getCVar("SnowAdmin")) {
        if (!client.administrator && !client.console) {
            return false;
        }
    }

    heavySnow = !heavySnow;
    updateClientSnow(null);
});

// ===========================================================================

addCommandHandler("confettisnow", (command, params, client) => {
    if (!!server.getCVar("SnowAdmin")) {
        if (!client.administrator && !client.console) {
            return false;
        }
    }

    snowConfetti = !snowConfetti;
    updateClientSnow(null);
});

// ===========================================================================

addCommandHandler("snowbumpiness", (command, params, client) => {
    if (!!server.getCVar("SnowAdmin")) {
        if (!client.administrator && !client.console) {
            return false;
        }
    }

    snowBumpiness = parseFloat(params);
    updateClientSnow(null);
});

// ===========================================================================

function updateClientSnow(client) {
    triggerNetworkEvent("v.snow", client, fallingSnow, groundSnow, forceSnow, heavySnow, snowConfetti, snowBumpiness);
}

// ===========================================================================