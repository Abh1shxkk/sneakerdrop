"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct, setAvailability, setFeatured } from "@/actions/products";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/cn";
import { AVAILABILITY_LABEL, formatPrice } from "@/lib/format";
import { AVAILABILITY, type Availability, type Product } from "@/lib/types";

const SELECT_TONE: Record<Availability, string> = {
  available: "bg-ok/12 text-ok",
  low_stock: "bg-warn/12 text-warn",
  sold_out: "bg-danger/10 text-danger",
  coming_soon: "bg-info/12 text-info",
};

function Row({ product, count, onDelete }: { product: Product; count: number; onDelete: (p: Product) => void }) {
  const [pending, start] = useTransition();

  const changeAvailability = (value: Availability) =>
    start(async () => {
      const res = await setAvailability(product.id, value);
      if (res.ok) toast.success(`${product.name} → ${AVAILABILITY_LABEL[value]}`);
      else toast.error(res.error);
    });

  const toggleFeatured = () =>
    start(async () => {
      const res = await setFeatured(product.id, !product.featured);
      if (!res.ok) toast.error(res.error);
    });

  return (
    <tr className={cn("border-t border-line transition-opacity", pending && "opacity-60")}>
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-sand">
            <Image src={product.image_url} alt="" fill sizes="48px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{product.name}</p>
            <p className="truncate text-sm text-muted">/{product.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-3 tabular-nums">{formatPrice(product.price_cents)}</td>
      <td className="px-3">
        <label className="sr-only" htmlFor={`avail-${product.id}`}>
          Availability for {product.name}
        </label>
        <select
          id={`avail-${product.id}`}
          value={product.availability}
          disabled={pending}
          onChange={(e) => changeAvailability(e.target.value as Availability)}
          className={cn("h-9 cursor-pointer rounded-full border-0 px-3 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-clay", SELECT_TONE[product.availability])}
        >
          {AVAILABILITY.map((a) => (
            <option key={a} value={a} className="bg-white text-ink">
              {AVAILABILITY_LABEL[a]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3">
        <button
          type="button"
          onClick={toggleFeatured}
          disabled={pending}
          aria-pressed={product.featured}
          aria-label={product.featured ? `Unfeature ${product.name}` : `Feature ${product.name}`}
          className="grid size-9 place-items-center rounded-full transition hover:bg-sand"
        >
          <Star className={cn("size-5", product.featured ? "fill-clay text-clay" : "text-muted")} />
        </button>
      </td>
      <td className="px-3 tabular-nums">
        <Link href={`/admin/waitlist?product=${product.id}`} className="font-bold text-cocoa underline-offset-4 hover:underline">
          {count}
        </Link>
      </td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex justify-end gap-1">
          <Link href={`/admin/products/${product.id}`} aria-label={`Edit ${product.name}`} className="grid size-9 place-items-center rounded-full transition hover:bg-sand">
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.name}`}
            className="grid size-9 place-items-center rounded-full text-danger transition hover:bg-danger/10"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ProductTable({ products, counts }: { products: Product[]; counts: Record<string, number> }) {
  const [target, setTarget] = useState<Product | null>(null);
  const [deleting, startDelete] = useTransition();
  const close = useCallback(() => setTarget(null), []);

  const confirmDelete = () => {
    if (!target) return;
    startDelete(async () => {
      const res = await deleteProduct(target.id);
      if (res.ok) toast.success(`${target.name} deleted.`);
      else toast.error(res.error);
      setTarget(null);
    });
  };

  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-lg border-2 border-dashed border-line p-14 text-center">
        <p className="text-lg font-bold">No sneakers yet</p>
        <p className="mt-1 text-muted">Add your first pair to get the drop started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="py-3 pl-4 pr-3 font-bold">Sneaker</th>
              <th scope="col" className="px-3 font-bold">Price</th>
              <th scope="col" className="px-3 font-bold">Availability</th>
              <th scope="col" className="px-3 font-bold">Featured</th>
              <th scope="col" className="px-3 font-bold">Waitlist</th>
              <th scope="col" className="py-3 pl-3 pr-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <Row key={p.id} product={p} count={counts[p.id] ?? 0} onDelete={setTarget} />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title={`Delete ${target?.name ?? "sneaker"}?`}
        body="This removes it from the site and deletes its waitlist entries. This can't be undone."
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={close}
      />
    </>
  );
}
