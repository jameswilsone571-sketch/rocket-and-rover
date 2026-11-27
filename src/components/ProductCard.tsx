"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatAUD } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/queries";
import { IconEye, IconHeart } from "@/components/Icons";

function stockStatus(p: ProductWithCategory): { label: string; tone: string; inStock: boolean } {
  if (!p.available || p.stockQty <= 0)
    return { label: "Sold out", tone: "bg-navy/10 text-navy/60", inStock: false };
  if (p.stockQty <= 5) return { label: "Only a few left", tone: "bg-blush/40 text-[#B4486E]", inStock: true };
  return { label: "In stock", tone: "bg-turq/20 text-[#1E8578]", inStock: true };
}

export function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductWithCategory;
  onQuickView?: (p: ProductWithCategory) => void;
}) {
  const { addItem, toggleWish, isWished, hydrated } = useCart();
  const stock = stockStatus(product);
  const onSale =
    product.compareAtPriceCents != null && product.compareAtPriceCents > product.priceCents;
  const wished = hydrated && isWished(product.id);
  const image = product.images?.[0] ?? "/images/products/painting-kit.svg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky/60 via-white to-lav/60">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="block h-full">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {onSale && <span className="chip bg-star text-navy shadow-soft">Sale</span>}
          {product.isNew && <span className="chip bg-turq/90 text-navy shadow-soft">New</span>}
          {product.sampleData && (
            <span className="chip bg-white/85 text-navy/60 backdrop-blur">Sample</span>
          )}
        </div>

        <button
          onClick={() =>
            toggleWish({
              id: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              compareAtCents: product.compareAtPriceCents,
              image,
            })
          }
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-soft backdrop-blur transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-cosmic"
        >
          <IconHeart
            className={`h-4.5 w-4.5 transition-colors ${wished ? "text-cosmic" : "text-navy/40"}`}
            filled={wished}
          />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-x-3 bottom-3 flex translate-y-14 items-center justify-center gap-2 rounded-full bg-navy/90 py-2.5 text-sm font-bold text-white opacity-0 backdrop-blur transition-all duration-300 hover:bg-cosmic group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <IconEye className="h-4.5 w-4.5" /> Quick view
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/shop/${product.categorySlug}`}
            className="text-[0.68rem] font-extrabold uppercase tracking-wider text-cosmic hover:underline"
          >
            {product.categoryName}
          </Link>
          <span className={`chip ${stock.tone}`}>{stock.label}</span>
        </div>
        <h3 className="font-display text-[1.05rem] font-semibold leading-snug text-navy">
          <Link href={`/products/${product.slug}`} className="hover:text-cosmic">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-navy">
            {formatAUD(product.priceCents)}
          </span>
          {onSale && (
            <span className="text-sm font-bold text-navy/40 line-through">
              {formatAUD(product.compareAtPriceCents!)}
            </span>
          )}
        </div>
        <button
          onClick={() =>
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
            )
          }
          disabled={!stock.inStock}
          className="btn-primary btn-md mt-auto w-full"
        >
          {stock.inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </article>
  );
}
