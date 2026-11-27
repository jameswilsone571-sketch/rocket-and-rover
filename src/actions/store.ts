"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, subscribers, messages, products } from "@/db/schema";
import { getSettings, getOrdersByCustomer } from "@/lib/queries";
import { makeOrderNumber } from "@/lib/format";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const value = email.trim().toLowerCase();
  if (!EMAIL_RE.test(value)) return { ok: false, error: "Please enter a valid email address." };
  try {
    await db.insert(subscribers).values({ email: value }).onConflictDoNothing();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export type CheckoutInput = {
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  deliveryMethod: string;
  notes: string;
  honeypot: string;
  items: {
    id: number;
    slug: string;
    name: string;
    priceCents: number;
    image: string;
    qty: number;
  }[];
  subtotalCents: number;
};

export async function placeOrder(
  input: CheckoutInput
): Promise<
  | { ok: true; orderNumber: string; shippingCents: number; totalCents: number }
  | { ok: false; error: string }
> {
  if (input.honeypot) return { ok: false, error: "Submission rejected." };
  const email = input.email.trim().toLowerCase();
  if (!input.customerName.trim()) return { ok: false, error: "Please enter your full name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (
    !input.addressLine1.trim() ||
    !input.suburb.trim() ||
    !input.state.trim() ||
    !input.postcode.trim()
  )
    return { ok: false, error: "Please complete your shipping address." };
  if (input.items.length === 0) return { ok: false, error: "Your cart is empty." };

  const settings = await getSettings();
  const rate = parseInt(settings.shippingRateCents ?? "995", 10);
  const threshold = parseInt(settings.freeShipThresholdCents ?? "0", 10);
  const shippingCents = threshold > 0 && input.subtotalCents >= threshold ? 0 : rate;
  const totalCents = input.subtotalCents + shippingCents;

  const orderNumber = makeOrderNumber();
  try {
    await db.insert(orders).values({
      orderNumber,
      customerName: input.customerName.trim(),
      email,
      phone: input.phone.trim(),
      addressLine1: input.addressLine1.trim(),
      addressLine2: input.addressLine2.trim(),
      suburb: input.suburb.trim(),
      state: input.state.trim(),
      postcode: input.postcode.trim(),
      country: input.country,
      deliveryMethod: input.deliveryMethod,
      notes: input.notes.trim(),
      subtotalCents: input.subtotalCents,
      shippingCents,
      taxCents: 0,
      totalCents,
      status: "pending_payment",
      items: input.items.map((i) => ({
        productId: i.id,
        slug: i.slug,
        name: i.name,
        priceCents: i.priceCents,
        image: i.image,
        quantity: i.qty,
      })),
    });
    for (const item of input.items) {
      await db
        .update(products)
        .set({ stockQty: sql`GREATEST(stock_qty - ${item.qty}, 0)` })
        .where(eq(products.id, item.id));
    }
    return { ok: true, orderNumber, shippingCents, totalCents };
  } catch {
    return { ok: false, error: "We couldn't place your order. Please try again." };
  }
}

export async function findOrdersByEmail(
  email: string
): Promise<
  | {
      ok: true;
      orders: {
        orderNumber: string;
        createdAt: Date;
        totalCents: number;
        status: string;
        itemCount: number;
      }[];
    }
  | { ok: false; error: string }
> {
  const value = email.trim().toLowerCase();
  if (!EMAIL_RE.test(value)) return { ok: false, error: "Please enter a valid email address." };
  const rows = await getOrdersByCustomer(value);
  return {
    ok: true,
    orders: rows.map((r) => ({
      orderNumber: r.orderNumber,
      createdAt: r.createdAt,
      totalCents: r.totalCents,
      status: r.status,
      itemCount: (r.items ?? []).reduce((s, i) => s + ((i.quantity as number) ?? 0), 0),
    })),
  };
}

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  honeypot: string;
};

export async function sendContact(
  input: ContactInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.honeypot) return { ok: true }; // Silently drop spam
  if (!input.name.trim()) return { ok: false, error: "Please tell us your name." };
  if (!EMAIL_RE.test(input.email.trim()))
    return { ok: false, error: "Please enter a valid email address." };
  if (input.message.trim().length < 5)
    return { ok: false, error: "Please write a short message." };
  try {
    await db.insert(messages).values({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      subject: input.subject.trim() || "General enquiry",
      message: input.message.trim(),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
