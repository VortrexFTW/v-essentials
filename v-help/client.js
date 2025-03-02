"use strict";

// ----------------------------------------------------------------------------

addCommandHandler("help", function (command, params) {
	if (!params || params == "") {
		showMainHelpList();
	} else {
		switch (params.toLowerCase()) {
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

			case "ped":
			case "civ":
			case "c":
			case "npc":
			case "bot":
			case "civilian":
				message("[#666666]/ped <id/name>[#FFFFFF]to spawn a ped.", COLOUR_WHITE);
				message("[#666666]The following commands can be used on any ped:", COLOUR_WHITE);
				message("/ped_skin /ped_followme /ped_followplr /ped_crouch /ped_gun /ped_nogun /ped_aimatme", COLOUR_WHITE);
				message("/ped_wander /ped_enterveh /ped_exitveh /ped_walkstyle /ped_armour /ped_health /ped_god", COLOUR_WHITE);
				message("/ped_jump /ped_walkfwd /ped_runfwd /ped_stats /ped_threat /ped_nothreat /ped_resurrect", COLOUR_WHITE);
				message("/ped_collision /ped_hailtaxi /ped_aimatplr /ped_aimatveh", COLOUR_WHITE);
				break;

			case "plr":
			case "player":
				message("[#666666]The following commands can be used on your player:", COLOUR_WHITE);
				message("/skin /health /armour /gun /goto /god /input /clear /hud /collisions /interior /dimension", COLOUR_WHITE);
				message("/warpinveh /stars /stamina", COLOUR_WHITE);
				break;

			case "admin":
				message("[#666666]The following commands can be used for admin access:", COLOUR_WHITE);
				message("/admin /goto /gethere", COLOUR_WHITE);
				break;

			case "code":
				if (localClient.administrator) {
					message("[#666666]The following commands can be used for code execution:", COLOUR_WHITE);
					message("/jse /sse /lse /jsr /ssr /lsr", COLOUR_WHITE);
				}
				break;

			case "afk":
				message("[#666666]The following commands can be used for AFK status:", COLOUR_WHITE);
				message("/autoafk /afk", COLOUR_WHITE);
				break;

			case "keys":
				let enabledKeys = "";
				if (findResourceByName("v-passenger") != null) {
					enabledKeys += "[#FFFFFF]G: [#AAAAAA]Passenger";
				}

				if (findResourceByName("v-togglehud") != null) {
					enabledKeys += " 🔹 [#FFFFFF]F7: [#AAAAAA]Toggle HUD";
				}

				if (findResourceByName("cheatkeys") != null) {
					enabledKeys += " 🔹 [#FFFFFF]2: [#AAAAAA]Speed Boost 🔹 [#FFFFFF]3: [#AAAAAA]Stop 🔹 [#FFFFFF]5: [#AAAAAA]Reverse 🔹 [#FFFFFF]6: [#AAAAAA]Fix & Heal 🔹 [#FFFFFF]7: [#AAAAAA]Jump";
				}

				message("Keys: " + enabledKeys, COLOUR_WHITE);
				break;

			case "spawn":
				message("[#666666]The following commands can be used for spawns:", COLOUR_WHITE);
				message(`/respawn ${(localClient.administrator) ? "/addspawn /delspawn" : ""}`, COLOUR_WHITE);

			default:
				showMainHelpList();
				break;

		}
	}
});

// ----------------------------------------------------------------------------

function showMainHelpList() {
	message("❓  [#0088FF]HELP [#FFFF00]=================================================", COLOUR_YELLOW);

	let enabledCategories = "";
	let enabledKeys = "";
	if (findResourceByName("v-sandbox") != null) {
		if (findResourceByName("v-sandbox").isStarted) {
			enabledCategories += " 🔹 vehicle";
			enabledCategories += " 🔹 ped";
			enabledCategories += " 🔹 player";
			enabledCategories += " 🔹 other";
			enabledCategories += " 🔹 keys";
		}
	}

	if (findResourceByName("v-admin") != null) {
		if (findResourceByName("v-admin").isStarted) {
			enabledCategories += " 🔹 admin"
		}
	}

	if (findResourceByName("v-runcode") != null) {
		if (findResourceByName("v-runcode").isStarted) {
			enabledCategories += " 🔹 code"
		}
	}

	if (findResourceByName("v-afk") != null) {
		if (findResourceByName("v-afk").isStarted) {
			enabledCategories += " 🔹 afk"
		}
	}

	if (findResourceByName("v-spawn") != null) {
		if (findResourceByName("v-spawn").isStarted) {
			enabledCategories += " 🔹 spawn";
		}
	}

	message("Categories: [#FFFFFF]" + enabledCategories, toColour(200, 200, 200, 255));
	message("Use /help <name> for information", toColour(220, 220, 220, 255));
	message("Example: [#FFFFFF]/help vehicle", toColour(200, 200, 200, 255));
}

/*	if(findResourceByName("v-passenger") != null) {
		enabledKeys += "[#FFFFFF]G: [#AAAAAA]Passenger";
	}

	if(findResourceByName("v-togglehud") != null) {
		enabledKeys += " 🔹 [#FFFFFF]F7: [#AAAAAA]Toggle HUD";
	}

	if(findResourceByName("cheatkeys") != null) {
		enabledKeys += " 🔹 [#FFFFFF]2: [#AAAAAA]Speed Boost 🔹 [#FFFFFF]3: [#AAAAAA]Stop 🔹 [#FFFFFF]5: [#AAAAAA]Reverse 🔹 [#FFFFFF]6: [#AAAAAA]Fix & Heal 🔹 [#FFFFFF]7: [#AAAAAA]Jump";
	}
*/

// ----------------------------------------------------------------------------

/*
addEventHandler("OnPlayerChat", function(event, client, chatMessage) {
	let gunCheats = ["gunsgunsguns", "thugstools", "nuttertools", "professionaltools", "lxgiwyl", "professionalskit", "uzumymw"];
	gunCheats.forEach(function(gunCheat) {
		if(chatMessage.toLowerCase().search(gunCheat.toLowerCase()) != -1) {
			message("Use /gun for a weapon!", COLOUR_YELLOW);
		}
	});

	let vehicleCheats = ["AIWPRTON", "OLDSPEEDDEMON", "JQNTDMH", "VROCKPOKEY", "VPJTQWV", "WHERESTHEFUNERAL", "CELEBRITYSTATUS", "TRUEGRIME", "RZHSUEW", "JUMPJET", "KGGGDKP", "OHDUDE", "FOURWHEELFUN", "AMOMHRER", "ITSALLBULL", "FLYINGTOSTUNT", "MONSTERMASH"]
	vehicleCheats.forEach(function(vehicleCheat) {
		if(chatMessage.toLowerCase().search(vehicleCheat.toLowerCase()) != -1) {
			message("Use /veh for a vehicle!", COLOUR_YELLOW);
		}
	});
});
*/

// ----------------------------------------------------------------------------