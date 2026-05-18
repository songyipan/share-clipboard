import 'dotenv/config'

import { defineConfig, env } from 'prisma/config'

if (!process.env['DATABASE_URL']) {
  process.env['DATABASE_URL'] = 'file:./prisma/dev.db'
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL')
  }
})
