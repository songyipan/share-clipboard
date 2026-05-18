import type { NoteDto, NoteSummaryDto } from '../../shared/notes/types'
import { getNotebookPrisma } from '../db/notebookPrisma'
import { titleOrDefault } from './noteTitles'

function serializeNote<T extends { createdAt: Date; updatedAt: Date }>(
  row: T & { id: string; title: string; body: string }
): NoteDto {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  }
}

function serializeSummary(row: {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}): NoteSummaryDto {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  }
}

export async function listNoteSummaries(): Promise<NoteSummaryDto[]> {
  const prisma = await getNotebookPrisma()
  const rows = await prisma.note.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, createdAt: true, updatedAt: true }
  })
  return rows.map(serializeSummary)
}

export async function getNoteById(id: string): Promise<NoteDto | null> {
  const prisma = await getNotebookPrisma()
  const row = await prisma.note.findUnique({ where: { id } })
  return row ? serializeNote(row) : null
}

interface CreateNoteInput {
  title?: string
  body?: string
}

export async function createNote(input: CreateNoteInput = {}): Promise<NoteDto> {
  const prisma = await getNotebookPrisma()
  const body = input.body ?? ''
  const title = titleOrDefault(input.title, body)

  const row = await prisma.note.create({
    data: { title, body }
  })
  return serializeNote(row)
}

interface UpdateNoteInput {
  title?: string
  body?: string
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<NoteDto | null> {
  const prisma = await getNotebookPrisma()
  const existing = await prisma.note.findUnique({ where: { id } })
  if (!existing) return null

  const body = input.body !== undefined ? input.body : existing.body
  const title = input.title !== undefined ? titleOrDefault(input.title, body) : existing.title

  const row = await prisma.note.update({
    where: { id },
    data: { title, body }
  })
  return serializeNote(row)
}

export async function deleteNote(id: string): Promise<boolean> {
  const prisma = await getNotebookPrisma()
  try {
    await prisma.note.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
