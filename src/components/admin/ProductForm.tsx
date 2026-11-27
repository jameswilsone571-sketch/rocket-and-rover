"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { saveProduct } from "@/actions/admin";
import { IconPlus, IconTrash } from "@/components/Icons";

type ProductData = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  priceCents: number;
  compareAtPriceCents: number | null;
  stockQty: number;
  available: boolean;
  isNew: boolean;
  isFeatured: boolean;
  sampleData: boolean;
  shortDescription: string;
  description: string;
  whatsIncluded: string;
  productDetails: string;
  keywords: string;
  images: string[];
};

export function ProductForm({
  product,
  categories,
}: {
  product: ProductData | null;
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? 0,
    price: product ? (product.priceCents / 100).toFixed(2) : "",
    compareAt: product?.compareAtPriceCents ? (product.compareAtPriceCents / 100).toFixed(2) : "",
    stockQty: String(product?.stockQty ?? 10),
    available: product?.available ?? true,
    isNew: product?.isNew ?? false,
    isFeatured: product?.isFeatured ?? false,
    sampleData: product?.sampleData ?? true,
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    whatsIncluded: product?.whatsIncluded ?? "",
    productDetails: product?.productDetails ?? "",
    keywords: product?.keywords ?? "",
  });
  const [images, setImages] = useState<string[]>(product?.images?.length ? product.images : []);
  const [imageUrl, setImageUrl] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image is larger than 2MB. Please upload a smaller photo or paste a hosted image URL instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImages((prev) => [...prev, String(reader.result)]);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setImageUrl("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const priceCents = Math.round(parseFloat(form.price || "0") * 100);
    const compareAt = form.compareAt ? Math.round(parseFloat(form.compareAt) * 100) : null;
    const res = await saveProduct({
      id: product?.id,
      name: form.name,
      slug: form.slug,
      categoryId: parseInt(String(form.categoryId), 10),
      priceCents,
      compareAtPriceCents: compareAt,
      stockQty: parseInt(form.stockQty || "0", 10),
      available: form.available,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      sampleData: form.sampleData,
      shortDescription: form.shortDescription,
      description: form.description,
      whatsIncluded: form.whatsIncluded,
      productDetails: form.productDetails,
      keywords: form.keywords,
      images,
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(res.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Basics</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="pf-name">Product name *</label>
              <input id="pf-name" required className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Space Adventure Plaster Painting Kit" />
            </div>
            <div>
              <label className="label" htmlFor="pf-slug">URL slug (optional — auto-generated)</label>
              <input id="pf-slug" className="input" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="space-adventure-plaster-kit" disabled={!!product} />
            </div>
            <div>
              <label className="label" htmlFor="pf-cat">Category *</label>
              <select id="pf-cat" required className="input cursor-pointer" value={form.categoryId} onChange={(e) => set("categoryId", parseInt(e.target.value, 10))}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="pf-price">Price (AUD) *</label>
              <input id="pf-price" required inputMode="decimal" className="input" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="34.95" />
            </div>
            <div>
              <label className="label" htmlFor="pf-compare">Sale price (optional)</label>
              <input id="pf-compare" inputMode="decimal" className="input" value={form.compareAt} onChange={(e) => set("compareAt", e.target.value)} placeholder="Leave empty if no sale" />
            </div>
            <div>
              <label className="label" htmlFor="pf-stock">Stock quantity</label>
              <input id="pf-stock" type="number" min={0} className="input" value={form.stockQty} onChange={(e) => set("stockQty", e.target.value)} />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              {[
                { key: "available" as const, label: "Visible in store" },
                { key: "isNew" as const, label: "Mark as New arrival" },
                { key: "isFeatured" as const, label: "Feature on homepage" },
                { key: "sampleData" as const, label: "Mark as sample data" },
              ].map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2.5 text-sm font-extrabold text-navy">
                  <input
                    type="checkbox"
                    checked={form[c.key]}
                    onChange={(e) => set(c.key, e.target.checked)}
                    className="h-4.5 w-4.5 accent-cosmic"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Description</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="pf-short">Short description (shown on product cards &amp; quick view)</label>
              <textarea id="pf-short" className="input min-h-20" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="A creative space-themed activity set for little explorers…" />
            </div>
            <div>
              <label className="label" htmlFor="pf-desc">Full description (product page)</label>
              <textarea id="pf-desc" className="input min-h-32" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell the story of this product…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="pf-included">What's included</label>
                <textarea id="pf-included" className="input min-h-24" value={form.whatsIncluded} onChange={(e) => set("whatsIncluded", e.target.value)} placeholder={"1× Rocket figurine\n1× Astronaut figurine\n…"} />
                <p className="mt-1 text-xs font-bold text-ink/40">Only fill in once confirmed by the supplier.</p>
              </div>
              <div>
                <label className="label" htmlFor="pf-details">Product details (dimensions, materials, age)</label>
                <textarea id="pf-details" className="input min-h-24" value={form.productDetails} onChange={(e) => set("productDetails", e.target.value)} placeholder={"Dimensions: …\nMaterials: …\nAge: …"} />
                <p className="mt-1 text-xs font-bold text-ink/40">Leave blank until you have confirmed details.</p>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="pf-keywords">Search keywords (comma separated)</label>
              <input id="pf-keywords" className="input" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="space, painting kit, craft, kids" />
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Photos</h2>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/45">
            The first photo is the main image. Upload a photo or paste an image URL.
          </p>
          <div className="mt-4 space-y-3">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sky/50">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </span>
                <span className={`min-w-0 flex-1 truncate text-xs font-bold ${img.startsWith("data:") ? "text-cosmic" : "text-ink/50"}`}>
                  {img.startsWith("data:") ? "Uploaded photo" : img}
                </span>
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-full p-1.5 text-navy/40 hover:bg-blush/30 hover:text-[#B4486E]"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <p className="rounded-xl bg-navy/5 px-4 py-3 text-xs font-bold text-ink/45">
                No photos yet — the store will use a placeholder.
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="input flex-1"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…/photo.jpg"
              aria-label="Image URL"
            />
            <button type="button" onClick={addImageUrl} className="btn-ghost btn-sm shrink-0">
              <IconPlus className="h-4 w-4" /> Add
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFile} />
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary btn-sm mt-3">
            Upload a photo
          </button>
        </section>

        {error && (
          <p role="alert" className="rounded-2xl bg-blush/30 px-5 py-4 text-sm font-extrabold leading-relaxed text-[#B4486E]">
            {error}
          </p>
        )}

        <div className="card flex gap-3 p-5">
          <button type="submit" disabled={busy} className="btn-accent btn-lg flex-1">
            {busy ? "Saving…" : product ? "Save Changes" : "Create Product"}
          </button>
        </div>
        <p className="px-1 text-xs font-bold leading-relaxed text-ink/40">
          Remember: prices, stock and specifications shown here are sample data until
          you replace them with your confirmed product information.
        </p>
      </div>
    </form>
  );
}
