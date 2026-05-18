/** Shared between main IPC payloads and renderer. Keep stable for forwards compatibility. */

export type NoteSummaryDto = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type NoteDto = NoteSummaryDto & {
  body: string
}

export type NoteExportResultDto =
  | { status: 'saved'; path: string }
  | { status: 'cancelled' }
  | { status: 'failed'; message: string }

export type NotesCreatePayload = {
  title?: string
  body?: string
}

export type NotesUpdatePayload = {
  title?: string
  body?: string
}
