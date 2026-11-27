"use client";

import { useRouter } from "next/navigation";

type ShopControlsProps = {
  basePath: string; // "/shop" or "/shop/<slug>"
  q?: string;
  price: string;
  availability: string;
  isNew: string;
  sort: string;
  total: number;
};

export function ShopControls({
  basePath,
  q,
  price,
  availability,
  isNew,
  sort,
  total,
}: ShopControlsProps) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (key !== "price" && price) params.set("price", price);
    if (key !== "availability" && availability) params.set("availability", availability);
    if (key !== "isNew" && isNew) params.set("isNew", isNew);
    if (key !== "sort" && sort) params.set("sort", sort);
    if (value) params.set(key, value);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  const selectCls = "input cursor-pointer py-2 pr-8 font-bold";

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm font-extrabold text-ink/60">
        {total} {total === 1 ? "adventure" : "adventures"} found
        {q && (
          <>
            {" "}for <span className="text-cosmic">"{q}"</span>
          </>
        )}
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <label className="block">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => update("sort", e.target.value)} className={selectCls}>
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Price range</span>
          <select value={price} onChange={(e) => update("price", e.target.value)} className={selectCls}>
            <option value="">Any price</option>
            <option value="under-20">Under $20</option>
            <option value="20-30">$20 – $30</option>
            <option value="30-50">$30 – $50</option>
            <option value="over-50">Over $50</option>
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Availability</span>
          <select
            value={availability}
            onChange={(e) => update("availability", e.target.value)}
            className={selectCls}
          >
            <option value="">Any availability</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Sold out</option>
          </select>
        </label>
        <label className="block">
          <span className="sr-only">New arrivals</span>
          <select value={isNew} onChange={(e) => update("isNew", e.target.value)} className={selectCls}>
            <option value="">All products</option>
            <option value="1">New arrivals</option>
          </select>
        </label>
      </div>
    </div>
  );
}
