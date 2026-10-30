import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (await getAdmin()) redirect("/admin");
  const { next, error } = await searchParams;

  return (
    <main className="grid min-h-svh place-items-center bg-peach p-3">
      <div className="grain grid w-full max-w-5xl overflow-hidden rounded-lg bg-cocoa text-cream md:grid-cols-2">
        <div className="hidden flex-col justify-between p-10 md:flex">
          <p className="font-display text-2xl font-bold">sneakerdrop</p>
          <p className="font-display text-[7rem] font-bold leading-[0.8] tracking-[-0.04em]">
            back
            <br />
            stage.
          </p>
        </div>
        <div className="m-2 rounded-md bg-cream p-8 text-ink sm:p-12">
          <p className="eyebrow text-clay">Admin</p>
          <h1 className="headline mt-2 text-5xl">Sign in</h1>
          <p className="mt-2 text-muted">Manage sneakers and see who&apos;s waiting for them.</p>
          {error === "forbidden" && (
            <p role="alert" className="mt-4 rounded-md bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              That account doesn&apos;t have admin access.
            </p>
          )}
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
