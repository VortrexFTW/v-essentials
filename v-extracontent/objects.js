"use strict";

// ===========================================================================

let serverObjectGroups = [
    /*
    new ServerObjectGroup(0.0, 0.0, 0.0, 0, 0, 0, [
        new ServerObject(1000, 0.0, 0.0, 0.0, 0, 0, 0), // Uses pos RELATIVE to group pos
        new ServerObject(1000, 0.0, 0.0, 0.0, 0, 0, 0), // Uses pos RELATIVE to group pos
        ...
    ]),
    */
];

// ===========================================================================

let serverObjects = [
    //new ServerObject(1000, 0.0, 0.0, 0.0, 0, 0, 0)
];

// ===========================================================================

let serverGates = [
    // name, modelId, posX, posY, posZ, rotX, rotY, rotZ, openPosX, openPosY, openPosZ, openRotX, openRotY, openRotZ, relative, vw, int, extra
    // Extra values (all optional, shown are default values): {moveInterpolateIncrement: 0.02, rotateInterpolateIncrement: 0.02, openRelative: true, proximityTriggerDistance: 0.0}
    new ServerGate("staunton-lcpdgate1", 1278, 366.158, -1128.522, 21.941, 0, 0, 180, -8.0, 0.0, 0.0, 0, 0, 0, 0, 0, {proximityTriggerDistance: 8.0, moveRatioIncrement: 0.01}),
    new ServerGate("staunton-lcpdgate2", 1278, 326.3, -1128.522, 21.941, 0, 0, 180, 6.0, 0.0, 0.0, 0, 0, 0, 0, 0, {proximityTriggerDistance: 8.0, moveRatioIncrement: 0.01}),
];

// ===========================================================================

let serverSyncedGates = [
    // For double sliding doors, it's best to add two entries with the names swapped.
    // new ServerSyncedGate(gateName1, gateName2),
];

// ===========================================================================