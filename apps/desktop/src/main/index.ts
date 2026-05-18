import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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
  getPanelWindow
} from './panelWindow'
import {
  startSelectionListener,
  stopSelectionListener,
  getCursorPosition,
  isListenerActive,
  getCurrentShortcut
} from './mouseListener'
import { captureSelection, SelectionResult } from './selection'
import { createTray, destroyTray } from './tray'
import { IPC_CHANNELS } from '../shared/ipc'

let mainWindow: BrowserWindow | null = null

function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 16 },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

/**
 * 初始化悬浮球功能
 */
function initializeFloatingBall(): void {
  createFloatingWindow()
  loadFloatingWindowContent()
  createPanelWindow()
  loadPanelWindowContent()

  // 设置悬浮球 blur 处理器：当 Panel 可见时不隐藏悬浮球
  setFloatingWindowBlurHandler(() => {
    // 添加延迟，避免窗口刚显示就因为 blur 立即隐藏
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

/**
 * 处理划词触发
 */
let lastSelectionText: string = ''
let lastTriggerTime: number = 0
async function handleSelectionTrigger(): Promise<void> {
  const now = Date.now()
  const position = getCursorPosition()
  const result = await captureSelection()

  if (result.success) {
    // 防止快速重复触发，间隔至少 300ms
    if (now - lastTriggerTime < 300) {
      return
    }
    lastTriggerTime = now

    // 更新最后的选中文本，用于后续操作
    lastSelectionText = result.text || ''
    showFloatingWindow(position.x, position.y)
    notifyRenderer(result)
  }
}

/**
 * 通知悬浮球窗口选中的文本
 */
function notifyRenderer(result: SelectionResult): void {
  const floatingWindow = getFloatingWindow()
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.webContents.send(IPC_CHANNELS.SELECTION_RESULT, result)
  }
}

/**
 * 注册 IPC 处理器
 */
function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.FLOATING_SHOW, () => {
    const position = getCursorPosition()
    showFloatingWindow(position.x, position.y)
  })

  /**
   * 获取最后一次选中的文本
   */
  ipcMain.handle(IPC_CHANNELS.SELECTION_LAST, () => lastSelectionText)

  ipcMain.handle(IPC_CHANNELS.FLOATING_HIDE, () => {
    hideFloatingWindow()
  })

  ipcMain.handle(IPC_CHANNELS.SELECTION_GET, async () => {
    return captureSelection()
  })

  ipcMain.handle(IPC_CHANNELS.LISTENER_STATUS, () => isListenerActive())
  ipcMain.handle(IPC_CHANNELS.LISTENER_SHORTCUT, () => getCurrentShortcut())

  ipcMain.handle(IPC_CHANNELS.FLOATING_RESIZE, (_event, width: number, height: number) => {
    const floatingWindow = getFloatingWindow()
    if (floatingWindow && !floatingWindow.isDestroyed()) {
      floatingWindow.setSize(Math.round(width), Math.round(height))
    }
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_SHOW, (_event, type: string) => {
    console.log('[Main] panel:show received, type:', type)
    const floatingWindow = getFloatingWindow()
    if (floatingWindow && !floatingWindow.isDestroyed() && floatingWindow.isVisible()) {
      const [x, y] = floatingWindow.getPosition()
      showPanelWindow(x, y, type)
    }
  })

  ipcMain.handle(IPC_CHANNELS.PANEL_HIDE, () => {
    hidePanelWindow()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
/**
 * 显示主窗口（用于托盘点击）
 */
function showMainWindow(): void {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()
  } else {
    createWindow()
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // macOS: 隐藏 Dock 图标，只在托盘显示
  if (process.platform === 'darwin' && app.dock) {
    app.dock.hide()
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  // 启动时不创建主窗口，只创建托盘和悬浮球
  initializeFloatingBall()
  createTray(showMainWindow)

  app.on('activate', function () {
    // macOS 点击 Dock 图标时显示主窗口（但 Dock 已隐藏，所以这个不会触发）
    showMainWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  stopSelectionListener()
  destroyTray()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
