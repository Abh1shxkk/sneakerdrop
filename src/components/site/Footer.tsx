import Link from "next/link";

const COLUMNS = [
  { title: "Shop", links: [{ href: "/#collection", label: "Collection" }, { href: "/#best-sellers", label: "Best sellers" }, { href: "/#waitlist", label: "Waitlist" }] },
  { title: "Brand", links: [{ href: "/#why", label: "Why us" }, { href: "/#top", label: "Back to top" }] },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-maroon text-cream">
      <div className="container-x grid gap-10 pt-20 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold">sneakerdrop</p>
          <p className="mt-3 max-w-xs text-cream/70">Limited pairs. Zero compromise. A fictional brand built as a showcase project.</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="eyebrow text-peach">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/80 transition-colors hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-x mt-14 flex flex-col justify-between gap-2 border-t border-cream/15 py-6 text-sm text-cream/60 sm:flex-row">
        <p>© {new Date().getFullYear()} SneakerDrop. All rights reserved.</p>
        <p>Product photos via Unsplash · 3D shoe model © Shopify (CC BY 4.0)</p>
      </div>

      <p
        aria-hidden
        className="select-none whitespace-nowrap pb-[0.12em] pt-8 text-center font-display text-[clamp(3.5rem,15.5vw,17rem)] font-bold leading-none tracking-[-0.04em] text-cocoa transition-colors duration-500 hover:text-clay"
      >
        sneakerdrop
      </p>
    </footer>
  );
}
