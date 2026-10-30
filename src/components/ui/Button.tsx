import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "cream" | "cocoa" | "ghost" | "ghost-light" | "danger";

const variants: Record<Variant, string> = {
  cream: "bg-cream text-cocoa hover:bg-white shadow-card",
  cocoa: "bg-cocoa text-cream hover:bg-maroon shadow-card",
  ghost: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-cream",
  "ghost-light": "border-[1.5px] border-cream/70 text-cream hover:bg-cream hover:text-cocoa",
  danger: "bg-danger text-white hover:brightness-110",
};

export function buttonClasses(variant: Variant = "cocoa", size: "md" | "sm" = "md") {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap",
    "transition-[background-color,color,transform,filter] duration-300 ease-out-soft active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "md" ? "h-12 px-6 text-[0.95rem]" : "h-9 px-4 text-sm",
    variants[variant],
  );
}

function Arrow() {
  return <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" />;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: "md" | "sm"; arrow?: boolean };

export function Button({ variant, size, arrow, className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  children: ReactNode;
};

export function LinkButton({ variant, size, arrow, className, children, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
