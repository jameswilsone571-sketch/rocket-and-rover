import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { PdpClient } from "@/components/PdpClient";
import { ProductGrid } from "@/components/ProductGrid";
import { formatAUD } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.shortDescription || `${p.name} — a creative space-themed product from Rocket & Rover.`,
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      images: p.images?.length ? [p.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 4);
  const image = product.images?.[0] ?? "/images/products/painting-kit.svg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: [image],
    category: product.categoryName,
    brand: { "@type": "Brand", name: "Rocket & Rover" },
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.available && product.stockQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `/products/${product.slug}`,
    },
  };

  return (
    <div className="container-rr py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs font-extrabold uppercase tracking-wider text-ink/45">
        <Link href="/" className="hover:text-cosmic">Home</Link>
        <span className="mx-2 text-ink/30">/</span>
        <Link href="/shop" className="hover:text-cosmic">Shop All</Link>
        <span className="mx-2 text-ink/30">/</span>
        <Link href={`/shop/${product.categorySlug}`} className="hover:text-cosmic">
          {product.categoryName}
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <PdpClient product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
              You May Also Like
            </h2>
            <Link href="/shop" className="text-sm font-extrabold text-cosmic hover:underline">
              View all products →
            </Link>
          </div>
          <div className="mt-7">
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <p className="mt-14 rounded-3xl bg-lav/50 px-6 py-4 text-center text-xs font-bold text-navy/55">
        Sample product listing for demonstration — image, price, stock and details
        will be replaced with Rocket &amp; Rover's confirmed product information.
        {product.priceCents > 0 && ` Current sample price: ${formatAUD(product.priceCents)} (incl. GST).`}
      </p>
    </div>
  );
}
