import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

export default defineConfig({
  schema: './lib/models/**/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
