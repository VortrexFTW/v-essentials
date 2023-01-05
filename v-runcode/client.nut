iErrorMessageColour <- toColour(237, 67, 55, 255);
iSyntaxMessageColour <- toColour(200, 200, 200, 255);

// ----------------------------------------------------------------------------

addCommandHandler("sce", function(szCommand, szParams) {
    if(!szParams || szParams == "") {
        message("Syntax: /sce <code>", iSyntaxMessageColour);
        return false;
    }

	compilestring(szParams)();
	message("Squirrel client code executed: " + szParams, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("scr", function(szCommand, szParams) {
    if(!szParams || szParams == "") {
        message("Syntax: /sce <code>", iSyntaxMessageColour);
        return false;
    }

	local szOutput = compilestring("return " + szParams)();
	message("Squirrel client code executed: " + szParams, COLOUR_YELLOW);
	message("Returns: " + szOutput, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------