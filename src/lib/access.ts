import type { Location, User } from "@/lib/types";

export const VISITOR_COOKIE = "visitor_id";
export const PASS_DAYS = 14;

export function hasActivePass(user: User | null): boolean {
  if (!user?.pass_expires_at) return false;
  return new Date(user.pass_expires_at) > new Date();
}

export function canAccessLocation(
  location: Pick<Location, "is_free_tier">,
  user: User | null
): boolean {
  if (location.is_free_tier) return true;
  return hasActivePass(user);
}

export function passExpiresAtFromNow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + PASS_DAYS);
  return d;
}
