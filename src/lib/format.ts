import type { Availability } from "@/lib/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(priceCents: number) {
  return inr.format(priceCents / 100);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "In stock",
  low_stock: "Low stock",
  sold_out: "Sold out",
  coming_soon: "Coming soon",
};
