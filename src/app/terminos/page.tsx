import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos de Uso",
  description: "Terminos y condiciones de uso de TECKNOW.NEWS.",
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
        Terminos de Uso
      </h1>
      <p className="mt-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
        Ultima actualizacion: Marzo 2026
      </p>

      <div className="mt-8 space-y-8 font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--color-text-secondary)]">
        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            1. Aceptacion de los terminos
          </h2>
          <p>
            Al acceder y utilizar TECKNOW.NEWS, aceptas estos terminos de uso
            en su totalidad. Si no estas de acuerdo con alguno de estos
            terminos, no utilices este sitio web.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            2. Contenido del sitio
          </h2>
          <p>
            TECKNOW.NEWS es un portal de noticias de tecnologia que utiliza
            inteligencia artificial para recopilar, filtrar y redactar
            articulos basados en fuentes publicas verificables. El contenido se
            genera automaticamente con supervision editorial.
          </p>
          <p className="mt-3">
            No garantizamos la exactitud, integridad o actualidad de toda la
            informacion publicada. Los articulos son de caracter informativo y
            no constituyen asesoria profesional, financiera ni legal.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            3. Propiedad intelectual
          </h2>
          <p>
            El diseno, logotipo, nombre comercial y estructura de TECKNOW.NEWS
            son propiedad de sus creadores. Los articulos generados por IA se
            basan en fuentes publicas y siempre citan la fuente original.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            4. Uso aceptable
          </h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>No utilices el sitio para actividades ilegales</li>
            <li>No intentes eludir los mecanismos de seguridad</li>
            <li>No realices scraping masivo sin autorizacion</li>
            <li>No hagas clic repetidamente en los anuncios de forma intencional</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            5. Publicidad
          </h2>
          <p>
            Este sitio utiliza Google AdSense para mostrar anuncios. Al
            utilizar el sitio, aceptas la presencia de anuncios y te
            comprometes a no utilizar bloqueadores de publicidad que afecten
            la funcionalidad del sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            6. Limitacion de responsabilidad
          </h2>
          <p>
            TECKNOW.NEWS no sera responsable por danos directos, indirectos,
            incidentales o consecuentes derivados del uso o la imposibilidad
            de uso de este sitio web.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            7. Contacto
          </h2>
          <p>
            Para consultas sobre estos terminos:{" "}
            <strong className="text-[var(--color-text-primary)]">
              contacto@tecknow.news
            </strong>
          </p>
        </section>
      </div>
    </div>
  );
}
