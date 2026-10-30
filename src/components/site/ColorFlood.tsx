"use client";

import { motion } from "motion/react";
import { useState } from "react";

type Layer = { id: number; color: string; origin: string };

/** Background that floods in each new colour as a circle expanding from `origin`. */
export function ColorFlood({ color, origin }: { color: string; origin: string }) {
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, color, origin }]);
  const [last, setLast] = useState(color);

  if (color !== last) {
    setLast(color);
    setLayers((prev) => [...prev.slice(-1), { id: prev[prev.length - 1].id + 1, color, origin }]);
  }

  return (
    <div aria-hidden className="absolute inset-0">
      {layers.map((layer, i) => (
        <motion.div
          key={layer.id}
          className="absolute inset-0"
          style={{ backgroundColor: `color-mix(in oklab, ${layer.color} 42%, #1f1411)` }}
          initial={i === 0 && layers.length === 1 ? false : { clipPath: `circle(0% at ${layer.origin})` }}
          animate={{ clipPath: `circle(150% at ${layer.origin})` }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </div>
  );
}
