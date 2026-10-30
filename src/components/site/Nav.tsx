"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const LINKS = [
  { id: "collection", label: "Collection" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "why", label: "Why Us" },
  { id: "waitlist", label: "Waitlist" },
];

const NEWS = ["Next drop · Friday 8 PM IST", "Free shipping across India", "Waitlist members get 24h early access", "30-day no-fuss returns"];

function DropMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 transition-transform duration-500 ease-out-soft group-hover:rotate-[200deg]">
      <path d="M12 2.5c3.6 4.3 6.5 8 6.5 11.4a6.5 6.5 0 0 1-13 0C5.5 10.5 8.4 6.8 12 2.5Z" fill="currentColor" />
      <path d="M9.2 14.6c.4 1.4 1.5 2.3 2.9 2.5" stroke="#f7ede2" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SneakerDrop home"
      className={cn(
        "group inline-flex h-11 items-center gap-1.5 rounded-full bg-cream px-4 font-display text-xl font-bold tracking-tight text-cocoa transition-transform duration-300 ease-out-soft hover:scale-105",
        className,
      )}
    >
      <DropMark />
      sneakerdrop
    </Link>
  );
}

function useScrollState(home: boolean) {
  const [state, setState] = useState({ scrolled: false, hidden: false, section: "" });

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      lastY = y;

      let section = "";
      if (home) {
        for (const { id } of LINKS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) section = id;
        }
      }
      setState((s) => ({
        scrolled: y > 40,
        hidden: goingDown && y > 400 ? true : goingUp ? false : s.hidden,
        section,
      }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  return state;
}

export function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const { scrolled, hidden, section } = useScrollState(home);
  const [open, setOpen] = useState(false);
  const solid = scrolled || !home;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-transform duration-500 ease-out-soft sm:px-6 sm:pt-5",
        hidden && !open && "-translate-y-[130%]",
      )}
    >
      {/* announcement ticker */}
      <div
        className={cn(
          "mx-auto mb-2 max-w-[1280px] overflow-hidden px-6 transition-all duration-500 ease-out-soft [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
          solid ? "h-0 opacity-0" : "h-6 opacity-100",
        )}
      >
        <div className="flex h-6 w-max animate-[marquee_32s_linear_infinite] items-center text-[0.7rem] font-bold uppercase leading-none tracking-[0.2em] text-cream/80">
          {[0, 1].map((k) => (
            <div key={k} aria-hidden={k === 1} className="flex shrink-0">
              {NEWS.map((n) => (
                <span key={n} className="flex items-center gap-6 px-6">
                  {n}
                  <span aria-hidden className="size-1 rounded-full bg-peach" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-[1280px] items-center justify-between rounded-full p-1.5 transition-all duration-500 ease-out-soft",
          solid ? "bg-ink/90 shadow-lift ring-1 ring-cream/10" : "bg-ink/20 ring-1 ring-cream/15",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const isActive = section === l.id;
            return (
              <li key={l.id}>
                <Link
                  href={`/#${l.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "text-ink" : "text-cream/80 hover:text-cream",
                  )}
                >
                  {isActive && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-peach" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/#waitlist"
            className="group relative hidden h-11 items-center gap-2 overflow-hidden rounded-full bg-cream pl-4 pr-1.5 text-sm font-bold text-ink sm:inline-flex"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-danger" />
            </span>
            Join the Drop
            <span className="grid size-8 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 ease-out-soft group-hover:rotate-45">
              <ArrowUpRight aria-hidden className="size-4" />
            </span>
          </Link>
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
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/#${l.id}`} onClick={() => setOpen(false)} className="headline block py-2 text-6xl hover:text-peach">
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
