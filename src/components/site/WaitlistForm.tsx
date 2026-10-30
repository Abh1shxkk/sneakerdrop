"use client";

import { Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { joinWaitlist, type WaitlistState } from "@/actions/waitlist";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Props = {
  /** Fixed product (product page) or a list to choose from (landing CTA). */
  productId?: string;
  products?: Pick<Product, "id" | "name">[];
  tone?: "light" | "dark";
  ctaLabel?: string;
};

export function WaitlistForm({ productId, products, tone = "light", ctaLabel = "Join waitlist" }: Props) {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, null);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const dark = tone === "dark";

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const error = clientError ?? (state && !state.ok ? state.error : null);
  const success = state?.ok ? state : null;

  const inputClass = cn(
    "h-13 w-full rounded-full border-[1.5px] px-5 text-base outline-none transition-colors",
    dark
      ? "border-cream/30 bg-cream/10 text-cream placeholder:text-cream/50 focus:border-peach"
      : "border-line bg-white text-ink placeholder:text-muted focus:border-clay",
    error && (dark ? "border-peach" : "border-danger"),
  );

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onSubmit={(e) => {
        const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
        if (!EMAIL_RE.test(email)) {
          e.preventDefault();
          setClientError("Please enter a valid email address.");
        } else {
          setClientError(null);
        }
      }}
      className="w-full"
    >
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {productId ? (
        <input type="hidden" name="productId" value={productId} />
      ) : (
        <div className="mb-3">
          <label htmlFor={`${id}-product`} className="sr-only">
            Sneaker
          </label>
          <select id={`${id}-product`} name="productId" required className={cn(inputClass, "appearance-none")} defaultValue={products?.[0]?.id}>
            {products?.map((p) => (
              <option key={p.id} value={p.id} className="text-ink">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-status`}
          onChange={() => clientError && setClientError(null)}
          className={inputClass}
        />
        <button type="submit" disabled={pending} className={cn(buttonClasses(dark ? "cream" : "cocoa"), "h-13 shrink-0")}>
          {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          {pending ? "Joining…" : ctaLabel}
        </button>
      </div>

      <div id={`${id}-status`} aria-live="polite" className="min-h-7 pt-2 pl-5 text-sm font-medium">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={dark ? "text-peach" : "text-danger"}>
              {error}
            </motion.p>
          ) : success ? (
            <motion.p
              key={success.message}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn("flex items-center gap-2", dark ? "text-cream" : "text-ok")}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className={cn("grid size-5 place-items-center rounded-full", dark ? "bg-cream text-cocoa" : "bg-ok text-white")}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </motion.span>
              {success.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
