"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		setInterval(setPlayerPingData, 3000);
	}
});

// ----------------------------------------------------------------------------

function setPlayerPingData() {
	let clients = getClients();
	for(let i in clients) {
		clients[i].setData("v.ping", clients[i].ping);
	}
}

// ----------------------------------------------------------------------------