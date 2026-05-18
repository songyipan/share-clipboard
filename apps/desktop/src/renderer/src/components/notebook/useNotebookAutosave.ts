import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { sameDraft, type NotebookDraft } from './notebookDraftUtils'

const SAVE_DEBOUNCE_MS = 550

export function useNotebookAutosave(
  activeId: string | null,
  draftTitle: string,
  draftBody: string,
  baselineRef: MutableRefObject<NotebookDraft>,
  refreshNotes: () => Promise<void>
): {
  saving: boolean
  persistNow: () => Promise<void>
  markDirty: () => void
  clearTimer: () => void
} {
  const [saving, setSaving] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const clearTimer = useCallback(() => {
    if (!saveTimerRef.current) return
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = undefined
  }, [])

  const persistNow = useCallback(async () => {
    const id = activeId
    if (!id) return
    const live: NotebookDraft = { title: draftTitle, body: draftBody }
    if (sameDraft(live, baselineRef.current)) return
    setSaving(true)
    try {
      const updated = await window.api.notes.update(id, {
        title: live.title,
        body: live.body
      })
      if (!updated) return
      baselineRef.current = { title: updated.title, body: updated.body }
      await refreshNotes()
    } finally {
      setSaving(false)
    }
  }, [activeId, draftTitle, draftBody, baselineRef, refreshNotes])

  const markDirty = useCallback(() => {
    clearTimer()
    saveTimerRef.current = setTimeout(() => {
      void persistNow()
    }, SAVE_DEBOUNCE_MS)
  }, [clearTimer, persistNow])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return { saving, persistNow, markDirty, clearTimer }
}
