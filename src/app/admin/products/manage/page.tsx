import Link from "next/link";
import { getProductById, getActiveCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Product" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ManageProductPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const rawId = Array.isArray(sp.id) ? sp.id[0] : sp.id;
  const id = rawId ? parseInt(rawId, 10) : undefined;
  const product = id ? await getProductById(id) : null;
  const categories = await getActiveCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/products" className="text-sm font-extrabold text-cosmic hover:underline">
            ← Back to products
          </Link>
          <h1 className="mt-1 font-display text-3xl font-semibold text-navy">
            {product ? `Edit: ${product.name}` : "Add a New Product"}
          </h1>
          <p className="mt-1 font-bold text-ink/50">
            {product
              ? "Update the details below and save your changes."
              : "Fill in the details below to launch a new adventure into the store."}
          </p>
        </div>
      </div>
      <ProductForm
        product={
          product
            ? {
                id: product.id,
                name: product.name,
                slug: product.slug,
                categoryId: product.categoryId,
                priceCents: product.priceCents,
                compareAtPriceCents: product.compareAtPriceCents,
                stockQty: product.stockQty,
                available: product.available,
                isNew: product.isNew,
                isFeatured: product.isFeatured,
                sampleData: product.sampleData,
                shortDescription: product.shortDescription,
                description: product.description,
                whatsIncluded: product.whatsIncluded,
                productDetails: product.productDetails,
                keywords: product.keywords,
                images: product.images ?? [],
              }
            : null
        }
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
