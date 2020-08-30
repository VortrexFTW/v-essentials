"use strict";

// ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT);

// ----------------------------------------------------------------------------

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
    gta.setZonePedInfo("mansion", true, PEDTYPE_GANG_DIAZ, 0, 0, 0, 0, 0, 0, 0, 0);	
    //gta.setZonePedInfo("Rich2", true, PEDTYPE_GANG_DIAZ, 0, 0, 0, 0, 0, 0, 0, 0);	
    //gta.setZonePedInfo("Rich3", true, PEDTYPE_GANG_DIAZ, 0, 0, 0, 0, 0, 0, 0, 0);	
});

// ----------------------------------------------------------------------------