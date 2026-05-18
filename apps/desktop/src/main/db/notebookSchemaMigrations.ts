import type { PrismaClient } from '../../generated/prisma/client'

const BOOTSTRAP_MIGRATIONS =
  'CREATE TABLE IF NOT EXISTS "_notebook_migrations" ("version" INTEGER NOT NULL PRIMARY KEY);'

const SCHEMA_MIGRATIONS: readonly string[][] = [
  [
    `CREATE TABLE IF NOT EXISTS "notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);`,
    `CREATE INDEX IF NOT EXISTS "notes_updated_at_idx" ON "notes"("updated_at" DESC);`
  ]
]

async function migrationVersion(prisma: PrismaClient): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<Array<{ max_version: number | null }>>(
    'SELECT MAX("version") AS max_version FROM "_notebook_migrations";'
  )
  return rows[0]?.max_version ?? 0
}

async function applyNotebookMigration(prisma: PrismaClient, version: number): Promise<void> {
  const ddl = SCHEMA_MIGRATIONS[version - 1]
  if (!ddl) return
  for (const statement of ddl) {
    await prisma.$executeRawUnsafe(statement)
  }
  await prisma.$executeRawUnsafe(
    `INSERT INTO "_notebook_migrations" ("version") VALUES (${Number(version)});`
  )
}

export async function ensureNotebookSchema(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(BOOTSTRAP_MIGRATIONS)

  let applied = await migrationVersion(prisma)
  const target = SCHEMA_MIGRATIONS.length
  while (applied < target) {
    const next = applied + 1
    await applyNotebookMigration(prisma, next)
    applied = next
  }
}
