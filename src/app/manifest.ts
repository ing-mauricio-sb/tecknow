import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TECKNOW — Tech. Know. Repeat.",
    short_name: "TECKNOW",
    description:
      "Noticias de tecnologia para profesionales de Latinoamerica.",
    start_url: "/",
    display: "standalone",
    background_color: "#080810",
    theme_color: "#7B2FBE",
    icons: [
      { src: "/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
