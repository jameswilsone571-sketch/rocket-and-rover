import { asc, desc, eq, and, or, ilike, gte, lte, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, orders, subscribers, messages, siteSettings } from "@/db/schema";

export type ProductWithCategory = typeof products.$inferSelect & {
  categoryName: string;
  categorySlug: string;
};

const productSelect = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  shortDescription: products.shortDescription,
  description: products.description,
  categoryId: products.categoryId,
  priceCents: products.priceCents,
  compareAtPriceCents: products.compareAtPriceCents,
  stockQty: products.stockQty,
  available: products.available,
  isNew: products.isNew,
  isFeatured: products.isFeatured,
  sampleData: products.sampleData,
  images: products.images,
  whatsIncluded: products.whatsIncluded,
  productDetails: products.productDetails,
  keywords: products.keywords,
  createdAt: products.createdAt,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

function joinProducts(where?: SQL) {
  const base = db
    .select(productSelect)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));
  return where ? base.where(where) : base;
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings);
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function getActiveCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(categories.sortOrder);
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function getCategoryBySlug(slug: string) {
  const rows = await db.select().from(categories).where(eq(categories.slug, slug));
  return rows[0] ?? null;
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const rows = await joinProducts(and(eq(products.slug, slug), eq(products.available, true)));
  return rows[0] ?? null;
}

export async function getProductById(id: number): Promise<ProductWithCategory | null> {
  const rows = await joinProducts(eq(products.id, id));
  return rows[0] ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<ProductWithCategory[]> {
  const rows = await joinProducts(
    and(eq(products.isFeatured, true), eq(products.available, true))
  )
    .orderBy(desc(products.createdAt))
    .limit(limit);
  return rows;
}

export async function getRelatedProducts(
  excludeId: number,
  categoryId: number,
  limit = 4
): Promise<ProductWithCategory[]> {
  const same = await joinProducts(
    and(
      eq(products.categoryId, categoryId),
      sql`${products.id} != ${excludeId}`,
      eq(products.available, true)
    )
  ).limit(limit);
  if (same.length >= limit) return same;
  const other = await joinProducts(
    and(sql`${products.categoryId} != ${categoryId}`, eq(products.available, true))
  ).limit(limit - same.length);
  return [...same, ...other];
}

export type ListingParams = {
  q?: string;
  categorySlug?: string;
  price?: string;
  availability?: string;
  isNew?: string;
  sort?: string;
};

export async function listProducts(p: ListingParams): Promise<ProductWithCategory[]> {
  const conditions: SQL[] = [];

  if (p.categorySlug) conditions.push(eq(categories.slug, p.categorySlug));
  if (p.isNew === "1") conditions.push(eq(products.isNew, true));
  if (p.price === "under-20") conditions.push(lte(products.priceCents, 1999));
  if (p.price === "20-30")
    conditions.push(gte(products.priceCents, 2000), lte(products.priceCents, 2999));
  if (p.price === "30-50")
    conditions.push(gte(products.priceCents, 3000), lte(products.priceCents, 4999));
  if (p.price === "over-50") conditions.push(gte(products.priceCents, 5000));
  if (p.availability === "in")
    conditions.push(gte(products.stockQty, 1), eq(products.available, true));
  if (p.availability === "low")
    conditions.push(gte(products.stockQty, 1), lte(products.stockQty, 5));
  if (p.availability === "out")
    conditions.push(or(lte(products.stockQty, 0), eq(products.available, false)) as SQL);

  if (p.q) {
    const like = `%${p.q.trim()}%`;
    conditions.push(
      (or(
        ilike(products.name, like),
        ilike(products.keywords, like),
        ilike(categories.name, like),
        ilike(products.shortDescription, like)
      ) as unknown) as SQL
    );
  }

  const orderBys: SQL[] =
    p.sort === "price-asc"
      ? [asc(products.priceCents)]
      : p.sort === "price-desc"
        ? [desc(products.priceCents)]
        : p.sort === "alpha"
          ? [asc(products.name)]
          : p.sort === "newest"
            ? [desc(products.createdAt)]
            : [desc(products.isFeatured), desc(products.createdAt)];

  return joinProducts(conditions.length ? and(...conditions) : undefined).orderBy(
    ...orderBys
  );
}

export async function getOrders(limit = 20) {
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getOrder(number: string) {
  const rows = await db.select().from(orders).where(eq(orders.orderNumber, number));
  return rows[0] ?? null;
}

export async function getOrdersByCustomer(email: string) {
  return db
    .select()
    .from(orders)
    .where(ilike(orders.email, email))
    .orderBy(desc(orders.createdAt));
}

export async function getSubscribers() {
  return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
}

export async function getMessages() {
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function getStats() {
  const allOrders = await db.select().from(orders);
  const active = allOrders.filter((o) => o.status !== "cancelled");
  const totalSales = active.reduce((sum, o) => sum + o.totalCents, 0);
  const productCount = await db.select({ id: products.id }).from(products);
  const lowStock = await joinProducts(
    and(gte(products.stockQty, 0), lte(products.stockQty, 5), eq(products.available, true))
  );
  const soldOut = await joinProducts(
    or(lte(products.stockQty, 0), eq(products.available, false)) as SQL
  );

  const sales: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const o of allOrders) {
    if (o.status === "cancelled") continue;
    for (const it of (o.items ?? []) as { name?: string; quantity?: number; priceCents?: number }[]) {
      if (!it.name) continue;
      const qty = it.quantity ?? 0;
      const revenue = (it.priceCents ?? 0) * qty;
      if (!sales[it.name]) sales[it.name] = { name: it.name, qty: 0, revenue: 0 };
      sales[it.name].qty += qty;
      sales[it.name].revenue += revenue;
    }
  }
  const bestSellers = Object.values(sales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter((o) => o.status === "pending_payment").length,
    totalSales,
    productCount: productCount.length,
    lowStock,
    soldOut,
    bestSellers,
    recentOrders: allOrders.slice(0, 6),
  };
}

export async function countCategoryProducts(categoryId: number): Promise<number> {
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.categoryId, categoryId));
  return rows.length;
}
