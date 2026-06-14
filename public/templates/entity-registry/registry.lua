-- PURPOSE: Track spawned entities and cleanup paths.
-- DEPENDENCIES: FiveM client runtime.
-- WARNING: Never spawn without a registry id and cleanup path.
-- Expand this: add timeout cleanup and ownership checks.
-- SECURITY:
--   - Validate id and entity handle before add or remove.
--   - Always pair add with onResourceStop cleanup, no orphans.
--   - Never expose the Registry table through net events.

local MODULE = 'registry'
local Registry = {}

local function log(action, message)
    print(('[QUIET][%s][%s] %s'):format(MODULE, action, message))
end

function Registry.add(id, entity)
    if not id or not entity or entity == 0 then return false end
    Registry[id] = entity
    log('track', ('id=%s entity=%s'):format(id, entity))
    return true
end

function Registry.cleanup(reason)
    for id, entity in pairs(Registry) do
        if type(entity) == 'number' and DoesEntityExist(entity) then
            DeleteEntity(entity)
        end
        log('cleanup', ('id=%s reason=%s'):format(id, reason or 'manual'))
        Registry[id] = nil
    end
end

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        Registry.cleanup('resource_stop')
    end
end)

return Registry
