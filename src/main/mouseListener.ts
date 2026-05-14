import { globalShortcut, screen } from 'electron'

type SelectionTriggerCallback = () => void

let isRegistered = false
let callback: SelectionTriggerCallback | null = null

/**
 * 默认快捷键
 * macOS: Command+Shift+C
 * Windows/Linux: Ctrl+Shift+C
 */
const DEFAULT_SHORTCUT = process.platform === 'darwin' ? 'Command+Shift+C' : 'Ctrl+Shift+C'

/**
 * 启动全局快捷键监听
 */
export function startSelectionListener(cb: SelectionTriggerCallback): boolean {
  if (isRegistered) {
    callback = cb
    return true
  }

  callback = cb

  try {
    const success = globalShortcut.register(DEFAULT_SHORTCUT, handleShortcutPress)

    if (success) {
      isRegistered = true
      console.log(`Selection listener registered: ${DEFAULT_SHORTCUT}`)
    }

    return success
  } catch (error) {
    console.error('Failed to register shortcut:', error)
    return false
  }
}

/**
 * 快捷键按下时的处理
 */
function handleShortcutPress(): void {
  if (callback) {
    callback()
  }
}

/**
 * 停止全局快捷键监听
 */
export function stopSelectionListener(): void {
  if (isRegistered) {
    globalShortcut.unregister(DEFAULT_SHORTCUT)
    isRegistered = false
    callback = null
  }
}

/**
 * 获取当前鼠标位置
 */
export function getCursorPosition(): { x: number; y: number } {
  const point = screen.getCursorScreenPoint()
  return { x: point.x, y: point.y }
}

/**
 * 获取监听状态
 */
export function isListenerActive(): boolean {
  return isRegistered
}

/**
 * 获取当前快捷键
 */
export function getCurrentShortcut(): string {
  return DEFAULT_SHORTCUT
}
