import { screen } from 'electron'

/** uiohook 坐标转为与 BrowserWindow 一致的屏幕坐标 */
export function hookPointToScreenPoint(x: number, y: number): { x: number; y: number } {
  // macOS 上 screenToDipPoint 不可用，且 uiohook 坐标已与 Electron 一致
  if (process.platform === 'darwin') {
    return { x, y }
  }
  return screen.screenToDipPoint({ x, y })
}
