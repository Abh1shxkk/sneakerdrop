import { Plus } from "lucide-react";
import { ProductTable } from "@/components/admin/ProductTable";
import { SavedNotice } from "@/components/admin/SavedNotice";
import { LinkButton } from "@/components/ui/Button";
import { getProducts, getWaitlistCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [products, counts, { saved }] = await Promise.all([getProducts(), getWaitlistCounts(), searchParams]);
  const totalWaiting = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <SavedNotice saved={saved} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-clay">Catalogue</p>
          <h1 className="headline mt-1 text-5xl">Products</h1>
        </div>
        <LinkButton href="/admin/products/new" variant="cocoa">
          <Plus aria-hidden className="size-4" />
          Add sneaker
        </LinkButton>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Sneakers", value: products.length },
          { label: "In stock", value: products.filter((p) => p.availability === "available").length },
          { label: "Sold out", value: products.filter((p) => p.availability === "sold_out").length },
          { label: "On waitlists", value: totalWaiting },
        ].map((s) => (
          <div key={s.label} className="rounded-md bg-white p-5 shadow-card">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1 font-display text-4xl font-bold tabular-nums text-cocoa">{s.value}</dd>
          </div>
        ))}
      </dl>

      <ProductTable products={products} counts={counts} />
    </div>
  );
}
