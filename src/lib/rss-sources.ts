export interface RSSSource {
  name: string;
  url: string;
  defaultCategory: string;
}

export const RSS_SOURCES: RSSSource[] = [
  // ── Medios de noticias tech ──
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    defaultCategory: "tech",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    defaultCategory: "tech",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    defaultCategory: "tech",
  },
  {
    name: "Hacker News Top",
    url: "https://hnrss.org/newest?points=100",
    defaultCategory: "tech",
  },
  {
    name: "Rest of World",
    url: "https://restofworld.org/feed/",
    defaultCategory: "latam",
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    defaultCategory: "curiosidad",
  },

  // ── Blogs oficiales — IA y LLMs ──
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    defaultCategory: "tech",
  },
  {
    name: "Anthropic Blog",
    url: "https://www.anthropic.com/feed",
    defaultCategory: "tech",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    defaultCategory: "tech",
  },
  {
    name: "Meta AI Blog",
    url: "https://ai.meta.com/blog/rss/",
    defaultCategory: "tech",
  },

  // ── Blogs oficiales — Plataformas y Cloud ──
  {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    defaultCategory: "tech",
  },
  {
    name: "Vercel Blog",
    url: "https://vercel.com/blog/rss.xml",
    defaultCategory: "tech",
  },
  {
    name: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/rss/",
    defaultCategory: "tech",
  },
  {
    name: "AWS Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    defaultCategory: "negocios",
  },

  // ── Blogs oficiales — Hardware y Grandes Tech ──
  {
    name: "Apple Developer News",
    url: "https://developer.apple.com/news/rss/news.rss",
    defaultCategory: "tech",
  },
  {
    name: "Microsoft Blog",
    url: "https://blogs.microsoft.com/feed/",
    defaultCategory: "negocios",
  },
  {
    name: "NVIDIA Blog",
    url: "https://blogs.nvidia.com/feed/",
    defaultCategory: "tech",
  },
  {
    name: "Spaceflight News",
    url: "https://api.spaceflightnewsapi.net/v4/articles/?format=json&limit=10",
    defaultCategory: "curiosidad",
  },
];
