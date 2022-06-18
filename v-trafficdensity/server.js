"use strict";

// ----------------------------------------------------------------------------

let scriptConfig = null;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    if (server.game != GAME_GTA_IV && server.game != GAME_GTA_IV_EFLC) {
        console.error(`The v-trafficdensity resource only works on GTA IV`);
        event.preventDefault();
        thisResource.stop();
    }

    let configFile = loadTextFile("config.json");
    if (configFile == "" || configFile == null) {
        console.error(`Traffic density config could not be loaded! Resource stopping ...`);
        thisResource.stop();
    }
    scriptConfig = JSON.parse(configFile);

    triggerNetworkEvent("cardensity", null, scriptConfig.carDensity);
    triggerNetworkEvent("peddensity", null, scriptConfig.pedDensity);
    triggerNetworkEvent("parkedcardensity", null, scriptConfig.parkedCarDensity);
    triggerNetworkEvent("parkedcarnum", null, scriptConfig.overrideNumberOfParkedCars);
    triggerNetworkEvent("forcecloseparkedcars", null, scriptConfig.forceCarsToParkTooClose);
    triggerNetworkEvent("dontsuppresscarmodels", null, scriptConfig.dontSuppressAnyCarModels);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, (event, resource) => {
    triggerNetworkEvent("cardensity", null, 100);
    triggerNetworkEvent("peddensity", null, 100);
    triggerNetworkEvent("parkedcardensity", null, 100);
    triggerNetworkEvent("parkedcarnum", null, 100);
    triggerNetworkEvent("forcecloseparkedcars", null, false);
    triggerNetworkEvent("dontsuppresscarmodels", null, false);

    collectAllGarbage();
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", (event, client) => {
    triggerNetworkEvent("cardensity", client, scriptConfig.carDensity);
    triggerNetworkEvent("peddensity", client, scriptConfig.pedDensity);
    triggerNetworkEvent("parkedcardensity", client, scriptConfig.parkedCarDensity);
    triggerNetworkEvent("parkedcarnum", client, scriptConfig.overrideNumberOfParkedCars);
    triggerNetworkEvent("forcecloseparkedcars", client, scriptConfig.forceCarsToParkTooClose);
    triggerNetworkEvent("dontsuppresscarmodels", client, scriptConfig.dontSuppressAnyCarModels);
});

// ----------------------------------------------------------------------------

addCommandHandler("density", (command, params, client) => {
    triggerNetworkEvent("cardensity", null, scriptConfig.carDensity);
    triggerNetworkEvent("peddensity", null, scriptConfig.pedDensity);
    triggerNetworkEvent("parkedcardensity", null, scriptConfig.parkedCarDensity);
    triggerNetworkEvent("parkedcarnum", null, scriptConfig.overrideNumberOfParkedCars);
    triggerNetworkEvent("forcecloseparkedcars", null, scriptConfig.forceCarsToParkTooClose);
    triggerNetworkEvent("dontsuppresscarmodels", null, scriptConfig.dontSuppressAnyCarModels);
});

// ----------------------------------------------------------------------------