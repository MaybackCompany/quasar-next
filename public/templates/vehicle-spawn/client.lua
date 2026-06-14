-- PURPOSE: Vehicle spawn with ownership and cleanup.
-- DEPENDENCIES: FiveM client runtime.
-- WARNING: Server must validate who may request the vehicle.
-- Expand this: save plate, mods, fuel, and damage.
-- SECURITY:
--   - Never spawn directly from client input, ask the server first.
--   - Server must check job, money, or cooldown before granting a spawn.
--   - Despawn owned entities on resource stop and on player disconnect.

local MODULE = 'vehicle_spawn'
local spawnedVehicle = nil

RegisterNetEvent('quasar:vehicle:spawnResult', function(netId)
    local vehicle = NetToVeh(netId)
    if vehicle == 0 or not DoesEntityExist(vehicle) then
        print(('[QUIET][%s][missing] netId=%s'):format(MODULE, netId))
        return
    end

    spawnedVehicle = vehicle
    SetEntityAsMissionEntity(vehicle, true, true)
    print(('[QUIET][%s][owned] vehicle=%s'):format(MODULE, vehicle))
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end
    if spawnedVehicle and DoesEntityExist(spawnedVehicle) then
        DeleteEntity(spawnedVehicle)
        print(('[QUIET][%s][cleanup] deleted vehicle'):format(MODULE))
    end
end)
