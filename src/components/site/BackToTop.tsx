"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/components/site/SmoothScroll";

const R = 26;
const C = 2 * Math.PI * R;

/** Floating "back to top" button with a ring that fills as you scroll. */
export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const dashOffset = useTransform(progress, (v) => C * (1 - v));
  const [visible, setVisible] = useState(false);
  const [lift, setLift] = useState(0);

  useEffect(() => scrollYProgress.on("change", (v) => setVisible(v > 0.12)), [scrollYProgress]);

  // Float above the footer wordmark while it is on screen so the button never covers its letters.
  useEffect(() => {
    const mark = document.getElementById("footer-wordmark");
    if (!mark) return;
    const io = new IntersectionObserver(
      ([entry]) => setLift(entry.isIntersecting ? Math.ceil(entry.boundingClientRect.height) + 8 : 0),
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(mark);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: -lift }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
          className="group fixed bottom-4 right-4 z-40 grid size-13 place-items-center rounded-full bg-ink text-cream shadow-lift ring-1 ring-cream/20 sm:bottom-8 sm:right-8 sm:size-16"
        >
          <svg viewBox="0 0 64 64" aria-hidden className="absolute inset-0 size-full -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
            <motion.circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="#e8875c"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={C}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <ArrowUp className="relative size-5 transition-transform duration-300 ease-out-soft group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
