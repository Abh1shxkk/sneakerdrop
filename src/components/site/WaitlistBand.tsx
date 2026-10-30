"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { RotatingBadge } from "@/components/site/RotatingBadge";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const ORDER = { coming_soon: 0, sold_out: 1, low_stock: 2, available: 3 } as const;

/** Next Friday, 8 PM IST — drops go live weekly. */
function nextDrop(now: Date) {
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  const daysAhead = (5 - ist.getUTCDay() + 7) % 7;
  const target = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + daysAhead, 20) - 5.5 * 3600_000;
  return target <= now.getTime() ? target + 7 * 86_400_000 : target;
}

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(nextDrop(new Date()) - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return ["--", "--", "--", "--"];
  return [86_400_000, 3_600_000, 60_000, 1000].map((unit, i, all) =>
    String(Math.floor((i === 0 ? left : left % all[i - 1]) / unit)).padStart(2, "0"),
  );
}

const passNumber = (id: string) => String(([...id].reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % 9000 + 1000);

export function WaitlistBand({ products }: { products: Product[] }) {
  const options = [...products].sort((a, b) => ORDER[a.availability] - ORDER[b.availability]);
  const [selected, setSelected] = useState(options[0]?.id);
  const countdown = useCountdown();
  if (options.length === 0) return null;
  const current = options.find((p) => p.id === selected) ?? options[0];
  const accent = current.accent_hex ?? "#E8875C";

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="section-y relative overflow-hidden bg-cream">
      <div className="container-x">
        <Reveal className="relative flex flex-col items-center text-center">
          <p className="eyebrow text-clay">Waitlist</p>
          <h2 id="waitlist-title" className="headline mt-2 text-[clamp(3rem,9vw,8rem)]">
            The drop <span className="text-outline text-ink">list.</span>
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Claim a free drop pass for the pair you want. We&apos;ll email you before it goes public. One email per drop, never spam.
          </p>
          <div className="absolute -top-4 right-4 hidden -rotate-12 text-ink lg:block">
            <RotatingBadge text="Free · Early access · No spam · ">
              <span className="font-display text-sm font-bold">FREE</span>
            </RotatingBadge>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-5xl">
          <div className="group relative grid overflow-hidden rounded-lg shadow-lift transition-transform duration-700 ease-out-soft hover:-rotate-[0.6deg] md:grid-cols-[1fr_280px]">
            {/* main ticket */}
            <div
              className="relative min-w-0 p-6 transition-colors duration-700 sm:p-9"
              style={{ backgroundColor: `color-mix(in oklab, ${accent} 38%, #f7ede2)` }}
            >
              <div className="flex items-center justify-between text-ink/70">
                <p className="eyebrow">Admit one pair</p>
                <p className="eyebrow">Drop pass</p>
              </div>

              <div className="mt-6 grid items-center gap-6 sm:grid-cols-[200px_1fr]">
                <div className="relative mx-auto aspect-square w-44 sm:w-full">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, rotate: -18, scale: 0.85 }}
                      animate={{ opacity: 1, rotate: -6, scale: 1 }}
                      exit={{ opacity: 0, rotate: 12, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 overflow-hidden rounded-md border-4 border-cream shadow-lift"
                    >
                      <Image src={current.image_url} alt={`${current.name} — ${current.colorway ?? "sneaker"}`} fill sizes="200px" className="object-cover" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="text-center sm:text-left">
                  <AvailabilityBadge availability={current.availability} onDark className="shadow-card" />
                  <p className="headline mt-3 text-[clamp(2.25rem,5vw,3.75rem)] text-ink">{current.name}</p>
                  <p className="text-ink/70">
                    {current.colorway} · <span className="font-bold tabular-nums">{formatPrice(current.price_cents)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-bold text-ink">Choose your pair</p>
                <div role="radiogroup" aria-label="Sneaker" className="mt-3 flex gap-2.5 overflow-x-auto p-1 [scrollbar-width:none]">
                  {options.map((p) => {
                    const isActive = p.id === current.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={p.name}
                        title={p.name}
                        onClick={() => setSelected(p.id)}
                        className={cn(
                          "relative size-12 shrink-0 overflow-hidden rounded-full border-2 transition duration-300 ease-out-soft hover:-translate-y-1",
                          isActive ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-transparent" : "border-cream",
                        )}
                      >
                        <Image src={p.image_url} alt="" fill sizes="48px" className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <WaitlistForm productId={current.id} ctaLabel="Claim my pass" />
              </div>
            </div>

            {/* perforation notches */}
            <span aria-hidden className="absolute right-[280px] top-0 hidden size-8 -translate-y-1/2 translate-x-1/2 rounded-full bg-cream md:block" />
            <span aria-hidden className="absolute bottom-0 right-[280px] hidden size-8 translate-x-1/2 translate-y-1/2 rounded-full bg-cream md:block" />

            {/* tear-off stub */}
            <div className="relative flex flex-col justify-between gap-8 border-t-2 border-dashed border-cream/30 bg-ink p-6 text-cream sm:p-8 md:border-l-2 md:border-t-0">
              <div>
                <p className="eyebrow text-cream/50">Pass no.</p>
                <p className="font-display text-5xl font-bold tabular-nums" style={{ color: `color-mix(in oklab, ${accent} 70%, #f7ede2)` }}>
                  #{passNumber(current.id)}
                </p>
              </div>

              <div>
                <p className="eyebrow text-cream/50">Next drop in</p>
                <div role="timer" aria-label="Time until the next drop" className="mt-3 grid grid-cols-4 gap-1.5 md:grid-cols-2">
                  {countdown.map((value, i) => (
                    <div key={i} className="rounded-sm bg-cream/10 px-2 py-2 text-center">
                      <p className="font-display text-2xl font-bold tabular-nums leading-none">{value}</p>
                      <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">{["Days", "Hrs", "Min", "Sec"][i]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div
                  aria-hidden
                  className="h-14 w-full rounded-sm"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #f7ede2 0 2px, transparent 2px 4px, #f7ede2 4px 7px, transparent 7px 9px, #f7ede2 9px 10px, transparent 10px 14px)",
                  }}
                />
                <p className="mt-2 flex justify-between text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cream/50">
                  <span>Fri · 8 PM IST</span>
                  <span>SD-26</span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
