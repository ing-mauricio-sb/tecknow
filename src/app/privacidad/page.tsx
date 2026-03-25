import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Politica de privacidad de TECKNOW.NEWS — como recopilamos, usamos y protegemos tus datos.",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
        Politica de Privacidad
      </h1>
      <p className="mt-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
        Ultima actualizacion: Marzo 2026
      </p>

      <div className="mt-8 space-y-8 font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--color-text-secondary)]">
        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            1. Informacion que recopilamos
          </h2>
          <p>
            TECKNOW.NEWS recopila informacion limitada para mejorar la
            experiencia del usuario. Esto incluye: direccion IP, tipo de
            navegador, paginas visitadas, tiempo de permanencia, y datos de
            interaccion con el sitio. No recopilamos nombres, correos
            electronicos ni datos personales identificables a menos que los
            proporciones voluntariamente (por ejemplo, al suscribirte al
            newsletter).
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            2. Cookies y tecnologias de seguimiento
          </h2>
          <p>
            Utilizamos cookies y tecnologias similares para:
          </p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>Mostrar anuncios personalizados a traves de Google AdSense</li>
            <li>Analizar el trafico y comportamiento de los usuarios</li>
            <li>Mejorar la funcionalidad del sitio</li>
          </ul>
          <p className="mt-3">
            <strong className="text-[var(--color-text-primary)]">
              Publicidad de terceros:
            </strong>{" "}
            Proveedores de publicidad de terceros, incluido Google, utilizan
            cookies para mostrar anuncios basados en las visitas previas del
            usuario a este sitio web u otros sitios web. El uso de cookies de
            publicidad por parte de Google permite a esta y a sus socios
            mostrar anuncios basados en las visitas de los usuarios a este
            sitio y/o a otros sitios de Internet.
          </p>
          <p className="mt-3">
            Los usuarios pueden optar por no recibir publicidad personalizada
            visitando la{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-text)] underline underline-offset-2"
            >
              configuracion de anuncios de Google
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            3. Google AdSense
          </h2>
          <p>
            Este sitio utiliza Google AdSense para mostrar anuncios. Google
            AdSense utiliza cookies (como la cookie DART) para publicar
            anuncios basados en las visitas de los usuarios a este sitio y a
            otros sitios de Internet. Los usuarios pueden inhabilitar el uso de
            la cookie DART visitando la{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-text)] underline underline-offset-2"
            >
              politica de privacidad de publicidad y red de contenido de Google
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            4. Proteccion de datos
          </h2>
          <p>
            Implementamos medidas de seguridad tecnicas y organizativas para
            proteger la informacion recopilada. Los datos se almacenan en
            servidores seguros con encriptacion SSL/TLS.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            5. Derechos del usuario (GDPR / RGPD)
          </h2>
          <p>
            Si te encuentras en la Union Europea, tienes derecho a:
          </p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>Acceder a tus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminacion de tus datos</li>
            <li>Oponerte al procesamiento de tus datos</li>
            <li>Portabilidad de datos</li>
          </ul>
          <p className="mt-3">
            Para ejercer estos derechos, contactanos en{" "}
            <strong className="text-[var(--color-text-primary)]">
              contacto@tecknow.news
            </strong>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            6. Cambios a esta politica
          </h2>
          <p>
            Nos reservamos el derecho de actualizar esta politica en cualquier
            momento. Cualquier cambio sera publicado en esta pagina con la
            fecha de actualizacion correspondiente.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            7. Contacto
          </h2>
          <p>
            Si tienes preguntas sobre esta politica de privacidad, puedes
            contactarnos en{" "}
            <strong className="text-[var(--color-text-primary)]">
              contacto@tecknow.news
            </strong>{" "}
            o a traves de nuestra{" "}
            <a
              href="/contacto"
              className="text-[var(--color-accent-text)] underline underline-offset-2"
            >
              pagina de contacto
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
