"use strict";

let thisGame = (typeof server == "undefined") ? gta.game : server.game;

// Time
let timeLocked = [null, false, false, false, false, false, false];
let timeLockHour = [null, 19, 1, 22, 22, 1, 1];
let timeLockMinute = [null, 0, 0, 0, 0, 0, 0];
let timeMinuteDuration = [null, 60000, 60000, 60000, 60000, 60000, 60000];

// Ambient Game Stuff
let trainsEnabled = [null, true, false, true, true, true, true];
let planesEnabled = [null, true, true, true, true, true, true];
let civiliansEnabled = [null, true, true, true, false, false, false];
let trafficEnabled = [null, true, true, true, false, false, false];
let ssvBridgeEnabled = true;

// Weather and Snow
let currentWeather = [null, 0, 0, 10, 10, 0, 0];
let isSnowing = [null, false, false, false, false, false, false];
let isWinter = [null, false, false, false, false, false, false];
let windSpeed = [null, 0, 0, 0, 0, 0, 0];

// Civilian Stuff
let civilianFollowEnabled = true;
let civilianFollowStopDistance = 5;
let civilianFollowRunDistance = 10;
let civilianFollowSprintDistance = 25;
let civilianFacingEnabled = true;
let civilianFlipOffEnabled = false;
let civilianFlipOffDistance = 2;

// Element spawning and usage
let customTrainsEnabled = true;