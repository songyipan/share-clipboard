import { shell, ipcMain } from 'electron'
import {
  createFloatingWindow,
  hideFloatingWindow,
  loadFloatingWindowContent,
  getFloatingWindow,
  getFloatingWindowShownAt,
  setFloatingWindowBlurHandler
} from './floatingWindow'
import {
  createPanelWindow,
  showPanelWindow,
  hidePanelWindow,
  loadPanelWindowContent,
  getPanelWindow,
  getCurrentPanelType
} from './panelWindow'
import { getCursorPosition } from './mouseListener'
import {
  getAppPreferences,
  getConfiguredShortcut,
  initSelectionListenerManager,
  isSelectionListenerActive,
  updateAppPreferences,
  reapplySelectionListeners
} from './selectionListenerManager'
import { captureSelection, type SelectionResult } from './selection'
import { createSelectionTriggerFlow } from './selectionTriggerFlow'
import { IPC_CHANNELS } from '../shared/ipc'
import { bootstrapNotebookSubsystem } from './notes/notebookSubsystem'
import {
  getSystemPermissionStatus,
  openSystemPermissionSettings,
  requestSystemPermission
} from './systemPermission'

let isFloatingRendererReady = false
let pendingSelectionResult: SelectionResult | null = null

const selectionFlow = createSelectionTriggerFlow({
  sendSelectionResultToPanel: (result) => sendSelectionResultToPanel(result),
  onSelectionCaptured: (result) => {
    pendingSelectionResult = result
    flushPendingSelectionResult()
  }
})

function initializeFloatingBall(): void {
  createFloatingWindow().webContents.on('did-start-loading', () => {
    isFloatingRendererReady = false
  })
  loadFloatingWindowContent()
  createPanelWindow()
  loadPanelWindowContent()

  setFloatingWindowBlurHandler(() => {
    const blurAt = Date.now()
    // showInactive + focusable:false 在部分系统上会立刻产生 blur，避免刚显示就被关掉
    if (blurAt - getFloatingWindowShownAt() < 150) {
      return
    }
    setTimeout(() => {
      const panelWindow = getPanelWindow()
      const isPanelVisible = panelWindow && !panelWindow.isDestroyed() && panelWindow.isVisible()
      if (!isPanelVisible) {
        hideFloatingWindow()
      }
    }, 300)
  })

  initSelectionListenerManager((source, position) =>
    selectionFlow.handleSelectionTrigger(source, position)
  )
}

function sendSelectionResultToPanel(result: SelectionResult): void {
  const panelWindow = getPanelWindow()
  if (!panelWindow || panelWindow.isDestroyed()) return
  panelWindow.webContents.send(IPC_CHANNELS.SELECTION_RESULT, result)
}

function notifyRenderer(result: SelectionResult): boolean {
  const floatingWindow = getFloatingWindow()
  if (!floatingWindow || floatingWindow.isDestroyed() || !isFloatingRendererReady) {
    return false
  }

  floatingWindow.webContents.send(IPC_CHANNELS.SELECTION_RESULT, result)
  return true
}

function flushPendingSelectionResult(): void {
  if (!pendingSelectionResult) return
  if (notifyRenderer(pendingSelectionResult)) {
    pendingSelectionResult = null
  }
}

function assertOpenableExternalUrl(url: string): string {
  const parsedUrl = new URL(url)
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error('Only http and https URLs can be opened externally')
  }
  return parsedUrl.toString()
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.FLOATING_SHOW, () => {
    void selectionFlow.handleSelectionTrigger('shortcut', getCursorPosition())
  })

  ipcMain.handle(IPC_CHANNELS.SELECTION_LAST, () => selectionFlow.getLastSelectionText())

  ipcMain.handle(IPC_CHANNELS.FLOATING_HIDE, () => {
    hideFloatingWindow()
  })

  ipcMain.handle(IPC_CHANNELS.FLOATING_READY, (event) => {
    const floatingWin = getFloatingWindow()
    if (!floatingWin || floatingWin.isDestroyed()) return
    if (event.sender !== floatingWin.webContents) return
    isFloatingRendererReady = true
    flushPendingSelectionResult()
  })

  ipcMain.handle(IPC_CHANNELS.SELECTION_GET, async () => {
    return captureSelection()
  })

  ipcMain.handle(IPC_CHANNELS.LISTENER_STATUS, () => isSelectionListenerActive())
  ipcMain.handle(IPC_CHANNELS.LISTENER_SHORTCUT, () => getConfiguredShortcut())
  ipcMain.handle(IPC_CHANNELS.PREFERENCES_GET, () => getAppPreferences())
  ipcMain.handle(IPC_CHANNELS.PREFERENCES_SET, (_event, patch) => updateAppPreferences(patch))
  ipcMain.handle(IPC_CHANNELS.PERMISSION_STATUS, () => getSystemPermissionStatus())
  ipcMain.handle(IPC_CHANNELS.PERMISSION_REQUEST, () => {
    const status = requestSystemPermission()
    if (status.granted) reapplySelectionListeners()
    return status
  })
  ipcMain.handle(IPC_CHANNELS.PERMISSION_OPEN_SETTINGS, async () => {
    await openSystemPermissionSettings()
    const status = getSystemPermissionStatus()
    if (status.granted) reapplySelectionListeners()
    return status
  })

  ipcMain.handle(IPC_CHANNELS.EXTERNAL_OPEN, async (_event, url: string) => {
    await shell.openExternal(assertOpenableExternalUrl(url))
  })

  ipcMain.handle(IPC_CHANNELS.FLOATING_RESIZE, (_event, width: number, height: number) => {
    const floatingWindow = getFloatingWindow()
    if (floatingWindow && !floatingWindow.isDestroyed()) {
      floatingWindow.setSize(Math.round(width), Math.round(height))
    }
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_RESIZE, (_event, width: number, height: number) => {
    const panelWindow = getPanelWindow()
    if (panelWindow && !panelWindow.isDestroyed()) {
      panelWindow.setSize(Math.round(width), Math.round(height))
    }
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_SHOW, (_event, type: string) => {
    console.log('[Main] panel:show received, type:', type)
    const floatingWindow = getFloatingWindow()
    if (floatingWindow && !floatingWindow.isDestroyed() && floatingWindow.isVisible()) {
      const [x, y] = floatingWindow.getPosition()
      showPanelWindow(x, y, type)
      const text = selectionFlow.getLastSelectionText()
      if (text) {
        setTimeout(() => {
          sendSelectionResultToPanel({ success: true, text })
        }, 100)
      }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_HIDE, () => {
    hidePanelWindow()
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_CURRENT, () => getCurrentPanelType())
}

export async function registerIpcAndStartFloatingBall(): Promise<void> {
  await bootstrapNotebookSubsystem()
  registerIpcHandlers()
  initializeFloatingBall()
}
