"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/actions/store";
import { IconCheck, IconMail } from "@/components/Icons";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "busy") return;
    setStatus("busy");
    const res = await subscribeNewsletter(email);
    if (res.ok) {
      setStatus("ok");
      setEmail("");
      setMsg("You're on the crew list! Watch your inbox for launch updates.");
    } else {
      setStatus("error");
      setMsg(res.error ?? "Something went wrong. Please try again.");
    }
  }

  if (status === "ok" && compact) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-turq/15 px-4 py-3 text-sm font-bold text-turq">
        <IconCheck className="h-4 w-4" /> Subscribed — welcome aboard!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`flex ${compact ? "flex-col gap-2" : "flex-col gap-3 sm:flex-row"}`}>
        <div className="flex-1">
          <label htmlFor={compact ? "nl-compact" : "nl-main"} className="sr-only">
            Email address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
              <IconMail className="h-4.5 w-4.5" />
            </span>
            <input
              id={compact ? "nl-compact" : "nl-main"}
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Your email address"
              className={`${compact ? "" : "pl-11"} input ${
                compact ? "pl-10" : ""
              } bg-navy/5 text-navy placeholder:text-navy/40`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={status === "busy"}
          className={compact ? "btn-accent btn-md" : "btn-accent btn-lg"}
        >
          {status === "busy" ? "Launching…" : "Subscribe"}
        </button>
      </div>
      {status === "ok" && !compact && (
        <p className="mt-3 flex items-center gap-2 text-sm font-bold text-turq">
          <IconCheck className="h-4 w-4" /> {msg}
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm font-bold text-red-500">{msg}</p>
      )}
      <p className={`mt-2.5 text-xs ${compact ? "text-lav/60" : "text-navy/50"}`}>
        We only send exciting space updates. No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  );
}
