-- ----------------------------------------------------------------------------

setErrorMode(RESOURCEERRORMODE_STRICT)

-- ----------------------------------------------------------------------------

addCommandHandler("lce", function(cmdName, params)
    if params ~= nil then
        message("Syntax: /lce <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game))
        return false;
    end
	
	pcall(load(params))
	
	outputChatBox("Lua client code executed: " .. params, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------

addCommandHandler("lcr", function(cmdName, params)
    if params ~= nil then
        message("Syntax: /lcr <code>", findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game))
        return false;
    end
	
	local output = { pcall(load("return " .. params)) }
	
	message("Lua client code executed: " .. output, COLOUR_AQUA)
	message("Returns: " .. output, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------