import Link from "next/link";
import { getOrders } from "@/lib/queries";
import { formatAUD, formatDate, statusLabel } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { IconChevronDown } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

export default async function AdminOrders() {
  const orders = await getOrders(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Orders</h1>
        <p className="mt-1 font-bold text-ink/50">
          {orders.length === 0
            ? "No orders yet — they'll appear here when customers check out."
            : `${orders.length} order${orders.length === 1 ? "" : "s"} in the inbox.`}
        </p>
      </div>

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((o) => (
            <details key={o.id} className="rr-acc card overflow-hidden">
              <summary className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 sm:px-6">
                <span className="font-display font-semibold text-navy">{o.orderNumber}</span>
                <span className="text-xs font-bold text-ink/45">{formatDate(o.createdAt)}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-ink/70">
                  {o.customerName} · {o.email}
                </span>
                <span className="font-display font-semibold text-navy">{formatAUD(o.totalCents)}</span>
                <OrderStatusSelect orderId={o.id} current={o.status} />
                <IconChevronDown className="rr-acc-chevron h-5 w-5 text-ink/40" />
              </summary>
              <div className="grid gap-6 border-t border-navy/8 bg-navy/2 px-5 py-5 sm:px-6 lg:grid-cols-3">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Items</h3>
                  <ul className="mt-2.5 space-y-2.5">
                    {((o.items ?? []) as { name: string; priceCents: number; quantity: number; image?: string }[]).map(
                      (it, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          {it.image && (
                            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sky/60">
                              <img src={it.image} alt="" className="h-full w-full object-cover" />
                            </span>
                          )}
                          <span className="min-w-0 flex-1 truncate font-extrabold text-navy">
                            {it.name} <span className="font-bold text-ink/45">× {it.quantity}</span>
                          </span>
                          <span className="font-bold text-ink/60">{formatAUD(it.priceCents * it.quantity)}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <div className="mt-3 space-y-1 border-t border-navy/10 pt-3 text-sm font-bold text-ink/60">
                    <p className="flex justify-between"><span>Subtotal</span><span>{formatAUD(o.subtotalCents)}</span></p>
                    <p className="flex justify-between"><span>Shipping</span><span>{formatAUD(o.shippingCents)}</span></p>
                    <p className="flex justify-between text-navy"><span>Total</span><span>{formatAUD(o.totalCents)}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Shipping to</h3>
                  <p className="mt-2.5 text-sm font-bold leading-relaxed text-ink/70">
                    {o.customerName}
                    <br />
                    {o.addressLine1}
                    {o.addressLine2 && (
                      <>
                        <br />
                        {o.addressLine2}
                      </>
                    )}
                    <br />
                    {o.suburb}, {o.state} {o.postcode}
                    <br />
                    {o.country}
                    <br />
                    {o.phone && <>{o.phone}</>}
                  </p>
                  <h3 className="mt-4 text-xs font-extrabold uppercase tracking-wide text-ink/45">
                    Delivery method
                  </h3>
                  <p className="mt-1.5 text-sm font-bold text-ink/70">{o.deliveryMethod}</p>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Contact &amp; notes</h3>
                  <p className="mt-2.5 text-sm font-bold text-ink/70">{o.email}</p>
                  <p className="mt-1 text-sm font-bold text-ink/70">
                    Status: <span className="text-cosmic">{statusLabel(o.status)}</span>
                  </p>
                  {o.notes && (
                    <>
                      <h3 className="mt-4 text-xs font-extrabold uppercase tracking-wide text-ink/45">
                        Customer notes
                      </h3>
                      <p className="mt-1.5 whitespace-pre-line text-sm font-bold text-ink/70">{o.notes}</p>
                    </>
                  )}
                  <Link
                    href={`/order-confirmation/${o.orderNumber}`}
                    className="mt-4 inline-block text-sm font-extrabold text-cosmic hover:underline"
                  >
                    View as customer sees it →
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
