-- PURPOSE: Shared structured logger.
-- DEPENDENCIES: none.
-- WARNING: Do not log secrets or tokens.
-- Expand this: add JSON encode when you need machine-readable logs.

local RESOURCE = GetCurrentResourceName()

Logger = {}

function Logger.info(moduleName, action, message)
    print(('[QUIET][%s:%s][%s] %s'):format(RESOURCE, moduleName, action, message))
end

function Logger.capture(moduleName, action, fn)
    local ok, result = pcall(fn)
    if not ok then
        Logger.info(moduleName, action, result)
        Logger.info(moduleName, 'trace', debug.traceback(result))
        return false, result
    end
    return true, result
end
