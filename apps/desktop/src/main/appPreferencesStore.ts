import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import {
  createDefaultPreferences,
  isTriggerMode,
  normalizeAccelerator,
  type AppPreferences
} from '../shared/appPreferences'

const PREFERENCES_FILE = 'app-preferences.json'

function preferencesPath(): string {
  return join(app.getPath('userData'), PREFERENCES_FILE)
}

function readRawPreferences(): Partial<AppPreferences> | null {
  const path = preferencesPath()
  if (!existsSync(path)) return null

  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Partial<AppPreferences>
  } catch {
    return null
  }
}

function mergePreferences(raw: Partial<AppPreferences> | null): AppPreferences {
  const defaults = createDefaultPreferences(process.platform)
  const shortcut = raw?.shortcut ? normalizeAccelerator(raw.shortcut) : null

  return {
    triggerMode:
      raw?.triggerMode && isTriggerMode(raw.triggerMode) ? raw.triggerMode : defaults.triggerMode,
    shortcut: shortcut ?? defaults.shortcut
  }
}

export function loadAppPreferences(): AppPreferences {
  return mergePreferences(readRawPreferences())
}

export function mergeAppPreferences(
  current: AppPreferences,
  patch: Partial<AppPreferences>
): AppPreferences {
  const nextShortcut =
    patch.shortcut !== undefined ? normalizeAccelerator(patch.shortcut) : current.shortcut

  return {
    triggerMode:
      patch.triggerMode && isTriggerMode(patch.triggerMode)
        ? patch.triggerMode
        : current.triggerMode,
    shortcut: nextShortcut ?? current.shortcut
  }
}

export function writeAppPreferences(preferences: AppPreferences): void {
  const dir = app.getPath('userData')
  mkdirSync(dir, { recursive: true })
  writeFileSync(preferencesPath(), JSON.stringify(preferences, null, 2), 'utf8')
}
