import type { MetadataRoute } from "next";
import { getActiveCategories, listProducts } from "@/lib/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rocketandrover.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    listProducts({}),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/account`, changeFrequency: "never", priority: 0.3 },
    { url: `${BASE_URL}/policies/shipping`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/policies/returns`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/policies/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/policies/terms`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/shop/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
