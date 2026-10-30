"use client";

import { ArrowLeft, ArrowRight, Hand } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const AUTOPLAY_MS = 5000;
const FAN = [
  { rotate: -4, x: 0, y: 0, scale: 1 },
  { rotate: 7, x: 46, y: 14, scale: 0.94 },
  { rotate: -11, x: -40, y: 26, scale: 0.88 },
];

export function Spotlight({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = products.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, count]);

  if (count === 0) return null;

  const product = products[index];
  const accent = product.accent_hex ?? "#E8875C";
  const go = (step: number) => setIndex((i) => (i + step + count) % count);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) go(info.offset.x < 0 ? 1 : -1);
  };
  const deck = FAN.slice(0, Math.min(count, FAN.length)).map((_, depth) => products[(index + depth) % count]);

  return (
    <section
      id="best-sellers"
      aria-labelledby="best-sellers-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="section-y relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: `color-mix(in oklab, ${accent} 16%, #f7ede2)` }}
    >
      {/* giant rank number */}
      <div aria-hidden className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 select-none overflow-hidden sm:left-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={index}
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="headline text-outline text-[clamp(14rem,34vw,30rem)] leading-[0.8] opacity-40"
            style={{ color: accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        {/* copy */}
        <div className="order-2 lg:order-1">
          <p className="eyebrow text-clay">Best sellers · No. {String(index + 1).padStart(2, "0")}</p>
          <h2 id="best-sellers-title" className="sr-only">
            Best sellers
          </h2>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="headline mt-3 text-[clamp(3rem,7vw,6.5rem)]">{product.name}</p>
              <p className="mt-1 font-display text-2xl font-semibold" style={{ color: `color-mix(in oklab, ${accent} 75%, #1f1411)` }}>
                {product.tagline}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-3xl font-bold tabular-nums">{formatPrice(product.price_cents)}</span>
                <AvailabilityBadge availability={product.availability} />
                <span className="text-muted">{product.colorway}</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/sneakers/${product.slug}`} className={buttonClasses("cocoa")}>
                  View this pair
                </Link>
                <Link href="#waitlist" className={buttonClasses("ghost")}>
                  Join the waitlist
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* progress + controls */}
          <div className="mt-12 flex items-center gap-4">
            <button type="button" onClick={() => go(-1)} aria-label="Previous sneaker" className="grid size-12 shrink-0 place-items-center rounded-full border-[1.5px] border-ink transition hover:bg-ink hover:text-cream active:scale-95">
              <ArrowLeft className="size-5" />
            </button>
            <div className="flex flex-1 gap-1.5">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${p.name}`}
                  aria-current={i === index}
                  className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink/15"
                >
                  {i < index && <span className="absolute inset-0 bg-ink" />}
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-ink"
                      initial={{ width: paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Next sneaker" className="grid size-12 shrink-0 place-items-center rounded-full border-[1.5px] border-ink transition hover:bg-ink hover:text-cream active:scale-95">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        {/* fanned card deck */}
        <div className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[420px] lg:order-2" aria-live="polite">
          <AnimatePresence initial={false}>
          {deck
            .map((p, depth) => ({ p, depth }))
            .reverse()
            .map(({ p, depth }) => {
              const pose = FAN[depth];
              const top = depth === 0;
              return (
                <motion.div
                  key={p.id}
                  className={cn("absolute inset-0", top ? "z-30 cursor-grab active:cursor-grabbing" : depth === 1 ? "z-20" : "z-10")}
                  initial={{ opacity: 0, scale: 0.7, y: 40 }}
                  animate={{ opacity: 1, rotate: pose.rotate, x: pose.x, y: pose.y, scale: pose.scale }}
                  exit={{ opacity: 0, x: -420, rotate: -24, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  drag={top ? "x" : false}
                  dragSnapToOrigin
                  dragElastic={0.6}
                  onDragEnd={top ? onDragEnd : undefined}
                  whileDrag={{ rotate: 0, scale: 1.03 }}
                >
                  <div
                    data-cursor={top ? "Drag" : undefined}
                    className="relative h-full overflow-hidden rounded-lg border-[6px] border-cream shadow-lift"
                  >
                    <Image
                      src={p.image_url}
                      alt={top ? `${p.name} — ${p.colorway ?? "sneaker"}` : ""}
                      fill
                      draggable={false}
                      sizes="(max-width: 1024px) 90vw, 420px"
                      className="pointer-events-none object-cover"
                    />
                    {top && (
                      <span className="absolute bottom-4 left-4 rounded-full bg-cream/95 px-3 py-1.5 text-xs font-bold text-ink shadow-card">
                        #{String(index + 1).padStart(2, "0")} best seller
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <p className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-sm font-medium text-muted">
            <Hand aria-hidden className="size-4" /> Drag the card or use the arrows
          </p>
        </div>
      </div>
    </section>
  );
}
