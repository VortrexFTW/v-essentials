local errorMessageColour = toColour(237, 67, 55, 255)
local syntaxMessageColour = toColour(200, 200, 200, 255)

-- ----------------------------------------------------------------------------

addCommandHandler("lce", function(cmdName, params)
    if params ~= nil then
        message("Syntax: /lce <code>", syntaxMessageColour)
        return false;
    end

	pcall(load(params))

	outputChatBox("Lua client code executed: " .. params, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------

addCommandHandler("lcr", function(cmdName, params)
    if params ~= nil then
        message("Syntax: /lcr <code>", syntaxMessageColour)
        return false;
    end

	local output = { pcall(load("return " .. params)) }

	message("Lua client code executed: " .. output, COLOUR_AQUA)
	message("Returns: " .. output, COLOUR_AQUA)
end)

-- ----------------------------------------------------------------------------