import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { VISITOR_COOKIE } from "@/lib/access";
import type { User } from "@/lib/types";

export async function getVisitorId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(VISITOR_COOKIE)?.value ?? null;
}

export async function getOrCreateUser(visitorId: string): Promise<User | null> {
  const admin = createAdminClient();
  if (!admin) {
    return {
      id: "local-user",
      visitor_id: visitorId,
      stripe_customer_id: null,
      pass_purchased_at: null,
      pass_expires_at: null,
    };
  }

  const { data: existing } = await admin
    .from("users")
    .select("*")
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (existing) return existing as User;

  const { data: created, error } = await admin
    .from("users")
    .insert({ visitor_id: visitorId })
    .select("*")
    .single();

  if (error || !created) return null;
  return created as User;
}

export async function getCurrentUser(): Promise<User | null> {
  const visitorId = await getVisitorId();
  if (!visitorId) return null;
  return getOrCreateUser(visitorId);
}
