"use strict";

let enableDiscordEcho = false;

// ----------------------------------------------------------------------------

let emojiReplaceString = [
	[":tongue:", "😛" ],
	[":facepalm:", "🤦‍" ],
	[":hearteyes:", "😍" ],
	[":v:", "✌️" ],
	[":ok_hand:", "👌" ],
	[":thumbsup:", "👍" ],
	[":thumbs_up:", "👍" ],
	[":phone:", "📱" ],
	[":pager:", "📟" ],
	[":laptop:", "💻" ],
	[":100:", "💯" ],
	[":smile:", "🙂" ],
	[":smiley:", "😃" ],	
	[":open_mouth:", "😮" ],
	[":grin:", "😁" ],
	[":laugh:", "😆" ],
	[":laughing:", "😆" ],
	[":rofl:", "🤣" ],
	[":frown:", "☹️" ],	
	[":sad:", "😢" ],
	[":cry:", "😭" ],
	[":crying:", "😭" ],
	[":neutral:", "😐" ],	
	[":sick:", "🤢" ],
	[":poo:", "💩" ],
	[":angry:", "😡" ],	
	[":scream:", "😱" ],
	[":omg:", "😱" ],
	[":thinking:", "🤔" ],
	[":P", "😛" ],	
	[":)", "🙂" ],
	[":D", "😃" ],
	[":o", "😮" ],
	[":O", "😮" ],
	[":(", "☹️" ],
	[":|", "😐" ],
];

// ----------------------------------------------------------------------------

addCommandHandler("me", function(cmdName, params, client) {
	global.message(client.name + " " + params, toColour(177, 156, 217, 255));
});

// ----------------------------------------------------------------------------

addCommandHandler("lme", function(cmdName, params, client) {
	let clients = getClients();
	for(let i in clients) {
		let colour = COLOUR_WHITE;
		if(clients[i].getData("v.colour")) {
			colour = clients[i].getData("v.colour");
		}
		if(getDistance(clients[i].player.position, client.player.position) <= localActionRange) {
			global.message(client.name + " " + params, clients[i], toColour(177, 156, 217, 255));
		}
	}
});

// ----------------------------------------------------------------------------

addCommandHandler("l", function(cmdName, params, client) {
	let clients = getClients();
	for(let i in clients) {
		let colour = COLOUR_WHITE;
		if(clients[i].getData("v.colour")) {
			colour = clients[i].getData("v.colour");
		}
		if(getDistance(clients[i].player.position, client.player.position) <= localTalkRange) {
			global.messageClient(String(client.name + ": [#999999]" + params), clients[i], colour);
		}
	}
});

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerChat", function(event, client, message) {
	event.preventDefault();
	let colour = COLOUR_WHITE;
	if(client.getData("v.colour")) {
		colour = client.getData("v.colour");
	}	
	global.message(String(client.name + ": [#FFFFFF]" + replaceEmojiInString(message)), colour);	
});

// ----------------------------------------------------------------------------

function replaceEmojiInString(message) {
	for(let i in emojiReplaceString) {
		message = message.replace(emojiReplaceString[i][0], emojiReplaceString[i][1]);
	}
	return message;
}