-- PURPOSE: Structured logs and error capture.
-- DEPENDENCIES: none.
-- WARNING: Capture errors, then stop unsafe work.
-- Expand this: add Discord-free screenshot-friendly fields.
-- SECURITY:
--   - Never log raw player input as a log key, sanitize first.
--   - Bound payload sizes before printing to avoid log floods.
--   - Forward to a server-only audit channel, never echo to clients.

local MODULE = 'debug_capture'

local function log(action, message)
    print(('[QUIET][%s][%s] %s'):format(MODULE, action, message))
end

local function capture(action, fn)
    local ok, result = pcall(fn)
    if not ok then
        log(action, result)
        log('trace', debug.traceback(result))
        return nil
    end
    return result
end

RegisterCommand('quiet_capture', function(source)
    capture('command', function()
        error(('forced error source=%s'):format(source))
    end)
end, false)
