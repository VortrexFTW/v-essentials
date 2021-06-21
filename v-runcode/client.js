"use strict";

// ----------------------------------------------------------------------------

let outputColor = toColour(72, 144, 48, 255);

// ----------------------------------------------------------------------------

addCommandHandler("jcr", function(command, params) {
    if(!params || params == "") {
        message("Syntax: /sce <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game));
        return false;
    }

	let returnVal = eval(params);
	message("JavaScript client code executed: " + params, outputColor);
});

// ----------------------------------------------------------------------------

addCommandHandler("jcr", function(command, params) {
    if(!params || params == "") {
        message("Syntax: /sce <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game));
        return false;
    }

	let returnVal = eval("(" + params + ")")
	message("JavaScript client code executed: " + params, outputColor);
	message("Returns: " + returnVal, outputColor);
});

// ----------------------------------------------------------------------------