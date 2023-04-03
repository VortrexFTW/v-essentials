// CREDITS TO LUCASC190 FOR MAKING THE MOUSE CAMERA

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	SetStandardControlsEnabled(true);
});

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
	SetStandardControlsEnabled(false);
});

function SetStandardControlsEnabled(bEnabled) {
	if (typeof gta == "undefined") {
		return false;
	}

	if (game.standardControls === undefined) {
		console.warn("game.standardControls not implemented");
		return;
	}
	game.standardControls = bEnabled;
}

function GetCurrentPlayerIndex() {
	return 0;
}

function GetPlayerPed(uiIndex) {
	if (uiIndex >= 1)
		throw new Error("player index out of range");
	return localPlayer;
}

function GetPedVehicle(pPed) {
	return pPed.vehicle;
}

let ENTITYTYPE_BUILDING = 1;
let ENTITYTYPE_VEHICLE = 2;
let ENTITYTYPE_PED = 3;
let ENTITYTYPE_OBJECT = 4;
let ENTITYTYPE_DUMMY = 5;

function GetEntityType(Entity) {
	if (Entity.isType(ELEMENT_BUILDING))
		return ENTITYTYPE_BUILDING;
	if (Entity.isType(ELEMENT_VEHICLE))
		return ENTITYTYPE_VEHICLE;
	if (Entity.isType(ELEMENT_PED))
		return ENTITYTYPE_PED;
	if (Entity.isType(ELEMENT_OBJECT))
		return ENTITYTYPE_OBJECT;
	//if (Entity.isType(ELEMENT_DUMMY))
	//	return ENTITYTYPE_DUMMY;
	return undefined;
}

function GetPlaceableMatrix(pPlaceable) {
	if (pPlaceable == GetCamera())
		return game.cameraMatrix;
	return pPlaceable.matrix;
}

function GetEntityModel(pEntity) {
	return pEntity;
}

function GetModelBoundingSphere(usModel) {
	return [usModel.boundingRadius, usModel.boundingCentre.x, usModel.boundingCentre.y, usModel.boundingCentre.z];
}

function GetMouseSpeed() {
	if (gui.cursorEnabled)
		return [0, 0];
	let MouseSpeed = game.getMouseSpeed();
	return [MouseSpeed.x, -MouseSpeed.y];
}

function GetMouseSensitivity() {
	if (game.getMouseSensitivity === undefined) {
		console.error("game.getMouseSensitivity not implemented");
		return [0.0025, 0.003];
	}
	let MouseSensitivity = game.getMouseSensitivity();
	return [MouseSensitivity.x, MouseSensitivity.y];
}

let GetCamera;
{
	const Camera = Symbol();

	GetCamera = function () {
		return Camera;
	}
}

function AreEntityCollisionsEnabled(pEntity) {
	return pEntity.collisionsEnabled;
}

function SetEntityCollisionsEnabled(pEntity, bCollisionsEnabled) {
	pEntity.collisionsEnabled = bCollisionsEnabled;
}

function ProcessLineOfSight(vecStartX, vecStartY, vecStartZ, vecEndX, vecEndY, vecEndZ, bCheckBuildings, bCheckVehicles, bCheckPeds, bCheckObjects, bCheckDummies, bCheckSeeThroughStuff, bIgnoreSomeObjectsForCamera) {
	if (game.processLineOfSight === undefined) {
		console.warn("game.processLineOfSight not implemented");
		return [null];
	}
	let Result = game.processLineOfSight([vecStartX, vecStartY, vecStartZ], [vecEndX, vecEndY, vecEndZ], bCheckBuildings, bCheckVehicles, bCheckPeds, bCheckObjects, bCheckDummies, bCheckSeeThroughStuff, bIgnoreSomeObjectsForCamera);
	if (Result == null)
		return [null];
	return [Result.position.x, Result.position.y, Result.position.z, Result.normal.x, Result.normal.y, Result.normal.z, Result.entity];
}

function SetPlaceableMatrix(pPlaceable, mat) {
	if (pPlaceable == GetCamera()) {
		game.setCameraMatrix(mat);
		return;
	}
	pPlaceable.matrix = mat;
}

const UpdateCamera = game.updateCamera;

let GetTickCount;
{
	let FrameCount = 0;

	setInterval(() => {
		++FrameCount;
	}, 0);

	let GTAFrameCount = 0;

	addEventHandler("OnProcess", (event, deltaTime) => {
		++GTAFrameCount;
	});

	GetTickCount = function (bGTA, bFrames) {
		if (bFrames)
			return bGTA ? GTAFrameCount : FrameCount;
		else
			return bGTA ? game.tickCount : sdl.ticks;
	}
}

function easingSinusoidalInOut(t, b, c, d)//TODO: Move this to MathUtil.js
{
	return -c / 2 * (Math.cos((Math.PI) * t / d) - 1) + b;
}

//TODO: extract

function applyMultiplierTimeStep(m, t)//TODO: Move this to MathUtil.js
{
	return Math.max(Math.min(1.0 - (1.0 - m) * (t), 1), 0);
}

//TODO: getOffset
//TODO: round
//TODO: getNumberBetween
//TODO: split
//TODO: isWhiteSpaceCharacter
//TODO: isControlCharacter
//TODO: alert
//TODO: confirm

const identityMatrix = new Matrix4x4();
if (identityMatrix.setIdentity === undefined) {
	identityMatrix.m11 = 1;
	identityMatrix.m12 = 0;
	identityMatrix.m13 = 0;
	identityMatrix.m14 = 0;
	identityMatrix.m21 = 0;
	identityMatrix.m22 = 1;
	identityMatrix.m23 = 0;
	identityMatrix.m24 = 0;
	identityMatrix.m31 = 0;
	identityMatrix.m32 = 0;
	identityMatrix.m33 = 1;
	identityMatrix.m34 = 0;
	identityMatrix.m41 = 0;
	identityMatrix.m42 = 0;
	identityMatrix.m43 = 0;
	identityMatrix.m44 = 1;
}

const cameraIdentityMatrix = new Matrix4x4();
cameraIdentityMatrix.m11 = -1;
cameraIdentityMatrix.m12 = 0;
cameraIdentityMatrix.m13 = 0;
cameraIdentityMatrix.m14 = 0;
cameraIdentityMatrix.m21 = 0;
cameraIdentityMatrix.m22 = 1;
cameraIdentityMatrix.m23 = 0;
cameraIdentityMatrix.m24 = 0;
cameraIdentityMatrix.m31 = 0;
cameraIdentityMatrix.m32 = 0;
cameraIdentityMatrix.m33 = 1;
cameraIdentityMatrix.m34 = 0;
cameraIdentityMatrix.m41 = 0;
cameraIdentityMatrix.m42 = 0;
cameraIdentityMatrix.m43 = 0;
cameraIdentityMatrix.m44 = 1;

function createMultipliedMatrix() {
	let matrix = new Matrix4x4();
	matrix.setMultiply.apply(matrix, arguments);
	return matrix;
}

function createXRotationMatrix(x) {
	let matrix = new Matrix4x4();
	matrix.setRotateX(x);
	return matrix;
}

function createYRotationMatrix(x) {
	let matrix = new Matrix4x4();
	matrix.setRotateY(x);
	return matrix;
}

function createZRotationMatrix(z) {
	let matrix = new Matrix4x4();
	matrix.setRotateZ(z);
	return matrix;
}

function createTranslationMatrix(x, y, z) {
	let matrix = new Matrix4x4();
	matrix.setTranslate([x, y, z]);
	return matrix;
}

//TODO: createScaleMatrix

function getDotProduct(x, y, z, x2, y2, z2) {
	return x * x2 + y * y2 + z * z2;
}

function getCrossProduct(x, y, z, x2, y2, z2) {
	return [y * z2 - z * y2, z * x2 - x * z2, x * y2 - y * x2];
}

function getLength(x, y, z) {
	return Math.sqrt(getDotProduct(x, y, z, x, y, z));
}

function normalise(x, y, z) {
	let length = getLength(x, y, z);
	if (length == 0)
		throw new Error("an attempt was made to normalise a three dimensional vector with a length of zero");
	return [x / length, y / length, z / length];
}

function createLookAtLHMatrix(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ) {
	let matrix = new Matrix4x4();
	let [lookX, lookY, lookZ] = normalise(atX - eyeX, atY - eyeY, atZ - eyeZ);
	let [rightX, rightY, rightZ] = normalise.apply(null, getCrossProduct(upX, upY, upZ, lookX, lookY, lookZ));
	[upX, upY, upZ] = getCrossProduct(lookX, lookY, lookZ, rightX, rightY, rightZ);
	matrix.m11 = rightX;
	matrix.m12 = rightY;
	matrix.m13 = rightZ;
	matrix.m14 = 0;

	matrix.m21 = lookX;
	matrix.m22 = lookY;
	matrix.m23 = lookZ;
	matrix.m24 = 0;

	matrix.m31 = upX;
	matrix.m32 = upY;
	matrix.m33 = upZ;
	matrix.m34 = 0;

	matrix.m41 = eyeX;
	matrix.m42 = eyeY;
	matrix.m43 = eyeZ;
	matrix.m44 = 1;

	matrix.m41 = eyeX;
	matrix.m42 = eyeY;
	matrix.m43 = eyeZ;
	matrix.m44 = 1;
	return matrix;
}

function getDifferenceBetweenAngles(current, target) {
	let f = (((target - current) + Math.PI) / (Math.PI * 2));
	return ((f - Math.floor(f)) * (Math.PI * 2)) - Math.PI;
}

let easeCamera = false;
let easeStartTicks;
let easeDuration;
let easeStartPosX, easeStartPosY, easeStartPosZ;
let easeStartLookX, easeStartLookY, easeStartLookZ;
let easeStartUpX, easeStartUpY, easeStartUpZ;

function getCameraPositionInfo(matrix) {
	return [matrix.m41, matrix.m42, matrix.m43, matrix.m21, matrix.m22, matrix.m23, matrix.m31, matrix.m32, matrix.m33];
}

function startCameraEase() {
	easeCamera = true;
	easeStartTicks = GetTickCount(true, false);
	easeDuration = 1000;
	let matrix = GetPlaceableMatrix(GetCamera());
	[easeStartPosX, easeStartPosY, easeStartPosZ, easeStartLookX, easeStartLookY, easeStartLookZ, easeStartUpX, easeStartUpY, easeStartUpZ] = getCameraPositionInfo(matrix);
}

function applyCameraEase(matrix) {
	if (!easeCamera)
		return matrix;
	let ease = (GetTickCount(true, false) - easeStartTicks) / easeDuration;
	if (ease < 1) {
		ease = easingSinusoidalInOut(ease, 0, 1, 1);
		let [newPosX, newPosY, newPosZ, newLookX, newLookY, newLookZ, newUpX, newUpY, newUpZ] = getCameraPositionInfo(matrix);
		let easePosX = easeStartPosX + (newPosX - easeStartPosX) * ease;
		let easePosY = easeStartPosY + (newPosY - easeStartPosY) * ease;
		let easePosZ = easeStartPosZ + (newPosZ - easeStartPosZ) * ease;
		let easeLookX = easeStartLookX + (newLookX - easeStartLookX) * ease;
		let easeLookY = easeStartLookY + (newLookY - easeStartLookY) * ease;
		let easeLookZ = easeStartLookZ + (newLookZ - easeStartLookZ) * ease;
		let easeUpX = easeStartUpX + (newUpX - easeStartUpX) * ease;
		let easeUpY = easeStartUpY + (newUpY - easeStartUpY) * ease;
		let easeUpZ = easeStartUpZ + (newUpZ - easeStartUpZ) * ease;
		return createLookAtLHMatrix(easePosX, easePosY, easePosZ, easePosX + easeLookX, easePosY + easeLookY, easePosZ + easeLookZ, easeUpX, easeUpY, easeUpZ);
	}
	return matrix;
}

function isCameraEasing() {
	return easeCamera && GetTickCount(true, false) < (easeStartTicks + easeDuration);
}

let oldCameraTarget = null;
let OldPosition = null;//2019 Lucas was here!
let cameraRotZ;
let cameraRotY;

function getCameraTarget() {
	let playerPed = GetPlayerPed(GetCurrentPlayerIndex());
	let vehicle = GetPedVehicle(playerPed);
	if (vehicle != null)
		return vehicle;
	if (playerPed != null) {
		//if (playerPed.health <= 1)//Breaks because of fade//2019 Lucas was here!
		//	return null;
		return playerPed;
	}
	return null;
}

function isRelativeToTarget(target) {
	if (GetEntityType(target) == ENTITYTYPE_PED)
		return false;
	return false
}

function isClipped(target) {
	if (GetEntityType(target) == ENTITYTYPE_PED)
		return true;
	return true;
}

//2019 Lucas was here!
function ShouldReturnToRestRotation(Target) {
	if (GetEntityType(Target) == ENTITYTYPE_PED)
		return false;
	return true;
}

function getCameraRestRotation(target) {
	let targetMatrix = GetPlaceableMatrix(target);
	let rotZ;
	if (isRelativeToTarget(target))
		rotZ = 0;
	else
		rotZ = -Math.atan2(targetMatrix.m21, targetMatrix.m22);
	let rotY = -0.2;
	return [rotZ, rotY];
}

function resetCameraRotation() {
	[cameraRotZ, cameraRotY] = getCameraRestRotation(getCameraTarget());
}

//2019 Lucas was here!
let DeltaTime = 0;
addEventHandler("OnProcess", (event, deltaTime) => {
	DeltaTime = deltaTime;
	if (!localPlayer) {
		return false;
	}
});

let IdleTime = 0;//2019 Lucas was here!

function processReturnToRestRotation() {
	//resetCameraRotation();//2019 Lucas was here!

	//2019 Lucas was here!
	let Target = getCameraTarget();
	if (!ShouldReturnToRestRotation(Target))
		return;
	IdleTime += DeltaTime;
	if (IdleTime > 1.5) {
		let Velocity = Target.velocity;
		let Matrix = Target.matrix;
		let Speed = getDotProduct(Velocity.x, Velocity.y, Velocity.z, Matrix.getElement(1 * 4 + 0), Matrix.getElement(1 * 4 + 1), Matrix.getElement(1 * 4 + 2));
		let AbsSpeed = Math.abs(Speed);
		let Multiplier = Math.min(AbsSpeed / 0.75, 1);
		if (Multiplier != 0) {
			let [TargetCameraRotZ2, TargetCameraRotY2] = getCameraRestRotation(Target);
			if (Speed < 0)
				TargetCameraRotZ2 += Math.PI;
			let TimeStep = game.timeStep / 50 * 60;
			cameraRotZ += getDifferenceBetweenAngles(cameraRotZ, TargetCameraRotZ2) * applyMultiplierTimeStep(1 / 20, TimeStep) * Multiplier;
			cameraRotY += getDifferenceBetweenAngles(cameraRotY, TargetCameraRotY2) * applyMultiplierTimeStep(1 / 20, TimeStep) * Multiplier;
		}
	}
}

function cancelReturnToRestRotation() {
	IdleTime = 0;//2019 Lucas was here!
}

let distance;
let zIncrease;

function getCameraOffsetInfo(target) {
	if (GetEntityType(target) == ENTITYTYPE_PED) {
		let distance = 4;
		let zIncrease = 0.8;
		let offsetX = 0;
		let offsetY = 0;
		let offsetZ = 0;
		return [distance, zIncrease, offsetX, offsetY, offsetZ];
	}
	let model = GetEntityModel(target);
	let [radius] = GetModelBoundingSphere(model);
	let minDistance;
	let maxDistance;
	let minZIncrease;
	let maxZIncrease;
	let minRadius;
	let maxRadius;
	let offsetX;
	let offsetY;
	let offsetZ;
	if (radius <= 3.0535011291504) {
		minDistance = 4;
		maxDistance = 8;
		minZIncrease = 0.5;
		maxZIncrease = 1;
		minRadius = 2;
		maxRadius = 3.0535011291504;
	}
	else {
		minDistance = 8;
		maxDistance = 16;
		minZIncrease = 1;
		maxZIncrease = 2;
		minRadius = 3.05350112915042;
		maxRadius = 6.3955960273743;
	}
	offsetX = 0;
	offsetY = 0;
	offsetZ = 0;
	distance = minDistance + (radius - minRadius) / (maxRadius - minRadius) * (maxDistance - minDistance);
	zIncrease = minZIncrease + (radius - minRadius) / (maxRadius - minRadius) * (maxZIncrease - minZIncrease);
	return [distance, zIncrease, offsetX, offsetY, offsetZ];
}

function update() {
	let target = getCameraTarget();
	if (target != null) {
		if (oldCameraTarget != target) {
			//if (oldCameraTarget != null)//2019 Lucas was here!
			let Position = target.position;
			if (OldPosition == null || getLength(Position.x - OldPosition.x, Position.y - OldPosition.y, Position.z - OldPosition.z) < 10)
				startCameraEase()
			resetCameraRotation()
		}
		let [mouseSpeedX, mouseSpeedY] = GetMouseSpeed();
		let [mouseSensitivityX, mouseSensitivityY] = GetMouseSensitivity();
		mouseSpeedX = mouseSpeedX * mouseSensitivityX * 2;
		mouseSpeedY = mouseSpeedY * mouseSensitivityY * 2;
		if (mouseSpeedX == 0 && mouseSpeedY == 0) {
			processReturnToRestRotation();
		}
		else {
			cameraRotZ = cameraRotZ - mouseSpeedX;
			cameraRotY = cameraRotY - mouseSpeedY;
			cancelReturnToRestRotation();
		}
		cameraRotY = Math.max(cameraRotY, -Math.PI / 2 + 0.01);
		if (GetEntityType(target) != ENTITYTYPE_PED)
			cameraRotY = Math.min(cameraRotY, Math.PI / 8.5);//2019 Lucas was here!
		else
			cameraRotY = Math.min(cameraRotY, Math.PI / 4);
		let camera = GetCamera();
		let targetMatrix = GetPlaceableMatrix(target);
		let [distance, zIncrease, offsetX, offsetY, offsetZ] = getCameraOffsetInfo(target);
		let offsetTranslationMatrix = createTranslationMatrix(offsetX, offsetY, offsetZ);
		targetMatrix = createMultipliedMatrix(offsetTranslationMatrix, targetMatrix);
		let targetPosX, targetPosY, targetPosZ;
		if (isRelativeToTarget(target))
			[targetPosX, targetPosY, targetPosZ] = [0, 0, 0];
		else
			[targetPosX, targetPosY, targetPosZ] = [targetMatrix.m41, targetMatrix.m42, targetMatrix.m43];
		let distanceTranslationMatrix = createTranslationMatrix(0, -distance, 0);
		targetPosZ = targetPosZ + zIncrease;
		let targetTranslationMatrix = createTranslationMatrix(targetPosX, targetPosY, targetPosZ);
		let offsetRotationX = createXRotationMatrix(cameraRotY);
		let offsetRotationZ = createZRotationMatrix(cameraRotZ);
		let cameraMatrix = createMultipliedMatrix(cameraIdentityMatrix, distanceTranslationMatrix, offsetRotationX, offsetRotationZ, targetTranslationMatrix);
		if (isRelativeToTarget(target)) {
			cameraMatrix = createMultipliedMatrix(cameraMatrix, targetMatrix);
			targetTranslationMatrix = createMultipliedMatrix(targetTranslationMatrix, targetMatrix);
		}
		if (isClipped(target)) {
			let startX = targetTranslationMatrix.m41;
			let startY = targetTranslationMatrix.m42;
			let startZ = targetTranslationMatrix.m43;
			let endX = cameraMatrix.m41;
			let endY = cameraMatrix.m42;
			let endZ = cameraMatrix.m43;
			let checkBuildings = true;
			let checkVehicles = true;
			let checkPeds = true;
			let checkObjects = true;
			let checkDummies = false;
			let checkSeeThroughStuff = false;
			let ignoreSomeObjectsForCamera = true;
			let collisionsEnabled = AreEntityCollisionsEnabled(target);
			if (collisionsEnabled)
				SetEntityCollisionsEnabled(target, false);
			let [positionX, positionY, positionZ, normalX, normalY, normalZ, targetEntity] = ProcessLineOfSight(startX, startY, startZ, endX, endY, endZ, checkBuildings, checkVehicles, checkPeds, checkObjects, checkDummies, checkSeeThroughStuff, ignoreSomeObjectsForCamera);
			if (collisionsEnabled)
				SetEntityCollisionsEnabled(target, true);
			if (positionX != null) {
				//2019 Lucas was here!
				let Distance = 0.3;
				positionX += normalX * Distance;
				positionY += normalY * Distance;
				positionZ += normalZ * Distance;

				cameraMatrix.m41 = positionX;
				cameraMatrix.m42 = positionY;
				cameraMatrix.m43 = positionZ;
			}
		}
		if (isCameraEasing())
			cameraMatrix = applyCameraEase(cameraMatrix);
		SetPlaceableMatrix(camera, cameraMatrix);
		UpdateCamera(camera);
	}
	oldCameraTarget = target;
	OldPosition = (target != null) ? target.position : null;//2019 Lucas was here!
	return target != null;
}

addEventHandler("OnCameraProcess", (event) => {
	//if(game.standardControls) {
	update();
	event.preventDefault();
	//}
});