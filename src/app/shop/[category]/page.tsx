import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listProducts, getCategoryBySlug } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { ShopControls } from "@/components/ShopControls";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} — Kids Creative Space Toys Australia`,
    description: cat.description || `${cat.name} from Rocket & Rover.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: SP;
}) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat || !cat.active) notFound();

  const sp = await searchParams;
  const q = str(sp.q)?.trim() || undefined;
  const price = str(sp.price) ?? "";
  const availability = str(sp.availability) ?? "";
  const isNew = str(sp.isNew) ?? "";
  const sort = str(sp.sort) ?? "";

  const products = await listProducts({
    q,
    categorySlug: cat.slug,
    price,
    availability,
    isNew,
    sort,
  });

  const basePath = `/shop/${cat.slug}`;

  return (
    <div className="container-rr py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-extrabold uppercase tracking-wider text-ink/45">
        <Link href="/" className="hover:text-cosmic">Home</Link>
        <span className="mx-2 text-ink/30">/</span>
        <Link href="/shop" className="hover:text-cosmic">Shop All</Link>
        <span className="mx-2 text-ink/30">/</span>
        <span className="text-navy">{cat.name}</span>
      </nav>

      <section className="relative mt-5 overflow-hidden rounded-[2.5rem] bg-navy shadow-lift">
        <div className="grid items-center gap-6 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              {cat.name}
            </h1>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-lav/75">
              {cat.description}
            </p>
          </div>
          <div className="hidden justify-center lg:flex">
            <img
              src={cat.image}
              alt={`${cat.name} preview`}
              className="w-64 rotate-2 rounded-3xl shadow-lift transition-transform duration-500 hover:rotate-0"
            />
          </div>
        </div>
      </section>

      <div className="mt-8">
        <ShopControls
          basePath={basePath}
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
          <h2 className="font-display text-2xl font-semibold text-navy">Nothing here yet</h2>
          <p className="mt-2 max-w-md text-ink/60">
            This corner of the universe is still being stocked. Check back soon or
            explore everything else we have.
          </p>
          <Link href="/shop" className="btn-accent btn-md mt-6">
            Shop all products
          </Link>
        </div>
      )}
    </div>
  );
}
