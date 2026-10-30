import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function inputClasses(invalid?: boolean) {
  return cn(
    "h-12 w-full rounded-full border-[1.5px] bg-white px-5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-clay",
    invalid ? "border-danger" : "border-line",
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  errors,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block pl-1 text-sm font-bold">
        {label}
      </label>
      {children}
      {errors?.[0] ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 pl-1 text-sm text-danger">
          {errors[0]}
        </p>
      ) : hint ? (
        <p className="mt-1.5 pl-1 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
