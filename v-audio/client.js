"use strict";

// ===========================================================================

let audioSounds = {};
let audioVolume = 0.5;
let startTime = 0;
let extraContentResources = [];
let errorURL = [];
let noVolumeWarning = [];

// ===========================================================================

exportFunction("setVolume", function (volume) {
	audioVolume = volume;
});

exportFunction("getVolume", function () {
	return audioVolume;
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	console.log(`[${thisResource.name}] Resource started: ${thisResource.name}`);

	if (isConnected) {
		if (startTime == 0 && thisResource.isReady) {
			triggerNetworkEvent("v.audio.startTime");
		}
	} else {
		startTime = sdl.ticks; // Fallback to current time if not connected
	}
});

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	if (isConnected) {
		if (startTime == 0 && thisResource.isStarted) {
			triggerNetworkEvent("v.audio.startTime");
		}
	} else {
		startTime = sdl.ticks; // Fallback to current time if not connected
	}
});

// ===========================================================================

addEventHandler("OnResourceStart", function (event, resource) {
	//console.log(`[${thisResource.name}] Resource started: ${resource.name}. Checking for custom content resources ...`);
	let resources = getResources();
	//console.log(`[${thisResource.name}] ${resources.length} resources total.`);
	for (let i in resources) {
		if (resources[i] != null) {
			//console.log(`[${thisResource.name}] Checking resource ${resources[i].name}: isStarted=${resources[i].isStarted}, isReady=${resources[i].isReady}`);
			if (resources[i].isStarted && resources[i].isReady) {
				if (typeof resources[i].exports.isCustomContentResource != "undefined") {
					//console.log(`[${thisResource.name}] Resource ${resources[i].name} is a custom content resource.`);
					if (!extraContentResources.includes(resources[i].name)) {
						//console.log(`[${thisResource.name}] Adding resource ${resources[i].name} to extraContentResources.`);
						extraContentResources.push(resources[i].name);
					}
				} else {
					//console.log(`[${thisResource.name}] Resource ${resources[i].name} is not a custom content resource.`);
					if (extraContentResources.includes(resources[i].name)) {
						//console.log(`[${thisResource.name}] Removing resource ${resources[i].name} from extraContentResources.`);
						extraContentResources.splice(extraContentResources.indexOf(resources[i].name), 1);
					}
				}
			}
		}
	}
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
	for (let i in audioSounds) {
		if (audioSounds[i] != null) {
			audioSounds[i].stop();
			audioSounds[i] = null;
		}
	}

	audioSounds = {};
});

// ===========================================================================

addEventHandler("OnElementStreamOut", function (event, element) {
	if (audioSounds[element.id] != null) {
		audioSounds[element.id].stop();
		audioSounds[element.id] = null;
	}
});

// ===========================================================================

addEventHandler("OnElementDestroy", function (event, element) {
	if (audioSounds[element.id] != null) {
		audioSounds[element.id].stop();
		audioSounds[element.id] = null;
	}
});

// ===========================================================================

addEventHandler("OnProcess", function (event, deltaTime) {
	if (startTime == 0) {
		return false;
	}

	updateAudioSounds();
});

// ===========================================================================

function getLocalPlayerPosition() {
	// In Mafia 1, ped position is bugged if they're in a vehicle
	// So we use the vehicle position instead
	if (game.game == 10) {
		if (localPlayer.vehicle != null) {
			return localPlayer.vehicle.position;
		}
	}

	return localPlayer.position;
}

// ===========================================================================

addNetworkHandler("v.audio.startTime", function (timeStamp) {
	startTime = timeStamp;
});

// ===========================================================================

function setElementAudio(element, url) {
	if (startTime == 0) {
		return false;
	}

	if (typeof element === "number") {
		element = getElementFromId(element);
	}

	if (element == null) {
		console.error(`[${thisResource.name}] Element is null or undefined. Cannot set audio for element.`);
		return false;
	}

	if (typeof audioSounds[element.id] != "undefined") {
		console.log(`[${thisResource.name}] Stopping existing audio for element ${element.id} before setting new audio.`);
		audioSounds[element.id].stop();
		audioSounds[element.id] = null;
	}

	if (url == "" || url == null) {
		console.error(`[${thisResource.name}] No audio URL provided for element ${element.id}.`);
		return false;
	}

	let extraContentResource = getResources()
		.filter(resource => resource != null)
		.filter(resource => resource.isStarted == true && resource.isReady == true && typeof resource.exports.isCustomContentResource != "undefined")
		.filter(resource => typeof resource.exports.getCustomSound != "undefined")
		.find(resource => resource.exports.doesCustomSoundExist(url) != false);

	let soundFile = null;
	if (extraContentResource != undefined) {
		soundFile = extraContentResource.exports.getCustomSound(url);
	}

	if (soundFile == null) {
		if (!errorURL.includes(url)) {
			console.error(`[${thisResource.name}] Could not get audio file for URL: ${url}`);
			errorURL.push(url);
		}
		return false;
	}

	audioSounds[element.id] = soundFile;
	audioSounds[element.id].volume = 0;

	let fileLength = 0;
	if (typeof extraContentResource.exports.getCustomSoundLength == "undefined") {
		if (!noVolumeWarning.includes(extraContentResource.name)) {
			console.warn(`[${thisResource.name}] Extra content resource "${extraContentResource.name}" does not export getCustomSoundLength! Without an audio file length, the audio will NOT be synced together for all players!`);
			noVolumeWarning.push(extraContentResource.name);
		}
	}

	fileLength = extraContentResource.exports.getCustomSoundLength(url);

	if (fileLength != 0) {
		let position = (new Date().getTime() / 1000 - startTime) % fileLength;
		console.log(`[${thisResource.name}] Setting audio seek position for element ${element.id} to ${position}/${fileLength}`);
		audioSounds[element.id].position = position;
	}
	audioSounds[element.id].play();
	return true;
}

// ===========================================================================

function updateAudioSounds() {
	let elements = getElementsByType(ELEMENT_VEHICLE);
	if (typeof ELEMENT_DUMMY != "undefined") {
		elements = elements.concat(getElementsByType(ELEMENT_DUMMY));
	}

	elements.forEach(function (entity) {
		if (entity.getData("v.audio") == null || entity.getData("v.audio")[0] == "") {
			if (typeof audioSounds[entity.id] != "undefined") {
				audioSounds[entity.id].stop();
				audioSounds[entity.id] = null;
			}
			return false;
		} else {
			if (typeof audioSounds[entity.id] == "undefined" || audioSounds[entity.id] == null) {
				if (!setElementAudio(entity, entity.getData("v.audio")[0])) {
					return false;
				}
			}
		}

		if (typeof audioSounds[entity.id] == "undefined" || audioSounds[entity.id] == null) {
			//console.error(`[${thisResource.name}] No radio sound found for entity ${entity.id}. This should not happen!`);
			return false;
		}

		if (entity.getData("v.audio")[1] <= 0) {
			audioSounds[entity.id].volume = audioVolume / 100;
		} else {
			if (entity.position.distance(getLocalPlayerPosition()) <= entity.getData("v.audio")[1]) {
				let distance = entity.position.distance(getLocalPlayerPosition());
				let distancePercent = (entity.getData("v.audio")[1] - distance) / entity.getData("v.audio")[1] * 100;
				//console.log(`[${thisResource.name}] Setting audio volume for entity ${entity.id} to ${(audioVolume / 100) * distancePercent} (distance: ${distance}, max distance: ${entity.getData("v.audio")[1]})`);
				audioSounds[entity.id].volume = (audioVolume / 100) * distancePercent;
			} else {
				audioSounds[entity.id].volume = 0;
			}
		}
	});
}