-- PURPOSE: Production-ready resource skeleton.
-- DEPENDENCIES: ox_lib optional.
-- WARNING: Keep server-only files out of client_scripts.
-- Expand this: add config.lua, logger.lua, client.lua, and server.lua.

fx_version 'cerulean'
game 'gta5'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
    'logger.lua'
}

client_script 'client.lua'
server_script 'server.lua'
