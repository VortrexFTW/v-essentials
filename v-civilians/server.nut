// ----------------------------------------------------------------------------

spawnCivilians <- true;
civilianProximityDistance <- 2.0;
civilianPedCount <- 0;

// ----------------------------------------------------------------------------

civilianTypes <- [
	false,
	[
		// Emergency
		[1, [6|16|21, 0, 1|16, 11], [2]], // Cop
		[1, [6|16|21, 0, 1|16, 0], [2]], // Cop (Fat cop walk)
		
		// Gangs
		[10, [7, 0, 4|16, 10], [2]], // Leone
		[11, [7, 0, 4|16, 10], [2]], // Leone
		[12, [8, 0, 5|16, 9], [1,2]], // Triad
		[13, [8, 0, 5|16, 9], [1,2]], // Triad
		[14, [9, 0, 6|16, 9], [1,2]], // Diablo
		[15, [9, 0, 6|16, 9], [1,2]], // Diablo
		[16, [10, 0, 7|16, 9], [1,2]], // Yakuza
		[17, [10, 0, 7|16, 9], [1,2]], // Yakuza	
		[18, [11, 0, 8|16, 9], [1,2]], // Yardie	
		[19, [11, 0, 8|16, 9], [1,2]], // Yardie	
		[20, [12, 0, 9|16, 9], [1,2]], // Cartel	
		[21, [12, 0, 9|16, 9], [1,2]], // Cartel		
		[22, [13, 0, 10|16, 9], [1,2]], // Red Jacks		
		[23, [13, 0, 10|16, 9], [1,2]], // Purple Nine		
		
		// Normal Civilians
		[76, [5, 1048576, 33, 14], []], // Shopper
		[77, [5, 1048576, 33, 14], []], // Shopper
		[78, [5, 1048576, 33, 14], []], // Shopper
		[59, [4, 1048576, 11, 0], []],
		[60, [4, 1048576, 11, 0], []],
		[61, [4, 1048576, 11, 0], []],
		[62, [5, 1048576, 17, 13], []],
		[63, [5, 1048576, 17, 13], []],
		[64, [5, 1048576, 17, 13], []],
		[45, [4, 1048576, 11, 0], []],
		[46, [4, 1048576, 11, 0], []],
		[47, [5, 1048576, 17, 13], []],
		[48, [5, 1048576, 17, 13], []],
		[69, [4, 1048576, 11, 0], []],
		[70, [4, 1048576, 11, 0], []],
		[71, [5, 1048576, 17, 13], []],
		[37, [5, 1048576, 17, 18], []],
		[38, [5, 1048576, 17, 18], []],
		[34, [5, 1048576, 17, 13], []],
		[35, [5, 1048576, 17, 13], []],
		[36, [5, 1048576, 17, 13], []],
		[49, [4, 1048576, 11, 0], []],
		[50, [4, 1048576, 11, 0], []],
		[51, [5, 1048576, 17, 13], []],
		[52, [5, 1048576, 17, 13], []],
		[7, [4, 1048576, 11, 0], []],
		[30, [4, 1048576, 11, 0], []],
		[31, [4, 1048576, 11, 0], []],
		[65, [4, 1048576, 11, 0], []],
		[66, [5, 1048576, 17, 13], []],
		[41, [4, 1048576, 11, 0], []],
		[42, [4, 1048576, 11, 0], []],
		[43, [5, 1048576, 17, 13], []],
		[43, [5, 1048576, 17, 13], []],
	],
];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	srand(123456789);
	print(civilianTypes);

	if(spawnCivilians) {
		initCivilians();
		setTimeout(initCivilians, 5000);
		setTimeout(initCivilians, 10000);
	}
});

// ----------------------------------------------------------------------------

function initCivilians() {
	foreach(ii, iv in civilianNodes) {
		foreach(ki, kv in iv) {
			local tempNode = kv;
			local nextNode = civilianNodes[ki==kv.len()-1?0:ki+1];
			local tempPosition = Vec3(tempNode[0], tempNode[1], tempNode[2]+2);
			if(!isAnotherCivilianInProximity(tempPosition)) {
				local tempCivilianData = getRandomCivilianData();
				
				local tempCivilian = createCivilian(tempCivilianData[0], tempPosition);
				tempCivilian.setData("AI", tempCivilianData[1], true);
				tempCivilian.setData("AIWep", tempCivilianData[2], true);
				tempCivilian.position = tempPosition;
	
				addToWorld(tempCivilian);
				civilianPedCount++;
			}
		}
	}
	
	print(civilianPedCount + " walking civilians spawned!");
}

// ----------------------------------------------------------------------------

function getHeadingFromPosToPos(pos1, pos2) {
	local x = pos2.x-pos1.x;
	local y = pos2.y-pos1.y;
	local rad = atan2(y, x);
	local deg = radToDeg(rad);
	deg -= 90;
	deg = deg % 360;
	return degToRad(deg);
}

// ----------------------------------------------------------------------------

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ----------------------------------------------------------------------------

function isAnotherCivilianInProximity(position) {
	local civilians = getElementsByType(ELEMENT_CIVILIAN);
	if(civilians.len() > 0) {
		foreach(ii, iv in civilians) {
			if(getDistance(position, iv.position) <= civilianProximityDistance) {
				return true;
			}
		}
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function getDistance(pos1, pos2) {
	local a = pow(pos1.x-pos2.x, 2);
	local b = pow(pos1.y-pos2.y, 2);
	
	return sqrt(a+b);
}

// ----------------------------------------------------------------------------

function getRandomCivilianData() {
	local civTypeID = Random(0, civilianTypes.len()-1);
	return civilianTypes[civTypeID];
}

// ----------------------------------------------------------------------------

function Random(min, max) {
    return rand() % (max.tointeger()-min.tointeger());
}

// ----------------------------------------------------------------------------

function getRandomNormalCivilianSkin() {
	return 0;
}

// ----------------------------------------------------------------------------

function getPosBehindPos(pos, angle, distance) {
	local x = (pos.x+((cos(angle-(PI/2)))*distance));
	local y = (pos.y+((sin(angle-(PI/2)))*distance));
	local z = pos.z;
	
	return Vec3(x,y,z);
}

// ----------------------------------------------------------------------------