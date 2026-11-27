"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/actions/admin";
import { Logo } from "@/components/Logo";
import { IconShield } from "@/components/Icons";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const res = await adminLogin(passcode);
    setBusy(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError(res.error ?? "Login failed.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo tone="light" showTagline size="md" />
        </div>
        <form onSubmit={handleSubmit} className="card p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lav text-cosmic">
            <IconShield className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-navy">Admin sign in</h1>
          <p className="mt-1 text-sm font-bold text-ink/50">
            Enter the store passcode to manage Rocket &amp; Rover.
          </p>
          <label htmlFor="passcode" className="label mt-5">Passcode</label>
          <input
            id="passcode"
            type="password"
            className="input"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError("");
            }}
            placeholder="••••••••"
            autoFocus
          />
          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-blush/30 px-3.5 py-2.5 text-sm font-extrabold text-[#B4486E]">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-primary btn-lg mt-5 w-full">
            {busy ? "Checking…" : "Sign In"}
          </button>
          <p className="mt-4 rounded-xl bg-cream px-3.5 py-2.5 text-xs font-bold leading-relaxed text-navy/60">
            Demo passcode: <span className="text-navy">rover-2026</span> — change this via
            the ADMIN_PASSCODE environment variable before going live.
          </p>
        </form>
      </div>
    </div>
  );
}
