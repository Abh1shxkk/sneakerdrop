import { cn } from "@/lib/cn";

/** Circular stamp with text running around the edge, slowly spinning. */
export function RotatingBadge({ text, children, className }: { text: string; children?: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn("relative grid size-32 place-items-center", className)}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-[spin_16s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-current font-body text-[10.5px] font-bold uppercase tracking-[0.32em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <div className="grid size-16 place-items-center rounded-full bg-cream text-ink">{children}</div>
    </div>
  );
}
