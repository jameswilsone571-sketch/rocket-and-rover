"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSettings, saveCategory, deleteCategory, type CategoryInput } from "@/actions/admin";
import { IconCheck, IconPlus, IconTrash } from "@/components/Icons";

type Settings = Record<string, string>;
type Cat = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  active: boolean;
};

export function ContentClient({ settings, categories }: { settings: Settings; categories: Cat[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    announcement: settings.announcement ?? "Welcome to Rocket & Rover — Big Adventures for Little Explorers!",
    contact_email: settings.contact_email ?? "hello@rocketandrover.com.au",
    contact_phone: settings.contact_phone ?? "To be confirmed",
    contact_address: settings.contact_address ?? "Somewhere in Australia — address to be confirmed",
    instagram: settings.instagram ?? "",
    shippingRate: ((parseInt(settings.shippingRateCents ?? "995", 10) / 100).toFixed(2)),
    freeShipThreshold: (
      (parseInt(settings.freeShipThresholdCents ?? "0", 10) / 100).toFixed(2)
    ),
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await saveSettings({
      announcement: form.announcement,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      contact_address: form.contact_address,
      instagram: form.instagram,
      shippingRateCents: String(Math.round(parseFloat(form.shippingRate || "0") * 100)),
      freeShipThresholdCents: String(Math.round(parseFloat(form.freeShipThreshold || "0") * 100)),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError(res.error ?? "Couldn't save.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form onSubmit={handleSave} className="card h-fit p-6">
        <h2 className="font-display text-lg font-semibold text-navy">Store settings</h2>

        <label className="label mt-5" htmlFor="cs-announcement">
          Announcement bar (top of site)
        </label>
        <textarea
          id="cs-announcement"
          className="input min-h-16"
          value={form.announcement}
          onChange={(e) => set("announcement", e.target.value)}
        />
        <p className="mt-1 text-xs font-bold text-ink/40">
          Keep it friendly — avoid inventing discounts or promotions.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="cs-email">Contact email</label>
            <input id="cs-email" className="input" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="cs-phone">Phone</label>
            <input id="cs-phone" className="input" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="cs-address">Business address</label>
            <input id="cs-address" className="input" value={form.contact_address} onChange={(e) => set("contact_address", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="cs-insta">Instagram URL (leave blank if not ready)</label>
            <input id="cs-insta" className="input" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/rocketandrover" />
          </div>
        </div>

        <h3 className="mt-7 font-display text-base font-semibold text-navy">Shipping (placeholder rates)</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="cs-rate">Standard shipping rate (AUD)</label>
            <input id="cs-rate" inputMode="decimal" className="input" value={form.shippingRate} onChange={(e) => set("shippingRate", e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="cs-freeship">Free shipping over (AUD, 0 = off)</label>
            <input id="cs-freeship" inputMode="decimal" className="input" value={form.freeShipThreshold} onChange={(e) => set("freeShipThreshold", e.target.value)} />
          </div>
        </div>
        <p className="mt-1 text-xs font-bold text-ink/40">
          These rates are clearly marked as samples in checkout until you set your
          real ones here.
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-blush/30 px-4 py-3 text-sm font-extrabold text-[#B4486E]">
            {error}
          </p>
        )}
        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={busy} className="btn-accent btn-lg">
            {busy ? "Saving…" : "Save Settings"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#1E8578]">
              <IconCheck className="h-4.5 w-4.5" /> Saved!
            </span>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-navy">
          Product categories ({categories.length})
        </h2>
        {categories.map((c) => (
          <CategoryEditor key={c.id} category={c} />
        ))}
        <AddCategory nextOrder={categories.length + 1} />
      </div>
    </div>
  );
}

function CategoryEditor({ category }: { category: Cat }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: category.name,
    description: category.description,
    image: category.image,
    sortOrder: String(category.sortOrder),
    active: category.active,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await saveCategory({
      id: category.id,
      name: form.name,
      slug: category.slug,
      description: form.description,
      image: form.image,
      sortOrder: parseInt(form.sortOrder || "0", 10),
      active: form.active,
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
      setOpen(false);
    } else setError(res.error ?? "Couldn't save.");
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-sky/50">
          <img src={category.image} alt="" className="h-full w-full object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold text-navy">{category.name}</p>
          <p className="truncate text-xs font-bold text-ink/45">/{category.slug}</p>
        </div>
        {form.active ? (
          <span className="chip bg-turq/20 text-[#1E8578]">Live</span>
        ) : (
          <span className="chip bg-navy/10 text-navy/60">Hidden</span>
        )}
        <span className="chip bg-navy/5 text-navy/50">#{category.sortOrder}</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="btn-ghost btn-sm"
          aria-expanded={open}
        >
          {open ? "Close" : "Edit"}
        </button>
        <DeleteCategoryButton id={category.id} />
      </div>
      {open && (
        <form onSubmit={save} className="space-y-4 border-t border-navy/8 px-5 py-5">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Short description</label>
            <textarea className="input min-h-16" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Sort order</label>
              <input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm font-extrabold text-navy">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4.5 w-4.5 accent-cosmic"
              />
              Visible in store
            </label>
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-blush/30 px-4 py-2.5 text-xs font-extrabold text-[#B4486E]">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-primary btn-sm">
            {busy ? "Saving…" : "Save Category"}
          </button>
        </form>
      )}
    </div>
  );
}

function AddCategory({ nextOrder }: { nextOrder: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CategoryInput>({
    name: "",
    slug: "",
    description: "",
    image: "/images/products/painting-kit.svg",
    sortOrder: nextOrder,
    active: true,
  });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await saveCategory(form);
    setBusy(false);
    if (res.ok) {
      setForm((f) => ({ ...f, name: "", slug: "", description: "" }));
      router.refresh();
    } else setError(res.error ?? "Couldn't add.");
  }

  return (
    <form onSubmit={add} className="card space-y-4 p-5">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-navy">
        <IconPlus className="h-4.5 w-4.5 text-cosmic" /> Add a new category
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="input"
          placeholder="Category name *"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          aria-label="New category name"
        />
        <input
          className="input"
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          aria-label="New category slug"
        />
      </div>
      <textarea
        className="input min-h-14"
        placeholder="Short description"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        aria-label="New category description"
      />
      <input
        className="input"
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
        aria-label="New category image URL"
      />
      {error && (
        <p role="alert" className="rounded-xl bg-blush/30 px-4 py-2.5 text-xs font-extrabold text-[#B4486E]">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy || !form.name.trim()} className="btn-primary btn-sm">
        {busy ? "Adding…" : "Add Category"}
      </button>
    </form>
  );
}

export function DeleteCategoryButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <button
        onClick={async () => {
          if (!window.confirm("Delete this category?")) return;
          setBusy(true);
          setError("");
          const res = await deleteCategory(id);
          setBusy(false);
          if (!res.ok) setError(res.error ?? "Couldn't delete.");
          else router.refresh();
        }}
        disabled={busy}
        className="rounded-full p-2 text-navy/40 hover:bg-blush/30 hover:text-[#B4486E]"
        aria-label="Delete category"
      >
        <IconTrash className="h-4.5 w-4.5" />
      </button>
      {error && <p className="text-xs font-extrabold text-[#B4486E]">{error}</p>}
    </>
  );
}
