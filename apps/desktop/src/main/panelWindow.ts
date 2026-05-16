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
    width: 920,
    height: 640,
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

  // 设置窗口在所有工作区可见
  panelWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

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

  // 使用鼠标位置确定要在哪个显示器上显示
  const display = screen.getDisplayNearestPoint({ x: floatingX, y: floatingY })

  // 在指定的显示器上居中显示
  const { x, y, width, height } = display.workArea
  const [winWidth, winHeight] = panelWindow.getSize()
  const newX = Math.round(x + (width - winWidth) / 2)
  const newY = Math.round(y + (height - winHeight) / 2)
  panelWindow.setPosition(newX, newY)

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
      panelWindow?.showInactive()
    })
  } else {
    console.log('[PanelWindow] sending IPC immediately with type:', type)
    panelWindow.webContents.send(IPC_CHANNELS.PANEL_TYPE, type)
    panelWindow.showInactive()
  }
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
