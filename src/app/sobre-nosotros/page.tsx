import type { Metadata } from "next";
import { Zap, Globe, Bot, Users, Shield, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "TECKNOW.NEWS es el portal de noticias tech para ingenieros y profesionales de Latinoamerica. Conoce nuestro proceso editorial.",
};

export default function SobreNosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
        Sobre TECKNOW
      </h1>
      <p className="mt-3 font-[family-name:var(--font-body)] text-lg italic leading-relaxed text-[var(--color-text-secondary)]">
        Noticias tech con rigor, contexto y relevancia para Latinoamerica.
      </p>

      <div className="mt-10 space-y-10 font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--color-text-secondary)]">
        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Que es TECKNOW
          </h2>
          <p>
            TECKNOW.NEWS es un portal de noticias de tecnologia, finanzas y
            negocios creado para ingenieros, desarrolladores y profesionales
            tech de Latinoamerica. Nuestro equipo editorial selecciona,
            investiga y redacta cada articulo conectando las noticias globales
            con el impacto directo en la region — explicando por que cada
            noticia importa para tu carrera y tu industria.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-xl p-5">
            <BookOpen size={24} className="mb-3 text-[var(--color-cat-tech)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Investigacion multi-fuente
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Cada articulo sintetiza multiples fuentes para ofrecer una vision completa, no solo una traduccion.
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Globe size={24} className="mb-3 text-[var(--color-cat-global)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Contexto Latinoamericano
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Cada articulo incluye analisis de impacto especifico para profesionales de la region.
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Shield size={24} className="mb-3 text-[var(--color-accent-text)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Rigor editorial
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Proceso de curaduria que filtra y evalua noticias de 24+ fuentes confiables antes de publicar.
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Bot size={24} className="mb-3 text-[var(--color-cat-negocios)]" />
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Asistente IA por articulo
            </h3>
            <p className="mt-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              Chatbot con acceso a busqueda web en cada articulo para resolver dudas en tiempo real.
            </p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Nuestra mision
          </h2>
          <p>
            Ser la fuente de informacion tech mas relevante en espanol para
            profesionales de Latinoamerica. Un medio que habla tu idioma
            tecnico, conecta los puntos entre las noticias globales y tu
            carrera, y te permite profundizar con herramientas de IA
            integradas en cada articulo.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Nuestro proceso editorial
          </h2>
          <p>
            TECKNOW monitorea continuamente mas de 24 fuentes de noticias
            internacionales y regionales — incluyendo TechCrunch, The Verge,
            Reuters, Bloomberg Linea, blogs oficiales de OpenAI, Google, Meta,
            y medios latinoamericanos como FayerWayer e iProUP. Cada noticia
            pasa por un proceso de evaluacion de relevancia para nuestro
            publico, investigacion complementaria de multiples fuentes, y
            redaccion editorial en espanol con analisis de impacto regional.
            Solo las noticias que superan nuestro umbral de calidad y relevancia
            son publicadas.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            Fuentes
          </h2>
          <p>
            Monitoreamos medios de tecnologia (TechCrunch, The Verge, Ars Technica,
            MIT Technology Review, Xataka), blogs oficiales de empresas tech
            (OpenAI, Anthropic, Google AI, Meta AI, GitHub, Vercel, Cloudflare,
            AWS, Apple, Microsoft, NVIDIA), medios financieros (Bloomberg Linea,
            iProUP), medios latinoamericanos (FayerWayer, DPL News, Rest of World),
            y APIs de noticias especializadas.
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
