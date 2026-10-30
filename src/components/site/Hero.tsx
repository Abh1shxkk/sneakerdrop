"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ColorFlood } from "@/components/site/ColorFlood";
import { RotatingBadge } from "@/components/site/RotatingBadge";
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
  const panel = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState("10% 90%");
  const [inView, setInView] = useState(true);
  const product = products[active];
  const accent = product?.accent_hex ?? "#E8875C";

  // Stop rendering WebGL frames once the hero is off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const pick = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    const box = panel.current?.getBoundingClientRect();
    const btn = e.currentTarget.getBoundingClientRect();
    if (box) {
      const x = ((btn.left + btn.width / 2 - box.left) / box.width) * 100;
      const y = ((btn.top + btn.height / 2 - box.top) / box.height) * 100;
      setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    }
    setActive(i);
  };

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
            .to(q("[data-badge]"), { scale: 0.6, opacity: 0, duration: 0.2 }, 0.04)
            .to(q("[data-hint]"), { opacity: 0, duration: 0.08 }, 0)
            .to(q("[data-band]"), { xPercent: -18, duration: 1 }, 0)
            .fromTo(q("[data-callout]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.12 }, 0.38)
            .to(q("[data-callout]"), { opacity: 0, y: -24, duration: 0.1 }, 0.66)
            .to(q("[data-dim]"), { opacity: 1, duration: 0.3 }, 0.68)
            .fromTo(q("[data-final]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2 }, 0.76)
            .set({}, {}, 1);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const bandText = `${product?.name ?? "SneakerDrop"} — `.repeat(6);

  return (
    <section ref={root} id="top" aria-label="SneakerDrop hero" className="relative bg-peach p-2 sm:p-3">
      <div
        ref={panel}
        className="relative h-[calc(100svh-1rem)] min-h-[560px] overflow-hidden rounded-lg text-cream sm:h-[calc(100svh-1.5rem)]"
      >
        <ColorFlood color={accent} origin={origin} />
        <div data-dim aria-hidden className="absolute inset-0 bg-ink/60 opacity-0" />

        {/* glow */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[58%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl transition-[background] duration-700"
          style={{ background: `radial-gradient(circle, ${accent}88 0%, ${accent}22 45%, transparent 70%)` }}
        />

        {/* kinetic name band behind the shoe */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[62%] select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent_18%,black_42%,black_72%,transparent)]">
          <p data-band className="headline text-outline whitespace-nowrap text-[clamp(4rem,11vw,10rem)] leading-none text-cream/25">
            <span key={product?.id} className="inline-block animate-fade-up">
              {bandText}
            </span>
          </p>
        </div>

        <div className="relative z-0 flex flex-col items-center pt-28 text-center sm:pt-32">
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

        {/* side rails */}
        <p aria-hidden className="eyebrow absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rotate-180 text-cream/60 [writing-mode:vertical-rl] lg:block">
          SS26 collection · Numbered pairs
        </p>
        <p aria-hidden className="eyebrow absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 text-cream/60 [writing-mode:vertical-rl] lg:block">
          Est. 2026 · Made to be worn
        </p>

        <div className="absolute inset-0 z-10">
          <ShoeScene accent={accent} active={inView} progress={progress} pointer={pointer} />
        </div>

        {/* rotating stamp */}
        {product && (
          <div data-badge className="absolute right-[14%] top-[30%] z-20 hidden text-cream md:block">
            <RotatingBadge text="Limited edition · 500 pairs only · ">
              <span className="font-display text-xl font-bold leading-none">
                {String(active + 1).padStart(2, "0")}
              </span>
            </RotatingBadge>
          </div>
        )}

        {/* feature callouts */}
        <ul className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          {CALLOUTS.map((c) => (
            <li key={c.title} data-callout className={cn("absolute flex items-center gap-3 opacity-0", c.pos, c.side === "left" && "flex-row-reverse text-right")}>
              <div className="rounded-md border border-cream/15 bg-ink/55 px-4 py-3">
                <p className="font-bold">{c.title}</p>
                <p className="text-sm text-cream/75">{c.copy}</p>
              </div>
              <span aria-hidden className="h-px w-16 bg-cream/50 lg:w-28" />
              <span aria-hidden className="size-3 rounded-full border-2 border-cream" style={{ backgroundColor: accent }} />
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
        <div data-lead className="absolute bottom-6 left-5 z-20 max-w-sm sm:bottom-10 sm:left-12">
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
            <div role="group" aria-label="Choose a colourway" className="mt-5 flex gap-2.5 overflow-x-auto p-1 [scrollbar-width:none]">
              {products.slice(0, 6).map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={(e) => pick(i, e)}
                  aria-pressed={i === active}
                  aria-label={`Show ${p.name}`}
                  className={cn(
                    "group relative size-12 shrink-0 rounded-full transition duration-300 ease-out-soft hover:-translate-y-1 sm:size-14",
                    i === active ? "ring-2 ring-cream ring-offset-2 ring-offset-transparent" : "",
                  )}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-full border-2 border-cream/60 bg-cream">
                    <Image src={p.image_url} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 size-4 rounded-full border-2 border-cream"
                    style={{ backgroundColor: p.accent_hex ?? "#E8875C" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* bottom-right: active product */}
        {product && (
          <div data-info className="absolute bottom-10 right-12 z-20 hidden w-72 lg:block">
            <div key={product.id} className="relative rounded-md border border-cream/15 bg-ink/55 p-5 animate-fade-up">
              <span
                className="absolute -right-3 -top-4 rotate-6 rounded-full px-3 py-1 font-display text-lg font-bold text-ink shadow-card"
                style={{ backgroundColor: "#f7ede2" }}
              >
                {formatPrice(product.price_cents)}
              </span>
              <div className="flex items-center justify-between">
                <AvailabilityBadge availability={product.availability} onDark />
                <span className="font-display text-sm font-bold tabular-nums text-cream/60">
                  {String(active + 1).padStart(2, "0")} / {String(Math.min(products.length, 6)).padStart(2, "0")}
                </span>
              </div>
              <p className="headline mt-3 text-3xl">{product.name}</p>
              <p className="text-sm text-cream/75">{product.colorway}</p>
              <Link
                href={`/sneakers/${product.slug}`}
                className="mt-4 inline-block text-sm font-bold underline decoration-2 underline-offset-4 hover:text-peach"
                style={{ textDecorationColor: accent }}
              >
                View this pair →
              </Link>
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
