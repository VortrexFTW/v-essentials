"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addEventHandler("OnLostFocus", function(event) {
	triggerNetworkEvent("v.afk", true);
	if(localPlayer != null) {
		localPlayer.collisionsEnabled = false;
		if(gta.game <= GAME_GTA_VC) {
			localPlayer.alpha = 100;
		}
		gta.setCiviliansEnabled(false);
		gta.setTrafficEnabled(false);

		//getElementsByType(ELEMENT_CIVILIAN).filter(c => c.isSyncer).forEach((c2) => { destroyElement(c2) });
		//getElementsByType(ELEMENT_VEHICLE).filter(v => v.isSyncer).forEach((v2) => { destroyElement(v2) });
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnFocus", function(event) {
	if(localPlayer != null) {
		//if(localClient.getData("v.afk") == 1) {
			localPlayer.collisionsEnabled = true;
			if(gta.game <= GAME_GTA_VC) {
				localPlayer.alpha = 255;
			}
			triggerNetworkEvent("v.afk", false);

			gta.setCiviliansEnabled(true);
			gta.setTrafficEnabled(true);		
		//}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnMouseMove", function(event, mouseId, absolute, position) {
	if(localClient.getData("v.afk") > 0) {
		triggerNetworkEvent("v.afk", false);
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnKeyDown", function(event, virtualKey, physicalKey, keyModifiers) {
	if(localClient.getData("v.afk") > 0) {
		triggerNetworkEvent("v.afk", false);
	}
});