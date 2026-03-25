import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import { NotificationPrompt } from "@/components/layout/NotificationPrompt";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AdblockWall } from "@/components/layout/AdblockWall";
import { OrganizationJsonLd } from "@/components/seo/ArticleJsonLd";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  title: {
    default: "TECKNOW — Noticias de Tecnologia, Economia y Negocios | Latinoamerica",
    template: "%s | TECKNOW",
  },
  description:
    "Noticias de tecnologia, economia, finanzas y negocios para ingenieros y profesionales de Latinoamerica. IA, startups, regulacion tech y mas. Actualizado cada 4 horas.",
  metadataBase: new URL("https://tecknow.news"),
  keywords: [
    "noticias de tecnologia",
    "noticias tech",
    "noticias de economia",
    "noticias recientes",
    "noticias del mundo",
    "tecnologia latinoamerica",
    "inteligencia artificial noticias",
    "fintech latam",
    "startups latinoamerica",
    "noticias de negocios",
    "noticias de ciencia",
    "criptomonedas noticias",
  ],
  authors: [{ name: "TECKNOW", url: "https://tecknow.news" }],
  creator: "TECKNOW",
  publisher: "TECKNOW",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://tecknow.news",
    types: { "application/rss+xml": "https://tecknow.news/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://tecknow.news",
    siteName: "TECKNOW",
    title: "TECKNOW — Noticias de Tecnologia para Latinoamerica",
    description:
      "Noticias de tecnologia, economia, finanzas y negocios. Actualizado con IA cada 4 horas.",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "TECKNOW — Tech. Know. Repeat.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tecknow",
    creator: "@tecknow",
  },
};

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${fraunces.variable} ${ibmPlexMono.variable} ${plusJakarta.variable}`}
    >
      <body className="grain-overlay">
        <OrganizationJsonLd />
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <NotificationPrompt />
        <CookieConsent />
        <AdblockWall />
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
