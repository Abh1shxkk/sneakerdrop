import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/queries";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

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

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();

  const related = all.filter((p) => p.id !== product.id).slice(0, 3);
  const copy = WAITLIST_COPY[product.availability];

  return (
    <>
      <section className="container-x pb-20 pt-32 sm:pt-36">
        <Link href="/#collection" className="group inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink">
          <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to collection
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div
              aria-hidden
              className="absolute inset-[8%] rounded-full blur-3xl"
              style={{ backgroundColor: `${product.accent_hex ?? "#E8875C"}55` }}
            />
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-sand shadow-lift">
              <Image
                src={product.image_url}
                alt={`${product.name} — ${product.colorway ?? "sneaker"}`}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 600px"
                className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-110"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col justify-center">
            <p className="eyebrow text-clay">{product.colorway}</p>
            <h1 className="headline mt-2 text-[clamp(3rem,7vw,6rem)]">{product.name}</h1>
            {product.tagline && <p className="mt-2 font-display text-2xl font-semibold text-cocoa">{product.tagline}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold tabular-nums">{formatPrice(product.price_cents)}</span>
              <AvailabilityBadge availability={product.availability} />
            </div>

            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">{product.description}</p>

            <div className="mt-10 rounded-lg bg-sand p-6 sm:p-8">
              <h2 className="text-xl font-bold">{copy.title}</h2>
              <p className="mt-1 text-muted">{copy.body}</p>
              <div className="mt-5">
                <WaitlistForm productId={product.id} ctaLabel={copy.cta} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-sand py-20">
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
