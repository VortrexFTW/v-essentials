"use strict";

// ----------------------------------------------------------------------------

let smallGameMessageFont = null;
let smallGameMessageText = "";
let smallGameMessageColour = COLOUR_WHITE;
let smallGameMessageTimer = null;

let blockedScripts = [];

// ----------------------------------------------------------------------------

bindEventHandler("onResourceReady", thisResource, function(event, resource) {
    console.log(`Admin resource ready!`);
    let fontStream = openFile("pricedown.ttf");
    if(fontStream != null) {
        smallGameMessageFont = lucasFont.createFont(fontStream, 20.0);
        fontStream.close();
    }
});

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function(event, deltaTime) {
    blockedScripts.forEach((blockedScript) => {
        gta.terminateScript(blockedScript);
    });
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
    if(smallGameMessageFont != null) {
        if(smallGameMessageText != "") {
            smallGameMessageFont.render(smallGameMessageText, [0, gta.height-50], gta.width, 0.5, 0.0, smallGameMessageFont.size, smallGameMessageColour, true, true, false, true);
        }
    }
});

// ----------------------------------------------------------------------------

addNetworkHandler("smallGameMessage", function(text, colour, duration) {
    console.log(`Showing small game message: ${text} for ${duration}ms`);

    if(smallGameMessageText != "") {
        clearTimeout(smallGameMessageTimer);
    }

    smallGameMessageColour = colour;
    smallGameMessageText = text;

    smallGameMessageTimer = setTimeout(function() {
        smallGameMessageText = "";
        smallGameMessageColour = COLOUR_WHITE;
        smallGameMessageTimer = null;
    }, duration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("requestGameScripts", function() {
    triggerNetworkEvent("receiveGameScripts", gta.getActiveScripts());
});

// ----------------------------------------------------------------------------

addNetworkHandler("receiveBlockedScripts", function(scripts) {
    blockedScripts = scripts;
});

// ----------------------------------------------------------------------------

addNetworkHandler("receiveConsoleMessage", function(messageText) {
    console.warn(messageText);
});

// ----------------------------------------------------------------------------