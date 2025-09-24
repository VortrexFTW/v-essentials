"use strict";

// ----------------------------------------------------------------------------

let scriptConfig = null;
let defaultLanguageId = 28;

// ----------------------------------------------------------------------------

let errorMessageColour = toColour(237, 67, 55, 255);
let syntaxMessageColour = toColour(200, 200, 200, 255);

// ----------------------------------------------------------------------------

let translateURL = "http://api.mymemory.translated.net/get?de={3}&q={0}&langpair={1}|{2}";

// ----------------------------------------------------------------------------

let translationLanguages = [
	["Abkhazian", "AB"],
	["Afar", "AA"],
	["Afrikaans", "AF", "🇿🇦"],
	["Albanian", "SQ"],
	["Amharic", "AM"],
	["Arabic", "AR"],
	["Armenian", "HY"],
	["Assamese", "AS"],
	["Aymara", "AY"],
	["Azerbaijani", "AZ"],
	["Bashkir", "BA"],
	["Basque", "EU"],
	["Bengali, Bangla", "BN"],
	["Bhutani", "DZ"],
	["Bihari", "BH"],
	["Bislama", "BI"],
	["Breton", "BR"],
	["Bulgarian", "BG"],
	["Burmese", "MY"],
	["Byelorussian", "BE"],
	["Cambodian", "KM"],
	["Catalan", "CA"],
	["Chinese", "ZH"],
	["Corsican", "CO"],
	["Croatian", "HR"],
	["Czech", "CS"],
	["Danish", "DA"],
	["Dutch", "NL", "🇳🇱"],
	["English", "EN", "🇺🇸"],
	["Esperanto", "EO"],
	["Estonian", "ET"],
	["Faeroese", "FO"],
	["Fiji", "FJ"],
	["Finnish", "FI"],
	["French", "FR", "🇫🇷"],
	["Frisian", "FY"],
	["Gaelic (Scots Gaelic)", "GD"],
	["Galician", "GL"],
	["Georgian", "KA"],
	["German", "DE", "🇩🇪"],
	["Greek", "EL"],
	["Greenlandic", "KL"],
	["Guarani", "GN"],
	["Gujarati", "GU"],
	["Hausa", "HA"],
	["Hebrew", "IW"],
	["Hindi", "HI"],
	["Hungarian", "HU"],
	["Icelandic", "IS"],
	["Indonesian", "IN"],
	["Interlingua", "IA"],
	["Interlingue", "IE"],
	["Inupiak", "IK"],
	["Irish", "GA"],
	["Italian", "IT"],
	["Japanese", "JA"],
	["Javanese", "JW"],
	["Kannada", "KN"],
	["Kashmiri", "KS"],
	["Kazakh", "KK"],
	["Kinyarwanda", "RW"],
	["Kirghiz", "KY"],
	["Kirundi", "RN"],
	["Korean", "KO"],
	["Kurdish", "KU"],
	["Laothian", "LO"],
	["Latin", "LA"],
	["Latvian, Lettish", "LV"],
	["Lingala", "LN"],
	["Lithuanian", "LT"],
	["Macedonian", "MK"],
	["Malagasy", "MG"],
	["Malay", "MS"],
	["Malayalam", "ML"],
	["Maltese", "MT"],
	["Maori", "MI"],
	["Marathi", "MR"],
	["Moldavian", "MO"],
	["Mongolian", "MN"],
	["Nauru", "NA"],
	["Nepali", "NE"],
	["Norwegian", "NO"],
	["Occitan", "OC"],
	["Oriya", "OR"],
	["Oromo, Afan", "OM"],
	["Pashto, Pushto", "PS"],
	["Persian", "FA"],
	["Polish", "PL", "🇵🇱"],
	["Portuguese", "PT"],
	["Portuguese", "PT"],
	["Punjabi", "PA"],
	["Quechua", "QU"],
	["Rhaeto-Romance", "RM"],
	["Romanian", "RO"],
	["Russian", "RU", "🇷🇺"],
	["Samoan", "SM"],
	["Sangro", "SG"],
	["Sanskrit", "SA"],
	["Serbian", "SR"],
	["Serbo-Croatian", "SH"],
	["Sesotho", "ST"],
	["Setswana", "TN"],
	["Shona", "SN"],
	["Sindhi", "SD"],
	["Singhalese", "SI"],
	["Siswati", "SS"],
	["Slovak", "SK", "🇸🇰"],
	["Slovenian", "SL", "🇸🇮"],
	["Somali", "SO", "🇸🇴"],
	["Spanish", "ES", "🇪🇸"],
	["Sudanese", "SU"],
	["Swahili", "SW"],
	["Swedish", "SV"],
	["Tagalog", "TL"],
	["Tajik", "TG"],
	["Tamil", "TA"],
	["Tatar", "TT"],
	["Tegulu", "TE"],
	["Thai", "TH"],
	["Tibetan", "BO"],
	["Tigrinya", "TI"],
	["Tonga", "TO"],
	["Tsonga", "TS"],
	["Turkish", "TR"],
	["Turkmen", "TK"],
	["Twi", "TW"],
	["Ukrainian", "UK"],
	["Urdu", "UR"],
	["Uzbek", "UZ"],
	["Vietnamese", "VI"],
	["Volapuk", "VO"],
	["Welsh", "CY"],
	["Wolof", "WO"],
	["Xhosa", "XH"],
	["Yiddish", "JI"],
	["Yoruba", "YO"],
	["Zulu", "ZU"]
];

let countryLanguages = {
	"DE": "DE",
	"BR": "PT",
	"PT": "PT",
	"RU": "RU",
	"FR": "FR",
	"EG": "AR",
	"IQ": "AR",
	"RO": "RO",
	"PL": "PL",
	"CZ": "CS",
	"CN": "ZH",
	"ES": "ES",
	"MX": "ES",
	"CO": "ES",
};

// ----------------------------------------------------------------------------

// Translation Cache
let cachedTranslations = new Array(translationLanguages.length);
let cachedTranslationFrom = new Array(translationLanguages.length);
cachedTranslationFrom.fill([]);
cachedTranslations.fill(cachedTranslationFrom);

// ----------------------------------------------------------------------------

addEventHandler("OnPlayerJoined", function (event, client) {
	let languageId = getPlayerLanguage(client.name);
	client.setData("v.translate", languageId);
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	scriptConfig = loadResourceConfig();
	if (!scriptConfig) {
		console.log(`[${thisResource.name}]: Resource config.json could not be loaded. Resource stopping ...`);
		thisResource.stop();
		return false;
	}

	defaultLanguageId = getLanguageIdFromParams(scriptConfig.defaultLanguage) || 28;

	getClients().forEach(function (client) {
		let languageId = getPlayerLanguage(client.name);
		client.setData("v.translate", languageId);
	});

	exportFunction("translateMessage", translateMessage);
	exportFunction("getLanguageIdFromParams", getLanguageIdFromParams);
	exportFunction("getPlayerLanguage", getPlayerLanguage);
	exportFunction("setPlayerLanguage", setPlayerLanguage);

	console.log(`[${thisResource.name}]: Resource started!`);

	runTranslatorTest();
});

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
	getClients().forEach(function (client) {
		client.removeData("v.translate");
	});

	console.log(`[${thisResource.name}]: Resource stopped!`);
});

// ----------------------------------------------------------------------------

function getLanguageIdFromParams(params) {
	// Search locale abbreviations first (en, es, de, etc)
	for (let i in translationLanguages) {
		if (translationLanguages[i][1].toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return Number(i);
		}
	}

	// Search english-based language names next (English, Spanish, German, etc)
	for (let i in translationLanguages) {
		if (translationLanguages[i][0].toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return Number(i);
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

addCommandHandler("lang", async function (command, params, client) {
	if (!params) {
		messageClient(`/${command} <language name>`, client, syntaxMessageColour);
		return false;
	}

	let languageId = getLanguageIdFromParams(params);
	if (!languageId) {
		messageClient("That language was not found!", client, errorMessageColour);
		return false;
	}

	client.setData("v.translate", languageId);
	setPlayerLanguage(client.name, languageId);

	let outputString = `Your language has been set to ${translationLanguages[languageId][0]}`;
	translateMessage(outputString, getLanguageIdFromParams("EN"), languageId).then(translatedMessage => {
		messageClient(translatedMessage, client, COLOUR_YELLOW);
	});
});

// ----------------------------------------------------------------------------

function getPlayerLanguage(name) {
	/*
	let ini = module.ini.create();
	ini.loadFile("translate.ini");
	let languageId = ini.getIntValue("Game", name, 28);
	console.log("LANG: " + languageId);
	module.ini.delete(ini);

	return languageId;
	*/
	return 28;
}

// ----------------------------------------------------------------------------

function setPlayerLanguage(name, languageId) {
	/*
	let ini = module.ini.create();
	ini.loadFile("translate.ini");
	ini.setIntValue("Game", name, languageId);
	module.ini.delete(ini);

	return languageId;
	*/
}

// ----------------------------------------------------------------------------

async function translateMessage(messageText, translateFrom = defaultLanguageId, translateTo = defaultLanguageId) {
	if (translateFrom == translateTo) {
		return messageText;
	}

	return new Promise(resolve => {
		for (let i in cachedTranslations[translateFrom][translateTo]) {
			if (cachedTranslations[translateFrom][translateTo][0] == messageText) {
				console.log(`[${thisResource.name}]: Using existing translation for ${translationLanguages[translateFrom][0]} to ${translationLanguages[translateTo][0]} - (${messageText}), (${cachedTranslations[translateFrom][translateTo][1]})`);
				resolve(cachedTranslations[translateFrom][translateTo][1]);
			}
		}

		let thisTranslationURL = translateURL.format(encodeURI(messageText), translationLanguages[translateFrom][1], translationLanguages[translateTo][1], scriptConfig.emailAddress);
		httpGet(
			thisTranslationURL,
			"",
			function (data) {
				data = ab2str(data);
				//tdata = data.substr(0, data.lastIndexOf("}")+1);
				let translationData = JSON.parse(data);
				cachedTranslations[translateFrom][translateTo].push([messageText, translationData.responseData.translatedText]);
				resolve(translationData.responseData.translatedText);
			},
			function (data) {
			}
		);
	});
}

// ----------------------------------------------------------------------------

String.prototype.format = function () {
	let a = this;
	for (let i in arguments) {
		a = a.replace("{" + String(i) + "}", arguments[i]);
	}
	return a;
}

// ----------------------------------------------------------------------------

function loadResourceConfig() {
	let configFile = loadTextFile("config.json");

	let tempScriptConfig = JSON.parse(configFile);
	if (!tempScriptConfig) {
		return false;
	}

	return tempScriptConfig;
}

// ----------------------------------------------------------------------------

async function runTranslatorTest() {
	let translateTo = getLanguageIdFromParams("spanish");
	//console.log(translateTo);
	translateMessage("Hello", defaultLanguageId, translateTo).then((result) => {
		console.log(`[${thisResource.name}]: Testing translator (EN/ES): Hello / ${result}`);
	});
}

// ----------------------------------------------------------------------------

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// ----------------------------------------------------------------------------