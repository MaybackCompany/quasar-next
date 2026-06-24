"use client";

import { useRef, useState } from "react";

// Real in-browser Lua 5.4 via the vendored wasmoon WASM build (public/assets/lab).
// mocks.lua provides FiveM globals + a print() that collects into _sandbox.prints,
// mirroring the lab runner, so both plain-Lua and FiveM snippets run.

interface WasmoonGlobal {
  LuaFactory: new (wasmUri: string) => {
    createEngine: () => Promise<LuaEngine>;
  };
}
interface LuaEngine {
  doString: (code: string) => Promise<unknown>;
  doStringSync: (code: string) => unknown;
  global: { close: () => void };
}

let wasmoonReady: Promise<{ Factory: WasmoonGlobal["LuaFactory"]; mocks: string }> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("failed to load " + src));
    document.head.appendChild(s);
  });
}

async function ensureWasmoon() {
  if (wasmoonReady) return wasmoonReady;
  wasmoonReady = (async () => {
    const w = window as unknown as { wasmoon?: WasmoonGlobal };
    if (!w.wasmoon) await loadScript("/assets/lab/wasmoon.js");
    if (!w.wasmoon) throw new Error("wasmoon failed to load");
    const r = await fetch("/assets/lab/mocks.lua", { credentials: "same-origin" });
    const mocks = r.ok ? await r.text() : "";
    return { Factory: w.wasmoon.LuaFactory, mocks };
  })();
  return wasmoonReady;
}

export function LuaSandbox({ initial = 'print("Hello, Los Santos")' }: { initial?: string }) {
  const [code, setCode] = useState(initial);
  const [out, setOut] = useState<{ label: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const runningRef = useRef(false);

  const run = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setBusy(true);
    setOut({ label: "OUTPUT", text: "Running…" });
    let engine: LuaEngine | null = null;
    try {
      const { Factory, mocks } = await ensureWasmoon();
      const factory = new Factory("/assets/lab/glue.wasm");
      engine = await factory.createEngine();
      if (mocks) await engine.doString(mocks);
      await engine.doString(code);
      const printed = String(engine.doStringSync('return table.concat(_sandbox.prints or {}, "\\n")') ?? "");
      setOut({ label: "OUTPUT", text: printed || "(no output - did you call print?)" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOut({ label: "ERROR", text: "lua: " + msg });
    } finally {
      try {
        engine?.global.close();
      } catch {
        /* ignore */
      }
      runningRef.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="sandbox">
      <div className="codeblock-head" style={{ borderBottom: "1px solid var(--code-edge)" }}>
        <span className="codeblock-label">sandbox.lua</span>
        <span className="runs-badge" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          LUA 5.4
        </span>
        <span className="spacer" />
        <button className="run-btn" onClick={run} disabled={busy}>
          {busy ? "RUNNING…" : "RUN ▸"}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        aria-label="Editable Lua sandbox"
      />
      <div className="sandbox-out">
        <span className="label">{out?.label ?? "OUTPUT"}</span>
        <pre style={out ? undefined : { color: "var(--code-muted)" }}>{out?.text ?? "Press RUN to execute."}</pre>
      </div>
    </div>
  );
}
