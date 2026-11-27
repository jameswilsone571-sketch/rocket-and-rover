"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/actions/store";
import { formatAUD } from "@/lib/format";
import { IconArrowRight, IconShield } from "@/components/Icons";

type Props = {
  shippingRateCents: number;
  freeShipThresholdCents: number;
  states: string[];
};

export function CheckoutForm({ shippingRateCents, freeShipThresholdCents, states }: Props) {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
    state: "",
    postcode: "",
    country: "Australia",
    deliveryMethod: "Standard (Australia-wide)",
    notes: "",
    company: "",
  });

  const freeShipping = freeShipThresholdCents > 0 && subtotal >= freeShipThresholdCents;
  const shippingCents = freeShipping ? 0 : shippingRateCents;
  const total = subtotal + shippingCents;

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { company, ...rest } = form;
    const res = await placeOrder({
      ...rest,
      honeypot: company,
      items,
      subtotalCents: subtotal,
    });
    setBusy(false);
    if (res.ok) {
      clearCart();
      router.push(`/order-confirmation/${res.orderNumber}`);
    } else {
      setError(res.error);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-soft">
        <h2 className="font-display text-2xl font-semibold text-navy">Your cart is empty</h2>
        <p className="mt-2 text-ink/60">Add a few creative adventures before checking out.</p>
        <Link href="/shop" className="btn-accent btn-md mt-6">
          Explore the Universe
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]" noValidate>
      <div className="space-y-8">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">1. Contact details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="co-name" className="label">Full name *</label>
              <input
                id="co-name"
                className="input"
                required
                autoComplete="name"
                value={form.customerName}
                onChange={(e) => set("customerName", e.target.value)}
                placeholder="Kirsty Explorer"
              />
            </div>
            <div>
              <label htmlFor="co-email" className="label">Email address *</label>
              <input
                id="co-email"
                type="email"
                className="input"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com.au"
              />
            </div>
            <div>
              <label htmlFor="co-phone" className="label">Phone (optional)</label>
              <input
                id="co-phone"
                type="tel"
                className="input"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0400 000 000"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">2. Shipping address</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="co-addr1" className="label">Address line 1 *</label>
              <input
                id="co-addr1"
                className="input"
                required
                autoComplete="address-line1"
                value={form.addressLine1}
                onChange={(e) => set("addressLine1", e.target.value)}
                placeholder="123 Rocket Lane"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="co-addr2" className="label">Address line 2 (optional)</label>
              <input
                id="co-addr2"
                className="input"
                autoComplete="address-line2"
                value={form.addressLine2}
                onChange={(e) => set("addressLine2", e.target.value)}
                placeholder="Unit, apartment, etc."
              />
            </div>
            <div>
              <label htmlFor="co-suburb" className="label">Suburb / City *</label>
              <input
                id="co-suburb"
                className="input"
                required
                autoComplete="address-level2"
                value={form.suburb}
                onChange={(e) => set("suburb", e.target.value)}
                placeholder="Canberra"
              />
            </div>
            <div>
              <label htmlFor="co-state" className="label">State / Territory *</label>
              <select
                id="co-state"
                className="input cursor-pointer"
                required
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              >
                <option value="">Select…</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="co-postcode" className="label">Postcode *</label>
              <input
                id="co-postcode"
                className="input"
                required
                autoComplete="postal-code"
                inputMode="numeric"
                value={form.postcode}
                onChange={(e) => set("postcode", e.target.value)}
                placeholder="2600"
              />
            </div>
            <div>
              <label htmlFor="co-country" className="label">Country *</label>
              <select
                id="co-country"
                className="input cursor-pointer"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              >
                <option value="Australia">Australia</option>
                <option value="International" disabled>
                  International shipping — coming soon
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">3. Delivery method</h2>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-cosmic bg-lav/40 p-4">
            <input type="radio" name="delivery" defaultChecked className="h-4 w-4 accent-cosmic" readOnly />
            <span className="flex-1">
              <span className="block font-extrabold text-navy">Standard (Australia-wide)</span>
              <span className="block text-xs font-bold text-ink/50">
                Sample rate — final delivery times and rates to be confirmed by Rocket &amp; Rover.
              </span>
            </span>
            <span className="font-display font-semibold text-navy">
              {freeShipping ? "Free" : formatAUD(shippingRateCents)}
            </span>
          </label>
          {freeShipThresholdCents > 0 && freeShipping && (
            <p className="mt-3 rounded-xl bg-turq/15 px-4 py-2.5 text-xs font-extrabold text-[#1E8578]">
              You've unlocked free standard shipping on this order!
            </p>
          )}
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">4. Order notes (optional)</h2>
          <textarea
            className="input mt-4 min-h-24"
            placeholder="Anything we should know about your delivery?"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </section>

        {/* Honeypot — hidden from humans */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="co-company">Company</label>
          <input
            id="co-company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
      </div>

      <aside className="card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold text-navy">Order Summary</h2>
        <ul className="mt-5 divide-y divide-navy/8">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 py-3">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sky/50">
                <img src={it.image} alt="" className="h-full w-full object-cover" />
                <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-xl bg-navy px-1 text-[0.65rem] font-extrabold text-white">
                  {it.qty}
                </span>
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-navy">{it.name}</span>
              <span className="text-sm font-extrabold">{formatAUD(it.priceCents * it.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-navy/10 pt-4 text-sm font-bold text-ink/70">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatAUD(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{freeShipping ? "Free" : formatAUD(shippingCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax (GST)</dt>
            <dd>Included</dd>
          </div>
          <div className="flex justify-between pt-1 text-base text-navy">
            <dt className="font-display font-semibold">Total</dt>
            <dd className="font-display text-xl font-semibold">{formatAUD(total)}</dd>
          </div>
        </dl>
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-blush/30 px-4 py-3 text-sm font-extrabold text-[#B4486E]">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-accent btn-lg mt-5 w-full">
          {busy ? "Placing order…" : "Place Order"} <IconArrowRight className="h-4.5 w-4.5" />
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-ink/45">
          <IconShield className="h-4 w-4" /> Secure guest checkout — no account needed
        </p>
      </aside>
    </form>
  );
}
