import { globalShortcut } from 'electron'

import type { SelectionTriggerPosition } from './mouseListener'

type SelectionTriggerCallback = (source: 'shortcut', position?: SelectionTriggerPosition) => void

let registeredAccelerator: string | null = null
let currentCallback: SelectionTriggerCallback | null = null

export function startShortcutListener(cb: SelectionTriggerCallback, accelerator: string): boolean {
  stopShortcutListener()
  currentCallback = cb

  try {
    const success = globalShortcut.register(accelerator, () => {
      if (currentCallback) currentCallback('shortcut', undefined)
    })

    if (success) {
      registeredAccelerator = accelerator
    }

    return success
  } catch (error) {
    console.error('[Shortcut] Failed to register global shortcut:', error)
    return false
  }
}

export function stopShortcutListener(): void {
  if (registeredAccelerator) {
    globalShortcut.unregister(registeredAccelerator)
    registeredAccelerator = null
  }
  currentCallback = null
}

export function isShortcutListenerActive(): boolean {
  return registeredAccelerator !== null
}

export function getRegisteredShortcut(): string | null {
  return registeredAccelerator
}

export function canRegisterShortcut(accelerator: string): boolean {
  if (globalShortcut.isRegistered(accelerator)) {
    globalShortcut.unregister(accelerator)
  }

  const ok = globalShortcut.register(accelerator, () => undefined)
  if (ok) globalShortcut.unregister(accelerator)
  return ok
}
