"use strict";

// ----------------------------------------------------------------------------

const V_EDIT_NONE = 0;
const V_EDIT_SIZE = 1;
const V_EDIT_POS = 2;
const V_EDIT_COLOUR = 3;
const V_EDIT_TEXT = 4;
const V_EDIT_NAME = 5;

const V_NO_SIZE_MULTIPLIER = 1;
const V_CTRL_SIZE_MULTIPLIER = 10;
const V_SHIFT_SIZE_MULTIPLIER = 100;

const V_NO_POS_MULTIPLIER = 1;
const V_CTRL_POS_MULTIPLIER = 10;
const V_SHIFT_POS_MULTIPLIER = 100;

// ----------------------------------------------------------------------------

class ProjectData {
	constructor(name, data = null) {
		this.name = name;
		this.data = data;
		this.editingClient = null;

		this.elements = [];
	}
}

// ----------------------------------------------------------------------------

class ElementData {
	constructor(type, name, id, data = null) {
		this.type = type;
		this.name = name;
		this.id = id;
		this.data = data;

		this.children = [];
		this.parent = null;
	}
}

// ----------------------------------------------------------------------------

let projectData = null;
let editingElement = null;
let editingElementState = null;
let editingElementSubType = null;

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {

});

// ----------------------------------------------------------------------------

addNetworkHandler("v.guieditor.init", function (data) {
	bindKey(SDLK_A, KEYSTATE_UP, leftKey);
	bindKey(SDLK_D, KEYSTATE_UP, rightKey);
	bindKey(SDLK_W, KEYSTATE_UP, upKey);
	bindKey(SDLK_S, KEYSTATE_UP, downKey);
	bindKey(SDLK_RETURN, KEYSTATE_UP, enterKey);

	let data = JSON.parse(dataString);

	projectData = data;
	createMexUIFromData(data);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.guieditor.exit", function () {
	unbindKey(SDLK_A);
	unbindKey(SDLK_D);
	unbindKey(SDLK_W);
	unbindKey(SDLK_S);
	unbindKey(SDLK_RETURN);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.guieditor.data", function (dataString) {

});

// ----------------------------------------------------------------------------

function expandArrays(...args)
{
	let values = [];
	args.forEach(arg =>
	{
		if(Array.isArray(arg))
		{
			arg.forEach(arg2 => values.push(arg2));
		}
		else
		{
			values.push(arg);
		}
	});
	return values;
}

// ----------------------------------------------------------------------------

function createMexUIFromData(data) {
	let editorApp = {};

	editorApp.window = mexui.window(getPositionVec2(data.window.position), getSizeVec2(data.window.size), data.window.title, data.window.style);
	editorApp.window.titleBarShown = data.window.shown;
	editorApp.window.titleBarHeight = data.window.height;
	editorApp.window.titleBarIconShown = data.window.shown;
	editorApp.window.titleBarIconSize = getPositionVec2(data.window.position);

	for (let i in data.elements) {
		switch (data.elements[i].type) {
			case "button":
				editorApp.elements[i] = editorApp.window.button.apply(editorApp.window, expandArrays(getPositionVec2(data.elements[i].position), getSizeVec2(data.elements[i].size), data.elements[i].text, data.window.style));
				editorApp.elements[i].callback = data.elements[i].callback;
				break;

			case "character":
				editorApp.elements[i] = editorApp.window.character.apply(editorApp.window, expandArrays(getPositionVec2(data.elements[i].position), getSizeVec2(data.elements[i].size), data.elements[i].text, data.window.style));
				editorApp.elements[i].callback = data.elements[i].callback;
				break;

			case "image":
				editorApp.elements[i] = editorApp.window.image.apply(editorApp.window, expandArrays(getPositionVec2(data.elements[i].position), getSizeVec2(data.elements[i].size), data.elements[i].imagePath, data.window.style));
				editorApp.elements[i].callback = data.elements[i].callback;
				break;

			case "text":
				editorApp.elements[i] = editorApp.window.text.apply(editorApp.window, expandArrays(getPositionVec2(data.elements[i].position), getSizeVec2(data.elements[i].size), data.elements[i].text, data.window.style));
				break;

			case "textInput":
				editorApp.elements[i] = editorApp.window.textInput.apply(editorApp.window, expandArrays(getPositionVec2(data.elements[i].position), getSizeVec2(data.elements[i].size), data.window.style));
				editorApp.elements[i].placeholder = data.elements[i].placeholder;
				editorApp.elements[i].masked = data.elements[i].masked;
				editorApp.elements[i].callback = data.elements[i].callback;
				break;
		}
	}
}

// ----------------------------------------------------------------------------

function leftKey() {
	if (projectData == null) {
		return false;
	}

	if (editingElement == null) {
		return false;
	}

	switch (editingElementState) {
		case V_EDIT_SIZE:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.size.x = editingElement.size.x - V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.size.x = editingElement.size.x - V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.size.x = editingElement.size.x - V_NO_SIZE_MULTIPLIER;
			break;

		case V_EDIT_POS:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.position.x = editingElement.position.x - V_SHIFT_POS_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.position.x = editingElement.position.x - V_CTRL_POS_MULTIPLIER;
				return true;
			}

			editingElement.position.x = editingElement.position.x - V_NO_POS_MULTIPLIER;
			break;
	}
}

// ----------------------------------------------------------------------------

function rightKey() {
	if (projectData == null) {
		return false;
	}

	if (editingElement == null) {
		return false;
	}

	switch (editingElementState) {
		case V_EDIT_SIZE:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.size.x = editingElement.size.x + V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.size.x = editingElement.size.x + V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.size.x = editingElement.size.x + V_NO_SIZE_MULTIPLIER;
			break;

		case V_EDIT_POS:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.position.x = editingElement.position.x + V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.position.x = editingElement.position.x + V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.position.x = editingElement.position.x + V_NO_POS_MULTIPLIER;
			break;
	}
}

// ----------------------------------------------------------------------------

function upKey() {
	if (projectData == null) {
		return false;
	}

	if (editingElement == null) {
		return false;
	}

	switch (editingElementState) {
		case V_EDIT_SIZE:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.size.y = editingElement.size.y - V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.size.y = editingElement.size.y - V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.size.y = editingElement.size.y - V_NO_SIZE_MULTIPLIER;
			break;

		case V_EDIT_POS:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.position.y = editingElement.position.y - V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.position.y = editingElement.position.y - V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.position.y = editingElement.position.y - V_NO_POS_MULTIPLIER;
			break;
	}
}

// ----------------------------------------------------------------------------

function downKey() {
	if (projectData == null) {
		return false;
	}

	if (editingElement == null) {
		return false;
	}

	switch (editingElementState) {
		case V_EDIT_SIZE:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.size.y = editingElement.size.y + V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.size.y = editingElement.size.y + V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.size.y = editingElement.size.y + V_NO_SIZE_MULTIPLIER;
			break;

		case V_EDIT_POS:
			if (sdl.getModState() & KMOD_LSHIFT || sdl.getModState() & KMOD_RSHIFT) {
				editingElement.position.y = editingElement.position.y + V_SHIFT_SIZE_MULTIPLIER;
				return true;
			}

			if (sdl.getModState() & KMOD_LCTRL || sdl.getModState() & KMOD_RCTRL) {
				editingElement.position.y = editingElement.position.y + V_CTRL_SIZE_MULTIPLIER;
				return true;
			}

			editingElement.position.y = editingElement.position.y + V_NO_POS_MULTIPLIER;
			break;
	}
}

// ----------------------------------------------------------------------------

function enterKey() {
	if (projectData == null) {
		return false;
	}

	if (editingElement == null) {
		return false;
	}

	if (editingElementState == V_EDIT_NONE) {
		return false;
	}

	sendUpdatedDataToServer(projectData);
	editingElementState = V_EDIT_NONE;
}

// ----------------------------------------------------------------------------

function traverseObject(object) {
	for (let i in object) {
		if (object[i] != undefined) {
			if (object[i] && typeof object[i] === 'object') {
				recurse(object[i], i);
			} else {
				applyObjectToMexUI(object[i]);
			}
		}
	}
}

// ----------------------------------------------------------------------------

function applyObjectToMexUI(object) {
	switch (object.type) {
		case "window":
			object.element = mexui.window(object.position, object.size, object.text);
			break;

		case "image":
			object.element = mexui.image(object.position, object.size);
			break;

		case "input":
			break;

		case "button":
			break;

		case "checkbox":
			break;

		case "dropdown":
			break;

		case "label":
			break;
	}
}

function getMexUIElementValue(element, values) {
	switch (elementName) {
		case "mainColour":
			return toColour(values[0], values[1], values[2], values[3]);

		case "textColour":
			return toColour(values[0], values[1], values[2], values[3]);

		case "position":
			return new Vec2(values[0], values[1]);

		case "size":
			return new Vec2(values[0], values[1]);

		default:
			return "";
	}
}