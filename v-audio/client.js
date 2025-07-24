"use strict";

// ===========================================================================

let audioSounds = {};

let audioVehicleMaxAudibleDistance = 10;
let audioVolume = 0.5;

let startTime = 0;

let extraContentResources = [];

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	console.log(`[v-audio] Resource started: ${thisResource.name}`);

	if (isConnected) {
		if (startTime == 0 && thisResource.isReady) {
			triggerNetworkEvent("v.audio.startTime");
		}
	} else {
		startTime = Date.now() / 1000; // Fallback to current time if not connected
	}

	exportFunction("setVolume", function (volume) {
		audioVolume = volume;
	});

	exportFunction("getVolume", function () {
		return audioVolume;
	});
});

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	if (isConnected) {
		if (startTime == 0 && thisResource.isStarted) {
			triggerNetworkEvent("v.audio.startTime");
		}
	} else {
		startTime = Date.now() / 1000; // Fallback to current time if not connected
	}
});

// ===========================================================================

addEventHandler("OnResourceStart", function (event, resource) {
	console.log(`[v-audio] Resource started: ${resource.name}. Checking for custom content resources ...`);
	let resources = getResources();
	console.log(`[v-audio] ${resources.length} resources total.`);
	for (let i in resources) {
		if (resources[i] != null) {
			console.log(`[v-audio] Checking resource ${resources[i].name}: isStarted=${resources[i].isStarted}, isReady=${resources[i].isReady}`);
			if (resources[i].isStarted && resources[i].isReady) {
				if (typeof resources[i].exports.isCustomContentResource != "undefined") {
					console.log(`[v-audio] Resource ${resources[i].name} is a custom content resource.`);
					if (!extraContentResources.includes(resources[i].name)) {
						console.log(`[v-audio] Adding resource ${resources[i].name} to extraContentResources.`);
						extraContentResources.push(resources[i].name);
					}
				} else {
					console.log(`[v-audio] Resource ${resources[i].name} is not a custom content resource.`);
					if (extraContentResources.includes(resources[i].name)) {
						console.log(`[v-audio] Removing resource ${resources[i].name} from extraContentResources.`);
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

	getElementsByType(ELEMENT_VEHICLE).concat(getElementsByType(ELEMENT_DUMMY)).forEach(function (entity) {
		if (entity.getData("v.audio") == null || entity.getData("v.audio")[0] == "") {
			if (typeof audioSounds[entity.id] != "undefined") {
				audioSounds[entity.id].stop();
				audioSounds[entity.id] = null;
			}
			return false;
		} else {
			if (audioSounds[entity.id] == null) {
				setElementAudio(entity, entity.getData("v.audio")[0]);
			}
		}

		if (audioSounds[entity.id] == null) {
			console.error(`[CRP.Radio] No radio sound found for entity ${entity.id}. This should not happen!`);
			return false;
		}

		if (entity.getData("v.audio")[1] <= 0) {
			audioSounds[entity.id].volume = audioVolume / 100;
		} else {
			if (entity.position.distance(getLocalPlayerPosition()) <= entity.getData("v.audio")[2]) {
				let distance = entity.position.distance(getLocalPlayerPosition());
				let distancePercent = (entity.getData("v.audio")[2] - distance) / entity.getData("v.audio")[2];
				audioSounds[entity.id].volume = (audioVolume / 100) * distancePercent;
			} else {
				audioSounds[entity.id].volume = 0;
			}
		}
	});
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

	if (findResourceByName(extraContentResource).exports == null) {
		console.error(`[v-audio] Extra content resource "${extraContentResource}" is not available. Cannot load audio file: ${url}`);
		return false;
	}

	if (typeof element === "number") {
		element = getElementFromId(element);
	}

	if (element == null) {
		return false;
	}

	if (typeof audioSounds[element.id] != "undefined") {
		audioSounds[element.id].stop();
		audioSounds[element.id] = null;
	}

	if (url == "" || url == null) {
		return false;
	}

	let audioFile = null;
	let extraContentResource = null;
	for (let i in extraContentResources) {
		if (extraContentResources[i].getExport("getCustomAudio")) {
			audioFile = extraContentResources[i].exports.getCustomAudio(url);
			if (audioFile != null) {
				extraContentResource = extraContentResources[i];
				break; // Found the resource that provides the audio file
			}
		}
	}

	if (audioFile == null) {
		console.error(`[v-audio] Could not get audio file for URL: ${url}`);
		return false;
	}

	audioSounds[element.id] = audioFile;

	if (audioSounds[element.id] == null) {
		console.error(`[v-audio] Could not create audio sound for element ${element.id} with URL: ${url}`);
		return false;
	}

	audioSounds[element.id].volume = 0;
	let fileLength = 0;
	if (extraContentResource.getExport("getAudioFileLength") == null) {
		console.error(`[v-audio] Extra content resource "${extraContentResource}" does not export getAudioFileLength! Without an audio file length, the audio will NOT be synced together for all players!`);
	}

	fileLength = extraContentResource.exports.getAudioFileLength(url);

	if (fileLength != 0) {
		let position = (new Date().getTime() / 1000 - serverStartTime) % fileLength;
		console.log(`[v-audio] Setting audio seek position for element ${element.id} to ${position}/${fileLength}`);
		audioSounds[element.id].position = position;
	}
	audioSounds[element.id].play();
}

// ===========================================================================

addNetworkHandler("v.extraContent.thisContentResource", function (client, fromResource) {
	if (extraContentResources.includes(fromResource)) {
		return false; // Already added this resource
	}
	extraContentResources.push(fromResource);
});