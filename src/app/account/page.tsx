"use client";

import Link from "next/link";
import { useState } from "react";
import { findOrdersByEmail } from "@/actions/store";
import { useCart } from "@/context/CartContext";
import { formatAUD, formatDate, statusLabel } from "@/lib/format";
import { IconHeart, IconPackage } from "@/components/Icons";

export default function AccountPage() {
  const { wishlist, hydrated, toggleWish } = useCart();
  const removeWish = (item: (typeof wishlist)[number]) => toggleWish(item);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<
    { orderNumber: string; createdAt: Date; totalCents: number; status: string; itemCount: number }[] | null
  >(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setSearched(false);
    const res = await findOrdersByEmail(email);
    setBusy(false);
    if (res.ok) {
      setResults(res.orders);
      setSearched(true);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="container-rr py-12 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-navy sm:text-5xl">My Account</h1>
        <p className="mt-3 text-lg text-ink/60">
          Guest shopping? No problem — look up your orders with the email you
          checked out with, and keep your wishlist handy.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="card p-6 sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-navy">
            <IconPackage className="h-5.5 w-5.5 text-cosmic" /> Track your order
          </h2>
          <form onSubmit={handleSearch} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor="ac-email" className="label">Email used at checkout</label>
              <input
                id="ac-email"
                type="email"
                required
                className="input"
                placeholder="you@example.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary btn-md self-end">
              {busy ? "Searching…" : "Find Orders"}
            </button>
          </form>
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-blush/30 px-4 py-3 text-sm font-extrabold text-[#B4486E]">
              {error}
            </p>
          )}
          {searched && results && (
            <div className="mt-6">
              {results.length === 0 ? (
                <p className="rounded-xl bg-lav/60 px-4 py-3.5 text-sm font-bold text-navy/70">
                  No orders found for that email yet. If you just placed an order,
                  check the email address or try again in a moment.
                </p>
              ) : (
                <ul className="divide-y divide-navy/8">
                  {results.map((o) => (
                    <li key={o.orderNumber} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3.5">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/order-confirmation/${o.orderNumber}`}
                          className="font-extrabold text-navy hover:text-cosmic"
                        >
                          {o.orderNumber}
                        </Link>
                        <p className="text-xs font-bold text-ink/45">
                          {formatDate(o.createdAt)} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span className="chip bg-lav text-cosmic">{statusLabel(o.status)}</span>
                      <span className="font-display font-semibold text-navy">
                        {formatAUD(o.totalCents)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        <section className="card p-6 sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-navy">
            <IconHeart className="h-5.5 w-5.5 text-cosmic" filled /> My wishlist
            {hydrated && wishlist.length > 0 && (
              <span className="chip bg-lav text-cosmic">{wishlist.length}</span>
            )}
          </h2>
          {!hydrated || wishlist.length === 0 ? (
            <p className="mt-5 rounded-xl bg-lav/60 px-4 py-3.5 text-sm font-bold leading-relaxed text-navy/70">
              No saved items yet. Tap the heart on any product to keep it here for
              later.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-navy/8">
              {wishlist.map((w) => (
                <li key={w.id} className="flex items-center gap-3.5 py-3.5">
                  <Link
                    href={`/products/${w.slug}`}
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sky/50"
                  >
                    <img src={w.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${w.slug}`}
                      className="block truncate text-sm font-extrabold text-navy hover:text-cosmic"
                    >
                      {w.name}
                    </Link>
                    <span className="text-sm font-bold text-ink/55">
                      {formatAUD(w.priceCents)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeWish(w)}
                    className="text-xs font-extrabold text-navy/40 hover:text-[#B4486E]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}


