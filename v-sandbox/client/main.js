"use strict";

// ----------------------------------------------------------------------------

let gameAnnounceColour = gameAnnounceColours[game.game];
let gameName = gameNames[game.game];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(isConnected) {
		triggerNetworkEvent("sb.clientready");
		triggerNetworkEvent("sb.w.sync");
	} else {
		resyncWorld();
	}

	if(game.game == GAME_GTA_IV) {
		if(gta.ivGamemode == 8 || gta.ivGamemode == 30) {
			natives.allowEmergencyServices(true);
			natives.setCreateRandomCops(true);
			natives.setMaxWantedLevel(0);
			natives.setWantedMultiplier(0.0);
			natives.allowPlayerToCarryNonMissionObjects(natives.getPlayerId(), true);
			natives.switchRandomTrains(true);
			natives.switchRandomBoats(true);
			natives.switchAmbientPlanes(true);
			natives.switchMadDrivers(false);
			natives.setPlayerTeam(natives.getPlayerId(), 0);
			natives.usePlayerColourInsteadOfTeamColour(true);
			natives.allowGameToPauseForStreaming(false);
		}
		natives.requestAnims("DANCING");
		natives.loadAllObjectsNow();

		gta.startNewScript("ambnightclubm92");
		gta.startNewScript("drinking");
		//bindKey(SDLK_m, KEYSTATE_UP, function() { natives.activateNetworkSettingsMenu(); });
	}
});

bindEventHandler("OnResourceStop", thisResource, function(event, resource) {
	unbindKey(SDLK_m);
});

// ----------------------------------------------------------------------------

addCommandHandler("clear", function(cmdName, params, client) {
	for(let i=0;i<=19;i++) {
		global.message("", COLOUR_BLACK);
	}
	console.log(`[Sandbox] Chatbox cleared`);
});

// ----------------------------------------------------------------------------

function outputSandboxMessage(messageText) {
	if(isConnected) {
		console.log(`[Sandbox] ${localClient.name} ${messageText}`);
		triggerNetworkEvent("sb.msg", messageText);
	} else {
		console.log(`[Sandbox] You ${messageText}`);
		message(`You ${messageText}`, gameAnnounceColour);

	}
}

// ----------------------------------------------------------------------------