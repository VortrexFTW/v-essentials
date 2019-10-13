-- ----------------------------------------------------------------------------

addCommandHandler("lse", function(cmdName, params, client)
	if client.administrator == false then
		return false
	end

    if params == nil then
        messageClient("Syntax: /lse <code>", client, findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game))
        return false;
    end
	
	pcall(load(params))
	
	messageClient("Lua server code executed: " .. params, client, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------

addCommandHandler("lsr", function(cmdName, params, client)
	if client.administrator == false then
		return false
	end

    if params == nil then
        messageClient("Syntax: /lsr <code>", client, findResourceByName("v-utils").exports.getSyntaxMessageColour(gta.game))
        return false;
    end
	
	local output = pcall(load("return " .. params))
	
	messageClient("Lua server code executed: " .. output, COLOUR_AQUA)
	messageClient("Returns: " .. output, client, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------