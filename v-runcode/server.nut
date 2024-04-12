iErrorMessageColour <- toColour(237, 67, 55, 255);
iSyntaxMessageColour <- toColour(200, 200, 200, 255);

// ----------------------------------------------------------------------------

addCommandHandler("sse", function(szCommand, szParams, pClient) {
	if(!pClient.administrator) {
		return false;
	}

    if(!szParams || szParams == "") {
        messageClient("Syntax: /sse <code>", pClient, iSyntaxMessageColour);
        return false;
    }

	compilestring(szParams)();
	print("Squirrel server code executed: " + szParams);
	messageClient("Squirrel server code executed: " + szParams, pClient, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("ssr", function(szCommand, szParams, pClient) {
	if(!pClient.administrator) {
		return false;
	}

    if(!szParams || szParams == "") {
        messageClient("Syntax: /sse <code>", pClient, iSyntaxMessageColour);
        return false;
    }

	local szOutput = compilestring("return " + szParams)();

	print("Squirrel server code executed: " + szParams);
	print("Returns: " + szOutput);

	messageClient("Squirrel server code executed: " + szParams, pClient, COLOUR_YELLOW);
	messageClient("Returns: " + szOutput, pClient, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------