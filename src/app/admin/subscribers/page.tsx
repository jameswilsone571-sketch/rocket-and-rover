import { getSubscribers } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subscribers" };

export default async function AdminSubscribers() {
  const subs = await getSubscribers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Newsletter Subscribers</h1>
        <p className="mt-1 font-bold text-ink/50">
          {subs.length === 0
            ? "No subscribers yet. Once customers join the crew, their emails appear here."
            : `${subs.length} subscriber${subs.length === 1 ? "" : "s"} on the crew list.`}
        </p>
      </div>

      {subs.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/5 text-xs font-extrabold uppercase tracking-wide text-ink/45">
              <tr>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/6">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-lav/30">
                  <td className="px-6 py-3.5 font-extrabold text-navy">{s.email}</td>
                  <td className="px-6 py-3.5 font-bold text-ink/50">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="rounded-2xl bg-cream px-5 py-4 text-sm font-bold leading-relaxed text-navy/60">
        Tip: connect your favourite email marketing tool (Mailchimp, Brevo, ConvertKit
        or similar) here to send newsletters to this list.
      </p>
    </div>
  );
}
