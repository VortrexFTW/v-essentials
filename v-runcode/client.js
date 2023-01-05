"use strict";

// ----------------------------------------------------------------------------

let outputColor = toColour(72, 144, 48, 255);
let errorMessageColour = toColour(237, 67, 55, 255);
let syntaxMessageColour = toColour(200, 200, 200, 255);

// ----------------------------------------------------------------------------

addCommandHandler("jcr", function (command, params) {
    if (!params || params == "") {
        message("Syntax: /sce <code>", syntaxMessageColour);
        return false;
    }

    let returnVal = eval(params);
    message("JavaScript client code executed: " + params, outputColor);
});

// ----------------------------------------------------------------------------

addCommandHandler("jcr", function (command, params) {
    if (!params || params == "") {
        message("Syntax: /sce <code>", syntaxMessageColour);
        return false;
    }

    let returnVal = eval("(" + params + ")")
    message("JavaScript client code executed: " + params, outputColor);
    message("Returns: " + returnVal, outputColor);
});

// ----------------------------------------------------------------------------