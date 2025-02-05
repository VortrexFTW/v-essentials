# v-admin
## Provides admin and ban commands

### Instructions
* Put the `v-admin` resource into your server `resources` folder.
* Add the `v-admin` resource to your server config and start the server
* Start your GTAC client and go in-game.
* Alt+Tab to switch to the server console, and use `admin <your_name>` (no slash!)
* You have admin!

### Commands
*Commands can be used in either server console without slash, or in-game with a slash*
* `/kick <name/id> <reason>` - Kicks a player from the server
* `/ban <name/id> <reason>` - Bans a player from the server. Partial matches are allowed. Case insensitive.
* `/unban <name/id>` - Unbans a player from the server. Partial matches are allowed. Case insensitive.
* `/admin <name/id>` - Makes a player an admin. Partial matches are allowed. Case insensitive.
* `/scripts <name/id>` - Shows what scripts a player's game is running (**not** resources!)

### Config
*Configuration is in JSON format. Manual changes will be overwritten when the resource stops*
* admins = (Array) list of admins, each an object containing name, IP, user token, admin that added them, and a date when they were added
* bans = (Array) list of bans, each an object containing name, IP, user token, admin who banned, date of ban, and reason (if a reason was supplied)
* blockedScripts = (Array) list of game scripts that are blocked from running

### Notes
* Bans record both name and IP, but only IP is used to prevent the player from connecting.
* Admins will automatically be given admin powers when connecting with *both* IP and name in the list.
* Any admin can give or take another player's admin. Use caution when giving people admin powers.
* Admins can use built-in server commands, such as resource `/stop, /start, /restart, and /refresh` commands.
* Admins can use the `/scripts` command to see what scripts a player's game is running.
* Game scripts above are **not** GTAC resources. They are the game scripts (usually SCM or SCO) that the game uses to provide content (like in singleplayer). However, some mods and trainers use this system to provide their own features.
* The config.json uses JSON format, and shouldn't be edited manually.
* Any manual changes to config.json will be overwritten when the resource stops.
