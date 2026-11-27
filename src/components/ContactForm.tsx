"use client";

import { useState } from "react";
import { sendContact } from "@/actions/store";
import { IconCheck } from "@/components/Icons";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company: "",
  });

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
    const res = await sendContact({ ...rest, honeypot: company });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-turq/10 px-6 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-turq/25 text-[#1E8578]">
          <IconCheck className="h-8 w-8" strokeWidth={2.5} />
        </span>
        <h2 className="font-display text-2xl font-semibold text-navy">Message received!</h2>
        <p className="max-w-sm text-ink/60">
          Thanks for reaching out — the Rocket &amp; Rover crew will get back to you
          as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="label">Your name *</label>
          <input
            id="ct-name"
            className="input"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Kirsty Explorer"
          />
        </div>
        <div>
          <label htmlFor="ct-email" className="label">Email *</label>
          <input
            id="ct-email"
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com.au"
          />
        </div>
        <div>
          <label htmlFor="ct-phone" className="label">Phone (optional)</label>
          <input
            id="ct-phone"
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="0400 000 000"
          />
        </div>
        <div>
          <label htmlFor="ct-subject" className="label">Subject</label>
          <select
            id="ct-subject"
            className="input cursor-pointer"
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
          >
            <option value="">Choose a topic…</option>
            <option>Order enquiry</option>
            <option>Product question</option>
            <option>Wholesale / retail</option>
            <option>Feedback</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ct-message" className="label">Message *</label>
          <textarea
            id="ct-message"
            className="input min-h-32"
            required
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your adventure…"
          />
        </div>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="ct-company">Company</label>
        <input
          id="ct-company"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-blush/30 px-4 py-3 text-sm font-extrabold text-[#B4486E]">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-accent btn-lg mt-6 w-full sm:w-auto">
        {busy ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
