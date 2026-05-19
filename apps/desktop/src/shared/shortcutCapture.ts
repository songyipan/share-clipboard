const NAMED_KEYS: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  Escape: 'Escape',
  Enter: 'Enter',
  Tab: 'Tab',
  Backspace: 'Backspace',
  Delete: 'Delete'
}

function normalizeKey(key: string): string | null {
  if (key in NAMED_KEYS) return NAMED_KEYS[key]
  if (key.length === 1) return key.toUpperCase()
  if (/^F\d{1,2}$/i.test(key)) return key.toUpperCase()
  if (/^[A-Z]$/i.test(key)) return key.toUpperCase()
  return null
}

/** 将键盘事件转为 Electron accelerator 字符串 */
export function acceleratorFromKeyboardEvent(event: KeyboardEvent, isMac: boolean): string | null {
  if (event.key === 'Escape') return null

  const key = normalizeKey(event.key)
  if (!key) return null

  const modifiers: string[] = []
  if (isMac) {
    if (event.metaKey) modifiers.push('Command')
    if (event.ctrlKey) modifiers.push('Control')
    if (event.altKey) modifiers.push('Alt')
    if (event.shiftKey) modifiers.push('Shift')
  } else {
    if (event.ctrlKey) modifiers.push('Control')
    if (event.altKey) modifiers.push('Alt')
    if (event.shiftKey) modifiers.push('Shift')
    if (event.metaKey) modifiers.push('Super')
  }

  if (modifiers.length === 0) return null
  return [...modifiers, key].join('+')
}
