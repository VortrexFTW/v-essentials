"use strict";

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, (event, resource) => {
    scriptConfig = JSON.parse(loadTextFile("config.json"));
    if (!scriptConfig) {
        console.log("[v.time] Could not load config.json. Resource stopping ...");
        event.preventDefault();
        return false;
    }

    if (server.game == 10) {
        console.warn("Time is not available on Mafia: The City of Lost Heaven!");
        event.preventDefault();
    }

    if (scriptConfig.useRealTime == true) {
        addEventHandler("OnProcess", updateTime);
    } else {
        game.time.hour = Number(scriptConfig.startHour);
        game.time.minute = Number(scriptConfig.startMinute);
    }
});

// ----------------------------------------------------------------------------

function updateRealTime(event, deltaTime) {
    let date = new Date();
    date = new Date(date.toLocaleString(scriptConfig.locale, {
        timeZone: scriptConfig.timeZone
    }));

    game.time.hour = date.getHours();
    game.time.minute = date.getMinutes();
}

// ----------------------------------------------------------------------------