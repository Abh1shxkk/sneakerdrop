import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import type { Product } from "@/lib/types";

const REASONS = [
  { icon: Sparkles, title: "Limited by design", copy: "Small runs, numbered pairs. Once a drop is gone, it's gone." },
  { icon: ShieldCheck, title: "Authenticity built in", copy: "Every pair is checked by hand before it leaves the studio." },
  { icon: Truck, title: "48-hour dispatch", copy: "Free shipping across India and 30-day no-fuss returns." },
  { icon: Leaf, title: "Lighter footprint", copy: "Recycled laces, water-based glues and plastic-free boxes." },
];

export function WhySection({ product }: { product?: Product }) {
  return (
    <section id="why" aria-labelledby="why-title" className="section-y bg-sand">
      <div className="container-x grid items-center gap-14 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow text-clay">Why SneakerDrop</p>
            <h2 id="why-title" className="headline mt-2 text-[clamp(2.5rem,6vw,5rem)]">
              Less hype.
              <br />
              More pairs worth keeping.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {REASONS.map((r) => (
                <li key={r.title} className="group flex gap-5 py-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cream text-cocoa transition-transform duration-500 ease-out-soft group-hover:-rotate-12 group-hover:scale-110">
                    <r.icon aria-hidden className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{r.title}</h3>
                    <p className="text-muted">{r.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {product && (
          <Reveal delay={0.1} className="relative">
            <div aria-hidden className="absolute inset-6 -rotate-6 rounded-lg bg-peach" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lift">
              <Image
                src={product.image_url}
                alt={`${product.name} in ${product.colorway ?? "its signature colourway"}`}
                fill
                sizes="(max-width: 768px) 92vw, 600px"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
