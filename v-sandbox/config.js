"use strict";

// ----------------------------------------------------------------------------

// INSTRUCTIONS:
// Each config option below has an array seven (7) slots.
// The first slot must ALWAYS be null
// The rest are for each game, indexed by the game id.
// Game ID reference: https://wiki.gtaconnected.com/GameIdentifiers

// ----------------------------------------------------------------------------

// OTHER NOTES
// * trainsEnabled won't be used in GTA Vice City (obviously)
// * ssvBridgeEnabled will only be used in GTA III (obviously)

// ----------------------------------------------------------------------------

// Ambient Game Stuff
let trainsEnabled = [null, true, true, true, true, true, true];
let planesEnabled = [null, true, true, true, true, true, true];
let civiliansEnabled = [null, true, true, false, false, false, false];
let customCiviliansEnabled = [null, true, true, true, true, false, false];
let trafficEnabled = [null, true, true, false, false, true, true];
let trafficDensity = [null, 1, 1, 1, 1, 0, 0];
let civilianDensity = [null, 1, 1, 1, 1, 0, 0];
let ssvBridgeEnabled = [null, true, false, false, true, false, false];

// ----------------------------------------------------------------------------

// Civilian Stuff
let civilianFollowEnabled = [null, true, true, true, true, true, true];
let civilianFollowStopDistance = [null, 5, 5, 5, 5, 5, 5];
let civilianFollowRunDistance = [null, 10, 10, 10, 10, 10, 10];
let civilianFollowSprintDistance = [null, 25, 25, 25, 25, 25, 25];
let civilianFacingEnabled = [null, true, true, true, true, true, true];
let civilianFlipOffEnabled = [null, true, true, true, true, true, true];
let civilianFlipOffDistance = [null, 2, 2, 2, 2, 2, 2];

// ----------------------------------------------------------------------------

// Element spawning and usage
let customTrainsEnabled = true;

// ----------------------------------------------------------------------------