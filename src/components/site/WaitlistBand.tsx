"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { cn } from "@/lib/cn";
import { AVAILABILITY_LABEL } from "@/lib/format";
import type { Product } from "@/lib/types";

const ORDER = { coming_soon: 0, sold_out: 1, low_stock: 2, available: 3 } as const;

/** Next Friday, 8 PM IST — drops go live weekly. */
function nextDrop(now: Date) {
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  const daysAhead = (5 - ist.getUTCDay() + 7) % 7;
  const target = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + daysAhead, 20) - 5.5 * 3600_000;
  return target <= now.getTime() ? target + 7 * 86_400_000 : target;
}

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(nextDrop(new Date()) - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [86_400_000, 3_600_000, 60_000, 1000].map((unit, i, all) =>
          String(Math.floor((i === 0 ? left : left % all[i - 1]) / unit)).padStart(2, "0"),
        );

  return (
    <div role="timer" aria-label="Time until the next drop" className="flex gap-2">
      {parts.map((value, i) => (
        <div key={i} className="w-16 rounded-md bg-cream/10 py-3 text-center sm:w-[4.5rem]">
          <p className="font-display text-3xl font-bold tabular-nums leading-none sm:text-4xl">{value}</p>
          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-cream/60">{["Days", "Hrs", "Min", "Sec"][i]}</p>
        </div>
      ))}
    </div>
  );
}

export function WaitlistBand({ products }: { products: Product[] }) {
  const options = [...products].sort((a, b) => ORDER[a.availability] - ORDER[b.availability]).slice(0, 6);
  const [selected, setSelected] = useState(options[0]?.id);
  if (options.length === 0) return null;
  const current = options.find((p) => p.id === selected) ?? options[0];

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="bg-cream px-2 pb-2 sm:px-3 sm:pb-3">
      <Reveal className="relative overflow-hidden rounded-lg bg-ink text-cream">
        <p
          aria-hidden
          className="headline text-outline pointer-events-none absolute -right-6 top-6 select-none whitespace-nowrap text-[clamp(6rem,16vw,15rem)] text-cream/[0.04]"
        >
          Drop pass
        </p>
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 size-[28rem] rounded-full opacity-40 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: current.accent_hex ?? "#E8875C" }}
        />

        <div className="container-x relative grid gap-12 py-[clamp(4rem,8vw,6.5rem)] lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-peach">Waitlist</p>
            <h2 id="waitlist-title" className="headline mt-3 text-[clamp(2.75rem,6.5vw,5.5rem)]">
              Get your <span className="text-peach">drop pass.</span>
            </h2>
            <p className="mt-4 max-w-md text-cream/70">
              Pick a pair, leave your email, and you&apos;ll hear about it before anyone else. One email per drop, never spam.
            </p>
            <p className="eyebrow mt-10 text-cream/60">Next drop goes live in</p>
            <div className="mt-3">
              <Countdown />
            </div>
          </div>

          <div className="rounded-lg bg-cream p-5 text-ink sm:p-7">
            <p className="text-sm font-bold">
              <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-ink text-xs text-cream">1</span>
              Pick your pair
            </p>
            <div role="radiogroup" aria-label="Sneaker" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {options.map((p) => {
                const isActive = p.id === current.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setSelected(p.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-md bg-sand text-left transition duration-300 ease-out-soft hover:-translate-y-1",
                      isActive ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "opacity-80 hover:opacity-100",
                    )}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={p.image_url} alt="" fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      {isActive && (
                        <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-ink text-cream">
                          <Check aria-hidden className="size-3.5" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: p.accent_hex ?? "#E8875C" }} />
                        {AVAILABILITY_LABEL[p.availability]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-sm font-bold">
              <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-ink text-xs text-cream">2</span>
              Where should we send it?
            </p>
            <div className="mt-3">
              <WaitlistForm productId={current.id} ctaLabel={`Notify me · ${current.name}`} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
