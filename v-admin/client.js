"use strict";

// ----------------------------------------------------------------------------

let smallGameMessageFontFile = (typeof gta != "undefined") ? "fonts/pricedown.ttf" : "fonts/aurora-condensed-bold.ttf";
let smallGameMessageFont = null;
let smallGameMessageText = "";
let smallGameMessageColour = COLOUR_WHITE;
let smallGameMessageTimer = null;

// GTA Connected only
let blockedScripts = [];

let tokenData = {};

// ----------------------------------------------------------------------------

bindEventHandler("onResourceReady", thisResource, function (event, resource) {
    let fontStream = openFile(smallGameMessageFontFile);
    if (fontStream != null) {
        smallGameMessageFont = lucasFont.createFont(fontStream, 20.0);
        fontStream.close();
    }
});

// ----------------------------------------------------------------------------

addEventHandler("OnProcess", function (event, deltaTime) {
    if (typeof gta != "undefined") {
        blockedScripts.forEach((blockedScript) => {
            game.terminateScript(blockedScript);
        });
    }
});

// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function (event) {
    if (smallGameMessageFont != null) {
        if (smallGameMessageText != "") {
            smallGameMessageFont.render(smallGameMessageText, [0, game.height - 50], game.width, 0.5, 0.0, smallGameMessageFont.size, smallGameMessageColour, true, true, false, true);
        }
    }
});

// ----------------------------------------------------------------------------

addNetworkHandler("smallGameMessage", function (text, colour, duration) {
    //console.log(`Showing small game message: ${text} for ${duration}ms`);

    if (smallGameMessageText != "") {
        clearTimeout(smallGameMessageTimer);
    }

    smallGameMessageColour = colour;
    smallGameMessageText = text;

    smallGameMessageTimer = setTimeout(function () {
        smallGameMessageText = "";
        smallGameMessageColour = COLOUR_WHITE;
        smallGameMessageTimer = null;
    }, duration);
});

// ----------------------------------------------------------------------------

addNetworkHandler("requestGameScripts", function () {
    if (typeof gta != "undefined") {
        triggerNetworkEvent("receiveGameScripts", game.getActiveScripts());
    }
});

// ----------------------------------------------------------------------------

addNetworkHandler("receiveBlockedScripts", function (scripts) {
    blockedScripts = scripts;
});

// ----------------------------------------------------------------------------

addNetworkHandler("receiveConsoleMessage", function (messageText) {
    console.warn(messageText);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.admin.token", function (serverToken) {
    let tokenFile = loadTextFile("token.json");
    if (tokenFile == "") {
        tokenData = {};
    }

    tokenData = JSON.parse(tokenFile);
    if (tokenData == null) {
        tokenData = {};
    }

    let token = "";
    if (typeof tokenData[serverToken] != "undefined") {
        token = tokenData[serverToken];
    }

    triggerNetworkEvent("v.admin.token", token);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.admin.token.save", function (token, serverToken) {
    let tokenFile = loadTextFile("token.json");
    if (tokenFile == "") {
        tokenData = {};
    }

    tokenData = JSON.parse(tokenFile);
    if (tokenData == null) {
        tokenData = {};
    }

    tokenData[serverToken] = token;
    saveTextFile("token.json", JSON.stringify(tokenData, null, '\t'));
});

// ----------------------------------------------------------------------------