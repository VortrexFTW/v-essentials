local errorMessageColour = toColour(237, 67, 55, 255)
local syntaxMessageColour = toColour(200, 200, 200, 255)

-- ----------------------------------------------------------------------------

addCommandHandler("lse", function(cmdName, params, client)
	if client.administrator == false then
		return false
	end

    if params == nil then
        messageClient("Syntax: /lse <code>", client, syntaxMessageColour)
        return false;
    end

	pcall(load(params))

	print("Lua server code executed: " .. output)

	messageClient("Lua server code executed: " .. params, client, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------

addCommandHandler("lsr", function(cmdName, params, client)
	if client.administrator == false then
		return false
	end

    if params == nil then
        messageClient("Syntax: /lsr <code>", client, syntaxMessageColour)
        return false;
    end

	local output = pcall(load("return " .. params))

	print("Lua server code executed: " .. output)
	print("Returns: " .. output)

	messageClient("Lua server code executed: " .. output, COLOUR_AQUA)
	messageClient("Returns: " .. output, client, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------