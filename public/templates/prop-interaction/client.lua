-- PURPOSE: Spawn one prop, expose one interaction point, and clean it up.
-- DEPENDENCIES: FiveM client runtime. ox_target is optional.
-- WARNING: Do not grant money or items from this client file.
-- Expand this: add ox_target and a server event for validated rewards.

local MODULE = 'prop_interaction'
local MODEL = joaat('prop_laptop_01a')
local PROP_COORDS = vec3(441.2, -981.9, 30.7)
local prop_entity = nil

local function log(action, message)
    print(('[QUIET][%s][%s] %s'):format(MODULE, action, message))
end

local function load_model(model)
    RequestModel(model)
    local deadline = GetGameTimer() + 5000

    while not HasModelLoaded(model) do
        if GetGameTimer() > deadline then
            log('model_timeout', tostring(model))
            return false
        end
        Wait(0)
    end

    return true
end

CreateThread(function()
    if not load_model(MODEL) then return end

    prop_entity = CreateObject(MODEL, PROP_COORDS.x, PROP_COORDS.y, PROP_COORDS.z, false, false, false)
    FreezeEntityPosition(prop_entity, true)
    SetModelAsNoLongerNeeded(MODEL)

    log('spawn', ('entity=%s'):format(prop_entity))
    log('expected', 'walk to the laptop and use your interaction system')
end)

AddEventHandler('onResourceStop', function(resource_name)
    if resource_name ~= GetCurrentResourceName() then return end

    if prop_entity and DoesEntityExist(prop_entity) then
        DeleteEntity(prop_entity)
        log('cleanup', 'prop removed')
    end
end)
