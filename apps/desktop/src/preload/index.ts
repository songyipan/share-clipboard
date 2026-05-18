import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { IPC_CHANNELS } from '../shared/ipc'
import type {
  NoteDto,
  NoteExportResultDto,
  NoteSummaryDto,
  NotesCreatePayload,
  NotesUpdatePayload
} from '../shared/notes/types'

type SelectionResultPayload = { success: boolean; text: string; error?: string }

// Custom APIs for renderer
const api = {
  // 悬浮球相关
  showFloatingBall: (text: string) => ipcRenderer.invoke(IPC_CHANNELS.FLOATING_SHOW, text),
  hideFloatingBall: () => ipcRenderer.invoke(IPC_CHANNELS.FLOATING_HIDE),
  notifyFloatingReady: () => ipcRenderer.invoke(IPC_CHANNELS.FLOATING_READY),
  getSelectedText: () => ipcRenderer.invoke(IPC_CHANNELS.SELECTION_GET),

  // 面板相关
  showPanel: (type: string) => ipcRenderer.invoke(IPC_CHANNELS.PANEL_SHOW, type),
  hidePanel: () => ipcRenderer.invoke(IPC_CHANNELS.PANEL_HIDE),
  getCurrentPanelType: () => ipcRenderer.invoke(IPC_CHANNELS.PANEL_CURRENT),
  resizePanelWindow: (width: number, height: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.PANEL_RESIZE, width, height),

  // 监听面板类型
  onPanelType: (callback: (type: string) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, type: string): void => {
      console.log('[Preload] panel:type received:', type)
      callback(type)
    }
    ipcRenderer.on(IPC_CHANNELS.PANEL_TYPE, handler)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.PANEL_TYPE, handler)
  },

  // 监听器状态
  isListenerActive: () => ipcRenderer.invoke(IPC_CHANNELS.LISTENER_STATUS),
  getCurrentShortcut: () => ipcRenderer.invoke(IPC_CHANNELS.LISTENER_SHORTCUT),

  // 监听悬浮球隐藏事件
  onFloatingBallHidden: (callback: () => void) => {
    ipcRenderer.on(IPC_CHANNELS.FLOATING_HIDDEN, callback)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.FLOATING_HIDDEN, callback)
  },

  onSelectionResult: (callback: (result: SelectionResultPayload) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, result: SelectionResultPayload): void => {
      callback(result)
    }
    ipcRenderer.on(IPC_CHANNELS.SELECTION_RESULT, handler)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.SELECTION_RESULT, handler)
  },

  // 调整悬浮球窗口大小
  resizeFloatingWindow: (width: number, height: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.FLOATING_RESIZE, width, height),

  // 获取最后一次选中的文本
  getLastSelectedText: () => ipcRenderer.invoke(IPC_CHANNELS.SELECTION_LAST),

  // 打开外部链接
  openExternal: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.EXTERNAL_OPEN, url),

  notes: {
    list: (): Promise<NoteSummaryDto[]> => ipcRenderer.invoke(IPC_CHANNELS.NOTES_LIST),
    get: (id: string): Promise<NoteDto | null> => ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET, id),
    create: (payload?: NotesCreatePayload): Promise<NoteDto> =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTES_CREATE, payload ?? {}),
    update: (id: string, payload: NotesUpdatePayload): Promise<NoteDto | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTES_UPDATE, id, payload),
    remove: (id: string): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.NOTES_DELETE, id),
    exportPdf: (id: string): Promise<NoteExportResultDto> =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTES_EXPORT_PDF, id),
    exportDocx: (id: string): Promise<NoteExportResultDto> =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTES_EXPORT_DOCX, id)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
