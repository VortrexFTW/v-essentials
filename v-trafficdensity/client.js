"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("peddensity", (amount) => {
    natives.setPedDensityMultiplier(amount/100);
});

// ----------------------------------------------------------------------------

addNetworkHandler("cardensity", (amount) => {
    natives.setRandomCarDensityMultiplier(amount/100);
    natives.setCarDensityMultiplier(amount/100);
});

// ----------------------------------------------------------------------------

addNetworkHandler("parkedcardensity", (amount) => {
    natives.setParkedCarDensityMultiplier(amount/100);
});

// ----------------------------------------------------------------------------

addNetworkHandler("parkedcarnum", (amount) => {
    natives.overrideNumberOfParkedCars(amount);
});

// ----------------------------------------------------------------------------

addNetworkHandler("forcecloseparkedcars", (state) => {
    natives.forceGenerateParkedCarsTooCloseToOthers(state);
});

// ----------------------------------------------------------------------------

addNetworkHandler("dontsuppresscarmodels", (state) => {
    natives.dontSuppressAnyCarModels(state);
});

// ----------------------------------------------------------------------------