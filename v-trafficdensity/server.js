"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game != GAME_GTA_IV) {
        console.error(`The v-trafficdensity resource only works on GTA IV`);
        event.preventDefault();
        thisResource.stop();
        return false;
    }

    sendDataToPlayer(null);
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", (event, client) => {
    sendDataToPlayer(client);
});

// ----------------------------------------------------------------------------

function sendDataToPlayer(client) {
    if (server.getCVar("V_CarDensity") != null) {
        triggerNetworkEvent("v.cardensity", client, server.getCVar("V_CarDensity"));
    }

    if (server.getCVar("V_PedDensity") != null) {
        triggerNetworkEvent("v.peddensity", client, server.getCVar("V_PedDensity"));
    }

    if (server.getCVar("V_ParkedCarDensity") != null) {
        triggerNetworkEvent("v.parkedcardensity", client, server.getCVar("V_ParkedCarDensity"));
    }

    if (server.getCVar("V_OverrideNumberOfParkedCars") != null) {
        triggerNetworkEvent("v.parkedcarnum", client, server.getCVar("V_OverrideNumberOfParkedCars"));
    }

    if (server.getCVar("V_ForceCarsToParkTooClose") != null) {
        triggerNetworkEvent("v.forcecloseparkedcars", client, server.getCVar("V_ForceCarsToParkTooClose"));
    }

    if (server.getCVar("V_DontSuppressAnyCarModels") != null) {
        triggerNetworkEvent("v.dontsuppresscarmodels", client, server.getCVar("V_DontSuppressAnyCarModels"));
    }
}

// ----------------------------------------------------------------------------