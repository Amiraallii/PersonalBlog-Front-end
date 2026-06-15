export const ROLES = {
  ADMIN: "Admin",
  USER: "User",
  GUEST: "GUEST"
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];