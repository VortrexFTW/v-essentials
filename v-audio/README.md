# v-audio
## Provides positional audio

### Instructions
* Put the `v-audio` resource into your server `resources` folder
* Add the `v-audio` resource to your server config and start the server
* Start GTAC/MafiaC and connect to your server

### Usage
Add your audio file(s) to a copy of the `v-extracontent` resource and run on your server. Then in any script, attach a `v.audio` data using [`element.setData`](https://wiki.gtaconnected.com/element.setData) using the structure: `[String soundName, Float distance]`. Remember to set the sync option in setData to true!

### Commands
*This resource does not provide any commands*

### Notes
* This resource will provide positional audio
* The audio volume is based on distance to the element it's attached to
* Can be used with any element type, even attached to players :D
* **Requires** any instance of a `v-extracontent` resource to serve the files! This will use the first one it finds that has the audio source.