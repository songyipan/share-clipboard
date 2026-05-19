import { shell, systemPreferences } from 'electron'

import type { SystemPermissionStatus } from '../shared/systemPermission'
import { isMac } from './utils/platform'

const MAC_ACCESSIBILITY_SETTINGS_URL =
  'x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension?Privacy_Accessibility'

export function getSystemPermissionStatus(): SystemPermissionStatus {
  if (!isMac) {
    return { required: false, granted: true, canPrompt: false }
  }

  const granted = systemPreferences.isTrustedAccessibilityClient(false)
  return { required: true, granted, canPrompt: true }
}

export function requestSystemPermission(): SystemPermissionStatus {
  if (!isMac) {
    return getSystemPermissionStatus()
  }

  systemPreferences.isTrustedAccessibilityClient(true)
  return getSystemPermissionStatus()
}

export async function openSystemPermissionSettings(): Promise<void> {
  if (!isMac) return
  await shell.openExternal(MAC_ACCESSIBILITY_SETTINGS_URL)
}
