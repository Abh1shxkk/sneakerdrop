import { Leaf, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/site/CountUp";
import { Reveal } from "@/components/site/Reveal";
import type { Product } from "@/lib/types";

const tile = "group relative overflow-hidden rounded-lg p-6 transition-transform duration-500 ease-out-soft hover:-translate-y-1.5 sm:p-7";

export function WhySection({ product }: { product?: Product }) {
  return (
    <section id="why" aria-labelledby="why-title" className="section-y bg-cream">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-forest">Why SneakerDrop</p>
            <h2 id="why-title" className="headline mt-2 text-[clamp(2.75rem,7vw,6rem)]">
              Built <span className="text-clay">different.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted">
            Small runs, honest materials and pairs that are checked by hand. Here&apos;s what every drop promises.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 grid auto-rows-[minmax(220px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Feature image */}
          <Link
            href={product ? `/sneakers/${product.slug}` : "#collection"}
            className={`${tile} flex min-h-[440px] flex-col justify-end bg-ink text-cream sm:col-span-2 lg:row-span-2`}
          >
            {product && (
              <Image
                src={product.image_url}
                alt={`${product.name} in ${product.colorway ?? "its signature colourway"}`}
                fill
                sizes="(max-width: 1024px) 92vw, 640px"
                className="object-cover opacity-80 transition-transform duration-700 ease-out-soft group-hover:scale-105"
              />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="relative">
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink">Numbered runs</span>
              <h3 className="headline mt-4 text-[clamp(2rem,4vw,3.25rem)]">Limited by design</h3>
              <p className="mt-2 max-w-sm text-cream/80">
                Every colourway is capped at 500 pairs. Once a drop is gone, it&apos;s gone.
              </p>
            </div>
          </Link>

          {/* Stat */}
          <div className={`${tile} flex flex-col justify-between bg-clay text-cream`}>
            <p className="eyebrow text-cream/80">Dispatch</p>
            <div>
              <p className="font-display text-[5.5rem] font-bold leading-none">
                <CountUp to={48} suffix="h" />
              </p>
              <p className="mt-1 font-medium">Free shipping across India, 30-day returns.</p>
            </div>
          </div>

          {/* Authenticity */}
          <div className={`${tile} flex flex-col justify-between bg-sky text-ink`}>
            <span className="grid size-12 place-items-center rounded-full bg-cream text-info transition-transform duration-500 group-hover:rotate-12">
              <ShieldCheck aria-hidden className="size-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold">100% authentic</h3>
              <p className="mt-1 text-ink/70">Every pair is checked by hand before it leaves the studio.</p>
            </div>
          </div>

          {/* Rating */}
          <div className={`${tile} flex flex-col justify-between bg-lilac text-ink`}>
            <div className="flex gap-1 text-info" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-5 fill-current transition-transform duration-300 group-hover:-translate-y-1" style={{ transitionDelay: `${i * 40}ms` }} />
              ))}
            </div>
            <div>
              <p className="font-display text-6xl font-bold leading-none">
                <CountUp to={4.9} decimals={1} />
              </p>
              <p className="mt-1 font-medium text-ink/70">Average rating from 2,300+ sneakerheads.</p>
            </div>
          </div>

          {/* Sustainability */}
          <div className={`${tile} flex flex-col justify-between bg-sage text-ink`}>
            <span className="grid size-12 place-items-center rounded-full bg-cream text-ok transition-transform duration-500 group-hover:-rotate-12">
              <Leaf aria-hidden className="size-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold">Lighter footprint</h3>
              <p className="mt-1 text-ink/70">Recycled laces, water-based glues and plastic-free boxes.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
