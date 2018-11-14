"use strict";

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource) {
	if(resource == thisResource) {
		let vehicles = [];
		
		let file = openFile("traffic.xml", false);
		if(!file) {
			return false;
		}
		let fileData = file.readBytes(file.length);
		file.close();
		
		let parser = new marknote.Parser;
		let xml = parser.parse(fileData);
		let root = xml.getRootElement();
		let items = root.getChildElements("vehicle");
		
		for(let i in items) {
			console.log(i);
			let position = new Vec3(parseFloat(items[i].getAttributeValue("x")), parseFloat(items[i].getAttributeValue("y")), parseFloat(items[i].getAttributeValue("z")));
			let heading = degToRad(parseFloat(items[i].getAttributeValue("angle")));
			let model = parseInt(items[i].getAttributeValue("model"))
			let vehicle = createVehicle(model, position);
			vehicle.heading = heading;
			addToWorld(vehicle);
			
			let driverSkin = parseInt(items[i].getAttributeValue("pedskin"));
			position.x += 3;
			let driver = createCivilian(0, position);
			driver.game = GAME_GTA_III;
			driver.position = position;
			addToWorld(driver);
			
			vehicle.setData("AI", true, true);
			driver.setData("AI.V", vehicle.id, true);
		}
	}
});

function degToRad(deg) {
	return deg * Math.PI / 180;
}