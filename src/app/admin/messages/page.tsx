import { getMessages } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { MarkReadButton } from "@/components/admin/MarkRead";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

export default async function AdminMessages() {
  const msgs = await getMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Messages</h1>
        <p className="mt-1 font-bold text-ink/50">
          {msgs.length === 0
            ? "No messages yet. Contact form submissions will land here."
            : `${msgs.length} message${msgs.length === 1 ? "" : "s"} from your customers.`}
        </p>
      </div>

      {msgs.length > 0 && (
        <div className="space-y-4">
          {msgs.map((m) => (
            <details
              key={m.id}
              className={`rr-acc card overflow-hidden ${m.read ? "" : "ring-2 ring-cosmic/30"}`}
              open={!m.read ? undefined : undefined}
            >
              <summary className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4">
                <span className={`h-2.5 w-2.5 rounded-full ${m.read ? "bg-navy/20" : "bg-cosmic"}`} aria-hidden="true" />
                <span className="font-extrabold text-navy">{m.name}</span>
                <span className="text-sm font-bold text-ink/45">{m.email}</span>
                <span className="chip bg-lav text-cosmic">{m.subject}</span>
                <span className="ml-auto text-xs font-bold text-ink/45">{formatDate(m.createdAt)}</span>
              </summary>
              <div className="border-t border-navy/8 px-5 py-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink/75">{m.message}</p>
                {m.phone && <p className="mt-2 text-xs font-bold text-ink/50">Phone: {m.phone}</p>}
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                    className="btn-primary btn-sm"
                  >
                    Reply by Email
                  </a>
                  {!m.read && <MarkReadButton id={m.id} />}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
