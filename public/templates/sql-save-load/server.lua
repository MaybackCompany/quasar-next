-- PURPOSE: Parameterized SQL save and load.
-- DEPENDENCIES: oxmysql.
-- WARNING: Never join player input into SQL strings.
-- Expand this: add audit rows and transactions.
-- SECURITY:
--   - Always use ? placeholders, never concatenate input into SQL.
--   - Use citizenid or license identifier as the primary key, not display name.
--   - Wrap multi-row writes in MySQL.transaction.await for atomicity.

local MODULE = 'sql_save'

local function saveNote(citizenid, note)
    if type(citizenid) ~= 'string' or type(note) ~= 'string' then
        print(('[QUIET][%s][reject] invalid note payload'):format(MODULE))
        return
    end

    MySQL.insert('INSERT INTO qu_notes (citizenid, note) VALUES (?, ?)', { citizenid, note })
    print(('[QUIET][%s][save] citizenid=%s'):format(MODULE, citizenid))
end

local function loadNotes(citizenid, cb)
    MySQL.query('SELECT note FROM qu_notes WHERE citizenid = ?', { citizenid }, function(rows)
        print(('[QUIET][%s][load] rows=%s'):format(MODULE, rows and #rows or 0))
        cb(rows or {})
    end)
end
