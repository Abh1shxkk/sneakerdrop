"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AdminNavLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/products") : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-cream text-cocoa" : "text-cream/75 hover:bg-cream/10 hover:text-cream",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
