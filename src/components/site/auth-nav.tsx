"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

interface MeResponse {
  enabled: boolean;
  signed_in?: boolean;
  user?: {
    id: string;
    username: string;
    avatar: string | null;
  };
  authorized?: boolean;
  matched_role?: string | null;
  in_guild?: boolean;
}

export function AuthNav() {
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/me", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: MeResponse | null) => setMe(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setMe({ enabled: true, signed_in: false });
      });

    return () => controller.abort();
  }, []);

  if (!me?.enabled) return null;

  if (!me.signed_in || !me.user) {
    return (
      <a
        href="/auth/login"
        className="rounded-full border border-separator px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Login
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={me.authorized ? "/lessons/first-line-of-lua" : "/paywall"}
        className="flex max-w-[160px] items-center gap-2 rounded-full border border-separator bg-card py-1 pl-1 pr-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {me.user.avatar ? (
          <img
            src={me.user.avatar}
            alt=""
            className="size-7 shrink-0 rounded-full border border-separator bg-secondary object-cover"
          />
        ) : (
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-hi">
            {me.user.username.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="truncate">{me.user.username}</span>
      </a>
      <a
        href="/auth/logout"
        aria-label="Sign out"
        className="grid size-9 place-items-center rounded-full border border-separator text-ink-2 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <LogOut className="size-4" />
      </a>
    </div>
  );
}
