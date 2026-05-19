import { useCallback, useEffect, useState } from 'react'

import type { AppPreferences } from '../../../shared/appPreferences'
import type { TriggerMode } from '../../../shared/appPreferences'

export function useAppPreferences(): {
  preferences: AppPreferences | null
  saving: boolean
  error: string
  setTriggerMode: (mode: TriggerMode) => Promise<boolean>
  setShortcut: (shortcut: string) => Promise<boolean>
  refresh: () => Promise<void>
} {
  const [preferences, setPreferences] = useState<AppPreferences | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    const next = await window.api.getAppPreferences()
    setPreferences(next)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh()
    }, 0)
    const cleanup = window.api.onPreferencesChanged((next) => {
      setPreferences(next)
      setError('')
    })
    return () => {
      window.clearTimeout(timer)
      cleanup()
    }
  }, [refresh])

  const persist = useCallback(async (patch: Partial<AppPreferences>) => {
    setSaving(true)
    setError('')
    try {
      const result = await window.api.setAppPreferences(patch)
      setPreferences(result.preferences)
      if (!result.applied) {
        setError('shortcutRegisterFailed')
        return false
      }
      return true
    } finally {
      setSaving(false)
    }
  }, [])

  const setTriggerMode = useCallback(
    (mode: TriggerMode) => persist({ triggerMode: mode }),
    [persist]
  )

  const setShortcut = useCallback((shortcut: string) => persist({ shortcut }), [persist])

  return { preferences, saving, error, setTriggerMode, setShortcut, refresh }
}
