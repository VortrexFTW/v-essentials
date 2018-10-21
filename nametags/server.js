"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event) {
	let clients = getClients();
	for(var i in clients) {
		if(clients[i].player != null) {
			clients[i].player.setData("p", clients[i].ping, true);
		}
	}
});

// ----------------------------------------------------------------------------