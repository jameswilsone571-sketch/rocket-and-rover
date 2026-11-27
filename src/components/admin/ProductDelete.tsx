"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProduct } from "@/actions/admin";
import { IconTrash } from "@/components/Icons";

export function ProductDeleteButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    await deleteProduct(id);
    setBusy(false);
    setConfirming(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-blush/30 px-3 py-1.5 text-xs font-extrabold text-[#B4486E]">
        Delete?
        <button onClick={handleDelete} disabled={busy} className="rounded-full bg-[#B4486E] px-2.5 py-1 text-white">
          {busy ? "…" : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)} className="rounded-full bg-navy/10 px-2.5 py-1 text-navy">
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-full p-2 text-navy/40 hover:bg-blush/30 hover:text-[#B4486E]"
      aria-label={`Delete ${name}`}
    >
      <IconTrash className="h-4.5 w-4.5" />
    </button>
  );
}
