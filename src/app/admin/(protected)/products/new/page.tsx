import { createProduct } from "@/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow text-clay">Catalogue</p>
      <h1 className="headline mb-8 mt-1 text-5xl">Add sneaker</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
