-- PURPOSE: Client event to server validation to result callback.
-- DEPENDENCIES: ox_lib.
-- WARNING: Never trust amount, item, job, or coords from the client.
-- Expand this: add framework permission checks.
-- SECURITY:
--   - Reject when source is 0, that path is server console or a spoof.
--   - Validate every payload field server-side, do not trust the client.
--   - Apply a per-source cooldown before doing real work.

local MODULE = 'gateway'

RegisterNetEvent('quasar:gateway:claim', function(payload)
    local src = source
    if type(payload) ~= 'table' or type(payload.amount) ~= 'number' then
        print(('[QUIET][%s][reject] source=%s invalid payload'):format(MODULE, src))
        TriggerClientEvent('quasar:gateway:result', src, { ok = false, reason = 'invalid_payload' })
        return
    end

    local amount = math.floor(payload.amount)
    if amount < 1 or amount > 100 then
        print(('[QUIET][%s][reject] source=%s amount=%s'):format(MODULE, src, amount))
        TriggerClientEvent('quasar:gateway:result', src, { ok = false, reason = 'bad_amount' })
        return
    end

    print(('[QUIET][%s][accept] source=%s amount=%s'):format(MODULE, src, amount))
    TriggerClientEvent('quasar:gateway:result', src, { ok = true, amount = amount })
end)
