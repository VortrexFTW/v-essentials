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
    if (server.getCVar("CarDensity") != null) {
        triggerNetworkEvent("v.cardensity", client, server.getCVar("CarDensity"));
    }

    if (server.getCVar("PedDensity") != null) {
        triggerNetworkEvent("v.peddensity", client, server.getCVar("PedDensity"));
    }

    if (server.getCVar("ParkedCarDensity") != null) {
        triggerNetworkEvent("v.parkedcardensity", client, server.getCVar("ParkedCarDensity"));
    }

    if (server.getCVar("OverrideNumberOfParkedCars") != null) {
        triggerNetworkEvent("v.parkedcarnum", client, server.getCVar("OverrideNumberOfParkedCars"));
    }

    if (server.getCVar("ForceCarsToParkTooClose") != null) {
        triggerNetworkEvent("v.forcecloseparkedcars", client, server.getCVar("ForceCarsToParkTooClose"));
    }

    if (server.getCVar("DontSuppressAnyCarModels") != null) {
        triggerNetworkEvent("v.dontsuppresscarmodels", client, server.getCVar("DontSuppressAnyCarModels"));
    }
}

// ----------------------------------------------------------------------------