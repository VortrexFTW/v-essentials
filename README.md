# Vortrex's Essential Resources (v-essentials)
For GTA Connected and Mafia Connected
Publicly available for anybody to use. I hope you find some of these useful.

## Donating
These resources will always be free to use, but your support is greatly appreciated! If you would like to support me, you can do so with any of these options:
* https://www.patreon.com/vortrexftw
* https://www.paypal.me/adrianbram

## Notes
* Some resources have a README.md file included. This file has more information about the resource and how to use it.
* Most of the simple resources here have only a server.js and client.js for the script files, but this isn't the "default" way of doing it. GTAC resources are very versatile and you can use any number of scripts and files with any names that you want. Simply update a resource's [meta.xml](https://wiki.gtaconnected.com/Resources#Meta.xml_File) to use them.

## Setup
1. Add these resources to your server's `resources` folder. If the `resources` folder does not exist, create it in your server's main folder.
2. Add the resources you want to use to your [server's config file](https://wiki.gtaconnected.com/ServerConfiguration) inside the `<resources>` section. The default file is server.xml, but you can use any file with the `-config` command line argument when starting the server. Here is a handy copy-paste, just remove the lines you don't need:
```xml
<resource src="cheatkeys" />
<resource src="mousecam" />
<resource src="v-admin" />
<resource src="v-afk" />
<resource src="v-audio" />
<resource src="v-chat" />
<resource src="v-cursor" />
<resource src="v-deathmessages" />
<resource src="v-extracontent" />
<resource src="v-fixes" />
<resource src="v-help" />
<resource src="v-hudtoggle" />
<resource src="v-interiors" />
<resource src="v-joinquit" />
<resource src="v-logo" />
<resource src="v-lookat" />
<resource src="v-nametags" />
<resource src="v-passenger" />
<resource src="v-playerblips" />
<resource src="v-playercolours" />
<resource src="v-runcode" />
<resource src="v-sandbox">
<resource src="v-scoreboard" />
<resource src="v-servernames" />
<resource src="v-spawn" />
<resource src="v-time" />
<resource src="v-translate" />
<resource src="v-weather" />
```

## Resources
### v-admin
Server management and moderation. People added as admin can kick, ban, etc. Bans are saved with IP, token, reason, admin, and timestamp.
Also has ability to block game trainers (GTA IV only) and built-in SCM/SCO game scripts (some trainers and mods use these and blocking them will prevent them being used on your server). Any player who joins with an admin's name but wrong token will be automatically kicked.

### v-afk
AFK detection using game focus/defocus (alt+tab). If `v-scoreboard` is loaded, it'll show "PAUSED" next to AFK players in the list. If `v-nametags` is loaded, the nametag will show a red "PAUSED" above AFK players heads.

### v-audio
Attach audio sounds to any element, including peds and players. Audio volume is based on distance to the element and a max volume defined by your scripts. Playback time is synced to all players so all players within range will hear the same part of the audio at the same time. Requires an instance of `v-extracontent` running to serve the audio files.

### v-chat
Enhanced chat features. Provides scrollable chat history, automatic translation, and converts emoji names or symbols (e.g. `:thumbsup:` or `:)`) to the actual emoji. If the `v-playercolours` resource is loaded, names in chat will show the player's colour, otherwise the names will be white.

### v-cursor
Adds a custom mouse cursor. Mafia Connected doesn't have a mouse cursor by default, so this is useful for that. It also works on GTA Connected but will be shown along with the default cursor. You can use a different cursor image by editing or replacing the `cursor.png` image file.

### v-deathmessages
Shows messages when a player dies, with killer name.

### v-extracontent
Makes it easy to add and use custom content on your server. Images, audio files, fonts, DFF models, TXD textures, COL collisions, excluded snow models, removed building/world models, rendering images in the 3D game world, spawning objects (including object groups) and moving gates/doors. **This resource is modular. It can be duplicated and any number of copies of this resource can be running at any time with any name**. This is useful if you want to serve different content on different servers, or some content across multiple servers to avoid forcing clients to re-download the same content when connecting to your other servers. Other resources that rely on files served by this `v-extracontent` template will use the first one it finds that has the content file (i.e. `v-audio` will use the first `v-extracontent` resource it finds that has the audio file).

### v-fixes
Adds custom scripting events and workarounds for things that GTAC doesn't have built-in. The events can be used in any other resource with any language [exactly like the built-in events](https://wiki.gtaconnected.com/HowTo/Events). Some events that pertain to an element (ped, vehicle, etc) are bindable to that element to be used with [bindEventHandler](https://wiki.gtaconnected.com/bindEventHandler) or called separately with [addEventHandler](https://wiki.gtaconnected.com/addEventHandler). Also adds syncing some element properties that GTAC doesn't sync by default. See the resource's README for more info.

### v-help
Shows commands and info for all the resources here that the server is running. Detects which resources are running and only shows commands for those.

### v-hudtoggle
Two simple keybinds to toggle HUD and chat on and off. Good for screenshots and stuff.
F7 to toggle HUD and F8 for chatbox.

### v-interiors
Currently only for Vice City. Enables interiors. Just walk up to the door to enter/exit.

### v-joinquit
Announces to all players when somebody joins or leaves the server.

### v-logo
Shows an image in the bottom right corner (default is GTAC/MafiaC logo)

### v-lookat
Only works on GTA SA. Makes player heads turn to face where they are looking. Also syncs to other players

### v-nametags
Custom nametags. GTA Connected has built-in nametags but they're ugly. Mafia Connected doesn't provide nametags built-in.

### v-passenger
Adds pressing the "G" key to enter as passenger. GTA Connected only.

### v-playerblips
Adds blips that show where players are.

### v-playercolours
Assigns a random colour to each player. This will also show player colours on other resources that use it (`v-chat`, `v-nametags`, `v-scoreboard`, etc)

### v-runcode
**Caution** - *Allowing players to run server-side code in-game may pose a security risk!*. Adds commands to run code, available on both server and client. I don't recommend leaving it running all the time, only when you need to use it.

### v-sandbox
Adds a lot of commands to spawn and manipulate elements in the game world. Includes spawning vehicles, peds, objects, and more. It also has commands to manipulate the game world, such as changing the weather, time, etc. Basically provides a sandbox environment to do whatever you want.

### v-scoreboard
Adds a scoreboard/player-list, shown when holding the TAB key

### v-servernames
Changes the server name every X milliseconds (set in `config.json`), changing a random slogan/text on the end of your server name

### v-spawn
Spawns your player. Custom spawn points can be added by server admins using /addspawn.

### v-time
Real world time for your server. It can use real-world time or a custom time set in `config.json`.

### v-translate
Obsolete. Only included for legacy purposes and archive. The translation functionality has been added to `v-chat`

### v-weather
Real world weather for your server. It can use real-world weather or a custom weather set in `config.json`. Uses the WeatherAPI service to get real-world weather data. Also allows setting whether snow is enabled or not.
