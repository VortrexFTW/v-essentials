"use strict";

let gameAnnounceColour = [
	COLOUR_BLACK,					// Invalid
	COLOUR_SILVER,					// GTA III
	COLOUR_AQUA,					// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	COLOUR_SILVER,					// GTA IV
	COLOUR_SILVER					// GTA IV (EFLC)		
];

let outputColor = toColour(72,144,48,255);

// ----------------------------------------------------------------------------

addCommandHandler("jse", function(cmdName, params, client) {
    if(!params || params == "") {
        outputChatBox("Syntax: /jse <code>", gameAnnounceColour[client.game], client);
        return false;
    }
    
    eval(params);
    messageClient("JavaScript server code executed: " + params, client, outputColor);
    return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("jsr", function(cmdName, params, client) {
    if(!params || params == "") {
        outputChatBox("Syntax: /jsr <code>", gameAnnounceColour[client.game], client);
        return false;
    }
    
    let returnVal = eval("(" + params + ")");
    messageClient("JavaScript server code executed: " + params,  client, outputColor);
	messageClient("Returns: " + returnVal, client, outputColor);
    return true;
});

// ----------------------------------------------------------------------------