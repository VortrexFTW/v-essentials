"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("help", function(command, params) {
	if(!params || params == "") {
		showMainHelpList();
	} else {
		switch(params.toLowerCase()) {
			case "veh":
			case "v":
			case "car":
			case "vehicle":				
				message("/veh, /vehicle, /car, /v, /spawncar, /spawnveh, /addcar, /addveh", COLOUR_WHITE);
				message("/veh_fix, /veh_delete, /veh_siren, /veh_alarm, /veh_horn, /veh_locked, /veh_engine, /veh_wander", COLOUR_WHITE);
				message("/veh_light, /veh_panel, /veh_door, /veh_wheel, /veh_doors, /veh_god, /veh_lights, /veh_radio", COLOUR_WHITE);
				message("/veh_mission, /veh_rgba1, /veh_rgba2, /veh_colour1, /veh_colour2, /veh_colour3, /veh_colour4", COLOUR_WHITE);
				message("/veh_collisions, /veh_cruisespeed, /veh_drivingstyle, /veh_handling, /veh_driveto, /veh_scale", COLOUR_WHITE);
				break;
				
			case "civ":
			case "c":
			case "npc":
			case "bot":
			case "civilian":
				message("[#666666]/civ <id/name>[#FFFFFF]to spawn a civilian.", COLOUR_WHITE);
				message("[#666666]The following commands can be used on any civilian:", COLOUR_WHITE);
				message("/civ_skin /civ_followme /civ_followplr /civ_crouch /civ_gun /civ_nogun /civ_aimatme", COLOUR_WHITE);
				message("/civ_wander /civ_enterveh /civ_exitveh /civ_walkstyle /civ_armour /civ_health /civ_god", COLOUR_WHITE);
				message("/civ_jump /civ_walkfwd /civ_runfwd /civ_stats /civ_threat /civ_nothreat /civ_resurrect", COLOUR_WHITE);
				message("/civ_collision /civ_hailtaxi /civ_aimatplr /civ_aimatveh", COLOUR_WHITE);
				break;		

			case "plr":
			case "player":
				message("[#666666]The following commands can be used on your player:", COLOUR_WHITE);
				message("/skin /health /armour /gun /goto /god /input /clear /hud /collisions /interior /dimension", COLOUR_WHITE);
				message("/warpinveh /stars /stamina", COLOUR_WHITE);
				break;	

			default:
				showMainHelpList();
				break;
				
		}
	}
});

// ----------------------------------------------------------------------------

function showMainHelpList() {
	message("-- HELP ------------------------------------------", COLOUR_YELLOW);

	let enabledCategories = "";
	let enabledKeys = "";
	if(findResourceByName("sandbox") != null) {
		enabledCategories += " vehicle";
		enabledCategories += " civilian";
		enabledCategories += " player";
		enabledCategories += " other";
	}

	if(findResourceByName("v-admin") != null) {
		availableCategories += " admin"
	}

	if(findResourceByName("v-runcode") != null) {
		availableCategories += " code"	
	}	

	if(findResourceByName("v-passenger") != null) {
		availableKeys += " G: Passenger";
	}

	message("Help Categories: " + availableCategories, toColour(200, 200, 200, 255));
	message("Use /help <category> for information", toColour(200, 200, 200, 255));
	message("Example: /help vehicle", toColour(200, 200, 200, 255));
	message("Available keys are: " + availableKeys, toColour(200, 200, 200, 255));
}

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerChat", function(event, client, chatMessage) {
	if(chatMessage.toLowerCase() == "nuttertools") {
		message("Use /gun for a weapon!", COLOUR_YELLOW);
	}
});

// ----------------------------------------------------------------------------