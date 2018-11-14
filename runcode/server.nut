"use strict";

local pOutputColor = COLOUR_YELLOW;
local syntaxMessageColour = COLOUR_SILVER;

// ----------------------------------------------------------------------------

addCommandHandler("sse", function(szCommand, szParams, pClient) {
    if(!szParams || szParams == "") {
        outputChatBox("Syntax: /sse <code>", syntaxMessageColour, client);
        return false;
    }
	
	compilestring(szParams)();
	messageClient("Squirrel server code executed: " + szParams, pClient, pOutputColor);
});

// ----------------------------------------------------------------------------

addCommandHandler("ssr", function(szCommand, szParams, pClient) {
    if(!szParams || szParams == "") {
        outputChatBox("Syntax: /sse <code>", syntaxMessageColour, pClient, pOutputColor);
        return false;
    }
	
	local szOutput = compilestring("return " + szParams)();
	messageClient("Squirrel server code executed: " + szParams, pClient, pOutputColor);
	messageClient("Returns: " + szOutput, pClient, pOutputColor);
});

// ----------------------------------------------------------------------------