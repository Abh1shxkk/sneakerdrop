import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { StudioClock } from "@/components/site/StudioClock";
import { getProducts } from "@/lib/queries";

const SHOP = [
  { href: "/#collection", label: "Collection" },
  { href: "/#best-sellers", label: "Best sellers" },
  { href: "/#waitlist", label: "Waitlist" },
];

const BRAND = [
  { href: "/#why", label: "Why SneakerDrop" },
  { href: "/#top", label: "The drop" },
];

/** Letter colours for the wordmark, all from the site palette. */
const WORDMARK = [
  ["s", "#e8875c"],
  ["n", "#f3d98b"],
  ["e", "#efb3a8"],
  ["a", "#b8d0e6"],
  ["k", "#cfdcc9"],
  ["e", "#ddd6f7"],
  ["r", "#f4b38e"],
  ["d", "#e8875c"],
  ["r", "#f3d98b"],
  ["o", "#efb3a8"],
  ["p", "#b8d0e6"],
] as const;

function CtaCard({ href, title, copy, className }: { href: string; title: string; copy: string; className: string }) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between gap-6 rounded-lg p-6 text-ink transition-transform duration-500 ease-out-soft hover:-translate-y-1.5 hover:-rotate-1 sm:p-7 ${className}`}
    >
      <div>
        <p className="headline text-3xl">{title}</p>
        <p className="mt-1 text-ink/70">{copy}</p>
      </div>
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform duration-500 ease-out-soft group-hover:rotate-45">
        <ArrowUpRight aria-hidden className="size-5" />
      </span>
    </Link>
  );
}

export async function Footer() {
  const products = await getProducts().catch(() => []);
  const colours = products.filter((p) => p.accent_hex);

  return (
    <footer className="overflow-hidden bg-ink text-cream">
      {/* colour strip made of every product's accent */}
      {colours.length > 0 && (
        <div aria-hidden className="flex h-2">
          {colours.map((p) => (
            <span key={p.id} className="flex-1" style={{ backgroundColor: p.accent_hex as string }} />
          ))}
        </div>
      )}

      <div className="container-x grid gap-10 pt-20 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="eyebrow text-peach">Stay in the loop</p>
          <p className="headline mt-3 text-[clamp(3rem,7vw,6rem)]">
            Don&apos;t miss the <span className="text-butter">next drop.</span>
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <CtaCard href="/#waitlist" title="Get a pass" copy="Early access, free." className="bg-butter" />
          <CtaCard href="/#collection" title="Browse all" copy="Every pair, one grid." className="bg-sky" />
        </div>
      </div>

      <div className="container-x mt-16 grid gap-10 border-t border-cream/10 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <p className="font-display text-3xl font-bold">sneakerdrop</p>
          <p className="mt-3 max-w-xs text-cream/60">Limited pairs. Zero compromise. A fictional brand built as a showcase project.</p>
          <div className="mt-6 inline-flex flex-col gap-2 rounded-md bg-cream/5 p-4 text-sm">
            <span className="flex items-center gap-2 text-cream/60">
              <MapPin aria-hidden className="size-4 text-rose" /> Studio · Mumbai
            </span>
            <span className="flex items-center gap-2 font-bold">
              <Clock aria-hidden className="size-4 text-sky" /> <StudioClock /> IST
            </span>
          </div>
        </div>

        <nav aria-label="Shop">
          <p className="eyebrow text-butter">Shop</p>
          <ul className="mt-4 space-y-2">
            {SHOP.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/75 transition-colors hover:text-butter">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Brand">
          <p className="eyebrow text-rose">Brand</p>
          <ul className="mt-4 space-y-2">
            {BRAND.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/75 transition-colors hover:text-rose">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {colours.length > 0 && (
          <nav aria-label="Colourways">
            <p className="eyebrow text-sky">Colourways</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {colours.slice(0, 9).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/sneakers/${p.slug}`}
                    className="flex items-center gap-2 rounded-full border border-cream/15 py-1 pl-1.5 pr-3 text-sm text-cream/80 transition-colors hover:border-cream/40 hover:text-cream"
                  >
                    <span aria-hidden className="size-4 rounded-full" style={{ backgroundColor: p.accent_hex as string }} />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="container-x mt-14 flex flex-col justify-between gap-2 border-t border-cream/10 py-6 text-sm text-cream/50 sm:flex-row">
        <p>© {new Date().getFullYear()} SneakerDrop. All rights reserved.</p>
        <p>
          Product photos via Unsplash · 3D model{" "}
          <a href="https://sketchfab.com/3d-models/air-jordan-1-a4b434181fbb48008ad460722fd53725" className="underline underline-offset-2 hover:text-cream">
            &ldquo;Air Jordan 1&rdquo; by makoto
          </a>{" "}
          (CC BY 4.0)
        </p>
      </div>

      {/* Multicolour wordmark stretched edge to edge and sitting flush on the bottom of the page. */}
      <svg aria-hidden viewBox="0 0 1000 190" className="mt-6 block w-full select-none">
        <text x="0" y="146" textLength="1000" lengthAdjust="spacingAndGlyphs" className="font-display font-bold" style={{ fontSize: 196 }}>
          {WORDMARK.map(([letter, colour], i) => (
            <tspan key={i} fill={colour} className="transition-opacity duration-300 hover:opacity-60">
              {letter}
            </tspan>
          ))}
        </text>
      </svg>
    </footer>
  );
}
