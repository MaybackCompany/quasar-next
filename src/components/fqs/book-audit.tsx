"use client";

import { useEffect, type ReactNode } from "react";
import { getCalApi } from "@calcom/embed-react";

interface BookAuditProps {
  className?: string;
  children: ReactNode;
}

/**
 * "Book your free FiveM audit" button. The Cal.com embed script intercepts the
 * click and opens the booking popup (namespace fivemaudit -> kishi/fivemaudit).
 * It is a real <a> so that if the script is blocked or fails, the click still
 * navigates to the booking page — progressive enhancement, never a dead button.
 */
export function BookAudit({ className, children }: BookAuditProps) {
  useEffect(() => {
    let active = true;
    (async () => {
      const cal = await getCalApi({ namespace: "fivemaudit" });
      if (active) cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <a
      href="https://cal.com/kishi/fivemaudit"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-cal-namespace="fivemaudit"
      data-cal-link="kishi/fivemaudit"
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </a>
  );
}
