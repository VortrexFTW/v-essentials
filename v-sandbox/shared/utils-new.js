"use strict";
setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

// DONT TOUCH THIS
let thisGame = (typeof server == "undefined") ? gta.game : server.game;
let isServer = (typeof server == "undefined") ? false : true;

// ----------------------------------------------------------------------------

let gameAnnounceColours = [
	COLOUR_BLACK,					// Invalid
	COLOUR_SILVER,					// GTA III
	COLOUR_AQUA,					// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	COLOUR_SILVER,					// GTA IV
	COLOUR_SILVER					// GTA IV (EFLC)
];

// ----------------------------------------------------------------------------

let getGenderForSkin = findResourceByName("v-utils").exports.getGenderForSkin;
let getGenderPossessivePronoun = findResourceByName("v-utils").exports.getGenderPossessivePronoun;
let getGenderObjectivePronoun = findResourceByName("v-utils").exports.getGenderObjectivePronoun;
let getVehicleUpgradeName = findResourceByName("v-utils").exports.getVehicleUpgradeName;
let getWeatherName = findResourceByName("v-utils").exports.getWeatherName;
let getEnableDisableText = findResourceByName("v-utils").exports.getEnableDisableText;
let getOnOffText = findResourceByName("v-utils").exports.getOnOffText;
let getProperCivilianPossessionText = findResourceByName("v-utils").exports.getProperCivilianPossessionText;
let getProperVehiclePossessionText = findResourceByName("v-utils").exports.getProperVehiclePossessionText;
let isValidSkin = findResourceByName("v-utils").exports.isValidSkin;
let getProperVehiclePossessionText = findResourceByName("v-utils").exports.getProperVehiclePossessionText;
let isValidSkin = findResourceByName("v-utils").exports.isValidSkin;
let createEnum = findResourceByName("v-utils").exports.createEnum;
let getArrayOfElementID = findResourceByName("v-utils").exports.getArrayOfElementID;
let getRandom = findResourceByName("v-utils").exports.getRandom;
let getSpeedFromVelocity = findResourceByName("v-utils").exports.getSpeedFromVelocity;
let breakText = findResourceByName("v-utils").exports.breakText;
let getRandomRGB = findResourceByName("v-utils").exports.getRandomRGB;
let is2DPositionOnScreen = findResourceByName("v-utils").exports.is2DPositionOnScreen;
let setFileData = findResourceByName("v-utils").exports.setFileData;
let getFileData = findResourceByName("v-utils").exports.getFileData;
let isValidObjectModel = findResourceByName("v-utils").exports.isValidObjectModel;
let createBitwiseTable = findResourceByName("v-utils").exports.createBitwiseTable;
let hasBitFlag = findResourceByName("v-utils").exports.hasBitFlag;
let combineVecToInteger = findResourceByName("v-utils").exports.combineVecToInteger;
let toFixed = findResourceByName("v-utils").exports.toFixed;
let packData = findResourceByName("v-utils").exports.packData;
let getFirstEmptyEffectSlot = findResourceByName("v-utils").exports.getFirstEmptyEffectSlot;
let getPlayerFromParams = findResourceByName("v-utils").exports.getPlayerFromParams;
let getClientFromName = findResourceByName("v-utils").exports.getClientFromName;
let getSyncerFromID = findResourceByName("v-utils").exports.getSyncerFromID;
let replaceEmojiInString = findResourceByName("v-utils").exports.replaceEmojiInString;
let getMissionNameFromId = findResourceByName("v-utils").exports.getMissionNameFromId;
let getLocationPositionFromName = findResourceByName("v-utils").exports.getLocationPositionFromName;
let getSkinNameFromId = findResourceByName("v-utils").exports.getSkinNameFromId;
let getVehicleNameFromModelId = findResourceByName("v-utils").exports.getVehicleNameFromModelId;
let doesWordStartWithVowel = findResourceByName("v-utils").exports.doesWordStartWithVowel;
let getSkinIdFromName = findResourceByName("v-utils").exports.getSkinIdFromName;
let getVehicleUpgradeIdFromName = findResourceByName("v-utils").exports.getVehicleUpgradeIdFromName;
let getVehicleModelIDFromName = findResourceByName("v-utils").exports.getVehicleModelIDFromName;
let getVehicleUpgradeIdFromParams = findResourceByName("v-utils").exports.getVehicleUpgradeIdFromParams;
let getSkinIdFromParams = findResourceByName("v-utils").exports.getSkinIdFromParams;
let getVehicleModelIdFromParams = findResourceByName("v-utils").exports.getVehicleModelIdFromParams;
let isValidVehicleModel = findResourceByName("v-utils").exports.isValidVehicleModel;
let isParamsInvalid = findResourceByName("v-utils").exports.isParamsInvalid;
let vec3ToVec2 = findResourceByName("v-utils").exports.vec3ToVec2;
let getWeaponName = findResourceByName("v-utils").exports.getWeaponName;
let getVehiclesInRange = findResourceByName("v-utils").exports.getVehiclesInRange;
let getClosestCivilian = findResourceByName("v-utils").exports.getClosestCivilian;
let getClosestVehicle = findResourceByName("v-utils").exports.getClosestVehicle;
let getAngleInCircleFromCenter = findResourceByName("v-utils").exports.getAngleInCircleFromCenter;
let radToDeg = findResourceByName("v-utils").exports.radToDeg;
let degToRad = findResourceByName("v-utils").exports.degToRad;
let getHeadingFromPosToPos = findResourceByName("v-utils").exports.getHeadingFromPosToPos;
let getPosBelowPos = findResourceByName("v-utils").exports.getPosBelowPos;
let getPosAbovePos = findResourceByName("v-utils").exports.getPosAbovePos;
let getPosBehindPos = findResourceByName("v-utils").exports.getPosBehindPos;
let getPosInFrontOfPos = findResourceByName("v-utils").exports.getPosInFrontOfPos;
let getPosToLeftOfPos = findResourceByName("v-utils").exports.getPosToLeftOfPos;
let getPosToRightOfPos = findResourceByName("v-utils").exports.getPosToRightOfPos;
let makeReadableTime = findResourceByName("v-utils").exports.makeReadableTime;

// ----------------------------------------------------------------------------