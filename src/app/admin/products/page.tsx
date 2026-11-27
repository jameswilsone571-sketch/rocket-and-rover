import Link from "next/link";
import { listProducts } from "@/lib/queries";
import { formatAUD } from "@/lib/format";
import { ProductDeleteButton } from "@/components/admin/ProductDelete";
import { IconEdit, IconPlus } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const products = await listProducts({ sort: "newest" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">Products</h1>
          <p className="mt-1 font-bold text-ink/50">
            {products.length} products in your catalogue. Add, edit or remove any of them.
          </p>
        </div>
        <Link href="/admin/products/manage" className="btn-primary btn-md">
          <IconPlus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="bg-navy/5 text-xs font-extrabold uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Stock</th>
              <th className="px-4 py-3.5">Flags</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/6">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-lav/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sky/50">
                      <img
                        src={p.images?.[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/manage?id=${p.id}`}
                        className="block max-w-56 truncate font-extrabold text-navy hover:text-cosmic"
                      >
                        {p.name}
                      </Link>
                      <Link
                        href={`/products/${p.slug}`}
                        className="text-xs font-bold text-ink/40 hover:text-cosmic"
                        target="_blank"
                      >
                        View on site →
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-bold text-ink/60">{p.categoryName}</td>
                <td className="px-4 py-3.5">
                  <span className="font-extrabold text-navy">{formatAUD(p.priceCents)}</span>
                  {p.compareAtPriceCents != null && (
                    <span className="ml-1.5 text-xs font-bold text-navy/40 line-through">
                      {formatAUD(p.compareAtPriceCents)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  {p.available && p.stockQty > 0 ? (
                    p.stockQty <= 5 ? (
                      <span className="chip bg-cream text-star-dark">Low · {p.stockQty}</span>
                    ) : (
                      <span className="chip bg-turq/20 text-[#1E8578]">{p.stockQty}</span>
                    )
                  ) : (
                    <span className="chip bg-navy/10 text-navy/60">{p.available ? "0 left" : "Hidden"}</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {p.isNew && <span className="chip bg-turq/20 text-[#1E8578]">New</span>}
                    {p.isFeatured && <span className="chip bg-lav text-cosmic">Featured</span>}
                    {p.sampleData && <span className="chip bg-navy/5 text-navy/50">Sample</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/manage?id=${p.id}`}
                      className="btn-ghost btn-sm"
                      aria-label={`Edit ${p.name}`}
                    >
                      <IconEdit className="h-4 w-4" /> Edit
                    </Link>
                    <ProductDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
