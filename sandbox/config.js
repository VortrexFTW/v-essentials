"use strict";

// ----------------------------------------------------------------------------

// INSTRUCTIONS:
// Each config option below has an array seven (7) slots. 
// The first slot must ALWAYS be null
// The rest are for each game, indexed by the game id.
// Game ID reference: https://wiki.gtaconnected.com/GameIdentifiers

// ----------------------------------------------------------------------------

// TIME INFORMATION:

// timeLockHour and timeLockMinute will force the time to stay in the specified
// hour and minute, IF time lock is enabled! Otherwise, it will set that hour
// and minute on server start and time will advance as normal

// OTHER NOTES
// * trainsEnabled won't be used in GTA Vice City (obviously)
// * ssvBridgeEnabled will only be used in GTA III (obviously)
// * windSpeed is only used in GTA IV.
// * Snow and winter values are only used in GTA III, Vice City, and San Andreas

// ----------------------------------------------------------------------------

// Time
let timeLocked = [null, false, false, false, false, false, false];						// Locks the time to a specific hour/minute
let timeLockHour = [null, 19, 12, 12, 12, 12, 12];										// If time is locked, hour will be forever locked to this number.
let timeLockMinute = [null, 15, 0, 0, 0, 0, 0];											// If time is locked, the minute will be forever locked to this number.
let timeMinuteDuration = [null, 1000, 1000, 1000, 1000, 1000, 1000];

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

// Weather and Snow
let currentWeather = [null, 0, 0, 0, 0, 0, 0];
let isSnowing = [null, true, true, true, true, true, true];
let isWinter = [null, true, true, true, true, true, true];
let windSpeed = [null, 0, 0, 0, 0, 0, 0];

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