"use strict";

// ===========================================================================

let customAudios = {

};

// ===========================================================================

let customImages = {
};

// ===========================================================================

let customModels = [
	//new CustomModel(1000, "files/game/some-folder/file.dff")
];

// ===========================================================================

let customTextures = [
	//new CustomTexture("txdname", "files/game/some-folder/file.txd", 0)
];

// ===========================================================================

let customCollisions = [
	//new CustomCollision(ISLAND_GENERIC, "files/game/some-folder/file.col")
];

// ===========================================================================

let removedWorldObjects = [
	//new RemovedWorldObject("someobject", 0.0, 0.0, 0.0, 100.0)
];

// ===========================================================================

let excludedSnowModels = [
	//"someobject",
	//"anotherobject",
];

// ===========================================================================

let worldGraphicsRenderings = [
	/*
	new CustomWorldGraphicsRendering("name-from-custom-images-above",
		[
			[0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0],
			...
		]
	)
	*/
];

// ===========================================================================

let customGameTexts = [
	//["some_text_key", "Some text value"],
];

// ===========================================================================

// Mafia 1 only
let customGameFiles = [
	// Both paths are relative. The game file path (1st arg) is relative to the game's main folder where game.exe is located.
	// The custom file path (2nd arg) is relative to the resource's folder. The file must also be included in meta.xml so it gets downloaded to the client.
	// Example: new CustomGameFile("MISSIONS\\FREERIDE\\scene2.bin", "files/missions/freeride/scene2.bin");
];

// ===========================================================================