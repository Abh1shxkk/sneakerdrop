"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function Spotlight({ products }: { products: Product[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  if (products.length === 0) return null;

  const product = products[index];
  const go = (step: number) => setState(([i]) => [(i + step + products.length) % products.length, step]);

  return (
    <section id="best-sellers" aria-labelledby="best-sellers-title" className="section-y relative overflow-hidden bg-cream">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[12%] select-none text-center leading-[0.85]">
        <p className="headline text-[clamp(5rem,17vw,16rem)] text-sand">Best Sellers</p>
        <p className="headline text-outline text-[clamp(5rem,17vw,16rem)] text-line">Best Sellers</p>
      </div>

      <div className="container-x relative">
        <h2 id="best-sellers-title" className="eyebrow text-center text-muted">
          Best sellers · {index + 1} / {products.length}
        </h2>

        <div className="relative mx-auto mt-10 aspect-[4/3] w-full max-w-xl" aria-live="polite">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={product.id}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 120, rotate: d * 8 }),
                center: { opacity: 1, x: 0, rotate: -4 },
                exit: (d: number) => ({ opacity: 0, x: d * -120, rotate: d * -8 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Link
                href={`/sneakers/${product.slug}`}
                className="group relative block h-full overflow-hidden rounded-lg shadow-lift"
              >
                <Image
                  src={product.image_url}
                  alt={`${product.name} — ${product.colorway ?? "sneaker"}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 576px"
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-ink opacity-0 shadow-card transition duration-300 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  View pair
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <AvailabilityBadge availability={product.availability} />
            <p className="headline mt-2 text-4xl">{product.name}</p>
            <p className="text-muted">{product.colorway}</p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <p className="text-sm text-muted">Price</p>
            <p className="text-2xl font-bold tabular-nums text-danger">{formatPrice(product.price_cents)}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous sneaker" className="grid size-12 place-items-center rounded-full border-[1.5px] border-ink transition hover:bg-ink hover:text-cream active:scale-95">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Show ${p.name}`}
                aria-current={i === index}
                className={cn("h-2.5 rounded-full transition-all duration-300", i === index ? "w-8 bg-cocoa" : "w-2.5 bg-line hover:bg-muted")}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next sneaker" className="grid size-12 place-items-center rounded-full border-[1.5px] border-ink transition hover:bg-ink hover:text-cream active:scale-95">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
