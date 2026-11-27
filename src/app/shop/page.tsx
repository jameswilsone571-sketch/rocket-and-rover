import type { Metadata } from "next";
import Link from "next/link";
import { listProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { ShopControls } from "@/components/ShopControls";
import { IconSearch } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All — Creative Space Toys & Kits",
  description:
    "Browse all of Rocket & Rover's creative kits, playful toys and exciting space-themed activities for little explorers.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = str(sp.q)?.trim() || undefined;
  const price = str(sp.price) ?? "";
  const availability = str(sp.availability) ?? "";
  const isNew = str(sp.isNew) ?? "";
  const sort = str(sp.sort) ?? "";

  const products = await listProducts({ q, price, availability, isNew, sort });

  return (
    <div className="container-rr py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-extrabold uppercase tracking-wider text-ink/45">
        <Link href="/" className="hover:text-cosmic">Home</Link>
        <span className="mx-2 text-ink/30">/</span>
        <span className="text-navy">Shop All</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
          Explore All Adventures
        </h1>
        <p className="mt-3 text-lg text-ink/60">
          Discover creative kits, playful toys and exciting activities for little
          explorers.
        </p>
      </header>

      <div className="mt-8">
        <ShopControls
          basePath="/shop"
          q={q}
          price={price}
          availability={availability}
          isNew={isNew}
          sort={sort}
          total={products.length}
        />
      </div>

      {products.length > 0 ? (
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-soft">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-lav text-cosmic">
            <IconSearch className="h-9 w-9" strokeWidth={1.8} />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-navy">
            No adventures found
          </h2>
          <p className="mt-2 max-w-md text-ink/60">
            {q
              ? `We couldn't find anything matching "${q}". Try a different keyword, like "puzzle", "paint" or "rocket".`
              : "No products match those filters just yet. Try clearing a filter or two."}
          </p>
          <Link href="/shop" className="btn-accent btn-md mt-6">
            Clear search &amp; filters
          </Link>
        </div>
      )}
    </div>
  );
}
