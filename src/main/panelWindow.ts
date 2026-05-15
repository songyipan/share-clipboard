import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { IPC_CHANNELS } from './utils/platform'

let panelWindow: BrowserWindow | null = null

/**
 * 创建面板窗口
 */
export function createPanelWindow(): BrowserWindow {
  if (panelWindow) {
    return panelWindow
  }

  panelWindow = new BrowserWindow({
    width: 420,
    height: 440,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 12 },
    transparent: false,
    backgroundColor: '#ffffff',
    alwaysOnTop: true,
    show: false,
    hasShadow: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  panelWindow.on('closed', () => {
    panelWindow = null
  })

  return panelWindow
}

/**
 * 获取面板窗口实例
 */
export function getPanelWindow(): BrowserWindow | null {
  return panelWindow
}

/**
 * 显示面板在悬浮球右侧
 */
export function showPanelWindow(
  floatingX: number,
  floatingY: number,
  type: string = 'search'
): void {
  if (!panelWindow || panelWindow.isDestroyed()) {
    panelWindow = createPanelWindow()
    loadPanelWindowContent()
  }

  const panelWidth = panelWindow.getSize()[0]
  const gap = 8

  const bounds = safePosition(floatingX + panelWidth + gap, floatingY)
  panelWindow.setPosition(bounds.x, bounds.y)

  // 确保 webContents 准备好后发送 IPC
  console.log(
    '[PanelWindow] showPanelWindow called, type:',
    type,
    'isLoading:',
    panelWindow.webContents.isLoading()
  )
  if (panelWindow.webContents.isLoading()) {
    panelWindow.webContents.once('did-finish-load', () => {
      console.log('[PanelWindow] did-finish-load, sending IPC with type:', type)
      panelWindow?.webContents.send(IPC_CHANNELS.PANEL_TYPE, type)
    })
  } else {
    console.log('[PanelWindow] sending IPC immediately with type:', type)
    panelWindow.webContents.send(IPC_CHANNELS.PANEL_TYPE, type)
  }

  panelWindow.show()
}

/**
 * 隐藏面板窗口
 */
export function hidePanelWindow(): void {
  if (panelWindow && !panelWindow.isDestroyed()) {
    panelWindow.hide()
  }
}

/**
 * 计算安全的窗口位置，确保不超出屏幕边界
 */
function safePosition(x: number, y: number): { x: number; y: number } {
  const windowWidth = panelWindow?.getSize()[0] ?? 320
  const windowHeight = panelWindow?.getSize()[1] ?? 240
  const padding = 10

  const display = screen.getDisplayNearestPoint({ x, y })
  const { width, height } = display.workAreaSize

  const safeX = Math.min(Math.max(x, padding), width - windowWidth - padding)
  const safeY = Math.min(Math.max(y, padding), height - windowHeight - padding)

  return { x: safeX, y: safeY }
}

/**
 * 加载面板窗口内容
 */
export function loadPanelWindowContent(): void {
  if (!panelWindow || panelWindow.isDestroyed()) return

  const isDev = process.env['ELECTRON_RENDERER_URL']
  if (isDev) {
    panelWindow.loadURL(`${isDev}#/panel`)
  } else {
    panelWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/panel'
    })
  }
}
