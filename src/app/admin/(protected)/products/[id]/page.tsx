import { notFound } from "next/navigation";
import { updateProduct } from "@/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/queries";
import { z } from "zod";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow text-clay">Catalogue</p>
      <h1 className="headline mb-8 mt-1 text-5xl">Edit {product.name}</h1>
      <ProductForm action={updateProduct.bind(null, product.id)} product={product} />
    </div>
  );
}
