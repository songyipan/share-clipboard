import { Tray, Menu, nativeImage, NativeImage, app } from 'electron'

import trayIcon from '../../resources/icon.png?asset'

let tray: Tray | null = null

/**
 * 创建托盘图标
 */
function createTrayIcon(): NativeImage {
  // 使用应用图标，缩放到托盘大小
  const icon = nativeImage.createFromPath(trayIcon)
  return icon.resize({ width: 22, height: 22 })
}

/**
 * 创建系统托盘
 */
export function createTray(onShowMainWindow: () => void): Tray {
  if (tray) {
    return tray
  }

  const icon = createTrayIcon()
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      click: () => {
        onShowMainWindow()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('Share Clipboard')
  tray.setContextMenu(contextMenu)

  // macOS: 点击托盘图标也显示菜单
  if (process.platform === 'darwin') {
    tray.on('click', () => {
      tray?.popUpContextMenu()
    })
  }

  return tray
}

/**
 * 销毁托盘
 */
export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

/**
 * 获取托盘实例
 */
export function getTray(): Tray | null {
  return tray
}
