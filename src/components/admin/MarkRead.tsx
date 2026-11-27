"use client";

import { useRouter } from "next/navigation";
import { markMessageRead } from "@/actions/admin";

export function MarkReadButton({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await markMessageRead(id);
        router.refresh();
      }}
      className="btn-ghost btn-sm"
    >
      Mark as Read
    </button>
  );
}
