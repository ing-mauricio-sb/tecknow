export type CategorySlug =
  | "tech"
  | "finanzas"
  | "negocios"
  | "global"
  | "curiosidad"
  | "latam";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  color: string;
  icon: string;
  description: string;
}
