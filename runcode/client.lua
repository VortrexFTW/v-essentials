-- ----------------------------------------------------------------------------

addCommandHandler("lce", function(cmdName, params, client)
    if params ~= nil then
        outputChatBox("Syntax: /lce <code>", gameAnnounceColour[client.game], client)
        return false;
    end
	
	pcall(load(params))
	
	outputChatBox("Lua client code executed: " .. params, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------

addCommandHandler("lcr", function(cmdName, params, client)
    if params ~= nil then
        outputChatBox("Syntax: /lcr <code>", gameAnnounceColour[client.game], client)
        return false;
    end
	
	local output = { pcall(load("return " .. params)) }
	
	outputChatBox("Lua client code executed: " .. output, COLOUR_AQUA)
	outputChatBox("Returns: " .. output, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------