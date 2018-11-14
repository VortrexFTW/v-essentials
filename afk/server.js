"use strict";

addNetworkHandler("v.afk", function(client, state) {
	if(state == true) {
		client.setData("v.afk", true, true);
		client.player.setData("v.afk", true, true);
	} else {
		client.removeData("v.afk");
		client.player.removeData("v.afk");
	}
});