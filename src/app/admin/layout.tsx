import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = { title: { template: "%s | Rocket & Rover Admin" } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const authed = jar.get("rr_admin")?.value === "active";
  return <AdminShell authed={authed}>{children}</AdminShell>;
}
