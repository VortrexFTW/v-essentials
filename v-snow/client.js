"use strict";

// ===========================================================================

addNetworkHandler("v.snow", (fallingSnow, groundSnow) => {
	snowing = fallingSnow;
	snow.enabled = groundSnow;
});

// ===========================================================================