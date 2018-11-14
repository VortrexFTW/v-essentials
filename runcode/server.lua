outputColor = COLOUR_AQUA
syntaxMessageColour = COLOUR_SILVER

-- ----------------------------------------------------------------------------

addCommandHandler("lse", function(cmdName, params, client)
    if params == nil then
        messageClient("Syntax: /lse <code>", client, syntaxMessageColour)
        return false;
    end
	
	pcall(load(params))
	
	messageClient("Lua server code executed: " .. params, client, outputColor)
end)

-- ----------------------------------------------------------------------------

addCommandHandler("lsr", function(cmdName, params, client)
    if params == nil then
        messageClient("Syntax: /lsr <code>", client, syntaxMessageColour)
        return false;
    end
	
	local output = pcall(load("return " .. params))
	
	messageClient("Lua server code executed: " .. output, outputColor)
	messageClient("Returns: " .. output, client, outputColor)
end)

-- ----------------------------------------------------------------------------