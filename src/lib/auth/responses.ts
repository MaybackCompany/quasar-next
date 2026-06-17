import { NextResponse } from "next/server";

export function authErrorResponse(message: string, status = 400): NextResponse {
  const safeMessage = message.replace(/[<>&"]/g, (char) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
    };
    return entities[char] ?? char;
  });

  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign-in error · Quasar Academy</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f8f7;color:#082f3d;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{width:min(560px,calc(100vw - 32px));border:1px solid rgba(8,47,61,.14);border-radius:16px;background:white;padding:32px}
      h1{margin:0 0 12px;font-size:28px;line-height:1.1}
      p{margin:0 0 24px;color:#445a61;line-height:1.55}
      a{display:inline-flex;border-radius:999px;background:#00b8e0;color:#082f3d;padding:11px 18px;text-decoration:none;font-weight:700}
      @media (prefers-color-scheme: dark){body{background:#061d25;color:#f5f8f7}main{background:#082f3d;border-color:rgba(255,255,255,.14)}p{color:#b8c9ce}}
    </style>
  </head>
  <body>
    <main>
      <h1>Could not complete sign-in.</h1>
      <p>${safeMessage}</p>
      <a href="/auth/login">Try again</a>
    </main>
  </body>
</html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    },
  );
}
