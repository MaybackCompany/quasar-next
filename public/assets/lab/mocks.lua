-- ============================================================
-- Quasar Academy lab sandbox · FiveM + framework mocks
-- Loaded into every lab VM before the learner's code runs.
-- Every recordable action lands in `_sandbox.*` for assertions.
-- ============================================================

_sandbox = {
  prints        = {},
  calls         = {},
  waits         = {},
  commands      = {},
  netEvents     = {},
  events        = {},
  eventsFired   = {},
  clientEvents  = {},
  serverEvents  = {},
  notifications = {},
  menus         = {},
  shownMenus    = {},
  dialogs       = {},
  progress      = {},
  callbacks     = {},
  entities      = {},
  threads       = {},
  esxXPlayer    = nil,
  qbPlayer      = nil,
  qbxPlayer     = nil,
}

local function rec(fn, ...)
  _sandbox.calls[#_sandbox.calls + 1] = { fn = fn, args = { ... } }
end

-- ---- print capture ---------------------------------------------------------
local _PRINT_LIMIT = 500
local _WAIT_LIMIT  = 200

local _realPrint = print
print = function(...)
  local n = select('#', ...)
  local parts = {}
  for i = 1, n do
    parts[i] = tostring(select(i, ...))
  end
  local line = table.concat(parts, '\t')
  _sandbox.prints[#_sandbox.prints + 1] = line
  if #_sandbox.prints > _PRINT_LIMIT then
    error('print() limit reached (' .. _PRINT_LIMIT .. ' lines). Looks like an infinite loop.', 0)
  end
end

-- ---- FiveM natives ---------------------------------------------------------
function RegisterCommand(name, handler, restricted)
  _sandbox.commands[name] = { handler = handler, restricted = restricted and true or false }
  rec('RegisterCommand', name, restricted)
end

function TriggerEvent(name, ...)
  _sandbox.eventsFired[#_sandbox.eventsFired + 1] = { name = name, args = { ... } }
  rec('TriggerEvent', name, ...)
  local list = _sandbox.events[name]
  if list then
    for _, fn in ipairs(list) do
      fn(...)
    end
  end
end

function TriggerServerEvent(name, ...)
  _sandbox.serverEvents[#_sandbox.serverEvents + 1] = { name = name, args = { ... } }
  rec('TriggerServerEvent', name, ...)
end

function TriggerClientEvent(name, target, ...)
  _sandbox.clientEvents[#_sandbox.clientEvents + 1] = { name = name, target = target, args = { ... } }
  rec('TriggerClientEvent', name, target, ...)
end

function RegisterNetEvent(name, handler)
  _sandbox.netEvents[name] = true
  rec('RegisterNetEvent', name)
  if type(handler) == 'function' then
    AddEventHandler(name, handler)
  end
end

function AddEventHandler(name, handler)
  local list = _sandbox.events[name]
  if not list then
    list = {}
    _sandbox.events[name] = list
  end
  list[#list + 1] = handler
  rec('AddEventHandler', name)
end

function RemoveEventHandler(name, handler)
  rec('RemoveEventHandler', name)
end

-- Threads execute synchronously; Wait() is a no-op recorder.
function CreateThread(fn)
  _sandbox.threads[#_sandbox.threads + 1] = true
  rec('CreateThread')
  local ok, err = pcall(fn)
  if not ok then
    _sandbox.prints[#_sandbox.prints + 1] = '[thread error] ' .. tostring(err)
  end
end

function Wait(ms)
  _sandbox.waits[#_sandbox.waits + 1] = ms or 0
  rec('Wait', ms)
  if #_sandbox.waits > _WAIT_LIMIT then
    error('Wait() limit reached (' .. _WAIT_LIMIT .. ' iterations). Looks like an infinite loop.', 0)
  end
end

Citizen = {
  CreateThread = CreateThread,
  Wait         = Wait,
}

-- ---- entity/player natives (return sensible fakes) -------------------------
function GetPlayerPed(id)
  rec('GetPlayerPed', id)
  return 100 + (id == -1 and 0 or (id or 0))
end

function PlayerId()
  return 0
end

function PlayerPedId()
  return 100
end

function GetPlayerServerId(id)
  rec('GetPlayerServerId', id)
  return 1
end

function GetEntityCoords(entity)
  rec('GetEntityCoords', entity)
  return vector3(0.0, 0.0, 72.0)
end

function SetEntityCoords(entity, x, y, z, xFlag, yFlag, zFlag, ragdoll)
  _sandbox.entities[entity] = { x = x, y = y, z = z }
  rec('SetEntityCoords', entity, x, y, z)
end

function GetPlayers()
  return { 1, 2 }
end

function GetPlayerName(src)
  return 'TestPlayer' .. tostring(src)
end

function IsPlayerAceAllowed(src, ace)
  rec('IsPlayerAceAllowed', src, ace)
  return false
end

function vector3(x, y, z)
  return { x = x, y = y, z = z, kind = 'vector3' }
end

function vector4(x, y, z, w)
  return { x = x, y = y, z = z, w = w, kind = 'vector4' }
end

-- Default source when server-side commands run
source = 1

-- ---- ox_lib ----------------------------------------------------------------
lib = {}

function lib.notify(opts)
  _sandbox.notifications[#_sandbox.notifications + 1] = opts
  rec('lib.notify', opts)
end

lib.callback = {}
function lib.callback.register(name, fn)
  _sandbox.callbacks[name] = fn
  rec('lib.callback.register', name)
end

function lib.callback.await(name, src, ...)
  rec('lib.callback.await', name, src, ...)
  local fn = _sandbox.callbacks[name]
  if fn then return fn(src, ...) end
  return nil
end

function lib.registerContext(ctx)
  _sandbox.menus[ctx.id or ('menu_' .. (#_sandbox.menus + 1))] = ctx
  rec('lib.registerContext', ctx.id)
end

function lib.showContext(id)
  _sandbox.shownMenus[#_sandbox.shownMenus + 1] = id
  rec('lib.showContext', id)
end

function lib.hideContext()
  rec('lib.hideContext')
end

function lib.inputDialog(title, fields, opts)
  _sandbox.dialogs[#_sandbox.dialogs + 1] = { title = title, fields = fields }
  rec('lib.inputDialog', title)
  -- return dummy values matching field count
  local out = {}
  if type(fields) == 'table' then
    for i = 1, #fields do out[i] = 'test' end
  end
  return out
end

function lib.progressBar(opts)
  _sandbox.progress[#_sandbox.progress + 1] = opts
  rec('lib.progressBar', opts and opts.label)
  return true
end

function lib.alertDialog(opts)
  rec('lib.alertDialog', opts and opts.header)
  return 'confirm'
end

-- ---- ESX ------------------------------------------------------------------
-- Real ESX exposes methods as plain closures on the xPlayer table, so
-- learners call them with dot syntax: `xPlayer.addMoney(100)`.
local function makeXPlayer(src)
  local x = {
    source     = src or 1,
    identifier = 'steam:test' .. tostring(src or 1),
    money      = { cash = 500, bank = 1000, black_money = 0 },
    inventory  = {},
    name       = 'TestPlayer' .. tostring(src or 1),
  }
  x.addMoney = function(amount)
    x.money.cash = x.money.cash + amount
    rec('xPlayer.addMoney', x.source, amount)
  end
  x.removeMoney = function(amount)
    x.money.cash = x.money.cash - amount
    rec('xPlayer.removeMoney', x.source, amount)
  end
  x.getMoney = function()
    rec('xPlayer.getMoney', x.source)
    return x.money.cash
  end
  x.addAccountMoney = function(account, amount)
    x.money[account] = (x.money[account] or 0) + amount
    rec('xPlayer.addAccountMoney', x.source, account, amount)
  end
  x.removeAccountMoney = function(account, amount)
    x.money[account] = (x.money[account] or 0) - amount
    rec('xPlayer.removeAccountMoney', x.source, account, amount)
  end
  x.getAccount = function(account)
    rec('xPlayer.getAccount', x.source, account)
    return { money = x.money[account] or 0, name = account }
  end
  x.addInventoryItem = function(item, count)
    x.inventory[item] = (x.inventory[item] or 0) + count
    rec('xPlayer.addInventoryItem', x.source, item, count)
  end
  x.removeInventoryItem = function(item, count)
    x.inventory[item] = (x.inventory[item] or 0) - count
    rec('xPlayer.removeInventoryItem', x.source, item, count)
  end
  x.getInventoryItem = function(item)
    rec('xPlayer.getInventoryItem', x.source, item)
    return { name = item, count = x.inventory[item] or 0 }
  end
  x.showNotification = function(msg)
    _sandbox.notifications[#_sandbox.notifications + 1] = { title = 'ESX', description = msg }
    rec('xPlayer.showNotification', x.source, msg)
  end
  return x
end

ESX = {}
ESX.PlayerData = {
  identifier = 'steam:test1',
  job        = { name = 'unemployed', grade = 0, label = 'Unemployed' },
  accounts   = { { name = 'money', money = 500 }, { name = 'bank', money = 1000 } },
  inventory  = {},
}

function ESX.GetPlayerFromId(src)
  if not _sandbox.esxXPlayer then
    _sandbox.esxXPlayer = makeXPlayer(src)
  end
  rec('ESX.GetPlayerFromId', src)
  return _sandbox.esxXPlayer
end

function ESX.RegisterServerCallback(name, fn)
  _sandbox.callbacks[name] = fn
  rec('ESX.RegisterServerCallback', name)
end

function ESX.TriggerServerCallback(name, cb, ...)
  rec('ESX.TriggerServerCallback', name, ...)
  local fn = _sandbox.callbacks[name]
  if fn then
    fn(1, function(...) cb(...) end, ...)
  end
end

function ESX.RegisterUsableItem(name, fn)
  rec('ESX.RegisterUsableItem', name)
end

function ESX.ShowNotification(msg)
  _sandbox.notifications[#_sandbox.notifications + 1] = { title = 'ESX', description = msg }
  rec('ESX.ShowNotification', msg)
end

function ESX.GetPlayers()
  return GetPlayers()
end

-- Legacy shared-object pattern (still in many ESX tutorials).
function _esx_shared_object(cb)
  if cb then cb(ESX) end
  return ESX
end

-- ---- QBCore ---------------------------------------------------------------
local function makeQBPlayer(src)
  local p = {
    PlayerData = {
      source    = src or 1,
      citizenid = 'ABC12345',
      license   = 'license:test',
      charinfo  = { firstname = 'Quasar', lastname = 'Student', phone = '5551111' },
      job       = { name = 'unemployed', label = 'Unemployed', grade = { level = 0 } },
      money     = { cash = 500, bank = 1000, crypto = 0 },
      items     = {},
      metadata  = { hunger = 100, thirst = 100, stress = 0 },
    },
    Functions = {},
  }
  function p.Functions.AddMoney(acct, amount, reason)
    p.PlayerData.money[acct] = (p.PlayerData.money[acct] or 0) + amount
    rec('qbPlayer.AddMoney', acct, amount, reason)
    return true
  end
  function p.Functions.RemoveMoney(acct, amount, reason)
    p.PlayerData.money[acct] = (p.PlayerData.money[acct] or 0) - amount
    rec('qbPlayer.RemoveMoney', acct, amount, reason)
    return true
  end
  function p.Functions.GetMoney(acct)
    rec('qbPlayer.GetMoney', acct)
    return p.PlayerData.money[acct] or 0
  end
  function p.Functions.AddItem(item, count, slot, info)
    p.PlayerData.items[item] = (p.PlayerData.items[item] or 0) + count
    rec('qbPlayer.AddItem', item, count)
    return true
  end
  function p.Functions.RemoveItem(item, count, slot)
    p.PlayerData.items[item] = (p.PlayerData.items[item] or 0) - count
    rec('qbPlayer.RemoveItem', item, count)
    return true
  end
  function p.Functions.SetJob(name, grade)
    p.PlayerData.job = { name = name, grade = { level = grade or 0 } }
    rec('qbPlayer.SetJob', name, grade)
  end
  function p.Functions.Notify(msg, t, len)
    _sandbox.notifications[#_sandbox.notifications + 1] = { title = 'QBCore', description = msg, type = t }
    rec('qbPlayer.Notify', msg, t)
  end
  return p
end

QBCore = {
  Shared = {
    Items = {
      water = { name = 'water', label = 'Water', weight = 500 },
      bread = { name = 'bread', label = 'Bread', weight = 200 },
    },
    Jobs = {
      unemployed = { label = 'Unemployed' },
      police     = { label = 'Police' },
    },
  },
  Config = { MaxPlayers = 32, DefaultSpawn = { x = -1035.7, y = -2731.8, z = 12.9 } },
  Functions = {},
}

function QBCore.Functions.GetPlayer(src)
  if not _sandbox.qbPlayer then
    _sandbox.qbPlayer = makeQBPlayer(src)
  end
  rec('QBCore.Functions.GetPlayer', src)
  return _sandbox.qbPlayer
end

function QBCore.Functions.GetPlayerByCitizenId(citizenid)
  rec('QBCore.Functions.GetPlayerByCitizenId', citizenid)
  return QBCore.Functions.GetPlayer(1)
end

function QBCore.Functions.CreateCallback(name, fn)
  _sandbox.callbacks[name] = fn
  rec('QBCore.Functions.CreateCallback', name)
end

function QBCore.Functions.TriggerCallback(name, cb, ...)
  local fn = _sandbox.callbacks[name]
  rec('QBCore.Functions.TriggerCallback', name, ...)
  if fn then
    fn(1, function(...) cb(...) end, ...)
  end
end

function QBCore.Functions.Notify(src, msg, type, length)
  _sandbox.notifications[#_sandbox.notifications + 1] = { title = 'QBCore', description = msg, type = type, target = src }
  rec('QBCore.Functions.Notify', src, msg, type)
end

function QBCore.Functions.GetPlayers()
  return GetPlayers()
end

-- Legacy global access via exports('GetCoreObject').
function _qb_get_core_object()
  return QBCore
end

-- ---- Qbox (exports['qbx_core']) -------------------------------------------
local function makeQbxPlayer(src)
  local p = {
    source    = src or 1,
    citizenid = 'QBX12345',
    charinfo  = { firstname = 'Quasar', lastname = 'Student' },
    money     = { cash = 500, bank = 1000 },
    job       = { name = 'unemployed', grade = { level = 0, name = 'unemployed' } },
    PlayerData = {
      citizenid = 'QBX12345',
      charinfo  = { firstname = 'Quasar', lastname = 'Student' },
      money     = { cash = 500, bank = 1000 },
      job       = { name = 'unemployed', grade = { level = 0, name = 'unemployed' } },
    },
    Functions = {},
  }
  function p.Functions.AddMoney(acct, amount, reason)
    p.money[acct] = (p.money[acct] or 0) + amount
    p.PlayerData.money[acct] = (p.PlayerData.money[acct] or 0) + amount
    rec('qbPlayer.AddMoney', acct, amount, reason)
    return true
  end
  function p.Functions.RemoveMoney(acct, amount, reason)
    p.money[acct] = (p.money[acct] or 0) - amount
    p.PlayerData.money[acct] = (p.PlayerData.money[acct] or 0) - amount
    rec('qbPlayer.RemoveMoney', acct, amount, reason)
    return true
  end
  return p
end

local qbxCore = {}
function qbxCore:GetPlayer(src)
  if not _sandbox.qbxPlayer then
    _sandbox.qbxPlayer = makeQbxPlayer(src)
  end
  rec('qbx_core.GetPlayer', src)
  return _sandbox.qbxPlayer
end

function qbxCore:GetPlayerByCitizenId(id)
  rec('qbx_core.GetPlayerByCitizenId', id)
  return self:GetPlayer(1)
end

function qbxCore:Notify(src, msg, t, length)
  _sandbox.notifications[#_sandbox.notifications + 1] = { title = 'qbx', description = msg, type = t, target = src }
  rec('qbx_core.Notify', src, msg, t)
end

function qbxCore:AddMoney(src, acct, amount, reason)
  local p = self:GetPlayer(src)
  p.Functions.AddMoney(acct, amount, reason)
  rec('qbx_core.AddMoney', src, acct, amount)
  return true
end

function qbxCore:RemoveMoney(src, acct, amount, reason)
  local p = self:GetPlayer(src)
  p.Functions.RemoveMoney(acct, amount, reason)
  rec('qbx_core.RemoveMoney', src, acct, amount)
  return true
end

local oxInventory = {}
local _oxInvItems = {}
function oxInventory:AddItem(src, item, count, metadata, slot)
  _oxInvItems[item] = (_oxInvItems[item] or 0) + count
  rec('ox_inventory.AddItem', src, item, count)
  return true
end
function oxInventory:RemoveItem(src, item, count, metadata, slot)
  _oxInvItems[item] = (_oxInvItems[item] or 0) - count
  rec('ox_inventory.RemoveItem', src, item, count)
  return true
end
function oxInventory:GetItem(src, item, metadata, strict)
  rec('ox_inventory.GetItem', src, item)
  return { name = item, count = _oxInvItems[item] or 0 }
end
function oxInventory:Search(src, search, items, metadata)
  rec('ox_inventory.Search', src, search)
  return _oxInvItems[items] or 0
end

exports = setmetatable({
  qbx_core     = qbxCore,
  ox_inventory = oxInventory,
  oxmysql      = {
    scalar_async = function(self, q, p) rec('oxmysql.scalar', q); return 1 end,
    insert_async = function(self, q, p) rec('oxmysql.insert', q); return 1 end,
    query_async  = function(self, q, p) rec('oxmysql.query',  q); return {} end,
  },
}, {
  __call = function(t, name)
    -- `exports('name', fn)` registers an export; we just record it.
    return function(_, fn)
      rec('exports.register', name)
    end
  end,
  __index = function(t, key)
    -- Unknown exports should fail loudly so learners notice wrong API names.
    local stub = {}
    setmetatable(stub, {
      __index = function(_, method)
        return function()
          error("unknown sandbox export '" .. tostring(key) .. ":" .. tostring(method) .. "'", 0)
        end
      end,
    })
    rawset(t, key, stub)
    return stub
  end,
})

local _allFrameworks = {
  ESX = ESX,
  QBCore = QBCore,
  qbx_core = qbxCore,
}

function _sandbox_use_framework(name)
  if name == 'all' then
    ESX = _allFrameworks.ESX
    QBCore = _allFrameworks.QBCore
    exports.qbx_core = _allFrameworks.qbx_core
  elseif name == 'qbox' then
    ESX = nil
    QBCore = nil
    exports.qbx_core = _allFrameworks.qbx_core
  elseif name == 'qbcore' then
    ESX = nil
    QBCore = _allFrameworks.QBCore
    exports.qbx_core = false
  elseif name == 'esx' then
    ESX = _allFrameworks.ESX
    QBCore = nil
    exports.qbx_core = false
  else
    error("unknown framework mode '" .. tostring(name) .. "'", 0)
  end

  _sandbox.esxXPlayer = nil
  _sandbox.qbPlayer = nil
  _sandbox.qbxPlayer = nil
  rec('_sandbox_use_framework', name)
end

-- ---- helpers exposed to tests ---------------------------------------------
function _sandbox_reset()
  for k in pairs(_sandbox) do
    if type(_sandbox[k]) == 'table' then
      _sandbox[k] = {}
    end
  end
  _sandbox.esxXPlayer = nil
  _sandbox.qbPlayer   = nil
  _sandbox.qbxPlayer  = nil
  _sandbox_use_framework('all')
end

function _sandbox_run_command(name, src, ...)
  local c = _sandbox.commands[name]
  if not c then return false, 'command ' .. name .. ' not registered' end
  c.handler(src or 1, { ... }, '')
  return true
end

function _sandbox_count(fn_name)
  local n = 0
  for _, call in ipairs(_sandbox.calls) do
    if call.fn == fn_name then n = n + 1 end
  end
  return n
end
