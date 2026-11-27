"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { formatAUD } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/queries";
import { IconArrowRight, IconX } from "@/components/Icons";

export function ProductGrid({
  products,
  columns = "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  enableQuickView = true,
}: {
  products: ProductWithCategory[];
  columns?: string;
  enableQuickView?: boolean;
}) {
  const [quickView, setQuickView] = useState<ProductWithCategory | null>(null);

  useEffect(() => {
    if (!quickView) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [quickView]);

  return (
    <>
      <div className={`grid gap-5 sm:grid-cols-2 md:gap-6 ${columns}`}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={enableQuickView ? setQuickView : undefined} />
        ))}
      </div>
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </>
  );
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductWithCategory;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const inStock = product.available && product.stockQty > 0;
  const image = product.images?.[0] ?? "/images/products/painting-kit.svg";
  const onSale =
    product.compareAtPriceCents != null && product.compareAtPriceCents > product.priceCents;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-lift sm:grid-cols-2 sm:rounded-3xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-navy shadow-soft hover:bg-lav"
          aria-label="Close quick view"
        >
          <IconX className="h-5 w-5" />
        </button>
        <div className="aspect-square bg-gradient-to-br from-sky/60 to-lav/60 sm:aspect-auto">
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-3 p-6">
          <Link
            href={`/shop/${product.categorySlug}`}
            className="text-xs font-extrabold uppercase tracking-wider text-cosmic hover:underline"
          >
            {product.categoryName}
          </Link>
          <h3 className="font-display text-2xl font-semibold leading-tight text-navy">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-navy">
              {formatAUD(product.priceCents)}
            </span>
            {onSale && (
              <span className="font-bold text-navy/40 line-through">
                {formatAUD(product.compareAtPriceCents!)}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-ink/70">{product.shortDescription}</p>
          <p className={`text-xs font-extrabold uppercase tracking-wide ${inStock ? "text-[#1E8578]" : "text-navy/50"}`}>
            {inStock ? (product.stockQty <= 5 ? "Only a few left" : "In stock") : "Sold out"}
          </p>
          <div className="mt-auto flex flex-col gap-2.5">
            <button
              disabled={!inStock}
              onClick={() => {
                if (!inStock) return;
                addItem(
                  {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceCents: product.priceCents,
                    compareAtCents: product.compareAtPriceCents,
                    image,
                    stockQty: product.stockQty,
                  },
                  1
                );
                onClose();
              }}
              className="btn-primary btn-md w-full"
            >
              {inStock ? "Add to Cart" : "Sold Out"}
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="btn-ghost btn-md w-full"
            >
              View full details <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
