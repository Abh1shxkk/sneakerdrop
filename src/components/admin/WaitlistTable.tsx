"use client";

import { Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteWaitlistEntry } from "@/actions/waitlist";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { inputClasses } from "@/components/admin/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { WaitlistEntry } from "@/lib/types";

function toCsv(entries: WaitlistEntry[]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = entries.map((e) => [e.email, e.product?.name ?? "", e.created_at].map(escape).join(","));
  return ["email,product,joined_at", ...rows].join("\n");
}

export function WaitlistTable({
  entries: saved,
  products,
  productId,
}: {
  entries: WaitlistEntry[];
  products: { id: string; name: string }[];
  productId?: string;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<WaitlistEntry | null>(null);
  const [, start] = useTransition();
  const [filtering, startFilter] = useTransition();
  const [entries, removeOptimistic] = useOptimistic(saved, (list, id: string) => list.filter((e) => e.id !== id));
  const close = useCallback(() => setTarget(null), []);

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([toCsv(entries)], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "sneakerdrop-waitlist.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    if (!target) return;
    const doomed = target;
    setTarget(null);
    start(async () => {
      removeOptimistic(doomed.id);
      const res = await deleteWaitlistEntry(doomed.id);
      if (res.ok) toast.success("Entry removed.");
      else toast.error(res.error);
    });
  };

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-bold">
            Product
          </label>
          <select
            id="filter"
            value={productId ?? ""}
            onChange={(e) => {
              const next = e.target.value ? `/admin/waitlist?product=${e.target.value}` : "/admin/waitlist";
              startFilter(() => router.push(next));
            }}
            className={cn(inputClasses(), "w-60")}
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="rounded-full bg-sand px-3 py-1 text-sm font-bold tabular-nums">{entries.length}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={exportCsv} disabled={entries.length === 0}>
          <Download aria-hidden className="size-4" />
          Export CSV
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-lg border-2 border-dashed border-line p-14 text-center">
          <p className="text-lg font-bold">No one on this list yet</p>
          <p className="mt-1 text-muted">Signups from the site will show up here.</p>
        </div>
      ) : (
        <div className={cn("mt-6 overflow-x-auto rounded-lg bg-white shadow-card transition-opacity", filtering && "opacity-50")}>
          <table className="w-full min-w-[600px] text-left">
            <thead className="text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="py-3 pl-5 pr-3 font-bold">Email</th>
                <th scope="col" className="px-3 font-bold">Product</th>
                <th scope="col" className="px-3 font-bold">Joined</th>
                <th scope="col" className="py-3 pl-3 pr-5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-line">
                  <td className="py-3 pl-5 pr-3 font-medium">{e.email}</td>
                  <td className="px-3">
                    {e.product ? (
                      <Link href={`/admin/waitlist?product=${e.product.id}`} className="text-cocoa underline-offset-4 hover:underline">
                        {e.product.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 text-sm text-muted">{formatDate(e.created_at)}</td>
                  <td className="py-3 pl-3 pr-5 text-right">
                    <button
                      type="button"
                      onClick={() => setTarget(e)}
                      aria-label={`Remove ${e.email}`}
                      className="inline-grid size-9 place-items-center rounded-full text-danger transition hover:bg-danger/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="Remove from waitlist?"
        body={`${target?.email ?? ""} will no longer be notified about ${target?.product?.name ?? "this drop"}.`}
        confirmLabel="Remove"
        onConfirm={confirmDelete}
        onCancel={close}
      />
    </>
  );
}
