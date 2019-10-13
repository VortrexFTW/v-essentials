"use strict";

let serverGame = server.game;
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
	client.setData("connectTime", new Date().getTime());
	messageClient("Welcome to Vortrex's Test Server!", client, welcomeMessageColour);
	
	message(client.name + " has joined the game (" + gameNames[serverGame] + ")", gameAnnounceColour[serverGame]);
	
	let httpString = "https://vortrex.info/projects/gtac-test/connect.php?key=Nope454&name=" + String(client.name) + "&game=" + String(serverGame) + "&ip=" + String(client.ip) + "&gamever=" + String(client.gameVersion);
    httpGet(
        httpString,
        "",
        function(data) {
        },
        function(data) {
        }
    );	
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerQuit", function(event, client, reason) {
	message(client.name + " left the game. [" + disconnectReasons[reason] + "]", gameAnnounceColour[serverGame]);
	
	let httpString = "https://vortrex.info/projects/gtac-test/disconnect.php?key=Nope454&name=" + String(client.name);
	httpGet(
		httpString,
		"", 
		function(data) {
		},
		function(data) {
		}    
	);	
});

// ----------------------------------------------------------------------------

