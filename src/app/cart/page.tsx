"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatAUD } from "@/lib/format";
import { IconArrowRight, IconMinus, IconPlus, IconTrash } from "@/components/Icons";

export default function CartPage() {
  const { items, subtotal, setQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-rr flex flex-col items-center py-24 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-lav" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-cosmic" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c3.5 1.8 5.5 5 5.5 9l-2.5 3h-6L6.5 12C6.5 8 8.5 4.8 12 3Z" />
            <circle cx="12" cy="9.5" r="2" />
            <path d="M8.5 15 7 19l3-1.5M15.5 15 17 19l-3-1.5" />
          </svg>
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-navy">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-lg text-ink/60">
          Every great adventure starts with a single step — or a single craft kit.
        </p>
        <Link href="/shop" className="btn-accent btn-lg mt-8">
          Explore the Universe <IconArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-rr py-10 lg:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Your Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="card divide-y divide-navy/8 p-2 sm:p-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-3 sm:gap-5 sm:p-4">
              <Link
                href={`/products/${item.slug}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sky/50 sm:h-28 sm:w-28"
              >
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-display text-base font-semibold text-navy hover:text-cosmic"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-bold text-ink/50">
                      {formatAUD(item.priceCents)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-full p-2 text-navy/40 hover:bg-blush/30 hover:text-[#B4486E]"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <IconTrash className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border-2 border-navy/12">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="rounded-full p-2 text-navy hover:bg-lav"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <IconMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="rounded-full p-2 text-navy hover:bg-lav"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <IconPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-lg font-semibold text-navy">
                    {formatAUD(item.priceCents * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="font-display text-xl font-semibold text-navy">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm font-bold text-ink/70">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-navy">{formatAUD(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="text-navy/60">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax (GST)</dt>
              <dd className="text-navy/60">Included in prices</dd>
            </div>
            <div className="flex justify-between border-t border-navy/10 pt-3 text-base">
              <dt className="font-display text-lg font-semibold text-navy">Estimated total</dt>
              <dd className="font-display text-lg font-semibold text-navy">{formatAUD(subtotal)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-accent btn-lg mt-6 w-full">
            Proceed to Checkout <IconArrowRight className="h-4.5 w-4.5" />
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-sm font-extrabold text-cosmic hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
