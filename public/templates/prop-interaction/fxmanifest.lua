-- PURPOSE: Manifest for a cleanup-safe prop interaction.
-- DEPENDENCIES: FiveM client runtime. ox_target is optional.
-- WARNING: The server must validate rewards or item changes.
-- Expand this: replace print feedback with ox_lib notify or a server result event.

fx_version 'cerulean'
game 'gta5'

author 'Quasar Academy'
description 'Template: prop interaction with model load and cleanup'
version '1.0.0'

client_script 'client.lua'
