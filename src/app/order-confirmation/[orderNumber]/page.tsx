import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/queries";
import { formatAUD, formatDate, statusLabel } from "@/lib/format";
import { IconCheck, IconTruck } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order Confirmation" };

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);
  if (!order) notFound();

  const items = (order.items ?? []) as {
    name: string;
    priceCents: number;
    image?: string;
    quantity: number;
  }[];

  return (
    <div className="container-rr max-w-3xl py-12 lg:py-16">
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-turq/20 text-[#1E8578]">
          <IconCheck className="h-10 w-10" strokeWidth={2.5} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-navy sm:text-4xl">
          You're in, Explorer!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-ink/60">
          Order <span className="font-extrabold text-navy">{order.orderNumber}</span> was
          placed on {formatDate(order.createdAt)}. A confirmation has been noted for
          the Rocket &amp; Rover crew.
        </p>
      </div>

      <div className="card mt-10 p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">Order Summary</h2>
        <ul className="mt-5 divide-y divide-navy/8">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-4 py-3.5">
              {it.image && (
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sky/50">
                  <img src={it.image} alt="" className="h-full w-full object-cover" />
                </span>
              )}
              <span className="flex-1 text-sm font-bold text-navy">
                {it.name} <span className="text-ink/45">× {it.quantity}</span>
              </span>
              <span className="text-sm font-extrabold text-navy">
                {formatAUD(it.priceCents * it.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-navy/10 pt-4 text-sm font-bold text-ink/70">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatAUD(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{order.shippingCents === 0 ? "—" : formatAUD(order.shippingCents)}</dd>
          </div>
          <div className="flex justify-between text-base text-navy">
            <dt className="font-display font-semibold">Total</dt>
            <dd className="font-display font-semibold">{formatAUD(order.totalCents)}</dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-sky/50 p-4">
            <p className="font-extrabold text-navy">Shipping to</p>
            <p className="mt-1 leading-relaxed text-ink/70">
              {order.customerName}
              <br />
              {order.addressLine1}
              {order.addressLine2 && <>, {order.addressLine2}</>}
              <br />
              {order.suburb}, {order.state} {order.postcode}
              <br />
              {order.country}
            </p>
          </div>
          <div className="rounded-2xl bg-lav/60 p-4">
            <p className="font-extrabold text-navy">Delivery method</p>
            <p className="mt-1 leading-relaxed text-ink/70">
              {order.deliveryMethod}
              <br />
              Status: {statusLabel(order.status)}
            </p>
          </div>
        </div>

        {order.status === "pending_payment" && (
          <div className="mt-6 flex gap-3 rounded-2xl bg-cream p-4 text-sm leading-relaxed text-navy/75">
            <IconTruck className="mt-0.5 h-5 w-5 shrink-0 text-star-dark" />
            <p>
              <span className="font-extrabold text-navy">What happens next:</span>{" "}
              Rocket &amp; Rover is connecting its online payment provider. You'll
              receive an email with payment and delivery instructions as soon as it's
              set up. You can track this order anytime from your{" "}
              <Link href="/account" className="font-extrabold text-cosmic hover:underline">
                account page
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="btn-accent btn-lg">
          Keep Exploring
        </Link>
        <Link href="/account" className="btn-ghost btn-lg">
          Track Your Order
        </Link>
      </div>
    </div>
  );
}
