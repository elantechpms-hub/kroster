import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

function createAdapter() {
  const config: any = {
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'kroster',
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
  }

  if (process.env.DB_SOCKET) {
    config.socketPath = process.env.DB_SOCKET
  } else {
    config.host = process.env.DB_HOST ?? 'localhost'
    config.port = Number(process.env.DB_PORT ?? 3306)
  }

  return new PrismaMariaDb(config)
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createAdapter(),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
