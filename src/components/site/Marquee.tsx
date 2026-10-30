import { cn } from "@/lib/cn";

const TOP = ["New drop", "Limited pairs", "Free returns", "Members first", "Ships in 48h"];
const BOTTOM = ["Numbered runs", "Hand-checked", "Made to be worn", "SS26 collection", "No restocks"];

function Band({ words, className, reverse }: { words: string[]; className: string; reverse?: boolean }) {
  return (
    <div className={cn("overflow-hidden py-4 shadow-lift", className)}>
      <div className={cn("flex w-max animate-marquee", reverse && "[animation-direction:reverse]")}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className="headline flex items-center gap-8 px-8 text-[clamp(1.5rem,3.5vw,2.75rem)]">
                {w}
                <span aria-hidden className="font-display text-[0.8em]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two crossing "caution tape" bands. */
export function Marquee() {
  return (
    <div aria-hidden className="relative h-44 overflow-hidden bg-cream sm:h-52">
      <Band words={BOTTOM} reverse className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] bg-forest text-butter" />
      <Band words={TOP} className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[2.5deg] bg-clay text-cream" />
    </div>
  );
}
