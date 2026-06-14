// Single source of truth for Discord role gating.
// These are public Discord role IDs (not secrets), so they live in code rather
// than 20+ env vars. Course access = holding any role with grantsAccess.
// Admin panel access = holding any role with isAdmin. The panel may only hand
// out roles marked grantable.

export type AccessTier =
  | "starterkit"
  | "builder"
  | "elite"
  | "enterprise"
  | "coaching"
  | "director";

export interface RoleDef {
  id: string;
  label: string;
  tier: AccessTier;
  /** Holding this role unlocks the course content. */
  grantsAccess: boolean;
  /** Holding this role grants the Director admin panel. */
  isAdmin?: boolean;
  /** The admin panel is allowed to assign/revoke this role. */
  grantable?: boolean;
}

export const ROLE_CATALOG: readonly RoleDef[] = [
  // Subscription base roles (the membership markers the admin panel can hand out).
  { id: "1515556790119436339", label: "FiveM Starterkit", tier: "starterkit", grantsAccess: true, grantable: true },
  { id: "1316410536086339686", label: "Builder Member", tier: "builder", grantsAccess: true, grantable: true },
  { id: "1316410535348273253", label: "Elite Member", tier: "elite", grantsAccess: true, grantable: true },
  { id: "1473436768559829275", label: "Enterprise Member", tier: "enterprise", grantsAccess: true, grantable: true },

  // Billing-period variants (granted by the store/checkout, not the panel).
  { id: "1515562731141333044", label: "Starterkit 1M", tier: "starterkit", grantsAccess: true },
  { id: "1515562733121048732", label: "Starterkit Yearly", tier: "starterkit", grantsAccess: true },
  { id: "1515562735986016327", label: "Starterkit Lifetime", tier: "starterkit", grantsAccess: true },
  { id: "1515562718675861614", label: "Builder 1M", tier: "builder", grantsAccess: true },
  { id: "1515562720731336725", label: "Builder Yearly", tier: "builder", grantsAccess: true },
  { id: "1515562722518106152", label: "Builder Lifetime", tier: "builder", grantsAccess: true },
  { id: "1515562724564930632", label: "Elite 1M", tier: "elite", grantsAccess: true },
  { id: "1515562726837977168", label: "Elite Yearly", tier: "elite", grantsAccess: true },
  { id: "1515562728683733184", label: "Elite Lifetime", tier: "elite", grantsAccess: true },

  // 1:1 coaching add-ons. These are bought alongside a plan and do NOT grant
  // course access on their own.
  { id: "1515562737764401334", label: "1:1 - 1 Class", tier: "coaching", grantsAccess: false },
  { id: "1515562739915821117", label: "1:1 - 2 Classes", tier: "coaching", grantsAccess: false },
  { id: "1515562743170732032", label: "1:1 - 3 Classes", tier: "coaching", grantsAccess: false },
  { id: "1515562745238519949", label: "1:1 - 4 Classes", tier: "coaching", grantsAccess: false },
  { id: "1515562747226488892", label: "1:1 - 5 Classes", tier: "coaching", grantsAccess: false },

  // Leadership: full access + admin panel.
  { id: "1314332600684253266", label: "Director", tier: "director", grantsAccess: true, isAdmin: true },
  { id: "1405329697184944260", label: "Community Director", tier: "director", grantsAccess: true, isAdmin: true },
] as const;

const BY_ID = new Map<string, RoleDef>(ROLE_CATALOG.map((r) => [r.id, r]));

export function roleById(id: string): RoleDef | undefined {
  return BY_ID.get(id);
}

export function getAccessRoleIds(): string[] {
  return ROLE_CATALOG.filter((r) => r.grantsAccess).map((r) => r.id);
}

export function getAdminRoleIds(): string[] {
  return ROLE_CATALOG.filter((r) => r.isAdmin).map((r) => r.id);
}

export function getGrantableRoles(): RoleDef[] {
  return ROLE_CATALOG.filter((r) => r.grantable);
}

export function isGrantableRoleId(id: string): boolean {
  return Boolean(BY_ID.get(id)?.grantable);
}

// Highest access tier the member holds, for display only.
const TIER_RANK: Record<AccessTier, number> = {
  director: 6,
  enterprise: 5,
  elite: 4,
  builder: 3,
  starterkit: 2,
  coaching: 1,
};

export function summarizeRoles(roleIds: string[]): {
  authorized: boolean;
  isAdmin: boolean;
  tier: AccessTier | null;
} {
  const accessIds = new Set(getAccessRoleIds());
  const adminIds = new Set(getAdminRoleIds());
  const authorized = roleIds.some((id) => accessIds.has(id));
  const isAdmin = roleIds.some((id) => adminIds.has(id));

  let tier: AccessTier | null = null;
  for (const id of roleIds) {
    const def = BY_ID.get(id);
    if (!def || !def.grantsAccess) continue;
    if (tier === null || TIER_RANK[def.tier] > TIER_RANK[tier]) tier = def.tier;
  }

  return { authorized, isAdmin, tier };
}
