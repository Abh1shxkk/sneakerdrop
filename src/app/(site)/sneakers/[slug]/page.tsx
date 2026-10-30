import { ArrowRight, Feather, Gem, Plus, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { Reveal } from "@/components/site/Reveal";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/queries";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

/** Pre-build every product page at deploy so clicks are served straight from the CDN. New slugs render on first visit. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Sneaker not found" };
  return { title: product.name, description: product.tagline ?? product.description.slice(0, 150) };
}

const WAITLIST_COPY = {
  available: { title: "Want the next colourway?", body: "Get first dibs on restocks and new colours of this pair.", cta: "Join waitlist" },
  low_stock: { title: "Almost gone.", body: "If your size sells out, we'll tell you the moment it's back.", cta: "Notify me" },
  sold_out: { title: "Sold out — for now.", body: "Join the waitlist and be first in line when it restocks.", cta: "Notify me" },
  coming_soon: { title: "Dropping soon.", body: "Waitlist members get early access before the public launch.", cta: "Get early access" },
} as const;

const HIGHLIGHTS = [
  { icon: Gem, label: "Premium materials" },
  { icon: Feather, label: "All-day cushioning" },
  { icon: Ruler, label: "True to size" },
];

const DETAILS = [
  {
    title: "Shipping & returns",
    body: "Free shipping across India, dispatched within 48 hours. Not the one? Return it within 30 days, no questions asked.",
  },
  {
    title: "Materials & care",
    body: "Premium uppers with a durable rubber outsole. Wipe clean with a damp cloth and let it air-dry away from direct heat.",
  },
  {
    title: "Authenticity",
    body: "Every numbered pair is hand-checked in our studio and ships with a signed drop card.",
  },
];

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();

  const position = all.findIndex((p) => p.id === product.id);
  const next = all.length > 1 ? all[(position + 1) % all.length] : undefined;
  const related = all.filter((p) => p.id !== product.id && p.id !== next?.id).slice(0, 3);
  const copy = WAITLIST_COPY[product.availability];
  const accent = product.accent_hex ?? "#E8875C";

  return (
    <>
      <section
        className="relative overflow-hidden pb-24 pt-32 sm:pt-36"
        style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, #f7ede2)` }}
      >
        <p
          aria-hidden
          className="headline text-outline pointer-events-none absolute -right-10 top-24 select-none whitespace-nowrap text-[clamp(8rem,22vw,20rem)] leading-none opacity-25"
          style={{ color: accent }}
        >
          {product.name}
        </p>

        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/#collection" className="hover:text-ink">
              Collection
            </Link>
            <span aria-hidden>/</span>
            <span className="font-bold text-ink" aria-current="page">
              {product.name}
            </span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <Reveal>
              <ProductGallery
                src={product.image_url}
                alt={`${product.name} — ${product.colorway ?? "sneaker"}`}
                accent={accent}
                rank={position + 1}
              />
            </Reveal>

            <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow" style={{ color: `color-mix(in oklab, ${accent} 70%, #1f1411)` }}>
                {product.colorway}
              </p>
              <h1 className="headline mt-2 text-[clamp(3rem,7vw,6.5rem)]">{product.name}</h1>
              {product.tagline && <p className="mt-2 font-display text-2xl font-semibold text-cocoa">{product.tagline}</p>}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-4xl font-bold tabular-nums">{formatPrice(product.price_cents)}</span>
                <AvailabilityBadge availability={product.availability} />
                <span className="rounded-full border-[1.5px] border-ink/15 px-3 py-1 text-xs font-bold text-ink/70">Free shipping</span>
              </div>

              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">{product.description}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-bold shadow-card">
                    <Icon aria-hidden className="size-4" style={{ color: `color-mix(in oklab, ${accent} 80%, #1f1411)` }} />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="relative mt-8 overflow-hidden rounded-lg bg-ink p-6 text-cream sm:p-8">
                <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full opacity-50 blur-3xl" style={{ backgroundColor: accent }} />
                <p className="eyebrow relative text-cream/60">Waitlist</p>
                <h2 className="relative mt-1 text-2xl font-bold">{copy.title}</h2>
                <p className="relative mt-1 text-cream/70">{copy.body}</p>
                <div className="relative mt-5">
                  <WaitlistForm productId={product.id} ctaLabel={copy.cta} tone="dark" />
                </div>
              </div>

              <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {DETAILS.map((d) => (
                  <details key={d.title} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-bold [&::-webkit-details-marker]:hidden">
                      {d.title}
                      <Plus aria-hidden className="size-5 transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="mt-2 text-ink/70">{d.body}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {next && (
        <Link
          href={`/sneakers/${next.slug}`}
          data-cursor="Next"
          className="group relative block overflow-hidden text-cream"
          style={{ backgroundColor: `color-mix(in oklab, ${next.accent_hex ?? "#E8875C"} 45%, #1f1411)` }}
        >
          <div className="container-x relative flex items-center justify-between gap-6 py-14 sm:py-20">
            <div className="min-w-0">
              <p className="eyebrow text-cream/60">Next pair</p>
              <p className="headline mt-2 truncate text-[clamp(2.75rem,8vw,7rem)] transition-transform duration-500 ease-out-soft group-hover:translate-x-3">
                {next.name}
              </p>
              <p className="mt-1 text-cream/70">
                {next.colorway} · {formatPrice(next.price_cents)}
              </p>
            </div>
            <div className="relative hidden aspect-square w-56 shrink-0 rotate-6 overflow-hidden rounded-lg border-[6px] border-cream shadow-lift transition-transform duration-500 ease-out-soft group-hover:rotate-0 group-hover:scale-105 md:block">
              <Image src={next.image_url} alt="" fill sizes="224px" className="object-cover" />
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 ease-out-soft group-hover:-rotate-45">
              <ArrowRight aria-hidden className="size-7" />
            </span>
          </div>
        </Link>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-cream py-20">
          <div className="container-x">
            <h2 id="related-title" className="headline text-[clamp(2rem,4vw,3.5rem)]">
              You may also like
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
