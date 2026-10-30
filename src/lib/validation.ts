import { z } from "zod";
import { AVAILABILITY } from "@/lib/types";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "That email is too long.")
  .pipe(z.email("Please enter a valid email address."));

export const waitlistSchema = z.object({
  productId: z.uuid("Pick a sneaker first."),
  email: emailSchema,
  company: z.string().max(0).optional(), // honeypot
});

export const availabilitySchema = z.enum(AVAILABILITY);

/** Must match images.remotePatterns in next.config.ts. */
const IMAGE_HOSTS = /^([a-z0-9-]+\.supabase\.co|images\.unsplash\.com)$/;

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters.").max(60),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes."),
  tagline: z.string().trim().max(120).optional().transform((v) => v || null),
  description: z.string().trim().min(10, "Description needs at least 10 characters.").max(1200),
  price: z.coerce.number().min(0, "Price cannot be negative.").max(1_000_000),
  colorway: z.string().trim().max(60).optional().transform((v) => v || null),
  accent_hex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #E8875C.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  availability: availabilitySchema,
  featured: z.coerce.boolean(),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  image_url: z
    .url({ protocol: /^https$/, hostname: IMAGE_HOSTS, error: "Use an uploaded image or an images.unsplash.com URL." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type ProductInput = z.infer<typeof productSchema>;

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
