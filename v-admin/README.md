# v-admin
## Provides admin commands

### Instructions
* Put the `v-admin` resource into your server `resources` folder
* Add the `v-admin` resource to your server config and start the server
* Start GTAC/MafiaC and connect to your server
* Alt+Tab to switch to the server console, and use `makeadmin <your_name> <level>` (no slash!)
* You have admin!

### Commands
*Commands can be used in either server console without slash, or in-game with a slash*
* `/kick <name/id> <reason>` - Kicks a player from the server
* `/ban <name/id> <reason>` - Bans a player from the server. Partial matches are allowed. Case insensitive.
* `/unban <name/id>` - Unbans a player from the server. Partial matches are allowed. Case insensitive.
* `/admin <name/id>` - Makes a player an admin. Partial matches are allowed. Case insensitive.
* `/scripts <name/id>` - Shows what scripts a player's game is running (**not** resources!)
* `/trainers <name/id>` - Enables/disables trainer status for a player. This overrides the global trainer state for that player.
* `/makeadmin <name/id> <level>` - Makes a player an admin. Partial matches are allowed. Case insensitive. Levels to use commands are in config.json

### Config
*Configuration is in JSON format. Manual changes will be overwritten when the resource stops*
* admins = (Array) list of admins, each an object containing name, IP, user token, admin that added them, and a date when they were added
* bans = (Array) list of bans, each an object containing name, IP, user token, admin who banned, date of ban, and reason (if a reason was supplied)
* blockedScripts = (Array) list of game scripts that are blocked from running
* trainers = (Array) list of players that an admin has forced a trainer status for (overrides the global trainer state for that player)
* geoip = (Object) configuration to use GeoIP module. File paths for GeoIP-Lite database files, relative to the server root directory
* commandLevels = (Object) configuration to use GeoIP module. File paths for GeoIP-Lite database files, relative to the server root directory

### Notes
* Admins will automatically be given admin powers when connecting, using a custom token. As long as the admin has the same PC, they will be able to connect as an admin without needing to use the `/makeadmin` command again. If an admin gets a new PC (or reinstalls GTAC or their system), you will need to use the `/makeadmin` command to update their token again.
* Any admin with a level that can use the `/makeadmin` command can remove other admins. Use with caution!
* Admins can use the `/scripts` command to see what scripts a player's game is running.
* Game scripts above are **not** GTAC resources. They are the game scripts (usually SCM or SCO) that the game uses to provide content (like in singleplayer). However, some mods and trainers use this system to provide their own features.
* The config.json uses JSON format, and shouldn't be edited manually.
* Any manual changes to config.json will be overwritten when the resource stops.
