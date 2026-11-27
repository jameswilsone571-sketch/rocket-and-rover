"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  products,
  categories,
  orders,
  messages,
  siteSettings,
} from "@/db/schema";
import { slugify, ORDER_STATUSES } from "@/lib/format";
import { countCategoryProducts } from "@/lib/queries";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE ?? "rover-2026";
const COOKIE = "rr_admin";

export async function adminLogin(passcode: string): Promise<{ ok: boolean; error?: string }> {
  if (passcode.trim() !== ADMIN_PASSCODE) {
    return { ok: false, error: "Incorrect passcode. Please try again." };
  }
  const jar = await cookies();
  jar.set(COOKIE, "active", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  const root = slugify(base) || `item-${Date.now()}`;
  let slug = root;
  for (let i = 0; i < 50; i++) {
    const rows = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug));
    if (rows.length === 0 || (ignoreId && rows[0].id === ignoreId)) return slug;
    slug = `${root}-${i + 1}`;
  }
  return `${root}-${Date.now()}`;
}

export type ProductInput = {
  id?: number;
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

export async function saveProduct(
  input: ProductInput
): Promise<{ ok: boolean; error?: string; id?: number }> {
  try {
    const name = input.name.trim();
    if (!name) return { ok: false, error: "Product name is required." };
    if (!(input.priceCents > 0)) return { ok: false, error: "Please set a valid price." };
    if (!input.categoryId) return { ok: false, error: "Please choose a category." };
    const images = input.images.length ? input.images : ["/images/products/painting-kit.svg"];
    const values = {
      name,
      categoryId: input.categoryId,
      priceCents: input.priceCents,
      compareAtPriceCents: input.compareAtPriceCents,
      stockQty: Math.max(0, Math.floor(input.stockQty)),
      available: input.available,
      isNew: input.isNew,
      isFeatured: input.isFeatured,
      sampleData: input.sampleData,
      shortDescription: input.shortDescription,
      description: input.description,
      whatsIncluded: input.whatsIncluded,
      productDetails: input.productDetails,
      keywords: input.keywords,
      images,
    };

    if (input.id) {
      await db.update(products).set(values).where(eq(products.id, input.id));
      revalidatePath("/", "layout");
      return { ok: true, id: input.id };
    }

    const slug = await uniqueSlug(input.slug || name);
    const rows = await db.insert(products).values({ ...values, slug }).returning({ id: products.id });
    revalidatePath("/", "layout");
    return { ok: true, id: rows[0]?.id };
  } catch (e) {
    return { ok: false, error: `Couldn't save the product. ${String(e)}` };
  }
}

export async function deleteProduct(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't delete the product." };
  }
}

export async function setOrderStatus(
  id: number,
  status: string
): Promise<{ ok: boolean; error?: string }> {
  if (!ORDER_STATUSES.some((s) => s.value === status)) {
    return { ok: false, error: "Unknown status." };
  }
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't update the order." };
  }
}

export async function saveSettings(
  record: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  try {
    for (const [key, value] of Object.entries(record)) {
      if (!key) continue;
      await db
        .insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
    }
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't save settings." };
  }
}

export type CategoryInput = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  active: boolean;
};

export async function saveCategory(
  input: CategoryInput
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!input.name.trim()) return { ok: false, error: "Category name is required." };
    if (input.id) {
      await db
        .update(categories)
        .set({
          name: input.name,
          description: input.description,
          image: input.image,
          sortOrder: input.sortOrder,
          active: input.active,
        })
        .where(eq(categories.id, input.id));
    } else {
      const slug = await uniqueSlug(input.slug || input.name);
      await db.insert(categories).values({
        name: input.name,
        slug,
        description: input.description,
        image: input.image || "/images/products/painting-kit.svg",
        sortOrder: input.sortOrder,
        active: input.active,
      });
    }
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't save the category." };
  }
}

export async function deleteCategory(id: number): Promise<{ ok: boolean; error?: string }> {
  const count = await countCategoryProducts(id);
  if (count > 0) {
    return {
      ok: false,
      error: `This category still has ${count} product(s). Move or delete them first, or simply hide it instead.`,
    };
  }
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't delete the category." };
  }
}

export async function markMessageRead(id: number): Promise<{ ok: boolean }> {
  await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  return { ok: true };
}
