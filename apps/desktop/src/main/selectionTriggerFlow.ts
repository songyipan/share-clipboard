import { hideFloatingWindow, showFloatingWindow, getFloatingWindow } from './floatingWindow'
import { getCursorPosition } from './mouseListener'
import type { SelectionTriggerPosition, SelectionTriggerSource } from './mouseListener'
import { captureSelection, type SelectionResult } from './selection'
import { IPC_CHANNELS } from '../shared/ipc'

export type SendSelectionToPanel = (result: SelectionResult) => void
export type OnSelectionCaptured = (result: SelectionResult) => void

interface SelectionTriggerFlowState {
  lastSelectionText: string
  lastTriggerTime: number
  captureInFlight: boolean
}

export function createSelectionTriggerFlow(deps: {
  sendSelectionResultToPanel: SendSelectionToPanel
  onSelectionCaptured: OnSelectionCaptured
}): {
  getLastSelectionText: () => string
  handleSelectionTrigger: (
    source: SelectionTriggerSource,
    position?: SelectionTriggerPosition
  ) => Promise<void>
} {
  const state: SelectionTriggerFlowState = {
    lastSelectionText: '',
    lastTriggerTime: 0,
    captureInFlight: false
  }

  function notifyFloatingShown(): void {
    const floatingWin = getFloatingWindow()
    if (!floatingWin || floatingWin.isDestroyed()) return
    floatingWin.webContents.send(IPC_CHANNELS.FLOATING_SHOWN)
  }

  function revealFloatingBall(position: SelectionTriggerPosition): void {
    showFloatingWindow(position.x, position.y)
    notifyFloatingShown()
  }

  function applySelectionResult(now: number, result: SelectionResult): void {
    const text = result.text || ''
    if (text === state.lastSelectionText && now - state.lastTriggerTime < 250) {
      return
    }
    state.lastTriggerTime = now
    state.lastSelectionText = text
    deps.sendSelectionResultToPanel(result)
    deps.onSelectionCaptured(result)
  }

  async function handleSelectionTrigger(
    source: SelectionTriggerSource,
    position?: SelectionTriggerPosition
  ): Promise<void> {
    const now = Date.now()

    try {
      revealFloatingBall(position ?? getCursorPosition())

      if (state.captureInFlight) return
      state.captureInFlight = true

      try {
        const result = await captureSelection({ fromAutoSelection: source === 'auto' })
        if (!result.success) {
          hideFloatingWindow()
          return
        }
        applySelectionResult(now, result)
      } finally {
        state.captureInFlight = false
      }
    } catch (error) {
      console.error('[SelectionTrigger] Failed:', error)
      hideFloatingWindow()
      state.captureInFlight = false
    }
  }

  return {
    getLastSelectionText: () => state.lastSelectionText,
    handleSelectionTrigger
  }
}
