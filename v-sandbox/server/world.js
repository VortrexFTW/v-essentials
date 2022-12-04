// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.garage`, function (client, garageId, state) {
	let outputMessage = ``;

	gameGarages[server.game][garageId][3] = state;

	triggerNetworkEvent(`sb.w.garage`, null, garageId, gameGarages[server.game][garageId][3]);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.time`, function (client, hour, minute) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	timeLockHour[server.game] = hour;
	timeLockMinute[server.game] = minute;
	gta.time.hour = hour;
	gta.time.minute = minute;

	outputMessage = `set the time to ${makeReadableTime(hour, minute)}`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.minutedur`, function (client, minuteDuration) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	timeMinuteDuration[server.game] = minuteDuration;

	triggerNetworkEvent(`sb.w.minutedur`, null, timeMinuteDuration[server.game]);
	outputMessage = `set the minute duration to ${minuteDuration}`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.timelock`, function (client, state) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	timeLocked[server.game] = !!state;

	outputMessage = String((timeLocked[server.game]) ? `enabled` : `disabled`) + ` time lock`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.trains`, function (client, state) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	trainsEnabled[server.game] = state;
	gta.trainsEnabled = state;

	triggerNetworkEvent(`sb.w.trains`, null, state);

	outputMessage = String((trainsEnabled[server.game]) ? `enabled` : `disabled`) + ` trains`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.planes`, function (client, state) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	planesEnabled[server.game] = state;
	gta.planesEnabled = state;

	outputMessage = String((planesEnabled[server.game]) ? `enabled` : `disabled`) + ` airplanes`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.ssvbridge`, function (client, state) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	ssvBridgeEnabled = state;
	gta.ssvBridgeEnabled = state;

	outputMessage = String((state) ? `enabled` : `disabled`) + ` the Shoreside Vale bridge`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.civilians`, function (client, state) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	civiliansEnabled[server.game] = state;
	triggerNetworkEvent(`sb.w.civilians`, null, state);

	outputMessage = String((state) ? `enabled` : `disabled`) + ` civilians`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.traffic`, function (client, state) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	trafficEnabled[server.game] = state;
	triggerNetworkEvent(`sb.w.traffic`, null, state);

	outputMessage = String((state == true) ? `enabled` : `disabled`) + ` traffic`;
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.civiliandensity`, function (client, density) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	civilianDensity[server.game] = density;
	triggerNetworkEvent(`sb.w.civiliandensity`, null, civilianDensity[server.game]);

	outputMessage = `set civilian density to ` + String(density);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.gamespeed`, function (client, gamespeed) {
	let outputMessage = ``;

	triggerNetworkEvent(`sb.w.gamespeed`, null, gamespeed);

	outputMessage = `set game speed to ` + String(gamespeed);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------

addNetworkHandler(`sb.w.trafficdensity`, function (client, density) {
	if (!client.administrator) {
		messageClient(`You must be an administrator to change this!`, client, errorMessageColour);
		return false;
	}

	let outputMessage = ``;

	trafficDensity[server.game] = density;
	triggerNetworkEvent(`sb.w.trafficdensity`, null, trafficDensity[server.game]);

	outputMessage = `set traffic density to ` + String(density);
	outputSandboxMessage(client, outputMessage);
});

// ----------------------------------------------------------------------------
