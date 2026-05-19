import { screen } from 'electron'

export type SelectionTriggerSource = 'shortcut' | 'auto'

export interface SelectionTriggerPosition {
  x: number
  y: number
}

export function getCursorPosition(): { x: number; y: number } {
  return screen.getCursorScreenPoint()
}
