"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/cn";
import { prefersDarkText } from "@/lib/color";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Expanding colour panels — one per product, painted in its accent colour. */
export function Colourways({ products }: { products: Product[] }) {
  const items = products.filter((p) => p.accent_hex).slice(0, 7);
  const [open, setOpen] = useState(0);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="colourways-title" className="section-y bg-sand">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-forest">Colour stories</p>
            <h2 id="colourways-title" className="headline mt-2 text-[clamp(2.5rem,6vw,5rem)]">
              Find your <span className="text-clay">colourway</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted">Every pair has its own colour. Hover a panel to open it up.</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 flex flex-col gap-3 md:h-[30rem] md:flex-row">
          {items.map((p, i) => {
            const accent = p.accent_hex as string;
            const dark = prefersDarkText(accent);
            const isOpen = i === open;
            return (
              <Link
                key={p.id}
                href={`/sneakers/${p.slug}`}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                data-cursor="View"
                className={cn(
                  "group relative h-24 min-h-0 min-w-0 overflow-hidden rounded-lg transition-[flex-grow] duration-700 ease-out-soft md:h-auto",
                  isOpen ? "md:flex-[5]" : "md:flex-1",
                  dark ? "text-ink" : "text-cream",
                )}
                style={{ backgroundColor: accent }}
              >
                <div
                  className={cn(
                    "absolute right-6 top-6 hidden aspect-square w-[min(52%,19rem)] overflow-hidden rounded-md border-4 shadow-lift transition-all duration-700 ease-out-soft md:block",
                    dark ? "border-ink/10" : "border-cream/30",
                    isOpen ? "translate-x-0 rotate-3 opacity-100" : "translate-x-10 rotate-12 opacity-0",
                  )}
                >
                  <Image src={p.image_url} alt="" fill sizes="420px" className="object-cover" />
                </div>

                <div className="relative flex h-full flex-col justify-center p-5 md:justify-between md:p-6">
                  <span className="hidden font-display text-lg font-bold opacity-70 md:block">{String(i + 1).padStart(2, "0")}</span>
                  <div className={cn("transition-opacity duration-500", isOpen ? "opacity-100" : "opacity-100 md:opacity-0")}>
                    <p className="eyebrow hidden opacity-70 md:block">{p.colorway}</p>
                    <p className="headline mt-1 whitespace-nowrap text-[clamp(1.75rem,3.5vw,3.25rem)]">{p.name}</p>
                    <p className="mt-1 flex items-center gap-2 font-bold md:mt-2">
                      {formatPrice(p.price_cents)}
                      <ArrowUpRight aria-hidden className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </p>
                  </div>
                </div>

                {/* collapsed label */}
                <p
                  aria-hidden
                  className={cn(
                    "headline pointer-events-none absolute bottom-6 left-1/2 hidden origin-center -translate-x-1/2 whitespace-nowrap text-2xl [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 md:block",
                    isOpen ? "opacity-0" : "opacity-80",
                  )}
                >
                  {p.name}
                </p>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
