import { shell, ipcMain } from 'electron'
import {
  createFloatingWindow,
  showFloatingWindow,
  hideFloatingWindow,
  loadFloatingWindowContent,
  getFloatingWindow,
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
import {
  startSelectionListener,
  getCursorPosition,
  isListenerActive,
  getCurrentShortcut
} from './mouseListener'
import { captureSelection, SelectionResult } from './selection'
import { IPC_CHANNELS } from '../shared/ipc'

let lastSelectionText = ''
let lastTriggerTime = 0
let isFloatingRendererReady = false
let pendingSelectionResult: SelectionResult | null = null

function initializeFloatingBall(): void {
  createFloatingWindow().webContents.on('did-start-loading', () => {
    isFloatingRendererReady = false
  })
  loadFloatingWindowContent()
  createPanelWindow()
  loadPanelWindowContent()

  setFloatingWindowBlurHandler(() => {
    setTimeout(() => {
      const panelWindow = getPanelWindow()
      const isPanelVisible = panelWindow && !panelWindow.isDestroyed() && panelWindow.isVisible()
      if (!isPanelVisible) {
        hideFloatingWindow()
      }
    }, 300)
  })

  startSelectionListener(handleSelectionTrigger)
}

function sendSelectionResultToPanel(result: SelectionResult): void {
  const panelWindow = getPanelWindow()
  if (!panelWindow || panelWindow.isDestroyed()) return
  panelWindow.webContents.send(IPC_CHANNELS.SELECTION_RESULT, result)
}

async function handleSelectionTrigger(): Promise<void> {
  const now = Date.now()
  const position = getCursorPosition()
  const result = await captureSelection()

  if (result.success) {
    if (now - lastTriggerTime < 300) {
      return
    }
    lastTriggerTime = now

    lastSelectionText = result.text || ''
    sendSelectionResultToPanel(result)
    pendingSelectionResult = result
    showFloatingWindow(position.x, position.y)
    flushPendingSelectionResult()
  }
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
    const position = getCursorPosition()
    showFloatingWindow(position.x, position.y)
  })

  ipcMain.handle(IPC_CHANNELS.SELECTION_LAST, () => lastSelectionText)

  ipcMain.handle(IPC_CHANNELS.FLOATING_HIDE, () => {
    hideFloatingWindow()
  })

  ipcMain.handle(IPC_CHANNELS.FLOATING_READY, () => {
    isFloatingRendererReady = true
    flushPendingSelectionResult()
  })

  ipcMain.handle(IPC_CHANNELS.SELECTION_GET, async () => {
    return captureSelection()
  })

  ipcMain.handle(IPC_CHANNELS.LISTENER_STATUS, () => isListenerActive())
  ipcMain.handle(IPC_CHANNELS.LISTENER_SHORTCUT, () => getCurrentShortcut())

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
      if (lastSelectionText) {
        setTimeout(() => {
          sendSelectionResultToPanel({ success: true, text: lastSelectionText })
        }, 100)
      }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_HIDE, () => {
    hidePanelWindow()
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_CURRENT, () => getCurrentPanelType())
}

export function registerIpcAndStartFloatingBall(): void {
  registerIpcHandlers()
  initializeFloatingBall()
}
