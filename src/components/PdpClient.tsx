"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatAUD } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/queries";
import {
  IconChevronDown,
  IconHeart,
  IconMinus,
  IconPlus,
  IconShield,
  IconTruck,
  IconX,
} from "@/components/Icons";

export function PdpClient({ product }: { product: ProductWithCategory }) {
  const images = (product.images && product.images.length ? product.images : ["/images/products/painting-kit.svg"]) as string[];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, toggleWish, isWished, hydrated } = useCart();

  const inStock = product.available && product.stockQty > 0;
  const onSale =
    product.compareAtPriceCents != null && product.compareAtPriceCents > product.priceCents;
  const wished = hydrated && isWished(product.id);
  const maxQty = Math.min(Math.max(product.stockQty, 1), 10);

  function handleAdd() {
    if (!inStock) return;
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        compareAtCents: product.compareAtPriceCents,
        image: images[0],
        stockQty: product.stockQty,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const sections: { title: string; body: string }[] = [];
  if (product.description)
    sections.push({ title: "Product Description", body: product.description });
  if (product.whatsIncluded)
    sections.push({ title: "What's Included", body: product.whatsIncluded });
  if (product.productDetails)
    sections.push({ title: "Product Details", body: product.productDetails });
  sections.push({
    title: "Shipping & Returns",
    body: "Shipping details are currently being finalised for Rocket & Rover. See our Shipping Information and Returns & Refunds pages for the latest policy drafts, or contact us and we'll be happy to help.",
  });

  return (
    <>
      {/* Gallery */}
      <div>
        <button
          onClick={() => setLightbox(true)}
          className="group relative block aspect-square w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky/60 via-white to-lav/60 shadow-soft focus-visible:outline-2 focus-visible:outline-cosmic"
          aria-label="Zoom product image"
        >
          <img
            src={images[active]}
            alt={`${product.name} — image ${active + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          {product.sampleData && (
            <span className="chip absolute left-4 top-4 bg-white/85 text-navy/60 backdrop-blur">
              Sample product
            </span>
          )}
        </button>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all ${
                  i === active ? "border-cosmic shadow-soft" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <Link
          href={`/shop/${product.categorySlug}`}
          className="text-xs font-extrabold uppercase tracking-wider text-cosmic hover:underline"
        >
          {product.categoryName}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-display text-3xl font-semibold text-navy">
            {formatAUD(product.priceCents)}
          </span>
          {onSale && (
            <>
              <span className="text-lg font-bold text-navy/40 line-through">
                {formatAUD(product.compareAtPriceCents!)}
              </span>
              <span className="chip bg-star text-navy">
                Save {formatAUD(product.compareAtPriceCents! - product.priceCents)}
              </span>
            </>
          )}
        </div>
        <p className="mt-1.5 text-xs font-bold text-ink/45">
          Price shown is a sample and includes GST. Final pricing to be confirmed.
        </p>

        <p className="mt-5 text-lg leading-relaxed text-ink/70">{product.shortDescription}</p>

        <p
          className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold ${
            inStock ? "bg-turq/20 text-[#1E8578]" : "bg-navy/10 text-navy/55"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
          {inStock
            ? product.stockQty <= 5
              ? `Only ${product.stockQty} left — almost gone!`
              : "In stock, ready to explore"
            : "Currently sold out"}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border-2 border-navy/15 bg-white">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              disabled={!inStock}
              className="rounded-full p-3 text-navy hover:bg-lav disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <IconMinus className="h-4 w-4" />
            </button>
            <span className="w-9 text-center font-display text-lg font-semibold text-navy" aria-live="polite">
              {qty}
            </span>
            <button
              onClick={() => setQty((v) => Math.min(maxQty, v + 1))}
              disabled={!inStock}
              className="rounded-full p-3 text-navy hover:bg-lav disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <IconPlus className="h-4 w-4" />
            </button>
          </div>
          <button onClick={handleAdd} disabled={!inStock} className="btn-accent btn-lg flex-1 sm:flex-none sm:px-10">
            {inStock ? (added ? "Added to Cart!" : "Add to Cart") : "Sold Out"}
          </button>
          <button
            onClick={() =>
              toggleWish({
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                compareAtCents: product.compareAtPriceCents,
                image: images[0],
              })
            }
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`rounded-full border-2 p-3.5 transition-colors ${
              wished ? "border-cosmic bg-lav" : "border-navy/15 hover:border-navy"
            }`}
          >
            <IconHeart className={`h-5 w-5 ${wished ? "text-cosmic" : "text-navy/50"}`} filled={wished} />
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-2xl bg-sky/50 px-4 py-3 text-xs font-extrabold text-navy">
            <IconTruck className="h-5 w-5 shrink-0 text-rocket-dark" />
            <span>Shipping details being finalised</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl bg-lav/70 px-4 py-3 text-xs font-extrabold text-navy">
            <IconShield className="h-5 w-5 shrink-0 text-cosmic" />
            <span>Secure checkout (payment setup in progress)</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl bg-cream px-4 py-3 text-xs font-extrabold text-navy">
            <Link href="/contact" className="hover:underline">
              Questions? Get in touch
            </Link>
          </div>
        </div>

        <div className="mt-8 divide-y divide-navy/8 rounded-3xl bg-white shadow-soft">
          {sections.map((s) => (
            <details key={s.title} className="rr-acc px-5 py-4 first:rounded-t-3xl last:rounded-b-3xl">
              <summary className="flex items-center justify-between gap-3 font-display text-base font-semibold text-navy">
                {s.title}
                <IconChevronDown className="rr-acc-chevron h-5 w-5 text-cosmic" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 whitespace-pre-line">{s.body}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/90 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} enlarged image`}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={() => setLightbox(false)}
            aria-label="Close zoom"
          >
            <IconX className="h-6 w-6" />
          </button>
          <img
            src={images[active]}
            alt={product.name}
            className="max-h-[85vh] max-w-full rounded-3xl shadow-lift"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`h-14 w-14 overflow-hidden rounded-xl border-2 ${i === active ? "border-star" : "border-white/30"}`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
