const WORDS = ["New drop", "Limited pairs", "Free returns", "Members first", "Ships in 48h"];

export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="headline flex items-center gap-8 px-8 text-[clamp(1.75rem,4vw,3rem)]">
          {w}
          <span aria-hidden className="font-display text-peach">●</span>
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden className="overflow-hidden bg-clay py-5 text-cream">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}
