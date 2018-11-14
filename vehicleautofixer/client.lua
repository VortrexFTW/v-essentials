addEventHandler('onResourceStart', function(event, resource)
    if resource ~= thisResource then return end
	
    setInterval(function()
		if not localPlayer then return end
        if not localPlayer.vehicle then return end
        localPlayer.vehicle:fix()
        if not localPlayer.vehicle.flipped then return end
        if flippingVehicle then return end
        flippingVehicle = true
        local v = localPlayer.vehicle.velocity
        local t = localPlayer.vehicle.turnVelocity
        localPlayer.vehicle.velocity = {v.x, v.y, v.z + 0.14}
        localPlayer.vehicle.turnVelocity = {t.x + 0.12, t.y - 0.11, t.z}
        setTimeout(function()
            localPlayer.vehicle:fix()
            flippingVehicle = false
        end, 1000)
    end, 100)
end)