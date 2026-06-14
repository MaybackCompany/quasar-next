-- PURPOSE: Add and remove ox_target interaction.
-- DEPENDENCIES: ox_target, ox_lib optional.
-- WARNING: Target selection is not permission validation.
-- Expand this: validate the action on the server.
-- SECURITY:
--   - Target selection is presentation only, permission lives on the server.
--   - Always send the action through a net event for server validation.
--   - Remove options on resource stop to avoid stale interactions.

local MODULE = 'ox_target'
local targetName = 'quasar_demo_target'

exports.ox_target:addGlobalVehicle({
    name = targetName,
    label = 'Check vehicle',
    icon = 'fa-solid fa-car',
    onSelect = function(data)
        print(('[QUIET][%s][select] entity=%s'):format(MODULE, data.entity))
        TriggerServerEvent('quasar:target:validate', { netId = VehToNet(data.entity) })
    end
})

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        exports.ox_target:removeGlobalVehicle(targetName)
        print(('[QUIET][%s][cleanup] removed target'):format(MODULE))
    end
end)
