"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const waitlistFirst = product.availability === "sold_out" || product.availability === "coming_soon";

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={reset}
      data-cursor={waitlistFirst ? "Notify" : "View"}
      className="group relative rounded-lg p-3 shadow-card transition-shadow duration-500 hover:shadow-lift"
      style={{ rotateX, rotateY, transformPerspective: 900, backgroundColor: `color-mix(in oklab, ${product.accent_hex ?? "#E8875C"} 22%, #f7ede2)` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream">
        <Image
          src={product.image_url}
          alt={`${product.name} — ${product.colorway ?? "sneaker"}`}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px"
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:-rotate-3 group-hover:scale-110"
        />
        <AvailabilityBadge availability={product.availability} onDark className="absolute left-3 top-3 shadow-card" />
        <span
          aria-hidden
          className="absolute bottom-3 right-3 size-6 rounded-full border-2 border-cream shadow-card"
          style={{ backgroundColor: product.accent_hex ?? "#E8875C" }}
        />
      </div>

      <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-4">
        <div className="min-w-0">
          <h3 className="headline truncate text-2xl">
            <Link href={`/sneakers/${product.slug}`} className="after:absolute after:inset-0 after:rounded-lg">
              {product.name}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted">{product.colorway}</p>
        </div>
        <p className="shrink-0 text-lg font-bold tabular-nums">{formatPrice(product.price_cents)}</p>
      </div>

    </motion.article>
  );
}
