import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import {
  createFloatingWindow,
  showFloatingWindow,
  hideFloatingWindow,
  loadFloatingWindowContent,
  getFloatingWindow
} from './floatingWindow'
import {
  startSelectionListener,
  stopSelectionListener,
  getCursorPosition,
  isListenerActive,
  getCurrentShortcut
} from './mouseListener'
import { captureSelection, SelectionResult } from './selection'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
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
    mainWindow.show()
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
}

/**
 * 初始化悬浮球功能
 */
function initializeFloatingBall(): void {
  createFloatingWindow()
  loadFloatingWindowContent()

  startSelectionListener(handleSelectionTrigger)
}

/**
 * 处理划词触发
 */
async function handleSelectionTrigger(): Promise<void> {
  const position = getCursorPosition()
  const result = await captureSelection()

  if (result.success) {
    showFloatingWindow(position.x, position.y)
    notifyRenderer(result)
  }
}

/**
 * 通知渲染进程选中的文本
 */
function notifyRenderer(result: SelectionResult): void {
  const window = BrowserWindow.getAllWindows()[0]
  if (window && !window.isDestroyed()) {
    window.webContents.send('selection:result', result)
  }
}

/**
 * 注册 IPC 处理器
 */
function registerIpcHandlers(): void {
  ipcMain.handle('floating:show', () => {
    const position = getCursorPosition()
    showFloatingWindow(position.x, position.y)
  })

  ipcMain.handle('floating:hide', () => {
    hideFloatingWindow()
  })

  ipcMain.handle('selection:get', async () => {
    return captureSelection()
  })

  ipcMain.handle('listener:status', () => isListenerActive())
  ipcMain.handle('listener:shortcut', () => getCurrentShortcut())

  ipcMain.handle('floating:resize', (_event, width: number, height: number) => {
    const floatingWindow = getFloatingWindow()
    if (floatingWindow && !floatingWindow.isDestroyed()) {
      floatingWindow.setSize(Math.round(width), Math.round(height))
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()
  initializeFloatingBall()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  stopSelectionListener()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
