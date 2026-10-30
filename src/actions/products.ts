"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, Availability } from "@/lib/types";
import { IMAGE_MAX_BYTES, IMAGE_TYPES, availabilitySchema, productSchema } from "@/lib/validation";

export type ProductFormState = ActionResult | null;

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  if (slug) revalidatePath(`/sneakers/${slug}`);
  revalidatePath("/admin");
}

async function uploadImage(supabase: SupabaseServer, file: File, slug: string): Promise<ActionResult<string>> {
  if (!IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number])) {
    return { ok: false, error: "Image must be PNG, JPEG or WebP." };
  }
  if (file.size > IMAGE_MAX_BYTES) return { ok: false, error: "Image must be 3 MB or smaller." };

  const ext = file.type.split("/")[1];
  const path = `${slug}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: `Upload failed: ${error.message}` };

  return { ok: true, data: supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl };
}

async function parseProductForm(supabase: SupabaseServer, formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    tagline: formData.get("tagline") ?? undefined,
    description: formData.get("description"),
    price: formData.get("price"),
    colorway: formData.get("colorway") ?? undefined,
    accent_hex: formData.get("accent_hex") ?? undefined,
    availability: formData.get("availability"),
    featured: formData.get("featured") === "on",
    sort_order: formData.get("sort_order") || 0,
    image_url: formData.get("image_url") ?? undefined,
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { price, image_url, accent_hex, ...rest } = parsed.data;
  let imageUrl = image_url;

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadImage(supabase, file, rest.slug);
    if (!uploaded.ok) return { ok: false as const, error: uploaded.error, fieldErrors: { image: [uploaded.error] } };
    imageUrl = uploaded.data;
  }

  if (!imageUrl) {
    return { ok: false as const, error: "Add an image.", fieldErrors: { image: ["Upload an image or paste a URL."] } };
  }

  return {
    ok: true as const,
    row: { ...rest, accent_hex: accent_hex ?? null, price_cents: Math.round(price * 100), image_url: imageUrl },
  };
}

function dbError(error: { code?: string; message: string }): ProductFormState {
  if (error.code === "23505") {
    return { ok: false, error: "That slug is already taken.", fieldErrors: { slug: ["Slug already in use."] } };
  }
  return { ok: false, error: error.message };
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorised." };
  const supabase = await createClient();

  const result = await parseProductForm(supabase, formData);
  if (!result.ok) return result;

  const { error } = await supabase.from("products").insert(result.row);
  if (error) return dbError(error);

  revalidatePublic(result.row.slug);
  redirect("/admin?saved=created");
}

export async function updateProduct(id: string, _prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorised." };
  const supabase = await createClient();

  const result = await parseProductForm(supabase, formData);
  if (!result.ok) return result;

  const { data: before } = await supabase.from("products").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("products").update(result.row).eq("id", id);
  if (error) return dbError(error);

  revalidatePublic(result.row.slug);
  if (before && before.slug !== result.row.slug) revalidatePath(`/sneakers/${before.slug}`);
  redirect("/admin?saved=updated");
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorised." };
  const supabase = await createClient();

  const { data, error } = await supabase.from("products").delete().eq("id", id).select("slug").maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Product not found." };

  revalidatePublic(data.slug);
  revalidatePath("/admin/waitlist");
  return { ok: true, data: undefined };
}

export async function setAvailability(id: string, availability: Availability): Promise<ActionResult> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorised." };
  const parsed = availabilitySchema.safeParse(availability);
  if (!parsed.success) return { ok: false, error: "Invalid availability." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update({ availability: parsed.data })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Product not found." };

  revalidatePublic(data.slug);
  return { ok: true, data: undefined };
}

export async function setFeatured(id: string, featured: boolean): Promise<ActionResult> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorised." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update({ featured: Boolean(featured) })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Product not found." };

  revalidatePublic(data.slug);
  return { ok: true, data: undefined };
}
