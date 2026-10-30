import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Returns the admin user or null. Never trust middleware alone. */
export async function getAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? user : null;
}

/** For pages and layouts: redirects non-admins to login. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login?error=forbidden");
  return admin;
}
