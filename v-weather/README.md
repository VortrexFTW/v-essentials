# v-weather
## Provides real world weather

### Instructions
* Put the `v-weather` resource into your server `resources` folder
* Add the `v-weather` resource to your server config and start the server
* Edit the `config.json` file in the `v-weather` resource folder to set your OpenWeatherMap API key and location
* Start your server (or start/restart the resource with `/(re)start v-weather` command)

### Config
*Configuration is in JSON format.*
* useRealWorldWeather = (Boolean) whether to use real-world weather data from WeatherAPI
* startWeather = (String) the initial weather to set if not using real-world weather (e.g., "Clear", "Rainy", etc.)
* weatherAPIKey = (String) your WeatherAPI API key
* weatherLocation = (String) the location for which to retrieve weather data
* extraParams = (String) any extra parameters to include in the API request
* updateInterval = (Number) how often to update the weather (in milliseconds)

### Notes
* The `weatherAPIKey` is required for real-world weather. You can get one from [WeatherAPI](https://www.weatherapi.com/).