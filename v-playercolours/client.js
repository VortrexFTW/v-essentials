"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

addNetworkHandler("v.colour", () => {
    getClients().forEach((client) => {
        client.player.setNametag(client.name, Number(client.getData("v.colour")) || COLOUR_WHITE);
    });
});

// ----------------------------------------------------------------------------