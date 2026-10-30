import { ExternalLink, LogOut, Package, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/actions/auth";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-svh bg-cream md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex items-center justify-between gap-4 bg-cocoa p-4 text-cream md:sticky md:top-0 md:h-svh md:flex-col md:items-stretch md:justify-start md:p-6">
        <Link href="/admin" className="font-display text-2xl font-bold">
          sneakerdrop
          <span className="ml-2 align-middle text-xs font-bold uppercase tracking-widest text-peach">admin</span>
        </Link>
        <nav aria-label="Admin" className="flex gap-1 md:mt-10 md:flex-col">
          <AdminNavLink href="/admin" icon={<Package className="size-4" />} label="Products" />
          <AdminNavLink href="/admin/waitlist" icon={<Users className="size-4" />} label="Waitlist" />
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-cream/75 hover:bg-cream/10 hover:text-cream">
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">View site</span>
          </Link>
        </nav>
        <form action={signOut} className="md:mt-auto">
          <p className="mb-3 hidden truncate text-xs text-cream/60 md:block">{admin.email}</p>
          <button type="submit" className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-cream/75 hover:bg-cream/10 hover:text-cream">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </aside>
      <main className="min-w-0 p-4 sm:p-8 lg:p-12">{children}</main>
    </div>
  );
}
