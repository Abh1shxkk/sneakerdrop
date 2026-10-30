import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Product, WaitlistEntry } from "@/lib/types";

/** Public catalogue. Wrapped in React cache() so one render never queries twice. */
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data ?? [];
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data;
});

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data;
}

/** Admin only — RLS returns nothing for anyone else. */
export async function getWaitlist(productId?: string): Promise<WaitlistEntry[]> {
  const supabase = await createClient();
  let query = supabase
    .from("waitlist")
    .select("id, email, created_at, product:products(id, name, slug)")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (productId) query = query.eq("product_id", productId);

  const { data, error } = await query.returns<WaitlistEntry[]>();
  if (error) throw new Error(`Could not load waitlist: ${error.message}`);
  return data ?? [];
}

/** Admin only — map of product_id → waitlist size. */
export async function getWaitlistCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_waitlist_counts").select("product_id, total");
  if (error) throw new Error(`Could not load waitlist counts: ${error.message}`);
  return Object.fromEntries((data ?? []).map((row) => [row.product_id as string, row.total as number]));
}
