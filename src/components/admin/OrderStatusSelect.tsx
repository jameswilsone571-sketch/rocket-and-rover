"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setOrderStatus } from "@/actions/admin";
import { ORDER_STATUSES } from "@/lib/format";

export function OrderStatusSelect({ orderId, current }: { orderId: number; current: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(e: React.ChangeEvent<HTMLSelectElement>) {
    setBusy(true);
    await setOrderStatus(orderId, e.target.value);
    setBusy(false);
    router.refresh();
  }

  return (
    <select
      value={current}
      onChange={change}
      disabled={busy}
      className="cursor-pointer rounded-full border-2 border-navy/12 bg-white px-3.5 py-1.5 text-xs font-extrabold text-navy focus:border-cosmic focus:outline-none"
      aria-label="Update order status"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
