# v-time
## Provides real world time

### Instructions
* Put the `v-time` resource into your server `resources` folder
* Add the `v-time` resource to your server config and start the server
* Edit the `config.json` file in the `v-time` resource folder to set your desired time configuration
* Start your server (or start/restart the resource with `/(re)start v-time` command)

### Config
*Configuration is in JSON format.*
* startHour = (Number) the hour at which to start the in-game time (0-23). Does not apply if `useRealTime` is true.
* startMinute = (Number) the minute at which to start the in-game time (0-59). Does not apply if `useRealTime` is true.
* useRealTime = (Boolean) whether to use real-world time
* timeZone = (String) the time zone to use for real-world time. Example: "America/New_York" for Eastern Time, "Europe/London" for UK time, etc.
* locale = (String) the locale to use for displaying time in chat. Example: "en-US" for English (United States), "fr-FR" for French (France), etc.