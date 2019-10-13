"use strict";

// ----------------------------------------------------------------------------

let spawnTraffic = true;

// ----------------------------------------------------------------------------

let maxVehiclesPerNodeGroup = 3;
let vehicleSpawnOffset = 6.0;
let vehicleProximityDistance = 4.0;
let roadLaneOffsetDistance = 3.0;

// ----------------------------------------------------------------------------

let trafficVehicleCount = 0;

// ----------------------------------------------------------------------------

let normalCivilianSkins = [
	[],
	[
		59, 
		60,
		61,
		62,
		63,
		64,
		45,
		46,
		47,
		48,
		69,
		70,
		71,
		37,
		38,
		34,
		35,
		36,
		49,
		50,
		51,
		52,
		7,
		30,
		31,
		65,
		66,
		41,
		42,
		43,
		44
	],
	[
		12,
		13,
		14,
		15,
		16,
		21,
		31,
		32,
		33,
		34,
		37,
		42,
		47,
		48,
		50,
		52,
		53,
		54,
		55,
		56,
		67,
		68,
		69,
		72,
		82,
		83,
	]
];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	if(spawnTraffic) {
		for(let i in trafficNodes[server.game]) {
			if(trafficNodes[server.game][i].length <= 1) {
				continue;
			}

			let trafficNodeGroup = trafficNodes[server.game][i];
			for(let k in trafficNodeGroup) {
				let tempNode = trafficNodeGroup[k];
				let nextNode = trafficNodeGroup[k==trafficNodeGroup.length-1?0:k+1];
				
				if(typeof nextNode == "undefined") {
					continue;
				}
				
				let tempPosition = new Vec3(tempNode[0], tempNode[1], tempNode[2] + 3);
				let tempNextPosition = new Vec3(nextNode[0], nextNode[1], nextNode[2] + 3);
				let tempHeading = getHeadingFromPosToPos(tempNextPosition, tempPosition);
				
				while(isAnotherVehicleInProximity(tempPosition)) {
					tempPosition = getPosBehindPos(tempPosition, tempHeading, vehicleSpawnOffset);
				}
				
				let rightPos = getPosToRightOfPos(tempPosition, tempHeading, roadLaneOffsetDistance);
					
				let vehicleModel = getRandomTrafficCarModel();
				let tempVehicle = createVehicle(vehicleModel, rightPos);
				tempVehicle.position = rightPos;
				tempVehicle.heading = tempHeading;
				
				let tempDriver = createCivilian(getPedForVehicleModel(vehicleModel), tempPosition);
				tempDriver.position = tempPosition;
				
				addToWorld(tempVehicle);
				addToWorld(tempDriver);
				
				tempDriver.setData("traffic", tempVehicle.id, true);
				tempVehicle.setData("traffic", tempDriver.id, true);	
				tempDriver.warpIntoVehicle(tempVehicle, 0);
				
				trafficVehicleCount++;
			}
		}
	}
	console.log(String(trafficVehicleCount) + " traffic vehicles added!");
});

// ----------------------------------------------------------------------------

/*addEventHandler("OnProcess", function(deltaTime) {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	let clients = getClients();
	for(let i in vehicles) {
		let clientInRange = false;
		for(let i in clients) {
			if(clients[i].player != null) {
				if(getDistance(clients[i].player.position, vehicles[i].position) < 100) {
					clientInRange = true;
				}
			}
		}
		
		if(clientInRange == true) {
			addToWorld(tempVehicle);
			addToWorld(tempDriver);
			vehicles[i].dimension = 0;
		}
	}
});
*/

// ----------------------------------------------------------------------------

function getHeadingFromPosToPos(pos1, pos2) {
	let x = pos2.x-pos1.x;
	let y = pos2.y-pos1.y;
	let rad = Math.atan2(y, x);
	let deg = radToDeg(rad);
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

function getPosToRightOfPos(pos, angle, distance) {
	let x = (pos.x+((Math.cos((angle)+(Math.PI/4)))*distance));
	let y = (pos.y+((Math.sin((angle)+(Math.PI/4)))*distance));
	
	let rightPos = new Vec3(x, y, pos.z);
	
	return rightPos;
}

// ----------------------------------------------------------------------------

function isAnotherVehicleInProximity(position) {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	if(vehicles.length > 0) {
		for(let i in vehicles) {
			if(getDistance(position, vehicles[i].position) <= vehicleProximityDistance) {
				return true;
			}
		}
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function isAnotherTrafficSpawnInProximity(position) {
	for(let i in trafficNodes) {
		for(let k in trafficNodes[i]) {
			let nodePosition = new Vec3(trafficNodes[i][k][0], trafficNodes[i][k][1], trafficNodes[i][k][2]);
			if(getDistance(position, nodePosition) <= vehicleProximityDistance) {
				return true;
			}
		}
	}
	
	return false;
}

// ----------------------------------------------------------------------------

function getDistance(pos1, pos2) {
	let a = Math.pow(pos1.x-pos2.x, 2);
	let b = Math.pow(pos1.y-pos2.y, 2);
	
	return Math.sqrt(a+b);
}

// ----------------------------------------------------------------------------

function getRandomTrafficCarModel() {
	let model = Random(90, 150);
	while(!isValidTrafficModel(model)) {
		model = Random(90, 150);
		//console.log("TRYING " + String(model));
	}
	//console.log("PICKED " + String(model));
	return model;
}

// ----------------------------------------------------------------------------

function isValidTrafficModel(model) {
	if(server.game == GAME_GTA_III) {
		if(model < 90 || model > 150) {
			return false;
		}
		
		switch(model) {
			case MODELVEHICLE_CAR_FIRETRUK:
			case MODELVEHICLE_CAR_AMBULAN:
			case MODELVEHICLE_CAR_FBICAR:
			case MODELVEHICLE_CAR_ENFORCER:
			case MODELVEHICLE_HELI_CHOPPER:
			case MODELVEHICLE_HELI_ESCAPE:
			case MODELVEHICLE_PLANE_AIRTRAIN:
			case MODELVEHICLE_PLANE_DEADDODO:
			case MODELVEHICLE_CAR_BUS:
			case MODELVEHICLE_CAR_COACH:
			case MODELVEHICLE_CAR_LINERUN:
			case MODELVEHICLE_CAR_BARRACKS:
			case MODELVEHICLE_CAR_BARRACKS:
			case MODELVEHICLE_CAR_MULE:
			case MODELVEHICLE_CAR_STRETCH:
			case MODELVEHICLE_CAR_YANKEE:
			case MODELVEHICLE_CAR_BELLYUP:
			case MODELVEHICLE_CAR_TRASH:
			case MODELVEHICLE_CAR_DODO:
			case MODELVEHICLE_CAR_CABBIE:
			case MODELVEHICLE_CAR_CORPSE:
			case MODELVEHICLE_CAR_BORGNINE:
			case MODELVEHICLE_CAR_BFINJECT:
			case MODELVEHICLE_CAR_FLATBED:
			case MODELVEHICLE_CAR_RHINO:
			case MODELVEHICLE_CAR_RCBANDIT:
			case MODELVEHICLE_BOAT_GHOST:
			case MODELVEHICLE_BOAT_PREDATOR:
			case MODELVEHICLE_BOAT_REEFER:
			case MODELVEHICLE_BOAT_SPEEDER:
			case MODELVEHICLE_TRAIN_TRAIN:
				return false;
				
			default:
				return true;
		}
	} else if(server.game == GAME_GTA_VC) {
		if(model < 130 || model > 236) {
			return false;
		}
		
		switch(model) {
			case MODELVEHICLE_CAR_FIRETRUK:
			case MODELVEHICLE_CAR_AMBULAN:
			case MODELVEHICLE_CAR_FBICAR:
			case MODELVEHICLE_CAR_FBIRANCH:
			case MODELVEHICLE_CAR_ENFORCER:
			case MODELVEHICLE_CAR_VICECHEE:
			
			case MODELVEHICLE_CAR_MAVERICK:
			case MODELVEHICLE_CAR_VCNMAV:
			case MODELVEHICLE_CAR_POLMAV:
			case MODELVEHICLE_CAR_HUNTER:
			case MODELVEHICLE_CAR_SEASPAR:
			
			case MODELVEHICLE_PLANE_AIRTRAIN:
			case MODELVEHICLE_PLANE_DEADDODO:
			
			case MODELVEHICLE_CAR_BUS:
			case MODELVEHICLE_CAR_COACH:
			case MODELVEHICLE_CAR_LINERUN:
			case MODELVEHICLE_CAR_BARRACKS:
			case MODELVEHICLE_CAR_MULE:
			case MODELVEHICLE_CAR_STRETCH:
			case MODELVEHICLE_CAR_YANKEE:
			case MODELVEHICLE_CAR_TRASH:
			case MODELVEHICLE_CAR_BFINJECT:
			case MODELVEHICLE_CAR_FLATBED:
			case MODELVEHICLE_CAR_RHINO:
			case MODELVEHICLE_CAR_BAGGAGE:
			case MODELVEHICLE_CAR_BLOODRA:
			case MODELVEHICLE_CAR_BLOODRB:
			case MODELVEHICLE_CAR_CADDY:
			
			case MODELVEHICLE_CAR_RCBANDIT:
			case MODELVEHICLE_CAR_RCBARON:
			case MODELVEHICLE_CAR_RCGOBLIN:
			case MODELVEHICLE_CAR_RCRAIDER:
			
			case MODELVEHICLE_BOAT_PREDATOR:
			case MODELVEHICLE_BOAT_REEFER:
			case MODELVEHICLE_BOAT_SPEEDER:
			case MODELVEHICLE_BOAT_RIO:
			case MODELVEHICLE_BOAT_MARQUIS:
			case MODELVEHICLE_BOAT_JETMAX:
			case MODELVEHICLE_BOAT_DINGHY:
			case MODELVEHICLE_BOAT_COASTG:
			case MODELVEHICLE_BOAT_SKIMMER:
				return false;
				
			default:
				return true;
		}		
	}
}

// ----------------------------------------------------------------------------

function getPedForVehicleModel(vehicleModel) {
	if(server.game == GAME_GTA_III) {
		switch(vehicleModel) {
			case 116:
				return 1;
			
			case 110:
				return 8;
				
			case 106:
				return 6;
				
			case 134:
				return 10;
				
			case 135:
				return 18;
			
			case 136:
				return 16;
				
			case 137:
				return 14;
				
			case 138:
				return 20;
			
			case 139:
				return 22;
			
			default: 
				return getRandomNormalCivilianSkin();
		}
	} else if(server.game == GAME_GTA_VC) {
		switch(vehicleModel) {
			case 156:
				return 1;			
			
			case 168:
			case 150:
				return 28;
				
			case 158:
				return 92;
				
			case 137:
				return 6;
			
			case 146:
				return 5;
				
			case 166:
				return 94;
				
			case 193:
				return 93;

			default: 
				return getRandomNormalCivilianSkin();
		}
	}
	return getRandomNormalCivilianSkin();
}

// ----------------------------------------------------------------------------

function getRandomTrafficPedSkin() {
	return 0;
}

// ----------------------------------------------------------------------------

function Random(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

// ----------------------------------------------------------------------------

function getRandomNormalCivilianSkin() {
	let slot = Random(0, normalCivilianSkins[server.game].length);
	return normalCivilianSkins[server.game][slot];
}

// ----------------------------------------------------------------------------

function getPosBehindPos(pos, angle, distance) {
	let x = (pos.x+((Math.cos(angle-(Math.PI/2)))*distance));
	let y = (pos.y+((Math.sin(angle-(Math.PI/2)))*distance));
	let z = pos.z;
	
	return new Vec3(x,y,z);
}

// ----------------------------------------------------------------------------

addNetworkHandler("v.traffic.respawn", function(client, elementID) {
	let element = getElementFromId(elementID);
	if(element != null) {
		destroyElement();
	}
});