import type { CategorySlug } from "./category";

export type ArticleUrgency = "breaking" | "normal" | "evergreen";

export interface ArticleFAQ {
  pregunta: string;
  respuesta: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  resumen: string[];
  categoria: CategorySlug;
  urgencia: ArticleUrgency;
  tags: string[];
  fuenteOriginal: string;
  imagenUrl: string | null;
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface Article extends ArticleSummary {
  cuerpo: string;
  porQueImporta: string;
  preguntasChat: ArticleFAQ[];
}
