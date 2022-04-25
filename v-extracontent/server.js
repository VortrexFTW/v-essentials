"use strict";

// ===========================================================================

class ServerObject {
    constructor(modelId, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, dimension = -1) {
        this.modelId = modelId;
        this.position = new Vec3(positionX, positionY, positionZ);
        this.rotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
        this.object = false;
        this.dimension = dimension;
        this.index = -1;
    }
}

// ===========================================================================

class ServerObjectGroup {
    constructor(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, objects, dimension = -1) {
        this.objects = objects;
        this.position = new Vec3(positionX, positionY, positionZ);
        this.rotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
        this.dimension = dimension;
        this.index = -1;
    }
}

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
    createAllServerObjects();
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
    destroyAllServerObjects();
});

// ===========================================================================

function createAllServerObjects() {
    for(let i in serverObjects) {
        serverObjects[i].index = i;
        serverObjects[i].object = gta.createObject(serverObjects[i].modelId, serverObjects[i].position);
        serverObjects[i].object.setRotation(serverObjects[i].rotation);

        if(serverObjects[i].dimension == -1) {
            serverObjects[i].object.onAllDimensions = true;
        } else {
            serverObjects[i].dimension = serverObjects[i].dimension;
            serverObjects[i].object.onAllDimensions = false;
        }

        addToWorld(serverObjects[i].object);
    }

    for(let i in serverObjectGroups) {
        serverObjectGroups[i].index = i;
        for(let j in serverObjectGroups[i].objects) {
            serverObjectGroups[i].objects[j].index = i;
            serverObjectGroups[i].objects[j].object = gta.createObject(serverObjectGroups[i].objects[j].modelId, applyOffsetToVector(serverObjectGroups[i].position, serverObjectGroups[i].objects[j].position));
            serverObjectGroups[i].objects[j].object.setRotation(applyOffsetToVector(serverObjectGroups[i].rotation, serverObjectGroups[i].objects[j].rotation));

            if(serverObjectGroups[i].objects[j].dimension == -1) {
                serverObjectGroups[i].objects[j].object.onAllDimensions = true;
            } else {
                serverObjectGroups[i].objects[j].dimension = serverObjectGroups[i].dimension;
                serverObjectGroups[i].objects[j].object.onAllDimensions = false;
            }

            addToWorld(serverObjectGroups[i].objects[j].object);
        }
    }


}

// ===========================================================================

function destroyAllServerObjects() {
    for(let i in serverObjects) {
        if(serverObjects[i].object != false) {
            destroyElement(serverObjects[i].object);
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
	return new Vec3(position.x+position2.x, position.y+position2.y, position.z+position2.z);
}

// ===========================================================================

function getOffsetFromVector(position2, position) {
	return new Vec3(position.x-position2.x, position.y-position2.y, position.z-position2.z);
}

// ===========================================================================