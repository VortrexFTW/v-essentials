"use strict";

let serverGame = GAME_GTA_III;
let welcomeMessageColour = toColour(144, 255, 96, 255);

// ----------------------------------------------------------------------------

let disconnectReasons = ["Lost Connection","Disconnected","Unsupported Client","Unsupported Engine","Incorrect Password","Unsupported Executable","Disconnected","Banned","Failed","Invalid Name","Crashed"];
let gameNames = ["Unknown", "GTA III", "GTA Vice City", "GTA San Andreas", "GTA Underground", "GTA IV", "GTA IV (EFLC)"];
let gameMessageHeader = ["[???]:", "[GTA III]: ", "[GTA VC]: ", "[GTA SA]: ", "[GTA UG]: ", "[GTA IV]: ", "[GTA EFLC]: "];
let gameAnnounceColour = [COLOUR_BLACK, COLOUR_SILVER, COLOUR_AQUA, COLOUR_ORANGE, COLOUR_ORANGE, COLOUR_SILVER, COLOUR_SILVER];

// ----------------------------------------------------------------------------

let connectionID = Array(128);
connectionID.fill(-1);

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function(event, client) {
	messageClient("Welcome to Vortrex's Test Server!", client, welcomeMessageColour);
	
    let clients = getClients();
    for(let i in clients) {
        message(client.name + " has joined the game (" + gameNames[serverGame] + ")", gameAnnounceColour[serverGame]);
    }
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, reason) {
    let clients = getClients();
    for(let i in clients) {
        messageClient(client.name + " left the game. [" + disconnectReasons[reason] + "]", clients[i], gameAnnounceColour[serverGame]);
    }
});