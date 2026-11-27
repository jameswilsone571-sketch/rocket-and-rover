import { getSettings, getAllCategories } from "@/lib/queries";
import { ContentClient } from "@/components/admin/ContentClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content & Pages" };

export default async function AdminContent() {
  const [settings, categories] = await Promise.all([getSettings(), getAllCategories()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">Content &amp; Pages</h1>
        <p className="mt-1 font-bold text-ink/50">
          Update your announcement, contact details, shipping settings and product
          categories — no code needed.
        </p>
      </div>
      <ContentClient
        settings={settings}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          sortOrder: c.sortOrder,
          active: c.active,
        }))}
      />
    </div>
  );
}
