import { useCallback, useEffect, useState } from 'react'

import type { AppPreferences } from '../../../shared/appPreferences'
import type { SystemPermissionStatus } from '../../../shared/systemPermission'

export function useStatusCardState(): {
  permission: SystemPermissionStatus | null
  listenerActive: boolean
  preferences: AppPreferences | null
  refresh: () => Promise<void>
  requestPermission: () => Promise<void>
  openPermissionSettings: () => Promise<void>
} {
  const [permission, setPermission] = useState<SystemPermissionStatus | null>(null)
  const [listenerActive, setListenerActive] = useState(false)
  const [preferences, setPreferences] = useState<AppPreferences | null>(null)

  const refresh = useCallback(async () => {
    const [perm, isActive, prefs] = await Promise.all([
      window.api.getSystemPermissionStatus(),
      window.api.isListenerActive(),
      window.api.getAppPreferences()
    ])
    setPermission(perm)
    setListenerActive(isActive)
    setPreferences(prefs)
  }, [])

  const requestPermission = useCallback(async () => {
    const next = await window.api.requestSystemPermission()
    setPermission(next)
    if (next.granted) {
      const isActive = await window.api.isListenerActive()
      setListenerActive(isActive)
    }
  }, [])

  const openPermissionSettings = useCallback(async () => {
    await window.api.openSystemPermissionSettings()
    await refresh()
  }, [refresh])

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0)
    const cleanupPrefs = window.api.onPreferencesChanged((next) => {
      setPreferences(next)
      void window.api.isListenerActive().then(setListenerActive)
    })
    const onFocus = (): void => {
      void refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearTimeout(timer)
      cleanupPrefs()
      window.removeEventListener('focus', onFocus)
    }
  }, [refresh])

  return {
    permission,
    listenerActive,
    preferences,
    refresh,
    requestPermission,
    openPermissionSettings
  }
}
