import { ipcMain } from 'electron'

import { getNotebookPrisma } from '../db/notebookPrisma'
import { IPC_CHANNELS } from '../../shared/ipc'
import type {
  NoteExportResultDto,
  NotesCreatePayload,
  NotesUpdatePayload
} from '../../shared/notes/types'
import type { NoteExportDocxResult } from './noteExportDocx'
import type { NoteExportPdfResult } from './noteExportPdf'
import { exportNoteDocx } from './noteExportDocx'
import { exportNotePdf } from './noteExportPdf'
import {
  createNote,
  deleteNote,
  getNoteById,
  listNoteSummaries,
  updateNote
} from './noteOperations'

function pdfToDto(result: NoteExportPdfResult): NoteExportResultDto {
  if (result.status === 'saved') return { status: 'saved', path: result.path }
  if (result.status === 'cancelled') return { status: 'cancelled' }
  return { status: 'failed', message: result.message }
}

function docxToDto(result: NoteExportDocxResult): NoteExportResultDto {
  if (result.status === 'saved') return { status: 'saved', path: result.path }
  if (result.status === 'cancelled') return { status: 'cancelled' }
  return { status: 'failed', message: result.message }
}

export async function bootstrapNotebookSubsystem(): Promise<void> {
  await getNotebookPrisma()

  ipcMain.handle(IPC_CHANNELS.NOTES_LIST, () => listNoteSummaries())
  ipcMain.handle(IPC_CHANNELS.NOTES_GET, (_evt, id: string) => getNoteById(id))
  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, (_evt, payload?: NotesCreatePayload) =>
    createNote(payload ?? {})
  )
  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, (_evt, id: string, payload: NotesUpdatePayload) =>
    updateNote(id, payload)
  )
  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, (_evt, id: string) => deleteNote(id))
  ipcMain.handle(IPC_CHANNELS.NOTES_EXPORT_PDF, (_evt, id: string) => exportPdfForNote(id))
  ipcMain.handle(IPC_CHANNELS.NOTES_EXPORT_DOCX, (_evt, id: string) => exportDocxForNote(id))
}

async function exportPdfForNote(noteId: string): Promise<NoteExportResultDto> {
  const note = await getNoteById(noteId)
  if (!note) return { status: 'failed', message: 'Note not found' }
  return pdfToDto(await exportNotePdf(note))
}

async function exportDocxForNote(noteId: string): Promise<NoteExportResultDto> {
  const note = await getNoteById(noteId)
  if (!note) return { status: 'failed', message: 'Note not found' }
  return docxToDto(await exportNoteDocx(note))
}
