import { Reveal } from "@/components/site/Reveal";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import type { Product } from "@/lib/types";

export function WaitlistBand({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  // Sold-out and upcoming pairs first: that's where a waitlist matters most.
  const order = { coming_soon: 0, sold_out: 1, low_stock: 2, available: 3 } as const;
  const options = [...products].sort((a, b) => order[a.availability] - order[b.availability]);

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="bg-cream px-2 pb-2 sm:px-3 sm:pb-3">
      <Reveal className="grain relative overflow-hidden rounded-lg bg-cocoa text-cream">
        <div
          aria-hidden
          className="absolute -right-20 -top-24 size-96 rounded-full bg-clay/40 blur-3xl"
        />
        <div className="container-x relative grid gap-10 py-[clamp(4rem,9vw,7rem)] md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-peach">Waitlist</p>
            <h2 id="waitlist-title" className="headline mt-3 text-[clamp(2.75rem,7vw,6rem)]">
              Never miss
              <br />a drop.
            </h2>
            <p className="mt-4 max-w-md text-cream/75">
              Pick a pair, drop your email, and we&apos;ll let you know the moment it restocks or launches. One email per drop. No spam.
            </p>
          </div>
          <WaitlistForm products={options} tone="dark" ctaLabel="Notify me" />
        </div>
      </Reveal>
    </section>
  );
}
