import { BrowserWindow } from 'electron'

import type { AppPreferences } from '../shared/appPreferences'
import { loadAppPreferences, mergeAppPreferences, writeAppPreferences } from './appPreferencesStore'
import {
  isAutoSelectionListenerActive,
  startAutoSelectionListener,
  stopAutoSelectionListener
} from './autoSelectionListener'
import type { SelectionTriggerPosition, SelectionTriggerSource } from './mouseListener'
import {
  canRegisterShortcut,
  getRegisteredShortcut,
  isShortcutListenerActive,
  startShortcutListener,
  stopShortcutListener
} from './shortcutListener'
import { IPC_CHANNELS } from '../shared/ipc'

type SelectionTriggerCallback = (
  source: SelectionTriggerSource,
  position?: SelectionTriggerPosition
) => void

let triggerCallback: SelectionTriggerCallback | null = null

function broadcastPreferences(preferences: AppPreferences): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.PREFERENCES_CHANGED, preferences)
    }
  }
}

export function initSelectionListenerManager(cb: SelectionTriggerCallback): boolean {
  triggerCallback = cb
  return applyPreferences(loadAppPreferences())
}

export function getConfiguredShortcut(): string {
  return loadAppPreferences().shortcut
}

export function getAppPreferences(): AppPreferences {
  return loadAppPreferences()
}

export function isSelectionListenerActive(): boolean {
  const prefs = loadAppPreferences()
  return prefs.triggerMode === 'auto' ? isAutoSelectionListenerActive() : isShortcutListenerActive()
}

export function applyPreferences(preferences: AppPreferences): boolean {
  stopAutoSelectionListener()
  stopShortcutListener()

  if (!triggerCallback) return false

  if (preferences.triggerMode === 'auto') {
    return startAutoSelectionListener((position) => triggerCallback!('auto', position))
  }

  if (!canRegisterShortcut(preferences.shortcut)) {
    return false
  }

  return startShortcutListener(triggerCallback, preferences.shortcut)
}

export function updateAppPreferences(patch: Partial<AppPreferences>): {
  preferences: AppPreferences
  applied: boolean
} {
  const current = loadAppPreferences()
  const candidate = mergeAppPreferences(current, patch)

  if (candidate.triggerMode === 'shortcut' && !canRegisterShortcut(candidate.shortcut)) {
    return { preferences: current, applied: false }
  }

  const applied = applyPreferences(candidate)
  if (!applied) {
    applyPreferences(current)
    return { preferences: current, applied: false }
  }

  writeAppPreferences(candidate)
  broadcastPreferences(candidate)
  return { preferences: candidate, applied: true }
}

export function getActiveShortcutLabel(): string {
  return getRegisteredShortcut() ?? loadAppPreferences().shortcut
}

export function reapplySelectionListeners(): boolean {
  return applyPreferences(loadAppPreferences())
}
