/**
 * One-off, additive-only migration: creates the lead enums + table if missing.
 * Run with: npx tsx --env-file=.env.local drizzle/add-lead-table.ts
 */
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

const sql = postgres(url, { prepare: false })

async function main() {
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE TYPE "lead_source" AS ENUM ('ai-check', 'contact');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "lead_sector" AS ENUM ('services', 'manufacturing', 'retail', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "lead_employee_band" AS ENUM ('micro', 'small', 'medium', 'large');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "lead_status" AS ENUM ('new', 'contacted', 'closed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "lead" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "company" text,
      "sector" "lead_sector",
      "employees" "lead_employee_band",
      "score" integer,
      "answers" text,
      "locale" text,
      "source" "lead_source" NOT NULL DEFAULT 'ai-check',
      "status" "lead_status" NOT NULL DEFAULT 'new',
      "created_at" timestamp NOT NULL DEFAULT now()
    );

    ALTER TABLE "lead" ADD COLUMN IF NOT EXISTS "status" "lead_status" NOT NULL DEFAULT 'new';
  `)
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM "lead"`
  console.log(`lead table ready (rows: ${count})`)
  await sql.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
