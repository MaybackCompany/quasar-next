-- PURPOSE: Manifest for the entity-registry template.
-- DEPENDENCIES: FiveM client runtime.
-- WARNING: Registry uses client natives, keep it on the client side only.
-- Expand this: add a server-side mirror that records owner identifiers.
-- SECURITY:
--   - Never expose the Registry table through net events.
--   - Always run cleanup on resource stop and on player disconnect.
--   - Validate ids server-side before mirroring any registry write.

fx_version 'cerulean'
game 'gta5'

author 'Quasar Academy'
description 'Template: track spawned entities and cleanup paths'
version '1.0.0'

client_script 'registry.lua'
