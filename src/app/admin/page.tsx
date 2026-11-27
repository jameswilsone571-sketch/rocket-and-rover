import Link from "next/link";
import { getStats } from "@/lib/queries";
import { formatAUD, formatDate, statusLabel } from "@/lib/format";
import {
  IconPackage,
  IconPlus,
  IconStore,
  IconTruck,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  const stats = await getStats();

  const cards = [
    { label: "Total Orders", value: String(stats.totalOrders), sub: `${stats.pendingOrders} pending payment`, icon: IconStore, tone: "bg-lav text-cosmic" },
    { label: "Total Sales", value: formatAUD(stats.totalSales), sub: "excluding cancelled", icon: IconTruck, tone: "bg-sky text-rocket-dark" },
    { label: "Products", value: String(stats.productCount), sub: "in your catalogue", icon: IconPackage, tone: "bg-cream text-star-dark" },
    { label: "Low Stock", value: String(stats.lowStock.length + stats.soldOut.length), sub: "items to restock", icon: IconPackage, tone: "bg-blush/30 text-[#B4486E]" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">Welcome back, boss!</h1>
          <p className="mt-1 font-bold text-ink/50">
            Here's what's happening at Rocket &amp; Rover.
          </p>
        </div>
        <Link href="/admin/products/manage" className="btn-primary btn-md">
          <IconPlus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-start gap-4 p-5">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${c.tone}`}>
              <c.icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">{c.label}</p>
              <p className="font-display text-2xl font-semibold text-navy">{c.value}</p>
              <p className="text-xs font-bold text-ink/45">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy/8 px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-navy">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-extrabold text-cosmic hover:underline">
              View all →
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm font-bold text-ink/50">
              No orders yet. Once customers start checking out, they'll appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy/5 text-xs font-extrabold uppercase tracking-wide text-ink/45">
                  <tr>
                    <th className="px-6 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/6">
                  {stats.recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-lav/30">
                      <td className="px-6 py-3.5 font-extrabold text-navy">{o.orderNumber}</td>
                      <td className="px-4 py-3.5 font-bold text-ink/70">{o.customerName}</td>
                      <td className="px-4 py-3.5 font-extrabold">{formatAUD(o.totalCents)}</td>
                      <td className="px-4 py-3.5">
                        <span className="chip bg-lav text-cosmic">{statusLabel(o.status)}</span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-ink/50">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy">Best Sellers</h2>
            {stats.bestSellers.length === 0 ? (
              <p className="mt-4 text-sm font-bold text-ink/50">
                Sales data will appear here as orders come in.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {stats.bestSellers.map((b, i) => (
                  <li key={b.name} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-star font-display text-sm font-semibold text-navy">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-navy">{b.name}</span>
                    <span className="text-xs font-bold text-ink/50">{b.qty} sold</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy">Stock Alerts</h2>
            {stats.lowStock.length === 0 && stats.soldOut.length === 0 ? (
              <p className="mt-4 text-sm font-bold text-ink/50">All stock levels look healthy.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {stats.soldOut.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-extrabold text-navy">{p.name}</span>
                    <span className="chip bg-navy/10 text-navy/60">Sold out</span>
                  </li>
                ))}
                {stats.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-extrabold text-navy">{p.name}</span>
                    <span className="chip bg-cream text-star-dark">{p.stockQty} left</span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/admin/products"
              className="mt-4 inline-block text-sm font-extrabold text-cosmic hover:underline"
            >
              Manage inventory →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
