# v-extracontent
## Provides extra content (sounds, images, objects, etc)

### Instructions
* Put the `v-extracontent` resource into your server `resources` folder
* Add the `v-extracontent` resource to server.xml and start the server
* Put files that need to be downloaded to the client, and add a `<file>` entry for each file to `meta.xml`
* Edit the `config.json` file in the `v-extracontent` resource folder to add your content (see #Types below)
* Start your server (or start/restart the resource with `/(re)start v-extracontent` command)

### Config
*Configuration is in JSON format.*
* sounds = (Array) a list of sounds
* images = (Array) a list of images
* models = (Array) a list of models (GTA III and Vice City only)
* textures = (Array) a list of textures (GTA III and Vice City only)
* collisions = (Array) a list of collisions (GTA III and Vice City only)
* excludedSnowModels = (Array) a list of models to exclude from snow effects (GTA III, Vice City, and San Andreas only)
* worldImages = (Array) a list of images to render in the world, i.e. billboards (Mafia 1 only)
* customGameFiles = (Array) a list of custom game files to load (Mafia 1 only)
* objects = (Array) a list of objects to spawn (GTA III, Vice City, and San Andreas only)
* groupedObjects = (Array) a list of objects grouped by position (GTA III, Vice City, and San Andreas only)
* gates = (Array) a list of objects that can be opened/closed via movement (GTA III, Vice City, and San Andreas only)
* syncedGates = (Array) a list of gates that are moved together, like double doors (GTA III, Vice City, and San Andreas only)

### Types
* *sounds* = `[String referenceName, String filePath, Bool loop, Float distance]`
* *images* = `[String referenceName, String filePath, Integer width, Integer height]`
* *models* = `[Integer modelId, String filePath]`
* *textures* = `[String txdName, String filePath]`
* *collisions* = `[Integer objectId, String filePath]`
* *excludedSnowModels* = `[String objectName]`
* *worldImages* = `[String referenceName, String filePath, Array <Float x, Float y, Float z> positions]`
* *customGameFiles* = `[String filePath, String gameFilePath]`
* *objects* = `[Integer objectId, Float x, Float y, Float z, Float rx, Float ry, Float rz]`
* *groupedObjects* = `[String referenceName, Array <objectInfo>]` - objectInfo is same as in *objects*
* *gates* = `[String referenceName, Integer objectId, Float closedX, Float closedY, Float closedZ, Float closedRotationX, Float closedRotationY, Float closedRotationZ,
			Float openX, Float openY, Float openZ, Float openRotationX, Float openRotationY, Float openRotationZ]`
* *syncedGates* = `[String referenceName, String gateReferenceName1, String gateReferenceName2]`

### Notes
* Reference names are used to identify contents and can be used in other scripts or resources. They should be unique (e.g., two sounds cannot have the same reference name).
* This resource is designed to be duplicated and have multiple loaded (with different names). This way you can have different sets of content for different servers or game modes, and/or the same running on multiple servers. For example, if you run a server across multiple games, you could have a generic `v-extracontent` resource for shared content, and then have something like `v-extracontent-gta3`, `v-extracontent-vc`, `v-extracontent-sa`, etc. for game-specific content. Any other v-essentials resources that depend on the content provided here (i.e. v-audio) will search all running v-extracontent resources for the requested content. There is no limit to how many v-extracontent resources you can run, but they must all have unique names and the content must not conflict (e.g., two sounds with the same reference name).