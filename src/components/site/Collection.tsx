"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/cn";
import { AVAILABILITY_LABEL } from "@/lib/format";
import { AVAILABILITY, type Availability, type Product } from "@/lib/types";

type Filter = "all" | Availability;

export function Collection({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? products : products.filter((p) => p.availability === filter);
  const filters: Filter[] = ["all", ...AVAILABILITY.filter((a) => products.some((p) => p.availability === a))];

  return (
    <section id="collection" aria-labelledby="collection-title" className="section-y bg-cream">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-clay">The full lineup</p>
            <h2 id="collection-title" className="headline mt-2 text-[clamp(2.5rem,6vw,5rem)]">
              The Collection
            </h2>
          </div>
          <div role="group" aria-label="Filter by availability" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "relative h-10 rounded-full px-4 text-sm font-bold transition-colors",
                  filter === f ? "text-cream" : "text-ink hover:bg-sand",
                )}
              >
                {filter === f && (
                  <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-cocoa" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative">{f === "all" ? "All" : AVAILABILITY_LABEL[f]}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {products.length === 0 ? (
          <p className="mt-16 rounded-lg bg-sand p-10 text-center text-muted">New pairs are on the way. Check back soon.</p>
        ) : (
          <motion.ul layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}
