"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import {
  IconCart,
  IconChevronDown,
  IconMenu,
  IconSearch,
  IconUser,
  IconX,
} from "@/components/Icons";
import { useCart } from "@/context/CartContext";

type HeaderProps = {
  announcement: string;
  categories: { slug: string; name: string }[];
};

const MAIN_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQs" },
];

export function Header({ announcement, categories }: HeaderProps) {
  const { count, openDrawer, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileShopOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setQuery("");
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {announcement && (
        <div className="bg-navy-deep px-4 py-2 text-center text-[0.8rem] font-bold tracking-wide text-lav">
          {announcement}
        </div>
      )}

      <header
        className={`sticky top-0 z-40 bg-white/92 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-soft" : "shadow-none border-b border-navy/5"
        }`}
      >
        <div className="container-rr flex h-[4.25rem] items-center justify-between gap-3">
          <button
            className="rounded-full p-2 text-navy hover:bg-lav focus-visible:outline-2 focus-visible:outline-cosmic lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu className="h-6 w-6" />
          </button>

          <Link
            href="/"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cosmic"
            aria-label="Rocket & Rover — home"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            <Link
              href="/"
              className={`rounded-full px-3.5 py-2 font-bold transition-colors hover:bg-lav ${
                isActive("/") ? "text-cosmic" : "text-navy"
              }`}
            >
              Home
            </Link>
            <div className="group relative">
              <button
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 font-bold transition-colors hover:bg-lav ${
                  pathname.startsWith("/shop") ? "text-cosmic" : "text-navy"
                }`}
                aria-haspopup="true"
              >
                Shop
                <IconChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-2xl border border-navy/8 bg-white p-2 shadow-lift">
                  <Link
                    href="/shop"
                    className="flex items-center justify-between rounded-xl bg-lav/70 px-4 py-2.5 font-bold text-navy hover:bg-lav"
                  >
                    Shop All Products
                    <span className="text-xs font-extrabold text-cosmic">All →</span>
                  </Link>
                  <div className="mt-1.5 grid grid-cols-1">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/shop/${c.slug}`}
                        className="rounded-xl px-4 py-2 text-sm font-bold text-ink/80 hover:bg-lav/70 hover:text-navy"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {MAIN_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 font-bold transition-colors hover:bg-lav ${
                  isActive(l.href) ? "text-cosmic" : "text-navy"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2.5 text-navy transition-colors hover:bg-lav focus-visible:outline-2 focus-visible:outline-cosmic"
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              {searchOpen ? <IconX className="h-5 w-5" /> : <IconSearch className="h-5 w-5" />}
            </button>
            <Link
              href="/account"
              className="hidden rounded-full p-2.5 text-navy transition-colors hover:bg-lav focus-visible:outline-2 focus-visible:outline-cosmic sm:block"
              aria-label="My account and orders"
            >
              <IconUser className="h-5 w-5" />
            </Link>
            <button
              onClick={openDrawer}
              className="relative rounded-full p-2.5 text-navy transition-colors hover:bg-lav focus-visible:outline-2 focus-visible:outline-cosmic"
              aria-label={`Open cart, ${hydrated ? count : 0} items`}
            >
              <IconCart className="h-5.5 w-5.5" strokeWidth={1.9} />
              {hydrated && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cosmic px-1 text-[0.68rem] font-extrabold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search row */}
        <div
          className={`overflow-hidden border-t border-navy/5 transition-all duration-300 ${
            searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form onSubmit={submitSearch} className="container-rr flex items-center gap-3 py-3">
            <IconSearch className="h-5 w-5 shrink-0 text-navy/40" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kits, puzzles, toys, activities…"
              aria-label="Search products"
              className="flex-1 bg-transparent text-[0.95rem] font-semibold text-navy placeholder:text-navy/35 focus:outline-none"
            />
            <button type="submit" className="btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col overflow-y-auto bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-navy/8 px-5 py-4">
              <Logo size="sm" />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 text-navy hover:bg-lav"
                aria-label="Close menu"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
              <Link
                href="/"
                className="rounded-xl px-4 py-3 text-lg font-bold text-navy hover:bg-lav"
              >
                Home
              </Link>
              <button
                onClick={() => setMobileShopOpen((v) => !v)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-lg font-bold text-navy hover:bg-lav"
                aria-expanded={mobileShopOpen}
              >
                Shop
                <IconChevronDown
                  className={`h-5 w-5 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileShopOpen && (
                <div className="mb-1 ml-3 flex flex-col gap-0.5 border-l-2 border-lav pl-3">
                  <Link href="/shop" className="rounded-lg px-3 py-2.5 font-bold text-cosmic hover:bg-lav/70">
                    Shop All Products
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop/${c.slug}`}
                      className="rounded-lg px-3 py-2.5 text-sm font-bold text-ink/75 hover:bg-lav/70"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
              {MAIN_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-lg font-bold text-navy hover:bg-lav">
                  {l.label}
                </Link>
              ))}
              <Link href="/account" className="flex items-center gap-2 rounded-xl px-4 py-3 text-lg font-bold text-navy hover:bg-lav">
                <IconUser className="h-5 w-5" /> My Account
              </Link>
            </nav>
            <div className="mt-auto border-t border-navy/8 p-5 text-xs font-bold text-navy/50">
              Big adventures. Little explorers.
              <br />
              Endless imagination.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
