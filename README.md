# Vortrex's GTAC Resources
Publicly available for anybody to use. I hope you find some of these useful.

## Resources
### v-admin
Server management and moderation. People added as admin can kick, ban, etc. Bans are saved with IP, reason, admin, and timestamp.
Also has ability to block game scripts (some trainers and mods use these and blocking them will prevent them being used on your server.)

### v-afk
AFK detection using game focus/defocus (alt+tab). If `v-scoreboard` is loaded, it'll show "PAUSED" next to AFK players in the list. If `v-nametags` is loaded, the nametag will show a red "PAUSED" above AFK players heads.

### v-chat
Custom chat. Converts emoji names (e.g. `:thumbsup:`) to the actual emoji. If the `v-playercolours` resource is loaded, names in chat will show the player's colourm, otherwise the names will be white.

### v-deathmessages
Shows messages when a player dies, with killer name.

### v-events
Adds custom scripting events for things that GTAC doesn't have built-in. These events can be used in any other resource with any language exactly like the built-in events. Some events that pertain to an element (ped, vehicle, etc) are bindable to that element to be used with bindEventHandler, but this is optional. You can use addEventHandler too.

### v-extracontent
Makes it easy to add and use custom content on your server. Images audio files, fonts, DFF models, TXD textures, COL collisions, excluded snow models, removed building/world models, rendering images in the 3D game world, spawning server objects (both grouped and ungrouped) and moving gates/doors.

### v-help
Shows commands and info for all the resources here that the server is running. Detects which resources are running and only shows commands for those.

### v-hudtoggle
Two simple keybinds to toggle HUD and chat on and off. Good for screenshots and stuff.
F7 to toggle HUD and F8 for chatbox.

### v-interiors
Currently only for Vice City. Enables interiors. Just walk up to the door to enter/exit.

### v-joinquit
Announces to all players when somebody joins or leaves the server.

### v-lookat
Only works on GTA SA. Makes player heads turn to face where they are looking. Also syncs to other players

### v-nametags
Alternative nametags for GTAC. The built-in ones are ugly.

### v-passenger
Adds pressing the "G" key to enter as passenger

### v-playerblips
Adds blips that show where players are

### v-playercolours
Assigns a random colour to each player. This will also show player colours on other resources that use it (`v-chat`, `v-nametags`, `v-scoreboard`, etc)

### v-runcode
**Caution** - Adds commands to run code, available on both server and client. Allowing players to run server-side code in-game may pose a security risk. I don't recommend leaving it running all the time, only when you need to use it.

### v-scoreboard
Adds a scoreboard/player-list, shown when holding the TAB key

### v-servernames
Changes the server name every X milliseconds (set in `config.json`), changing a random slogan/text on the end of your server name

### v-spawnscreen
Spawns your player at a specified place. GTA 3 spawns at Leone Mansion, Vice City at Vercetti Mansion, San Andreas at CJ's house in Grove Street, and IV at Happiness Island.

### v-starttime
Sets the server time to a specified hour and minute, configured with cvars "hour" and "minute" in `server.xml`

### v-translate
Obsolete. Only included for legacy purposes and archive. The translation functionality has been added to `v-chat`
