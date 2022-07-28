# v-admin
## Provides admin and ban commands

### Commands
* `/kick <name/id> <reason>` - Kicks a player from the server
* `/ban <name/id> <reason>` - Bans a player from the server. Partial matches are allowed. Case insensitive.
* `/unban <name/id>` - Unbans a player from the server. Partial matches are allowed. Case insensitive.
* `/makeadmin <name/id>` - Makes a player an admin. Partial matches are allowed. Case insensitive.
* `/scripts <name/id>` - Shows what scripts a player's game is running (**not** resources!)

### Config
* admins = (Array) list of admins, each an object containing name, IP, admin that added them, and a date when they were added
* bans = (Array) list of bans, each an object containing name, IP, admin who banned, date of ban, and reason (if a reason was supplied)
* blockedScripts = (Array) list of game scripts that are blocked from running

### Notes
* Bans record both name and IP, but only IP is used to prevent the player from connecting.
* Admins will automatically be given admin powers when connecting with *both* IP and name in the list.
* Any admin can give or take another player's admin. Use caution when giving people admin powers.
* Admins can use built-in server commands, such as resource `/stop, /start, /restart, and /refresh` commands.
* Admins can use the `/scripts` command to see what scripts a player's game is running.
* Game scripts above are **not** GTAC resources. They are the game scripts (usually SCM or SCO) that the game uses to provide content (like in singleplayer). However, some mods and trainers use this system to provide their own features.