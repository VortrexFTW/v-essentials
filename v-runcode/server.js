"use strict";

// ----------------------------------------------------------------------------

let outputColor = toColour(72, 144, 48, 255);
let errorMessageColour = toColour(237, 67, 55, 255);
let syntaxMessageColour = toColour(200, 200, 200, 255);

// ----------------------------------------------------------------------------

addCommandHandler("jse", function (command, params, client) {
    if (!client.administrator) {
        return false;
    }

    if (!params || params == "") {
        messageClient("Syntax: /jse <code>", client, syntaxMessageColour);
        return false;
    }

    eval(params);
    messageClient("JavaScript server code executed: " + String(params), client, outputColor);
    return true;
});

// ----------------------------------------------------------------------------

addCommandHandler("jsr", function (command, params, client) {
    if (!client.administrator) {
        return false;
    }

    if (!params || params == "") {
        messageClient("Syntax: /jsr <code>", client, syntaxMessageColour);
        return false;
    }

    let returnVal = eval("(" + params + ")");
    messageClient("JavaScript server code executed: " + String(params), client, outputColor);
    messageClient("Returns: " + returnVal, client, outputColor);
    return true;
});

// ----------------------------------------------------------------------------