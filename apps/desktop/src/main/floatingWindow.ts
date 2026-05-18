import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { IPC_CHANNELS } from '../shared/ipc'

let floatingWindow: BrowserWindow | null = null
let floatingWindowShownAt = 0

export function getFloatingWindowShownAt(): number {
  return floatingWindowShownAt
}

/**
 * 创建悬浮球窗口
 */
export function createFloatingWindow(): BrowserWindow {
  if (floatingWindow) {
    return floatingWindow
  }

  floatingWindow = new BrowserWindow({
    width: 1,
    height: 1,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    show: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    focusable: false,
    fullscreenable: false,
    movable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  })

  // 设置窗口在所有工作区可见
  floatingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  floatingWindow.on('closed', () => {
    floatingWindow = null
  })

  return floatingWindow
}

/**
 * 获取悬浮球窗口实例
 */
export function getFloatingWindow(): BrowserWindow | null {
  return floatingWindow
}

/**
 * 显示悬浮球在指定位置
 */
export function showFloatingWindow(x: number, y: number): void {
  if (!floatingWindow || floatingWindow.isDestroyed()) {
    floatingWindow = createFloatingWindow()
    loadFloatingWindowContent()
  }

  // 确保窗口在屏幕可视范围内
  const bounds = safePosition(x, y)
  floatingWindow.setPosition(bounds.x, bounds.y)

  floatingWindowShownAt = Date.now()
  // 只显示不聚焦，避免切换桌面
  floatingWindow.showInactive()
}

/**
 * 隐藏悬浮球窗口
 */
export function hideFloatingWindow(): void {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.hide()

    // 通知渲染进程窗口已隐藏
    floatingWindow.webContents.send(IPC_CHANNELS.FLOATING_HIDDEN)
  }
}

/**
 * 计算安全的窗口位置，确保不超出屏幕边界
 */
function safePosition(x: number, y: number): { x: number; y: number } {
  const windowWidth = floatingWindow?.getSize()[0] ?? 160
  const windowHeight = floatingWindow?.getSize()[1] ?? 48
  const padding = 10

  const display = screen.getDisplayNearestPoint({ x, y })
  const { x: areaX, y: areaY, width, height } = display.workArea

  const safeX = Math.min(Math.max(x, areaX + padding), areaX + width - windowWidth - padding)
  const safeY = Math.min(Math.max(y, areaY + padding), areaY + height - windowHeight - padding)

  return { x: safeX, y: safeY }
}

/**
 * 设置悬浮球窗口的 blur 处理器
 */
export function setFloatingWindowBlurHandler(handler: () => void): void {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.on('blur', handler)
  }
}

/**
 * 加载悬浮球窗口内容
 */
export function loadFloatingWindowContent(): void {
  if (!floatingWindow || floatingWindow.isDestroyed()) return

  const isDev = process.env['ELECTRON_RENDERER_URL']
  if (isDev) {
    floatingWindow.loadURL(`${isDev}#/floating`)
  } else {
    floatingWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/floating'
    })
  }
}
