import { ElectronAPI } from '@electron-toolkit/preload'

import type {
  NoteDto,
  NoteExportResultDto,
  NoteSummaryDto,
  NotesCreatePayload,
  NotesUpdatePayload
} from '../shared/notes/types'

interface NotesApi {
  list: () => Promise<NoteSummaryDto[]>
  get: (id: string) => Promise<NoteDto | null>
  create: (payload?: NotesCreatePayload) => Promise<NoteDto>
  update: (id: string, payload: NotesUpdatePayload) => Promise<NoteDto | null>
  remove: (id: string) => Promise<boolean>
  exportPdf: (id: string) => Promise<NoteExportResultDto>
  exportDocx: (id: string) => Promise<NoteExportResultDto>
}

interface FloatingBallAPI {
  showFloatingBall: (text: string) => Promise<void>
  hideFloatingBall: () => Promise<void>
  notifyFloatingReady: () => Promise<void>
  getSelectedText: () => Promise<{ success: boolean; text: string; error?: string }>
  showPanel: (type: string) => Promise<void>
  hidePanel: () => Promise<void>
  getCurrentPanelType: () => Promise<string>
  resizePanelWindow: (width: number, height: number) => Promise<void>
  isListenerActive: () => Promise<boolean>
  getCurrentShortcut: () => Promise<string>
  onFloatingBallHidden: (callback: () => void) => () => void
  onSelectionResult: (
    callback: (result: { success: boolean; text: string; error?: string }) => void
  ) => () => void
  onPanelType: (callback: (type: string) => void) => () => void
  resizeFloatingWindow: (width: number, height: number) => Promise<void>
  getLastSelectedText: () => Promise<string>
  openExternal: (url: string) => Promise<void>
  notes: NotesApi
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: FloatingBallAPI
  }
}

export {}
