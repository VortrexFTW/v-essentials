"use strict";

gameAnnounceColour <- [
	COLOUR_BLACK,					// Invalid
	COLOUR_SILVER,					// GTA III
	COLOUR_AQUA,					// GTA Vice City
	COLOUR_ORANGE,					// GTA San Andreas
	COLOUR_ORANGE,					// GTA Underground
	COLOUR_SILVER,					// GTA IV
	COLOUR_SILVER					// GTA IV (EFLC)		
];

// ----------------------------------------------------------------------------

addCommandHandler("sce", function(szCommand, szParams, pClient) {
    if(!szParams || szParams == "") {
        outputChatBox("Syntax: /sce <code>", gameAnnounceColour[client.game], client);
        return false;
    }
	
	compilestring(szParams)();
	outputChatBox("Squirrel client code executed: " + szParams, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("scr", function(szCommand, szParams, pClient) {
    if(!szParams || szParams == "") {
        outputChatBox("Syntax: /sce <code>", gameAnnounceColour[client.game], client);
        return false;
    }
	
	local szOutput = compilestring("return " + szParams)();
	outputChatBox("Squirrel client code executed: " + szParams, COLOUR_YELLOW);
	outputChatBox("Returns: " + szOutput, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------