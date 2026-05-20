/**
 * Drops every table and every enum type in the `public` schema.
 * Destructive — only for development. Cancels itself in production.
 *
 * Usage: npm run db:clean
 */
import postgres from 'postgres'

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Refusing to run db:clean in production.')
  process.exit(1)
}

const url = process.env.DATABASE_URL
if (!url) {
  console.error('❌ DATABASE_URL is not set')
  process.exit(1)
}

const sql = postgres(url, { prepare: false })

async function main() {
  console.log('→ Disabling statement timeout for this session...')
  await sql.unsafe('SET statement_timeout = 0')

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `

  if (tables.length > 0) {
    console.log(`→ Dropping ${tables.length} tables...`)
    for (const { tablename } of tables) {
      process.stdout.write(`  • table  ${tablename}\n`)
      await sql.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`)
    }
  } else {
    console.log('  (no tables found)')
  }

  const types = await sql<{ typname: string }[]>`
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typtype = 'e'
  `

  if (types.length > 0) {
    console.log(`→ Dropping ${types.length} enum types...`)
    for (const { typname } of types) {
      process.stdout.write(`  • enum   ${typname}\n`)
      await sql.unsafe(`DROP TYPE IF EXISTS "${typname}" CASCADE`)
    }
  } else {
    console.log('  (no enum types found)')
  }

  console.log('✅ Database cleaned.')
}

main()
  .catch((err) => {
    console.error('❌ db:clean failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await sql.end()
  })
