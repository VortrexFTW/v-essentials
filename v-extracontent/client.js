"use strict";

// ===========================================================================

let resourceStarted = false;
let resourceReady = false;
let resourceInit = false;

let customWorldGraphicsReady = false;

let movingGates = [];

let otherContentResources = [];

// ===========================================================================

const STREAM_DISTANCE_EXTREME = 1000.0;
const STREAM_DISTANCE_HIGH = 500.0;
const STREAM_DISTANCE_MEDIUM = 250.0;
const STREAM_DISTANCE_LOW = 100.0;

const IMAGE_TYPE_NONE = 0;
const IMAGE_TYPE_PNG = 1;
const IMAGE_TYPE_BMP = 2;

// ===========================================================================

exportFunction("getCustomAudio", getCustomAudio);
exportFunction("stopCustomAudio", stopCustomAudio);
exportFunction("playCustomAudio", playCustomAudio);
exportFunction("setCustomAudioVolume", setCustomAudioVolume);
exportFunction("setCustomAudioPosition", setCustomAudioPosition);
exportFunction("getCustomImage", getCustomImage);
exportFunction("getCustomFont", getCustomFont);

// ===========================================================================

class CustomSound {
	constructor(file, loop = false, volume = 1, length = 0) {
		this.filePath = file;
		this.loop = loop;
		this.volume = volume;
		this.length = length; // In seconds
		this.object = null;
	}
}

// ===========================================================================

class CustomImage {
	constructor(filePath, type, width = -1, height = -1) {
		this.filePath = filePath;
		this.width = width;
		this.height = height;
		this.type = type;
	}
}

// ===========================================================================

class CustomDefaultFont {
	constructor(name, size = 12.0, weight = "Regular") {
		this.name = name;
		this.size = size;
		this.weight = weight;
		this.object = lucasFont.createDefaultFont(size, name, weight);
	}
}

// ===========================================================================

class CustomFont {
	constructor(filePath, size = 12.0, weight = "Regular") {
		this.filePath = filePath;
		this.size = size;
		this.weight = weight;
		this.object = loadCustomFont(filePath, size);
	}
}

// ===========================================================================

class RemovedWorldObject {
	constructor(modelName, x, y, z, radius) {
		this.modelName = modelName;
		this.position = new Vec3(x, y, z);
		this.radius = radius;
	}
}

// ===========================================================================

class CustomModel {
	constructor(modelId, filePath) {
		this.filePath = filePath;
		this.modelId = modelId;
	}
}

// ===========================================================================

class CustomTexture {
	constructor(textureName, filePath) {
		this.filePath = filePath;
		this.textureName = textureName;
	}
}

// ===========================================================================

class CustomCollision {
	constructor(objectId, filePath) {
		this.filePath = filePath;
		this.objectId = objectId;
	}
}

// ===========================================================================

class CustomWorldGraphicsRendering {
	constructor(imageName, points) {
		this.imageName = imageName;
		this.points = points;
	}
}

// ===========================================================================

// MAFIA 1 ONLY
class CustomGameFile {
	constructor(gameFilePath, customFilePath) {
		this.gameFilePath = gameFilePath;
		this.customFilePath = customFilePath;
	}
}

// ===========================================================================

class ServerObject {
	constructor(modelId, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, dimension = -1, interior = 0, streamDistance = STREAM_DISTANCE_MEDIUM) {
		this.modelId = modelId;
		this.position = new Vec3(positionX, positionY, positionZ);
		this.rotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
		this.object = false;
		this.dimension = dimension;
		this.interior = interior;
		this.index = -1;
		this.streamDistance = streamDistance;
	}
}

// ===========================================================================

class ServerObjectGroup {
	constructor(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, objects, dimension = -1, interior = 0, streamDistance = STREAM_DISTANCE_MEDIUM) {
		this.objects = objects;
		this.position = new Vec3(positionX, positionY, positionZ);
		this.rotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
		this.dimension = dimension;
		this.interior = interior;
		this.index = -1;
		this.streamDistance = streamDistance;
	}
}

// ===========================================================================

class ServerGate {
	constructor(name, modelId, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, openPositionX, openPositionY, openPositionZ, openRotationX, openRotationY, openRotationZ, dimension = -1, interior = 0, extra = {}) {
		this.object = false;
		this.modelId = modelId;
		this.name = name;
		this.closedPosition = new Vec3(positionX, positionY, positionZ);
		this.closedRotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
		this.openPosition = new Vec3(openPositionX, openPositionY, openPositionZ);
		this.openRotation = new Vec3(degToRad(openRotationX), degToRad(openRotationY), degToRad(openRotationZ));
		this.dimension = dimension;
		this.interior = interior;
		this.index = -1;
		this.opened = false;
		this.beingMoved = false;
		this.moveInterpolateRatio = -1.0;
		this.rotateInterpolateRatio = -1.0;
		this.moveInterpolateIncrement = (typeof extra.moveRatioIncrement != "undefined") ? extra.moveRatioIncrement : 0.02;
		this.rotateInterpolateIncrement = (typeof extra.rotateRatioIncrement != "undefined") ? extra.rotateRatioIncrement : 0.02;
		this.openRelative = (typeof extra.openRelative != "undefined") ? extra.openRelative : true;
		this.proximityTriggerDistance = (typeof extra.proximityTriggerDistance != "undefined") ? extra.proximityTriggerDistance : 0.0;
		this.streamDistance = (typeof extra.streamDistance != "undefined") ? extra.streamDistance : STREAM_DISTANCE_MEDIUM;
		this.clientsInRange = [];
	}
}

// ===========================================================================

class ServerSyncedGate {
	constructor(gate1, gate2) {
		this.gate1 = gate1;
		this.gate2 = gate2;
	}
}

// ===========================================================================

class MovingGate {
	constructor(gateObjectId, gateId, startPosition, endPosition, startRotation, endRotation, positionInterpolationRatioIncrement, rotationInterpolationRatioIncrement) {
		this.gateObjectId = gateObjectId;
		this.gateId = gateId;
		this.startPosition = startPosition;
		this.endPosition = endPosition;
		this.startRotation = startRotation;
		this.endRotation = endRotation;
		this.positionInterpolationRatioIncrement = positionInterpolationRatioIncrement;
		this.rotationInterpolationRatioIncrement = rotationInterpolationRatioIncrement;
		this.positionInterpolateRatio = 0.0;
		this.rotationInterpolateRatio = 0.0;
	}
}

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	exportFunction("isCustomContentResource", function () { return true; });

	resourceReady = true;
	if (resourceStarted && !resourceInit) {
		initResource();
	}
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	exportFunction("isCustomResource", function () { return true; });

	resourceStarted = true;
	if (resourceReady && !resourceInit) {
		initResource();
	}
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
	if (game.game <= GAME_GTA_VC) {
		game.undoEntityInvisibilitySettings();
		groundSnow.clearModelExclusions();
	}

	if (typeof game.removeCustomGameFile != "undefined") {
		for (let i in customGameFiles) {
			game.removeCustomGameFile(customGameFiles[i].filePath);
		}
	}
});

// ===========================================================================

addEventHandler("OnDrawHUD", function (event) {
	if (game.game <= GAME_GTA_SA) {
		renderCustomWorldGraphics();
	}
});

// ===========================================================================

addNetworkHandler("moveGate", function (gateObjectId, gateId, startPosition, endPosition, startRotation, endRotation, positionInterpolationRatioIncrement, rotationInterpolationRatioIncrement) {
	movingGates.push(new MovingGate(gateObjectId, gateId, startPosition, endPosition, startRotation, endRotation, positionInterpolationRatioIncrement, rotationInterpolationRatioIncrement));
});

// ===========================================================================

function initResource() {
	resourceInit = true;

	for (let i in customImages) {
		let imageFile = openFile(customImages[i].filePath);
		customImages[i].object = null;
		if (imageFile != null) {
			if (customImages[i].fileType == IMAGE_TYPE_BMP) {
				customImages[i].object = drawing.loadBMP(imageFile);
			} else {
				customImages[i].object = drawing.loadPNG(imageFile);
			}
			imageFile.close();
		}
	}

	if (typeof game.loadTXD != "undefined") {
		for (let i in customTextures) {
			let textureName = `${customTextures[i].textureName}`;
			let txdFile = openFile(customTextures[i].filePath);
			if (txdFile != null) {
				game.loadTXD(textureName, txdFile);
				txdFile.close();
			}
		}
	}

	if (typeof game.loadDFF != "undefined") {
		for (let i in customModels) {
			let dffFile = openFile(customModels[i].filePath);
			if (dffFile != null) {
				game.loadDFF(customModels[i].modelId, dffFile);
				dffFile.close();
			}
		}
	}

	if (typeof game.loadCOL != "undefined") {
		for (let i in customCollisions) {
			let colFile = openFile(customCollision.filePath);
			if (colFile != null) {
				game.loadCOL(colFile, customCollision.objectId);
				colFile.close();
			}
		}
	}

	if (typeof game.removeWorldObject != "undefined") {
		for (let i in removedWorldObjects) {
			game.removeWorldObject(removedWorldObjects[i].modelName, removedWorldObjects[i].position, removedWorldObjects[i].radius);
		}
	}

	if (typeof groundSnow != "undefined") {
		if (typeof groundSnow.excludeModel != "undefined") {
			for (let i in excludedSnowModels) {
				groundSnow.excludeModel(excludedSnowModels[i]);
			}
		}
	}

	if (typeof game.setCustomText != "undefined") {
		for (let i in customGameTexts) {
			game.setCustomText(customGameTexts[i][0], customGameTexts[i][1]);
		}
	}

	// Mafia 1
	if (typeof game.addCustomGameFile != "undefined") {
		for (let i in customGameFiles) {
			game.addCustomGameFile(customGameFiles[i].filePath, customGameFiles[i].gameFilePath);
		}
	}

	customWorldGraphicsReady = true;
	createAllServerObjects();
}

// ===========================================================================

addEventHandler("OnResourceStart", function (event, resource) {
	let resources = getResources();
	for (let i in resources) {
		if (resources[i].isStarted && resources[i].isReady && resources[i].name != thisResource.name) {
			if (resources[i].getExport("isCustomResource")) {
				if (!otherContentResources.includes(resources[i].name)) {
					otherContentResources.push(resources[i].name);
				}
			} else {
				if (otherContentResources.includes(resources[i].name)) {
					otherContentResources.splice(otherContentResources.indexOf(resources[i].name), 1);
				}
			}
		}
	}
});

// ===========================================================================

function getCustomAudio(soundName) {
	if (typeof customAudios[soundName] != "undefined") {
		let audioFile = openFile(customAudios[soundName].filePath);
		if (audioFile != null) {
			let audioObject = null;
			if (customAudios[soundName].length > 0) {
				audioObject = audio.createSound(audioFile, customAudios[soundName].loop);
			} else {
				audioObject = audio.createSoundFromURL(customAudios[soundName].filePath, customAudios[soundName].loop);
			}
			audioFile.close();
			return audioObject;
		} else {
			return null;
		}
	}

	return false;
}

// ===========================================================================

function getCustomAudioLength(soundName) {
	if (typeof customAudios[soundName] != "undefined") {
		return customAudios[soundName].length; // Return the length in seconds
	}
	return 0;
}

// ===========================================================================

function playCustomAudio(soundName) {
	let audioObject = getCustomAudio(soundName);

	if (audioObject != null) {
		audioObject.volume = volume;
		audioObject.play();
		return audioObject;
	}
	return false;
}

// ===========================================================================

function setCustomAudioVolume(soundName, volume = 0.5) {
	let audioObject = getCustomAudio(soundName);

	if (audioObject != null) {
		audioObject.volume = volume;
	}
	return false;
}

// ===========================================================================

function setCustomAudioPosition(soundName, position = 0) {
	let audioObject = getCustomAudio(soundName);

	if (audioObject != null) {
		audioObject.position = position;
	}
	return false;
}

// ===========================================================================

function stopCustomAudio(soundName) {
	let audioObject = getCustomAudio(soundName);

	if (audioObject != null) {
		audioObject.stop();
	}
	return false;
}

// ===========================================================================

function getCustomImage(imageName) {
	if (typeof customImages[imageName] != "undefined") {
		if (customImages[imageName].object != null) {
			return customImages[imageName].object;
		}
	}
	return false;
}

// ===========================================================================

function getCustomFont(fontName) {
	if (typeof customFonts[fontName] != "undefined") {
		if (customFonts[fontName].object != null) {
			return customFonts[fontName].object;
		}
	}
	return false;
}

// ===========================================================================

function loadCustomFont(fontPath, size) {
	let font = null;
	let fontStream = openFile(fontPath);
	if (fontStream != null) {
		font = lucasFont.createFont(fontStream, size);
		fontStream.close();
	}

	return font;
}

// ===========================================================================

function renderCustomWorldGraphics() {
	if (!customWorldGraphicsReady) {
		return false;
	}

	if (game.game > GAME_GTA_VC) {
		return false;
	}

	for (let i in worldGraphicsRenderings) {
		if (getCustomImage(worldGraphicsRenderings[i].imageName) != false) {
			game.rwRenderStateSet(rwRENDERSTATEFOGENABLE, 1);
			game.rwRenderStateSet(rwRENDERSTATEZWRITEENABLE, 1);
			game.rwRenderStateSet(rwRENDERSTATEVERTEXALPHAENABLE, 1);
			game.rwRenderStateSet(rwRENDERSTATESRCBLEND, rwBLENDSRCALPHA);
			game.rwRenderStateSet(rwRENDERSTATEDESTBLEND, rwBLENDINVSRCALPHA);
			game.rwRenderStateSet(rwRENDERSTATETEXTURERASTER, getCustomImage(worldGraphicsRenderings[i].imageName));
			game.rwRenderStateSet(rwRENDERSTATETEXTUREFILTER, rwFILTERLINEAR);
			game.rwRenderStateSet(rwRENDERSTATEVERTEXALPHAENABLE, 1);
			game.rwRenderStateSet(rwRENDERSTATETEXTUREADDRESS, rwTEXTUREADDRESSCLAMP);

			graphics.drawQuad3D(worldGraphicsRenderings[i].points[0], worldGraphicsRenderings[i].points[1], worldGraphicsRenderings[i].points[2], worldGraphicsRenderings[i].points[3], COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE);
		}
	}
}

// ===========================================================================

function checkMovingGates() {
	for (let i in movingGates) {
		if (movingGates[i].positionInterpolateRatio <= 1.0) {
			movingGates[i].positionInterpolateRatio = movingGates[i].positionInterpolateRatio + movingGates[i].positionInterpolationRatioIncrement;
			movingGates[i].rotationInterpolateRatio = movingGates[i].rotationInterpolateRatio + movingGates[i].rotationInterpolationRatioIncrement;
			getElementFromId(movingGates[i].gateObjectId).position = movingGates[i].startPosition.interpolate(movingGates[i].endPosition, movingGates[i].positionInterpolateRatio);
			getElementFromId(movingGates[i].gateObjectId).setRotation(movingGates[i].startRotation.interpolate(movingGates[i].endRotation, movingGates[i].rotationInterpolateRatio));
		} else {
			movingGates[i].positionInterpolateRatio = -1.0;
			movingGates[i].rotationInterpolateRatioIncrement = -1.0;

			//triggerNetworkEvent("moveGateFinished", movingGates[i].gateId);
			movingGates.splice(i, 1);
		}
	}
}

// ===========================================================================

function createAllServerObjects() {
	for (let i in serverObjects) {
		serverObjects[i].index = i;
		serverObjects[i].object = gta.createObject(serverObjects[i].modelId, serverObjects[i].position);
		serverObjects[i].object.rotation = serverObjects[i].rotation;
		serverObjects[i].object.streamInDistance = serverObjects[i].streamDistance;
		serverObjects[i].object.streamOutDistance = serverObjects[i].streamDistance + 50.0;

		if (serverObjects[i].interior != -1) {
			serverObjects[i].object.interior = serverObjects[i].interior;
		}

		if (serverObjects[i].dimension == -1) {
			serverObjects[i].object.netFlags.onAllDimensions = true;
		} else {
			serverObjects[i].object.dimension = serverObjects[i].dimension;
			serverObjects[i].object.netFlags.onAllDimensions = false;
		}
	}

	for (let i in serverObjectGroups) {
		serverObjectGroups[i].index = i;
		for (let j in serverObjectGroups[i].objects) {
			serverObjectGroups[i].objects[j].index = i;
			serverObjectGroups[i].objects[j].object = gta.createObject(serverObjectGroups[i].objects[j].modelId, applyOffsetToVector(serverObjectGroups[i].position, serverObjectGroups[i].objects[j].position));
			serverObjectGroups[i].objects[j].object.rotation = applyOffsetToVector(serverObjectGroups[i].rotation, serverObjectGroups[i].objects[j].rotation);
			serverObjectGroups[i].objects[j].object.streamInDistance = serverObjectGroups[i].objects[j].streamDistance;
			serverObjectGroups[i].objects[j].object.streamOutDistance = serverObjectGroups[i].objects[j].streamDistance + 50.0;

			if (serverObjectGroups[i].objects[j].interior != -1) {
				serverObjectGroups[i].objects[j].object.interior = serverObjectGroups[i].objects[j].interior;
			}

			if (serverObjectGroups[i].objects[j].dimension == -1) {
				serverObjectGroups[i].objects[j].object.netFlags.onAllDimensions = true;
			} else {
				serverObjectGroups[i].objects[j].object.dimension = serverObjectGroups[i].dimension;
				serverObjectGroups[i].objects[j].object.netFlags.onAllDimensions = false;
			}
		}
	}

	for (let i in serverGates) {
		serverGates[i].index = i;
		serverGates[i].object = gta.createObject(serverGates[i].modelId, serverGates[i].closedPosition);
		serverGates[i].object.rotation = serverGates[i].closedRotation;
		serverGates[i].object.streamInDistance = serverGates[i].streamDistance;
		serverGates[i].object.streamOutDistance = serverGates[i].streamDistance + 50.0;

		if (serverGates[i].object.interior != -1) {
			serverGates[i].object.interior = serverGates[i].interior;
		}

		if (serverGates[i].dimension == -1) {
			serverGates[i].object.netFlags.onAllDimensions = true;
		} else {
			serverGates[i].object.dimension = serverGates[i].dimension;
			serverGates[i].object.netFlags.onAllDimensions = false;
		}
	}
}

// ===========================================================================

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ===========================================================================

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ===========================================================================

function applyOffsetToVector(position, position2) {
	return new Vec3(position.x + position2.x, position.y + position2.y, position.z + position2.z);
}

// ===========================================================================

function getOffsetFromVector(position2, position) {
	return new Vec3(position.x - position2.x, position.y - position2.y, position.z - position2.z);
}

// ===========================================================================

function triggerServerGate(gateName, force = false, open = true) {
	let gateId = getServerGateByName(gateName);
	moveServerGate(gateId, !serverGates[gateId].opened, true);
}

// ===========================================================================

function getServerGateByName(gateName) {
	for (let i in serverGates) {
		if (serverGates[i].name.toLowerCase() == gateName.toLowerCase()) {
			return i;
		}
	}
}

// ===========================================================================

function moveServerGate(gateId, open = true, applyToSyncedGates = true) {
	let startPosition = (open) ? serverGates[gateId].closedPosition : applyOffsetToVector(serverGates[gateId].closedPosition, serverGates[gateId].openPosition);
	let endPosition = (open) ? applyOffsetToVector(serverGates[gateId].closedPosition, serverGates[gateId].openPosition) : serverGates[gateId].closedPosition;

	let startRotation = (open) ? serverGates[gateId].closedRotation : applyOffsetToVector(serverGates[gateId].closedRotation, serverGates[gateId].openRotation);
	let endRotation = (open) ? applyOffsetToVector(serverGates[gateId].closedRotation, serverGates[gateId].openRotation) : serverGates[gateId].closedRotation;

	if (serverGates[gateId].object.syncer == -1) {
		serverGates[gateId].object.position = endPosition;
		serverGates[gateId].object.setRotation(endPosition);
		return false;
	}

	serverGates[gateId].opened = open;
	triggerNetworkEvent("moveGate", null, serverGates[gateId].object.id, gateId, startPosition, endPosition, startRotation, endRotation, serverGates[gateId].moveInterpolateIncrement, serverGates[gateId].rotateInterpolateIncrement);

	if (applyToSyncedGates == true) {
		for (let i in serverSyncedGates) {
			if (serverSyncedGates[i].gate1 == serverGates[gateId].name) {
				moveServerGate(getServerGateByName(serverSyncedGates[i].gate2), open, false);
			}
		}
	}
}

// ===========================================================================

addNetworkHandler("moveGateFinished", function (client, gateId) {
	if (serverGates[gateId].object.syncer == client.index) {
		serverGates[gateId].beingMoved = false;
	}
});

// ===========================================================================