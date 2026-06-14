-- PURPOSE: Manifest for the vehicle-spawn template.
-- DEPENDENCIES: FiveM client runtime.
-- WARNING: Server must validate who may request the vehicle.
-- Expand this: add server.lua that gates spawn requests by job, money, or cooldown.
-- SECURITY:
--   - Never spawn from client input, the server must own the decision.
--   - Apply a per-source cooldown server-side before granting a spawn.
--   - Despawn owned entities on resource stop and on player disconnect.

fx_version 'cerulean'
game 'gta5'

author 'Quasar Academy'
description 'Template: vehicle spawn with ownership and cleanup'
version '1.0.0'

client_script 'client.lua'
