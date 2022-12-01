"use strict";

// ----------------------------------------------------------------------------

// There are two types of JSON stringify outputs in this script
// The server saves all JSON data with tabbed JSON stringify (\t) for readability
// The client sends and receives all active data as basic JSON stringify without tabs to condense network data size

// ----------------------------------------------------------------------------

class ProjectData {
	constructor(name, filePath, data = null) {
		this.name = name;
		this.filePath = filePath;
		this.data = data;
		this.editingClient = null;

		this.elements = [];
	}
}

// ----------------------------------------------------------------------------

class ElementData {
	constructor(type, id, data = null) {
		this.type = type;
		this.id = id;
		this.data = data;

		this.children = [];
		this.parent = null;
	}
}

// ----------------------------------------------------------------------------

let projectData = [];

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (typeof DEBUG_RESOURCE == "undefined") {
		console.warn("The v-mexui-designer resource is not finished. Aborting resource start ...");
		event.preventDefault();
		return false;
	}
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.guieditor.update", function (client, dataString) {
	if (!client.administrator) {
		return false;
	}

	let data = JSON.parse(data);
	projectData[client.index].data = data;

	// The save will re-stringify the file for readability
	saveDataToFile(data, projectData[client.index].filePath)
});

// ----------------------------------------------------------------------------

function loadDataFromFile(filePath) {
	let fileData = openTextFile(filePath);
	return fileData;
}

// ----------------------------------------------------------------------------

function saveDataToFile(data, filePath) {
	let stringData = JSON.stringify(data, null, `\t`);
	if (stringData) {
		saveTextFile(filePath, stringData);
	}
}

// ----------------------------------------------------------------------------

addCommandHandler("newgui", function (command, params, client) {
	if (!client.administrator) {
		return false;
	}

	let name = escapeJSONString(params);

	projectData[client.index] = new ProjectData(name, `data/${name}.json`, null);

	triggerNetworkEvent("v.guieditor.init", client);
});

// ----------------------------------------------------------------------------

addCommandHandler("loadgui", function (command, params, client) {
	if (!client.administrator) {
		return false;
	}

	let name = escapeJSONString(params);
	let filePath = `data/${name}.json`;

	let clients = getClients();
	for (let i in clients) {
		if (projectData[i].toLowerCase() == name.toLowerCase()) {
			messageClient(`Somebody is already editing the ${name} GUI!`);
			return false;
		}
	}

	let dataString = loadDataFromFile(projectData[client.index].filePath);
	let data = JSON.parse(dataString);

	projectData[client.index] = new ProjectData(name, filePath, null);
	projectData[client.index].data = data;
	projectData[client.index].editingClient = client;

	// Restringify without the tabs to condense the string
	triggerNetworkEvent("v.guieditor.init", client, JSON.stringify(projectData[client.index].data));
});

// ----------------------------------------------------------------------------

function escapeJSONString(str) {
	return str.replace(/\\n/g, "\\n")
		.replace(/\\'/g, "\\'")
		.replace(/\\"/g, '\\"')
		.replace(/\\&/g, "\\&")
		.replace(/\\r/g, "\\r")
		.replace(/\\t/g, "\\t")
		.replace(/\\b/g, "\\b")
		.replace(/\\f/g, "\\f");
}

// ----------------------------------------------------------------------------