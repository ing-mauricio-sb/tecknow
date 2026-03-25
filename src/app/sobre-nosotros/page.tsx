import type { Metadata } from "next";
import { Zap, Globe, Bot, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "TECKNOW.NEWS es el portal de noticias tech para ingenieros y profesionales de Latinoamerica. Conoce nuestra mision.",
};

export default function SobreNosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
        Sobre TECKNOW
      </h1>
      <p className="mt-3 font-[family-name:var(--font-body)] text-lg italic leading-relaxed text-[var(--color-text-secondary)]">
        El nodo de noticias tech que Latinoamerica necesitaba.
      </p>

      <div className="mt-10 space-y-10 font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--color-text-secondary)]">
        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Que es TECKNOW
          </h2>
          <p>
            TECKNOW.NEWS es un portal de noticias de tecnologia, finanzas y
            negocios diseñado especificamente para ingenieros, desarrolladores y
            profesionales tech de Latinoamerica. Conectamos las noticias
            globales con el impacto local — explicando por que cada noticia te
            importa como profesional de la region.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-xl p-5">
            <Zap size={24} className="mb-3 text-[var(--color-cat-tech)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Velocidad
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Noticias publicadas automaticamente cada 4 horas desde 22+ fuentes globales.
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Bot size={24} className="mb-3 text-[var(--color-accent-text)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              IA Editorial
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Gemini AI filtra, categoriza y redacta cada articulo en español con rigor tecnico.
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Globe size={24} className="mb-3 text-[var(--color-cat-global)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Contexto Latam
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Cada articulo incluye "Por que te importa" — contexto para el profesional latinoamericano.
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Users size={24} className="mb-3 text-[var(--color-cat-negocios)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Para ingenieros
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Lenguaje tecnico-accesible. Sin clickbait. Con chatbot IA por articulo.
            </p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Nuestra mision
          </h2>
          <p>
            Ser la fuente de informacion tech #1 en español para profesionales
            de Latinoamerica. Un medio que habla tu idioma tecnico, conecta los
            puntos entre las noticias globales y tu carrera, y te permite
            resolver dudas al instante con IA.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Como funciona
          </h2>
          <p>
            TECKNOW opera con un agente autonomo que monitorea 22+ fuentes de
            noticias (RSS feeds de TechCrunch, The Verge, Reuters, blogs
            oficiales de OpenAI, Google, Meta, y mas) cada 4 horas. La
            inteligencia artificial de Gemini evalua cada noticia del 1 al 10
            para nuestro publico, y solo publica las mas relevantes — redactadas
            completamente en español con contexto latinoamericano.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Contacto
          </h2>
          <p>
            Email:{" "}
            <strong className="text-[var(--color-text-primary)]">
              contacto@tecknow.news
            </strong>
          </p>
          <p className="mt-1">
            Redes:{" "}
            <a
              href="https://x.com/tecknow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-text)] underline underline-offset-2"
            >
              @tecknow
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
