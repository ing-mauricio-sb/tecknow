import { query } from "@/lib/db";
import type { Category, CategorySlug } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const rows = await query("SELECT * FROM categories ORDER BY slug");
  return rows.map((row) => ({
    id: String(row.id),
    slug: row.slug as CategorySlug,
    name: String(row.name),
    color: String(row.color),
    icon: String(row.icon),
    description: String(row.description),
  }));
}

export async function getCategoryBySlug(
  slug: CategorySlug
): Promise<Category | null> {
  const rows = await query("SELECT * FROM categories WHERE slug = $1 LIMIT 1", [slug]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: String(row.id),
    slug: row.slug as CategorySlug,
    name: String(row.name),
    color: String(row.color),
    icon: String(row.icon),
    description: String(row.description),
  };
}
