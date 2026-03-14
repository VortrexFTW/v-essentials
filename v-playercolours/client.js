"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("v.colour", () => {
    if(game.game != GAME_GTA_IV) {
        return false;
    }
    
    getClients().forEach((client) => {
        client.player.setNametag(client.name, Number(client.getData("v.colour")) || COLOUR_WHITE);
    });
});

// ----------------------------------------------------------------------------