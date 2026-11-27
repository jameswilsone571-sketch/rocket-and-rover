"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { adminLogout } from "@/actions/admin";
import {
  IconGrid,
  IconMail,
  IconPackage,
  IconStore,
  IconStar,
  IconX,
} from "@/components/Icons";

const NAV = [
  { href: "/admin", label: "Overview", icon: IconGrid },
  { href: "/admin/products", label: "Products", icon: IconPackage },
  { href: "/admin/orders", label: "Orders", icon: IconStore },
  { href: "/admin/content", label: "Content & Pages", icon: IconStar },
  { href: "/admin/messages", label: "Messages", icon: IconMail },
  { href: "/admin/subscribers", label: "Subscribers", icon: IconMail },
];

export function AdminShell({ authed, children }: { authed: boolean; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!authed && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else if (authed && pathname === "/admin/login") {
      router.replace("/admin");
    }
  }, [authed, pathname, router]);

  if (pathname === "/admin/login") {
    if (authed) return null;
    return <>{children}</>;
  }
  if (!authed) return null;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleLogout() {
    await adminLogout();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F4F5FB]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-navy/10 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin"><Logo size="sm" /></Link>
          <button
            onClick={handleLogout}
            className="rounded-full border-2 border-navy/15 px-4 py-1.5 text-sm font-extrabold text-navy"
          >
            Log out
          </button>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold ${
                isActive(n.href) ? "bg-navy text-white" : "bg-navy/5 text-navy"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy-deep p-5 lg:flex">
          <Link href="/admin" className="rounded-full px-2 py-1">
            <Logo tone="light" size="sm" />
          </Link>
          <p className="mt-1 px-2 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-lav/40">
            Store dashboard
          </p>
          <nav className="mt-8 flex flex-col gap-1.5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors ${
                  isActive(n.href)
                    ? "bg-cosmic text-white"
                    : "text-lav/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <n.icon className="h-5 w-5" /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-extrabold text-lav hover:bg-white/20"
            >
              <IconStore className="h-5 w-5" /> View Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-extrabold text-lav/60 hover:bg-white/10 hover:text-white"
            >
              <IconX className="h-5 w-5" /> Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
