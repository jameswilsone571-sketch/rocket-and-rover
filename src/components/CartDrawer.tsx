"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatAUD } from "@/lib/format";
import { IconArrowRight, IconMinus, IconPlus, IconTrash, IconX } from "@/components/Icons";

export function CartDrawer() {
  const { items, subtotal, drawerOpen, closeDrawer, setQty, removeItem, count } = useCart();

  return (
    <div className={`fixed inset-0 z-[70] ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
      <div
        className={`absolute inset-0 bg-navy/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-[min(26rem,92vw)] flex-col bg-white shadow-lift transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-navy/8 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            Your Cart {count > 0 && <span className="text-cosmic">({count})</span>}
          </h2>
          <button
            onClick={closeDrawer}
            className="rounded-full p-2 text-navy hover:bg-lav"
            aria-label="Close cart"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lav text-3xl" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-cosmic" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c3.5 1.8 5.5 5 5.5 9l-2.5 3h-6L6.5 12C6.5 8 8.5 4.8 12 3Z" />
                <circle cx="12" cy="9.5" r="2" />
                <path d="M8.5 15 7 19l3-1.5M15.5 15 17 19l-3-1.5" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-navy">Your cart is drifting in space!</p>
            <p className="text-sm text-ink/60">
              It's empty right now. Let's fix that with some creative adventures.
            </p>
            <button onClick={closeDrawer} className="btn-accent btn-md mt-2">
              Start Exploring
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-navy/8 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3.5 py-4">
                  <Link href={`/products/${item.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sky/50">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="truncate text-sm font-bold text-navy hover:text-cosmic"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-full p-1 text-navy/40 hover:bg-blush/30 hover:text-[#B4486E]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-ink/60">{formatAUD(item.priceCents)}</span>
                    <div className="mt-auto flex items-center gap-2 pt-1.5">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="rounded-full border-2 border-navy/15 p-1.5 text-navy hover:border-navy"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <IconMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-extrabold text-navy">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="rounded-full border-2 border-navy/15 p-1.5 text-navy hover:border-navy"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <IconPlus className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-auto text-sm font-extrabold text-navy">
                        {formatAUD(item.priceCents * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-navy/8 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink/70">Subtotal</span>
                <span className="font-display text-xl font-semibold text-navy">
                  {formatAUD(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                Shipping calculated at checkout. Prices include GST.
              </p>
              <div className="mt-4 grid gap-2.5">
                <Link href="/checkout" onClick={closeDrawer} className="btn-accent btn-lg">
                  Checkout <IconArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link href="/cart" onClick={closeDrawer} className="btn-ghost btn-md">
                  View Full Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
