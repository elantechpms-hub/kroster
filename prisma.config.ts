import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
  },
})
