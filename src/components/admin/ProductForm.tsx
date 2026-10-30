"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { ProductFormState } from "@/actions/products";
import { Field, inputClasses } from "@/components/admin/Field";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { AVAILABILITY_LABEL, slugify } from "@/lib/format";
import { AVAILABILITY, type Product } from "@/lib/types";
import { IMAGE_MAX_BYTES, IMAGE_TYPES } from "@/lib/validation";

type Props = {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
};

export function ProductForm({ action, product }: Props) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, null);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [accent, setAccent] = useState(product?.accent_hex ?? "#E8875C");
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [fileError, setFileError] = useState<string | null>(null);

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  const onFile = (file?: File) => {
    setFileError(null);
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number])) return setFileError("Use PNG, JPEG or WebP.");
    if (file.size > IMAGE_MAX_BYTES) return setFileError("Max 3 MB.");
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5 rounded-lg bg-white p-6 shadow-card sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" errors={errors.name}>
            <input id="name" name="name" required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} className={inputClasses(Boolean(errors.name))} />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="Used in the product URL." errors={errors.slug}>
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              aria-invalid={Boolean(errors.slug)}
              className={inputClasses(Boolean(errors.slug))}
            />
          </Field>
        </div>

        <Field label="Tagline" htmlFor="tagline" errors={errors.tagline}>
          <input id="tagline" name="tagline" maxLength={120} defaultValue={product?.tagline ?? ""} placeholder="Knit speed, all day." className={inputClasses(Boolean(errors.tagline))} />
        </Field>

        <Field label="Description" htmlFor="description" errors={errors.description}>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            maxLength={1200}
            defaultValue={product?.description}
            aria-invalid={Boolean(errors.description)}
            className={cn(inputClasses(Boolean(errors.description)), "h-auto rounded-md py-3")}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Price (₹)" htmlFor="price" errors={errors.price}>
            <input id="price" name="price" type="number" min={0} step="1" required defaultValue={product ? product.price_cents / 100 : ""} className={inputClasses(Boolean(errors.price))} />
          </Field>
          <Field label="Colourway" htmlFor="colorway" errors={errors.colorway}>
            <input id="colorway" name="colorway" maxLength={60} defaultValue={product?.colorway ?? ""} placeholder="Sail / Apricot" className={inputClasses(Boolean(errors.colorway))} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Availability" htmlFor="availability" errors={errors.availability}>
            <select id="availability" name="availability" defaultValue={product?.availability ?? "available"} className={inputClasses()}>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {AVAILABILITY_LABEL[a]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Accent colour" htmlFor="accent_hex" hint="Tints the 3D hero shoe." errors={errors.accent_hex}>
            <div className="flex items-center gap-2">
              <input type="color" aria-label="Pick accent colour" value={accent} onChange={(e) => setAccent(e.target.value.toUpperCase())} className="size-12 shrink-0 cursor-pointer rounded-full border-[1.5px] border-line bg-white p-1" />
              <input id="accent_hex" name="accent_hex" value={accent} onChange={(e) => setAccent(e.target.value)} className={inputClasses(Boolean(errors.accent_hex))} />
            </div>
          </Field>
          <Field label="Sort order" htmlFor="sort_order" errors={errors.sort_order}>
            <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={product?.sort_order ?? 0} className={inputClasses()} />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-3 font-bold">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="size-5 accent-cocoa" />
          Feature in hero & best sellers
        </label>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg bg-white p-6 shadow-card">
          <p className="mb-3 text-sm font-bold">Image</p>
          <label
            htmlFor="image"
            className={cn(
              "relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-md border-2 border-dashed bg-sand/50 text-center transition hover:border-clay",
              errors.image || fileError ? "border-danger" : "border-line",
            )}
          >
            {preview ? (
              // Admin-only preview of a local blob or remote URL; next/image can't optimise blobs.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="absolute inset-0 size-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2 p-6 text-sm text-muted">
                <ImagePlus className="size-8" />
                Click to upload PNG, JPEG or WebP (max 3 MB)
              </span>
            )}
          </label>
          <input id="image" name="image" type="file" accept={IMAGE_TYPES.join(",")} onChange={(e) => onFile(e.target.files?.[0])} className="sr-only" />
          {(fileError || errors.image?.[0]) && <p className="mt-2 text-sm text-danger">{fileError ?? errors.image?.[0]}</p>}

          <div className="mt-4">
            <Field label="…or image URL" htmlFor="image_url" errors={errors.image_url}>
              <input
                id="image_url"
                name="image_url"
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) setPreview(e.target.value);
                }}
                placeholder="https://…"
                className={inputClasses(Boolean(errors.image_url))}
              />
            </Field>
          </div>
        </div>

        <div aria-live="polite">
          {state && !state.ok && <p className="rounded-md bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{state.error}</p>}
        </div>

        <div className="flex gap-3">
          <Link href="/admin" className={cn(buttonClasses("ghost"), "flex-1")}>
            Cancel
          </Link>
          <button type="submit" disabled={pending || Boolean(fileError)} className={cn(buttonClasses("cocoa"), "flex-1")}>
            {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
            {pending ? "Saving…" : product ? "Save changes" : "Add sneaker"}
          </button>
        </div>
      </div>
    </form>
  );
}
