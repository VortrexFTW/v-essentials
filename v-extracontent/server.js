let movingGates = [];
let proximityGateTriggers = [];

// ===========================================================================

class ServerObject {
    constructor(modelId, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, dimension = -1, interior = 0) {
        this.modelId = modelId;
        this.position = new Vec3(positionX, positionY, positionZ);
        this.rotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
        this.object = false;
        this.dimension = dimension;
        this.interior = interior;
        this.index = -1;
    }
}

// ===========================================================================

class ServerObjectGroup {
    constructor(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, objects, dimension = -1, interior = 0) {
        this.objects = objects;
        this.position = new Vec3(positionX, positionY, positionZ);
        this.rotation = new Vec3(degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ));
        this.dimension = dimension;
        this.interior = interior;
        this.index = -1;
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

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
    createAllServerObjects();

    exportFunction("triggerServerGate", triggerServerGate);
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
    // Don't need this. They get destroyed automatically when the resource is unloaded.
    //destroyAllServerObjects();

    collectAllGarbage();
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
            serverObjects[i].object.dimension = serverObjects[i].dimension;
            serverObjects[i].object.onAllDimensions = false;
        }

        //serverObjects[i].object.interior = serverObjects[i].interior;

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
                serverObjectGroups[i].objects[j].object.dimension = serverObjectGroups[i].dimension;
                serverObjectGroups[i].objects[j].object.onAllDimensions = false;
            }

            addToWorld(serverObjectGroups[i].objects[j].object);
        }
    }

    for(let i in serverGates) {
        serverGates[i].index = i;
        serverGates[i].object = gta.createObject(serverGates[i].modelId, serverGates[i].closedPosition);
        serverGates[i].object.setRotation(serverGates[i].closedRotation);

        if(serverGates[i].dimension == -1) {
            serverGates[i].object.onAllDimensions = true;
        } else {
            serverGates[i].object.dimension = serverGates[i].dimension;
            serverGates[i].object.onAllDimensions = false;
        }

        if(serverGates[i].proximityTriggerDistance > 0.0) {
            proximityGateTriggers.push(i);
        }

        //serverGates[i].object.interior = serverGates[i].interior;

        addToWorld(serverGates[i].object);
    }
}

// ===========================================================================

function destroyAllServerObjects() {
    for(let i in serverObjects) {
        if(serverObjects[i].object != false) {
            destroyElement(serverObjects[i].object);
        }
    }

    for(let j in serverObjectGroups) {
        for(let k in serverObjectGroups[j].objects) {
            if(serverObjectGroups[j].objects[k].object != false) {
                destroyElement(serverObjectGroups[j].objects[k].object);
            }
        }
    }

    for(let m in serverGates) {
        if(serverGates[m].object != false) {
            destroyElement(serverGates[m].object);
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

function triggerServerGate(gateName, force = false, open = true) {
    let gateId = getServerGateByName(gateName);

    //if(!serverGates[gateId].beingMoved) {
        moveServerGate(gateId, !serverGates[gateId].opened, true);
    //}
}

// ===========================================================================

function getServerGateByName(gateName) {
    for(let i in serverGates) {
        if(serverGates[i].name.toLowerCase() == gateName.toLowerCase()) {
            return i;
        }
    }
}

// ===========================================================================

// Object doesn't slide or anything yet. Needs to be coded.
function moveServerGate(gateId, open = true, applyToSyncedGates = true) {
    let startPosition = (open) ? serverGates[gateId].closedPosition : applyOffsetToVector(serverGates[gateId].closedPosition, serverGates[gateId].openPosition);
    let endPosition = (open) ? applyOffsetToVector(serverGates[gateId].closedPosition, serverGates[gateId].openPosition) : serverGates[gateId].closedPosition;

    let startRotation = (open) ? serverGates[gateId].closedRotation : applyOffsetToVector(serverGates[gateId].closedRotation, serverGates[gateId].openRotation);
    let endRotation = (open) ? applyOffsetToVector(serverGates[gateId].closedRotation, serverGates[gateId].openRotation) : serverGates[gateId].closedRotation;

    if(serverGates[gateId].object.syncer == -1) {
        serverGates[gateId].object.position = endPosition;
        serverGates[gateId].object.setRotation(endPosition);
        return false;
    }

    serverGates[gateId].opened = open;
    //serverGates[gateId].beingMoved = true;

    triggerNetworkEvent("moveGate", null, serverGates[gateId].object.id, gateId, startPosition, endPosition, startRotation, endRotation, serverGates[gateId].moveInterpolateIncrement, serverGates[gateId].rotateInterpolateIncrement);

    if(applyToSyncedGates == true) {
        for(let i in serverSyncedGates) {
            if(serverSyncedGates[i].gate1 == serverGates[gateId].name) {
                moveServerGate(getServerGateByName(serverSyncedGates[i].gate2), open, false);
            }
        }
    }
}

// ===========================================================================

addNetworkHandler("moveGateFinished", function(client, gateId) {
    if(serverGates[gateId].object.syncer == client.index) {
        serverGates[gateId].beingMoved = false;
    }
});

// ===========================================================================