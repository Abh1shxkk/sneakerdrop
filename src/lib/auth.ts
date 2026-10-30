import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

/**
 * Returns the signed-in admin or null. Never trust middleware alone.
 * getClaims() verifies the session JWT's signature, and cache() makes the layout,
 * page and actions in one request share a single check.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", claims.sub).maybeSingle();
  return row ? { id: claims.sub, email: claims.email ?? null } : null;
});

/** For pages and layouts: redirects non-admins to login. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login?error=forbidden");
  return admin;
}
