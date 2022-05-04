"use strict";

// ===========================================================================

let resourceStarted = false;
let resourceReady = false;
let resourceInit = false;

let customWorldGraphicsReady = false;

// ===========================================================================

let movingGates = [];
let gateCheckTimer = null;

// ===========================================================================

const IMAGE_TYPE_NONE = 0;
const IMAGE_TYPE_PNG = 1;
const IMAGE_TYPE_BMP = 2;

// ===========================================================================

exportFunction("getCustomModel", getCustomModel);
exportFunction("getCustomTexture", getCustomTexture);
exportFunction("getCustomCollision", getCustomCollision);
exportFunction("getCustomAudio", getCustomAudio);
exportFunction("playCustomAudio", playCustomAudio);
exportFunction("getCustomImage", getCustomImage);
exportFunction("getCustomFont", getCustomFont);

// ===========================================================================

class CustomAudio {
    constructor(file, loop = false, volume = 1, effects = []) {
        this.filePath = file,
        this.loop = loop,
        this.volume = volume,
        this.effects = effects;
        this.object = null;

        //let audioFile = openFile(this.filePath);
        //if(audioFile) {
        //    this.object = audio.createSound(audioFile, this.loop);
        //    audioFile.close();
        //}
    }
}

// ===========================================================================

class CustomImage {
    constructor(filePath, type, width = -1, height = -1) {
        this.filePath = filePath;
        this.width = width;
        this.height = height;
        this.type = type;

        //let imageFile = openFile(this.filePath);
        //if(imageFile) {
        //    this.object = (this.type == IMAGE_TYPE_BMP) ? graphics.loadBMP(imageFile) : graphics.loadPNG(imageFile);
        //    imageFile.close();
        //}
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
        this.image = null;
        this.drawDistance = 100.0;
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

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
    resourceReady = true;
    if(resourceStarted && !resourceInit) {
        initResource();
    }
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
    resourceStarted = true;
    if(resourceReady && !resourceInit) {
        initResource();
    }
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
    game.undoEntityInvisibilitySettings();
    groundSnow.clearModelExclusions();
    collectAllGarbage();
});

// ===========================================================================

addEventHandler("OnRender", function(event) {
    renderCustomWorldGraphics();
});

// ===========================================================================

addNetworkHandler("moveGate", function(gateObjectId, gateId, startPosition, endPosition, startRotation, endRotation, positionInterpolationRatioIncrement, rotationInterpolationRatioIncrement) {
    movingGates.push(new MovingGate(gateObjectId, gateId, startPosition, endPosition, startRotation, endRotation, positionInterpolationRatioIncrement, rotationInterpolationRatioIncrement));
});

// ===========================================================================

function initResource() {
    resourceInit = true;

    //for(let i in customAudios) {
    //    let audioFile = openFile(customAudios[i].file);
    //    if(audioFile != null) {
    //        customAudios[i].object = audio.createSound(audioFile, customAudios[i].loop);
    //        audioFile.close();
    //    }
    //}

    for(let i in customImages) {
        let imageFile = openFile(customImages[i].file);
        if(imageFile != null) {
            if(customImages[i].fileType == IMAGE_TYPE_BMP) {
                customImages[i].object = drawing.loadBMP(imageFile);
            } else {
                customImages[i].object = drawing.loadPNG(imageFile);
            }
            imageFile.close();
        }
    }

    for(let i in customTextures) {
        let textureName = `${customTextures[i].textureName}`;
        let txdFile = openFile(customTextures[i].filePath);
        if(txdFile != null) {
            gta.loadTXD(textureName, txdFile);
            txdFile.close();
        }
    }

    for(let i in customModels) {
        let dffFile = openFile(customModels[i].filePath);
        if(dffFile != null) {
            gta.loadDFF(customModels[i].modelId, dffFile);
            dffFile.close();
        }
    }

    for(let i in customCollisions) {
        let colFile = openFile(customCollisions[i].filePath);
        if(colFile != null) {
            gta.loadCOL(colFile, customCollisions[i].objectId);
            colFile.close();
        }
    }

    for(let i in removedWorldObjects) {
        game.removeWorldObject(removedWorldObjects[i].modelName, removedWorldObjects[i].position, removedWorldObjects[i].radius);
        //game.setVisibilityOfClosestObjectOfType(removedWorldObjects[i].position, removedWorldObjects[i].radius, removedWorldObjects[i].modelName, false);
    }

    for(let i in excludedSnowModels) {
        groundSnow.excludeModel(excludedSnowModels[i]);
    }

    customWorldGraphicsReady = true;
}

// ===========================================================================

function getCustomModel(modelName) {
    if(typeof customModels[modelName] != "undefined") {
        return customModels[modelName];
    }
    return false;
}

// ===========================================================================

function getCustomTexture(textureName) {
    if(typeof customTextures[textureName] != "undefined") {
        return customTextures[textureName];
    }
    return false;
}

// ===========================================================================

function getCustomCollision(collisionName) {
    if(typeof customCollisions[collisionName] != "undefined") {
        return customCollisions[collisionName];
    }
    return false;
}

// ===========================================================================

function getCustomAudio(soundName) {
    if(typeof customAudios[soundName] != "undefined") {
        customAudios[soundName].object = audio.createSound(audioFile, customAudios[i].loop);
        return customAudios[soundName].object;
    }
    return false;
}

// ===========================================================================

function playCustomAudio(soundName, volume = 0.5, loop = false) {
    if(typeof customAudios[soundName] != "undefined") {
        customAudios[soundName].object = audio.createSound(audioFile, customAudios[i].loop);
        customAudios[soundName].object.volume = volume;
        customAudios[soundName].object.play();
    }
    return false;
}

// ===========================================================================

function getCustomImage(imageName) {
    if(typeof customImages[imageName] != "undefined") {
        if(customImages[imageName].object != null) {
            return customImages[imageName].object;
        }
    }
    return false;
}

// ===========================================================================

function getCustomFont(fontName) {
    if(typeof customFonts[fontName] != "undefined") {
        if(customImages[imageName].object != null) {
            return customFonts[fontName].object;
        }
    }
    return false;
}

// ===========================================================================

function loadCustomFont(fontPath, size) {
    let font = null;
    let fontStream = openFile(fontPath);
	if(fontStream != null) {
		font = lucasFont.createFont(fontStream, size);
		fontStream.close();
	}

    return font;
}

// ===========================================================================

function renderCustomWorldGraphics() {
    if(!customWorldGraphicsReady) {
        return false;
    }

    if(localPlayer == null) {
        return false;
    }

    for(let i in worldGraphicsRenderings) {
        if(localPlayer.position.distance(worldGraphicsRenderings[i].points[j][0]) < worldGraphicsRenderings[i].drawDistance) {
            if(worldGraphicsRenderings[i].image != null) {
                gta.rwRenderStateSet(rwRENDERSTATEFOGENABLE, 1);
                gta.rwRenderStateSet(rwRENDERSTATEZWRITEENABLE, 1);
                gta.rwRenderStateSet(rwRENDERSTATEVERTEXALPHAENABLE, 1);
                gta.rwRenderStateSet(rwRENDERSTATESRCBLEND, rwBLENDSRCALPHA);
                gta.rwRenderStateSet(rwRENDERSTATEDESTBLEND, rwBLENDINVSRCALPHA);
                gta.rwRenderStateSet(rwRENDERSTATETEXTURERASTER, worldGraphicsRenderings[i].image);
                gta.rwRenderStateSet(rwRENDERSTATETEXTUREFILTER, rwFILTERLINEAR);
                gta.rwRenderStateSet(rwRENDERSTATEVERTEXALPHAENABLE, 1);
                gta.rwRenderStateSet(rwRENDERSTATETEXTUREADDRESS, rwTEXTUREADDRESSCLAMP);

                for(let j in worldGraphicsRenderings[i].points) {
                    graphics.drawQuad3D(worldGraphicsRenderings[i].points[j][0], worldGraphicsRenderings[i].points[j][1], worldGraphicsRenderings[i].points[j][2], worldGraphicsRenderings[i].points[j][3], COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE, COLOUR_WHITE);
                }
            }
        }
    }
}

// ===========================================================================

function checkMovingGates() {
    for(let i in movingGates) {
        if(movingGates[i].positionInterpolateRatio <= 1.0) {

            movingGates[i].positionInterpolateRatio = movingGates[i].positionInterpolateRatio + movingGates[i].positionInterpolationRatioIncrement;
            movingGates[i].rotationInterpolateRatio = movingGates[i].rotationInterpolateRatio + movingGates[i].rotationInterpolationRatioIncrement;

            getElementFromId(movingGates[i].gateObjectId).position = movingGates[i].startPosition.interpolate(movingGates[i].endPosition, movingGates[i].positionInterpolateRatio);
            getElementFromId(movingGates[i].gateObjectId).setRotation(movingGates[i].startRotation.interpolate(movingGates[i].endRotation, movingGates[i].rotationInterpolateRatio));
        } else {
            movingGates[i].positionInterpolateRatio = -1.0;
            movingGates[i].rotationInterpolateRatioIncrement = -1.0;
            triggerNetworkEvent("moveGateFinished", movingGates[i].gateId);
            movingGates.splice(i, 1);
        }
    }
}

// ===========================================================================