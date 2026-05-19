import { BrowserWindow } from 'electron'
import { uIOhook, type UiohookMouseEvent } from 'uiohook-napi'

import { hookPointToScreenPoint } from './utils/screenPoint'

export type AutoSelectionTrigger = (position: { x: number; y: number }) => void

const LEFT_MOUSE_BUTTON = 1
const MIN_DRAG_PX = 6

let isRunning = false
let currentCallback: AutoSelectionTrigger | null = null
let mouseDown: { x: number; y: number } | null = null

function isPointInAppWindow(x: number, y: number): boolean {
  return BrowserWindow.getAllWindows().some((win) => {
    if (win.isDestroyed() || !win.isVisible()) return false
    const bounds = win.getBounds()
    return (
      x >= bounds.x && x < bounds.x + bounds.width && y >= bounds.y && y < bounds.y + bounds.height
    )
  })
}

function onMouseDown(event: UiohookMouseEvent): void {
  if (event.button !== LEFT_MOUSE_BUTTON) return
  mouseDown = { x: event.x, y: event.y }
}

function onMouseUp(event: UiohookMouseEvent): void {
  if (event.button !== LEFT_MOUSE_BUTTON) return
  if (!mouseDown) return

  const start = mouseDown
  mouseDown = null

  const dx = event.x - start.x
  const dy = event.y - start.y
  const dragged = dx * dx + dy * dy >= MIN_DRAG_PX * MIN_DRAG_PX
  const doubleClick = event.clicks >= 2
  if (!dragged && !doubleClick) return

  const hookX = event.x
  const hookY = event.y

  // uiohook 在原生线程回调，必须在主线程调用 Electron API
  setImmediate(() => {
    if (!currentCallback) return
    const position = hookPointToScreenPoint(hookX, hookY)
    if (isPointInAppWindow(position.x, position.y)) return
    currentCallback(position)
  })
}

export function startAutoSelectionListener(cb: AutoSelectionTrigger): boolean {
  currentCallback = cb

  if (isRunning) return true

  try {
    uIOhook.on('mousedown', onMouseDown)
    uIOhook.on('mouseup', onMouseUp)
    uIOhook.start()
    isRunning = true
    return true
  } catch (error) {
    console.error('[AutoSelection] Failed to start mouse hook:', error)
    return false
  }
}

export function stopAutoSelectionListener(): void {
  mouseDown = null

  if (!isRunning) {
    currentCallback = null
    return
  }

  try {
    uIOhook.stop()
    uIOhook.removeAllListeners('mousedown')
    uIOhook.removeAllListeners('mouseup')
  } catch (error) {
    console.error('[AutoSelection] Failed to stop mouse hook:', error)
  }

  isRunning = false
  currentCallback = null
}

export function isAutoSelectionListenerActive(): boolean {
  return isRunning
}
