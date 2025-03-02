"use strict";

// ----------------------------------------------------------------------------

addNetworkHandler("v.peddensity", (amount) => {
    natives.setPedDensityMultiplier(amount / 100);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.cardensity", (amount) => {
    natives.setRandomCarDensityMultiplier(amount / 100);
    natives.setCarDensityMultiplier(amount / 100);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.parkedcardensity", (amount) => {
    natives.setParkedCarDensityMultiplier(amount / 100);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.parkedcarnum", (amount) => {
    natives.overrideNumberOfParkedCars(amount);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.forcecloseparkedcars", (state) => {
    natives.forceGenerateParkedCarsTooCloseToOthers(state);
});

// ----------------------------------------------------------------------------

addNetworkHandler("v.dontsuppresscarmodels", (state) => {
    natives.dontSuppressAnyCarModels(state);
});

// ----------------------------------------------------------------------------