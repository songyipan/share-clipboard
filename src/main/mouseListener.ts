import { globalShortcut, screen } from 'electron'
import { getDefaultShortcut } from './utils/platform'

type SelectionTriggerCallback = () => void

let isRegistered = false
let currentCallback: SelectionTriggerCallback | null = null

const SHORTCUT = getDefaultShortcut()

/**
 * 启动全局快捷键监听
 */
export function startSelectionListener(cb: SelectionTriggerCallback): boolean {
  currentCallback = cb

  if (isRegistered) {
    return true
  }

  try {
    const success = globalShortcut.register(SHORTCUT, () => {
      if (currentCallback) currentCallback()
    })

    if (success) {
      isRegistered = true
    }

    return success
  } catch (error) {
    console.error('Failed to register shortcut:', error)
    return false
  }
}

/**
 * 停止全局快捷键监听
 */
export function stopSelectionListener(): void {
  if (isRegistered) {
    globalShortcut.unregister(SHORTCUT)
    isRegistered = false
    currentCallback = null
  }
}

/**
 * 获取当前鼠标位置
 */
export function getCursorPosition(): { x: number; y: number } {
  return screen.getCursorScreenPoint()
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
  return SHORTCUT
}
