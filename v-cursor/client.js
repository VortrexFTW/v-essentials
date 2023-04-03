"use strict";

// ===========================================================================

let cursorImage = null;
let cursorImagePath = "cursor.png";
let cursorSize = new Vec2(16.0, 24.0);

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, (event, resource) => {
	let cursorStream = openFile(cursorImagePath);
	if (cursorStream != null) {
		cursorImage = graphics.loadPNG(cursorStream);
		cursorStream.close();
	}
});

// ===========================================================================

addEventHandler("OnDrawnHUD", (event) => {
	if (gui.cursorEnabled) {
		graphics.drawRectangle(cursorImage, gui.cursorPosition, cursorSize);
	}
});

// ===========================================================================