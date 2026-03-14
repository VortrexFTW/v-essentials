"use strict";

// ----------------------------------------------------------------------------

// DONT TOUCH THIS
let thisGame = (typeof server == "undefined") ? game.game : server.game;
let isServer = (typeof server == "undefined") ? false : true;

// ----------------------------------------------------------------------------

class VehicleType {
	constructor(model, name, data = {}) {
		this.model = model;
		this.name = name;
		this.canBeSpawned = (typeof data.canBeSpawned != "undefined") ? data.canBeSpawned : true;
		this.isMelee = (typeof data.isMelee != "undefined") ? data.isMelee : false;
		this.isThrown = (typeof data.isThrown != "undefined") ? data.isThrown : false;

		// GTA IV
		this.ivEpisode = (typeof data.ivEpisode != "undefined") ? data.ivEpisode : 0;
	}
}

// ----------------------------------------------------------------------------

class SkinType {
	constructor(model, name, data = {}) {
		this.model = model;
		this.name = name;

		// GTA IV
		this.ivEpisode = (typeof data.ivEpisode != "undefined") ? data.ivEpisode : 0;
	}
}

// ----------------------------------------------------------------------------

class WeaponType {
	constructor(id, name, data = {}) {
		this.id = id;
		this.name = name;
		this.hasAmmo = (typeof data.hasAmmo != "undefined") ? data.hasAmmo : true;
		this.clipAmmo = (typeof data.clipAmmo != "undefined") ? data.clipAmmo : 0;
		// Will probably add things like default ammo, max ammo, etc

		// GTA IV
		this.ivEpisode = (typeof data.ivEpisode != "undefined") ? data.ivEpisode : 0;
	}
}

// ----------------------------------------------------------------------------

let errorMessageColour = toColour(237, 67, 55, 255);
let syntaxMessageColour = toColour(200, 200, 200, 255);

// ----------------------------------------------------------------------------

let gameLocations = [
	[],

	[ // GTA III
		// Police Stations
		["Portland Police Station", [1143.875, -675.1875, 14.97], 0.0, [1127.95, -666.06, 14.413]],
		["Staunton Island Police Station", [340.25, -1123.375, 25.98], 0.0, null],
		["Shoreside Vale Police Station", [-1253.0, -138.1875, 58.75], 0.0, null],

		// Hospitals
		["Portland Hospital", [1144.25, -596.875, 14.97], 0.0, [1127.64, -586.84, 14.414]],
		["Staunton Island Hospital", [183.5, -17.75, 16.21], 0.0, null],
		["Shoreside Vale Hospital", [-1259.5, -44.5, 58.89], 0.0, null],

		// Fire Stations
		["Portland Fire Station", [1103.70, -52.45, 7.49], 0.0, null],
		["Staunton Island Fire Station", [-78.48, -436.80, 16.17], 0.0, null],
		["Shoreside Vale Fire Station", [-1202.10, -14.67, 53.20], 0.0, null],

		// Pay and Sprays
		["Portland Pay and Spray", [925.4, -360.3, 10.83], 0.0, [928.35, -335.53, 9.413]],
		["Staunton Island Pay and Spray", [381.8, -493.8, 25.95], 0.0, null],
		["Shoreside Vale Pay and Spray", [-1142.4, 35.01, 58.61], 0.0, null],

		// Ammunations
		["Portland Ammunation", [1068.3, -400.9, 15.24], 0.0, null],
		["Staunton Island Ammunation", [348.2, -717.9, 26.43], 0.0, null],

		// Train Stations
		["Bedford Point Train Station (Subway)", [178.52, -1551.40, 26.162], -3.105, [188.24, -1603.86, 25.700]],
		["Francis International Airport Train Station (Subway)", [-633.42, -760.06, 18.919], 1.586, [-693.17, -725.14, 8.313]],
		["Rockford Train Station (Subway)", [225.66, -69.07, 20.998], -3.115, [227.01, -59.56, 20.697]],
		["Saint Marks Train Station (Portland EL)", [1306.69, -512.38, 40.078], -2.458, [1312.85, -506.36, 40.641]],
		["Hepburn Heights Train Station (Portland EL)", [1029.07, -164.18, 4.972], 0.005, [1020.75, -166.69, 4.412]],
		["Chinatown Train Station (Portland EL)", [775.27, -622.28, 14.747], 0.006, [812.43, -630.49, 14.413]],

		// Safehouses
		["Portland Safehouse", [885.52, -308.47, 8.615], -1.532, [839.16, -298.12, 4.717]],

		// Other
		["St Mathias College", [201.59, -281.42, 15.779], -0.005, null],
		["Newport Parking Garage", [294.22, -547.87, 25.780], 3.119, null],
		["City Hall", [96.60, -951.61, 26.168], 3.138, null],
		["Belleville Park East", [109.15, -695.76, 26.168], 1.594, null],
		["Belleville Park Bathroom", [38.69, -724.96, 22.756], -3.104, null],
		["Belleville Park West", [0.40, -773.05, 26.056], -1.476, null],
		["Stadium Entrance", [-18.65, -231.80, 29.861], 0.002, null],
		["Kenji's Casino", [454.10, -1421.26, 26.124], -0.769, null],
		["Saint Marks Bistro", [1345.48, -457.41, 49.549], 1.537, null],
		["Leone Mansion", [1417.94, -194.18, 49.905], -1.570, [1378.31, -296.16, 49.414]],
		["Ciprianis Ristorante", [1202.50, -320.78, 24.973], -1.553, [1199.28, -321.10, 24.413]],
		["Luigi's Club", [904.82, -425.37, 14.929], 1.602, [907.36, -423.80, 14.413]],
		["Portland Fuel Station", [1157.34, -75.45, 7.065], -0.027, null],
		["Easy Credit Autos", [1217.81, -113.87, 14.973], -3.051, null],
		["Head Radio Headquarters", [986.40, -46.40, 7.473], -1.615, null],
		["Borgnine Taxi Headquarters", [929.36, -48.59, 7.473], -2.935, null],
		["Fuzz Ball", [1000.03, -877.82, 14.547], -3.136, null],
		["Portland Docks", [1360.55, -818.08, 14.415], -1.574, [1356.94, -816.28, 14.413]],
		["Punk Noodle Diner", [1040.10, -653.10, 14.973], 1.551, [1042.29, -656.87, 14.413]],
		["Greasy Joe's Diner", [864.45, -999.86, 4.646], -0.020, null],
		["Hepburn Heights Projects", [913.98, -227.83, 4.413], 0.001, null],
	],

	[ // GTA VC
		// Police Stations
		["Washington Beach Police Station", [399.77, -468.90, 11.73], 0.0, null],
		["Vice Point Police Station", [508.96, 512.07, 12.10], 0.0, null],
		["Downtown Police Station", [-657.43, 762.31, 11.59], 0.0, null],
		["Little Havana Police Station", [-885.08, -470.44, 13.11], 0.0, null],

		// Hospitals
		["Downtown Hospital", [-822.57, 1152.82, 12.41], 0.0, null],
		["Little Havana Medical Center", [-885.08, -470.44, 13.11], 0.0, null],
		["Ocean Beach Hospital", [-133.19, -980.76, 10.46], 0.0, null],

		// Misc/Other
		["Paper Products", [-1085.83, -232.72, 11.446], -3.139, null],
		["Little Haiti Slums", [-958.90, 116.41, 9.300], 0.031, null],
		["Kaufman Cabs", [-1013.35, 198.70, 11.266], -1.680, null],
		["Moist Palms Hotel", [-703.50, 545.30, 11.099], -3.105, null],
		["North Point Mall", [486.50, 1124.89, 16.348], 1.610, null],
		["Ocean View Hotel", [238.14, -1280.48, 11.071], 1.282, null],
		["Ocean Beach Fuel Station", [63.32, -1074.50, 10.006], 0.102, null],
		["Ken Rosenberg's Office", [115.48, -823.76, 10.463], -2.221, null]

		// Bar, Restaurants and Food
		["Little Havana Donut Shop", [-856.28, -649.32, 11.047], 1.700, null],
		["Robina's Cafe", [-1170.36, -604.25, 11.640], -2.973, null],
		["Biker Bar", [-601.72, 654.60, 11.073], -1.463, null],

		// Clubs
		["Malibu Club", [492.23, -81.41, 11.261], -2.306, null],
		["Poll Position Club", [100.09, -1477.78, 10.432], 0.484, null],

		// Tool Shops
		["Little Havana Tool Shop", [-969.01, -684.27, 11.456], -2.994, null],
		["Washington Beach Tool Shop", [197.83, -486.04, 11.127], 0.000, null]

		// Gunshops
		["Ocean Beach Ammunation", [-53.41, -1482.25, 10.293], 1.441, null],

		// Pay-n-sprays
		["Ocean Beach Pay-n-spray", [-18.51, -1256.76, 10.463], -1.556, null]

	],

	[ // GTA SA
		// Police Stations
		["Los Santos Police Department", [1545.53, -1675.64, 13.561], -1.575, null],
		["San Fierro Police Department", [-1605.16, 720.79, 11.90], 0.0, null],
		["Las Venturas Police Department", [2339.68, 2453.99, 14.97], 0.0, null],

		// Ammunations
		["Market Ammunation", [1364.84, -1283.79, 13.547], -0.541, null],

		// Hospitals
		["All Saints General Hospital", [1182.67, -1323.81, 13.579], 1.543, null],
		["County General Hospital", [2034.7567, -1403.1083, 17.2931], 0.0, null],

		// Strip Clubs
		["Pig Pen Strip Club", [2420.906982, -1222.321777, 25.348423], 0.0, null],

		// Night/Dance Clubs
		["Club Tableau", [551.877502, -1506.095581, 14.550004], 1.0, null],
		["Club Alhambra", [1832.55, -1681.91, 13.510], -1.561, null],

		// Bars
		["Ten Green Bottles Bar", [2305.922363, -1646.797241, 14.461124], 1.0, null],

		// Restaurants and Food
		["Market Donut Shop", [1040.932006, -1336.229492, 13.550251], 1.0, null],
		["Idlewood Pizza Stack", [2099.827636, -1806.375610, 13.554687], 0.0, null],
		["Temple Burger Shot", [1212.020019, -924.311462, 42.930198], 1.0, null],

		// Clothes Shops
		["Ganton Binco", [2244.837402, -1664.232299, 15.476562], 1.0, null],
		["Los Santos Victim ", [456.31, -1501.53, 31.041], -1.378, null],
		["Los Santos Didier Sachs", [449.68, -1479.94, 30.639], -1.149, null],
		["ProLaps Los Santos", [502.37, -1355.58, 16.133], 2.659, null],
		["Market Cluckin Bell", [923.53, -1352.72, 13.377], -1.596, null],
		["Marina Burger Shot", [816.55, -1617.00, 13.859], 1.396, null],

		// Airports
		["Los Santos International Airport Gate", [1958.201049, -2182.789794, 13.546875], 1.0, null],
		["Los Santos International Airport Runway", [2054.12, -2493.84, 13.547], 1.569, null],
		["Los Santos Stadium", [2694.261474, -1703.194335, 11.506717], 1.0, null],

		// Sex Shops
		["El Corona Sex Shop", [1944.994873, -2116.641113, 13.550632], 1.0, null],
		["Temple Sex Shop", [1090.181884, -927.265869, 43.182197], 1.0, null],
		["Market Sex Shop", [1090.181884, -927.265869, 43.182197], 1.0, null]

		// Misc/Other
		["Grotti Dealership", [540.6011, -1291.2489, 17.2422], 0.0, null],
		["Santa Maria Beach", [302.994567, -1900.099121, 1.938840], 0.0, null],
		["Glen Park Bridge", [1968.33, -1195.10, 25.70], 0.0, null],
		["Los Santos Skate Park", [1865.96, -1380.53, 13.50], 0.0, null],
		["Los Santos Garbage Dump", [2194.91, -1977.58, 13.55], 0.0, null],

		// Train Stations
		["Unity Station", [1742.60, -1859.98, 13.414], -3.112, null],
		["Market Station", [814.26, -1345.38, 13.532], -1.624, null],
	],

	[ // GTA UG
		// Coming Soon!
	],

	[ // GTA IV
		// Police Stations
		["Broker Police Station", [894.99, -357.39, 18.185], 2.923, null],
		["South Bohan Police Station", [435.40, 1592.29, 17.353], 3.087, null],
		["Northern Gardens Police Station", [974.93, 1870.45, 23.073], -1.621, null],
		["South Slopes Police Station", [1233.25, -89.13, 28.034], 1.568, null],
		["Middle Part East Police Station", [50.12, 679.88, 15.316], 1.569, null],
		["East Holland Police Station", [85.21, 1189.82, 14.755], 3.127, null],
		["Francis International Airport Police Station", [2170.87, 448.87, 6.085], 1.501, null],
		["Chinatown Police Station", [213.12, -211.70, 10.752], 0.200, null],
		["Acter Police Station", [-1714.95, 276.31, 22.134], 1.127, null],
		["Port Tudor Police Station", [-1220.73, -231.53, 3.024], 2.210, null],
		["Leftwood Police Station", [-927.66, 1263.63, 24.587], -0.913, null],

		// Fire Stations
		["Broker Fire Station", [953.13, 95.90, 35.004], 1.595, null],
		["Northwood Fire Station", [-271.02, 1542.15, 20.420], -1.160, null],
		["Northern Gardens Fire Station", [1120.47, 1712.36, 10.534], -0.682, null],
		["Francis International Airport Fire Station", [2364.87, 166.83, 5.813], 0.156, null],
		["Chinatown Fire Station", [295.40, -336.88, 4.963], 2.887, null],
		["Berchem Fire Station", [-1574.90, 546.54, 25.449], -0.509, null],
		["Tudor Fire Station", [-2144.97, 164.15, 12.051], -2.149, null],

		// Safehouses
		["Hove Beach Safehouse Parking", [904.27, -498.00, 14.522], 3.127, null],
		["South Bohan Safehouse", [589.42, 1402.15, 10.364], 0.007, null],

		// Hospitals
		["Schottler Medical Center", [1199.59, 196.78, 33.554], 1.633, null],
		["Northern Gardens Medical Center", [980.71, 1831.61, 23.898], -0.049, null],
		["Leftwood Hospital", [-1317.27, 1277.20, 22.370], 2.246, null],
		["Acter Medical Center", [-1538.43, 344.58, 20.943], -0.156, null],

		// Fuel Stations
		["Hove Beach Fuel Station", [1128.51, -359.55, 18.441], -0.052, null],
		["Lancaster Fuel Station", [108.37, 1135.13, 13.975], 0.007, null],
		["The Meat Quarter Fuel Station", [-434.30, -19.47, 9.864], 1.469, null],
		["Cerveza Heights Fuel Station", [1123.50, 328.84, 29.245], -0.154, null],
		["Tudor Fuel Station", [-1389.91, 29.19, 6.875], 0.982, null],

		// Restaurants
		["Star Junction Burger Shot", [-174.00, 276.96, 14.818], -0.029, null],
		["South Bohan Burger Shot", [441.95, 1516.64, 16.289], -2.682, null],
		["Industrial Burger Shot", [1096.93, 1598.33, 16.721], -2.289, null],

		// Night Clubs/Strip Clubs/Bars
		["Perestroika Club", [957.58, -292.58, 19.644], -0.009, null],
		["Triangle Club", [1210.90, 1718.18, 16.667], 1.819, null],
		["Bahama Mamas Club", [-387.33, 412.33, 5.674], 2.997, null],
		["Maisonette Club", [-482.28, 155.56, 7.555], -1.559, null],

		// TW@ Cafes
		["Outlook Internet Cafe", [977.42, -169.11, 24.013], 1.844, null],
		["Berchem Internet Cafe", [-1584.46, 466.05, 25.398], -2.441, null],

		// Pay-n-Sprays
		["Hove Beach Pay-n-Spray", [1058.57, -282.58, 20.760], -3.135, null],
		["Leftwood Pay-n-Spray", [-1148.69, 1171.52, 16.457], -0.059, null],

		// Clothes Shops
		["Hove Beach Russian Clothes Shop", [896.31, -442.59, 15.888], 1.500, null],

		// Car Wash
		["Willis Car Wash", [1831.02, 360.20, 22.061], -1.515, null],
		["Tudor Car Wash", [-1371.68, 35.13, 7.028], 1.029, null],

		// Gun Shops
		["Downtown Broker Gun Shop", [1054.11, 86.84, 33.408], -1.574, null],
		["Chinatown Gun Shop", [65.43, -342.36, 14.767], -1.589, null],
		["Port Tudor Gun Shop", [-1338.77, 307.61, 13.378], -1.530, null],

		// Train Stations
		["Hove Beach Train Station", [1000.41, -544.82, 14.854], -1.576, null],
		["Schottler Train Station", [1303.93, -37.75, 28.377], 3.065, null],
		["Cerveza Heights Train Station", [1386.87, 374.13, 23.063], 3.111, null],
		["Lynch Street Train Station", [1594.73, 364.80, 25.226], -0.965, null],
		["East Park Train Station", [-35.78, 634.79, 14.663], -0.050, null],
		["West Park Train Station", [-377.13, 677.05, 14.679], -0.069, null],
		["North Park Train Station", [-135.08, 1153.95, 14.773], -1.567, null],
		["Vespucci Circus Train Station", [-85.11, 1427.04, 20.421], 1.501, null],
		["Frankfort Low Train Station", [-331.94, 1427.05, 12.617], 1.541, null],
		["Frankfort High Train Station", [-343.79, 1433.12, 12.283], 0.113, null],
		["Vauxite Train Station", [-483.38, 1333.91, 17.481], 1.509, null],
		["Quartz Street West Train Station", [-545.54, 926.22, 9.945], -1.524, null],
		["Manganese West Train Station", [-461.60, 530.56, 9.857], 3.091, null],
		["Frankfort Ave Train Station", [-377.52, 371.91, 14.762], -3.125, null],
		["Suffolk Train Station", [-252.77, -171.83, 14.447], 1.594, null],
		["Feldspar Train Station", [-350.62, -335.35, 4.909], -2.287, null],
		["City Hall Train Station", [-115.31, -501.22, 14.755], -1.365, null],
		["Castle Gardens Train Station", [82.95, -757.81, 4.965], -1.006, null],
		["Emerald Train Station", [116.57, -318.15, 14.768], 1.499, null],
		["Easton Train Station", [-35.76, -18.50, 14.769], 3.137, null],
		["Manganese East Train Station", [131.46, 522.74, 14.661], 0.005, null],
		["Quartz Street East Train Station", [134.35, 910.15, 14.717], -0.112, null],
		["San Quentin Ave Train Station", [373.12, 1625.93, 16.347], -2.249, null],
		["Windmill Street Train Station", [749.97, 1447.44, 14.252], -0.120, null],
		["Francis International Airport Train Station", [2297.57, 474.62, 6.086], 0.066, null],

		// Misc
		["Hove Beach Laundromat", [1011.74, -325.33, 20.339], -1.402, null],
		["The Exchange Docks", [-354.68, -661.62, 4.791], 2.066, null],
		["Firefly Island Bowling", [1198.99, -681.49, 16.445], -0.017, null],
		["Broker Bus Depot", [1004.15, 279.19, 31.512], -2.193, null],
		["The Lost MC Clubhouse", [-1713.29, 358.25, 25.449], 2.566, null],
		["Alderney State Correctional Facility (Prison)", [-1155.21, -374.34, 2.885], -1.680, null],
		["Chinatown Bank of Liberty", [-34.92, -466.80, 14.75], -1.52, null],
		["Suffolk Church", [-274.30, -281.63, 14.36], 1.56],
		["Francis International Airport Runway", [2610.75, 262.42, 5.875], 2.381, null],
		["Happiness Island", [-621.81, -963.22, 4.843], -0.109, null],

		// More will be added soon!
	],
];

// ----------------------------------------------------------------------------

let gameAnnounceColours = {
	[GAME_GTA_III]: COLOUR_BLUE,
	[GAME_GTA_VC]: COLOUR_AQUA,
	[GAME_GTA_SA]: COLOUR_ORANGE,
	[GAME_GTA_IV]: COLOUR_SILVER,
	[10]: COLOUR_YELLOW
}

// ----------------------------------------------------------------------------

let gameGarages = [
	false,
	[ // GTA III
		// Name									Location Name							Position						Opened
		["Car Crusher Garage", "Harwood, Portland", [], true],
		["Safe House", "Red Light District, Portland", [], true],
		["Import/Export Garage", "Portland Harbor, Portland", [], true],
		["8 Balls Bomb Shop", "Harwood, Portland", [], true],
		["Pay-n-Spray", "Red Light District, Portland", [], true],
		["Salvatore's Garage", "Saint Mark's, Portland", [], true],
		["Securicar Garage", "Portland Harbor, Portland", [], true],
		["Luigi's Lockup", "Portland View, Portland", [], true],
		["Safe House", "Belleville Park, Staunton Island", [], true],
		["8 Balls Bomb Shop", "Newport, Staunton Island", [], true],
		["Pay-n-Spray", "Newport, Staunton Island", [], true],
		["Ray's Lockup", "Bedford Point, Staunton Island", [], true],
		["Witness Protection Safe House", "Newport, Staunton Island", [], true],
		["Kenji's Lockup", "Newport, Staunton Island", [], true],
		["Columbian Garage 1", "Aspatria, Staunton Island", [], true],
		["Columbian Garage 2", "Aspatria, Staunton Island", [], true],
		["Columbian Garage 3", "Aspatria, Staunton Island", [], true],
		["Columbian Garage 4", "Aspatria, Staunton Island", [], true],
		["Columbian Garage 5", "Aspatria, Staunton Island", [], true],
		["Yardie's Lockup", "Newport, Staunton Island", [], true],
		["Safe House", "Wichita Gardens, Shoreside Vale", [], true],
		["Pay-n-Spray", "Pike Creek, Shoreside Vale", [], true],
		["8 Balls Bomb Shop", "Pike Creek, Shoreside Vale", [], true],
		["Import/Export Garage", "Pike Creek, Shoreside Vale", [], true],
		["Hoodz's Bomb Defusal Garage", "Saint Mark's, Portland", [], true],
		["Platinum Dropoff Garage", "Pike Creek, Shoreside Vale", [], true],
		["Donald Love's Stash Garage", "Pike Creek, Shoreside Vale", [], true],
	],

	[ // GTA Vice City
		["Vice Port Pay-n-spray", "Vice Port", [], false],
		["Sunshine Autos", "Little Havana", [], false],
		["Little Haiti Pay-n-spray", "Little Haiti", [], false],
		["Vice Point Pay-n-spray", "Vice Point", [], false],
		["Ocean Beach Pay-n-spray", "Ocean Beach", [], false],
		["Sir yes sir mission", "Little Havana", [], false],
		["Sir yes sir mission", "Vice Port", [], false],
		["Sunshine Autos", "Little Haiti", [], false],
		["Copland mission", "Vice Point", [], false],
		["Bomb Shop", "Vice Port", [], false],
		["Links View Apartment", "Vice Point", [], false],
		["Hyman Condo 1", "Downtown", [], false],
		["Hyman Condo 2", "Downtown", [], false],
		["Ocean Heights Apartment", "Ocean Beach", [], false],
		["El Swanko Casa", "Unknown", [], false],
		["Sunshine Autos 1", "Unknown", [], false],
		["Sunshine Autos 2", "Unknown", [], false],
		["Sunshine Autos 3", "Unknown", [], false],
		["Sunshine Autos 4", "Unknown", [], false],
		["Vercetti Estate", "Starfish Island", [], false],
	],

	[ // GTA San Andreas
		// Name									Location Name							Position						Opened
		["Life's a Beach Mission Garage", "Commerce, Los Santos", [1643.43, -1521.95, 13.56], true],
		["Los Desperados Mission Garage", "El Corona, Los Santos", [1877.30, -2097.85, 13.53], true],
		["Eight Ball Autos", "El Corona, Los Santos", [1842.32, -1856.37, 13.38], true],
		["Cesar Vialpando Mission Garage", "El Corona, Los Santos", [1797.62, -2146.73, 13.55], true],
		["Player Garage", "El Corona, Los Santos", [1699.06, -2089.99, 13.55], true],
		["LS Burglary Garage", "Playa del Seville, Los Santos", [2741.21, -2003.46, 13.55], true],
		["LowRider Tuning Garage", "Willowfield, Los Santos", [2644.90, -2038.41, 13.55], true],
		["Pay 'n' Spray", "Idlewood, Los Santos", [2072.40, -1831.38, 13.55], true],
		["Player Garage", "Ganton, Los Santos", [2505.68, -1689.95, 13.56], true],
		["Transfender", "Temple, Los Santos", [1041.42, -1026.78, 32.10], true],
		["Pay 'n' Spray", "Temple, Los Santos", [1025.09, -1030.52, 32.04], true],
		["Pay 'n' Spray", "Santa Maria Beach, Los Santos", [488.41, -1733.88, 11.18], true],
		["Player Garage", "Santa Maria Beach, Los Santos", [322.60, -1769.86, 4.72], true],
		["Player Garage", "Mulholland, Los Santos", [1353.23, -625.68, 109.13], true],
		["Wheel Archangels", "Ocean Flats, San Fierro", [-2715.30, 217.61, 4.32], true],
		["T-Bone Mendez Mission Garage", "Ocean Flats, San Fierro", [-2730.48, 74.22, 4.34], true],
		["Player Garage", "Hashbury, San Fierro", [-2455.66, -123.73, 26.09], true],
		["Transfender", "Doherty, San Fierro", [-1935.88, 237.90, 34.31], true],
		["Pay 'n' Spray", "Downtown, San Fierro", [-1904.53, 276.63, 41.05], true],
		["SF Burglary Garage", "Doherty, San Fierro", [-2101.90, -16.07, 35.32], true],
		["Player Garage", "Doherty, San Fierro", [-2026.94, 130.57, 28.84], true],
		["Mission Garage", "Doherty, San Fierro", [-2038.18, 178.87, 28.84], true],
		["Michelle's Pay 'n' Spray", "Downtown, San Fierro", [-1786.78, 1208.87, 25.13], true],
		["Player Garage", "Calton Height, San Fierro", [-2105.22, 897.84, 76.71], true],
		["Pay 'n' Spray", "Juniper Hollow, San Fierro", [-2425.70, 1029.37, 50.39], true],
		["Player Garage", "Paradiso, San Fierro", [-2695.94, 820.34, 49.98], true],
		["Airport Hangar", "Las Venturas Airport, San Fierro", [1585.90, 1226.73, 10.81], true],
		["LV Burglary Garage", "Pilgrim, Las Venturas", [2609.68, 1436.90, 10.82], true],
		["Transfender", "Come-A-Lot, Las Venturas", [2386.75, 1042.44, 10.82], true],
		["Player Garage", "Rockshore West, Las Venturas", [2448.44, 697.76, 11.46], true],
		["Welding Wedding Bomb-workshop", "Redsands East, Las Venturas", [2006.11, 2302.69, 10.82], true],
		["Pay 'n' Spray", "Redsands East, Las Venturas", [1967.55, 2162.43, 10.82], true],
		["Player Garage", "Redsands West, Las Venturas", [1407.23, 1902.37, 11.46], true],
		["Player Garage", "Prickle Pine, Las Venturas", [1280.85, 2529.82, 10.82], true],
		["Player Garage", "Whitewood Estates, Las Venturas", [928.43, 2011.86, 11.46], true],
		["Pay 'n' Spray", "El Quebrados, Tierra Robada", [-1420.43, 2591.78, 55.82], true],
		["Pay 'n' Spray", "Fort Carson, Bone County", [-100.00, 1110.53, 19.74], true],
		["Player Garage", "Fort Carson, Bone County", [-360.72, 1193.05, 19.74], true],
		["Player Garage", "Verdant Meadows, Bone County", [428.90, 2546.57, 16.21], true],
		["Interdiction Mission Garage", "El Castillo del Diablo, Bone County", [-388.78, 2228.05, 42.43], true],
		["Airport Hangar", "Verdant Meadows, Bone County", [404.97, 2478.38, 16.48], true],
		["Puncture Wounds Mission Garage", "Angel Pine, Flint County", [-2113.93, -2459.94, 30.63], true],
		["Pay 'n' Spray", "Dillimore, Red County", [719.96, -464.34, 16.34], true],
		["Player Garage", "Palomino Creek, Red County", [2231.22, 167.27, 27.48], true],
		["Player Garage", "Dillimore, Red County", [785.95, -494.23, 17.34], true],
	],

	[ // GTA Underground
		["Life's a Beach Mission Garage", "Commerce, Los Santos", [1643.43, -1521.95, 13.56], true],
		["Los Desperados Mission Garage", "El Corona, Los Santos", [1877.30, -2097.85, 13.53], true],
		["Eight Ball Autos", "El Corona, Los Santos", [1842.32, -1856.37, 13.38], true],
		["Cesar Vialpando Mission Garage", "El Corona, Los Santos", [1797.62, -2146.73, 13.55], true],
		["Player Garage", "El Corona, Los Santos", [1699.06, -2089.99, 13.55], true],
		["LS Burglary Garage", "Playa del Seville, Los Santos", [2741.21, -2003.46, 13.55], true],
		["LowRider Tuning Garage", "Willowfield, Los Santos", [2644.90, -2038.41, 13.55], true],
		["Pay 'n' Spray", "Idlewood, Los Santos", [2072.40, -1831.38, 13.55], true],
		["Player Garage", "Ganton, Los Santos", [2505.68, -1689.95, 13.56], true],
		["Transfender", "Temple, Los Santos", [1041.42, -1026.78, 32.10], true],
		["Pay 'n' Spray", "Temple, Los Santos", [1025.09, -1030.52, 32.04], true],
		["Pay 'n' Spray", "Santa Maria Beach, Los Santos", [488.41, -1733.88, 11.18], true],
		["Player Garage", "Santa Maria Beach, Los Santos", [322.60, -1769.86, 4.72], true],
		["Player Garage", "Mulholland, Los Santos", [1353.23, -625.68, 109.13], true],
		["Wheel Archangels", "Ocean Flats, San Fierro", [-2715.30, 217.61, 4.32], true],
		["T-Bone Mendez Mission Garage", "Ocean Flats, San Fierro", [-2730.48, 74.22, 4.34], true],
		["Player Garage", "Hashbury, San Fierro", [-2455.66, -123.73, 26.09], true],
		["Transfender", "Doherty, San Fierro", [-1935.88, 237.90, 34.31], true],
		["Pay 'n' Spray", "Downtown, San Fierro", [-1904.53, 276.63, 41.05], true],
		["SF Burglary Garage", "Doherty, San Fierro", [-2101.90, -16.07, 35.32], true],
		["Player Garage", "Doherty, San Fierro", [-2026.94, 130.57, 28.84], true],
		["Mission Garage", "Doherty, San Fierro", [-2038.18, 178.87, 28.84], true],
		["Michelle's Pay 'n' Spray", "Downtown, San Fierro", [-1786.78, 1208.87, 25.13], true],
		["Player Garage", "Calton Height, San Fierro", [-2105.22, 897.84, 76.71], true],
		["Pay 'n' Spray", "Juniper Hollow, San Fierro", [-2425.70, 1029.37, 50.39], true],
		["Player Garage", "Paradiso, San Fierro", [-2695.94, 820.34, 49.98], true],
		["Airport Hangar", "Las Venturas Airport, San Fierro", [1585.90, 1226.73, 10.81], true],
		["LV Burglary Garage", "Pilgrim, Las Venturas", [2609.68, 1436.90, 10.82], true],
		["Transfender", "Come-A-Lot, Las Venturas", [2386.75, 1042.44, 10.82], true],
		["Player Garage", "Rockshore West, Las Venturas", [2448.44, 697.76, 11.46], true],
		["Welding Wedding Bomb-workshop", "Redsands East, Las Venturas", [2006.11, 2302.69, 10.82], true],
		["Pay 'n' Spray", "Redsands East, Las Venturas", [1967.55, 2162.43, 10.82], true],
		["Player Garage", "Redsands West, Las Venturas", [1407.23, 1902.37, 11.46], true],
		["Player Garage", "Prickle Pine, Las Venturas", [1280.85, 2529.82, 10.82], true],
		["Player Garage", "Whitewood Estates, Las Venturas", [928.43, 2011.86, 11.46], true],
		["Pay 'n' Spray", "El Quebrados, Tierra Robada", [-1420.43, 2591.78, 55.82], true],
		["Pay 'n' Spray", "Fort Carson, Bone County", [-100.00, 1110.53, 19.74], true],
		["Player Garage", "Fort Carson, Bone County", [-360.72, 1193.05, 19.74], true],
		["Player Garage", "Verdant Meadows, Bone County", [428.90, 2546.57, 16.21], true],
		["Interdiction Mission Garage", "El Castillo del Diablo, Bone County", [-388.78, 2228.05, 42.43], true],
		["Airport Hangar", "Verdant Meadows, Bone County", [404.97, 2478.38, 16.48], true],
		["Puncture Wounds Mission Garage", "Angel Pine, Flint County", [-2113.93, -2459.94, 30.63], true],
		["Pay 'n' Spray", "Dillimore, Red County", [719.96, -464.34, 16.34], true],
		["Player Garage", "Palomino Creek, Red County", [2231.22, 167.27, 27.48], true],
		["Player Garage", "Dillimore, Red County", [785.95, -494.23, 17.34], true],
	],

	[ // GTA IV

	],

	[ // GTA IV (EFLC)

	]
];

// ----------------------------------------------------------------------------

// - These need fixed!
let weatherNames = [
	["Unknown"],
	[ // GTA III
		"Clear",
		"Overcast",
		"Thunderstorm",
		"Fog",
		"Clear",
		"Rainy",
		"Dark/Cloudy",
		"Light/Cloudy",
		"Overcast/Cloudy",
		"Grey/Cloudy"
	],

	[ // GTA Vice City
		"Clear",
		"Overcast",
		"Thunderstorm",
		"Fog",
		"Clear",
		"Rainy",
		"Dark/Cloudy",
		"Light/Cloudy",
		"Overcast/Cloudy",
		"Grey/Cloudy"
	],

	[ // GTA San Andreas
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Thunderstorm",
		"Cloudy/Foggy",
		"Clear Blue Skies",
		"Heatwave",
		"Dull/Colorless",
		"Dull/Colorless",
		"Dull/Colorless",
		"Dull/Colorless",
		"Dull/Rainy",
		"Heatwave",
		"Heatwave",
		"Sandstorm",
		"Greenish/Foggy"
	],

	[ // GTA Underground
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Blue Skies",
		"Thunderstorm",
		"Cloudy/Foggy",
		"Clear Blue Skies",
		"Heatwave",
		"Dull/Colorless",
		"Dull/Colorless",
		"Dull/Colorless",
		"Dull/Colorless",
		"Dull/Rainy",
		"Heatwave",
		"Heatwave",
		"Sandstorm",
		"Greenish/Foggy"
	],

	[ // GTA IV
		"Extra Sunny",
		"Sunny",
		"Sunny/Windy",
		"Cloudy",
		"Rain",
		"Light Rain",
		"Foggy",
		"Thunderstorm",
		"Extra Sunny",
		"Sunny/Windy",
	],

	[ // GTA IV (EFLC)
		"Extra Sunny",
		"Sunny",
		"Sunny/Windy",
		"Cloudy",
		"Rain",
		"Light Rain",
		"Foggy",
		"Thunderstorm",
		"Extra Sunny",
		"Sunny/Windy",
	]
];

// ----------------------------------------------------------------------------

let emojiReplaceString = [
	[":hash:", "#"],
	[":zero:", "0"],
	[":one:", "1"],
	[":two:", "2"],
	[":three:", "3"],
	[":four:", "4"],
	[":five:", "5"],
	[":six:", "6"],
	[":seven:", "7"],
	[":eight:", "8"],
	[":nine:", "9"],
	[":copyright:", "©"],
	[":registered:", "®"],
	[":bangbang:", "‼"],
	[":interrobang:", "⁉"],
	[":tm:", "™"],
	[":information_source:", "ℹ"],
	[":left_right_arrow:", "↔"],
	[":arrow_up_down:", "↕"],
	[":arrow_upper_left:", "↖"],
	[":arrow_upper_right:", "↗"],
	[":arrow_lower_right:", "↘"],
	[":arrow_lower_left:", "↙"],
	[":leftwards_arrow_with_hook:", "↩"],
	[":arrow_right_hook:", "↪"],
	[":watch:", "⌚"],
	[":hourglass:", "⌛"],
	[":fast_forward:", "⏩"],
	[":rewind:", "⏪"],
	[":arrow_double_up:", "⏫"],
	[":arrow_double_down:", "⏬"],
	[":alarm_clock:", "⏰"],
	[":hourglass_flowing_sand:", "⏳"],
	[":m:", "ⓜ"],
	[":black_small_square:", "▪"],
	[":white_small_square:", "▫"],
	[":arrow_forward:", "▶"],
	[":arrow_backward:", "◀"],
	[":white_medium_square:", "◻"],
	[":black_medium_square:", "◼"],
	[":white_medium_small_square:", "◽"],
	[":black_medium_small_square:", "◾"],
	[":sunny:", "☀"],
	[":cloud:", "☁"],
	[":telephone:", "☎"],
	[":ballot_box_with_check:", "☑"],
	[":umbrella:", "☔"],
	[":coffee:", "☕"],
	[":point_up:", "☝"],
	[":relaxed:", "☺"],
	[":aries:", "♈"],
	[":taurus:", "♉"],
	[":gemini:", "♊"],
	[":cancer:", "♋"],
	[":leo:", "♌"],
	[":virgo:", "♍"],
	[":libra:", "♎"],
	[":scorpius:", "♏"],
	[":sagittarius:", "♐"],
	[":capricorn:", "♑"],
	[":aquarius:", "♒"],
	[":pisces:", "♓"],
	[":spades:", "♠"],
	[":clubs:", "♣"],
	[":hearts:", "♥"],
	[":diamonds:", "♦"],
	[":hotsprings:", "♨"],
	[":recycle:", "♻"],
	[":wheelchair:", "♿"],
	[":anchor:", "⚓"],
	[":warning:", "⚠"],
	[":zap:", "⚡"],
	[":white_circle:", "⚪"],
	[":black_circle:", "⚫"],
	[":soccer:", "⚽"],
	[":baseball:", "⚾"],
	[":snowman:", "⛄"],
	[":partly_sunny:", "⛅"],
	[":ophiuchus:", "⛎"],
	[":no_entry:", "⛔"],
	[":church:", "⛪"],
	[":fountain:", "⛲"],
	[":golf:", "⛳"],
	[":sailboat:", "⛵"],
	[":tent:", "⛺"],
	[":fuelpump:", "⛽"],
	[":scissors:", "✂"],
	[":white_check_mark:", "✅"],
	[":airplane:", "✈"],
	[":envelope:", "✉"],
	[":fist:", "✊"],
	[":raised_hand:", "✋"],
	[":v:", "✌"],
	[":pencil2:", "✏"],
	[":black_nib:", "✒"],
	[":heavy_check_mark:", "✔"],
	[":heavy_multiplication_x:", "✖"],
	[":sparkles:", "✨"],
	[":eight_spoked_asterisk:", "✳"],
	[":eight_pointed_black_star:", "✴"],
	[":snowflake:", "❄"],
	[":sparkle:", "❇"],
	[":x:", "❌"],
	[":negative_squared_cross_mark:", "❎"],
	[":question:", "❓"],
	[":grey_question:", "❔"],
	[":grey_exclamation:", "❕"],
	[":exclamation:", "❗"],
	[":heart:", "❤"],
	[":heavy_plus_sign:", "➕"],
	[":heavy_minus_sign:", "➖"],
	[":heavy_division_sign:", "➗"],
	[":arrow_right:", "➡"],
	[":curly_loop:", "➰"],
	[":arrow_heading_up:", "⤴"],
	[":arrow_heading_down:", "⤵"],
	[":arrow_left:", "⬅"],
	[":arrow_up:", "⬆"],
	[":arrow_down:", "⬇"],
	[":black_large_square:", "⬛"],
	[":white_large_square:", "⬜"],
	[":star:", "⭐"],
	[":o:", "⭕"],
	[":wavy_dash:", "〰"],
	[":part_alternation_mark:", "〽"],
	[":congratulations:", "㊗"],
	[":secret:", "㊙"],
	[":mahjong:", "🀄"],
	[":black_joker:", "🃏"],
	[":a:", "🅰"],
	[":b:", "🅱"],
	[":o2:", "🅾"],
	[":parking:", "🅿"],
	[":ab:", "🆎"],
	[":cl:", "🆑"],
	[":cool:", "🆒"],
	[":free:", "🆓"],
	[":id:", "🆔"],
	[":new:", "🆕"],
	[":ng:", "🆖"],
	[":ok:", "🆗"],
	[":sos:", "🆘"],
	[":up:", "🆙"],
	[":vs:", "🆚"],
	[":cn:", "🇨 🇳"],
	[":de:", "🇩 🇪"],
	[":es:", "🇪 🇸"],
	[":fr:", "🇫 🇷"],
	[":uk:", "🇬 🇧"],
	[":it:", "🇮 🇹"],
	[":jp:", "🇯 🇵"],
	[":kr:", "🇰 🇷"],
	[":ru:", "🇷 🇺"],
	[":us:", "🇺 🇸"],
	[":koko:", "🈁"],
	[":sa:", "🈂"],
	[":u7121:", "🈚"],
	[":u6307:", "🈯"],
	[":u7981:", "🈲"],
	[":u7a7a:", "🈳"],
	[":u5408:", "🈴"],
	[":u6e80:", "🈵"],
	[":u6709:", "🈶"],
	[":u6708:", "🈷"],
	[":u7533:", "🈸"],
	[":u5272:", "🈹"],
	[":u55b6:", "🈺"],
	[":ideograph_advantage:", "🉐"],
	[":accept:", "🉑"],
	[":cyclone:", "🌀"],
	[":foggy:", "🌁"],
	[":closed_umbrella:", "🌂"],
	[":night_with_stars:", "🌃"],
	[":sunrise_over_mountains:", "🌄"],
	[":sunrise:", "🌅"],
	[":city_sunset:", "🌆"],
	[":city_sunrise:", "🌇"],
	[":rainbow:", "🌈"],
	[":bridge_at_night:", "🌉"],
	[":ocean:", "🌊"],
	[":volcano:", "🌋"],
	[":milky_way:", "🌌"],
	[":earth_asia:", "🌏"],
	[":new_moon:", "🌑"],
	[":first_quarter_moon:", "🌓"],
	[":waxing_gibbous_moon:", "🌔"],
	[":full_moon:", "🌕"],
	[":crescent_moon:", "🌙"],
	[":first_quarter_moon_with_face:", "🌛"],
	[":star2:", "🌟"],
	[":stars:", "🌠"],
	[":chestnut:", "🌰"],
	[":seedling:", "🌱"],
	[":palm_tree:", "🌴"],
	[":cactus:", "🌵"],
	[":tulip:", "🌷"],
	[":cherry_blossom:", "🌸"],
	[":rose:", "🌹"],
	[":hibiscus:", "🌺"],
	[":sunflower:", "🌻"],
	[":blossom:", "🌼"],
	[":corn:", "🌽"],
	[":ear_of_rice:", "🌾"],
	[":herb:", "🌿"],
	[":four_leaf_clover:", "🍀"],
	[":maple_leaf:", "🍁"],
	[":fallen_leaf:", "🍂"],
	[":leaves:", "🍃"],
	[":mushroom:", "🍄"],
	[":tomato:", "🍅"],
	[":eggplant:", "🍆"],
	[":grapes:", "🍇"],
	[":melon:", "🍈"],
	[":watermelon:", "🍉"],
	[":tangerine:", "🍊"],
	[":banana:", "🍌"],
	[":pineapple:", "🍍"],
	[":apple:", "🍎"],
	[":green_apple:", "🍏"],
	[":peach:", "🍑"],
	[":cherries:", "🍒"],
	[":strawberry:", "🍓"],
	[":hamburger:", "🍔"],
	[":pizza:", "🍕"],
	[":meat_on_bone:", "🍖"],
	[":poultry_leg:", "🍗"],
	[":rice_cracker:", "🍘"],
	[":rice_ball:", "🍙"],
	[":rice:", "🍚"],
	[":curry:", "🍛"],
	[":ramen:", "🍜"],
	[":spaghetti:", "🍝"],
	[":bread:", "🍞"],
	[":fries:", "🍟"],
	[":sweet_potato:", "🍠"],
	[":dango:", "🍡"],
	[":oden:", "🍢"],
	[":sushi:", "🍣"],
	[":fried_shrimp:", "🍤"],
	[":fish_cake:", "🍥"],
	[":icecream:", "🍦"],
	[":shaved_ice:", "🍧"],
	[":ice_cream:", "🍨"],
	[":doughnut:", "🍩"],
	[":cookie:", "🍪"],
	[":chocolate_bar:", "🍫"],
	[":candy:", "🍬"],
	[":lollipop:", "🍭"],
	[":custard:", "🍮"],
	[":honey_pot:", "🍯"],
	[":cake:", "🍰"],
	[":bento:", "🍱"],
	[":stew:", "🍲"],
	[":egg:", "🍳"],
	[":fork_and_knife:", "🍴"],
	[":tea:", "🍵"],
	[":sake:", "🍶"],
	[":wine_glass:", "🍷"],
	[":cocktail:", "🍸"],
	[":tropical_drink:", "🍹"],
	[":beer:", "🍺"],
	[":beers:", "🍻"],
	[":ribbon:", "🎀"],
	[":gift:", "🎁"],
	[":birthday:", "🎂"],
	[":jack_o_lantern:", "🎃"],
	[":christmas_tree:", "🎄"],
	[":santa:", "🎅"],
	[":fireworks:", "🎆"],
	[":sparkler:", "🎇"],
	[":balloon:", "🎈"],
	[":tada:", "🎉"],
	[":confetti_ball:", "🎊"],
	[":tanabata_tree:", "🎋"],
	[":crossed_flags:", "🎌"],
	[":bamboo:", "🎍"],
	[":dolls:", "🎎"],
	[":flags:", "🎏"],
	[":wind_chime:", "🎐"],
	[":rice_scene:", "🎑"],
	[":school_satchel:", "🎒"],
	[":mortar_board:", "🎓"],
	[":carousel_horse:", "🎠"],
	[":ferris_wheel:", "🎡"],
	[":roller_coaster:", "🎢"],
	[":fishing_pole_and_fish:", "🎣"],
	[":microphone:", "🎤"],
	[":movie_camera:", "🎥"],
	[":cinema:", "🎦"],
	[":headphones:", "🎧"],
	[":art:", "🎨"],
	[":tophat:", "🎩"],
	[":circus_tent:", "🎪"],
	[":ticket:", "🎫"],
	[":clapper:", "🎬"],
	[":performing_arts:", "🎭"],
	[":video_game:", "🎮"],
	[":dart:", "🎯"],
	[":slot_machine:", "🎰"],
	[":_8ball:", "🎱"],
	[":game_die:", "🎲"],
	[":bowling:", "🎳"],
	[":flower_playing_cards:", "🎴"],
	[":musical_note:", "🎵"],
	[":notes:", "🎶"],
	[":saxophone:", "🎷"],
	[":guitar:", "🎸"],
	[":musical_keyboard:", "🎹"],
	[":trumpet:", "🎺"],
	[":violin:", "🎻"],
	[":musical_score:", "🎼"],
	[":running_shirt_with_sash:", "🎽"],
	[":tennis:", "🎾"],
	[":ski:", "🎿"],
	[":basketball:", "🏀"],
	[":checkered_flag:", "🏁"],
	[":snowboarder:", "🏂"],
	[":runner:", "🏃"],
	[":surfer:", "🏄"],
	[":trophy:", "🏆"],
	[":football:", "🏈"],
	[":swimmer:", "🏊"],
	[":house:", "🏠"],
	[":house_with_garden:", "🏡"],
	[":office:", "🏢"],
	[":post_office:", "🏣"],
	[":hospital:", "🏥"],
	[":bank:", "🏦"],
	[":atm:", "🏧"],
	[":hotel:", "🏨"],
	[":love_hotel:", "🏩"],
	[":convenience_store:", "🏪"],
	[":school:", "🏫"],
	[":department_store:", "🏬"],
	[":factory:", "🏭"],
	[":izakaya_lantern:", "🏮"],
	[":japanese_castle:", "🏯"],
	[":european_castle:", "🏰"],
	[":snail:", "🐌"],
	[":snake:", "🐍"],
	[":racehorse:", "🐎"],
	[":sheep:", "🐑"],
	[":monkey:", "🐒"],
	[":chicken:", "🐔"],
	[":boar:", "🐗"],
	[":elephant:", "🐘"],
	[":octopus:", "🐙"],
	[":shell:", "🐚"],
	[":bug:", "🐛"],
	[":ant:", "🐜"],
	[":bee:", "🐝"],
	[":beetle:", "🐞"],
	[":fish:", "🐟"],
	[":tropical_fish:", "🐠"],
	[":blowfish:", "🐡"],
	[":turtle:", "🐢"],
	[":hatching_chick:", "🐣"],
	[":baby_chick:", "🐤"],
	[":hatched_chick:", "🐥"],
	[":bird:", "🐦"],
	[":penguin:", "🐧"],
	[":koala:", "🐨"],
	[":poodle:", "🐩"],
	[":camel:", "🐫"],
	[":dolphin:", "🐬"],
	[":mouse:", "🐭"],
	[":cow:", "🐮"],
	[":tiger:", "🐯"],
	[":rabbit:", "🐰"],
	[":cat:", "🐱"],
	[":dragon_face:", "🐲"],
	[":whale:", "🐳"],
	[":horse:", "🐴"],
	[":monkey_face:", "🐵"],
	[":dog:", "🐶"],
	[":pig:", "🐷"],
	[":frog:", "🐸"],
	[":hamster:", "🐹"],
	[":wolf:", "🐺"],
	[":bear:", "🐻"],
	[":panda_face:", "🐼"],
	[":pig_nose:", "🐽"],
	[":feet:", "🐾"],
	[":eyes:", "👀"],
	[":ear:", "👂"],
	[":nose:", "👃"],
	[":lips:", "👄"],
	[":tongue:", "👅"],
	[":point_up_2:", "👆"],
	[":point_down:", "👇"],
	[":point_left:", "👈"],
	[":point_right:", "👉"],
	[":punch:", "👊"],
	[":wave:", "👋"],
	[":ok_hand:", "👌"],
	[":thumbsup:", "👍"],
	[":thumbsdown:", "👎"],
	[":clap:", "👏"],
	[":open_hands:", "👐"],
	[":crown:", "👑"],
	[":womans_hat:", "👒"],
	[":eyeglasses:", "👓"],
	[":necktie:", "👔"],
	[":shirt:", "👕"],
	[":jeans:", "👖"],
	[":dress:", "👗"],
	[":kimono:", "👘"],
	[":bikini:", "👙"],
	[":womans_clothes:", "👚"],
	[":purse:", "👛"],
	[":handbag:", "👜"],
	[":pouch:", "👝"],
	[":mans_shoe:", "👞"],
	[":athletic_shoe:", "👟"],
	[":high_heel:", "👠"],
	[":sandal:", "👡"],
	[":boot:", "👢"],
	[":footprints:", "👣"],
	[":bust_in_silhouette:", "👤"],
	[":boy:", "👦"],
	[":girl:", "👧"],
	[":man:", "👨"],
	[":woman:", "👩"],
	[":family:", "👪"],
	[":couple:", "👫"],
	[":cop:", "👮"],
	[":dancers:", "👯"],
	[":bride_with_veil:", "👰"],
	[":person_with_blond_hair:", "👱"],
	[":man_with_gua_pi_mao:", "👲"],
	[":man_with_turban:", "👳"],
	[":older_man:", "👴"],
	[":older_woman:", "👵"],
	[":baby:", "👶"],
	[":construction_worker:", "👷"],
	[":princess:", "👸"],
	[":japanese_ogre:", "👹"],
	[":japanese_goblin:", "👺"],
	[":ghost:", "👻"],
	[":angel:", "👼"],
	[":alien:", "👽"],
	[":space_invader:", "👾"],
	[":robot_face:", "🤖"],
	[":imp:", "👿"],
	[":skull:", "💀"],
	[":information_desk_person:", "💁"],
	[":guardsman:", "💂"],
	[":dancer:", "💃"],
	[":lipstick:", "💄"],
	[":nail_care:", "💅"],
	[":massage:", "💆"],
	[":haircut:", "💇"],
	[":barber:", "💈"],
	[":syringe:", "💉"],
	[":pill:", "💊"],
	[":kiss:", "💋"],
	[":love_letter:", "💌"],
	[":ring:", "💍"],
	[":gem:", "💎"],
	[":couplekiss:", "💏"],
	[":bouquet:", "💐"],
	[":couple_with_heart:", "💑"],
	[":wedding:", "💒"],
	[":heartbeat:", "💓"],
	[":broken_heart:", "💔"],
	[":two_hearts:", "💕"],
	[":sparkling_heart:", "💖"],
	[":heartpulse:", "💗"],
	[":cupid:", "💘"],
	[":blue_heart:", "💙"],
	[":green_heart:", "💚"],
	[":yellow_heart:", "💛"],
	[":purple_heart:", "💜"],
	[":gift_heart:", "💝"],
	[":revolving_hearts:", "💞"],
	[":heart_decoration:", "💟"],
	[":diamond_shape_with_a_dot_inside:", "💠"],
	[":bulb:", "💡"],
	[":anger:", "💢"],
	[":bomb:", "💣"],
	[":zzz:", "💤"],
	[":boom:", "💥"],
	[":sweat_drops:", "💦"],
	[":droplet:", "💧"],
	[":dash:", "💨"],
	[":poop:", "💩"],
	[":muscle:", "💪"],
	[":dizzy:", "💫"],
	[":speech_balloon:", "💬"],
	[":white_flower:", "💮"],
	[":_100:", "💯"],
	[":moneybag:", "💰"],
	[":currency_exchange:", "💱"],
	[":heavy_dollar_sign:", "💲"],
	[":credit_card:", "💳"],
	[":yen:", "💴"],
	[":dollar:", "💵"],
	[":money_with_wings:", "💸"],
	[":chart:", "💹"],
	[":seat:", "💺"],
	[":computer:", "💻"],
	[":briefcase:", "💼"],
	[":minidisc:", "💽"],
	[":floppy_disk:", "💾"],
	[":cd:", "💿"],
	[":dvd:", "📀"],
	[":file_folder:", "📁"],
	[":open_file_folder:", "📂"],
	[":page_with_curl:", "📃"],
	[":page_facing_up:", "📄"],
	[":date:", "📅"],
	[":calendar:", "📆"],
	[":card_index:", "📇"],
	[":chart_with_upwards_trend:", "📈"],
	[":chart_with_downwards_trend:", "📉"],
	[":bar_chart:", "📊"],
	[":clipboard:", "📋"],
	[":pushpin:", "📌"],
	[":round_pushpin:", "📍"],
	[":paperclip:", "📎"],
	[":straight_ruler:", "📏"],
	[":triangular_ruler:", "📐"],
	[":bookmark_tabs:", "📑"],
	[":ledger:", "📒"],
	[":notebook:", "📓"],
	[":notebook_with_decorative_cover:", "📔"],
	[":closed_book:", "📕"],
	[":book:", "📖"],
	[":green_book:", "📗"],
	[":blue_book:", "📘"],
	[":orange_book:", "📙"],
	[":books:", "📚"],
	[":name_badge:", "📛"],
	[":scroll:", "📜"],
	[":pencil:", "📝"],
	[":telephone_receiver:", "📞"],
	[":pager:", "📟"],
	[":fax:", "📠"],
	[":satellite:", "📡"],
	[":loudspeaker:", "📢"],
	[":mega:", "📣"],
	[":outbox_tray:", "📤"],
	[":inbox_tray:", "📥"],
	[":package:", "📦"],
	[":e_mail:", "📧"],
	[":incoming_envelope:", "📨"],
	[":envelope_with_arrow:", "📩"],
	[":mailbox_closed:", "📪"],
	[":mailbox:", "📫"],
	[":postbox:", "📮"],
	[":newspaper:", "📰"],
	[":iphone:", "📱"],
	[":calling:", "📲"],
	[":vibration_mode:", "📳"],
	[":mobile_phone_off:", "📴"],
	[":signal_strength:", "📶"],
	[":camera:", "📷"],
	[":video_camera:", "📹"],
	[":tv:", "📺"],
	[":radio:", "📻"],
	[":vhs:", "📼"],
	[":arrows_clockwise:", "🔃"],
	[":loud_sound:", "🔊"],
	[":battery:", "🔋"],
	[":electric_plug:", "🔌"],
	[":mag:", "🔍"],
	[":mag_right:", "🔎"],
	[":lock_with_ink_pen:", "🔏"],
	[":closed_lock_with_key:", "🔐"],
	[":key:", "🔑"],
	[":lock:", "🔒"],
	[":unlock:", "🔓"],
	[":bell:", "🔔"],
	[":bookmark:", "🔖"],
	[":link:", "🔗"],
	[":radio_button:", "🔘"],
	[":back:", "🔙"],
	[":end:", "🔚"],
	[":on:", "🔛"],
	[":soon:", "🔜"],
	[":top:", "🔝"],
	[":underage:", "🔞"],
	[":keycap_ten:", "🔟"],
	[":capital_abcd:", "🔠"],
	[":abcd:", "🔡"],
	[":_1234:", "🔢"],
	[":symbols:", "🔣"],
	[":abc:", "🔤"],
	[":fire:", "🔥"],
	[":flashlight:", "🔦"],
	[":wrench:", "🔧"],
	[":hammer:", "🔨"],
	[":nut_and_bolt:", "🔩"],
	[":knife:", "🔪"],
	[":gun:", "🔫"],
	[":crystal_ball:", "🔮"],
	[":six_pointed_star:", "🔯"],
	[":beginner:", "🔰"],
	[":trident:", "🔱"],
	[":black_square_button:", "🔲"],
	[":white_square_button:", "🔳"],
	[":red_circle:", "🔴"],
	[":large_blue_circle:", "🔵"],
	[":large_orange_diamond:", "🔶"],
	[":large_blue_diamond:", "🔷"],
	[":small_orange_diamond:", "🔸"],
	[":small_blue_diamond:", "🔹"],
	[":small_red_triangle:", "🔺"],
	[":small_red_triangle_down:", "🔻"],
	[":arrow_up_small:", "🔼"],
	[":arrow_down_small:", "🔽"],
	[":clock1:", "🕐"],
	[":clock2:", "🕑"],
	[":clock3:", "🕒"],
	[":clock4:", "🕓"],
	[":clock5:", "🕔"],
	[":clock6:", "🕕"],
	[":clock7:", "🕖"],
	[":clock8:", "🕗"],
	[":clock9:", "🕘"],
	[":clock10:", "🕙"],
	[":clock11:", "🕚"],
	[":clock12:", "🕛"],
	[":mount_fuji:", "🗻"],
	[":tokyo_tower:", "🗼"],
	[":statue_of_liberty:", "🗽"],
	[":japan:", "🗾"],
	[":moyai:", "🗿"],
	[":grin:", "😁"],
	[":joy:", "😂"],
	[":smiley:", "😃"],
	[":smile:", "😄"],
	[":sweat_smile:", "😅"],
	[":laughing:", "😆"],
	[":wink:", "😉"],
	[":blush:", "😊"],
	[":yum:", "😋"],
	[":relieved:", "😌"],
	[":heart_eyes:", "😍"],
	[":smirk:", "😏"],
	[":unamused:", "😒"],
	[":sweat:", "😓"],
	[":pensive:", "😔"],
	[":confounded:", "😖"],
	[":kissing_heart:", "😘"],
	[":kissing_closed_eyes:", "😚"],
	[":stuck_out_tongue_winking_eye:", "😜"],
	[":stuck_out_tongue_closed_eyes:", "😝"],
	[":disappointed:", "😞"],
	[":angry:", "😠"],
	[":rage:", "😡"],
	[":cry:", "😢"],
	[":persevere:", "😣"],
	[":triumph:", "😤"],
	[":disappointed_relieved:", "😥"],
	[":fearful:", "😨"],
	[":weary:", "😩"],
	[":sleepy:", "😪"],
	[":tired_face:", "😫"],
	[":sob:", "😭"],
	[":cold_sweat:", "😰"],
	[":scream:", "😱"],
	[":astonished:", "😲"],
	[":flushed:", "😳"],
	[":dizzy_face:", "😵"],
	[":mask:", "😷"],
	[":smile_cat:", "😸"],
	[":joy_cat:", "😹"],
	[":smiley_cat:", "😺"],
	[":heart_eyes_cat:", "😻"],
	[":smirk_cat:", "😼"],
	[":kissing_cat:", "😽"],
	[":pouting_cat:", "😾"],
	[":crying_cat_face:", "😿"],
	[":scream_cat:", "🙀"],
	[":no_good:", "🙅"],
	[":ok_woman:", "🙆"],
	[":bow:", "🙇"],
	[":see_no_evil:", "🙈"],
	[":hear_no_evil:", "🙉"],
	[":speak_no_evil:", "🙊"],
	[":raising_hand:", "🙋"],
	[":raised_hands:", "🙌"],
	[":person_frowning:", "🙍"],
	[":person_with_pouting_face:", "🙎"],
	[":pray:", "🙏"],
	[":rocket:", "🚀"],
	[":railway_car:", "🚃"],
	[":bullettrain_side:", "🚄"],
	[":bullettrain_front:", "🚅"],
	[":metro:", "🚇"],
	[":station:", "🚉"],
	[":bus:", "🚌"],
	[":busstop:", "🚏"],
	[":ambulance:", "🚑"],
	[":fire_engine:", "🚒"],
	[":police_car:", "🚓"],
	[":taxi:", "🚕"],
	[":red_car:", "🚗"],
	[":blue_car:", "🚙"],
	[":truck:", "🚚"],
	[":ship:", "🚢"],
	[":speedboat:", "🚤"],
	[":traffic_light:", "🚥"],
	[":construction:", "🚧"],
	[":rotating_light:", "🚨"],
	[":triangular_flag_on_post:", "🚩"],
	[":door:", "🚪"],
	[":no_entry_sign:", "🚫"],
	[":smoking:", "🚬"],
	[":no_smoking:", "🚭"],
	[":bike:", "🚲"],
	[":walking:", "🚶"],
	[":mens:", "🚹"],
	[":womens:", "🚺"],
	[":restroom:", "🚻"],
	[":baby_symbol:", "🚼"],
	[":toilet:", "🚽"],
	[":wc:", "🚾"],
	[":bath:", "🛀"],
	[":articulated_lorry:", "🚛"],
	[":kissing_smiling_eyes:", "😙"],
	[":pear:", "🍐"],
	[":bicyclist:", "🚴"],
	[":rabbit2:", "🐇"],
	[":clock830:", "🕣"],
	[":train:", "🚋"],
	[":oncoming_automobile:", "🚘"],
	[":expressionless:", "😑"],
	[":smiling_imp:", "😈"],
	[":frowning:", "😦"],
	[":no_mouth:", "😶"],
	[":baby_bottle:", "🍼"],
	[":non_potable_water:", "🚱"],
	[":open_mouth:", "😮"],
	[":last_quarter_moon_with_face:", "🌜"],
	[":do_not_litter:", "🚯"],
	[":sunglasses:", "😎"],
	[":loop:", "➿"],
	[":last_quarter_moon:", "🌗"],
	[":grinning:", "😀"],
	[":euro:", "💶"],
	[":clock330:", "🕞"],
	[":telescope:", "🔭"],
	[":globe_with_meridians:", "🌐"],
	[":postal_horn:", "📯"],
	[":stuck_out_tongue:", "😛"],
	[":clock1030:", "🕥"],
	[":pound:", "💷"],
	[":two_men_holding_hands:", "👬"],
	[":tiger2:", "🐅"],
	[":anguished:", "😧"],
	[":vertical_traffic_light:", "🚦"],
	[":confused:", "😕"],
	[":repeat:", "🔁"],
	[":oncoming_police_car:", "🚔"],
	[":tram:", "🚊"],
	[":dragon:", "🐉"],
	[":earth_americas:", "🌎"],
	[":rugby_football:", "🏉"],
	[":left_luggage:", "🛅"],
	[":sound:", "🔉"],
	[":clock630:", "🕡"],
	[":dromedary_camel:", "🐪"],
	[":oncoming_bus:", "🚍"],
	[":horse_racing:", "🏇"],
	[":rooster:", "🐓"],
	[":rowboat:", "🚣"],
	[":customs:", "🛃"],
	[":repeat_one:", "🔂"],
	[":waxing_crescent_moon:", "🌒"],
	[":mountain_railway:", "🚞"],
	[":clock930:", "🕤"],
	[":put_litter_in_its_place:", "🚮"],
	[":arrows_counterclockwise:", "🔄"],
	[":clock130:", "🕜"],
	[":goat:", "🐐"],
	[":pig2:", "🐖"],
	[":innocent:", "😇"],
	[":no_bicycles:", "🚳"],
	[":light_rail:", "🚈"],
	[":whale2:", "🐋"],
	[":train2:", "🚆"],
	[":earth_africa:", "🌍"],
	[":shower:", "🚿"],
	[":waning_gibbous_moon:", "🌖"],
	[":steam_locomotive:", "🚂"],
	[":cat2:", "🐈"],
	[":tractor:", "🚜"],
	[":thought_balloon:", "💭"],
	[":two_women_holding_hands:", "👭"],
	[":full_moon_with_face:", "🌝"],
	[":mouse2:", "🐁"],
	[":clock430:", "🕟"],
	[":worried:", "😟"],
	[":rat:", "🐀"],
	[":ram:", "🐏"],
	[":dog2:", "🐕"],
	[":kissing:", "😗"],
	[":helicopter:", "🚁"],
	[":clock1130:", "🕦"],
	[":no_mobile_phones:", "📵"],
	[":european_post_office:", "🏤"],
	[":ox:", "🐂"],
	[":mountain_cableway:", "🚠"],
	[":sleeping:", "😴"],
	[":cow2:", "🐄"],
	[":minibus:", "🚐"],
	[":clock730:", "🕢"],
	[":aerial_tramway:", "🚡"],
	[":speaker:", "🔈"],
	[":no_bell:", "🔕"],
	[":mailbox_with_mail:", "📬"],
	[":no_pedestrians:", "🚷"],
	[":microscope:", "🔬"],
	[":bathtub:", "🛁"],
	[":suspension_railway:", "🚟"],
	[":crocodile:", "🐊"],
	[":mountain_bicyclist:", "🚵"],
	[":waning_crescent_moon:", "🌘"],
	[":monorail:", "🚝"],
	[":children_crossing:", "🚸"],
	[":clock230:", "🕝"],
	[":busts_in_silhouette:", "👥"],
	[":mailbox_with_no_mail:", "📭"],
	[":leopard:", "🐆"],
	[":deciduous_tree:", "🌳"],
	[":oncoming_taxi:", "🚖"],
	[":lemon:", "🍋"],
	[":mute:", "🔇"],
	[":baggage_claim:", "🛄"],
	[":twisted_rightwards_arrows:", "🔀"],
	[":sun_with_face:", "🌞"],
	[":trolleybus:", "🚎"],
	[":evergreen_tree:", "🌲"],
	[":passport_control:", "🛂"],
	[":new_moon_with_face:", "🌚"],
	[":potable_water:", "🚰"],
	[":high_brightness:", "🔆"],
	[":low_brightness:", "🔅"],
	[":clock530:", "🕠"],
	[":hushed:", "😯"],
	[":grimacing:", "😬"],
	[":water_buffalo:", "🐃"],
	[":neutral_face:", "😐"],
	[":clock1230:", "🕧"],
	[":P", "😛"],
	[":)", "🙂"],
	[":D", "😃"],
	[":o", "😮"],
	[":O", "😮"],
	[":(", "☹️"],
	[":|", "😐"],
];

// ----------------------------------------------------------------------------

let gameNames = [
	"Unknown",
	"GTA III",
	"GTA Vice City",
	"GTA San Andreas",
	"GTA Underground",
	"GTA IV",
	"GTA IV: Episodes from Liberty City",
];

// ----------------------------------------------------------------------------

let vehicleWheelStateNames = [
	"normal",
	"flat",
	"gone"
];

// ----------------------------------------------------------------------------

let vehicleWheelStateActionNames = [
	"repaired",
	"flattened",
	"destroyed"
];

// ----------------------------------------------------------------------------

let vehicleDoorStateNames = [
	"closed",
	"closed",
	"swinging",
	"open"
];

// ----------------------------------------------------------------------------

let vehicleDoorStateActionNames = [
	"closed",
	"closed",
	"opened",
	"opened"
];

// ----------------------------------------------------------------------------

let vehicleWheelNames = [
	"front left",
	"rear left",
	"front right",
	"rear right"
];

// ----------------------------------------------------------------------------

let vehicleLightNames = [
	"front left",
	"rear left",
	"front right",
	"rear right"
];

// ----------------------------------------------------------------------------

let vehicleRadioStationNames = [
	[],
	[  // GTA III
		"Head Radio",
		"Double Cleff FM",
		"Jah Radio",
		"Rise FM",
		"Lips 106",
		"Flashback FM",
		"Chatterbox 109",
		"MP3 Player"
	],

	[ // GTA Vice City
		"Wildstyle",
		"Flash FM",
		"K CHAT",
		"Fever 105",
		"VROCK",
		"VCPR",
		"Espantoso",
		"Emotion 98.3",
		"Wave 103",
		"MP3 Player"
	],

	[ // GTA San Andreas
		"KROSE",
		"KDST",
		"Bounce FM",
		"SFUR",
		"Radio Los Santos",
		"Radio X",
		"CSR Radio",
		"KJAH West",
		"Master Sounds",
		"WCTR",
		"User Track Player"
	],

	[ // GTA IV
		"The Vibe 98.9",
		"97.8 Liberty Rock Radio",
		"JAZZ NATION RADIO 108.5",
		"Massive B",
		"K109 The Studio",
		"WKTT Radio",
		"Liberty City Hardcore",
		"The Journey",
		"Fusion FM",
		"The Beat 102.7",
		"Radio Broker",
		"Vladivostok FM",
		"PLR - Public Liberty Radio",
		"San Juan Sounds",
		"Electro-Choc",
		"The Classics 104.1",
		"IF99 - International Funk",
		"Tuff Gong",
		"Independence FM",
		"Integrity 2.0",
	],

	[ // GTA IV (EFLC)
		"The Vibe 98.9",
		"97.8 Liberty Rock Radio",
		"JAZZ NATION RADIO 108.5",
		"Massive B",
		"K109 The Studio",
		"WKTT Radio",
		"Liberty City Hardcore",
		"The Journey",
		"Fusion FM",
		"The Beat 102.7",
		"Radio Broker",
		"Vladivostok FM",
		"PLR - Public Liberty Radio",
		"San Juan Sounds",
		"Electro-Choc",
		"The Classics 104.1",
		"IF99 - International Funk",
		"Tuff Gong",
		"Independence FM",
		"Integrity 2.0",
	],
];

// ----------------------------------------------------------------------------

let vehicleModelIdStart = [
	0,
	90, 	// GTA III
	130, 	// GTA Vice City
	400, 	// GTA San Andreas
	400,	// GTA Underground
	84,		// GTA IV
	84,		// GTA EFLC
];

// ----------------------------------------------------------------------------

let vehicles = {
	[GAME_GTA_III]: [
		new VehicleType(90, "Landstalker"),
		new VehicleType(91, "Idaho"),
		new VehicleType(92, "Stinger"),
		new VehicleType(93, "Linerunner"),
		new VehicleType(94, "Perennial"),
		new VehicleType(95, "Sentinel"),
		new VehicleType(96, "Patriot"),
		new VehicleType(97, "Fire Truck"),
		new VehicleType(98, "Trashmaster"),
		new VehicleType(99, "Stretch"),
		new VehicleType(100, "Manana"),
		new VehicleType(101, "Infernus"),
		new VehicleType(102, "Blista"),
		new VehicleType(103, "Pony"),
		new VehicleType(104, "Mule"),
		new VehicleType(105, "Cheetah"),
		new VehicleType(106, "Ambulance"),
		new VehicleType(107, "FBI Car"),
		new VehicleType(108, "Moonbeam"),
		new VehicleType(109, "Esperanto"),
		new VehicleType(110, "Taxi"),
		new VehicleType(111, "Kuruma"),
		new VehicleType(112, "Bobcat"),
		new VehicleType(113, "Mr. Whoopee"),
		new VehicleType(114, "BF Injection"),
		new VehicleType(115, "Manana (Corpse)"),
		new VehicleType(116, "Police Car"),
		new VehicleType(117, "Enforcer"),
		new VehicleType(118, "Securicar"),
		new VehicleType(119, "Banshee"),
		new VehicleType(120, "Predator", { isBoat: true }),
		new VehicleType(121, "Bus"),
		new VehicleType(122, "Rhino"),
		new VehicleType(123, "Barracks OL"),
		new VehicleType(124, "Train", { canBeSpawned: false }),
		new VehicleType(125, "Police Helicopter"),
		new VehicleType(126, "Dodo"),
		new VehicleType(127, "Coach"),
		new VehicleType(128, "Cabbie"),
		new VehicleType(129, "Stallion"),
		new VehicleType(130, "Rumpo"),
		new VehicleType(131, "RC Bandit"),
		new VehicleType(132, "Bellyup"),
		new VehicleType(133, "Mr. Wongs"),
		new VehicleType(134, "Mafia Sentinel"),
		new VehicleType(135, "Yardie Lobo"),
		new VehicleType(136, "Yakuza Stinger"),
		new VehicleType(137, "Diablo Stallion"),
		new VehicleType(138, "Cartel Cruiser"),
		new VehicleType(139, "Hoods Rumpo XL"),
		new VehicleType(140, "Air Train", { canBeSpawned: false }),
		new VehicleType(141, "Dead Dodo", { canBeSpawned: false }),
		new VehicleType(142, "Speeder", { isBoat: true }),
		new VehicleType(143, "Reefer", { isBoat: true }),
		new VehicleType(144, "Panlantic"),
		new VehicleType(145, "Flatbed"),
		new VehicleType(146, "Yankee"),
		new VehicleType(147, "Escape", { canBeSpawned: false }),
		new VehicleType(148, "Borgnine Taxi"),
		new VehicleType(149, "Toyz Van"),
		new VehicleType(150, "Ghost", { canBeSpawned: false }),
	],
	[GAME_GTA_VC]: [// GTA VC
		new VehicleType(130, "Landstalker"),
		new VehicleType(131, "Idaho"),
		new VehicleType(132, "Stinger"),
		new VehicleType(133, "Linerunner"),
		new VehicleType(134, "Perennial"),
		new VehicleType(135, "Sentinel"),
		new VehicleType(136, "Rio"),
		new VehicleType(137, "Firetruck"),
		new VehicleType(138, "Trashmaster"),
		new VehicleType(139, "Stretch"),
		new VehicleType(140, "Manana"),
		new VehicleType(141, "Infernus"),
		new VehicleType(142, "Voodoo"),
		new VehicleType(143, "Pony"),
		new VehicleType(144, "Mule"),
		new VehicleType(145, "Cheetah"),
		new VehicleType(146, "Ambulance"),
		new VehicleType(147, "FBI Washington"),
		new VehicleType(148, "Moonbeam"),
		new VehicleType(149, "Esperanto"),
		new VehicleType(150, "Taxi"),
		new VehicleType(151, "Washington 2"),
		new VehicleType(152, "Bobcat"),
		new VehicleType(153, "Mr.Whoopee"),
		new VehicleType(154, "BF-Injection"),
		new VehicleType(155, "Hunter"),
		new VehicleType(156, "Police Car"),
		new VehicleType(157, "Enforcer"),
		new VehicleType(158, "Securicar"),
		new VehicleType(159, "Banshee"),
		new VehicleType(160, "Predator", { isBoat: true }),
		new VehicleType(161, "Bus"),
		new VehicleType(162, "Rhino"),
		new VehicleType(163, "Barracks OL"),
		new VehicleType(164, "Cuban Hermes"),
		new VehicleType(165, "Helicopter"),
		new VehicleType(166, "Angel"),
		new VehicleType(167, "Coach"),
		new VehicleType(168, "Cabbie"),
		new VehicleType(169, "Stallion"),
		new VehicleType(170, "Rumpo"),
		new VehicleType(171, "RC Bandit"),
		new VehicleType(172, "Romero's Hearse"),
		new VehicleType(173, "Packer"),
		new VehicleType(174, "Sentinel XS"),
		new VehicleType(175, "Admiral"),
		new VehicleType(176, "Squalo"),
		new VehicleType(177, "Sea Sparrow"),
		new VehicleType(178, "Pizza Boy"),
		new VehicleType(179, "Gang Burrito"),
		new VehicleType(180, "Airtrain", { canBeSpawned: false }),
		new VehicleType(181, "Deaddodo", { canBeSpawned: false }),
		new VehicleType(182, "Speeder"),
		new VehicleType(183, "Reefer"),
		new VehicleType(184, "Tropic"),
		new VehicleType(185, "Flatbed"),
		new VehicleType(186, "Yankee"),
		new VehicleType(187, "Caddy"),
		new VehicleType(188, "Zebra Cab"),
		new VehicleType(189, "Top Fun"),
		new VehicleType(190, "Skimmer", { isBoat: true, isAircraft: true }),
		new VehicleType(191, "PCJ-600"),
		new VehicleType(192, "Faggio"),
		new VehicleType(193, "Freeway"),
		new VehicleType(194, "RC Varon"),
		new VehicleType(195, "RC Raider"),
		new VehicleType(196, "Glendale"),
		new VehicleType(197, "Oceanic"),
		new VehicleType(198, "Sanchez"),
		new VehicleType(199, "Sparrow"),
		new VehicleType(200, "Patriot"),
		new VehicleType(201, "Love Fist"),
		new VehicleType(202, "Coast Guard", { isBoat: true }),
		new VehicleType(203, "Dinghy", { isBoat: true }),
		new VehicleType(204, "Hermes"),
		new VehicleType(205, "Sabre"),
		new VehicleType(206, "Sabre Turbo"),
		new VehicleType(207, "Phoenix"),
		new VehicleType(208, "Walton"),
		new VehicleType(209, "Regina"),
		new VehicleType(210, "Comet"),
		new VehicleType(211, "Deluxo"),
		new VehicleType(212, "Burrito"),
		new VehicleType(213, "Spand Express"),
		new VehicleType(214, "Marquis", { isBoat: true }),
		new VehicleType(215, "Baggage Handler"),
		new VehicleType(216, "Kaufman Cab"),
		new VehicleType(217, "Maverick"),
		new VehicleType(218, "VCN Maverick"),
		new VehicleType(219, "Rancher"),
		new VehicleType(220, "FBI Rancher"),
		new VehicleType(221, "Virgo"),
		new VehicleType(222, "Greenwood"),
		new VehicleType(223, "Cuban Jetmax", { isBoat: true }),
		new VehicleType(224, "Hotring Racer 1"),
		new VehicleType(225, "Sandking"),
		new VehicleType(226, "Blista Compact"),
		new VehicleType(227, "Police Maverick"),
		new VehicleType(228, "Boxville"),
		new VehicleType(229, "Benson"),
		new VehicleType(230, "Mesa Grande"),
		new VehicleType(231, "RC Goblin"),
		new VehicleType(232, "Hotring Racer 2"),
		new VehicleType(233, "Hotring Racer 3"),
		new VehicleType(234, "Bloodring Banger 1"),
		new VehicleType(235, "Bloodring Banger 2"),
		new VehicleType(236, "VCPD Cheetah"),
	],
	[GAME_GTA_SA]: [ // GTA San Andreas
		new VehicleType(400, "Landstalker"),
		new VehicleType(401, "Bravura"),
		new VehicleType(402, "Buffalo"),
		new VehicleType(403, "Linerunner"),
		new VehicleType(404, "Pereniel"),
		new VehicleType(405, "Sentinel"),
		new VehicleType(406, "Dumper"),
		new VehicleType(407, "Firetruck"),
		new VehicleType(408, "Trashmaster"),
		new VehicleType(409, "Stretch"),
		new VehicleType(410, "Manana"),
		new VehicleType(411, "Infernus"),
		new VehicleType(412, "Voodoo"),
		new VehicleType(413, "Pony"),
		new VehicleType(414, "Mule"),
		new VehicleType(415, "Cheetah"),
		new VehicleType(416, "Ambulance"),
		new VehicleType(417, "Leviathan"),
		new VehicleType(418, "Moonbeam"),
		new VehicleType(419, "Esperanto"),
		new VehicleType(420, "Taxi"),
		new VehicleType(421, "Washington"),
		new VehicleType(422, "Bobcat"),
		new VehicleType(423, "Mr Whoopee"),
		new VehicleType(424, "BF Injection"),
		new VehicleType(425, "Hunter"),
		new VehicleType(426, "Premier"),
		new VehicleType(427, "Enforcer"),
		new VehicleType(428, "Securicar"),
		new VehicleType(429, "Banshee"),
		new VehicleType(430, "Predator", { isBoat: true }),
		new VehicleType(431, "Bus"),
		new VehicleType(432, "Rhino"),
		new VehicleType(433, "Barracks"),
		new VehicleType(434, "Hotknife"),
		new VehicleType(435, "Box Trailer"),
		new VehicleType(436, "Previon"),
		new VehicleType(437, "Coach"),
		new VehicleType(438, "Cabbie"),
		new VehicleType(439, "Stallion"),
		new VehicleType(440, "Rumpo"),
		new VehicleType(441, "RC Bandit"),
		new VehicleType(442, "Romero"),
		new VehicleType(443, "Packer"),
		new VehicleType(444, "Monster"),
		new VehicleType(445, "Admiral"),
		new VehicleType(446, "Squalo", { isBoat: true }),
		new VehicleType(447, "Seasparrow", { isBoat: true, isAircraft: true }),
		new VehicleType(448, "Pizzaboy"),
		new VehicleType(449, "Tram"),
		new VehicleType(450, "Grain Trailer"),
		new VehicleType(451, "Turismo"),
		new VehicleType(452, "Speeder", { isBoat: true }),
		new VehicleType(453, "Reefer", { isBoat: true }),
		new VehicleType(454, "Tropic"),
		new VehicleType(455, "Flatbed", { isBoat: true }),
		new VehicleType(456, "Yankee"),
		new VehicleType(457, "Caddy"),
		new VehicleType(458, "Solair"),
		new VehicleType(459, "Berkley's RC Van"),
		new VehicleType(460, "Skimmer", { isBoat: true, isAircraft: true }),
		new VehicleType(461, "PCJ-600"),
		new VehicleType(462, "Faggio"),
		new VehicleType(463, "Freeway"),
		new VehicleType(464, "RC Baron"),
		new VehicleType(465, "RC Raider"),
		new VehicleType(466, "Glendale"),
		new VehicleType(467, "Oceanic"),
		new VehicleType(468, "Sanchez"),
		new VehicleType(469, "Sparrow"),
		new VehicleType(470, "Patriot"),
		new VehicleType(471, "Quad"),
		new VehicleType(472, "Coastguard", { isBoat: true }),
		new VehicleType(473, "Dinghy", { isBoat: true }),
		new VehicleType(474, "Hermes"),
		new VehicleType(475, "Sabre"),
		new VehicleType(476, "Rustler"),
		new VehicleType(477, "ZR-350"),
		new VehicleType(478, "Walton"),
		new VehicleType(479, "Regina"),
		new VehicleType(480, "Comet"),
		new VehicleType(481, "BMX"),
		new VehicleType(482, "Burrito"),
		new VehicleType(483, "Camper"),
		new VehicleType(484, "Marquis", { isBoat: true }),
		new VehicleType(485, "Baggage"),
		new VehicleType(486, "Dozer"),
		new VehicleType(487, "Maverick"),
		new VehicleType(488, "News Maverick"),
		new VehicleType(489, "Rancher"),
		new VehicleType(490, "FBI Rancher"),
		new VehicleType(491, "Virgo"),
		new VehicleType(492, "Greenwood"),
		new VehicleType(493, "Jetmax", { isBoat: true }),
		new VehicleType(494, "Hotring-Racer A"),
		new VehicleType(495, "Sandking"),
		new VehicleType(496, "Blista"),
		new VehicleType(497, "Police Maverick"),
		new VehicleType(498, "Boxville"),
		new VehicleType(499, "Benson"),
		new VehicleType(500, "Mesa"),
		new VehicleType(501, "RC Goblin"),
		new VehicleType(502, "Hotring-Racer B"),
		new VehicleType(503, "Hotring-Racer C"),
		new VehicleType(504, "Bloodring-Banger"),
		new VehicleType(505, "Rancher"),
		new VehicleType(506, "Super-GT"),
		new VehicleType(507, "Elegant"),
		new VehicleType(508, "Journey"),
		new VehicleType(509, "Bike"),
		new VehicleType(510, "Mountain Bike"),
		new VehicleType(511, "Beagle"),
		new VehicleType(512, "Cropduster"),
		new VehicleType(513, "Stunt"),
		new VehicleType(514, "Tanker"),
		new VehicleType(515, "RoadTrain"),
		new VehicleType(516, "Nebula"),
		new VehicleType(517, "Majestic"),
		new VehicleType(518, "Buccaneer"),
		new VehicleType(519, "Shamal"),
		new VehicleType(520, "Hydra"),
		new VehicleType(521, "FCR-900"),
		new VehicleType(522, "NRG-500"),
		new VehicleType(523, "HPV1000"),
		new VehicleType(524, "Cement Truck"),
		new VehicleType(525, "Tow Truck"),
		new VehicleType(526, "Fortune"),
		new VehicleType(527, "Cadrona"),
		new VehicleType(528, "FBI Truck"),
		new VehicleType(529, "Willard"),
		new VehicleType(530, "Forklift"),
		new VehicleType(531, "Tractor"),
		new VehicleType(532, "Combine"),
		new VehicleType(533, "Feltzer"),
		new VehicleType(534, "Remington"),
		new VehicleType(535, "Slamvan"),
		new VehicleType(536, "Blade"),
		new VehicleType(537, "Freight"),
		new VehicleType(538, "Streak"),
		new VehicleType(539, "Vortex"),
		new VehicleType(540, "Vincent"),
		new VehicleType(541, "Bullet"),
		new VehicleType(542, "Clover"),
		new VehicleType(543, "Sadler"),
		new VehicleType(544, "Firetruck"),
		new VehicleType(545, "Hustler"),
		new VehicleType(546, "Intruder"),
		new VehicleType(547, "Primo"),
		new VehicleType(548, "Cargobob"),
		new VehicleType(549, "Tampa"),
		new VehicleType(550, "Sunrise"),
		new VehicleType(551, "Merit"),
		new VehicleType(552, "Utility"),
		new VehicleType(553, "Nevada"),
		new VehicleType(554, "Yosemite"),
		new VehicleType(555, "Windsor"),
		new VehicleType(556, "Monster Truck A"),
		new VehicleType(557, "Monster Truck B"),
		new VehicleType(558, "Uranus"),
		new VehicleType(559, "Jester"),
		new VehicleType(560, "Sultan"),
		new VehicleType(561, "Stratum"),
		new VehicleType(562, "Elegy"),
		new VehicleType(563, "Raindance"),
		new VehicleType(564, "RC Tiger"),
		new VehicleType(565, "Flash"),
		new VehicleType(566, "Tahoma"),
		new VehicleType(567, "Savanna"),
		new VehicleType(568, "Bandito"),
		new VehicleType(569, "Freight"),
		new VehicleType(570, "Trailer"),
		new VehicleType(571, "Kart"),
		new VehicleType(572, "Mower"),
		new VehicleType(573, "Duneride"),
		new VehicleType(574, "Sweeper"),
		new VehicleType(575, "Broadway"),
		new VehicleType(576, "Tornado"),
		new VehicleType(577, "AT-400"),
		new VehicleType(578, "DFT-30"),
		new VehicleType(579, "Huntley"),
		new VehicleType(580, "Stafford"),
		new VehicleType(581, "BF-400"),
		new VehicleType(582, "Newsvan"),
		new VehicleType(583, "Tug"),
		new VehicleType(584, "Tanker Trailer"),
		new VehicleType(585, "Emperor"),
		new VehicleType(586, "Wayfarer"),
		new VehicleType(587, "Euros"),
		new VehicleType(588, "Hotdog"),
		new VehicleType(589, "Club"),
		new VehicleType(590, "Freight Boxcar"),
		new VehicleType(591, "Short Box Trailer"),
		new VehicleType(592, "Andromada"),
		new VehicleType(593, "Dodo"),
		new VehicleType(594, "RC Cam"),
		new VehicleType(595, "Launch"),
		new VehicleType(596, "Police Car (LSPD)"),
		new VehicleType(597, "Police Car (SFPD)"),
		new VehicleType(598, "Police Car (LVPD)"),
		new VehicleType(599, "Police Ranger"),
		new VehicleType(600, "Picador"),
		new VehicleType(601, "S.W.A.T. Van"),
		new VehicleType(602, "Alpha"),
		new VehicleType(603, "Phoenix"),
		new VehicleType(604, "Broken Glendale"),
		new VehicleType(605, "Broken Sadler"),
		new VehicleType(606, "Luggage Trailer"),
		new VehicleType(607, "Luggage Trailer"),
		new VehicleType(608, "Stair Trailer"),
		new VehicleType(609, "Boxville"),
		new VehicleType(610, "Farm Plow"),
		new VehicleType(611, "Utility Trailer"),
	],
	[GAME_GTA_IV]: [ // GTA IV
		new VehicleType(1264341792, "Admiral"),
		new VehicleType(1560980623, "Airtug"),
		new VehicleType(1171614426, "Ambulance"),
		new VehicleType(-1041692462, "Banshee"),
		new VehicleType(2053223216, "Benson"),
		new VehicleType(850991848, "Biff"),
		new VehicleType(-344943009, "Blista"),
		new VehicleType(1075851868, "Bobcat"),
		new VehicleType(-1987130134, "Boxville"),
		new VehicleType(-682211828, "Buccaneer"),
		new VehicleType(-1346687836, "Burrito"),
		new VehicleType(-907477130, "Burrito 2"),
		new VehicleType(-713569950, "Bus"),
		new VehicleType(1884962369, "Cabby"),
		new VehicleType(2006918058, "Cavalcade"),
		new VehicleType(-67282078, "Chavos"),
		new VehicleType(-2030171296, "Cognoscenti"),
		new VehicleType(1063483177, "Comet"),
		new VehicleType(108773431, "Coquette"),
		new VehicleType(162883121, "DF8"),
		new VehicleType(-1130810103, "Dillettante"),
		new VehicleType(723973206, "Dukes"),
		new VehicleType(-1971955454, "E109"),
		new VehicleType(-685276541, "Emperor"),
		new VehicleType(-1883002148, "Rusty Emperor"),
		new VehicleType(-276900515, "Esperanto"),
		new VehicleType(-2119578145, "Faction"),
		new VehicleType(1127131465, "FIB Car"),
		new VehicleType(-1097828879, "Feltzer"),
		new VehicleType(974744810, "Feroci"),
		new VehicleType(1026055242, "Airport Feroci"),
		new VehicleType(1938952078, "Firetruck"),
		new VehicleType(1353720154, "Flatbed"),
		new VehicleType(627033353, "Fortune"),
		new VehicleType(1491375716, "Forklift"),
		new VehicleType(2016857647, "Futo"),
		new VehicleType(675415136, "FXT"),
		new VehicleType(884422927, "Habanero"),
		new VehicleType(-341892653, "Hakumai"),
		new VehicleType(486987393, "Huntley"),
		new VehicleType(418536135, "Infernus"),
		new VehicleType(-1289722222, "Ingot"),
		new VehicleType(886934177, "Intruder"),
		new VehicleType(1269098716, "Landstalker"),
		new VehicleType(-37030056, "Lokus"),
		new VehicleType(-2124201592, "Manana"),
		new VehicleType(1304597482, "Marbella"),
		new VehicleType(-1260881538, "Merit"),
		new VehicleType(-310465116, "Minivan"),
		new VehicleType(525509695, "Moonbeam"),
		new VehicleType(583100975, "Mr. Tasty"),
		new VehicleType(904750859, "Mule"),
		new VehicleType(148777611, "Noose Patrol Car"),
		new VehicleType(1911513875, "Noose Stockade"),
		new VehicleType(1348744438, "Oracle"),
		new VehicleType(569305213, "Packer"),
		new VehicleType(-808457413, "Patriot"),
		new VehicleType(-2077743597, "Perennial"),
		new VehicleType(-1590284256, "Airport Perennial"),
		new VehicleType(1830407356, "Peyote"),
		new VehicleType(-2137348917, "Phantom"),
		new VehicleType(131140572, "Pinnacle"),
		new VehicleType(1376298265, "PMP-600"),
		new VehicleType(2046537925, "Police Cruiser"),
		new VehicleType(-1627000575, "Police Patrol"),
		new VehicleType(-350085182, "Police Patriot"),
		new VehicleType(-119658072, "Pony"),
		new VehicleType(-1883869285, "Premier"),
		new VehicleType(-1962071130, "Presidente"),
		new VehicleType(-1150599089, "Primo"),
		new VehicleType(-1900572838, "Police Stockade"),
		new VehicleType(1390084576, "Rancher"),
		new VehicleType(83136452, "Rebla"),
		new VehicleType(-845979911, "Ripley"),
		new VehicleType(627094268, "Romero"),
		new VehicleType(-1932515764, "Roman's Taxi"),
		new VehicleType(-227741703, "Ruiner"),
		new VehicleType(-449022887, "Sabre"),
		new VehicleType(1264386590, "Sabre 2"),
		new VehicleType(-1685021548, "Sabre GT"),
		new VehicleType(-322343873, "Schafter"),
		new VehicleType(1349725314, "Sentinel"),
		new VehicleType(1344573448, "Solair"),
		new VehicleType(-810318068, "Speedo"),
		new VehicleType(1923400478, "Stallion"),
		new VehicleType(1677715180, "Steed"),
		new VehicleType(1747439474, "Stockade"),
		new VehicleType(1723137093, "Stratum"),
		new VehicleType(-1961627517, "Stretch"),
		new VehicleType(970598228, "Sultan"),
		new VehicleType(-295689028, "Sultan RS"),
		new VehicleType(1821991593, "Super GT"),
		new VehicleType(-956048545, "Taxi 1"),
		new VehicleType(1208856469, "Taxi 2"),
		new VehicleType(1917016601, "Trashmaster"),
		new VehicleType(-1896659641, "Turismo"),
		new VehicleType(1534326199, "Uranus"),
		new VehicleType(-825837129, "Vigero"),
		new VehicleType(-1758379524, "Vigero 2"),
		new VehicleType(-583281407, "Vincent"),
		new VehicleType(-498054846, "Virgo"),
		new VehicleType(2006667053, "Voodoo"),
		new VehicleType(1777363799, "Washington"),
		new VehicleType(1937616578, "Willard"),
		new VehicleType(-1099960214, "Yankee"),
		new VehicleType(-1830458836, "Bobber"),
		new VehicleType(-1842748181, "Faggio"),
		new VehicleType(584879743, "Hellfury"),
		new VehicleType(1203311498, "NRG-900"),
		new VehicleType(-909201658, "PCJ-600"),
		new VehicleType(788045382, "Sanchez"),
		new VehicleType(-570033273, "Zombie"),
		new VehicleType(837858166, "Annihilator"),
		new VehicleType(-1660661558, "Maverick"),
		new VehicleType(353883353, "Police Maverick"),
		new VehicleType(2027357303, "Tour Maverick"),
		new VehicleType(1033245328, "Dinghy"),
		new VehicleType(861409633, "Jetmax"),
		new VehicleType(-1043459709, "Marquis"),
		new VehicleType(-488123221, "Predator"),
		new VehicleType(1759673526, "Reefer"),
		new VehicleType(400514754, "Squalo"),
		new VehicleType(1064455782, "Tuga"),
		new VehicleType(290013743, "Tropic"),
		new VehicleType(-960289747, "Cablecar"),
		new VehicleType(800869680, "Subway"),
		new VehicleType(-1953988645, "El Train"),
		new VehicleType(2450678720, "Freeway"),
		new VehicleType(729783779, "Slamvan", { ivEpisode: 2 }),
		new VehicleType(1147287684, "Caddy", { ivEpisode: 2 }),
		new VehicleType(1123216662, "Super-D", { ivEpisode: 2 }),
		new VehicleType(1638119866, "Super-D 2", { ivEpisode: 2 }),
		new VehicleType(1337041428, "Serrano", { ivEpisode: 2 }),
		new VehicleType(1051281622, "Serrano 2", { ivEpisode: 2 }),
		new VehicleType(-304802106, "Buffalo", { ivEpisode: 2 }),
		new VehicleType(-1255452397, "Schafter 2", { ivEpisode: 2 }),
		new VehicleType(-1485523546, "Schafter 3", { ivEpisode: 2 }),
		new VehicleType(-1696146015, "Bullet", { ivEpisode: 2 }),
		new VehicleType(972671128, "Tampa", { ivEpisode: 2 }),
		new VehicleType(-789894171, "Cavalcade 2", { ivEpisode: 2 }),
		new VehicleType(-591610296, "F620", { ivEpisode: 2 }),
		new VehicleType(-114627507, "E-Stretch", { ivEpisode: 2 }),
		new VehicleType(1912215274, "Police Buffalo", { ivEpisode: 2 }),
		new VehicleType(908697398, "Police Wreck", { ivEpisode: 2 }),
		new VehicleType(-1973172295, "Police Stinger", { ivEpisode: 2 }),
		new VehicleType(-34623805, "Police Bike", { ivEpisode: 2 }),
		new VehicleType(301427732, "Hexer", { ivEpisode: 2 }),
		new VehicleType(55628203, "Faggio 2", { ivEpisode: 2 }),
		new VehicleType(-891462355, "Bati Custom", { ivEpisode: 2 }),
		new VehicleType(-140902153, "Vader", { ivEpisode: 2 }),
		new VehicleType(1672195559, "Akuma", { ivEpisode: 2 }),
		new VehicleType(1265391242, "Hakuchou", { ivEpisode: 2 }),
		new VehicleType(-1670998136, "Double T", { ivEpisode: 2 }),
		new VehicleType(-339587598, "Swift", { ivEpisode: 2 }),
		new VehicleType(1044954915, "Skylift", { ivEpisode: 2 }),
		new VehicleType(944930284, "Smuggler", { ivEpisode: 2 }),
		new VehicleType(-1731432653, "Floater", { ivEpisode: 2 }),
		new VehicleType(-1205801634, "Blade", { ivEpisode: 2 }),
	],
	[10]: [   // Mafia 1 (GAME_MAFIA_ONE define not available on GTAC yet)
		new VehicleType("fordtTud00.i3d", "Blue Bolt Ace Tudor"),
		new VehicleType("fordtTud01.i3d", "Dark Blue Bolt Ace Tudor"),
		new VehicleType("fordtTud02.i3d", "Brown Bolt Ace Tudor"),
		new VehicleType("fordtTud03.i3d", "Green Bolt Ace Tudor"),
		new VehicleType("fordtTud04.i3d", "Red Bolt Ace Tudor"),
		new VehicleType("fordtto00.i3d", "Blue Bolt Ace Touring"),
		new VehicleType("fordtto01.i3d", "Dark Blue Bolt Ace Touring"),
		new VehicleType("fordtto02.i3d", "Brown Bolt Ace Touring"),
		new VehicleType("fordtto03.i3d", "Green Bolt Ace Touring"),
		new VehicleType("fordtto04.i3d", "Red Bolt Ace Touring"),
		new VehicleType("fordtru00.i3d", "Blue Bolt Ace Runabout"),
		new VehicleType("fordtru01.i3d", "Dark Blue Bolt Ace Runabout"),
		new VehicleType("fordtru02.i3d", "Brown Bolt Ace Runabout"),
		new VehicleType("fordtru03.i3d", "Green Bolt Ace Runabout"),
		new VehicleType("fordtru04.i3d", "Red Bolt Ace Runabout"),
		new VehicleType("fordtpi00.i3d", "Blue Bolt Ace Pickup"),
		new VehicleType("fordtpi01.i3d", "Dark Blue Bolt Ace Pickup"),
		new VehicleType("fordtpi02.i3d", "Brown Bolt Ace Pickup"),
		new VehicleType("fordtpi03.i3d", "Green Bolt Ace Pickup"),
		new VehicleType("fordtpi04.i3d", "Red Bolt Ace Pickup"),
		new VehicleType("fordtFor00.i3d", "Blue Bolt Ace Fordor"),
		new VehicleType("fordtFor01.i3d", "Dark Blue Bolt Ace Fordor"),
		new VehicleType("fordtFor02.i3d", "Brown Bolt Ace Fordor"),
		new VehicleType("fordtFor03.i3d", "Green Bolt Ace Fordor"),
		new VehicleType("fordtFor04.i3d", "Red Bolt Ace Fordor"),
		new VehicleType("fordtco00.i3d", "Blue Bolt Ace Coupe"),
		new VehicleType("fordtco01.i3d", "Dark Blue Bolt Ace Coupe"),
		new VehicleType("fordtco02.i3d", "Brown Bolt Ace Coupe"),
		new VehicleType("fordtco03.i3d", "Green Bolt Ace Coupe"),
		new VehicleType("fordtco04.i3d", "Red Bolt Ace Coupe"),
		new VehicleType("forAtu00.i3d", "Brown Bolt Model B Tudor"),
		new VehicleType("ForAtu01.i3d", "Red Bolt Model B Tudor"),
		new VehicleType("ForAtu02.i3d", "Green Bolt Model B Tudor"),
		new VehicleType("ForAtu03.i3d", "Dark Blue Bolt Model B Tudor"),
		new VehicleType("ForAro00.i3d", "Brown Bolt Model B Roadster"),
		new VehicleType("ForAro01.i3d", "Red Bolt Model B Roadster"),
		new VehicleType("ForAro02.i3d", "Green Bolt Model B Roadster"),
		new VehicleType("ForAro03.i3d", "Dark Blue Bolt Model B Roadster"),
		new VehicleType("ForApic00.i3d", "Brown Bolt Model B Pickup"),
		new VehicleType("ForApic01.i3d", "Red Bolt Model B Pickup"),
		new VehicleType("ForApic02.i3d", "Green Bolt Model B Pickup"),
		new VehicleType("ForApic03.i3d", "Dark Blue Bolt Model B Pickup"),
		new VehicleType("ForAfo00.i3d", "Brown Bolt Model B Fordor"),
		new VehicleType("ForAfo01.i3d", "Red Bolt Model B Fordor"),
		new VehicleType("ForAfo02.i3d", "Green Bolt Model B Fordor"),
		new VehicleType("ForAfo03.i3d", "Dark Blue Bolt Model B Fordor"),
		new VehicleType("ForAde00.i3d", "Brown Bolt Model B Delivery"),
		new VehicleType("ForAde01.i3d", "Red Bolt Model B Delivery"),
		new VehicleType("ForAde02.i3d", "Green Bolt Model B Delivery"),
		new VehicleType("ForAde03.i3d", "Dark Blue Bolt Model B Delivery"),
		new VehicleType("ForAcou00.i3d", "Brown Bolt Model B Coupe"),
		new VehicleType("ForAcou01.i3d", "Red Bolt Model B Coupe"),
		new VehicleType("ForAcou02.i3d", "Green Bolt Model B Coupe"),
		new VehicleType("ForAcou03.i3d", "Dark Blue Bolt Model B Coupe"),
		new VehicleType("ForAtu00.i3d", "Brown Bolt Model B Tudor"),
		new VehicleType("ForAtu01.i3d", "Red Bolt Model B Tudor"),
		new VehicleType("ForAtu02.i3d", "Green Bolt Model B Tudor"),
		new VehicleType("ForAtu03.i3d", "Dark Blue Bolt Model B Tudor"),
		new VehicleType("forVco00.i3d", "Green Bolt V8 Coupe"),
		new VehicleType("forVco01.i3d", "Red Bolt V8 Coupe"),
		new VehicleType("forVco02.i3d", "Blue Bolt V8 Coupe"),
		new VehicleType("forVco03.i3d", "Grey Bolt V8 Coupe"),
		new VehicleType("forVfor00.i3d", "Green Bolt V8 Forder"),
		new VehicleType("forVfor01.i3d", "Red Bolt V8 Forder"),
		new VehicleType("forVfor02.i3d", "Blue Bolt V8 Forder"),
		new VehicleType("forVfor03.i3d", "Grey Bolt V8 Forder"),
		new VehicleType("forVro00.i3d", "Green Bolt V8 Roadster"),
		new VehicleType("forVro01.i3d", "Red Bolt V8 Roadster"),
		new VehicleType("forVro02.i3d", "Blue Bolt V8 Roadster"),
		new VehicleType("forVro03.i3d", "Grey Bolt V8 Roadster"),
		new VehicleType("forVto00.i3d", "Green Bolt V8 Touring"),
		new VehicleType("forVto01.i3d", "Red Bolt V8 Touring"),
		new VehicleType("forVto02.i3d", "Blue Bolt V8 Touring"),
		new VehicleType("forVto03.i3d", "Grey Bolt V8 Touring"),
		new VehicleType("forVtud00.i3d", "Green Bolt V8 Tudor"),
		new VehicleType("forVtud01.i3d", "Red Bolt V8 Tudor"),
		new VehicleType("forVtud02.i3d", "Blue Bolt V8 Tudor"),
		new VehicleType("forVtud03.i3d", "Grey Bolt V8 Tudor"),
		new VehicleType("miller00.i3d", "Brubaker"),
		new VehicleType("speedster00.i3d", "Silver Bruno Speedster 851"),
		new VehicleType("speedster01.i3d", "Red Bruno Speedster 851"),
		new VehicleType("speedster02.i3d", "Green Bruno Speedster 851"),
		new VehicleType("alfa00.i3d", "Caesar 8C 2300 Racing"),
		new VehicleType("alfa8C00.i3d", "Red Caesar 8C Mostro"),
		new VehicleType("alfa8C01.i3d", "Black Caesar 8C Mostro"),
		new VehicleType("merced500K00.i3d", "White Celeste Marque 500"),
		new VehicleType("merced500K01.i3d", "Brown Celeste Marque 500"),
		new VehicleType("bugatti00.i3d", "Blue Corrozella C-Otto"),
		new VehicleType("bugatti01.i3d", "Green Corrozella C-Otto"),
		new VehicleType("pontFor00.i3d", "Blue Crusader Chromium Tudor"),
		new VehicleType("pontFor01.i3d", "Violet Crusader Chromium Tudor"),
		new VehicleType("pontTud00.i3d", "Green Crusader Chromium Tudor"),
		new VehicleType("pontTud01.i3d", "Dark Blue Crusader Chromium Tudor"),
		new VehicleType("blackha00.i3d", "Blue Falconer"),
		new VehicleType("blackha01.i3d", "Red Falconer"),
		new VehicleType("black00.i3d", "Gangster Falconer"),
		new VehicleType("taxi00.i3d", "Falconer Yellowcar"),
		new VehicleType("hudcou00.i3d", "Umber Guardian Terraplane Coupe"),
		new VehicleType("hudcou01.i3d", "Beige Guardian Terraplane Coupe"),
		new VehicleType("hudcou02.i3d", "Black Guardian Terraplane Coupe"),
		new VehicleType("hudfor00.i3d", "Umber Guardian Terraplane Fordor"),
		new VehicleType("hudfor01.i3d", "Beige Guardian Terraplane Fordor"),
		new VehicleType("hudfor02.i3d", "Black Guardian Terraplane Fordor"),
		new VehicleType("hudtu00.i3d", "Umber Guardian Terraplane Tudor"),
		new VehicleType("hudtu01.i3d", "Beige Guardian Terraplane Tudor"),
		new VehicleType("hudtu02.i3d", "Black Guardian Terraplane Tudor"),
		new VehicleType("cad_ford00.i3d", "Lassiter Fordor"),
		new VehicleType("cad_phaeton00.i3d", "Lassiter Phaeton"),
		new VehicleType("cad_road00.i3d", "Lassiter Roadster"),
		new VehicleType("hartmann00.i3d", "Lassiter Appolyon"),
		new VehicleType("hearseCa00.i3d", "Lassiter Charon"),
		new VehicleType("polCad00.i3d", "Lassiter Police"),
		new VehicleType("chemaFor00.i3d", "Green Shubert Extra Six Fordor"),
		new VehicleType("chemaFor01.i3d", "White Shubert Extra Six Fordor"),
		new VehicleType("chemaFor02.i3d", "Blue Shubert Extra Six Fordor"),
		new VehicleType("polimFor00.i3d", "Shubert Extra Six Fordor Police"),
		new VehicleType("chematud00.i3d", "Green Shubert Extra Six Tudor"),
		new VehicleType("chematud01.i3d", "White Shubert Extra Six Tudor"),
		new VehicleType("chematud02.i3d", "Blue Shubert Extra Six Tudor"),
		new VehicleType("polimTud00.i3d", "Shubert Extra Six Tudor Police"),
		new VehicleType("chev00.i3d", "Red Shubert Six"),
		new VehicleType("chev01.i3d", "White Shubert Six"),
		new VehicleType("chev02.i3d", "Black Shubert Six"),
		new VehicleType("poli00.i3d", "Shubert Six Police"),
		new VehicleType("arrow00.i3d", "Silver Fletcher"),
		new VehicleType("cordca00.i3d", "Orange Thor 812 Cabriolet"),
		new VehicleType("cordca01.i3d", "Black Thor 812 Cabriolet"),
		new VehicleType("cordph00.i3d", "Orange Thor 810 Phaeton"),
		new VehicleType("cordph01.i3d", "Black Thor 810 Phaeton"),
		new VehicleType("cordse00.i3d", "Orange Thor 810 Sedan"),
		new VehicleType("cordse01.i3d", "Black Thor 810 Sedan"),
		new VehicleType("deuseJco00.i3d", "Trautenberg Model J"),
		new VehicleType("duesenberg00.i3d", "Trautenberg Racer 4WD"),
		new VehicleType("airflFor00.i3d", "Yellow Ulver Airstream Fordor"),
		new VehicleType("airflFor01.i3d", "Green Ulver Airstream Fordor"),
		new VehicleType("airfltud00.i3d", "Yellow Ulver Airstream Tudor"),
		new VehicleType("airfltud01.i3d", "Green Ulver Airstream Tudor"),
		new VehicleType("buiCou00.i3d", "Blue Wright Coupe"),
		new VehicleType("buiCou01.i3d", "Red Wright Coupe"),
		new VehicleType("buiCou02.i3d", "Green Wright Coupe"),
		new VehicleType("buigang00.i3d", "Gangster Wright Coupe"),
		new VehicleType("buikFor00.i3d", "Blue Wright Fordor"),
		new VehicleType("buikFor01.i3d", "Red Wright Fordor"),
		new VehicleType("buikFor02.i3d", "Green Wright Fordor"),
		new VehicleType("Ambulance00.i3d", "Bolt Ambulance"),
		new VehicleType("fire00.i3d", "Bolt Firetruck"),
		new VehicleType("hearseA00.i3d", "Bolt Hearse"),
		new VehicleType("truckA00.i3d", "Bolt Truck Flatbed"),
		new VehicleType("truckB00.i3d", "Bolt Truck Covered"),
		new VehicleType("TruckBxx00.i3d", "Bolt Truck (Atlantic Import)"),
		new VehicleType("truckBx00.i3d", "Bolt Truck (Atlantic Export)"),
		new VehicleType("bus00.i3d", "Bus"),
		new VehicleType("phantom00.i3d", "Manta Prototype"),
		new VehicleType("traktor.i3d", "Tractor"),
		new VehicleType("Bull00.i3d", "Bulldozer"),
		//new VehicleType("valec.i3d", "Steamroller"),
		new VehicleType("traktor.i3d", "Tractor"),
	]
}

let skins = {
	/** @type {Array.<SkinType>} */
	[GAME_GTA_III]: [
		new SkinType(0, "Claude"),
		new SkinType(1, "Police Officer"),
		new SkinType(2, "SWAT Officer"),
		new SkinType(3, "FBI Agent"),
		new SkinType(4, "Army Soldier"),
		new SkinType(5, "Paramedic"),
		new SkinType(6, "Firefighter"),
		new SkinType(7, "Wise Guy"),
		new SkinType(8, "Taxi Driver"),
		new SkinType(9, "Pimp"),
		new SkinType(10, "Mafia Member 1"),
		new SkinType(11, "Mafia Member 2"),
		new SkinType(12, "Triad Member 1"),
		new SkinType(13, "Triad Member 2"),
		new SkinType(14, "Diablo Member 1"),
		new SkinType(15, "Diablo Member 2"),
		new SkinType(16, "Yakuza Member 1"),
		new SkinType(17, "Yakuza Member 2"),
		new SkinType(18, "Yardie Member 1"),
		new SkinType(19, "Yardie Member 2"),
		new SkinType(20, "Cartel Soldier 1"),
		new SkinType(21, "Cartel Soldier 2"),
		new SkinType(22, "Red Jacks Thug"),
		new SkinType(23, "Purple Nines Thug"),
		new SkinType(24, "Street Criminal 1"),
		new SkinType(25, "Street Criminal 2"),
		new SkinType(30, "Male Client"),
		new SkinType(31, "Random Guy"),
		new SkinType(32, "Vacationist"),
		new SkinType(33, "DJ"),
		new SkinType(34, "Young Woman"),
		new SkinType(35, "Young Woman"),
		new SkinType(36, "Business Woman"),
		new SkinType(37, "Elder Woman 1"),
		new SkinType(38, "Elder Woman 2"),
		new SkinType(39, "Prostitute 1"),
		new SkinType(40, "Prostitute 2"),
		new SkinType(41, "Random Guy"),
		new SkinType(42, "Diseased Man"),
		new SkinType(43, "Diseased Woman"),
		new SkinType(44, "Young Woman"),
		new SkinType(45, "Old Man 1"),
		new SkinType(46, "Random Guy"),
		new SkinType(47, "Old Woman 1"),
		new SkinType(48, "Old Woman 2"),
		new SkinType(49, "Old Man 2"),
		new SkinType(50, "Random Guy"),
		new SkinType(51, "Old Woman 3"),
		new SkinType(52, "Young Woman"),
		new SkinType(53, "Docks Worker 1"),
		new SkinType(54, "Docks Worker 2"),
		new SkinType(55, "Male Street Bum"),
		new SkinType(56, "Female Street Bum"),
		new SkinType(57, "Delivery Guy 1"),
		new SkinType(58, "Delivery Guy 2"),
		new SkinType(59, "Business Man"),
		new SkinType(60, "Marty Chonks"),
		new SkinType(61, "CIA Agent"),
		new SkinType(62, "Female Client"),
		new SkinType(63, "Young Woman"),
		new SkinType(64, "Business Woman"),
		new SkinType(65, "Business Man"),
		new SkinType(66, "Female Client"),
		new SkinType(67, "Male Steward"),
		new SkinType(68, "Female Steward"),
		new SkinType(69, "Male Cocks Fan 1"),
		new SkinType(70, "Male Cocks Fan 2"),
		new SkinType(71, "Female Cocks Fan"),
		new SkinType(72, "Male Paramedics Assistant"),
		new SkinType(73, "Female Paramedics Assistant"),
		new SkinType(74, "Construction Worker 1"),
		new SkinType(75, "Construction Worker 2"),
		new SkinType(76, "Zip Customer"),
		new SkinType(77, "Party Woman 1"),
		new SkinType(78, "Party Woman 2"),
		new SkinType(80, "Female College Student"),
		new SkinType(81, "Old Man"),
		new SkinType(82, "Female Jogger"),
		new SkinType(83, "Asuka Kasen"),
		new SkinType(84, "Spank Suicide Bomber"),
		new SkinType(85, "Salvatore's Butler"),
		new SkinType(86, "Catalina"),
		new SkinType(87, "Lee Chong"),
		new SkinType(88, "Colombian Cartel Member 1"),
		new SkinType(89, "Colombian Cartel Member 2"),
		new SkinType(90, "Colombian Cartel Member 3"),
		new SkinType(91, "Colombian Cartel Member 4"),
		new SkinType(92, "Police Officer"),
		new SkinType(93, "Curly Bob"),
		new SkinType(94, "Phil Cassidy"),
		new SkinType(95, "Detective"),
		new SkinType(96, "8-Ball 1"),
		new SkinType(97, "8-Ball 2"),
		new SkinType(98, "Salvatore Leone"),
		new SkinType(99, "Mafia Member"),
		new SkinType(100, "Joey Leone 1"),
		new SkinType(101, "Joey Leone 2"),
		new SkinType(102, "Bar Owner"),
		new SkinType(103, "Kenji Kasen"),
		new SkinType(104, "Mike Forelli"),
		new SkinType(105, "Donald Love 1"),
		new SkinType(106, "Donald Love 2"),
		new SkinType(107, "Luigi Goterelli"),
		new SkinType(108, "Maria Latore"),
		new SkinType(109, "Mickey Hamfists"),
		new SkinType(110, "Miguel"),
		new SkinType(111, "Misty"),
		new SkinType(112, "Old Oriental Gentleman 1"),
		new SkinType(113, "Old Oriental Gentleman 2"),
		new SkinType(114, "Old Oriental Gentleman 3"),
		new SkinType(115, "Ray Machowski"),
		new SkinType(116, "Mafia Member"),
		new SkinType(117, "Ammunation Clerk"),
		new SkinType(118, "Tanner"),
		new SkinType(119, "Toni Cipriani"),
		new SkinType(120, "Darkel"),
		new SkinType(121, "Chuff Security Officer"),
		new SkinType(122, "Claude Speed (Prison)"),
		new SkinType(123, "Busker 1"),
		new SkinType(124, "Busker 2"),
		new SkinType(125, "Busker 3"),
		new SkinType(125, "Busker 4"),
	],

	/** @type {Array.<SkinType>} */
	[GAME_GTA_VC]: [
		new SkinType(0, "Tommy Vercetti"),
		new SkinType(1, "Police Officer"),
		new SkinType(2, "SWAT Officer"),
		new SkinType(3, "FBI Agent"),
		new SkinType(4, "Army Soldier"),
		new SkinType(5, "Paramedic"),
		new SkinType(6, "Firefighter"),
		new SkinType(7, "Golfer"),
		new SkinType(9, "Random Lady 1"),
		new SkinType(10, "Bum 1"),
		new SkinType(11, "Greaser"),
		new SkinType(12, "Random Guy 1"),
		new SkinType(13, "Random Guy 2"),
		new SkinType(14, "Random Lady"),
		new SkinType(15, "Random Guy 3"),
		new SkinType(16, "Random Guy 4"),
		new SkinType(17, "Beach Lady 1"),
		new SkinType(18, "Fat Beach Lady"),
		new SkinType(19, "Beach Guy 1"),
		new SkinType(20, "Fat Beach Guy"),
		new SkinType(21, "Random Lady 2"),
		new SkinType(22, "Random Lady 3"),
		new SkinType(23, "Random Lady 4"),
		new SkinType(24, "Prostitute 1"),
		new SkinType(25, "Bum 2"),
		new SkinType(26, "Bum 3"),
		new SkinType(27, "Random Guy"),
		new SkinType(28, "Taxi Driver 1"),
		new SkinType(29, "Haitian"),
		new SkinType(30, "Criminal"),
		new SkinType(31, "Random Lady 5"),
		new SkinType(32, "Random Lady 6"),
		new SkinType(33, "Random Guy 5"),
		new SkinType(34, "Random Guy 6"),
		new SkinType(35, "Random Lady 7"),
		new SkinType(36, "Random Lady 8"),
		new SkinType(37, "Random Guy 7"),
		new SkinType(38, "Beach Lady 2"),
		new SkinType(39, "Beach Guy 2"),
		new SkinType(40, "Beach Lady 3"),
		new SkinType(41, "Beach Guy 3"),
		new SkinType(42, "Random Guy 8"),
		new SkinType(43, "Prostitute 2"),
		new SkinType(44, "Bum 4"),
		new SkinType(45, "Bum 5"),
		new SkinType(46, "Random Guy 9"),
		new SkinType(47, "Random Guy 9"),
		new SkinType(48, "Punk 1"),
		new SkinType(49, "Prostitute 3"),
		new SkinType(50, "Random Old Lady"),
		new SkinType(51, "Punk 2"),
		new SkinType(52, "Random Guy 10"),
		new SkinType(53, "Random Lady 9"),
		new SkinType(54, "Random Lady 10"),
		new SkinType(55, "Random Guy 11"),
		new SkinType(56, "Random Guy 12"),
		new SkinType(57, "Beach Lady"),
		new SkinType(58, "Beach Guy 13"),
		new SkinType(59, "Beach Lady"),
		new SkinType(60, "Beach Guy 14"),
		new SkinType(61, "Construction Worker"),
		new SkinType(62, "Golfer 1"),
		new SkinType(63, "Golfer 2"),
		new SkinType(64, "Golfer 3"),
		new SkinType(65, "Beach Lady 4"),
		new SkinType(66, "Beach Guy 4"),
		new SkinType(67, "Random Lady 11"),
		new SkinType(68, "Random Guy 15"),
		new SkinType(69, "Random Guy 16"),
		new SkinType(70, "Prostitute 4"),
		new SkinType(71, "Bum Lady"),
		new SkinType(72, "Random Guy 17"),
		new SkinType(73, "Random Guy 18"),
		new SkinType(74, "Taxi Driver 2"),
		new SkinType(75, "Random Woman"),
		new SkinType(76, "Skater Guy 1"),
		new SkinType(77, "Beach Lady 5"),
		new SkinType(78, "Skater Guy 2"),
		new SkinType(79, "Young Woman Shopper"),
		new SkinType(80, "Old Women Shopper"),
		new SkinType(81, "Tourist 1"),
		new SkinType(82, "Tourist 2"),
		new SkinType(83, "Cuban 1"),
		new SkinType(84, "Cuban 2"),
		new SkinType(85, "Haitian 1"),
		new SkinType(86, "Haitian 2"),
		new SkinType(87, "Shark 1"),
		new SkinType(88, "Shark 2"),
		new SkinType(89, "Diaz Guy 1"),
		new SkinType(90, "Diaz Guy 2"),
		new SkinType(91, "Security Guard 1"),
		new SkinType(92, "Security Guard 2"),
		new SkinType(93, "Biker 1"),
		new SkinType(94, "Biker 2"),
		new SkinType(95, "Vercetti Guy 1"),
		new SkinType(96, "Vercetti Guy 2"),
		new SkinType(97, "Undercover Cop 1"),
		new SkinType(98, "Undercover Cop 2"),
		new SkinType(99, "Undercover Cop 3"),
		new SkinType(100, "Undercover Cop 4"),
		new SkinType(101, "Undercover Cop 5"),
		new SkinType(102, "Undercover Cop 6"),
		new SkinType(103, "Random Guy"),
		new SkinType(104, "Bodyguard"),
		new SkinType(105, "Prostitute 1"),
		new SkinType(106, "Prostitute 2"),
		new SkinType(107, "Ricardo Diaz"),
		new SkinType(108, "Love Fist 1"),
		new SkinType(109, "Ken Rosenburg"),
		new SkinType(110, "Candy Suxx"),
		new SkinType(111, "Hilary"),
		new SkinType(112, "Love Fist 2"),
		new SkinType(113, "Phil"),
		new SkinType(114, "Rockstar Guy"),
		new SkinType(115, "Sonny"),
		new SkinType(116, "Lance"),
		new SkinType(117, "Mercedes"),
		new SkinType(118, "Love Fist 3"),
		new SkinType(119, "Alex Scrub"),
		new SkinType(120, "Officer Lance Vance"),
		new SkinType(121, "Lance Vance"),
		new SkinType(122, "Cortez"),
		new SkinType(123, "SWAT 2"),
		new SkinType(124, "Columbian"),
		new SkinType(125, "Hilary"),
		new SkinType(126, "Mercedes"),
		new SkinType(127, "Cam 1"),
		new SkinType(128, "Cam 2"),
		new SkinType(129, "Phil 1"),
		new SkinType(130, "Phil 2"),
		new SkinType(131, "Bodyguard"),
		new SkinType(132, "Pizza Worker"),
		new SkinType(133, "Taxi Driver 3"),
		new SkinType(134, "Taxi Driver 4"),
		new SkinType(135, "Sailor 1"),
		new SkinType(136, "Sailor 2"),
		new SkinType(137, "Sailor 3"),
		new SkinType(138, "Chef"),
		new SkinType(139, "Criminal"),
		//new SkinType(140, "French Guy"                        , true ),
		//new SkinType(141, "Worker"                            , true ),
		new SkinType(142, "Haitian"),
		new SkinType(143, "Waitress"),
		new SkinType(144, "Forelli Member 1"),
		new SkinType(145, "Forelli Member 2"),
		new SkinType(146, "Forelli Member 3"),
		new SkinType(147, "Columbian"),
		new SkinType(148, "Random Guy 19"),
		new SkinType(149, "Beach Guy"),
		new SkinType(150, "Random Guy 20"),
		new SkinType(151, "Random Guy 21"),
		new SkinType(152, "Random Guy 22"),
		new SkinType(153, "Drag Queen"),
		new SkinType(154, "Diaz Traitor"),
		new SkinType(155, "Random Guy 23"),
		new SkinType(156, "Random Guy 24"),
		new SkinType(157, "Stripper 1"),
		new SkinType(158, "Stripper 2"),
		new SkinType(159, "Stripper 3"),
		new SkinType(160, "Store Clerk"),
		new SkinType(161, "Tommy Vercetti"),
		new SkinType(162, "Tommy Vercetti (Business Suit)"),
		new SkinType(163, "Tommy Vercetti (SpandEx Overalls)"),
		new SkinType(164, "Tommy Vercetti (Golfer)"),
		new SkinType(165, "Tommy Vercetti (Cuban)"),
		new SkinType(166, "Tommy Vercetti (Cop)"),
		new SkinType(167, "Tommy Vercetti (Robbery Suit)"),
		new SkinType(168, "Tommy Vercetti (T-Shirt and Jeans)"),
		new SkinType(169, "Tommy Vercetti (Striped Suit)"),
		new SkinType(170, "Tommy Vercetti (Black Tracksuit)"),
		new SkinType(171, "Tommy Vercetti (Red Tracksuit)"),
		new SkinType(172, "Club Bouncer 1"),
		new SkinType(173, "Club Bouncer 2"),
		new SkinType(174, "Stripclub Dancer 1"),
		new SkinType(175, "Random Guy 25"),
		new SkinType(176, "Stripclub Dancer 2"),
		new SkinType(177, "Stripclub Dancer 3"),
		new SkinType(178, "Stripclub Dancer 4"),
		new SkinType(179, "Gang Member 1"),
		new SkinType(180, "Tommy Vercetti (Endgame T-Shirt)"),
		new SkinType(181, "Forelli Thug 1"),
		new SkinType(182, "Forelli Thug 2"),
		new SkinType(183, "Random Lady 12"),
		new SkinType(184, "Gang Member 2"),
		new SkinType(185, "Party Waitress"),
		new SkinType(186, "Kent Paul"),
		new SkinType(187, "Big Head Taxi Driver"),
	],

	/** @type {Array.<SkinType>} */
	[GAME_GTA_SA]: [
		new SkinType(0, "Carl 'CJ' Johnson"),
		new SkinType(1, "The Truth"),
		new SkinType(2, "Maccer"),
		new SkinType(6, "Taxi Driver/Train Driver"),
		new SkinType(9, "Normal Ped"),
		new SkinType(10, "Old Woman"),
		new SkinType(11, "Casino Croupier"),
		new SkinType(12, "Rich Woman"),
		new SkinType(13, "Street Girl"),
		new SkinType(14, "Normal Ped"),
		new SkinType(15, "Mr.Whittaker (RS Haul Owner)"),
		new SkinType(16, "Airport Ground Worker"),
		new SkinType(17, "Businessman"),
		new SkinType(18, "Beach Visitor"),
		new SkinType(19, "DJ"),
		new SkinType(20, "Rich Guy (Madd Doggs Manager)"),
		new SkinType(21, "Normal Ped"),
		new SkinType(22, "Normal Ped"),
		new SkinType(23, "Bmxer"),
		new SkinType(24, "Madd Dogg Bodyguard"),
		new SkinType(25, "Madd Dogg Bodyguard"),
		new SkinType(26, "Backpacker"),
		new SkinType(27, "Construction Worker"),
		new SkinType(28, "Drug Dealer"),
		new SkinType(29, "Drug Dealer"),
		new SkinType(30, "Drug Dealer"),
		new SkinType(31, "Farm-Town Inhabitant"),
		new SkinType(32, "Farm-Town Inhabitant"),
		new SkinType(33, "Farm-Town Inhabitant"),
		new SkinType(34, "Farm-Town Inhabitant"),
		new SkinType(35, "Gardener"),
		new SkinType(36, "Golfer"),
		new SkinType(37, "Golfer"),
		new SkinType(38, "Normal Ped"),
		new SkinType(39, "Normal Ped"),
		new SkinType(40, "Normal Ped"),
		new SkinType(41, "Normal Ped"),
		new SkinType(43, "Normal Ped"),
		new SkinType(44, "Normal Ped"),
		new SkinType(45, "Beach Visitor"),
		new SkinType(46, "Normal Ped"),
		new SkinType(47, "Normal Ped"),
		new SkinType(48, "Normal Ped"),
		new SkinType(49, "Snakehead (Da Nang)"),
		new SkinType(50, "Mechanic"),
		new SkinType(51, "Mountain Biker"),
		new SkinType(52, "Mountain Biker"),
		new SkinType(53, "Unknown"),
		new SkinType(54, "Normal Ped"),
		new SkinType(55, "Normal Ped"),
		new SkinType(56, "Normal Ped"),
		new SkinType(57, "Oriental Ped"),
		new SkinType(58, "Oriental Ped"),
		new SkinType(59, "Normal Ped"),
		new SkinType(60, "Normal Ped"),
		new SkinType(61, "Pilot"),
		new SkinType(62, "Colonel Fuhrberger"),
		new SkinType(63, "Prostitute"),
		new SkinType(64, "Prostitute"),
		new SkinType(66, "Pool Player"),
		new SkinType(67, "Pool Player"),
		new SkinType(68, "Priest/Preacher"),
		new SkinType(69, "Normal Ped"),
		new SkinType(70, "Scientist"),
		new SkinType(71, "Security Guard"),
		new SkinType(72, "Hippy"),
		new SkinType(73, "Hippy"),
		new SkinType(75, "Prostitute"),
		new SkinType(76, "Stewardess"),
		new SkinType(77, "Homeless"),
		new SkinType(78, "Homeless"),
		new SkinType(79, "Homeless"),
		new SkinType(80, "Boxer"),
		new SkinType(81, "Boxer"),
		new SkinType(82, "Black Elvis"),
		new SkinType(83, "White Elvis"),
		new SkinType(84, "Blue Elvis"),
		new SkinType(85, "Prostitute"),
		new SkinType(87, "Stripper"),
		new SkinType(88, "Normal Ped"),
		new SkinType(89, "Normal Ped"),
		new SkinType(90, "Jogger"),
		new SkinType(91, "Rich Woman"),
		new SkinType(92, "Rollerskater"),
		new SkinType(93, "Normal Ped"),
		new SkinType(94, "Normal Ped"),
		new SkinType(95, "Normal Ped"),
		new SkinType(96, "Jogger"),
		new SkinType(97, "Lifeguard"),
		new SkinType(98, "Normal Ped"),
		new SkinType(99, "Rollerskater"),
		new SkinType(100, "Biker"),
		new SkinType(101, "Normal Ped"),
		new SkinType(102, "Ballas Gang Member"),
		new SkinType(103, "Ballas Gang Member"),
		new SkinType(104, "Ballas Gang Member"),
		new SkinType(105, "Grove Street Families Gang Member"),
		new SkinType(106, "Grove Street Families Gang Member"),
		new SkinType(107, "Grove Street Families Gang Member"),
		new SkinType(108, "Los Santos Vagos Gang Member"),
		new SkinType(109, "Los Santos Vagos Gang Member"),
		new SkinType(110, "Los Santos Vagos Gang Member"),
		new SkinType(111, "Russian Mafioso"),
		new SkinType(112, "Russian Mafioso"),
		new SkinType(113, "Russian Mafioso"),
		new SkinType(114, "Varios Los Aztecas Gang Member"),
		new SkinType(115, "Varios Los Aztecas Gang Member"),
		new SkinType(116, "Varios Los Aztecas Gang Member"),
		new SkinType(117, "Triad"),
		new SkinType(118, "Triad"),
		new SkinType(120, "Triad Boss"),
		new SkinType(121, "Da Nang Boy"),
		new SkinType(122, "Da Nang Boy"),
		new SkinType(123, "Da Nang Boy"),
		new SkinType(124, "Italian Mafioso"),
		new SkinType(125, "Italian Mafioso"),
		new SkinType(126, "Italian Mafioso"),
		new SkinType(127, "Italian Mafioso"),
		new SkinType(128, "Farm Inhabitant"),
		new SkinType(129, "Farm Inhabitant"),
		new SkinType(130, "Farm Inhabitant"),
		new SkinType(131, "Farm Inhabitant"),
		new SkinType(132, "Farm Inhabitant"),
		new SkinType(133, "Farm Inhabitant"),
		new SkinType(134, "Homeless"),
		new SkinType(135, "Homeless"),
		new SkinType(136, "Normal Ped"),
		new SkinType(137, "Homeless"),
		new SkinType(138, "Beach Visitor"),
		new SkinType(139, "Beach Visitor"),
		new SkinType(140, "Beach Visitor"),
		new SkinType(141, "Businesswoman"),
		new SkinType(142, "Taxi Driver"),
		new SkinType(143, "Crack Maker"),
		new SkinType(144, "Crack Maker"),
		new SkinType(145, "Crack Maker"),
		new SkinType(146, "Crack Maker"),
		new SkinType(147, "Businessman"),
		new SkinType(148, "Businesswoman"),
		new SkinType(150, "Businesswoman"),
		new SkinType(151, "Normal Ped"),
		new SkinType(152, "Prostitute"),
		new SkinType(153, "Construction Worker"),
		new SkinType(154, "Beach Visitor"),
		new SkinType(155, "Well Stacked Pizza Worker"),
		new SkinType(156, "Barber"),
		new SkinType(157, "Hillbilly"),
		new SkinType(158, "Farmer"),
		new SkinType(159, "Hillbilly"),
		new SkinType(160, "Hillbilly"),
		new SkinType(161, "Farmer"),
		new SkinType(162, "Hillbilly"),
		new SkinType(163, "Black Bouncer"),
		new SkinType(164, "White Bouncer"),
		new SkinType(165, "White MIB Agent"),
		new SkinType(166, "Black MIB Agent"),
		new SkinType(167, "Cluckin Bell Worker"),
		new SkinType(168, "Hotdog/Chilli Dog Vendor"),
		new SkinType(169, "Normal Ped"),
		new SkinType(170, "Normal Ped"),
		new SkinType(171, "Blackjack Dealer"),
		new SkinType(172, "Casino Croupier"),
		new SkinType(173, "San Fierro Rifa"),
		new SkinType(174, "San Fierro Rifa"),
		new SkinType(175, "San Fierro Rifa"),
		new SkinType(176, "Barber"),
		new SkinType(177, "Barber"),
		new SkinType(178, "Whore"),
		new SkinType(179, "Ammunation Salesman"),
		new SkinType(180, "Tattoo Artist"),
		new SkinType(181, "Punk"),
		new SkinType(182, "Cab Driver"),
		new SkinType(183, "Normal Ped"),
		new SkinType(184, "Normal Ped"),
		new SkinType(185, "Normal Ped"),
		new SkinType(186, "Normal Ped"),
		new SkinType(187, "Businessman"),
		new SkinType(188, "Normal Ped"),
		new SkinType(189, "Valet"),
		new SkinType(190, "Barbara Schternvart"),
		new SkinType(191, "Helena Wankstein"),
		new SkinType(192, "Michelle Cannes"),
		new SkinType(193, "Katie Zhan"),
		new SkinType(194, "Millie Perkins"),
		new SkinType(195, "Denise Robinson"),
		new SkinType(196, "Farm-Town Inhabitant"),
		new SkinType(197, "Hillbilly"),
		new SkinType(198, "Farm-Town Inhabitant"),
		new SkinType(199, "Farm-Town Inhabitant"),
		new SkinType(200, "Hillbilly"),
		new SkinType(201, "Farmer"),
		new SkinType(202, "Farmer"),
		new SkinType(203, "Karate Teacher"),
		new SkinType(204, "Karate Teacher"),
		new SkinType(205, "Burger Shot Cashier"),
		new SkinType(206, "Cab Driver"),
		new SkinType(207, "Prostitute"),
		new SkinType(209, "Oriental Noodle Stand Vendor"),
		new SkinType(210, "Oriental Boating School Instructor"),
		new SkinType(211, "Clothes Shop Staff"),
		new SkinType(212, "Homeless"),
		new SkinType(213, "Weird Old Man"),
		new SkinType(214, "Waitress (Maria Latore)"),
		new SkinType(215, "Normal Ped"),
		new SkinType(216, "Normal Ped"),
		new SkinType(217, "Clothes Shop Staff"),
		new SkinType(218, "Normal Ped"),
		new SkinType(219, "Rich Woman"),
		new SkinType(220, "Cab Driver"),
		new SkinType(221, "Normal Ped"),
		new SkinType(222, "Normal Ped"),
		new SkinType(223, "Normal Ped"),
		new SkinType(224, "Normal Ped"),
		new SkinType(225, "Normal Ped"),
		new SkinType(226, "Normal Ped"),
		new SkinType(227, "Oriental Businessman"),
		new SkinType(228, "Oriental Ped"),
		new SkinType(229, "Oriental Ped"),
		new SkinType(230, "Homeless"),
		new SkinType(231, "Normal Ped"),
		new SkinType(232, "Normal Ped"),
		new SkinType(233, "Normal Ped"),
		new SkinType(234, "Cab Driver"),
		new SkinType(235, "Normal Ped"),
		new SkinType(236, "Normal Ped"),
		new SkinType(237, "Prostitute"),
		new SkinType(238, "Prostitute"),
		new SkinType(239, "Homeless"),
		new SkinType(240, "The D.A"),
		new SkinType(241, "Afro-American"),
		new SkinType(242, "Mexican"),
		new SkinType(243, "Prostitute"),
		new SkinType(244, "Stripper"),
		new SkinType(245, "Prostitute"),
		new SkinType(246, "Stripper"),
		new SkinType(247, "Biker"),
		new SkinType(248, "Biker"),
		new SkinType(249, "Pimp"),
		new SkinType(250, "Normal Ped"),
		new SkinType(251, "Lifeguard"),
		new SkinType(252, "Naked Valet"),
		new SkinType(253, "Bus Driver"),
		new SkinType(254, "Biker Drug Dealer"),
		new SkinType(255, "Chauffeur (Limo Driver)"),
		new SkinType(256, "Stripper"),
		new SkinType(257, "Stripper"),
		new SkinType(258, "Heckler"),
		new SkinType(259, "Heckler"),
		new SkinType(260, "Construction Worker"),
		new SkinType(261, "Cab Driver"),
		new SkinType(262, "Cab Driver"),
		new SkinType(263, "Normal Ped"),
		new SkinType(264, "Clown (Ice-Cream Van Driver)"),
		new SkinType(265, "Officer Frank Tenpenny"),
		new SkinType(266, "Officer Eddie Pulaski"),
		new SkinType(267, "Officer Jimmy Hernandez"),
		new SkinType(268, "Dwaine/Dwayne"),
		new SkinType(269, "Melvin 'Big Smoke' Harris (Mission)"),
		new SkinType(270, "Sean 'Sweet' Johnson"),
		new SkinType(271, "Lance Ryder Wilson"),
		new SkinType(272, "Mafia Boss"),
		new SkinType(274, "Paramedic 1"),
		new SkinType(275, "Paramedic 2"),
		new SkinType(276, "Paramedic 3"),
		new SkinType(277, "Firefighter 1"),
		new SkinType(278, "Firefighter 2"),
		new SkinType(279, "Firefighter 3"),
		new SkinType(280, "Los Santos Police Officer"),
		new SkinType(281, "San Fierro Police Officer"),
		new SkinType(282, "Las Venturas Police Officer"),
		new SkinType(283, "County Sheriff"),
		new SkinType(284, "Motorbike Cop"),
		new SkinType(285, "S.W.A.T."),
		new SkinType(286, "Federal Agent"),
		new SkinType(287, "Army Soldier"),
		new SkinType(288, "Desert Sheriff"),
		new SkinType(290, "Ken Rosenberg"),
		new SkinType(291, "Kent Paul"),
		new SkinType(292, "Cesar Vialpando"),
		new SkinType(293, "Jeffery 'Og Loc' Martin/Cross"),
		new SkinType(294, "Wu Zi Mu (Woozie)"),
		new SkinType(295, "Michael Toreno"),
		new SkinType(296, "Jizzy B."),
		new SkinType(297, "Madd Dogg"),
		new SkinType(298, "Catalina"),
		new SkinType(299, "Claude Speed"),
		new SkinType(300, "Lance 'Ryder' Wilson"),
		new SkinType(301, "Lance 'Ryder' Wilson (robbery mask)"),
		new SkinType(302, "Emmet"),
		new SkinType(303, "Unknown"),
		new SkinType(304, "Denise"),
		new SkinType(305, "Jethro"),
		new SkinType(306, "Zero"),
		new SkinType(307, "T-Bone Mendez"),
		new SkinType(308, "Forelli"),
		new SkinType(309, "Mechanic"),
		new SkinType(310, "Barry 'Big Bear' Thorne (Skinny)"),
		new SkinType(311, "Melvin 'Big Smoke' Harris (Vest)"),
		new SkinType(312, "Army Guy"),
		new SkinType(313, "Barry 'Big Bear' Thorne (Fat)"),
	],

	/** @type {Array.<SkinType>} */
	[GAME_GTA_IV]: [
		new SkinType(-2020305438, "Male Multiplayer"),
		new SkinType(-641875910, "Female Multiplayer"),
		new SkinType(-1370810922, "MODEL_SUPERLOD"),
		new SkinType(1853617247, "Anna"),
		new SkinType(-1646893330, "Anthony"),
		new SkinType(1495769888, "Badman"),
		new SkinType(1500493064, "Bernie Crane"),
		new SkinType(1731510984, "Bledar"),
		new SkinType(422305098, "Brian"),
		new SkinType(-1729980128, "Brucie"),
		new SkinType(237511807, "Bulgarin"),
		new SkinType(88667657, "Charise"),
		new SkinType(-1328445565, "Charlie Undercover"),
		new SkinType(1343144208, "Clarence"),
		new SkinType(1468450703, "Dardan"),
		new SkinType(386513184, "Darko"),
		new SkinType(1169442297, "Derric"),
		new SkinType(237497537, "Dmitri"),
		new SkinType(-617264103, "Dwayne"),
		new SkinType(-1600585231, "Eddie"),
		new SkinType(57218969, "Faustin"),
		new SkinType(1710545037, "Francis"),
		new SkinType(1424670436, "French Tom"),
		new SkinType(2129490787, "Gordon"),
		new SkinType(-357652594, "Gracie"),
		new SkinType(980768434, "Hossan"),
		new SkinType(-835225126, "Ilyena"),
		new SkinType(-479595866, "Issac"),
		new SkinType(1166762483, "Ivan"),
		new SkinType(364686627, "Jay"),
		new SkinType(170756246, "Jason"),
		new SkinType(390357829, "Jeff"),
		new SkinType(-366421228, "Jimmy"),
		new SkinType(-911507684, "Johnny Klebitz"),
		new SkinType(-773750838, "Kate"),
		new SkinType(995576506, "Kenny"),
		new SkinType(1487004273, "Lil Jacob"),
		new SkinType(-1275031987, "Lil Jacob 2,"),
		new SkinType(-681942840, "Luca"),
		new SkinType(-492470690, "Luis"),
		new SkinType(-1040287406, "Mallorie"),
		new SkinType(-322700377, "Mam"),
		new SkinType(1445589009, "Manny"),
		new SkinType(411185872, "Marnie"),
		new SkinType(-807339118, "Mel"),
		new SkinType(735211577, "Michael"),
		new SkinType(-1080659212, "Michelle"),
		new SkinType(-636669566, "Mickey"),
		new SkinType(1690783035, "Packie"),
		new SkinType(-165448092, "Pathos"),
		new SkinType(-1947682830, "Petrovic"),
		new SkinType(-1826458934, "Phil Bell"),
		new SkinType(1794146792, "Playboy X"),
		new SkinType(954215094, "Ray Boccino"),
		new SkinType(-587324132, "Ricky"),
		new SkinType(-1992728631, "Roman"),
		new SkinType(558221221, "Roman 2,"),
		new SkinType(-17823883, "Sarah"),
		new SkinType(1384833284, "Tuna"),
		new SkinType(-1014976873, "Vinny Spaz"),
		new SkinType(896408642, "Vlad"),
		new SkinType(-301223260, "Black Street Thug 1,"),
		new SkinType(-1143910864, "Black Street Thug 2,"),
		new SkinType(869501081, "Black Street OG 1,"),
		new SkinType(632613980, "Black Street OG 1,"),
		new SkinType(-503930010, "Albanian Thug 1,"),
		new SkinType(-235584669, "Albanian Thug 2,"),
		new SkinType(207714363, "Albanian Thug 3,"),
		new SkinType(514268366, "Albanian Thug 4,"),
		new SkinType(43005364, "Biker 1,"),
		new SkinType(1346668127, "Biker 2,"),
		new SkinType(-1677255197, "Biker 3,"),
		new SkinType(-1461281345, "Biker 4,"),
		new SkinType(1574850459, "Biker 5,"),
		new SkinType(-1953289472, "Biker 6,"),
		new SkinType(280474699, "Irish Man 1,"),
		new SkinType(-19263344, "Irish Man 2,"),
		new SkinType(1844702918, "Irish Man 3,"),
		new SkinType(1609755055, "Jamaican OG 1,"),
		new SkinType(-330497431, "Jamaican OG 2,"),
		new SkinType(1117105909, "Jamaican OG 3,"),
		new SkinType(-1500397869, "Jamaican Thug 1,"),
		new SkinType(-881358690, "Jamaican Thug 2,"),
		new SkinType(1540383669, "Asian Man 1,"),
		new SkinType(764249904, "Asian Man 2,"),
		new SkinType(492147228, "Hispanic Man 1,"),
		new SkinType(-1926041127, "Hispanic Man 2,"),
		new SkinType(1168388225, "Hispanic Man 3,"),
		new SkinType(-1746774780, "Hispanic Man 4,"),
		new SkinType(-302362397, "Fat Italian Mafia Boss"),
		new SkinType(-1616890832, "Italian Mafia Boss"),
		new SkinType(64730935, "Italian Mafia Associate"),
		new SkinType(510389335, "Fat Italian Mafia Associate"),
		new SkinType(-1836006237, "Russian Thug 1,"),
		new SkinType(-2088164056, "Russian Thug 2,"),
		new SkinType(1976502708, "Russian Thug 3,"),
		new SkinType(1543404628, "Russian Thug 4,"),
		new SkinType(1865532596, "Russian Thug 5,"),
		new SkinType(431692232, "Russian Thug 6,"),
		new SkinType(1724587620, "Russian Thug 7,"),
		new SkinType(-1180674815, "Russian Thug 8,"),
		new SkinType(871281791, "Triad Boss 1,"),
		new SkinType(683712035, "Triad Boss 2,"),
		new SkinType(-1084007777, "Triad Member 3,"),
		new SkinType(-164935626, "Triad Member 4,"),
		new SkinType(-751071255, "Female Maid"),
		new SkinType(-109247258, "Female Binco Worker"),
		new SkinType(1366257926, "Female Bank Teller"),
		new SkinType(346338575, "Female Doctor"),
		new SkinType(1350216795, "Female Gym Worker"),
		new SkinType(924926104, "Female Burger Shot Worker"),
		new SkinType(-346378101, "Female Cluckin Bell Worker"),
		new SkinType(-2104311883, "Female Rockstar Cafe Worker"),
		new SkinType(212900845, "Female TW@ Cafe Worker"),
		new SkinType(-290070895, "Female Well Stacked Pizza Worker"),
		new SkinType(552542187, "Hooker"),
		new SkinType(996267216, "Hooker 2,"),
		new SkinType(-1193778389, "Nurse"),
		new SkinType(1113677074, "Stripper 1,"),
		new SkinType(1353709999, "Stripper 2,"),
		new SkinType(24233425, "Waitress"),
		new SkinType(-1761003415, "Alcoholic Man"),
		new SkinType(1075583233, "Armoured Truck Driver"),
		new SkinType(134077503, "Bus Driver"),
		new SkinType(757349871, "Generic Asian Man"),
		new SkinType(-1827421800, "Black Crackhead"),
		new SkinType(219393781, "Doctor (Scrubs)"),
		new SkinType(-1186940778, "Doctor"),
		new SkinType(375732086, "Doctor (Blood Covered Coat)"),
		new SkinType(2105015949, "Cook"),
		new SkinType(-200234085, "Italian Mob Enforcer"),
		new SkinType(800131009, "Factory Worker"),
		new SkinType(-999506922, "FIB Agent"),
		new SkinType(-1993909080, "Fat Delivery Driver"),
		new SkinType(610888851, "Fire Chief"),
		new SkinType(486302863, "Mercenary Soldier"),
		new SkinType(-778316080, "Helicopter Pilot"),
		new SkinType(624314380, "Hotel Doorman"),
		new SkinType(-1784833142, "Korean Cook"),
		new SkinType(-1852976689, "Lawyer 1,"),
		new SkinType(-1134712978, "Lawyer 2,"),
		new SkinType(379171768, "Loony Black Man"),
		new SkinType(-1945168882, "Pilot"),
		new SkinType(807236245, "Generic Man"),
		new SkinType(-284362863, "Postal Worker"),
		new SkinType(-1188246269, "Saxophone Player"),
		new SkinType(-1870989171, "Security Guard"),
		new SkinType(420915580, "Stadium Food Vendor"),
		new SkinType(1878085135, "Stadium Food Cook"),
		new SkinType(142730876, "Street Food Vendor"),
		new SkinType(-690681764, "Street Sweeper Driver"),
		new SkinType(8772846, "Taxi Driver"),
		new SkinType(1186270890, "Telephone Company Worker"),
		new SkinType(-379234846, "Tennis Player"),
		new SkinType(1159759556, "Train Conductor"),
		new SkinType(-142386662, "Homeless Black Man"),
		new SkinType(-46564867, "Trucker"),
		new SkinType(-1284047560, "Janitor"),
		new SkinType(22944263, "Hotel Doorman 2,"),
		new SkinType(1178487645, "Mob Boss"),
		new SkinType(-1464712858, "Airport Worker"),
		new SkinType(-2139064254, "Bartender"),
		new SkinType(-1780698891, "Biker Bouncer"),
		new SkinType(-409283472, "High End Club Bouncer"),
		new SkinType(-799229885, "Bowling Alley Worker"),
		new SkinType(-434183225, "Bowling Alley Worker 2,"),
		new SkinType(768442188, "Chinese Food Vendor"),
		new SkinType(676448572, "Club Security"),
		new SkinType(-722019798, "Construction Worker"),
		new SkinType(-1015957728, "Construction Worker 2,"),
		new SkinType(-714220780, "Construction Worker 3,"),
		new SkinType(-183203150, "Police Officer"),
		new SkinType(-1518937979, "Traffic Officer"),
		new SkinType(-370395528, "Fat Police Officer"),
		new SkinType(-1371133859, "Courier"),
		new SkinType(-573788283, "Cowboy 1,"),
		new SkinType(-1283406538, "Drug Dealer 1,"),
		new SkinType(1448755353, "Drug Dealer 2,"),
		new SkinType(989485, "Male Burger Shot Worker"),
		new SkinType(-1011530423, "Male Cluckin Bell Worker"),
		new SkinType(1979561477, "Male Rockstar Cafe Worker"),
		new SkinType(-786449781, "Male TW@ Cafe Worker"),
		new SkinType(206941425, "Male Well Stacked Pizza Worker"),
		new SkinType(-610224615, "Firefighter"),
		new SkinType(1136499716, "Garbage Collector"),
		new SkinType(897868981, "Goon"),
		new SkinType(-1902758612, "Male Gym Worker"),
		new SkinType(-356904519, "Mechanic 2,"),
		new SkinType(-1056268969, "Male Modo Worker"),
		new SkinType(1201610759, "Helicopter Pilot"),
		new SkinType(-151000142, "Perseus"),
		new SkinType(501136335, "Generic Male 1,"),
		new SkinType(186619473, "Generic Male 2,"),
		new SkinType(-111611196, "Generic Male 3,"),
		new SkinType(-1175077216, "Paramedic"),
		new SkinType(-1676937780, "Prisoner"),
		new SkinType(215190023, "Prisoner 2,"),
		new SkinType(1552970117, "Roman's Taxi Service Driver"),
		new SkinType(-1481923910, "Male Runner"),
		new SkinType(357919731, "Male Shop Assistant 1,"),
		new SkinType(-89302119, "State Trooper"),
		new SkinType(-1004762946, "SWAT"),
		new SkinType(-64233032, "Sword Swallower"),
		new SkinType(-1292254815, "Thief"),
		new SkinType(271284208, "Valet"),
		new SkinType(-186113957, "Vendor"),
		new SkinType(-2015686009, "French Tom"),
		new SkinType(1977784957, "Jim Fitz"),
		new SkinType(-203833294, "East European Woman"),
		new SkinType(189853472, "East European Woman 2,"),
		new SkinType(-349043578, "Woman"),
		new SkinType(-114937692, "Jersey Woman"),
		new SkinType(-1697333660, "Oriental Woman"),
		new SkinType(100706569, "Rich Woman"),
		new SkinType(155063868, "Business Woman 1,"),
		new SkinType(394310337, "Business Woman 2,"),
		new SkinType(1375728805, "Chinatown Woman"),
		new SkinType(-284229525, "Business Woman 3,"),
		new SkinType(677687516, "East European Woman 3,"),
		new SkinType(-1188238883, "Fat Black Woman"),
		new SkinType(-2075220936, "Jersey Woman 1,"),
		new SkinType(-1356924456, "Jersey Woman 2,"),
		new SkinType(812112483, "Fat Hispanic Woman 1,"),
		new SkinType(-129242580, "Fat Hispanic Woman 2,"),
		new SkinType(852423121, "White Manhattan Woman"),
		new SkinType(76551508, "Black Manhattan Woman"),
		new SkinType(-2118501976, "Old Asian Woman"),
		new SkinType(1616769823, "Old Rich Woman"),
		new SkinType(453889158, "Business Woman 4,"),
		new SkinType(824245375, "Asian Woman in Dress"),
		new SkinType(-1362442041, "Fat Black Bronx Woman"),
		new SkinType(-1788328884, "Random White Woman"),
		new SkinType(-1523915823, "Random Hispanic Woman"),
		new SkinType(-949987237, "Random Eastern European Woman"),
		new SkinType(-1926577323, "Random Black Woman"),
		new SkinType(168065679, "Black Harlem Woman 1,"),
		new SkinType(441464, "Fat Jersey Woman 1,"),
		new SkinType(54114008, "Fat Hispanic Woman 3,"),
		new SkinType(-292713088, "Hispanic Woman 1,"),
		new SkinType(1743814728, "Hispanic Woman 2,"),
		new SkinType(1670568326, "Manhattan Woman 1,"),
		new SkinType(1354281938, "Manhattan Woman 2,"),
		new SkinType(1056837725, "Manhattan Woman 1,"),
		new SkinType(-1193633577, "Asian Woman 1,"),
		new SkinType(713691120, "Black Woman 2,"),
		new SkinType(-1780385799, "Rich White Woman 1,"),
		new SkinType(-952185135, "Asian Woman"),
		new SkinType(1586287288, "Female Shopper 1,"),
		new SkinType(1848013291, "Female Shopper 2,"),
		new SkinType(-1702036227, "Female Shopper 3,"),
		new SkinType(1182843182, "Female Socialite 1,"),
		new SkinType(-900623157, "Street Woman 1,"),
		new SkinType(286007875, "Street Woman 2,"),
		new SkinType(1473654742, "Street Woman 3,"),
		new SkinType(-1850743775, "Street Woman 4,"),
		new SkinType(1290755317, "Street Woman 5,"),
		new SkinType(1872110126, "Street Woman 6,"),
		new SkinType(1754440500, "Tourist Woman 1,"),
		new SkinType(761763258, "MODEL_F_Y_VILLBO_01,"),
		new SkinType(-636579119, "Business Man 1,"),
		new SkinType(-1754526315, "Business Man 2,"),
		new SkinType(-1516474414, "Street Criminal 1,"),
		new SkinType(-1821258883, "Street Criminal 2,"),
		new SkinType(1952671026, "Obese Mafia Thug"),
		new SkinType(-1991603022, "Gay Man 1,"),
		new SkinType(-1080673049, "Homeless Bum 1,"),
		new SkinType(495499562, "Loony White Man 1,"),
		new SkinType(-1984134881, "MODEL_M_M_MIDTOWN_01,"),
		new SkinType(1063816580, "Business Man 2,"),
		new SkinType(208763854, "Eastern European Man 1,"),
		new SkinType(-1020237172, "Fat Black Man 2,"),
		new SkinType(1782277836, "MODEL_M_M_PINDUS_02,"),
		new SkinType(-1402442039, "Fat Italian Man 1,"),
		new SkinType(-1628417063, "Italian Man 2,"),
		new SkinType(1158569407, "Hispanic Man 1,"),
		new SkinType(1969438324, "Hispanic Man 2,"),
		new SkinType(1621955848, "Hispanic Man 3,"),
		new SkinType(-657489059, "Tourist Man 1,"),
		new SkinType(-1307068958, "Black Business Man 1,"),
		new SkinType(734334931, "Asian Man 3,"),
		new SkinType(1865082075, "MODEL_M_M_PRICH_01,"),
		new SkinType(-432593815, "MODEL_M_O_EASTEURO_01,"),
		new SkinType(-1639359785, "Hasidic Jewish Man 1,"),
		new SkinType(1656087115, "Old Man 1,"),
		new SkinType(2034185905, "MODEL_M_O_PEASTEURO_02,"),
		new SkinType(1316404726, "MODEL_M_O_PHARBRON_01,"),
		new SkinType(980990533, "MODEL_M_O_PJERSEY_01,"),
		new SkinType(-1298691925, "MODEL_M_O_STREET_01,"),
		new SkinType(243672348, "Old Business Man"),
		new SkinType(2085884255, "MODEL_M_Y_BOHO_01,"),
		new SkinType(221246143, "MODEL_M_Y_BOHOGUY_01,"),
		new SkinType(52357603, "MODEL_M_Y_BRONX_01,"),
		new SkinType(1530937394, "Black Business Man 2,"),
		new SkinType(690281432, "Black Business Man 3,"),
		new SkinType(-1149743642, "Asian Man 4,"),
		new SkinType(-314369597, "Chopshop Mechanic 1,"),
		new SkinType(-552829610, "Chopshop Mechanic 2,"),
		new SkinType(-1097188138, "MODEL_M_Y_DODGY_01,"),
		new SkinType(-1775659292, "MODEL_M_Y_DORK_02,"),
		new SkinType(1207402441, "MODEL_M_Y_DOWNTOWN_01,"),
		new SkinType(1500619449, "MODEL_M_Y_DOWNTOWN_02,"),
		new SkinType(594261682, "MODEL_M_Y_DOWNTOWN_03,"),
		new SkinType(-747824291, "MODEL_M_Y_GAYYOUNG"),
		new SkinType(-677160979, "MODEL_M_Y_GENSTREET_11,"),
		new SkinType(-1678614360, "MODEL_M_Y_GENSTREET_16,"),
		new SkinType(989044076, "MODEL_M_Y_GENSTREET_20,"),
		new SkinType(1180218190, "MODEL_M_Y_GENSTREET_34,"),
		new SkinType(-1420592428, "MODEL_M_Y_HARDMAN_01,"),
		new SkinType(-1222963415, "MODEL_M_Y_HARLEM_01,"),
		new SkinType(-1746153269, "MODEL_M_Y_HARLEM_02,"),
		new SkinType(2104499156, "MODEL_M_Y_HARLEM_04,"),
		new SkinType(-1874580889, "Hasidic Jewish Man 2,"),
		new SkinType(-1055386282, "MODEL_M_Y_LEASTSIDE_01,"),
		new SkinType(575808580, "MODEL_M_Y_PBRONX_01,"),
		new SkinType(-71980543, "MODEL_M_Y_PCOOL_01,"),
		new SkinType(-195159218, "MODEL_M_Y_PCOOL_02,"),
		new SkinType(697247370, "MODEL_M_Y_PEASTEURO_01,"),
		new SkinType(670406267, "MODEL_M_Y_PHARBRON_01,"),
		new SkinType(26615298, "MODEL_M_Y_PHARLEM_01,"),
		new SkinType(1542927558, "MODEL_M_Y_PJERSEY_01,"),
		new SkinType(-1806886352, "MODEL_M_Y_PLATIN_01,"),
		new SkinType(-1022920796, "MODEL_M_Y_PLATIN_02,"),
		new SkinType(-1326394505, "MODEL_M_Y_PLATIN_03,"),
		new SkinType(607901190, "MODEL_M_Y_PMANHAT_01,"),
		new SkinType(1968470106, "MODEL_M_Y_PMANHAT_02,"),
		new SkinType(-344136289, "MODEL_M_Y_PORIENT_01,"),
		new SkinType(560413584, "MODEL_M_Y_PQUEENS_01,"),
		new SkinType(1352017873, "MODEL_M_Y_PRICH_01,"),
		new SkinType(223726252, "MODEL_M_Y_PVILLBO_01,"),
		new SkinType(-1252681043, "MODEL_M_Y_PVILLBO_02,"),
		new SkinType(-1562020391, "MODEL_M_Y_PVILLBO_03,"),
		new SkinType(1223224881, "MODEL_M_Y_QUEENSBRIDGE"),
		new SkinType(-1220737489, "MODEL_M_Y_SHADY_02,"),
		new SkinType(1755322862, "MODEL_M_Y_SKATEBIKE_01,"),
		new SkinType(386690478, "MODEL_M_Y_SOHO_01,"),
		new SkinType(62496225, "MODEL_M_Y_STREET_01,"),
		new SkinType(523785438, "MODEL_M_Y_STREET_03,"),
		new SkinType(813889395, "MODEL_M_Y_STREET_04,"),
		new SkinType(-1552214124, "MODEL_M_Y_STREETBLK_02,"),
		new SkinType(-650575089, "MODEL_M_Y_STREETBLK_03,"),
		new SkinType(-740078918, "Street Punk 1,"),
		new SkinType(-1927496394, "Street Punk 2,"),
		new SkinType(1374242512, "Street Punk 3,"),
		new SkinType(-1139941790, "Tough Guy"),
		new SkinType(809067472, "Male Tourist"),
		new SkinType(1724390423, "F_Y_ASIANCLUB_01", { ivEpisode: 2 }),
		new SkinType(1964095658, "F_Y_ASIANCLUB_02", { ivEpisode: 2 }),
		new SkinType(2802928488, "F_Y_CLOEPARKER", { ivEpisode: 2 }),
		new SkinType(930552533, "F_Y_CLUBEURO_01", { ivEpisode: 2 }),
		new SkinType(3486101654, "F_Y_DANCER_01", { ivEpisode: 2 }),
		new SkinType(1376565880, "F_Y_DOMGIRL_01", { ivEpisode: 2 }),
		new SkinType(3230321503, "F_Y_EMIDTOWN_02", { ivEpisode: 2 }),
		new SkinType(2048838359, "F_Y_HOSTESS", { ivEpisode: 2 }),
		new SkinType(3997382082, "F_Y_HOTCHICK_01", { ivEpisode: 2 }),
		new SkinType(2480144589, "F_Y_HOTCHICK_02", { ivEpisode: 2 }),
		new SkinType(314506937, "F_Y_HOTCHICK_03", { ivEpisode: 2 }),
		new SkinType(3412908435, "F_Y_JONI", { ivEpisode: 2 }),
		new SkinType(3450748540, "F_Y_PGIRL_01", { ivEpisode: 2 }),
		new SkinType(2610911831, "F_Y_PGIRL_02", { ivEpisode: 2 }),
		new SkinType(2686009836, "F_Y_SMID_01", { ivEpisode: 2 }),
		new SkinType(763838720, "F_Y_TRENDY_01", { ivEpisode: 2 }),
		new SkinType(3807793447, "IG_AHMAD", { ivEpisode: 2 }),
		new SkinType(1370299619, "IG_ARMANDO", { ivEpisode: 2 }),
		new SkinType(1195842459, "IG_ARMSDEALER", { ivEpisode: 2 }),
		new SkinType(714517099, "IG_ARNAUD", { ivEpisode: 2 }),
		new SkinType(465237040, "IG_BANKER", { ivEpisode: 2 }),
		new SkinType(2837294033, "IG_BLUEBROS", { ivEpisode: 2 }),
		new SkinType(3893268832, "IG_BRUCIE2", { ivEpisode: 2 }),
		new SkinType(243666427, "IG_BULGARIN2", { ivEpisode: 2 }),
		new SkinType(653404222, "IG_DAISY", { ivEpisode: 2 }),
		new SkinType(2840262812, "IG_DEEJAY", { ivEpisode: 2 }),
		new SkinType(2848083183, "IG_DESSIE", { ivEpisode: 2 }),
		new SkinType(2014087898, "IG_GRACIE2", { ivEpisode: 2 }),
		new SkinType(1905515841, "IG_HENRIQUE", { ivEpisode: 2 }),
		new SkinType(2805295892, "IG_ISSAC2", { ivEpisode: 2 }),
		new SkinType(3241646740, "IG_JACKSON", { ivEpisode: 2 }),
		new SkinType(8206123, "IG_JOHNNY2", { ivEpisode: 2 }),
		new SkinType(1976355936, "IG_LUIS2", { ivEpisode: 2 }),
		new SkinType(1798610950, "IG_MARGOT", { ivEpisode: 2 }),
		new SkinType(1662225612, "IG_MORI_K", { ivEpisode: 2 }),
		new SkinType(643311700, "IG_MR_SANTOS", { ivEpisode: 2 }),
		new SkinType(3458234342, "IG_NAPOLI", { ivEpisode: 2 }),
		new SkinType(2089415431, "IG_OYVEY", { ivEpisode: 2 }),
		new SkinType(3381042378, "IG_ROCCO", { ivEpisode: 2 }),
		new SkinType(3690408662, "IG_ROYAL", { ivEpisode: 2 }),
		new SkinType(1730047377, "IG_SPADE", { ivEpisode: 2 }),
		new SkinType(3887900262, "IG_TAHIR", { ivEpisode: 2 }),
		new SkinType(2345614827, "IG_TIMUR", { ivEpisode: 2 }),
		new SkinType(4020398429, "IG_TONY", { ivEpisode: 2 }),
		new SkinType(3321165989, "IG_TRAMP2", { ivEpisode: 2 }),
		new SkinType(2397320, "IG_TRIAD", { ivEpisode: 2 }),
		new SkinType(1662473323, "IG_TROY", { ivEpisode: 2 }),
		new SkinType(4138181684, "IG_VIC", { ivEpisode: 2 }),
		new SkinType(3837819283, "IG_VICGIRL", { ivEpisode: 2 }),
		new SkinType(1384494459, "IG_VINCE", { ivEpisode: 2 }),
		new SkinType(3846796161, "IG_YUSEF", { ivEpisode: 2 }),
		new SkinType(3623617227, "M_M_E2MAF_01", { ivEpisode: 2 }),
		new SkinType(821179586, "M_M_E2MAF_02", { ivEpisode: 2 }),
		new SkinType(657888018, "M_M_MAFUNION", { ivEpisode: 2 }),
		new SkinType(658237358, "M_Y_AMIRGUARD_01", { ivEpisode: 2 }),
		new SkinType(2598437087, "M_Y_BARMAISON", { ivEpisode: 2 }),
		new SkinType(1429700748, "M_Y_BATHROOM", { ivEpisode: 2 }),
		new SkinType(2496379640, "M_Y_CELEBBLOG", { ivEpisode: 2 }),
		new SkinType(3547608240, "M_Y_CLUBBLACK_01", { ivEpisode: 2 }),
		new SkinType(284474691, "M_Y_CLUBEURO_01", { ivEpisode: 2 }),
		new SkinType(4283570686, "M_Y_CLUBEURO_02", { ivEpisode: 2 }),
		new SkinType(627205662, "M_Y_CLUBEURO_03", { ivEpisode: 2 }),
		new SkinType(698554670, "M_Y_CLUBWHITE_01", { ivEpisode: 2 }),
		new SkinType(247648794, "M_Y_DOMDRUG_01", { ivEpisode: 2 }),
		new SkinType(738125806, "M_Y_DOMGUY_01", { ivEpisode: 2 }),
		new SkinType(1639961459, "M_Y_DOMGUY_02", { ivEpisode: 2 }),
		new SkinType(1756785265, "M_Y_DOORMAN_02", { ivEpisode: 2 }),
		new SkinType(2972144845, "M_Y_E2RUSSIAN_01", { ivEpisode: 2 }),
		new SkinType(3738841110, "M_Y_E2RUSSIAN_02", { ivEpisode: 2 }),
		new SkinType(3575913642, "M_Y_E2RUSSIAN_03", { ivEpisode: 2 }),
		new SkinType(504377658, "M_Y_EXSPORTS", { ivEpisode: 2 }),
		new SkinType(188553127, "M_Y_FIGHTCLUB_01", { ivEpisode: 2 }),
		new SkinType(2817839380, "M_Y_FIGHTCLUB_02", { ivEpisode: 2 }),
		new SkinType(3125245369, "M_Y_FIGHTCLUB_03", { ivEpisode: 2 }),
		new SkinType(3466894963, "M_Y_FIGHTCLUB_04", { ivEpisode: 2 }),
		new SkinType(3730980334, "M_Y_FIGHTCLUB_05", { ivEpisode: 2 }),
		new SkinType(1394419558, "M_Y_FIGHTCLUB_06", { ivEpisode: 2 }),
		new SkinType(1691568850, "M_Y_FIGHTCLUB_07", { ivEpisode: 2 }),
		new SkinType(1971776569, "M_Y_FIGHTCLUB_08", { ivEpisode: 2 }),
		new SkinType(563038535, "M_Y_GAYBLACK_01", { ivEpisode: 2 }),
		new SkinType(2856837426, "M_Y_GAYDANCER", { ivEpisode: 2 }),
		new SkinType(3769281318, "M_Y_GAYGENERAL_01", { ivEpisode: 2 }),
		new SkinType(3595638835, "M_Y_GAYWHITE_01", { ivEpisode: 2 }),
		new SkinType(982077731, "M_Y_GUIDO_01", { ivEpisode: 2 }),
		new SkinType(1758965191, "M_Y_GUIDO_02", { ivEpisode: 2 }),
		new SkinType(761611541, "M_Y_MIDEAST_01", { ivEpisode: 2 }),
		new SkinType(1127066537, "M_Y_MOBPARTY", { ivEpisode: 2 }),
		new SkinType(2881739989, "M_Y_PAPARAZZI_01", { ivEpisode: 2 }),
		new SkinType(3448520480, "M_Y_UPTOWN_01", { ivEpisode: 2 }),
	],

	/** @type {Array.<SkinType>} */
	[10]: [
		new SkinType("Tommy.i3d", "Tommy Angelo"),
		new SkinType("TommyBOXER.i3d", "Tommy Angelo"),
		new SkinType("TommyCOAT.i3d", "Tommy Angelo"),
		new SkinType("TommyCOATHAT.i3d", "Tommy Angelo"),
		new SkinType("TommyDELNIK.i3d", "Tommy Angelo"),
		new SkinType("TommyDELNIKHIGH.i3d", "Tommy Angelo"),
		new SkinType("TommyFREERIDER.i3d", "Tommy Angelo"),
		new SkinType("TommyGUN.i3d", "Tommy Angelo"),
		new SkinType("TommyHAT.i3d", "Tommy Angelo"),
		new SkinType("TommyHIGH.i3d", "Tommy Angelo"),
		new SkinType("TommyHIGHBLOOD.i3d", "Tommy Angelo"),
		new SkinType("TommyHighCOATHAT.i3d", "Tommy Angelo"),
		new SkinType("TommyHighHAT.i3d", "Tommy Angelo"),
		new SkinType("TommyNAHAC.i3d", "Tommy Angelo (Naked)"),
		new SkinType("TommyOLD.i3d", "Tommy Angelo (Old)"),
		new SkinType("TommyOLDBLOOD.i3d", "Tommy Angelo (Old)"),
		new SkinType("TommyPYTEL.i3d", "Tommy Angelo (With Bag)"),
		new SkinType("TommyRACER.i3d", "Tommy Angelo (Racer)"),
		new SkinType("TommyRACER2.i3d", "Tommy Angelo (Racer)"),
		new SkinType("TommyRUKAV.i3d", "Tommy Angelo (Suit)"),
		new SkinType("TommySAILOR.i3d", "Tommy Angelo (Sailor)"),
		new SkinType("TommyTAXIDRIVER.i3d", "Tommy Angelo (Taxi Driver)"),
		new SkinType("TommyTAXIdriverHIGH.i3d", "Tommy Angelo (Taxi Driver)"),
		new SkinType("AsisPZ1.i3d", "Generic Man"),
		new SkinType("Barman01.i3d", "Bartender"),
		new SkinType("Bclerk01.i3d", "Generic Man"),
		new SkinType("Bclerk02.i3d", "Generic Man"),
		new SkinType("Bguard01.i3d", "Bodyguard 1"),
		new SkinType("Bguard01M.i3d", "Bodyguard 2"),
		new SkinType("Bguard02.i3d", "Bodyguard 3"),
		new SkinType("Bguard03.i3d", "Bodyguard 4"),
		new SkinType("Bguard03M.i3d", "Bodyguard 5"),
		new SkinType("Biff.i3d", "Biff"),
		new SkinType("BigDig.i3d", "Generic Man"),
		new SkinType("BnkO01.i3d", "Security Guard 1"),
		new SkinType("BnkO02.i3d", "Security Guard 2"),
		new SkinType("BnkO03.i3d", "Security Guard 3"),
		new SkinType("BobAut01.i3d", "Generic Man"),
		new SkinType("Bookmaker01.i3d", "Generic Man"),
		new SkinType("Bookmaker02.i3d", "Generic Man"),
		new SkinType("Boxer01.i3d", "Boxer"),
		new SkinType("Boxer02.i3d", "Boxer"),
		new SkinType("Boxer03.i3d", "Boxer"),
		new SkinType("Boxer04.i3d", "Boxer04"),
		new SkinType("Carlo.i3d", "Carlo"),
		new SkinType("China1.i3d", "China1"),
		new SkinType("Chulig1.i3d", "Generic Man"),
		new SkinType("Chulig1b.i3d", "Generic Man"),
		new SkinType("David.i3d", "David"),
		new SkinType("Delnik01.i3d", "Generic Man"),
		new SkinType("Delnik02.i3d", "Generic Man"),
		new SkinType("Delnik03.i3d", "Generic Man"),
		new SkinType("Detektiv01.i3d", "Detective 1"),
		new SkinType("Detektiv02.i3d", "Detective 2"),
		new SkinType("Detektiv03.i3d", "Detective 3"),
		new SkinType("Enemy01+.i3d", "Generic Man"),
		new SkinType("Enemy01.i3d", "Generic Man"),
		new SkinType("Enemy02+.i3d", "Generic Man"),
		new SkinType("Enemy02.i3d", "Generic Man"),
		new SkinType("Enemy03+.i3d", "Generic Man"),
		new SkinType("Enemy03.i3d", "Generic Man"),
		new SkinType("Enemy04.i3d", "Generic Man"),
		new SkinType("Enemy04BLOOD.i3d", "Generic Man"),
		new SkinType("Enemy04K.i3d", "Generic Man"),
		new SkinType("Enemy05.i3d", "Generic Man"),
		new SkinType("Enemy06+.i3d", "Generic Man"),
		new SkinType("Enemy06.i3d", "Generic Man"),
		new SkinType("Enemy07+.i3d", "Generic Man"),
		new SkinType("Enemy07.i3d", "Generic Man"),
		new SkinType("Enemy08+.i3d", "Generic Man"),
		new SkinType("Enemy08.i3d", "Generic Man"),
		new SkinType("Enemy08K.i3d", "Generic Man"),
		new SkinType("Enemy09+.i3d", "Generic Man"),
		new SkinType("Enemy09.i3d", "Generic Man"),
		new SkinType("Enemy09K.i3d", "Generic Man"),
		new SkinType("Enemy10+.i3d", "Generic Man"),
		new SkinType("Enemy10.i3d", "Generic Man"),
		new SkinType("Enemy10K.i3d", "Generic Man"),
		new SkinType("Enemy11K.i3d", "Generic Man"),
		new SkinType("Enemy12.i3d", "Generic Man"),
		new SkinType("Enemy12K.i3d", "Generic Man"),
		new SkinType("Enemy13C.i3d", "Generic Man"),
		new SkinType("Enemy91.i3d", "Generic Man"),
		new SkinType("Enemy92.i3d", "Generic Man"),
		new SkinType("FMVENemy11K.i3d", "Gangster 1"),
		new SkinType("FREEgang01.i3d", "Gangster 2"),
		new SkinType("FREEgang02.i3d", "Gangster 3"),
		new SkinType("FrankHIGH.i3d", "Frank"),
		new SkinType("Friend1.i3d", "Generic Man"),
		new SkinType("Friend2.i3d", "Generic Man"),
		new SkinType("Gangster01.i3d", "Gangster 4"),
		new SkinType("Gangster02.i3d", "Gangster 5"),
		new SkinType("Gangster03.i3d", "Gangster 6"),
		new SkinType("Gangster04.i3d", "Gangster 7"),
		new SkinType("Gangster05.i3d", "Gangster 8"),
		new SkinType("GodzMan1.i3d", "Generic Man"),
		new SkinType("Guard01.i3d", "Bodyguard 6"),
		new SkinType("Guard02.i3d", "Bodyguard 7"),
		new SkinType("Hasic01.i3d", "Firefighter"),
		new SkinType("HighCivil.i3d", "Generic Man"),
		new SkinType("HighCivilBLOOD.i3d", "Generic Man"),
		new SkinType("Homeless01.i3d", "Generic Man"),
		new SkinType("Hoolig01.i3d", "Generic Man"),
		new SkinType("Hoolig02.i3d", "Generic Man"),
		new SkinType("Hoolig03.i3d", "Generic Man"),
		new SkinType("Hoolig04.i3d", "Generic Man"),
		new SkinType("Hoolig05.i3d", "Generic Man"),
		new SkinType("Hoolig06.i3d", "Generic Man"),
		new SkinType("I04Delnik01+.i3d", "I04Delnik01+"),
		new SkinType("I04Delnik01.i3d", "Generic Man"),
		new SkinType("Joe.i3d", "Joe"),
		new SkinType("Kasar.i3d", "Generic Man"),
		new SkinType("Knez.i3d", "Preacher"),
		new SkinType("LifeG01.i3d", "Sailor"),
		new SkinType("Lucas.i3d", "Lucas"),
		new SkinType("Luigi.i3d", "Luigi"),
		new SkinType("Malticka1.i3d", "Generic Man"),
		new SkinType("MorelloHIGH.i3d", "Morello"),
		new SkinType("MorelloLOW.i3d", "Morello"),
		new SkinType("NormanHIGH.i3d", "Norman"),
		new SkinType("Organizator01.i3d", "Generic Man"),
		new SkinType("Paulie.i3d", "Paulie"),
		new SkinType("PaulieCOATHAT.i3d", "Paulie"),
		new SkinType("PaulieCTHIGH.i3d", "Paulie"),
		new SkinType("PaulieCorpse.i3d", "Paulie"),
		new SkinType("PaulieHIGH.i3d", "Paulie"),
		new SkinType("Pepe.i3d", "Pepe"),
		new SkinType("PoliceMan01.i3d", "Police Officer 1"),
		new SkinType("PoliceMan02.i3d", "Police Officer 2"),
		new SkinType("Politik.i3d", "Generic Man"),
		new SkinType("PortGuard01.i3d", "Port Guard 1"),
		new SkinType("PortGuard02.i3d", "Port Guard 2"),
		new SkinType("ProdZ1.i3d", "Generic Man"),
		new SkinType("Prokur.i3d", "Prosecutor"),
		new SkinType("Radni01.i3d", "Worker"),
		new SkinType("Radni02.i3d", "Worker"),
		new SkinType("Ralph.i3d", "Ralph"),
		new SkinType("RalphHIGH.i3d", "Ralph"),
		new SkinType("ReditelB.i3d", "Director"),
		new SkinType("ReditelH.i3d", "Director"),
		new SkinType("RidicNakladaku.i3d", "Truck Driver"),
		new SkinType("SalMan01K.i3d", "Gangster"),
		new SkinType("SalMan02K.i3d", "Gangster"),
		new SkinType("SalMan03.i3d", "Gangster"),
		new SkinType("SalMan03K.i3d", "Gangster"),
		new SkinType("SalMan04.i3d", "Gangster"),
		new SkinType("SalMan05.i3d", "Gangster"),
		new SkinType("SalMan05K.i3d", "Salieri"),
		new SkinType("Salieri2.i3d", "Salieri"),
		new SkinType("SalieriHIGH.i3d", "Salieri"),
		new SkinType("SalieriHIGH2.i3d", "Salieri"),
		new SkinType("SalieriLOW.i3d", "Salieri"),
		new SkinType("Sam.i3d", "Sam"),
		new SkinType("SamCOATHAT.i3d", "Sam"),
		new SkinType("SamHIGH.i3d", "Sam"),
		new SkinType("SamHIGHblood1.i3d", "SamHIGHblood1"),
		new SkinType("SamHIGHblood2.i3d", "SamHIGHblood2"),
		new SkinType("SamHIGHblood3.i3d", "SamHIGHblood3"),
		new SkinType("SamHIGHblood4.i3d", "SamHIGHblood4"),
		new SkinType("Samblood1.i3d", "Samblood1"),
		new SkinType("Sergio.i3d", "Sergio"),
		new SkinType("SergioBLOOD.i3d", "SergioBLOOD"),
		new SkinType("SynRad1.i3d", "Generic Man"),
		new SkinType("SynRad1BLOOD.i3d", "SynRad1BLOOD"),
		new SkinType("SynRad1DEAD.i3d", "SynRad1DEAD"),
		new SkinType("Tony.i3d", "Tony"),
		new SkinType("VincenzoHIGH.i3d", "Vincenzo"),
		new SkinType("VincenzoLOW.i3d", "Vincenzo"),
		new SkinType("Vrabec.i3d", "Generic Man"),
		new SkinType("Vratny1.i3d", "Generic Man"),
		new SkinType("Vypravci.i3d", "Train Conductor 1"),
		new SkinType("Vypravci2.i3d", "Train Conductor 2"),
		new SkinType("WillG1.i3d", "Generic Man"),
		new SkinType("WillG2.i3d", "Generic Man"),
		new SkinType("WillMan01.i3d", "Generic Man"),
		new SkinType("WillMan02.i3d", "Generic Man"),
		new SkinType("Zavod1.i3d", "Racer 1"),
		new SkinType("Zavod2.i3d", "Racer 2"),
		new SkinType("Zavod3.i3d", "Racer 3"),
		new SkinType("ZavodFMV1.i3d", "Racer 4"),
		new SkinType("ZavodFMV2.i3d", "Racer 5"),
		new SkinType("civil02.i3d", "Generic Man"),
		new SkinType("civil03.i3d", "Generic Man"),
		new SkinType("civil04.i3d", "Generic Man"),
		new SkinType("civil05.i3d", "Generic Man"),
		new SkinType("civil06.i3d", "Generic Man"),
		new SkinType("civil11.i3d", "Generic Man"),
		new SkinType("civil11M.i3d", "Generic Man"),
		new SkinType("civil12.i3d", "Generic Man"),
		new SkinType("civil13.i3d", "Generic Man"),
		new SkinType("civil14.i3d", "Generic Man"),
		new SkinType("civil15.i3d", "Generic Man"),
		new SkinType("civil16.i3d", "Generic Man"),
		new SkinType("civil16M.i3d", "Generic Man"),
		new SkinType("civil17.i3d", "Generic Man"),
		new SkinType("civil18.i3d", "Generic Man"),
		new SkinType("civil19.i3d", "Generic Man"),
		new SkinType("civil19M.i3d", "Generic Man"),
		new SkinType("civil21.i3d", "Generic Man"),
		new SkinType("civil21N.i3d", "Generic Man"),
		new SkinType("civil22.i3d", "Generic Man"),
		new SkinType("civil31.i3d", "Generic Man"),
		new SkinType("civil32.i3d", "Generic Man"),
		new SkinType("civil33.i3d", "Generic Man"),
		new SkinType("civil34.i3d", "Generic Man"),
		new SkinType("civil35.i3d", "Generic Man"),
		new SkinType("civil36.i3d", "Generic Man"),
		new SkinType("civil36M.i3d", "Generic Man"),
		new SkinType("civil37.i3d", "Generic Man"),
		new SkinType("civil38.i3d", "Generic Man"),
		new SkinType("civil39.i3d", "Generic Man"),
		new SkinType("civil40.i3d", "Generic Man"),
		new SkinType("civil41.i3d", "Generic Man"),
		new SkinType("civil42.i3d", "Generic Man"),
		new SkinType("civil42M.i3d", "Generic Man"),
		new SkinType("civil43.i3d", "Generic Man"),
		new SkinType("civil44.i3d", "Generic Man"),
		new SkinType("civil51.i3d", "Generic Man"),
		new SkinType("civil51M.i3d", "Generic Man"),
		new SkinType("civil52.i3d", "Generic Man"),
		new SkinType("civil53.i3d", "Generic Man"),
		new SkinType("civil54.i3d", "Generic Man"),
		new SkinType("civil54M.i3d", "Generic Man"),
		new SkinType("civil55.i3d", "Generic Man"),
		new SkinType("civil55M.i3d", "Generic Man"),
		new SkinType("civil56.i3d", "Generic Man"),
		new SkinType("civil56M.i3d", "Generic Man"),
		new SkinType("civil57.i3d", "Generic Man"),
		new SkinType("civil57M.i3d", "Generic Man"),
		new SkinType("civil60.i3d", "Asian Man"),
		new SkinType("civil61.i3d", "Asian Man"),
		new SkinType("civil62.i3d", "Asian Man"),
		new SkinType("civil63.i3d", "Asian Man"),
		new SkinType("civil70.i3d", "Black Man"),
		new SkinType("civil70M.i3d", "Black Man"),
		new SkinType("civil71.i3d", "Black Man"),
		new SkinType("civil72.i3d", "Black Man"),
		new SkinType("frank.i3d", "Frank"),
		new SkinType("ohorelec01.i3d", "Dead Guy"),
		new SkinType("pianist1.i3d", "Pianist"),
		new SkinType("pol01.i3d", "Police Officer 3"),
		new SkinType("pol02.i3d", "Police Officer 4"),
		new SkinType("pol03.i3d", "Police Officer 5"),
		new SkinType("pol11.i3d", "Police Officer 6"),
		new SkinType("pol12.i3d", "Police Officer 7"),
		new SkinType("pol13.i3d", "Police Officer 8"),
		new SkinType("polim62.i3d", "Police Officer 9"),
		new SkinType("pumpar01.i3d", "Fuel Pumper"),
		new SkinType("recep.i3d", "recep"),
		new SkinType("sailor01.i3d", "Sailor 1"),
		new SkinType("sailor01M.i3d", "Sailor 2"),
		new SkinType("sailor02.i3d", "Sailor 3"),
		new SkinType("sailor02M.i3d", "Sailor 4"),
		new SkinType("sailor03.i3d", "Sailor 5"),
		new SkinType("waiter01.i3d", "Waiter 1"),
		new SkinType("waiter01M.i3d", "Waiter 2"),
		new SkinType("waiter02.i3d", "Waiter 3"),
		new SkinType("waiter02M.i3d", "Waiter 4"),
		new SkinType("waiter03.i3d", "Waiter 5"),
		new SkinType("Alice1.i3d", "Alice"),
		new SkinType("Berta.i3d", "Berta"),
		new SkinType("Bitch01.i3d", "Generic Woman"),
		new SkinType("Bitch02.i3d", "Generic Woman"),
		new SkinType("Bitch02Mask.i3d", "Generic Woman"),
		new SkinType("Bitch03M.i3d", "Generic Woman"),
		new SkinType("CarlZen1.i3d", "CarlZen1"),
		new SkinType("Czena01.i3d", "Generic Woman"),
		new SkinType("Czena02.i3d", "Generic Woman"),
		new SkinType("Czena03.i3d", "Generic Woman"),
		new SkinType("Czena04.i3d", "Generic Woman"),
		new SkinType("Czena05.i3d", "Generic Woman"),
		new SkinType("Czena06.i3d", "Generic Woman"),
		new SkinType("Czena07.i3d", "Generic Woman"),
		new SkinType("Czena07M.i3d", "Generic Woman"),
		new SkinType("Czena08.i3d", "Generic Woman"),
		new SkinType("Czena09.i3d", "Generic Woman"),
		new SkinType("Czena09M.i3d", "Generic Woman"),
		new SkinType("Czena10.i3d", "Generic Woman"),
		new SkinType("Czena10M.i3d", "Generic Woman"),
		new SkinType("Czena11.i3d", "Generic Woman"),
		new SkinType("Czena11M.i3d", "Generic Woman"),
		new SkinType("Czena12.i3d", "Asian Woman"),
		new SkinType("Czena13.i3d", "Asian Woman"),
		new SkinType("FMVCzena03.i3d", "Generic Woman"),
		new SkinType("FMVCzena04.i3d", "Generic Woman"),
		new SkinType("March1.i3d", "Generic Woman"),
		new SkinType("Michelle.i3d", "Michelle Naked"),
		new SkinType("MichelleLOW.i3d", "Michelle"),
		new SkinType("Milenka1.i3d", "Milenka"),
		new SkinType("Sarah1.i3d", "Sarah Naked"),
		new SkinType("Sarah1Obl.i3d", "Sarah"),
		new SkinType("Sarah2.i3d", "Sarah"),
		new SkinType("Sarah2HIGH.i3d", "Sarah"),
		new SkinType("Sarah2HIGHnaha.i3d", "Sarah Naked"),
		new SkinType("Sarah2LOW.i3d", "Sarah"),
		new SkinType("Serv01.i3d", "Maid"),
		new SkinType("UfoPanak.i3d", "Alien"),
	]
}

// ----------------------------------------------------------------------------

let weapons = {
	[GAME_GTA_III]: [ // GTA III
		new WeaponType(0, "Fist", { hasAmmo: false }),
		new WeaponType(1, "Bat", { hasAmmo: false }),
		new WeaponType(2, "Pistol"),
		new WeaponType(3, "Uzi"),
		new WeaponType(4, "Shotgun"),
		new WeaponType(5, "AK47"),
		new WeaponType(6, "M16"),
		new WeaponType(7, "Sniper Rifle"),
		new WeaponType(8, "Rocket Launcher"),
		new WeaponType(9, "Flamethrower"),
		new WeaponType(10, "Molotov", { isThrown: true }),
		new WeaponType(11, "Grenade", { isThrown: true }),
	],
	[GAME_GTA_VC]: [ // GTA VC
		new WeaponType(0, "Fist", { hasAmmo: false, isMelee: true }),
		new WeaponType(1, "Brass Knuckles", { hasAmmo: false, isMelee: true }),
		new WeaponType(2, "Screwdriver", { hasAmmo: false, isMelee: true }),
		new WeaponType(3, "Golf Club", { hasAmmo: false, isMelee: true }),
		new WeaponType(4, "Nitestick", { hasAmmo: false, isMelee: true }),
		new WeaponType(5, "Knife", { hasAmmo: false, isMelee: true }),
		new WeaponType(6, "Baseball Bat", { hasAmmo: false, isMelee: true }),
		new WeaponType(7, "Hammer", { hasAmmo: false, isMelee: true }),
		new WeaponType(8, "Meat Cleaver", { hasAmmo: false, isMelee: true }),
		new WeaponType(9, "Machete", { hasAmmo: false, isMelee: true }),
		new WeaponType(10, "Katana", { hasAmmo: false, isMelee: true }),
		new WeaponType(11, "Chainsaw", { hasAmmo: false, isMelee: true }),
		new WeaponType(12, "Grenade", { isThrown: true }),
		new WeaponType(13, "Remote Grenade", { isThrown: true }),
		new WeaponType(14, "Teargas", { isThrown: true }),
		new WeaponType(15, "Molotov Cocktail", { isThrown: true }),
		new WeaponType(16, "Missile"),
		new WeaponType(17, "Colt .45"),
		new WeaponType(18, "Python"),
		new WeaponType(19, "Shotgun"),
		new WeaponType(20, "Spaz Shotgun"),
		new WeaponType(21, "Stubby Shotgun"),
		new WeaponType(22, "Tec-9"),
		new WeaponType(23, "Uzi"),
		new WeaponType(24, "Ingram"),
		new WeaponType(25, "MP5"),
		new WeaponType(26, "M4"),
		new WeaponType(27, "Ruger"),
		new WeaponType(28, "Sniper Rifle"),
		new WeaponType(29, "Laser Sniper"),
		new WeaponType(30, "RPG"),
		new WeaponType(31, "Flame Thrower"),
		new WeaponType(32, "M60"),
		new WeaponType(33, "Minigun"),
	],
	[GAME_GTA_SA]: [ // GTA San Andreas
		new WeaponType(0, "Fist", { hasAmmo: false, isMelee: true }),
		new WeaponType(1, "Brass Knuckles", { hasAmmo: false, isMelee: true }),
		new WeaponType(2, "Golf Club", { hasAmmo: false, isMelee: true }),
		new WeaponType(3, "Nightstick", { hasAmmo: false, isMelee: true }),
		new WeaponType(4, "Knife", { hasAmmo: false, isMelee: true }),
		new WeaponType(5, "Baseball Bat", { hasAmmo: false, isMelee: true }),
		new WeaponType(6, "Shovel", { hasAmmo: false, isMelee: true }),
		new WeaponType(7, "Pool Cue", { hasAmmo: false, isMelee: true }),
		new WeaponType(8, "Katana", { hasAmmo: false, isMelee: true }),
		new WeaponType(9, "Chainsaw", { hasAmmo: false, isMelee: true }),
		new WeaponType(10, "Purple Dildo", { hasAmmo: false, isMelee: true }),
		new WeaponType(11, "Dildo", { hasAmmo: false, isMelee: true }),
		new WeaponType(12, "Vibrator", { hasAmmo: false, isMelee: true }),
		new WeaponType(13, "Silver Vibrator", { hasAmmo: false, isMelee: true }),
		new WeaponType(14, "Flowers", { hasAmmo: false, isMelee: true }),
		new WeaponType(15, "Cane", { hasAmmo: false, isMelee: true }),
		new WeaponType(16, "Grenade", { isThrown: true }),
		new WeaponType(17, "Teargas", { isThrown: true }),
		new WeaponType(18, "Molotov Cocktail", { isThrown: true }),
		new WeaponType(22, "9mm"),
		new WeaponType(23, "Silenced 9mm"),
		new WeaponType(24, "Desert Eagle"),
		new WeaponType(25, "Shotgun"),
		new WeaponType(26, "Sawnoff Shotgun"),
		new WeaponType(27, "Combat Shotgun"),
		new WeaponType(28, "Uzi"),
		new WeaponType(29, "MP5"),
		new WeaponType(30, "AK-47"),
		new WeaponType(31, "M4"),
		new WeaponType(32, "Tec-9"),
		new WeaponType(33, "Country Rifle"),
		new WeaponType(34, "Sniper Rifle"),
		new WeaponType(35, "RPG"),
		new WeaponType(36, "HS Rocket"),
		new WeaponType(37, "Flamethrower"),
		new WeaponType(38, "Minigun"),
		new WeaponType(39, "Satchel Charge", { isThrown: true }),
		new WeaponType(40, "Detonator", { hasAmmo: false }),
		new WeaponType(41, "Spraycan"),
		new WeaponType(42, "Fire Extinguisher"),
		new WeaponType(43, "Camera", { hasAmmo: false }),
		new WeaponType(44, "Night Vision Goggles", { hasAmmo: false }),
		new WeaponType(45, "Thermal Goggles", { hasAmmo: false }),
		new WeaponType(46, "Parachute", { hasAmmo: false }),
		new WeaponType(47, "Cellphone", { hasAmmo: false }),
		new WeaponType(48, "Jetpack", { hasAmmo: false }),
		new WeaponType(49, "Skateboard", { hasAmmo: false }),
	],
	[GAME_GTA_IV]: [ // GTA IV
		new WeaponType(0, "Fist", { hasAmmo: false, isMelee: true }),
		new WeaponType(1, "Bat", { hasAmmo: false, isMelee: true }),
		new WeaponType(2, "Pool Cue", { hasAmmo: false, isMelee: true }),
		new WeaponType(3, "Knife", { hasAmmo: false, isMelee: true }),
		new WeaponType(4, "Grenade", { isThrown: true }),
		new WeaponType(5, "Molotov", { isThrown: true }),
		new WeaponType(6, "Rocket"),
		new WeaponType(7, "Pistol"),
		new WeaponType(8, "UNUSED"),
		new WeaponType(9, "Desert Eagle"),
		new WeaponType(10, "Stubby Shotgun"),
		new WeaponType(11, "Baretta Shotgun"),
		new WeaponType(12, "Micro Uzi"),
		new WeaponType(13, "MP5"),
		new WeaponType(14, "AK-47"),
		new WeaponType(15, "M4"),
		new WeaponType(16, "Combat Sniper"),
		new WeaponType(17, "M40A1"),
		new WeaponType(18, "RPG"),
		new WeaponType(19, "Flamethrower"),
		new WeaponType(20, "Minigun"),
		new WeaponType(21, "EFLC Weapon 1"),
		new WeaponType(22, "EFLC Weapon 2"),
		new WeaponType(23, "EFLC Weapon 3"),
		new WeaponType(24, "EFLC Weapon 4"),
		new WeaponType(25, "EFLC Weapon 5"),
		new WeaponType(26, "EFLC Weapon 6"),
		new WeaponType(27, "EFLC Weapon 7"),
		new WeaponType(28, "EFLC Weapon 8"),
		new WeaponType(29, "EFLC Weapon 9"),
		new WeaponType(30, "EFLC Weapon 10"),
		new WeaponType(31, "EFLC Weapon 11"),
		new WeaponType(32, "EFLC Weapon 12"),
		new WeaponType(33, "EFLC Weapon 13"),
		new WeaponType(34, "EFLC Weapon 14"),
		new WeaponType(35, "EFLC Weapon 15"),
		new WeaponType(36, "EFLC Weapon 16"),
		new WeaponType(37, "EFLC Weapon 17"),
		new WeaponType(38, "EFLC Weapon 18"),
		new WeaponType(39, "EFLC Weapon 19"),
		new WeaponType(40, "EFLC Weapon 20"),
		new WeaponType(41, "EFLC Weapon 21"),
		new WeaponType(42, "EFLC Weapon 22"),
		new WeaponType(43, "EFLC Weapon 23"),
		new WeaponType(44, "EFLC Weapon 24"),
		new WeaponType(45, "Camera"),
	],
	[10]: [	// Mafia 1
		new WeaponType(2, "Knuckle Duster", { hasAmmo: false, isMelee: true }),
		new WeaponType(3, "Knife", { hasAmmo: false, isMelee: true }),
		new WeaponType(4, "Baseball Bat", { hasAmmo: false, isMelee: true }),
		new WeaponType(5, "Molotov Cocktail", { hasAmmo: false, isThrown: true }),
		new WeaponType(6, "Colt Detective Special", { clipAmmo: 6 }),
		new WeaponType(7, "S&W Model 27 Magnum", { clipAmmo: 6 }),
		new WeaponType(8, "S&W Model 10 M&P", { clipAmmo: 6 }),
		new WeaponType(9, "Colt 1911", { clipAmmo: 7 }),
		new WeaponType(10, "Thompson 1928", { clipAmmo: 50 }),
		new WeaponType(11, "Pump-action Shotgun", { clipAmmo: 6 }),
		new WeaponType(12, "Sawed-off Shotgun", { clipAmmo: 2 }),
		new WeaponType(13, "US Rifle, M1903 Springfield", { clipAmmo: 5 }),
		new WeaponType(14, "Mosin-Nagant 1891/30", { clipAmmo: 5 }),
		new WeaponType(15, "Grenade", { hasAmmo: false, isThrown: true }),
		new WeaponType(17, "Bucket", { hasAmmo: false }),
		new WeaponType(20, "Steel Bar", { hasAmmo: false }),
		new WeaponType(25, "Crowbar", { hasAmmo: false }),
		new WeaponType(28, "Wooden Plank", { hasAmmo: false }),
		new WeaponType(29, "Bottle", { hasAmmo: false }),
		new WeaponType(31, "Sword", { hasAmmo: false }),
		new WeaponType(32, "Dogs Head", { hasAmmo: false }),
	]
}

// ----------------------------------------------------------------------------

let missionNames = [
	[], // Invalid
	[ // GTA 3
		"Intro Movie",
		"Hospital Info Scene",
		"Police Station Info Scene",
		"RC Diablo Destruction",
		"RC Mafia Massacre",
		"RC Rumpo Rampage",
		"RC Casino Calamity",
		"Patriot Playground",
		"A Ride In The Park",
		"Gripped!",
		"Multistorey Mayhem",
		"Paramedic",
		"Firefighter",
		"Vigilante",
		"Taxi Driver",
		"The Crook",
		"The Thieves",
		"The Wife",
		"Her Lover",
		"Give Me Liberty and Luigi's Girls",
		"Don't Spank My Bitch Up",
		"Drive Misty For Me",
		"Pump-Action Pimp",
		"The Fuzz Ball",
		"Mike Lips Last Lunch",
		"Farewell 'Chunky' Lee Chong",
		"Van Heist",
		"Cipriani's Chauffeur",
		"Dead Skunk In The Trunk",
		"The Getaway",
		"Taking Out The Laundry",
		"The Pick-Up",
		"Salvatore's Called A Meeting",
		"Triads And Tribulations",
		"Blow Fish",
		"Chaperone",
		"Cutting The Grass",
		"Bomb Da Base: Act I",
		"Bomb Da Base: Act II",
		"Last Requests",
		"Turismo",
		"I Scream, You Scream",
		"Trial By Fire",
		"Big'N'Veiny",
		"Sayonara Salvatore",
		"Under Surveillance",
		"Paparazzi Purge",
		"Payday For Ray",
		"Two-Faced Tanner",
		"Kanbu Bust-Out",
		"Grand Theft Auto",
		"Deal Steal",
		"Shima",
		"Smack Down",
		"Silence The Sneak",
		"Arms Shortage",
		"Evidence Dash",
		"Gone Fishing",
		"Plaster Blaster",
		"Marked Man",
		"Liberator",
		"Waka-Gashira Wipeout!",
		"A Drop In The Ocean",
		"Bling-Bling Scramble",
		"Uzi Rider",
		"Gangcar Round-Up",
		"Kingdom Come",
		"Grand Theft Aero",
		"Escort Service",
		"Decoy",
		"Love's Disappearance",
		"Bait",
		"Espresso-2-Go!",
		"S.A.M.",
		"Uzi Money",
		"Toyminator",
		"Rigged To Blow",
		"Bullion Run",
		"Rumble",
		"The Exchange",
	],

	[ // GTA Vice City
		"Initial",
		"Intro",
		"An Old Friend",
		"The Party",
		"Back Alley Brawl",
		"Jury Fury",
		"Riot",
		"Treacherous Swine",
		"Mall Shootout",
		"Guardian Angels",
		"Sir, Yes Sir!",
		"All Hands On Deck!",
		"The Chase",
		"Phnom Penh '86",
		"The Fastest Boat",
		"Supply & Demand",
		"Rub Out",
		"Death Row",
		"Four Iron",
		"Demolition Man",
		"Two Bit Hit",
		"No Escape?",
		"The Shootist",
		"The Driver",
		"The Job",
		"Gun Runner",
		"Boomshine Saigon",
		"Recruitment Drive",
		"Dildo Dodo",
		"Martha's Mug Shot",
		"G-spotlight",
		"Shakedown",
		"Bar Brawl",
		"Cop Land",
		"Spilling the Beans",
		"Hit the Courier",
		"Printworks Buy",
		"Sunshine Autos",
		"Interglobal Films Buy",
		"Cherry Popper Icecreams Buy",
		"Kaufman Cabs Buy",
		"Malibu Club Buy",
		"The Boatyard Buy",
		"Pole Position Club Buy",
		"El Swanko Casa Buy",
		"Links View Apartment Buy",
		"Hyman Condo Buy",
		"Ocean Heighs Aprt. Buy",
		"1102 Washington Street Buy",
		"Vice Point Buy",
		"Skumole Shack Buy",
		"Cap the Collector",
		"Keep your Friends Close...",
		"Alloy Wheels of Steel",
		"Messing with the Man",
		"Hog Tied",
		"Stunt Boat Challenge",
		"Cannon Fodder",
		"Naval Engagement",
		"Trojan Voodoo",
		"Juju Scramble",
		"Bombs Away!",
		"Dirty Lickin's",
		"Love Juice",
		"Psycho Killer",
		"Publicity Tour",
		"Weapon Range",
		"Road Kill",
		"Waste the Wife",
		"Autocide",
		"Check Out at the Check In",
		"Loose Ends",
		"V.I.P.",
		"Friendly Rivalry",
		"Cabmaggedon",
		"TAXI DRIVER",
		"PARAMEDIC",
		"FIREFIGHTER",
		"VIGILANTE",
		"HOTRING",
		"BLOODRING",
		"DIRTRING",
		"Sunshine Autos Races",
		"Distribution",
		"Downtown Chopper Checkpoint",
		"Ocean Beach Chopper Checkpoint",
		"Vice Point Chopper Checkpoint",
		"Little Haiti Chopper Checkpoint",
		"Trial by Dirt",
		"Test Track",
		"PCJ Playground",
		"Cone Crazy",
		"PIZZA BOY",
		"RC Raider Pickup",
		"RC Bandit Race",
		"RC Baron Race",
		"Checkpoint Charlie",
	],

	[ // GTA San Andreas
		"Initial 1",
		"Initial 2",
		"Intro",
		"Video Game: They Crawled From Uranus",
		"Video Game: Dualuty",
		"Video Game: Go Go Space Monkey",
		"Video Game: Let's Get Ready To Bumble",
		"Video Game: Inside Track Betting",
		"Pool",
		"Lowrider (Bet And Dance)",
		"Beefy Baron",
		"Big Smoke",
		"Ryder",
		"Tagging Up Turf",
		"Cleaning The Hood",
		"Drive-Thru",
		"Nines And AK's",
		"Drive-By",
		"Sweet's Girl",
		"Cesar Vialpando",
		"Los Sepulcros",
		"Doberman",
		"Burning Desire",
		"Gray Imports",
		"Home Invasion",
		"Catalyst",
		"Robbing Uncle Sam",
		"OG Loc",
		"Running Dog",
		"Wrong Side of the Tracks",
		"Just Business",
		"Life's a Beach",
		"Madd Dogg's Rhymes",
		"Management Issues",
		"House Party",
		"Race Tournament / 8-track / Dirt Track",
		"Lowrider (High Stakes)",
		"Reuniting The Families",
		"The Green Sabre",
		"Badlands",
		"First Date",
		"Local Liquor Store",
		"Small Town Bank",
		"Tanker Commander",
		"Against All Odds",
		"King in Exile",
		"Body Harvest",
		"Are you going to San Fierro?",
		"Wu Zi Mu / Farewell, My Love...",
		"Wear Flowers In Your Hair",
		"Deconstruction",
		"555 WE TIP",
		"Snail Trail",
		"Mountain Cloud Boys",
		"Ran Fa Li",
		"Lure",
		"Amphibious Assault",
		"The Da Nang Thang",
		"Photo Opportunity",
		"Jizzy",
		"Outrider",
		"Ice Cold Killa",
		"Toreno's Last Flight",
		"Yay Ka-Boom-Boom",
		"Pier 69",
		"T-Bone Mendez",
		"Mike Toreno",
		"Zeroing In",
		"Test Drive",
		"Customs Fast Track",
		"Puncture Wounds",
		"Back to School",
		"Air Raid",
		"Supply Lines...",
		"New Model Army",
		"Monster",
		"Highjack",
		"Interdiction",
		"Verdant Meadows",
		"N.O.E.",
		"Stowaway",
		"Black Project",
		"Green Goo",
		"Learning to Fly",
		"Fender Ketchup",
		"Explosive Situation",
		"You've Had Your Chips",
		"Fish in a Barrel",
		"Don Peyote",
		"Intensive Care",
		"The Meat Business",
		"Freefall",
		"Saint Mark's Bistro",
		"Misappropriation",
		"High Noon",
		"Madd Dogg",
		"Architectural Espionage",
		"Key To Her Heart",
		"Dam And Blast",
		"Cop Wheels",
		"Up, Up and Away!",
		"Breaking the Bank at Caligula's",
		"A Home In The Hills",
		"Vertical Bird",
		"Home Coming",
		"Cut Throat Business",
		"Beat Down on B Dup",
		"Grove 4 Life",
		"Riot",
		"Los Desperados",
		"End Of The Line (1)",
		"End Of The Line (2)",
		"End Of The Line (3)",
		"Shooting range",
		"Los Santos Gym Fight School",
		"San Fierro Gym Fight School",
		"Las Venturas Gym Fight School",
		"Trucking",
		"Quarry",
		"Boat School",
		"Bike School",
		"Taxi-Driver Sub-Mission",
		"Paramedic Sub-Mission",
		"Firefighter Sub-Mission",
		"Vigilante Sub-Mission",
		"Burglary Sub-Mission",
		"Freight Train Sub-Mission",
		"Pimping Sub-Mission",
		"Arena Mission: Blood Ring",
		"Arena Mission: Kickstart",
		"Beat the Cock!",
		"Courier",
		"The Chiliad Challenge",
		"BMX / NRG-500 STUNT Mission",
		"Buy Properties Mission",
		"2player Ram",
		"2player bike",
		"2player cars",
		"2player heli",
		"2player peds",
		"Run-around LS",
		"Run-around LV",
		"Run-around SF",
		"Run-around DE",
		"Run-around CO",
		"Run-around (2player)",
		"Run-around (2player)",
		"Run-around (2player)",
		"Run-around (2player)",
		"Run-around (2player)",
		"Run-around (2player)",
	],

	[ // GTA Underground

	],

	[ // GTA IV

	],

	[ // GTA IV: Episodes from Liberty City

	],
];

// ----------------------------------------------------------------------------

let weaponModels = [
	[],
	[ // GTA III
		0, 				// Fist
		172,			// Baseball Bat
		173,			// Colt 45
		178,			// Uzi
		176,			// Shotgun
		171,			// AK-47
		180,			// M16
		177,			// Sniper Rifle
		175,			// Rocket Launcher
		181,			// Flamethrower
		174,			// Molotov Cocktail
		170				// Grenade
	],

	[ // GTA Vice City
		0,
		259,
		260,
		261,
		262,
		263,
		264,
		265,
		266,
		267,
		268,
		269,
		270,
		291,
		271,
		272,
		273,
		274,
		275,
		277,
		278,
		279,
		281,
		282,
		283,
		284,
		280,
		276,
		285,
		286,
		287,
		288,
		289,
		290,
		-1,
		-1,
		292
	],

	[ // GTA San Andreas

	]
];

// ----------------------------------------------------------------------------

let weekDays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

// ----------------------------------------------------------------------------

let months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

// ----------------------------------------------------------------------------

let cardinalDirections = [
	"North",
	"Northeast",
	"East",
	"Southeast",
	"South",
	"Southwest",
	"West",
	"Northwest",
	"Unknown"
];

// ----------------------------------------------------------------------------

let policeStations = [
	[],

	[ // GTA III
		[1143.875, -675.1875, 14.97], 	// Portland
		[340.25, -1123.375, 25.98],		// Staunton Island
		[-1253.0, -138.1875, 58.75],	// Shoreside Vale
	],

	[ // GTA Vice City
		[399.77, -468.90, 11.73],		// Washington Beach
		[508.96, 512.07, 12.10],		// Vice Point
		[-657.43, 762.31, 11.59],		// Downtown
		[-885.08, -470.44, 13.11],		// Little Havana
	],

	[ // GTA San Andreas
		// Coming soon!
	],

	[ // GTA Underground
		// Coming soon!
	],

	[ // GTA IV
		[894.99, -357.39, 18.185], 		// Broker
		[435.40, 1592.29, 17.353], 		// South Bohan
		[974.93, 1870.45, 23.073],		// Northern Gardens
		[1233.25, -89.13, 28.034], 		// South Slopes
		[50.12, 679.88, 15.316], 		// Middle Park East
		[85.21, 1189.82, 14.755], 		// East Holland
		[2170.87, 448.87, 6.085], 		// Francis International Airport
		[213.12, -211.70, 10.752], 		// Chinatown
		[-1714.95, 276.31, 22.134], 	// Acter
		[-1220.73, -231.53, 3.024], 	// Port Tudor
		[-927.66, 1263.63, 24.587], 	// Leftwood
	],

	[ // GTA IV (EFLC)
		[894.99, -357.39, 18.185], 		// Broker
		[435.40, 1592.29, 17.353], 		// South Bohan
		[974.93, 1870.45, 23.073],		// Northern Gardens
		[1233.25, -89.13, 28.034], 		// South Slopes
		[50.12, 679.88, 15.316], 		// Middle Park East
		[85.21, 1189.82, 14.755], 		// East Holland
		[2170.87, 448.87, 6.085], 		// Francis International Airport
		[213.12, -211.70, 10.752], 		// Chinatown
		[-1714.95, 276.31, 22.134], 	// Acter
		[-1220.73, -231.53, 3.024], 	// Port Tudor
		[-927.66, 1263.63, 24.587], 	// Leftwood
	],
];

// ----------------------------------------------------------------------------

let fireStations = [
	[],

	[ // GTA III
		[1103.70, -52.45, 7.49], 		// Portland
		[-78.48, -436.80, 16.17], 		// Staunton Island
		[-1202.10, -14.67, 53.20],		// Shoreside Vale
	],

	[ // GTA Vice City
		[-695.15, 912.58, 11.08],		// Downtown
	],

	[ // GTA San Andreas
		// Coming soon!
	],

	[ // GTA Underground
		// Coming soon!
	],

	[ // GTA IV
		[953.13, 95.90, 35.004], 		// Broker
		[-271.02, 1542.15, 20.420], 	// Northwood
		[1120.47, 1712.36, 10.534], 	// Northern Gardens
		[2364.87, 166.83, 5.813], 		// Francis International Airport
		[295.40, -336.88, 4.963], 		// Chinatown
		[-1574.90, 546.54, 25.449], 	// Berchem
	],

	[ // GTA IV (EFLC)
		[953.13, 95.90, 35.004], 		// Broker
		[-271.02, 1542.15, 20.420], 	// Northwood
		[1120.47, 1712.36, 10.534], 	// Northern Gardens
		[2364.87, 166.83, 5.813], 		// Francis International Airport
		[295.40, -336.88, 4.963], 		// Chinatown
		[-1574.90, 546.54, 25.449], 	// Berchem
	],
];

// ----------------------------------------------------------------------------

let hospitals = [
	[],

	[ // GTA III
		[1144.25, -596.875, 14.97],		// Portland
		[183.50, -17.75, 16.21],		// Staunton Island
		[-1259.5, -44.5, 58.89],		// Shoreside Vale
	],

	[ // GTA Vice City
		[-822.57, 1152.82, 12.41],		// Downtown (Shuman Health Care Center)
		[-885.08, -470.44, 13.11],		// Little Havana (West Haven Community Health Care Center)
		[-133.19, -980.76, 10.46], 		// Ocean Beach (Ocean View Hospital)
	],

	[ // GTA San Andreas
		// Coming soon!
	],

	[ // GTA Underground
		// Coming soon!
	],

	[ // GTA IV
		[1199.59, 196.78, 33.554], 		// Schottler
		[980.71, 1831.61, 23.898], 		// Northern Gardens
		[-1317.27, 1277.20, 22.370], 	// Leftwood
		[-1538.43, 344.58, 20.943], 	// Acter
	],

	[ // GTA IV (EFLC)
		[1199.59, 196.78, 33.554], 		// Schottler
		[980.71, 1831.61, 23.898], 		// Northern Gardens
		[-1317.27, 1277.20, 22.370],	// Leftwood
		[-1538.43, 344.58, 20.943], 	// Acter
	],
]

// ----------------------------------------------------------------------------

let payAndSprays = [
	[],
	[ // GTA III
		[925.4, -360.3, 10.83], 		// Portland
		[381.8, -493.8, 25.95],			// Staunton Island
		[-1142.4, 35.01, 58.61],		// Shoreside Vale
	],

	[ // GTA Vice City
		[-869.95, -119.06, 10.63],		// Little Haiti
		[-910.82, -1265.96, 11.79],		// Viceport
	],

	[ // GTA San Andreas
		// Coming soon!
	],

	[ // GTA Underground
		// Coming soon!
	],

	[ // GTA IV
		[1058.57, -282.58, 20.760], 	// Hove Beach
		[-1148.69, 1171.52, 16.457], 	// Leftwood
	],
];

// ----------------------------------------------------------------------------

let ammuNations = [
	[],
	[ // GTA III
		[1068.3, -400.9, 15.24], 		// Portland
		[348.2, -717.9, 26.43], 		// Staunton Island
	],

	[ // GTA Vice City
		[-676.32, 1204.98, 11.10],		// Downtown
	],
];

// ----------------------------------------------------------------------------

let hiddenPackages = [
	[],
	[ // GTA III
		[1105.25, -1020, 25.0625],
		[877.562, -788, 27.5625],
		[1254, -611.188, 22.75],
		[1045.75, -967.062, 16],
		[942.062, -793.375, 14.875],
		[934, -718.875, 14.75],
		[898.062, -414.688, 26.5],
		[846.875, -442.5, 23.1875],
		[927.062, -404.375, 29.0625],
		[864.25, -171.5, 3.5],
		[1538.25, -174.375, 19.1875],
		[1213.06, -127.062, 15.0625],
		[753.562, 137, 3.5],
		[1162, -101.75, 12],
		[1155.56, -191.5, 14.375],
		[1285.5, -247.5, 42.375],
		[1007.19, -219.562, 6.6875],
		[1138.19, -250, 24.25],
		[1023.56, -423.688, 14.875],
		[1237.5, -854.062, 20.5625],
		[1478.25, -1150.69, 12],
		[1018.88, -56.75, 21],
		[1465.69, -166.5, 55.5],
		[1120.19, -926.188, 16],
		[1206.5, -821.5, 15],
		[940.188, -199.875, 5],
		[979.25, -1143.06, 13.0625],
		[1195.5, -908.75, 14.875],
		[1470.38, -811.375, 22.375],
		[1320.5, -365.5, 15.1875],
		[932.562, -477.25, -10.75],
		[1305.88, -380.875, 39.5],
		[938.188, -1258.25, 3.5],
		[36.75, -530.188, 26],
		[414.375, -279.25, 23.5625],
		[203.5, -1252.56, 59.25],
		[77.6875, -352.25, 16.0625],
		[120.875, 243.688, 11.375],
		[49.375, 36.25, 16.6875],
		[68.0625, -773.25, 22.75],
		[-4, -1129.06, 26],
		[-134.688, -1386.88, 26.1875],
		[-23.5, -1472.38, 19.6875],
		[112.062, -1227.56, 26],
		[218.25, -1237.75, 20.375],
		[308, -1533.38, 23.5625],
		[468.562, -1457.19, 44.25],
		[355.062, -1085.69, 25.875],
		[312.375, -483.75, 29],
		[322.25, -447.062, 23.375],
		[586.688, -795, 1.5625],
		[504.25, -1027.75, 1.6875],
		[174.062, -1259.5, 32.0625],
		[248.75, -958.25, 26],
		[54.75, -566.5, 26.0625],
		[-77, -1490.06, 26],
		[556, -231.375, 22.75],
		[-38.1875, -1434.25, 31.75],
		[194.75, -0.5, 19.75],
		[223.062, -272.188, 16.0625],
		[-18.0625, -222.25, 29.75],
		[-69.25, -469.188, 16.0625],
		[-270.688, -631.562, 72.25],
		[-59.1875, -579.75, 15.875],
		[392.75, -1135.56, 15.875],
		[145, -1584, 30.6875],
		[428.062, -340.375, 16.1875],
		[351.062, -980.5, 33.0625],
		[-221.75, -1487.56, 5.75],
		[-1193.06, -75.75, 47.375],
		[-1090.5, 131.688, 58.6875],
		[-1015.5, -13, 49.0625],
		[-821.75, -184.875, 33.75],
		[-849.062, -209.375, 41.75],
		[-736.375, 304.688, 54.0625],
		[-678.062, 308.562, 59.75],
		[-609.188, 286.688, 65.0625],
		[-329.562, 320.062, 60.6875],
		[-1221.06, 562.75, 68.5625],
		[-1131.88, 605.375, 68.5625],
		[-1098.38, 471.25, 35.5],
		[-1208.06, 325.188, 3.375],
		[-1216.19, 347.875, 30.375],
		[-1211.88, -166.875, 58.6875],
		[-1195.19, -7.6875, 59.75],
		[-206.875, 328.75, 3.375],
		[-753.188, 142, 10.0625],
		[-697.875, -182.062, 9.1875],
		[-748.375, -807, -13.5625],
		[-489.875, -44.875, 3.75],
		[-632.875, 67.5625, 18.75],
		[-546.75, 10.6875, 3.875],
		[-1032.56, -573.375, 10.875],
		[-542, -1046.56, 3.375],
		[-1556.38, -905.75, 14.5],
		[-1327, -624.688, 11.0625],
		[-737.375, -745.375, 9.6875],
		[-1278.69, -776, 11.0625],
		[-1494.69, -1097.25, 3.375],
		[-837.75, -469.188, 10.75],
	],

	[],
	[],
	[],
	[],
	[],
];

// ----------------------------------------------------------------------------

function replaceEmojiInString(message) {
	for (let i in emojiReplaceString) {
		message = message.replace(emojiReplaceString[i][0], emojiReplaceString[i][1]);
	}
	return message;
}

// ----------------------------------------------------------------------------

function makeReadableTime(hour, minute) {
	let hourStr = String(hour);
	let minuteStr = String(minute);
	let meridianStr = "AM";

	if (hour < 10) {
		hourStr = "0" + String(hour);
		if (hour == 0) {
			hourStr = "12";
		}
		meridianStr = "AM";
	}

	if (hour > 12) {
		let actualHour = hour - 12;
		if (actualHour < 10) {
			hourStr = "0" + String(hour - 12);
		} else {
			hourStr = String(hour - 12);
		}
		meridianStr = "PM";
	}

	if (minute < 10) {
		minuteStr = "0" + String(minute);
	}

	return hourStr + ":" + minuteStr + " " + meridianStr;
}

// ----------------------------------------------------------------------------

function getPosToRightOfPos(pos, angle, distance) {
	let x = (pos.x + ((Math.cos((-angle + 1.57) + (Math.PI / 2))) * distance));
	let y = (pos.y + ((Math.sin((-angle + 1.57) + (Math.PI / 2))) * distance));

	let rightPos = new Vec3(x, y, pos.z);

	return rightPos;
}

// ----------------------------------------------------------------------------

function getPosToLeftOfPos(pos, angle, distance) {
	let x = (pos.x + ((Math.cos((angle + 1.57) + (Math.PI / 2))) * distance));
	let y = (pos.y + ((Math.sin((angle + 1.57) + (Math.PI / 2))) * distance));

	let leftPos = new Vec3(x, y, pos.z);

	return leftPos;
}

// ----------------------------------------------------------------------------

function getPosInFrontOfPos(pos, angle, distance) {
	let x = pos.x;
	let y = pos.y;
	let z = pos.z;

	if (thisGame != 10) {
		x = (pos.x + ((Math.cos(angle + (Math.PI / 2))) * distance));
		y = (pos.y + ((Math.sin(angle + (Math.PI / 2))) * distance));
	} else {
		x = (pos.x + ((Math.cos(angle - (Math.PI / 2))) * distance));
		z = (pos.z + ((Math.sin(angle + (Math.PI / 2))) * distance));
	}

	return new Vec3(x, y, z);
}

// ----------------------------------------------------------------------------

function getPosBehindPos(pos, angle, distance) {
	let x = pos.x;
	let y = pos.y;
	let z = pos.z;

	if (thisGame != 10) {
		x = (pos.x + ((Math.cos(-angle + (Math.PI / 2))) * distance));
		y = (pos.y + ((Math.sin(-angle + (Math.PI / 2))) * distance));
	} else {
		x = (pos.x + ((Math.cos(angle + (Math.PI / 2))) * distance));
		z = (pos.z + ((Math.sin(angle + (Math.PI / 2))) * distance));
	}

	return new Vec3(x, y, z);
}

// ----------------------------------------------------------------------------

function getPosAbovePos(pos, distance) {
	return new Vec3(
		pos.x, 
		(thisGame == 10) ? pos.y + distance : pos.y, 
		(thisGame == 10) ? pos.z + distance : pos.z
	);
}

// ----------------------------------------------------------------------------

function getPosBelowPos(pos, distance) {
	return new Vec3(
		pos.x, 
		(thisGame == 10) ? pos.y - distance : pos.y, 
		(thisGame == 10) ? pos.z - distance : pos.z
	);
}

// ----------------------------------------------------------------------------

function getHeadingFromPosToPos(pos1, pos2) {

	let x = pos2.x - pos1.x;
	let y = pos2.y - pos1.y;
	let rad = Math.atan2(y, x);
	let deg = radToDeg(rad);
	deg -= 90;
	deg = deg % 360;
	return degToRad(deg);
}

// ----------------------------------------------------------------------------

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ----------------------------------------------------------------------------

function getAngleInCircleFromCenter(center, total, current) {
	let gap = 360 / total;
	let deg = Math.floor(gap * current);

	if (deg <= 0) {
		deg = 1;
	} else {
		if (deg >= 360) {
			deg = 359;
		}
	}

	return degToRad(deg);
}

// ----------------------------------------------------------------------------

function getClosestPlayer(pos) {
	return getElementsByType(ELEMENT_PED).reduce((i, j) => ((i.position.distance(pos) <= j.position.distance(pos)) ? i : j));
}

// ----------------------------------------------------------------------------

function getClosestVehicle(pos) {
	return getElementsByType(ELEMENT_VEHICLE).reduce((i, j) => ((i.position.distance(pos) <= j.position.distance(pos)) ? i : j));
}

// ----------------------------------------------------------------------------

function getClosestCivilian(pos) {
	return getElementsByType(ELEMENT_PED).filter(ped => !ped.isType(ELEMENT_PLAYER)).reduce((i, j) => ((i.position.distance(pos) <= j.position.distance(pos)) ? i : j));
}

// ----------------------------------------------------------------------------

function vec3ToVec2(pos) {
	return new Vec2(pos[0], pos[1]);
}

// ----------------------------------------------------------------------------

function isParamsInvalid(params) {
	if (params == null) {
		return true;
	}

	if (params == "") {
		return true;
	}

	if (params.length == 0) {
		return true;
	}

	return false;
}

// ----------------------------------------------------------------------------

function getVehicleModelFromParams(params, gameId = thisGame) {
	let findFromModel = vehicles[gameId].find(veh => (typeof veh.model == "string") ? veh.model.toLowerCase().indexOf(params.toLowerCase()) != -1 : veh.model == Number(params));
	if(findFromModel != undefined) {
		return findFromModel;
	}
	
	let findFromName = vehicles[gameId].find(veh => veh.name.toLowerCase().indexOf(params.toLowerCase()) != -1);
	if(findFromName != undefined) {
		return findFromName;
	}

	return null;
}

// ----------------------------------------------------------------------------

function getSkinFromParams(params, gameId = thisGame) {
	let findFromModel = skins[gameId].find(skin => (typeof skin.model == "string") ? skin.model.toLowerCase().indexOf(params.toLowerCase()) != -1 : skin.model == Number(params));
	if(findFromModel != undefined) {
		return findFromModel;
	}
	
	let findFromName = skins[gameId].find(skin => skin.name.toLowerCase().indexOf(params.toLowerCase()) != -1);
	if(findFromName != undefined) {
		return findFromName;
	}

	return null;
}

// ----------------------------------------------------------------------------

function getWeaponFromParams(params, gameId = thisGame) {
	let findFromId = weapons[gameId].find(weapon => weapon.id == Number(params));
	if(findFromId != undefined) {
		return findFromId;
	}
	
	let findFromName = weapons[gameId].find(weapon => weapon.name.toLowerCase().indexOf(params.toLowerCase()) != -1);
	if(findFromName != undefined) {
		return findFromName;
	}

	return null;
}

// ----------------------------------------------------------------------------

function getMissionIdFromParams(params, gameId = thisGame) {
	if (isNaN(params)) {
		return getMissionIdFromName(params, gameId);
	} else {
		if (typeof missionNames[gameId][Number(params)] != undefined) {
			return Number(params);
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function getGarageIdFromParams(params, gameId = thisGame) {
	if (isNaN(params)) {
		return getGarageIdFromName(params);
	} else {
		if (!isValidGarageId(Number(params))) {
			return false;
		}
		return Number(params);
	}

	return false;
}

// ----------------------------------------------------------------------------

function getMissionIdFromName(missionName, gameId = thisGame) {
	for (let i in missionNames[gameId]) {
		if (missionNames[gameId][i].toLowerCase().indexOf(missionName.toLowerCase()) != -1) {
			return Number(i);
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function getVehicleUpgradeIdFromParams(params) {
	if (isNaN(params)) {
		return getVehicleUpgradeIdFromName(params);
	} else {
		if (typeof vehicleUpgradeNames[Number(params)] != "undefined") {
			return Number(params);
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function getVehicleUpgradeIdFromName(params, gameId = thisGame) {
	for (let i in vehicleUpgradeNames) {
		if (vehicleUpgradeNames[i].toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return i;
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function getGarageIdFromName(params, gameId = thisGame) {
	for (let i in gameGarages[gameId]) {
		if (gameGarages[gameId][i][1].toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return Number(i);
		}
	}

	return false;
}

// ----------------------------------------------------------------------------

function isValidGarageId(params, gameId = thisGame) {
	if (gameGarages[gameId][Number(params)] != "undefined") {
		return true;
	}

	return false;
}

// ----------------------------------------------------------------------------

function doesWordStartWithVowel(word) {
	switch (word.substr(0, 1).toLowerCase()) {
		case "a":
		case "e":
		case "i":
		case "o":
		case "u":
			return true;

		default:
			return false;
	}

	return false;
}

// ----------------------------------------------------------------------------

function arrayBufferToString(arrayBuffer) {
	return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

// ----------------------------------------------------------------------------

function getGarageNameFromId(garageId, gameId = thisGame) {
	return gameGarages[gameId][garageId][0];
}

// ----------------------------------------------------------------------------

function getGarageLocationFromId(garageId, gameId = thisGame) {
	return gameGarages[gameId][garageId][1];
}

// ----------------------------------------------------------------------------

function getLocationPositionFromName(missionId, gameId = thisGame) {
	return missionNames[gameId][missionId];
}

// ----------------------------------------------------------------------------

function getMissionNameFromId(missionId, gameId = thisGame) {
	return missionNames[gameId][missionId];
}

// ----------------------------------------------------------------------------

function replaceEmojiInString(message) {
	for (let i in emojiReplaceString) {
		while (message.indexOf(emojiReplaceString[i][0]) != -1) {
			message = message.replace(emojiReplaceString[i][0], emojiReplaceString[i][1]);
		}
	}
	return message;
}

// ----------------------------------------------------------------------------

function getClientFromName(name) {
	return getClients().find(client => client.name.toLowerCase().indexOf(name.toLowerCase()) ) || false;
}

// ----------------------------------------------------------------------------

function getClientFromIndex(index) {
	return getClients().find(client => client.index == index) || false;
}

// ----------------------------------------------------------------------------

function getClientFromPlayer(player) {
	return getClientFromPlayerElement(player);
}

// ----------------------------------------------------------------------------

function getPlayerFromParams(params) {
	if (isNaN(params)) {
		return getClientFromName(params);
	} else {
		return getClientFromIndex(Number(params));
	}

	return false;
}

// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	if (isNaN(params)) {
		return getClientFromName(params);
	} else {
		return getClientFromIndex(Number(params));
	}

	return false;
}

// ----------------------------------------------------------------------------

function killDeathRatio(kills, deaths) {
	if (deaths == 0 || kills == 0) {
		return 0.0;
	}
	return Number((kills * 100 / deaths) * 0.01);
}

// ----------------------------------------------------------------------------

function getCardinalDirection(pos1, pos2) {
	let a = pos1.x - pos2.x;
	let b = pos1.y - pos2.y;
	let c = pos1.z - pos2.z;

	let x = Math.abs(a);
	let y = Math.abs(b);
	let z = Math.abs(c);

	let no = 0;
	let ne = 1;
	let ea = 2;
	let se = 3;
	let so = 4;
	let sw = 5;
	let we = 6;
	let nw = 7;
	let na = 8;

	if (b < 0 && a < 0) {
		if (x < (y / 2)) {
			return no;
		} else if (y < (x / 2)) {
			return ea;
		} else {
			return ne;
		}
	} else if (b < 0 && a >= 0) {
		if (x < (y / 2)) {
			return no;
		} else if (y < (x / 2)) {
			return we;
		} else {
			return nw;
		}
	} else if (b >= 0 && a >= 0) {
		if (x < (y / 2)) {
			return so;
		} else if (y < (x / 2)) {
			return we;
		} else {
			return sw;
		}
	} else if (b >= 0 && a < 0) {
		if (x < (y / 2)) {
			return so;
		} else if (y < (x / 2)) {
			return ea;
		} else {
			return se;
		}
	} else {
		return na;
	}
	return na;
}

// ----------------------------------------------------------------------------

function getTimeDifferenceDisplay(unixTimeOne, unixTimeTwo) {
	let timeDifference = unixTimeOne - unixTimeTwo;
	let hours = Math.floor(timeDifference / 3600);
	let minutes = Math.floor(timeDifference / 60);
	let hourString = "";
	let minuteString = "";

	if (hours == 1) {
		hourString = "1 hour";
	} else {
		hourString = String(hours) + " hours";
	}

	if (minutes == 1) {
		minuteString = "1 minute";
	} else {
		minuteString = String(minutes) + " minute";
	}

	return hourString + " and " + minuteString;
}

// ----------------------------------------------------------------------------

function getVehiclesInRange(position, range) {
	return getElementsByType(ELEMENT_VEHICLE).filter(vehicle => position.distance(vehicle.position) <= range);
}

// ----------------------------------------------------------------------------

function getPlayersInRange(position, range) {
	return getElementsByType(ELEMENT_PLAYER).filter(player => position.distance(player.position) <= range);
}

// ----------------------------------------------------------------------------

function getCiviliansInRange(position, range) {
	return getElementsByType(ELEMENT_PED).filter(ped = !ped.isType(ELEMENT_PLAYER)).filter((civilian) => position.distance(civilian.position) <= range);
}

// ----------------------------------------------------------------------------

function getElementsOfTypeInRange(elementType, position, range) {
	return getElementsByType(elementType).filter(element => position.distance(element.position) <= range);
}

// ----------------------------------------------------------------------------

function isValidObjectModel(modelId, gameId = thisGame) {
	// Will finish later
	return true;
}

// ----------------------------------------------------------------------------

function is2dPositionOnScreen(pos2d) {
	return pos2d.x >= 0 && pos2d.y >= 0 && pos2d.x <= game.width && pos2d.y <= game.height;
}

// ----------------------------------------------------------------------------

function getRandomRGB() {
	return toColour.apply(null, [
		getRandom(0, 255),
		getRandom(0, 255),
		getRandom(0, 255),
		255
	]);
}

// ----------------------------------------------------------------------------

function breakText(text, maxLength) {
	let lines = [];
	let j = Math.floor(text.length / maxLength);

	for (let i = 0; i < j; i++) {
		lines.push(text.substr(i * maxLength, maxLength));
	}

	let line = text.substr(j * maxLength, text.length % maxLength);
	if (line.length > 0) {
		lines.push(line);
	}

	return lines;
}

// ----------------------------------------------------------------------------

function getSpeedFromVelocity(vel) {
	return Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
}

// ----------------------------------------------------------------------------

function getRandom(min, max) {
	return Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)
}

// ----------------------------------------------------------------------------

function getArrayOfElementId(elements) {
	let tempArray = [];
	for (let i in elements) {
		tempArray.push(elements[i].id);
	}

	return tempArray;
}

// ----------------------------------------------------------------------------

function getProperVehiclePossessionText(params = "") {
	switch (params.toLowerCase()) {
		case "m":
		case "me":
		case "mine":
			return "their";

		case "last":
		case "new":
		case "newest":
		case "l":
			return "the recently spawned";

		case "n":
		case "c":
		case "closest":
		case "nearest":
			return "the closest";

		case "r":
		case "range":
		case "near":
		case "within":
			return "all nearby";

		case "a":
		case "all":
			return "all";

		case "r":
		case "random":
		case "any":
			return "a random";

		default:
			if (isNaN(params)) {
				let peds = getPeds();
				for (let i in peds) {
					if (peds[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
						return peds[i].name + "'s";
					}
				}
			} else {
				if (typeof getVehicles()[Number(params)] != "undefined") {
					return "The ID " + params;
				}
			}
			return [];
	}
}

// ----------------------------------------------------------------------------

function getProperCivilianPossessionText(params = "") {
	switch (params.toLowerCase()) {
		case "m":
		case "me":
		case "mine":
			return "His";

		case "last":
		case "new":
		case "newest":
		case "l":
			return "The recently spawned";

		case "n":
		case "c":
		case "closest":
		case "nearest":
			return "The closest";

		case "r":
		case "range":
		case "near":
		case "within":
			return "All nearby";

		case "a":
		case "all":
			return "All";

		case "r":
		case "random":
		case "any":
			return "The random";

		default:
			if (isNaN(params)) {
				let peds = getPeds();
				for (let i in peds) {
					if (peds[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
						return peds[i].name + "'s";
					}
				}
			} else {
				if (typeof vehicles[Number(params)] != "undefined") {
					return "The ID " + params;
				}
			}
			return [];
	}
}

// ----------------------------------------------------------------------------

function getOnOffText(bool) {
	return bool ? "on" : "off"
}

// ----------------------------------------------------------------------------

function getEnableDisableText(bool) {
	return bool ? "enabled" : "disabled"
}

// ----------------------------------------------------------------------------

function getWeatherName(weatherId, gameId = thisGame) {
	return weatherNames[gameId][weatherId];
}

// ----------------------------------------------------------------------------

// Global Skills
let gameStats = [
	false,
	[],
	[],
	[
		[0, 999999],	//PEDSTAT_PROGRESS_MADE
		[1, 999999],	//PEDSTAT_TOTAL_PROGRESS
		[2, 0],			//PEDSTAT_LONGEST_BASKETBALL
		[3, 0],			//PEDSTAT_DIST_FOOT
		[4, 0],			//PEDSTAT_DIST_CAR
		[5, 0],			//PEDSTAT_DIST_BIKE
		[6, 0],			//PEDSTAT_DIST_BOAT
		[7, 0],			//PEDSTAT_DIST_GOLF_CART
		[8, 0],			//PEDSTAT_DIST_HELICOPTER
		[9, 0],			//PEDSTAT_DIST_PLANE
		[10, 0],		//PEDSTAT_LONGEST_WHEELIE_DIST
		[11, 0],		//PEDSTAT_LONGEST_STOPPIE_DIST
		[12, 0],		//PEDSTAT_LONGEST_2WHEEL_DIST
		[13, 0],		//PEDSTAT_WEAPON_BUDGET
		[14, 0],		//PEDSTAT_FASHION_BUDGET
		[15, 0],		//PEDSTAT_PROPERTY_BUDGET
		[16, 0],		//PEDSTAT_SPRAYING_BUDGET
		[17, 0],		//PEDSTAT_LONGEST_WHEELIE_TIME
		[18, 0],		//PEDSTAT_LONGEST_STOPPIE_TIME
		[19, 0],		//PEDSTAT_LONGEST_2WHEEL_TIME
		[20, 0],		//PEDSTAT_FOOD_BUDGET
		[21, 0],		//PEDSTAT_FAT
		[22, 999999],	//PEDSTAT_STAMINA
		[23, 999999],	//PEDSTAT_BODY_MUSCLE
		[24, 999999],	//PEDSTAT_MAX_HEALTH
		[25, 999999],	//PEDSTAT_SEX_APPEAL
		[26, 0],		//PEDSTAT_DIST_SWIMMING
		[27, 0],		//PEDSTAT_DIST_CYCLE
		[28, 0],		//PEDSTAT_DIST_TREADMILL
		[29, 0],		//PEDSTAT_DIST_EXCERSISE_BIKE
		[30, 0],		//PEDSTAT_TATTOO_BUDGET
		[31, 0],		//PEDSTAT_HAIRDRESSING_BUDGET
		[33, 0],		//PEDSTAT_PROSTITUTE_BUDGET
		[35, 0],		//PEDSTAT_MONEY_SPENT_GAMBLING
		[36, 0],		//PEDSTAT_MONEY_MADE_PIMPING
		[37, 0],		//PEDSTAT_MONEY_WON_GAMBLING
		[38, 0],		//PEDSTAT_BIGGEST_GAMBLING_WIN
		[39, 0],		//PEDSTAT_BIGGEST_GAMBLING_LOSS
		[40, 0],		//PEDSTAT_LARGEST_BURGLARY_SWAG
		[41, 0],		//PEDSTAT_MONEY_MADE_BURGLARY
		[44, 0],		//PEDSTAT_LONGEST_TREADMILL_TIME
		[45, 0],		//PEDSTAT_LONGEST_EXCERSISE_BIKE_TIME
		[46, 0],		//PEDSTAT_HEAVIEST_WEIGHT_BENCH_PRESS
		[47, 0],		//PEDSTAT_HEAVIEST_WEIGHT_DUMBELLS
		[48, 0],		//PEDSTAT_BEST_TIME_HOTRING
		[49, 0],		//PEDSTAT_BEST_TIME_BMX
		[51, 0],		//PEDSTAT_LONGEST_CHASE_TIME
		[52, 0],		//PEDSTAT_LAST_CHASE_TIME
		[53, 0],		//PEDSTAT_WAGE_BILL
		[54, 0],		//PEDSTAT_STRIP_CLUB_BUDGET
		[55, 0],		//PEDSTAT_CAR_MOD_BUDGET
		[56, 0],		//PEDSTAT_TIME_SPENT_SHOPPING
		[62, 0],		//PEDSTAT_TOTAL_SHOPPING_BUDGET
		[63, 0],		//PEDSTAT_TIME_SPENT_UNDERWATER
		[64, 999999],	//PEDSTAT_RESPECT_TOTAL
		[65, 999999],	//PEDSTAT_RESPECT_GIRLFRIEND
		[66, 999999],	//PEDSTAT_RESPECT_CLOTHES
		[67, 999999],	//PEDSTAT_RESPECT_FITNESS
		[68, 999999],	//PEDSTAT_RESPECT
		[69, 999999],	//PEDSTAT_WEAPONTYPE_PISTOL_SKILL
		[70, 999999],	//PEDSTAT_WEAPONTYPE_PISTOL_SILENCED_SKILL
		[71, 999999],	//PEDSTAT_WEAPONTYPE_DESERT_EAGLE_SKILL
		[72, 999999],	//PEDSTAT_WEAPONTYPE_SHOTGUN_SKILL
		[73, 999999],	//PEDSTAT_WEAPONTYPE_SAWNOFF_SHOTGUN_SKILL
		[74, 999999],	//PEDSTAT_WEAPONTYPE_SPAS12_SHOTGUN_SKILL
		[75, 999999],	//PEDSTAT_WEAPONTYPE_MICRO_UZI_SKILL
		[76, 999999],	//PEDSTAT_WEAPONTYPE_MP5_SKILL
		[77, 999999],	//PEDSTAT_WEAPONTYPE_AK47_SKILL
		[78, 999999],	//PEDSTAT_WEAPONTYPE_M4_SKILL
		[79, 999999],	//PEDSTAT_WEAPONTYPE_SNIPERRIFLE_SKILL
		[80, 999999],	//PEDSTAT_SEX_APPEAL_CLOTHES
		[81, 999999],	//PEDSTAT_GAMBLING
		[120, 0],		//PEDSTAT_PEOPLE_KILLED_BY_OTHERS
		[121, 0],		//PEDSTAT_PEOPLE_KILLED_BY_PLAYER
		[122, 0],		//PEDSTAT_CARS_DESTROYED
		[123, 0],		//PEDSTAT_BOATS_DESTROYED
		[124, 0],		//PEDSTAT_HELICOPTORS_DESTROYED
		[125, 0],		//PEDSTAT_PROPERTY_DESTROYED
		[126, 0],		//PEDSTAT_ROUNDS_FIRED
		[127, 0],		//PEDSTAT_EXPLOSIVES_USED
		[128, 0],		//PEDSTAT_BULLETS_HIT
		[129, 0],		//PEDSTAT_TYRES_POPPED
		[130, 0],		//PEDSTAT_HEADS_POPPED
		[131, 0],		//PEDSTAT_WANTED_STARS_ATTAINED
		[132, 0],		//PEDSTAT_WANTED_STARS_EVADED
		[133, 0],		//PEDSTAT_TIMES_ARRESTED
		[134, 0],		//PEDSTAT_DAYS_PASSED
		[135, 0],		//PEDSTAT_TIMES_DIED
		[136, 0],		//PEDSTAT_TIMES_SAVED
		[137, 0],		//PEDSTAT_TIMES_CHEATED
		[138, 999999],	//PEDSTAT_SPRAYINGS
		[139, 0],		//PEDSTAT_MAX_JUMP_DISTANCE
		[140, 0],		//PEDSTAT_MAX_JUMP_HEIGHT
		[141, 0],		//PEDSTAT_MAX_JUMP_FLIPS
		[142, 0],		//PEDSTAT_MAX_JUMP_SPINS
		[143, 0],		//PEDSTAT_BEST_STUNT
		[144, 0],		//PEDSTAT_UNIQUE_JUMPS_FOUND
		[145, 0],		//PEDSTAT_UNIQUE_JUMPS_DONE
		[146, 0],		//PEDSTAT_MISSIONS_ATTEMPTED
		[147, 0],		//PEDSTAT_MISSIONS_PASSED
		[148, 999999],	//PEDSTAT_TOTAL_MISSIONS
		[149, 0],		//PEDSTAT_TAXI_MONEY_MADE
		[150, 999999],	//PEDSTAT_PASSENGERS_DELIVERED_IN_TAXI
		[151, 999999],	//PEDSTAT_LIVES_SAVED
		[152, 999999],	//PEDSTAT_CRIMINALS_CAUGHT
		[153, 999999],	//PEDSTAT_FIRES_EXTINGUISHED
		[154, 999999],	//PEDSTAT_PIZZAS_DELIVERED
		[155, 0],		//PEDSTAT_ASSASSINATIONS
		[156, 0],		//PEDSTAT_LATEST_DANCE_SCORE
		[157, 999999],	//PEDSTAT_VIGILANTE_LEVEL
		[158, 999999],	//PEDSTAT_AMBULANCE_LEVEL
		[159, 999999],	//PEDSTAT_FIREFIGHTER_LEVEL
		[160, 999999],	//PEDSTAT_DRIVING_SKILL
		[161, 999999],	//PEDSTAT_TRUCK_MISSIONS_PASSED
		[162, 999999],	//PEDSTAT_TRUCK_MONEY_MADE
		[163, 0],		//PEDSTAT_RECRUITED_GANG_MEMBERS_KILLED
		[164, 999999],	//PEDSTAT_ARMOUR
		[165, 999999],	//PEDSTAT_ENERGY
		[166, 0],		//PEDSTAT_PHOTOS_TAKEN
		[167, 0],		//PEDSTAT_KILL_FRENZIES_ATTEMPTED
		[168, 0],		//PEDSTAT_KILL_FRENZIES_PASSED
		[169, 0],		//PEDSTAT_FLIGHT_TIME
		[170, 0],		//PEDSTAT_TIMES_DROWNED
		[171, 0],		//PEDSTAT_NUM_GIRLS_PIMPED
		[172, 0],		//PEDSTAT_BEST_POSITION_HOTRING
		[173, 0],		//PEDSTAT_FLIGHT_TIME_JETPACK
		[174, 0],		//PEDSTAT_SHOOTING_RANGE_SCORE
		[175, 0],		//PEDSTAT_VALET_CARS_PARKED
		[176, 0],		//PEDSTAT_KILLS_SINCE_LAST_CHECKPOINT
		[177, 0],		//PEDSTAT_TOTAL_LEGITIMATE_KILLS
		[178, 0],		//PEDSTAT_BLOODRING_KILLS
		[179, 0],		//PEDSTAT_BLOODRING_TIME
		[180, 0],		//PEDSTAT_NO_MORE_HURRICANES
		[181, 999999],	//PEDSTAT_CITIES_PASSED
		[182, 0],		//PEDSTAT_POLICE_BRIBES
		[183, 0],		//PEDSTAT_CARS_STOLEN
		[184, 0],		//PEDSTAT_CURRENT_GIRLFRIENDS
		[185, 0],		//PEDSTAT_BAD_DATES
		[186, 0],		//PEDSTAT_GIRLS_DATED
		[187, 0],		//PEDSTAT_TIMES_SCORED_WITH_GIRL
		[188, 0],		//PEDSTAT_DATES
		[189, 0],		//PEDSTAT_GIRLS_DUMPED
		[190, 0],		//PEDSTAT_TIMES_VISITED_PROSTITUTE
		[191, 0],		//PEDSTAT_HOUSES_BURGLED
		[192, 0],		//PEDSTAT_SAFES_CRACKED
		[194, 0],		//PEDSTAT_STOLEN_ITEMS_SOLD
		[195, 0],		//PEDSTAT_EIGHT_BALLS_IN_POOL
		[196, 0],		//PEDSTAT_WINS_IN_POOL
		[197, 0],		//PEDSTAT_LOSSES_IN_POOL
		[198, 0],		//PEDSTAT_VISITS_TO_GYM
		[200, 0],		//PEDSTAT_MEALS_EATEN
		[225, 999999],	//PEDSTAT_UNDERWATER_STAMINA
		[229, 999999],	//PEDSTAT_BIKE_SKILL
		[230, 999999],	//PEDSTAT_CYCLE_SKILL
	],
	[
		[0, 999999],	//PEDSTAT_PROGRESS_MADE
		[1, 999999],	//PEDSTAT_TOTAL_PROGRESS
		[2, 0],			//PEDSTAT_LONGEST_BASKETBALL
		[3, 0],			//PEDSTAT_DIST_FOOT
		[4, 0],			//PEDSTAT_DIST_CAR
		[5, 0],			//PEDSTAT_DIST_BIKE
		[6, 0],			//PEDSTAT_DIST_BOAT
		[7, 0],			//PEDSTAT_DIST_GOLF_CART
		[8, 0],			//PEDSTAT_DIST_HELICOPTER
		[9, 0],			//PEDSTAT_DIST_PLANE
		[10, 0],		//PEDSTAT_LONGEST_WHEELIE_DIST
		[11, 0],		//PEDSTAT_LONGEST_STOPPIE_DIST
		[12, 0],		//PEDSTAT_LONGEST_2WHEEL_DIST
		[13, 0],		//PEDSTAT_WEAPON_BUDGET
		[14, 0],		//PEDSTAT_FASHION_BUDGET
		[15, 0],		//PEDSTAT_PROPERTY_BUDGET
		[16, 0],		//PEDSTAT_SPRAYING_BUDGET
		[17, 0],		//PEDSTAT_LONGEST_WHEELIE_TIME
		[18, 0],		//PEDSTAT_LONGEST_STOPPIE_TIME
		[19, 0],		//PEDSTAT_LONGEST_2WHEEL_TIME
		[20, 0],		//PEDSTAT_FOOD_BUDGET
		[21, 0],		//PEDSTAT_FAT
		[22, 999999],	//PEDSTAT_STAMINA
		[23, 999999],	//PEDSTAT_BODY_MUSCLE
		[24, 999999],	//PEDSTAT_MAX_HEALTH
		[25, 999999],	//PEDSTAT_SEX_APPEAL
		[26, 0],		//PEDSTAT_DIST_SWIMMING
		[27, 0],		//PEDSTAT_DIST_CYCLE
		[28, 0],		//PEDSTAT_DIST_TREADMILL
		[29, 0],		//PEDSTAT_DIST_EXCERSISE_BIKE
		[30, 0],		//PEDSTAT_TATTOO_BUDGET
		[31, 0],		//PEDSTAT_HAIRDRESSING_BUDGET
		[33, 0],		//PEDSTAT_PROSTITUTE_BUDGET
		[35, 0],		//PEDSTAT_MONEY_SPENT_GAMBLING
		[36, 0],		//PEDSTAT_MONEY_MADE_PIMPING
		[37, 0],		//PEDSTAT_MONEY_WON_GAMBLING
		[38, 0],		//PEDSTAT_BIGGEST_GAMBLING_WIN
		[39, 0],		//PEDSTAT_BIGGEST_GAMBLING_LOSS
		[40, 0],		//PEDSTAT_LARGEST_BURGLARY_SWAG
		[41, 0],		//PEDSTAT_MONEY_MADE_BURGLARY
		[44, 0],		//PEDSTAT_LONGEST_TREADMILL_TIME
		[45, 0],		//PEDSTAT_LONGEST_EXCERSISE_BIKE_TIME
		[46, 0],		//PEDSTAT_HEAVIEST_WEIGHT_BENCH_PRESS
		[47, 0],		//PEDSTAT_HEAVIEST_WEIGHT_DUMBELLS
		[48, 0],		//PEDSTAT_BEST_TIME_HOTRING
		[49, 0],		//PEDSTAT_BEST_TIME_BMX
		[51, 0],		//PEDSTAT_LONGEST_CHASE_TIME
		[52, 0],		//PEDSTAT_LAST_CHASE_TIME
		[53, 0],		//PEDSTAT_WAGE_BILL
		[54, 0],		//PEDSTAT_STRIP_CLUB_BUDGET
		[55, 0],		//PEDSTAT_CAR_MOD_BUDGET
		[56, 0],		//PEDSTAT_TIME_SPENT_SHOPPING
		[62, 0],		//PEDSTAT_TOTAL_SHOPPING_BUDGET
		[63, 0],		//PEDSTAT_TIME_SPENT_UNDERWATER
		[64, 999999],	//PEDSTAT_RESPECT_TOTAL
		[65, 999999],	//PEDSTAT_RESPECT_GIRLFRIEND
		[66, 999999],	//PEDSTAT_RESPECT_CLOTHES
		[67, 999999],	//PEDSTAT_RESPECT_FITNESS
		[68, 999999],	//PEDSTAT_RESPECT
		[69, 999999],	//PEDSTAT_WEAPONTYPE_PISTOL_SKILL
		[70, 999999],	//PEDSTAT_WEAPONTYPE_PISTOL_SILENCED_SKILL
		[71, 999999],	//PEDSTAT_WEAPONTYPE_DESERT_EAGLE_SKILL
		[72, 999999],	//PEDSTAT_WEAPONTYPE_SHOTGUN_SKILL
		[73, 999999],	//PEDSTAT_WEAPONTYPE_SAWNOFF_SHOTGUN_SKILL
		[74, 999999],	//PEDSTAT_WEAPONTYPE_SPAS12_SHOTGUN_SKILL
		[75, 999999],	//PEDSTAT_WEAPONTYPE_MICRO_UZI_SKILL
		[76, 999999],	//PEDSTAT_WEAPONTYPE_MP5_SKILL
		[77, 999999],	//PEDSTAT_WEAPONTYPE_AK47_SKILL
		[78, 999999],	//PEDSTAT_WEAPONTYPE_M4_SKILL
		[79, 999999],	//PEDSTAT_WEAPONTYPE_SNIPERRIFLE_SKILL
		[80, 999999],	//PEDSTAT_SEX_APPEAL_CLOTHES
		[81, 999999],	//PEDSTAT_GAMBLING
		[120, 0],		//PEDSTAT_PEOPLE_KILLED_BY_OTHERS
		[121, 0],		//PEDSTAT_PEOPLE_KILLED_BY_PLAYER
		[122, 0],		//PEDSTAT_CARS_DESTROYED
		[123, 0],		//PEDSTAT_BOATS_DESTROYED
		[124, 0],		//PEDSTAT_HELICOPTORS_DESTROYED
		[125, 0],		//PEDSTAT_PROPERTY_DESTROYED
		[126, 0],		//PEDSTAT_ROUNDS_FIRED
		[127, 0],		//PEDSTAT_EXPLOSIVES_USED
		[128, 0],		//PEDSTAT_BULLETS_HIT
		[129, 0],		//PEDSTAT_TYRES_POPPED
		[130, 0],		//PEDSTAT_HEADS_POPPED
		[131, 0],		//PEDSTAT_WANTED_STARS_ATTAINED
		[132, 0],		//PEDSTAT_WANTED_STARS_EVADED
		[133, 0],		//PEDSTAT_TIMES_ARRESTED
		[134, 0],		//PEDSTAT_DAYS_PASSED
		[135, 0],		//PEDSTAT_TIMES_DIED
		[136, 0],		//PEDSTAT_TIMES_SAVED
		[137, 0],		//PEDSTAT_TIMES_CHEATED
		[138, 999999],	//PEDSTAT_SPRAYINGS
		[139, 0],		//PEDSTAT_MAX_JUMP_DISTANCE
		[140, 0],		//PEDSTAT_MAX_JUMP_HEIGHT
		[141, 0],		//PEDSTAT_MAX_JUMP_FLIPS
		[142, 0],		//PEDSTAT_MAX_JUMP_SPINS
		[143, 0],		//PEDSTAT_BEST_STUNT
		[144, 0],		//PEDSTAT_UNIQUE_JUMPS_FOUND
		[145, 0],		//PEDSTAT_UNIQUE_JUMPS_DONE
		[146, 0],		//PEDSTAT_MISSIONS_ATTEMPTED
		[147, 0],		//PEDSTAT_MISSIONS_PASSED
		[148, 999999],	//PEDSTAT_TOTAL_MISSIONS
		[149, 0],		//PEDSTAT_TAXI_MONEY_MADE
		[150, 999999],	//PEDSTAT_PASSENGERS_DELIVERED_IN_TAXI
		[151, 999999],	//PEDSTAT_LIVES_SAVED
		[152, 999999],	//PEDSTAT_CRIMINALS_CAUGHT
		[153, 999999],	//PEDSTAT_FIRES_EXTINGUISHED
		[154, 999999],	//PEDSTAT_PIZZAS_DELIVERED
		[155, 0],		//PEDSTAT_ASSASSINATIONS
		[156, 0],		//PEDSTAT_LATEST_DANCE_SCORE
		[157, 999999],	//PEDSTAT_VIGILANTE_LEVEL
		[158, 999999],	//PEDSTAT_AMBULANCE_LEVEL
		[159, 999999],	//PEDSTAT_FIREFIGHTER_LEVEL
		[160, 999999],	//PEDSTAT_DRIVING_SKILL
		[161, 999999],	//PEDSTAT_TRUCK_MISSIONS_PASSED
		[162, 999999],	//PEDSTAT_TRUCK_MONEY_MADE
		[163, 0],		//PEDSTAT_RECRUITED_GANG_MEMBERS_KILLED
		[164, 999999],	//PEDSTAT_ARMOUR
		[165, 999999],	//PEDSTAT_ENERGY
		[166, 0],		//PEDSTAT_PHOTOS_TAKEN
		[167, 0],		//PEDSTAT_KILL_FRENZIES_ATTEMPTED
		[168, 0],		//PEDSTAT_KILL_FRENZIES_PASSED
		[169, 0],		//PEDSTAT_FLIGHT_TIME
		[170, 0],		//PEDSTAT_TIMES_DROWNED
		[171, 0],		//PEDSTAT_NUM_GIRLS_PIMPED
		[172, 0],		//PEDSTAT_BEST_POSITION_HOTRING
		[173, 0],		//PEDSTAT_FLIGHT_TIME_JETPACK
		[174, 0],		//PEDSTAT_SHOOTING_RANGE_SCORE
		[175, 0],		//PEDSTAT_VALET_CARS_PARKED
		[176, 0],		//PEDSTAT_KILLS_SINCE_LAST_CHECKPOINT
		[177, 0],		//PEDSTAT_TOTAL_LEGITIMATE_KILLS
		[178, 0],		//PEDSTAT_BLOODRING_KILLS
		[179, 0],		//PEDSTAT_BLOODRING_TIME
		[180, 0],		//PEDSTAT_NO_MORE_HURRICANES
		[181, 999999],	//PEDSTAT_CITIES_PASSED
		[182, 0],		//PEDSTAT_POLICE_BRIBES
		[183, 0],		//PEDSTAT_CARS_STOLEN
		[184, 0],		//PEDSTAT_CURRENT_GIRLFRIENDS
		[185, 0],		//PEDSTAT_BAD_DATES
		[186, 0],		//PEDSTAT_GIRLS_DATED
		[187, 0],		//PEDSTAT_TIMES_SCORED_WITH_GIRL
		[188, 0],		//PEDSTAT_DATES
		[189, 0],		//PEDSTAT_GIRLS_DUMPED
		[190, 0],		//PEDSTAT_TIMES_VISITED_PROSTITUTE
		[191, 0],		//PEDSTAT_HOUSES_BURGLED
		[192, 0],		//PEDSTAT_SAFES_CRACKED
		[194, 0],		//PEDSTAT_STOLEN_ITEMS_SOLD
		[195, 0],		//PEDSTAT_EIGHT_BALLS_IN_POOL
		[196, 0],		//PEDSTAT_WINS_IN_POOL
		[197, 0],		//PEDSTAT_LOSSES_IN_POOL
		[198, 0],		//PEDSTAT_VISITS_TO_GYM
		[200, 0],		//PEDSTAT_MEALS_EATEN
		[225, 999999],	//PEDSTAT_UNDERWATER_STAMINA
		[229, 999999],	//PEDSTAT_BIKE_SKILL
		[230, 999999],	//PEDSTAT_CYCLE_SKILL
	],
	[],
	[],
];

// ----------------------------------------------------------------------------

let vehicleUpgradeNames = {
	1000: "Pro Spoiler",
	1001: "Win Spoiler",
	1002: "Drag Spoiler",
	1003: "Alpha Spoiler",
	1004: "Champ Scoop Hood",
	1005: "Fury Scoop Hood",
	1006: "Roof Scoop Roof",
	1007: "Right Sideskirt",
	1008: "5x Nitro",
	1009: "2x Nitro",
	1010: "10x Nitro",
	1011: "Race Scoop Hood",
	1012: "Worx Scoop Hood",
	1013: "Round Fog Lamps",
	1014: "Champ Spoiler",
	1015: "Race Spoiler",
	1016: "Worx Spoiler",
	1017: "Left Sideskirt",
	1018: "Upswept Exhaust",
	1019: "Twin Exhaust",
	1020: "Large Exhaust",
	1021: "Medium Exhaust",
	1022: "Small Exhaust",
	1023: "Fury Spoiler",
	1024: "Square Fog Lamps",
	1025: "Offroad Wheels",
	1026: "Right Alien Sideskirt",
	1027: "Left Alien Sideskirt",
	1028: "Alien Exhaust",
	1029: "X-Flow Exhaust",
	1030: "Left X-Flow Sideskirt",
	1031: "Right X-Flow Sideskirt",
	1032: "Alien Roof Vent Roof",
	1033: "X-Flow Roof Vent Roof",
	1034: "Alien Exhaust",
	1035: "X-Flow Roof Vent Roof",
	1036: "Right Alien Sideskirt",
	1037: "X-Flow Exhaust",
	1038: "Alien Roof Vent Roof",
	1039: "Left X-Flow Sideskirt",
	1040: "Left Alien Sideskirt",
	1041: "Right X-Flow Sideskirt",
	1042: "Right Chrome Sideskirt",
	1043: "Slamin Exhaust",
	1044: "Chrome Exhaust",
	1045: "X-Flow Exhaust",
	1046: "Alien Exhaust",
	1047: "Right Alien Sideskirt",
	1048: "Right X-Flow Sideskirt",
	1049: "Alien Spoiler",
	1050: "X-Flow Spoiler",
	1051: "Left Alien Sideskirt",
	1052: "Left X-Flow Sideskirt",
	1053: "X-Flow Roof",
	1054: "Alien Roof",
	1055: "Alien Roof",
	1056: "Right Alien Sideskirt",
	1057: "Right X-Flow Sideskirt",
	1058: "Alien Spoiler",
	1059: "X-Flow Exhaust",
	1060: "X-Flow Spoiler",
	1061: "X-Flow Roof",
	1062: "Left Alien Sideskirt",
	1063: "Left X-Flow Sideskirt",
	1064: "Alien Exhaust",
	1065: "Alien Exhaust",
	1066: "X-Flow Exhaust",
	1067: "Alien Roof",
	1068: "X-Flow Roof",
	1069: "Right Alien Sideskirt",
	1070: "Right X-Flow Sideskirt",
	1071: "Left Alien Sideskirt",
	1072: "Left X-Flow Sideskirt",
	1073: "Shadow Wheels",
	1074: "Mega Wheels",
	1075: "Rimshine Wheels",
	1076: "Wires Wheels",
	1077: "Classic Wheels",
	1078: "Twist Wheels",
	1079: "Cutter Wheels",
	1080: "Switch Wheels",
	1081: "Grove Wheels",
	1082: "Import Wheels",
	1083: "Dollar Wheels",
	1084: "Trance Wheels",
	1085: "Atomic Wheels",
	1086: "Stereo Stereo",
	1087: "Hydraulics Hydraulics",
	1088: "Alien Roof",
	1089: "X-Flow Exhaust",
	1090: "Right Alien Sideskirt",
	1091: "X-Flow Roof",
	1092: "Alien Exhaust",
	1093: "Right X-Flow Sideskirt",
	1094: "Left Alien Sideskirt",
	1095: "Right X-Flow Sideskirt",
	1096: "Ahab Wheels",
	1097: "Virtual Wheels",
	1098: "Access Wheels",
	1099: "Left Chrome Sideskirt",
	1100: "Chrome Grill Bullbar",
	1101: "Left Chrome Flames Sideskirt",
	1102: "Left Chrome Strip Sideskirt",
	1103: "Covertible Roof",
	1104: "Chrome Exhaust",
	1105: "Slamin Exhaust",
	1106: "Right Chrome Arches Sideskirt",
	1107: "Left Chrome Strip Sideskirt",
	1108: "Right Chrome Strip Sideskirt",
	1109: "Chrome Rear Bullbars",
	1110: "Slamin Rear Bullbars",
	1113: "Chrome Exhaust",
	1114: "Slamin Exhaust",
	1115: "Chrome Front Bullbars",
	1116: "Slamin Front Bullbars",
	1117: "Chrome Front Bumper",
	1118: "Right Chrome Trim Sideskirt",
	1119: "Right Wheelcovers Sideskirt",
	1120: "Left Chrome Trim Sideskirt",
	1121: "Left Wheelcovers Sideskirt",
	1122: "Right Chrome Flames Sideskirt",
	1123: "Chrome Bars Bullbars",
	1124: "Left Chrome Arches Sideskirt",
	1125: "Chrome Lights Bullbars",
	1126: "Chrome Exhaust Exhaust",
	1127: "Slamin Exhaust Exhaust",
	1128: "Vinyl Hardtop Roof",
	1129: "Chrome Exhaust",
	1130: "Hardtop Roof",
	1131: "Softtop Roof",
	1132: "Slamin Exhaust",
	1133: "Right Chrome Strip Sideskirt",
	1134: "Right Chrome Strip Sideskirt",
	1135: "Slamin Exhaust",
	1136: "Chrome Exhaust",
	1137: "Left Chrome Strip Sideskirt",
	1138: "Alien Spoiler",
	1139: "X-Flow Spoiler",
	1140: "X-Flow Rear Bumper",
	1141: "Alien Rear Bumper",
	1142: "Left Oval Vents Vents",
	1143: "Right Oval Vents Vents",
	1144: "Left Square Vents Vents",
	1145: "Right Square Vents Vents",
	1146: "X-Flow Spoiler",
	1147: "Alien Spoiler",
	1148: "X-Flow Rear Bumper",
	1149: "Alien Rear Bumper",
	1150: "Alien Rear Bumper",
	1151: "X-Flow Rear Bumper",
	1152: "X-Flow Front Bumper",
	1153: "Alien Front Bumper",
	1154: "Alien Rear Bumper",
	1155: "Alien Front Bumper",
	1156: "X-Flow Rear Bumper",
	1157: "X-Flow Front Bumper",
	1158: "X-Flow Spoiler",
	1159: "Alien Rear Bumper",
	1160: "Alien Front Bumper",
	1161: "X-Flow Rear Bumper",
	1162: "Alien Spoiler",
	1163: "X-Flow Spoiler",
	1164: "Alien Spoiler",
	1165: "X-Flow Front Bumper",
	1166: "Alien Front Bumper",
	1167: "X-Flow Rear Bumper",
	1168: "Alien Rear Bumper",
	1169: "Alien Front Bumper",
	1170: "X-Flow Front Bumper",
	1171: "Alien Front Bumper",
	1172: "X-Flow Front Bumper",
	1173: "X-Flow Front Bumper",
	1174: "Chrome Front Bumper",
	1175: "Slamin Rear Bumper",
	1176: "Chrome Front Bumper",
	1177: "Slamin Rear Bumper",
	1178: "Slamin Rear Bumper",
	1179: "Chrome Front Bumper",
	1180: "Chrome Rear Bumper",
	1181: "Slamin Front Bumper",
	1182: "Chrome Front Bumper",
	1183: "Slamin Rear Bumper",
	1184: "Chrome Rear Bumper",
	1185: "Slamin Front Bumper",
	1186: "Slamin Rear Bumper",
	1187: "Chrome Rear Bumper",
	1188: "Slamin Front Bumper",
	1189: "Chrome Front Bumper",
	1190: "Slamin Front Bumper",
	1191: "Chrome Front Bumper",
	1192: "Chrome Rear Bumper",
	1193: "Slamin Rear Bumper"
}

// ----------------------------------------------------------------------------

let genderPossessivePronouns = [
	"his",
	"her",
	"their",
];

// ----------------------------------------------------------------------------

let genderObjectivePronouns = [
	"him",
	"her",
	"them",
];

// ----------------------------------------------------------------------------

function getGenderForSkin(skinId) {
	return 0;
}

// ----------------------------------------------------------------------------

function getGenderPossessivePronoun(genderId) {
	return genderPossessivePronouns[genderId];
}

// ----------------------------------------------------------------------------

function getGenderObjectivePronoun(genderId) {
	return genderObjectivePronouns[genderId];
}

// ----------------------------------------------------------------------------

let pedObjectiveNames = [
	false,
	[
		"No objective",
		"Wait on foot",
		"Flee on foot until safe",
		"Guard spot",
		"Guard area",
		"Wait in car",
		"Wait in car then get out",
		"Kill char on foot",
		"Kill char using any Means",
		"Flee from char on foot until safe",
		"Flee from char on foot",
		"Go to char on foot",
		"Follow char in formation",
		"Leave car",
		"Enter car as passenger",
		"Enter car as driver",
		"Follow car in car",
		"Fire at object from vehicle",
		"Destroy object",
		"Destroy car",
		"Go to area by any means",
		"Go to area on foot",
		"Run to area",
		"Go to area in car",
		"Follow car on foot with offset",
		"Guard attack",
		"Set leader",
		"Follow route",
		"Solicit",
		"Take taxi",
		"Catch train",
		"Buy ice cream",
		"Steal any car",
		"Mug char",
	]
];

// ----------------------------------------------------------------------------

let pedStateNames = [
	false,
	[
		"None",
		"Idle",
		"Look Entity",
		"Look Heading",
		"Wander Range",
		"Wander Path",
		"Seek Pos",
		"Seek Entity",
		"Flee Pos",
		"Flee Entity",
		"Pursue",
		"Follow Path",
		"Sniper Mode",
		"Rocket Mode",
		"Dummy",
		"Pause",
		"Attack",
		"Fight",
		"Face Phone",
		"Make Call",
		"Chat",
		"Mug",
		"AimGun",
		"AI Control",
		"Seek Car",
		"Seek InBoat",
		"Follow Route",
		"C.P.R.",
		"Solicit",
		"Buy IceCream",
		"Investigate",
		"Step away",
		"On Fire",
		"Unknown",
		"STATES_NO_AI",
		"Jump",
		"Fall",
		"GetUp",
		"Stagger",
		"Dive away",
		"STATES_NO_ST",
		"Enter Train",
		"Exit Train",
		"Arrest Plyr",
		"Driving",
		"Passenger",
		"Taxi Passngr",
		"Open Door",
		"Die",
		"Dead",
		"CarJack",
		"Drag fm Car",
		"Enter Car",
		"Steal Car",
		"Exit Car",
		"Hands Up",
		"Arrested",
	],
];

// ----------------------------------------------------------------------------

let pedWaitStateNames = [
	false,
	[
		"No Wait",
		"Traffic Lights",
		"Pause CrossRoad",
		"Look CrossRoad",
		"Look Ped",
		"Look Shop",
		"Look Accident",
		"FaceOff Gang",
		"Double Back",
		"Hit Wall",
		"Turn 180deg",
		"Surprised",
		"Ped Stuck",
		"Look About",
		"Play Duck",
		"Play Cower",
		"Play Taxi",
		"Play HandsUp",
		"Play HandsCower",
		"Play Chat",
		"Finish Flee",
	],
];

// ----------------------------------------------------------------------------

let seatNames = [
	"Driver",
	"Front Passenger",
	"Rear Left Passenger",
	"Rear Right Passenger",
	"Extra",
	"Extra",
	"Extra",
	"Extra",
];

// ----------------------------------------------------------------------------

let pedComponents = [
	null,
	[
		"Torso",
		"Ass",
		"Left Arm",
		"Right Arm",
		"Left leg",
		"Right leg",
		"Head",
	],

	[
		"Torso",
		"Ass",
		"Left Arm",
		"Right Arm",
		"Left leg",
		"Right leg",
		"Head",
	],

	[
		"Torso",
		"Ass",
		"Left Arm",
		"Right Arm",
		"Left leg",
		"Right leg",
		"Head",
	]
];

// ----------------------------------------------------------------------------

function getCurrentUnixTimestamp() {
	return new Date().getTime() / 1000;
}

// ----------------------------------------------------------------------------