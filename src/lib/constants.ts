import type { CategorySlug } from "@/types";

export const SITE = {
  name: "TECKNOW",
  tagline: "Tech. Know. Repeat.",
  description:
    "La tech que ya deberias saber. Noticias de tecnologia, finanzas y negocios para ingenieros y profesionales de Latinoamerica.",
  url: "https://www.tecknow.news",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Tech", href: "/categoria/tech" },
  { label: "Finanzas", href: "/categoria/finanzas" },
  { label: "Negocios", href: "/categoria/negocios" },
  { label: "Impacto Global", href: "/categoria/global" },
  { label: "Latam Focus", href: "/categoria/latam" },
  { label: "Curiosidad & Ciencia", href: "/categoria/curiosidad" },
] as const;

export const CATEGORY_CONFIG: Record<
  CategorySlug,
  { color: string; icon: string; label: string }
> = {
  tech: { color: "var(--color-cat-tech)", icon: "Zap", label: "Tech Breaking" },
  finanzas: {
    color: "var(--color-cat-finanzas)",
    icon: "TrendingUp",
    label: "Finanzas & Mercados",
  },
  negocios: {
    color: "var(--color-cat-negocios)",
    icon: "Building2",
    label: "Negocios & Empresas",
  },
  global: {
    color: "var(--color-cat-global)",
    icon: "Globe",
    label: "Impacto Global",
  },
  curiosidad: {
    color: "var(--color-cat-curiosidad)",
    icon: "FlaskConical",
    label: "Curiosidad & Ciencia",
  },
  latam: {
    color: "var(--color-cat-latam)",
    icon: "MapPin",
    label: "Latam Focus",
  },
} as const;
