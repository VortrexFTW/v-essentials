"use strict";

let scriptConfig = null;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
    if (server.game == 10) {
        console.warn("[v.weather] The v-weather resource is not available for Mafia: The City of Lost Heaven. Stopping resource ...");
        thisResource.stop();
        return;
    }
});

// ----------------------------------------------------------------------------

class WeatherData {
    constructor(weatherId, name, data) {
        this.weatherId = weatherId;
        this.name = name;

        this.weatherAPICodes = (typeof data.weatherAPICodes != "undefined") ? data.weatherAPICodes : [];
    }
};

// ----------------------------------------------------------------------------

let weather = {
    [GAME_GTA_III]: [ // GTA III
        new WeatherData(0, "Clear", { weatherAPICodes: [1000, 1003] }),
        new WeatherData(1, "Overcast", { weatherAPICodes: [1006, 1009] }),
        new WeatherData(2, "Thunderstorm", { weatherAPICodes: [1087] }),
        new WeatherData(3, "Fog", { weatherAPICodes: [1135, 1147] }),
        new WeatherData(4, "Sunny", { weatherAPICodes: [1000, 1003] }),
        new WeatherData(5, "Rainy", { weatherAPICodes: [1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1243, 1246] }),
    ],
    [GAME_GTA_VC]: [ // GTA Vice City
        new WeatherData(0, "Clear", { weatherAPICodes: [1000, 1003] }),
        new WeatherData(1, "Overcast", { weatherAPICodes: [1006, 1009] }),
        new WeatherData(2, "Thunderstorm", { weatherAPICodes: [1087, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1243, 1246] }),
        new WeatherData(3, "Fog", { weatherAPICodes: [1135, 1147] }),
        new WeatherData(4, "Sunny", { weatherAPICodes: [1000, 1003] }),
    ],
    [GAME_GTA_SA]: [ // GTA San Andreas
        new WeatherData(0, "Blue Skies", { weatherAPICodes: [1000, 1003] }),
        new WeatherData(8, "Thunderstorm", { weatherAPICodes: [1087] }),
        new WeatherData(9, "Cloudy/Foggy", { weatherAPICodes: [1135, 1147] }),
        new WeatherData(10, "Clear Blue Skies", { weatherAPICodes: [1000, 1003] }),
        new WeatherData(16, "Dull/Rainy", { weatherAPICodes: [1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1243, 1246] }),
    ],
    [GAME_GTA_IV]: [ // GTA IV
        new WeatherData(0, "Extra Sunny", { weatherAPICodes: [1000, 1003] }),
        new WeatherData(3, "Cloudy", { weatherAPICodes: [1006, 1009] }),
        new WeatherData(4, "Rain", { weatherAPICodes: [1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1243, 1246] }),
        new WeatherData(6, "Foggy", { weatherAPICodes: [1135, 1147] }),
        new WeatherData(7, "Thunderstorm", { weatherAPICodes: [1087] })
    ],
};

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
    scriptConfig = JSON.parse(loadTextFile("config.json"));
    if (!scriptConfig) {
        console.log("[v.weather] Could not load config.json. Resource stopping ...");
        event.preventDefault();
        return false;
    }

    updateWeather();

    if (scriptConfig.useRealWorldWeather) {
        console.log(`[v.weather] Resource started. Current weather location: ${scriptConfig.weatherLocation}`);
        setInterval(() => {
            updateWeather();
        }, scriptConfig.updateInterval || 600000); // Default update interval is 10 minutes
    }
});

// ----------------------------------------------------------------------------

async function updateWeather() {
    if (scriptConfig.useRealWorldWeather !== true) {
        let gtaWeatherData = weather[server.game].find(w => w.name.toLowerCase().includes(scriptConfig.startWeather.toLowerCase()));
        game.forceWeather(gtaWeatherData.weatherId);
        return;
    }

    new Promise(resolve => {
        let url = `https://api.weatherapi.com/v1/current.json?key=${scriptConfig.weatherAPIKey}&q=${scriptConfig.weatherLocation}&=${scriptConfig.extraParams}`;
        httpGet(
            url,
            "",
            function (data) {
                data = String.fromCharCode.apply(null, new Uint8Array(data));
                data = JSON.parse(data);
                resolve(data);
            },
            function (data) {
            }
        );
    }).then(data => {
        if (typeof data.current == "undefined") {
            console.error("[v.weather] Current weather data is undefined. Resource stopping ...");
            thisResource.stop();
        }

        let gtaWeatherData = weather[server.game].find(w => w.weatherAPICodes.includes(data.current.condition.code));
        if (typeof gtaWeatherData == "undefined") {
            console.error(`[v.weather] No GTA weather data found for API code: ${data.current.condition.code}. Weather not updated (existing in-game weather will remain).`);
            return false;
        }

        console.log(`[v.weather] Updating in-game weather to: ${gtaWeatherData.name} (${gtaWeatherData.weatherId})`);
        game.forceWeather(gtaWeatherData.weatherId);
    });
}

// ----------------------------------------------------------------------------