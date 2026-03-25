import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:nuncarendirse52@db.ererizxttynmfcwgnaep.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        titulo TEXT NOT NULL,
        subtitulo TEXT NOT NULL,
        resumen TEXT[] NOT NULL DEFAULT '{}',
        categoria TEXT NOT NULL REFERENCES categories(slug),
        urgencia TEXT NOT NULL DEFAULT 'normal' CHECK (urgencia IN ('breaking','normal','evergreen')),
        tags TEXT[] NOT NULL DEFAULT '{}',
        fuente_original TEXT NOT NULL,
        imagen_url TEXT,
        published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        reading_time_minutes INTEGER NOT NULL DEFAULT 3,
        cuerpo TEXT NOT NULL,
        por_que_importa TEXT NOT NULL,
        preguntas_chat JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS published_hashes (
        hash TEXT PRIMARY KEY,
        source_url TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        endpoint TEXT NOT NULL UNIQUE,
        keys_p256dh TEXT NOT NULL,
        keys_auth TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_articles_cat_pub ON articles(categoria, published_at DESC);
    `);

    console.log("Tables created successfully");

    // Seed categories
    const categories = [
      { slug: "tech", name: "Tech Breaking", color: "#3B82F6", icon: "Zap", description: "Nuevos lenguajes, frameworks, IA, hardware y las herramientas que mueven la industria." },
      { slug: "finanzas", name: "Finanzas & Mercados", color: "#F59E0B", icon: "TrendingUp", description: "Fusiones, adquisiciones, cripto, bolsa tech y movimientos de capital." },
      { slug: "negocios", name: "Negocios & Empresas", color: "#00BFA5", icon: "Building2", description: "Movimientos corporativos, startups, estrategias y decisiones empresariales." },
      { slug: "global", name: "Impacto Global", color: "#8B5CF6", icon: "Globe", description: "Eventos mundiales que afectan tecnologia, economia y el futuro digital." },
      { slug: "curiosidad", name: "Curiosidad & Ciencia", color: "#EC4899", icon: "FlaskConical", description: "Inventos, investigacion aplicada y descubrimientos que empujan los limites." },
      { slug: "latam", name: "Latam Focus", color: "#10B981", icon: "MapPin", description: "Noticias de Peru y Latinoamerica con impacto directo en el sector tech regional." },
    ];

    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (slug, name, color, icon, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO NOTHING`,
        [cat.slug, cat.name, cat.color, cat.icon, cat.description]
      );
    }

    console.log("Categories seeded (6 categories)");

    await client.query("COMMIT");
    console.log("Seed completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
