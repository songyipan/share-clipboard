import type { NoteSummaryDto } from '../../../../shared/notes/types'

export interface NotebookWorkspaceHandlers {
  notes: NoteSummaryDto[]
  activeId: string | null
  draftTitle: string
  draftBody: string
  saving: boolean
  selectNote: (id: string | null) => Promise<void>
  changeDraftTitle: (title: string) => void
  changeDraftBody: (body: string) => void
  addNote: (initialBody?: string) => Promise<void>
  removeActiveNote: () => Promise<boolean>
  refreshNotes: () => Promise<void>
  flushNow: () => Promise<void>
}
