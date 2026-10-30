import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { getProducts, getWaitlist } from "@/lib/queries";
import { z } from "zod";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const productId = z.uuid().safeParse(product).success ? product : undefined;
  const [entries, products] = await Promise.all([getWaitlist(productId), getProducts()]);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow text-clay">Audience</p>
      <h1 className="headline mt-1 text-5xl">Waitlist</h1>
      <p className="mt-2 text-muted">Everyone who asked to hear about a drop, newest first.</p>
      <WaitlistTable entries={entries} products={products.map((p) => ({ id: p.id, name: p.name }))} productId={productId} />
    </div>
  );
}
