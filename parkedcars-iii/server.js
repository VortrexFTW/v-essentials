"use strict";

// ----------------------------------------------------------------------------

let serverGame = GAME_GTA_III;

// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource){
	if(resource == thisResource) {
		for(let i in defaultVehicles) {
			if(serverGame == defaultVehicles[i].game) {
				let position = new Vec3(defaultVehicles[i].x, defaultVehicles[i].y, defaultVehicles[i].z);
				let tempVehicle = createVehicle(defaultVehicles[i].model, position, defaultVehicles[i].game);
				tempVehicle.heading = degToRad(defaultVehicles[i].angle);	
				addToWorld(tempVehicle);
			}
		}
	}
});

// ----------------------------------------------------------------------------

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------

let defaultVehicles = [
	{
		model: 93,
		x: 899.685486,
		y: -982.686951,
		z: 5.630336,
		angle: 91.002457,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 93,
		x: 899.923950,
		y: -1001.270386,
		z: 5.630087,
		angle: 90.490974,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 853.539185,
		y: -993.613403,
		z: 4.905743,
		angle: 181.397751,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 863.287659,
		y: -993.456421,
		z: 4.906082,
		angle: 180.524109,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 856.557312,
		y: -993.474243,
		z: 4.854137,
		angle: 180.497910,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 911.220520,
		y: -895.586060,
		z: 15.186633,
		angle: 180.897873,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 917.335876,
		y: -895.728699,
		z: 14.854087,
		angle: 182.084503,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 109,
		x: 1007.027466,
		y: -838.403198,
		z: 14.768135,
		angle: 269.779572,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 1007.017273,
		y: -853.448730,
		z: 14.809337,
		angle: 270.861237,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 1027.545776,
		y: -869.316223,
		z: 15.022792,
		angle: 89.133621,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 1009.682800,
		y: -882.468384,
		z: 14.784637,
		angle: 0.293655,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 999.328979,
		y: -868.304626,
		z: 14.755670,
		angle: 269.255005,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 1119.076416,
		y: -770.655945,
		z: 14.889322,
		angle: 0.536764,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 1118.935181,
		y: -752.359985,
		z: 14.892718,
		angle: 180.078613,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 118,
		x: 1031.819946,
		y: -685.773865,
		z: 15.054727,
		angle: 89.952850,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 1118.961182,
		y: -761.724060,
		z: 14.843663,
		angle: 180.659836,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 116,
		x: 1138.763550,
		y: -639.757324,
		z: 14.756565,
		angle: 178.415436,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 116,
		x: 1140.163940,
		y: -689.655029,
		z: 14.757114,
		angle: 1.066017,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 117,
		x: 1172.872925,
		y: -649.191589,
		z: 18.933895,
		angle: 181.086472,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 116,
		x: 1150.002808,
		y: -690.763550,
		z: 14.767295,
		angle: 358.985687,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 106,
		x: 1139.635376,
		y: -630.700317,
		z: 15.029693,
		angle: 90.990067,
		col1: 1,
		col2: 3,
		game: 1
	},
	{
		model: 106,
		x: 1163.066284,
		y: -547.158691,
		z: 21.810535,
		angle: 91.758163,
		col1: 1,
		col2: 3,
		game: 1
	},
	{
		model: 111,
		x: 1426.343750,
		y: -795.461670,
		z: 11.678747,
		angle: 271.332275,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 104,
		x: 1425.926025,
		y: -786.820618,
		z: 11.891237,
		angle: 91.478363,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1407.437988,
		y: -791.024780,
		z: 11.702744,
		angle: 269.907196,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1407.713013,
		y: -799.661377,
		z: 11.702889,
		angle: 270.030548,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 146,
		x: 1599.393433,
		y: -635.688782,
		z: 11.959723,
		angle: 92.058052,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 145,
		x: 1593.621094,
		y: -682.870789,
		z: 12.227124,
		angle: 92.190086,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 130,
		x: 1562.547363,
		y: -732.558716,
		z: 11.899468,
		angle: 0.800919,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 103,
		x: 1582.225098,
		y: -733.001587,
		z: 11.974148,
		angle: 359.049011,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 146,
		x: 1544.286987,
		y: -845.950012,
		z: 11.959764,
		angle: 87.107864,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 146,
		x: 1544.129761,
		y: -854.117920,
		z: 11.959754,
		angle: 90.195145,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 138,
		x: 1533.324829,
		y: -897.855957,
		z: 11.919958,
		angle: 44.124512,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 138,
		x: 1521.873535,
		y: -898.124512,
		z: 11.919836,
		angle: 323.416687,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 93,
		x: 1393.151978,
		y: -1022.849731,
		z: 12.474370,
		angle: 91.487183,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 93,
		x: 1392.563599,
		y: -997.522644,
		z: 12.481201,
		angle: 91.151764,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 103,
		x: 1299.849609,
		y: -797.720154,
		z: 15.179893,
		angle: 226.719543,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 104,
		x: 1298.421509,
		y: -785.640991,
		z: 15.090947,
		angle: 225.281464,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 96,
		x: 1328.248047,
		y: -642.237244,
		z: 12.450732,
		angle: 179.728699,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 96,
		x: 1315.720703,
		y: -642.230469,
		z: 12.450625,
		angle: 179.953445,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 1281.866455,
		y: -619.863831,
		z: 11.941912,
		angle: 179.099396,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 1269.730469,
		y: -620.282288,
		z: 12.007009,
		angle: 178.634552,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 102,
		x: 1223.351318,
		y: -325.587555,
		z: 26.128830,
		angle: 179.241486,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1304.164795,
		y: -319.001129,
		z: 41.924671,
		angle: 89.353958,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1303.641602,
		y: -308.303345,
		z: 41.852234,
		angle: 87.416809,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 134,
		x: 1406.802002,
		y: -176.778687,
		z: 50.204453,
		angle: 123.620781,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 134,
		x: 1403.716553,
		y: -169.844482,
		z: 50.708321,
		angle: 89.193161,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 99,
		x: 1407.667725,
		y: -159.138641,
		z: 52.450211,
		angle: 228.065033,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 1339.125122,
		y: -258.721680,
		z: 49.483433,
		angle: 267.936798,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 1338.847534,
		y: -251.637985,
		z: 49.471149,
		angle: 266.667908,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 1234.111084,
		y: -127.501678,
		z: 14.643055,
		angle: 38.975185,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 1213.226929,
		y: -135.674988,
		z: 14.642642,
		angle: 358.120483,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 105,
		x: 1227.491821,
		y: -135.748474,
		z: 14.687285,
		angle: 359.346100,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 92,
		x: 1220.382935,
		y: -135.429550,
		z: 14.716208,
		angle: 358.446960,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 1217.235596,
		y: -64.424828,
		z: 10.608971,
		angle: 174.605301,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 97,
		x: 1107.081909,
		y: -37.197128,
		z: 7.689183,
		angle: 269.199646,
		col1: 3,
		col2: 6,
		game: 1
	},
	{
		model: 97,
		x: 1107.461792,
		y: -47.565941,
		z: 7.690558,
		angle: 270.234924,
		col1: 3,
		col2: 6,
		game: 1
	},
	{
		model: 97,
		x: 1107.861694,
		y: -58.022919,
		z: 7.689965,
		angle: 270.509277,
		col1: 3,
		col2: 6,
		game: 1
	},
	{
		model: 111,
		x: 1138.967407,
		y: -95.737579,
		z: 7.324986,
		angle: 0.599858,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 1144.595825,
		y: -95.232040,
		z: 7.206669,
		angle: 0.294929,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 1168.526733,
		y: -149.803665,
		z: 14.806578,
		angle: 1.767537,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 1162.685913,
		y: -149.648285,
		z: 14.808973,
		angle: 1.717941,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 1102.075317,
		y: -150.150940,
		z: 9.921660,
		angle: 359.002930,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1091.270142,
		y: -150.340881,
		z: 9.776370,
		angle: 359.531830,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 1084.203735,
		y: -150.638062,
		z: 9.951312,
		angle: 357.580444,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 130,
		x: 1103.113892,
		y: 44.520744,
		z: -0.462722,
		angle: 270.541382,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 130,
		x: 1160.882813,
		y: 71.532959,
		z: -0.491825,
		angle: 182.201187,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 148,
		x: 933.311157,
		y: -62.014809,
		z: 8.298782,
		angle: 89.605278,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 148,
		x: 933.008118,
		y: -56.367550,
		z: 8.195342,
		angle: 89.239746,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 983.707031,
		y: -65.923210,
		z: 7.199186,
		angle: 1.950121,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 972.733704,
		y: -65.754211,
		z: 7.234806,
		angle: 2.386916,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 982.591553,
		y: -35.550037,
		z: 7.142753,
		angle: 90.046997,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 98,
		x: 1296.325806,
		y: -104.488014,
		z: 15.634721,
		angle: 0.702096,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 98,
		x: 1296.717529,
		y: -63.741852,
		z: 15.065326,
		angle: 176.442963,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 1275.899414,
		y: -80.534706,
		z: 14.835246,
		angle: 265.599731,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 130,
		x: 1259.251465,
		y: -109.663589,
		z: 15.011135,
		angle: 269.229523,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 866.673645,
		y: -993.222351,
		z: 4.788096,
		angle: 179.945038,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 133,
		x: 862.506592,
		y: -783.176086,
		z: 15.080477,
		angle: 1.030223,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 929.502686,
		y: -793.507263,
		z: 15.059978,
		angle: 89.552620,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 132,
		x: 982.432739,
		y: -753.024414,
		z: 15.070170,
		angle: 179.868973,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 1009.447327,
		y: -756.241638,
		z: 14.705210,
		angle: 88.464691,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 133,
		x: 915.410156,
		y: -676.669006,
		z: 15.080456,
		angle: 90.238846,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 133,
		x: 905.782043,
		y: -543.133545,
		z: 15.080473,
		angle: 181.060654,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 132,
		x: 860.763794,
		y: -543.133789,
		z: 15.070292,
		angle: 180.418808,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 963.200806,
		y: -592.432434,
		z: 14.849867,
		angle: 46.592903,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 144,
		x: 1029.152832,
		y: -415.963562,
		z: 15.076999,
		angle: 180.778656,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 144,
		x: 1020.082947,
		y: -416.706146,
		z: 15.090176,
		angle: 181.385529,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 972.893860,
		y: -412.571014,
		z: 14.818968,
		angle: 180.691208,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 973.076660,
		y: -429.891571,
		z: 14.750610,
		angle: 0.086815,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 134,
		x: 882.589417,
		y: -425.912994,
		z: 14.594674,
		angle: 271.375336,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 137,
		x: 938.151672,
		y: -134.496140,
		z: 4.774425,
		angle: 90.523468,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 137,
		x: 988.580688,
		y: -117.933914,
		z: 4.804749,
		angle: 356.604340,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 137,
		x: 1009.500366,
		y: -141.094315,
		z: 4.752908,
		angle: 179.442841,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 137,
		x: 970.970276,
		y: -279.592560,
		z: 4.745578,
		angle: 315.948944,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 924.238098,
		y: -271.731293,
		z: 4.701499,
		angle: 2.989154,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 862.344177,
		y: -192.622070,
		z: 3.627838,
		angle: 179.676865,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 863.021118,
		y: -228.221298,
		z: 4.606875,
		angle: 0.324889,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 887.141113,
		y: -312.845093,
		z: 8.556511,
		angle: 89.724808,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 850.888428,
		y: -378.878265,
		z: 13.183514,
		angle: 90.351051,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1344.004761,
		y: -449.090057,
		z: 49.676369,
		angle: 180.141830,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 1336.202881,
		y: -458.110077,
		z: 49.583233,
		angle: 270.896942,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 1349.769897,
		y: -448.824005,
		z: 49.642445,
		angle: 180.105362,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 1335.678711,
		y: -452.116241,
		z: 49.481022,
		angle: 270.229004,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 110,
		x: 1255.563721,
		y: -741.230103,
		z: 14.918591,
		angle: 132.649231,
		col1: 6,
		col2: 6,
		game: 1
	},
	{
		model: 128,
		x: 1219.641724,
		y: -733.640442,
		z: 15.116159,
		angle: 226.281693,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 128,
		x: 1247.137939,
		y: -761.391418,
		z: 15.116304,
		angle: 46.204906,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 110,
		x: 1249.344727,
		y: -708.794128,
		z: 14.918915,
		angle: 134.617447,
		col1: 6,
		col2: -1,
		game: 1
	},
	{
		model: 104,
		x: 1188.105103,
		y: -797.247437,
		z: 14.704457,
		angle: 315.600677,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 104,
		x: 1250.012207,
		y: -803.346985,
		z: 14.858762,
		angle: 46.048855,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 1238.713501,
		y: -896.509277,
		z: 14.951050,
		angle: 315.767151,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 1234.962646,
		y: -893.055481,
		z: 14.901079,
		angle: 313.787720,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 110,
		x: 1219.973389,
		y: -877.942749,
		z: 14.914667,
		angle: 0.000000,
		col1: 6,
		col2: 6,
		game: 1
	},
	{
		model: 100,
		x: 1223.496826,
		y: -881.460693,
		z: 14.833053,
		angle: 315.241882,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 109,
		x: 1227.000366,
		y: -891.818726,
		z: 14.914764,
		angle: 359.388855,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 114,
		x: 1180.270020,
		y: -854.728455,
		z: 15.051239,
		angle: 222.996017,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 127,
		x: 1259.852539,
		y: -999.273499,
		z: 14.964811,
		angle: 225.236404,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 127,
		x: 1280.697998,
		y: -978.082825,
		z: 14.968919,
		angle: 225.955765,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 1114.359985,
		y: -1112.543091,
		z: 11.737145,
		angle: 359.740967,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 103,
		x: 1101.898315,
		y: -969.981018,
		z: 15.097425,
		angle: 89.119972,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 130,
		x: 1101.684570,
		y: -989.921631,
		z: 14.992412,
		angle: 88.804382,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 1041.111694,
		y: -1014.855957,
		z: 14.989468,
		angle: 179.330383,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 1035.306519,
		y: -1014.582031,
		z: 15.035249,
		angle: 178.987427,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 102,
		x: 1029.436401,
		y: -1015.026062,
		z: 14.907290,
		angle: 177.543060,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 98,
		x: 964.610107,
		y: -1117.634888,
		z: 13.757401,
		angle: 91.815620,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 132,
		x: 948.659729,
		y: -1142.477051,
		z: 13.270652,
		angle: 1.565251,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 132,
		x: 1011.937439,
		y: -1083.442627,
		z: 13.270575,
		angle: 179.587952,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 979.524963,
		y: -1101.953491,
		z: 13.049855,
		angle: 89.646790,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 113,
		x: 1231.415039,
		y: -1116.509644,
		z: 11.866262,
		angle: 89.036316,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 113,
		x: 1231.138916,
		y: -1142.883667,
		z: 11.866562,
		angle: 89.565804,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 120,
		x: 837.978210,
		y: -1114.365112,
		z: -0.303520,
		angle: 139.569916,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 106,
		x: 198.187485,
		y: -41.033833,
		z: 16.428688,
		angle: 0.536481,
		col1: 1,
		col2: 3,
		game: 1
	},
	{
		model: 106,
		x: 189.407867,
		y: -41.017208,
		z: 16.428720,
		angle: 359.060242,
		col1: 1,
		col2: 3,
		game: 1
	},
	{
		model: 111,
		x: 192.829819,
		y: -7.803713,
		z: 16.428629,
		angle: 0.000000,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 106,
		x: 216.608704,
		y: -41.099819,
		z: 16.428713,
		angle: 0.798101,
		col1: 1,
		col2: 3,
		game: 1
	},
	{
		model: 106,
		x: 225.275497,
		y: -41.115940,
		z: 16.428490,
		angle: 359.929871,
		col1: 1,
		col2: 3,
		game: 1
	},
	{
		model: 91,
		x: 240.182327,
		y: -42.302246,
		z: 16.017197,
		angle: 0.380768,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 249.051376,
		y: -42.541130,
		z: 16.237532,
		angle: 0.763730,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 257.736237,
		y: -42.383423,
		z: 16.286188,
		angle: 358.054474,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 266.696320,
		y: -42.478638,
		z: 16.069185,
		angle: 359.992218,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 280.391937,
		y: -35.392746,
		z: 16.093712,
		angle: 327.293610,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 102,
		x: 293.525787,
		y: -35.341278,
		z: 16.155647,
		angle: 327.098755,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 306.562775,
		y: -35.524170,
		z: 15.951353,
		angle: 326.376343,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 319.836914,
		y: -35.453030,
		z: 16.045732,
		angle: 328.495087,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 359.274048,
		y: -13.650924,
		z: 15.950730,
		angle: 89.430008,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 109,
		x: 359.325165,
		y: -4.969449,
		z: 16.024355,
		angle: 88.948654,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 359.533966,
		y: 3.622857,
		z: 16.286491,
		angle: 88.294098,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 130,
		x: 359.162201,
		y: 12.523818,
		z: 16.290653,
		angle: 89.474442,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 347.341187,
		y: 16.997940,
		z: 16.283146,
		angle: 269.103668,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 92,
		x: 347.360870,
		y: 8.171234,
		z: 15.876356,
		angle: 270.410370,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 102,
		x: 347.655121,
		y: -0.734090,
		z: 16.155252,
		angle: 269.665649,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 347.654022,
		y: -9.597571,
		z: 15.950905,
		angle: 271.534088,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 339.999908,
		y: -13.591389,
		z: 16.045937,
		angle: 90.404724,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 339.915558,
		y: 3.647541,
		z: 16.016830,
		angle: 88.571297,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 96,
		x: 340.049316,
		y: -5.054552,
		z: 16.460169,
		angle: 90.438171,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 101,
		x: 340.233337,
		y: 12.623102,
		z: 15.872455,
		angle: 89.457512,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 276.204254,
		y: -19.109938,
		z: 15.802897,
		angle: 329.868530,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 109,
		x: 284.950317,
		y: -19.139242,
		z: 16.025166,
		angle: 327.780731,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 293.727203,
		y: -19.225977,
		z: 15.950539,
		angle: 328.321533,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 102,
		x: 302.460815,
		y: -19.085920,
		z: 16.155262,
		angle: 327.483521,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 311.051819,
		y: -19.431501,
		z: 15.951204,
		angle: 327.521210,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 320.071716,
		y: -18.884907,
		z: 16.045408,
		angle: 328.370209,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 280.892883,
		y: -7.334027,
		z: 16.017401,
		angle: 213.748657,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 289.137878,
		y: -6.638809,
		z: 16.236187,
		angle: 212.498611,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 298.360046,
		y: -7.000920,
		z: 16.286818,
		angle: 212.322281,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 307.103394,
		y: -7.217334,
		z: 16.093508,
		angle: 211.495377,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 105,
		x: 315.579315,
		y: -6.913690,
		z: 15.847579,
		angle: 213.899414,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 110,
		x: 276.072693,
		y: -0.255837,
		z: 15.964647,
		angle: 328.056519,
		col1: 6,
		col2: 6,
		game: 1
	},
	{
		model: 100,
		x: 284.884460,
		y: -0.580430,
		z: 15.951069,
		angle: 329.128174,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 101,
		x: 293.667542,
		y: -0.400611,
		z: 15.872426,
		angle: 329.807159,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 302.532867,
		y: -0.350910,
		z: 16.046869,
		angle: 328.741455,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 311.138336,
		y: -0.565037,
		z: 16.237343,
		angle: 328.557343,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 319.763184,
		y: -0.466090,
		z: 15.803441,
		angle: 329.387665,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 280.770233,
		y: 11.925605,
		z: 16.069162,
		angle: 211.061905,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 108,
		x: 289.241730,
		y: 12.168477,
		z: 16.237442,
		angle: 213.363464,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 298.070435,
		y: 12.270171,
		z: 16.283009,
		angle: 213.682785,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 103,
		x: 306.955139,
		y: 11.981171,
		z: 16.365393,
		angle: 213.578629,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 96,
		x: 315.767578,
		y: 11.772416,
		z: 16.460869,
		angle: 213.459259,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 96,
		x: 230.177109,
		y: -996.569031,
		z: 22.999741,
		angle: 91.241302,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 117,
		x: 391.050873,
		y: -1124.316406,
		z: 16.033298,
		angle: 89.610458,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 117,
		x: 391.089111,
		y: -1145.406372,
		z: 15.916076,
		angle: 91.587257,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 107,
		x: 386.703003,
		y: -1185.942383,
		z: 15.855822,
		angle: 89.450981,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 107,
		x: 386.183899,
		y: -1174.553223,
		z: 15.854801,
		angle: 89.311775,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 107,
		x: 386.027405,
		y: -1163.712891,
		z: 15.779618,
		angle: 90.876732,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 116,
		x: 344.965698,
		y: -1173.957886,
		z: 22.764099,
		angle: 1.883307,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 116,
		x: 354.681396,
		y: -1173.529663,
		z: 22.764559,
		angle: 1.075425,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 116,
		x: 363.458527,
		y: -1173.369385,
		z: 22.765583,
		angle: 359.760986,
		col1: 2,
		col2: 1,
		game: 1
	},
	{
		model: 136,
		x: 442.233215,
		y: -1464.873047,
		z: 18.315411,
		angle: 180.017548,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 136,
		x: 455.498535,
		y: -1465.370728,
		z: 18.329630,
		angle: 178.676071,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 136,
		x: 468.986877,
		y: -1465.752319,
		z: 18.344324,
		angle: 178.334000,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 476.689789,
		y: -1495.002075,
		z: 18.278263,
		angle: 90.017838,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 423.503632,
		y: -1512.576660,
		z: 18.513798,
		angle: 13.958630,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 434.561829,
		y: -1509.681519,
		z: 18.500977,
		angle: 13.033280,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 105,
		x: 444.998444,
		y: -1506.892456,
		z: 18.290091,
		angle: 12.358222,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 101,
		x: 453.716797,
		y: -1504.156738,
		z: 18.324062,
		angle: 14.019069,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 105,
		x: 204.196243,
		y: -1236.236084,
		z: 20.090862,
		angle: 0.335040,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 101,
		x: 229.546448,
		y: -1236.273193,
		z: 20.101862,
		angle: 1.557856,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 111,
		x: 233.151581,
		y: -1236.186768,
		z: 20.296951,
		angle: 0.011989,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 90,
		x: 259.515625,
		y: -1228.043579,
		z: 20.525351,
		angle: 90.982666,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 91,
		x: 259.384399,
		y: -1217.588379,
		z: 20.260563,
		angle: 89.750725,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 96,
		x: 259.308624,
		y: -1207.290527,
		z: 20.703854,
		angle: 93.055618,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 102,
		x: 259.132050,
		y: -1196.751831,
		z: 20.399321,
		angle: 90.138054,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 258.938019,
		y: -1186.597290,
		z: 20.530996,
		angle: 90.854530,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 92,
		x: 259.105377,
		y: -1178.120605,
		z: 20.120548,
		angle: 89.685165,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 109,
		x: 247.507065,
		y: -1172.460693,
		z: 20.268641,
		angle: 179.442505,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 100,
		x: 230.926468,
		y: -1171.792603,
		z: 20.195524,
		angle: 180.077087,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 214.251434,
		y: -1172.003418,
		z: 20.047459,
		angle: 180.746643,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 217.246643,
		y: -1172.027588,
		z: 20.047186,
		angle: 179.653305,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 118,
		x: 88.253929,
		y: -1563.964966,
		z: 23.967014,
		angle: 87.753334,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 128,
		x: 169.728745,
		y: -1581.333252,
		z: 26.110052,
		angle: 178.797241,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 128,
		x: 162.074783,
		y: -1581.098389,
		z: 26.112556,
		angle: 358.900299,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 110,
		x: 134.708710,
		y: -1586.352051,
		z: 25.916710,
		angle: 1.068009,
		col1: 6,
		col2: 6,
		game: 1
	},
	{
		model: 110,
		x: 127.009468,
		y: -1586.639893,
		z: 25.916607,
		angle: 179.888245,
		col1: 6,
		col2: 6,
		game: 1
	},
	{
		model: 92,
		x: -39.855141,
		y: -367.131622,
		z: 15.827713,
		angle: 90.262047,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: -40.255939,
		y: -361.319275,
		z: 16.236162,
		angle: 89.331009,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: -40.186680,
		y: -355.454803,
		z: 15.754055,
		angle: 89.270050,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 136,
		x: 527.882263,
		y: -660.496582,
		z: 15.788485,
		angle: 359.364197,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 129,
		x: 490.469360,
		y: -614.964233,
		z: 15.993381,
		angle: 91.317863,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: 476.510162,
		y: -734.984558,
		z: 15.725359,
		angle: 269.718445,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 122,
		x: 131.271805,
		y: 173.620071,
		z: 11.729194,
		angle: 359.276764,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 122,
		x: 143.707092,
		y: 174.305573,
		z: 11.729199,
		angle: 359.919342,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 123,
		x: 182.045761,
		y: 220.581863,
		z: 11.928376,
		angle: 92.666786,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 112,
		x: 147.596527,
		y: 239.964737,
		z: 11.602187,
		angle: 270.039307,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 94,
		x: 185.775177,
		y: 59.763416,
		z: 15.940124,
		angle: 90.617531,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 185.675461,
		y: 65.938080,
		z: 16.034285,
		angle: 89.995712,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 120,
		x: 535.236694,
		y: -1059.315796,
		z: -0.561891,
		angle: 181.841904,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 142,
		x: 535.605530,
		y: -1033.739990,
		z: -0.690743,
		angle: 355.836823,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 143,
		x: 510.369537,
		y: -1034.104614,
		z: -0.691109,
		angle: 0.203791,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 142,
		x: 508.423737,
		y: -1060.876343,
		z: -0.751072,
		angle: 182.480637,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 143,
		x: 540.413574,
		y: -765.195313,
		z: -0.173762,
		angle: 357.188721,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 120,
		x: 555.687256,
		y: -790.594482,
		z: -0.426718,
		angle: 180.566177,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 142,
		x: 593.181458,
		y: -768.271484,
		z: -0.933142,
		angle: 359.953491,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 143,
		x: 555.953552,
		y: -688.584839,
		z: -0.659236,
		angle: 178.392532,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 292.704071,
		y: -669.143005,
		z: 25.996965,
		angle: 90.365517,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: 292.730652,
		y: -642.690552,
		z: 25.997812,
		angle: 88.820564,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 95,
		x: -896.208984,
		y: -417.358521,
		z: 10.946950,
		angle: 270.451843,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 119,
		x: -896.640259,
		y: -398.236023,
		z: 10.704457,
		angle: 270.303955,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -1268.214355,
		y: -513.988281,
		z: 11.676908,
		angle: 175.805313,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -1527.306396,
		y: -896.465881,
		z: 11.663596,
		angle: 249.180099,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -1528.074951,
		y: -904.746033,
		z: 11.670075,
		angle: 250.724426,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -1528.533569,
		y: -912.677185,
		z: 11.663365,
		angle: 249.513931,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -1528.929443,
		y: -920.280884,
		z: 11.669951,
		angle: 249.308365,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -845.904236,
		y: -750.265015,
		z: 11.322309,
		angle: 150.165100,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -877.940613,
		y: -758.677551,
		z: 11.428686,
		angle: 220.696365,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 126,
		x: -1142.291870,
		y: -784.704041,
		z: 11.677113,
		angle: 179.286209,
		col1: -1,
		col2: -1,
		game: 1
	},
];

// ----------------------------------------------------------------------------