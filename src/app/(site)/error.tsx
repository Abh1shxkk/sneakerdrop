"use client";

import { Button } from "@/components/ui/Button";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="grid min-h-[70svh] place-items-center px-6 pt-24 text-center">
      <div>
        <h1 className="headline text-5xl">Something tripped.</h1>
        <p className="mt-2 text-muted">We couldn&apos;t load the sneakers right now. Please try again.</p>
        <Button onClick={reset} variant="cocoa" className="mt-6">
          Try again
        </Button>
      </div>
    </section>
  );
}
