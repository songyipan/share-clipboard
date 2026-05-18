import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../generated/prisma/client'
import { app } from 'electron'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { ensureNotebookSchema } from './notebookSchemaMigrations'

let prisma: PrismaClient | undefined

export function getNotebookDatabaseFilePath(): string {
  return join(app.getPath('userData'), 'notebook.db')
}

export async function getNotebookPrisma(): Promise<PrismaClient> {
  if (!prisma) {
    const filePath = getNotebookDatabaseFilePath()
    mkdirSync(dirname(filePath), { recursive: true })
    // Prisma adapter strips only /^file:/; pathToFileURL yields file:///abc → ///abc → invalid path for better-sqlite3
    const url = `file:${filePath}`
    const adapter = new PrismaBetterSqlite3({ url })
    prisma = new PrismaClient({ adapter })
    await ensureNotebookSchema(prisma)
  }
  return prisma
}

export async function disconnectNotebookPrisma(): Promise<void> {
  await prisma?.$disconnect()
  prisma = undefined
}
