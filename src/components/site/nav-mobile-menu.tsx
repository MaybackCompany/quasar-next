"use client";

import { Menu } from "lucide-react";
import { Drawer } from "@heroui/react";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

/** Mobile (<md) hamburger that opens a right Drawer with the primary nav links. */
export function NavMobileMenu({ links }: { links: ReadonlyArray<NavLink> }) {
  return (
    <Drawer>
      <Drawer.Trigger
        aria-label="Open menu"
        className="inline-flex size-9 items-center justify-center rounded-full border border-separator text-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="left" className="w-[78%] max-w-[300px] bg-background">
          <Drawer.Dialog className="outline-none">
            <Drawer.Body className="p-5">
              <p className="mb-4 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
                Menu
              </p>
              <nav aria-label="Primary" className="flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                    className="rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
