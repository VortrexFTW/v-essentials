"use strict";

// ----------------------------------------------------------------------------

let outputColor = toColour(72, 144, 48, 255);

// ----------------------------------------------------------------------------

addCommandHandler("jse", function(command, params, client) {
	if(!client.administrator) {
		return false;
	}

    if(!params || params == "") {
        outputChatBox("Syntax: /jse <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game), client);
        return false;
    }

    eval(params);
    messageClient("JavaScript server code executed: " + params, client, outputColor);
    return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("jsr", function(command, params, client) {
	if(!client.administrator) {
		return false;
	}

    if(!params || params == "") {
        outputChatBox("Syntax: /jsr <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game), client);
        return false;
    }

    let returnVal = eval("(" + params + ")");
    messageClient("JavaScript server code executed: " + params,  client, outputColor);
	messageClient("Returns: " + returnVal, client, outputColor);
    return true;
});

// ----------------------------------------------------------------------------