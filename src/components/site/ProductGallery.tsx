"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { RotatingBadge } from "@/components/site/RotatingBadge";
import { cn } from "@/lib/cn";

const VIEWS = [
  { label: "Profile", position: "50% 50%", scale: 1 },
  { label: "Toe box", position: "78% 55%", scale: 1.9 },
  { label: "Heel", position: "22% 45%", scale: 1.9 },
  { label: "Sole", position: "50% 85%", scale: 1.7 },
];

/** One product photo shown as several close-up "views", with a hover magnifier. */
export function ProductGallery({ src, alt, accent, rank }: { src: string; alt: string; accent: string; rank: number }) {
  const [view, setView] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const current = VIEWS[view];

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-[6%] rounded-full opacity-60 blur-3xl" style={{ backgroundColor: accent }} />

      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg border-[6px] border-cream bg-sand shadow-lift"
        onPointerMove={onMove}
        onPointerLeave={() => setLens(null)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={view}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={src}
              alt={`${alt} — ${current.label.toLowerCase()} view`}
              fill
              priority={view === 0}
              sizes="(max-width: 1024px) 92vw, 640px"
              className="object-cover transition-transform duration-300 ease-out-soft"
              style={{
                objectPosition: current.position,
                transform: `scale(${lens ? current.scale * 1.6 : current.scale})`,
                transformOrigin: lens ? `${lens.x}% ${lens.y}%` : current.position,
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute -right-2 -top-2 text-ink sm:right-3 sm:top-3">
          <RotatingBadge text="Numbered pair · Limited run · ">
            <span className="font-display text-xl font-bold">{String(rank).padStart(2, "0")}</span>
          </RotatingBadge>
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-bold text-cream">
          {current.label} · hover to zoom
        </span>
      </div>

      <div role="tablist" aria-label="Product views" className="relative mt-4 grid grid-cols-4 gap-3">
        {VIEWS.map((v, i) => (
          <button
            key={v.label}
            type="button"
            role="tab"
            aria-selected={i === view}
            onClick={() => setView(i)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-md border-[3px] bg-sand transition duration-300 ease-out-soft hover:-translate-y-1",
              i === view ? "border-ink" : "border-cream opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
              style={{ objectPosition: v.position, transform: `scale(${v.scale})`, transformOrigin: v.position }}
            />
            <span className="absolute inset-x-1 bottom-1 rounded-full bg-cream/90 py-0.5 text-center text-[0.65rem] font-bold text-ink">
              {v.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
