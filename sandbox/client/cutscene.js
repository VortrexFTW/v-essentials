"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}
	
	if(game.cutsceneMgr.finished) {
		game.cutsceneMgr.stop();
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("cutscene", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}	
	
	if(!params || params == "") {
		message("You must enter a cutscene ID!", errorMessageColour);
		return false;
	}
	
	//if(game.cutsceneMgr.loadStatus == 2 && !game.cutsceneMgr.finished) {
	//	message("A cutscene is already running!", errorMessageColour);
	//	return true;
	//}
	
	let cutsceneID = (Number(params) || 0);
	game.cutsceneMgr.load(cutsceneID);
	game.cutsceneMgr.start();
});

// ----------------------------------------------------------------------------

addCommandHandler("endcutscene", function(cmdName, params) {
	if(gta.game == GAME_GTA_IV || gta.game == GAME_GTA_IV_EFLC) {
		return false;
	}	
	
	game.cutsceneMgr.stop();
});

// ----------------------------------------------------------------------------

//addEventHandler("OnKeyUp", function(event, keyCode, scanCode, mod) {
//	if(game.cutsceneMgr.loadStatus == 2 && !game.cutsceneMgr.finished) {
//		game.cutsceneMgr.stop();
//	}
//});

// ----------------------------------------------------------------------------