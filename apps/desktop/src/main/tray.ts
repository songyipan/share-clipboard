import { Tray, Menu, nativeImage, NativeImage, app } from 'electron'

import trayIcon from '../../resources/TrayIconTemplate.png?asset'
import { isMac } from './utils/platform'

let tray: Tray | null = null
const MACOS_TRAY_TITLE = 'S'

/**
 * 创建托盘图标
 */
function createTrayIcon(): NativeImage {
  const icon = nativeImage.createFromPath(trayIcon)
  if (icon.isEmpty()) {
    return icon
  }

  const resized = icon.resize({ width: 16, height: 16 })
  if (isMac) {
    resized.setTemplateImage(true)
  }
  return resized
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

  if (isMac) {
    if (icon.isEmpty()) {
      tray.setTitle(MACOS_TRAY_TITLE)
    }

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
