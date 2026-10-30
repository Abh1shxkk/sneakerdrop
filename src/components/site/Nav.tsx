"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/#collection", label: "Collection" },
  { href: "/#best-sellers", label: "Best Sellers" },
  { href: "/#why", label: "Why Us" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SneakerDrop home"
      className={cn(
        "inline-flex h-11 items-center rounded-full bg-cream px-5 font-display text-xl font-bold tracking-tight text-cocoa transition-transform duration-300 ease-out-soft hover:-rotate-2 hover:scale-105",
        className,
      )}
    >
      sneakerdrop
    </Link>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-[1280px] items-center justify-between rounded-full py-2 pl-2 pr-2 transition-all duration-500 ease-out-soft sm:pl-3",
          solid ? "bg-cocoa/95 shadow-lift" : "bg-transparent",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative py-2 text-sm font-medium text-cream/85 transition-colors hover:text-cream after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-peach after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LinkButton href="/#waitlist" variant="cream" size="sm" className="hidden h-11 px-5 sm:inline-flex">
            Join the Drop
          </LinkButton>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-full bg-cream text-cocoa md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-cocoa p-5 text-cream"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full bg-cream text-cocoa"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-16 space-y-2">
              {[...LINKS, { href: "/#waitlist", label: "Join the Drop" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={l.href} onClick={() => setOpen(false)} className="headline block py-2 text-6xl hover:text-peach">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
