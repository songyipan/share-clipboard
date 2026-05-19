import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { disconnectNotebookPrisma } from './db/notebookPrisma'
import { stopAutoSelectionListener } from './autoSelectionListener'
import { stopShortcutListener } from './shortcutListener'
import { createTray, destroyTray } from './tray'
import { registerIpcAndStartFloatingBall } from './floatingSelectionSetup'

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

function stopAllSelectionListeners(): void {
  stopAutoSelectionListener()
  stopShortcutListener()
}

app.on('will-quit', () => {
  stopAllSelectionListeners()
  void disconnectNotebookPrisma()
})

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  if (process.platform === 'darwin' && app.dock) {
    app.dock.hide()
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await registerIpcAndStartFloatingBall()
  createTray(showMainWindow)

  app.on('activate', function () {
    showMainWindow()
  })
})

app.on('window-all-closed', () => {
  stopAllSelectionListeners()
  destroyTray()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
