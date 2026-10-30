export const AVAILABILITY = ["available", "low_stock", "sold_out", "coming_soon"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  price_cents: number;
  image_url: string;
  colorway: string | null;
  accent_hex: string | null;
  availability: Availability;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type WaitlistEntry = {
  id: string;
  email: string;
  created_at: string;
  product: Pick<Product, "id" | "name" | "slug"> | null;
};

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
