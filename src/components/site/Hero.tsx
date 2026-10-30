"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ShoeScene = dynamic(() => import("@/components/site/ShoeScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <div className="size-40 animate-pulse rounded-full bg-peach/30 blur-2xl" />
    </div>
  ),
});

const CALLOUTS = [
  { title: "Cloud-Foam Midsole", copy: "Soft landings, springy toe-off.", pos: "left-[6%] top-[24%]", side: "right" },
  { title: "Breathable Knit", copy: "Engineered airflow zones.", pos: "right-[6%] top-[22%]", side: "left" },
  { title: "Grip-Lock Outsole", copy: "Wet-street traction.", pos: "left-[8%] bottom-[20%]", side: "right" },
  { title: "Recycled Laces", copy: "Made from ocean plastic.", pos: "right-[8%] bottom-[22%]", side: "left" },
] as const;

export function Hero({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const product = products[active];
  const accent = product?.accent_hex ?? "#E8875C";

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const q = gsap.utils.selector(root);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: desktop ? "+=220%" : "+=140%",
              pin: true,
              scrub: 1,
              onUpdate: (self) => {
                progress.current = self.progress;
              },
            },
          });

          tl.to(q("[data-word]"), { yPercent: -28, opacity: 0.12, duration: 0.36 }, 0)
            .to(q("[data-eyebrow]"), { y: -60, opacity: 0, duration: 0.22 }, 0)
            .to(q("[data-lead]"), { y: 60, opacity: 0, duration: 0.22 }, 0.04)
            .to(q("[data-info]"), { x: 60, opacity: 0, duration: 0.22 }, 0.04)
            .to(q("[data-hint]"), { opacity: 0, duration: 0.08 }, 0)
            .fromTo(q("[data-callout]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.12 }, 0.38)
            .to(q("[data-callout]"), { opacity: 0, y: -24, duration: 0.1 }, 0.66)
            .to(q("[data-panel]"), { backgroundColor: "#5a1a14", duration: 0.3 }, 0.68)
            .fromTo(q("[data-final]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2 }, 0.76)
            .set({}, {}, 1);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="SneakerDrop hero" className="relative bg-peach p-2 sm:p-3">
      <div
        data-panel
        className="grain relative h-[calc(100svh-1rem)] min-h-[560px] overflow-hidden rounded-lg bg-cocoa text-cream sm:h-[calc(100svh-1.5rem)]"
      >
        {/* glow */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[58%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(circle, ${accent}66 0%, #f4b38e33 45%, transparent 70%)` }}
        />

        <div className="relative z-0 flex flex-col items-center pt-24 text-center sm:pt-28">
          <p data-eyebrow className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-semibold leading-none">
            drop <span className="text-peach">happy.</span>
          </p>
          <h1
            data-word
            className="mt-1 select-none font-display text-[clamp(7rem,27vw,25rem)] font-bold leading-[0.8] tracking-[-0.04em] text-cream"
          >
            drop<span className="sr-only"> — SneakerDrop limited sneakers</span>
          </h1>
        </div>

        <div className="absolute inset-0 z-10">
          <ShoeScene accent={accent} progress={progress} pointer={pointer} />
        </div>

        {/* feature callouts */}
        <ul className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          {CALLOUTS.map((c) => (
            <li key={c.title} data-callout className={cn("absolute flex items-center gap-3 opacity-0", c.pos, c.side === "left" && "flex-row-reverse text-right")}>
              <div className="rounded-md border border-cream/20 bg-cream/10 px-4 py-3 backdrop-blur-md">
                <p className="font-bold">{c.title}</p>
                <p className="text-sm text-cream/75">{c.copy}</p>
              </div>
              <span aria-hidden className="h-px w-16 bg-cream/50 lg:w-28" />
              <span aria-hidden className="size-3 rounded-full border-2 border-cream bg-clay" />
            </li>
          ))}
        </ul>

        <p
          data-final
          className="headline pointer-events-none absolute inset-x-0 top-[16%] z-20 text-center text-[clamp(2.5rem,7vw,6rem)] text-cream opacity-0"
        >
          Built for the drop
        </p>

        {/* bottom-left: copy, CTA, swatches */}
        <div data-lead className="absolute bottom-6 left-5 z-20 max-w-sm sm:bottom-10 sm:left-10">
          <p className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-tight">
            Limited pairs.
            <br />
            Zero compromise.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <LinkButton href="#collection" variant="cream" arrow>
              Shop the Drop
            </LinkButton>
          </div>
          {products.length > 0 && (
            <div role="group" aria-label="Choose a colourway" className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
              {products.slice(0, 6).map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={`Show ${p.name}`}
                  className={cn(
                    "relative size-12 shrink-0 overflow-hidden rounded-full border-2 bg-cream transition duration-300 ease-out-soft hover:-translate-y-1 sm:size-14",
                    i === active ? "border-cream ring-2 ring-peach ring-offset-2 ring-offset-cocoa" : "border-cream/40",
                  )}
                >
                  <Image src={p.image_url} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* bottom-right: active product */}
        {product && (
          <div data-info className="absolute bottom-10 right-10 z-20 hidden w-64 lg:block">
            <div key={product.id} className="rounded-md border border-cream/20 bg-cream/10 p-5 backdrop-blur-md animate-fade-up">
              <AvailabilityBadge availability={product.availability} onDark />
              <p className="headline mt-3 text-3xl">{product.name}</p>
              <p className="text-sm text-cream/75">{product.colorway}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold tabular-nums">{formatPrice(product.price_cents)}</span>
                <Link
                  href={`/sneakers/${product.slug}`}
                  className="text-sm font-bold underline decoration-peach decoration-2 underline-offset-4 hover:text-peach"
                >
                  View pair
                </Link>
              </div>
            </div>
          </div>
        )}

        <div data-hint aria-hidden className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
          <span className="eyebrow text-cream/70">Scroll</span>
          <span className="flex h-9 w-5 justify-center rounded-full border-2 border-cream/50 pt-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-cream" />
          </span>
        </div>
      </div>
    </section>
  );
}
