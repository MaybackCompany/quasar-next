// ============================================================
// Quasar Academy interactive lab runtime
// Wires wasmoon (Lua 5.4 in Wasm) into every `.lab` block,
// injects our FiveM + framework mocks, executes the learner's
// code, runs declarative tests, and persists day progress in
// localStorage so the starter-kit landing page can read it.
// ============================================================

(() => {
  'use strict';

  const PROGRESS_KEY = 'qu.starterkit.progress';
  let LuaFactory     = null;
  let wasmoonReady   = null;
  let mocksSource    = null;

  // ---- wasmoon bootstrap ---------------------------------------------------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function ensureWasmoon() {
    if (wasmoonReady) return wasmoonReady;
    wasmoonReady = (async () => {
      if (!window.wasmoon) {
        await loadScript('/assets/lab/wasmoon.js');
      }
      if (!window.wasmoon) throw new Error('wasmoon failed to register on window');
      LuaFactory = window.wasmoon.LuaFactory;
      if (!mocksSource) {
        const r = await fetch('/assets/lab/mocks.lua', { credentials: 'same-origin' });
        if (!r.ok) throw new Error('failed to fetch mocks.lua: ' + r.status);
        mocksSource = await r.text();
      }
    })();
    return wasmoonReady;
  }

  // ---- progress persistence ------------------------------------------------
  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
  }
  function markLab(dayId, labId) {
    const p = loadProgress();
    p[dayId] = p[dayId] || { labs: {}, completedAt: null };
    p[dayId].labs[labId] = { passedAt: Date.now() };
    const dayEl = document.querySelector('[data-day-id="' + dayId + '"]');
    if (dayEl) {
      const totalLabs = Number(dayEl.dataset.labCount || '0');
      if (totalLabs && Object.keys(p[dayId].labs).length >= totalLabs) {
        p[dayId].completedAt = p[dayId].completedAt || Date.now();
      }
    }
    saveProgress(p);
    document.dispatchEvent(new CustomEvent('qu:progress', { detail: { dayId, labId, progress: p } }));
  }

  // ---- assertions ----------------------------------------------------------
  const assertions = {
    hasCommand({ name, lua }) {
      const exists = lua.doStringSync(`return _sandbox.commands[${JSON.stringify(name)}] ~= nil`);
      return { pass: Boolean(exists), got: exists ? 'registered' : 'not registered' };
    },
    hasNetEvent({ name, lua }) {
      const exists = lua.doStringSync(`return _sandbox.netEvents[${JSON.stringify(name)}] == true`);
      return { pass: Boolean(exists), got: exists ? 'registered' : 'not registered' };
    },
    hasEventHandler({ name, lua }) {
      const n = lua.doStringSync(`return (_sandbox.events[${JSON.stringify(name)}] and #_sandbox.events[${JSON.stringify(name)}]) or 0`);
      return { pass: Number(n) > 0, got: `${n} handler(s)` };
    },
    hasPrint({ text, lua }) {
      const hit = lua.doStringSync(`
        for _, line in ipairs(_sandbox.prints) do
          if string.find(line, ${JSON.stringify(text)}, 1, true) then return true end
        end
        return false
      `);
      const all = lua.doStringSync('return table.concat(_sandbox.prints, "\\n")');
      return { pass: Boolean(hit), got: all ? `printed: ${String(all).slice(0, 160)}` : 'nothing printed' };
    },
    hasExactPrint({ text, lua }) {
      const hit = lua.doStringSync(`
        for _, line in ipairs(_sandbox.prints) do
          if line == ${JSON.stringify(text)} then return true end
        end
        return false
      `);
      const all = lua.doStringSync('return table.concat(_sandbox.prints, "\\n")');
      return { pass: Boolean(hit), got: all ? `printed: ${String(all).slice(0, 160)}` : 'nothing printed' };
    },
    printCount({ expected, lua }) {
      const n = Number(lua.doStringSync('return #_sandbox.prints'));
      return { pass: n === expected, got: `${n} print(s)` };
    },
    notifyContains({ text, lua }) {
      const hit = lua.doStringSync(`
        for _, n in ipairs(_sandbox.notifications) do
          local blob = ''
          if type(n) == 'table' then
            for k, v in pairs(n) do blob = blob .. tostring(v) .. ' ' end
          else blob = tostring(n) end
          if string.find(blob, ${JSON.stringify(text)}, 1, true) then return true end
        end
        return false
      `);
      const count = lua.doStringSync('return #_sandbox.notifications');
      return { pass: Boolean(hit), got: `${count} notification(s)` };
    },
    notifyFieldEquals({ field, value, lua }) {
      const hit = lua.doStringSync(`
        for _, n in ipairs(_sandbox.notifications) do
          if type(n) == 'table' and tostring(n[${JSON.stringify(field)}]) == ${JSON.stringify(String(value))} then
            return true
          end
        end
        return false
      `);
      const count = lua.doStringSync('return #_sandbox.notifications');
      return { pass: Boolean(hit), got: `${count} notification(s)` };
    },
    callCount({ fn, expected, lua }) {
      const n = Number(lua.doStringSync(`return _sandbox_count(${JSON.stringify(fn)})`));
      return { pass: n === expected, got: `${n} call(s) to ${fn}` };
    },
    callAtLeast({ fn, min, lua }) {
      const n = Number(lua.doStringSync(`return _sandbox_count(${JSON.stringify(fn)})`));
      return { pass: n >= min, got: `${n} call(s) to ${fn}` };
    },
    lua({ expr, lua }) {
      const v = lua.doStringSync(`return (function() ${expr} end)()`);
      return { pass: Boolean(v), got: String(v) };
    },
  };

  function runTest(t, lua) {
    if (t.run) {
      try { lua.doStringSync(t.run); }
      catch (err) { return { name: t.name, pass: false, got: 'setup error: ' + err.message }; }
    }
    const checker = assertions[t.assert && t.assert.type];
    if (!checker) return { name: t.name, pass: false, got: 'unknown assertion: ' + (t.assert && t.assert.type) };
    try {
      const r = checker({ ...t.assert, lua });
      return { name: t.name, pass: r.pass, got: r.got };
    } catch (err) {
      return { name: t.name, pass: false, got: 'error: ' + err.message };
    }
  }

  // ---- editor (enhanced textarea) ------------------------------------------
  function mountEditor(host, initial) {
    host.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'lab-editor';
    const ta = document.createElement('textarea');
    ta.className = 'lab-textarea';
    ta.spellcheck = false;
    ta.autocomplete = 'off';
    ta.autocapitalize = 'off';
    ta.value = initial;
    // Tab key inserts 2 spaces rather than losing focus.
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
      }
    });
    wrap.appendChild(ta);
    host.appendChild(wrap);
    return ta;
  }

  // ---- per-lab mount -------------------------------------------------------
  function mountLab(el) {
    const dayId    = el.dataset.dayId || document.body.dataset.dayId || 'unknown-day';
    const labId    = el.dataset.labId || 'lab';
    const title    = el.dataset.labTitle || 'Lab';
    const obj      = el.dataset.labObjective || '';
    const templEl  = el.querySelector('template.lab-template');
    const testsEl  = el.querySelector('template.lab-tests');
    const initial  = templEl ? templEl.innerHTML.replace(/^\n/, '').replace(/\s+$/, '') : '';
    const tests    = testsEl ? JSON.parse(testsEl.innerHTML) : [];

    el.innerHTML = `
      <header class="lab-head">
        <div class="lab-head-text">
          <div class="lab-eyebrow">Lab · <span class="lab-id">${labId}</span></div>
          <h4 class="lab-title">${title}</h4>
          ${obj ? `<p class="lab-objective">${obj}</p>` : ''}
        </div>
        <div class="lab-head-actions">
          <button class="lab-reset" type="button" title="Reset the starter template">Reset</button>
          <button class="lab-run" type="button">Run &amp; test</button>
        </div>
      </header>
      <div class="lab-body">
        <div class="lab-editor-host"></div>
        <div class="lab-panels">
          <section class="lab-panel lab-panel--tests">
            <h5>Tests</h5>
            <ol class="lab-tests">${tests.map(t => `<li class="lab-test is-pending" data-test="${t.name}"><span class="lab-test-icon">·</span><span class="lab-test-name">${t.name}</span><span class="lab-test-got"></span></li>`).join('')}</ol>
          </section>
          <section class="lab-panel lab-panel--console">
            <h5>Sandbox output</h5>
            <pre class="lab-console" aria-live="polite"></pre>
          </section>
        </div>
      </div>
      <footer class="lab-foot">
        <span class="lab-status is-idle">Ready when you are.</span>
      </footer>
    `;

    const editor  = mountEditor(el.querySelector('.lab-editor-host'), initial);
    const runBtn  = el.querySelector('.lab-run');
    const rstBtn  = el.querySelector('.lab-reset');
    const testEls = el.querySelectorAll('.lab-test');
    const consEl  = el.querySelector('.lab-console');
    const statEl  = el.querySelector('.lab-status');

    // Restore saved code per lab if present.
    const codeKey = `qu.code.${dayId}.${labId}`;
    const saved   = localStorage.getItem(codeKey);
    if (saved) editor.value = saved;
    editor.addEventListener('input', () => {
      try { localStorage.setItem(codeKey, editor.value); } catch {}
    });

    rstBtn.addEventListener('click', () => {
      editor.value = initial;
      try { localStorage.removeItem(codeKey); } catch {}
      resetTestUI();
      consEl.textContent = '';
      statEl.className = 'lab-status is-idle';
      statEl.textContent = 'Ready when you are.';
    });

    function resetTestUI() {
      testEls.forEach((li) => {
        li.className = 'lab-test is-pending';
        li.querySelector('.lab-test-icon').textContent = '·';
        li.querySelector('.lab-test-got').textContent = '';
      });
    }

    async function run() {
      runBtn.disabled = true;
      runBtn.classList.add('is-busy');
      statEl.className = 'lab-status is-running';
      statEl.textContent = 'Compiling Lua ...';
      resetTestUI();
      consEl.textContent = '';

      let factory, lua;
      try {
        await ensureWasmoon();
        // Point wasmoon at our vendored WASM binary — the default is a unpkg
        // URL that gets blocked by CSP (`connect-src 'self'`) in production.
        factory = new LuaFactory('/assets/lab/glue.wasm');
        lua = await factory.createEngine();

        // Load mocks before learner code so globals exist.
        await lua.doString(mocksSource);
        // Run learner code.
        try {
          await lua.doString(editor.value);
        } catch (err) {
          consEl.textContent = 'Lua error: ' + (err.message || String(err));
          statEl.className = 'lab-status is-fail';
          statEl.textContent = 'Your script did not run. Check the console.';
          return;
        }

        // Dump prints to console view.
        try {
          const printed = String(lua.doStringSync('return table.concat(_sandbox.prints, "\\n")') || '');
          consEl.textContent = printed || '(no output)';
        } catch {}

        // Run tests.
        let passed = 0;
        tests.forEach((t, i) => {
          const r = runTest(t, lua);
          const li = testEls[i];
          li.className = 'lab-test ' + (r.pass ? 'is-pass' : 'is-fail');
          li.querySelector('.lab-test-icon').textContent = r.pass ? '✓' : '×';
          li.querySelector('.lab-test-got').textContent = r.got || '';
          if (r.pass) passed += 1;
        });

        if (passed === tests.length) {
          statEl.className = 'lab-status is-pass';
          statEl.textContent = `Lab cleared · ${passed}/${tests.length} tests green.`;
          markLab(dayId, labId);
        } else {
          statEl.className = 'lab-status is-fail';
          statEl.textContent = `${passed}/${tests.length} tests green · keep going.`;
        }
      } catch (err) {
        consEl.textContent = 'Runtime error: ' + (err.message || String(err));
        statEl.className = 'lab-status is-fail';
        statEl.textContent = 'Something broke before your script ran. Reload and retry.';
      } finally {
        runBtn.disabled = false;
        runBtn.classList.remove('is-busy');
        try { lua && lua.global.close(); } catch {}
        try { factory && factory.close && factory.close(); } catch {}
      }
    }

    runBtn.addEventListener('click', run);
    editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });
  }

  function mountAll() {
    document.querySelectorAll('.lab').forEach(mountLab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }

  // Expose for day-landing page.
  window.QULab = { loadProgress, saveProgress };
})();
