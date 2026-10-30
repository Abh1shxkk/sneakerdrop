"use server";

import { revalidatePath } from "next/cache";
import { getAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { waitlistSchema } from "@/lib/validation";

export type WaitlistState = ActionResult<{ duplicate: boolean }> | null;

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const parsed = waitlistSchema.safeParse({
    productId: formData.get("productId"),
    email: formData.get("email"),
    company: formData.get("company") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Honeypot filled: pretend success so bots learn nothing.
    if (fieldErrors.company) return { ok: true, data: { duplicate: false }, message: "You're on the list." };
    return {
      ok: false,
      error: fieldErrors.email?.[0] ?? fieldErrors.productId?.[0] ?? "Please check the form.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  // No .select() — anon users can insert but never read the waitlist.
  const { error } = await supabase
    .from("waitlist")
    .insert({ product_id: parsed.data.productId, email: parsed.data.email });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, data: { duplicate: true }, message: "You're already on this list. We'll be in touch." };
    }
    if (error.code === "23503") return { ok: false, error: "That sneaker no longer exists." };
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true, data: { duplicate: false }, message: "You're on the list. We'll email you first." };
}

export async function deleteWaitlistEntry(id: string): Promise<ActionResult> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorised." };

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/waitlist");
  revalidatePath("/admin");
  return { ok: true, data: undefined };
}
