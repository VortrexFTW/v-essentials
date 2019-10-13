// ----------------------------------------------------------------------------

addEventHandler("OnElementStreamIn", function(event, element) {
	resyncCivilianElement(element);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	srand(123456789);
	setInterval(resyncCivilians, 5000);
});

// ----------------------------------------------------------------------------

function resyncCivilians() {
	foreach(ii, iv in getPeds()) {
		if(iv.isType(ELEMENT_CIVILIAN)) {
			if(iv.getData("AI")) {
				iv.stayInSamePlace = false;
				iv.setWanderPath(Random(0,10));
			}
		}	
	}
}

// ----------------------------------------------------------------------------

function resyncCivilianElement(element) {
	if(element.isType(ELEMENT_CIVILIAN)) {
		if(element.getData("AI")) {
			startWander(element);
		}
	}
}

// ----------------------------------------------------------------------------

function startWander(civilian) {
	local civilianData = civilian.getData("AI");
	local civilianWeapons = civilian.getData("AIWep");
	
	civilian.stayInSamePlace = false;
	//civilian.subType = civilianData[0];
	civilian.setPedStats(civilianData[2]);
	civilian.walkStyle = civilianData[3];
	if(civilianData[1] > 0) {
		civilian.setThreatSearch(civilianData[1]);
		civilian.heedThreats = true;
	}
	
	if(civilianWeapons.len() > 0) {
		foreach(ii, iv in civilianWeapons) {
			civilian.giveWeapon(iv, 99999);
		}
	}
	
	civilian.setWanderPath(1);
}

// ----------------------------------------------------------------------------

function initCivilians() {
	local peds = getPeds();
	foreach(ii, iv in peds) {
		if(iv.isType(ELEMENT_CIVILIAN)) {
			if(iv.getData("AI")) {
				startWander(iv);
			}
		}
	}
} 

// ----------------------------------------------------------------------------

addEventHandler("OnPedInflictDamage", function(event, attackedPed, attackerPed, weapon, healthLoss, pedPart) {
	//if(pedPart == PEDPIECETYPES_HEAD) {
	//	attackedPed.health = 0;
	//	attackedPed.
	//}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPedSpawn", function(event, ped) {
	resyncCivilianElement(ped);
});

// ----------------------------------------------------------------------------

function Random(min, max) {
    return rand() % (max.tointeger()-min.tointeger());
}