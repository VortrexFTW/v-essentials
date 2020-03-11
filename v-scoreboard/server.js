"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	setInterval(setPlayerPingData, 3000);
});

// ----------------------------------------------------------------------------

function setPlayerPingData() {
	getClients().forEach(function(client) {
		client.setData("v.ping", client.ping);
	});
}

// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	if(typeof server == "undefined") {
		let clients = getClients();
		for(let i in clients) {
			if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
				return clients[i];
			}
		}
	} else {
		let clients = getClients();
		if(isNaN(params)) {
			for(let i in clients) {
				if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
					return clients[i];
				}			
			}
		} else {
			let clientID = Number(params) || 0;
			if(typeof clients[clientID] != "undefined") {
				return clients[clientID];
			}			
		}
	}
	
	return false;
}

// ----------------------------------------------------------------------------