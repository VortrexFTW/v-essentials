// ----------------------------------------------------------------------------

addCommandHandler("sce", function(szCommand, szParams) {
    if(!szParams || szParams == "") {
        message("Syntax: /sce <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game));
        return false;
    }
	
	compilestring(szParams)();
	message("Squirrel client code executed: " + szParams, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------

addCommandHandler("scr", function(szCommand, szParams) {
    if(!szParams || szParams == "") {
        message("Syntax: /sce <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game));
        return false;
    }
	
	local szOutput = compilestring("return " + szParams)();
	message("Squirrel client code executed: " + szParams, COLOUR_YELLOW);
	message("Returns: " + szOutput, COLOUR_YELLOW);
});

// ----------------------------------------------------------------------------