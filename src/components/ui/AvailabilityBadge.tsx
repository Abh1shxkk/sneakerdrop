import { AVAILABILITY_LABEL } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Availability } from "@/lib/types";

const styles: Record<Availability, string> = {
  available: "bg-ok/12 text-ok",
  low_stock: "bg-warn/12 text-warn",
  sold_out: "bg-danger/10 text-danger",
  coming_soon: "bg-info/12 text-info",
};

export function AvailabilityBadge({
  availability,
  className,
  onDark,
}: {
  availability: Availability;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        onDark ? "bg-cream text-ink" : styles[availability],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full bg-current",
          availability === "available" && onDark && "bg-ok",
          availability === "low_stock" && onDark && "bg-warn",
          availability === "sold_out" && onDark && "bg-danger",
          availability === "coming_soon" && onDark && "bg-info",
          availability === "low_stock" && "animate-pulse",
        )}
      />
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}
