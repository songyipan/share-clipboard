import type { MutableRefObject } from 'react'
import { useEffect, useState } from 'react'

import type { NotebookDraft } from './notebookDraftUtils'

export function useNotebookActiveDraft(
  activeId: string | null,
  baselineRef: MutableRefObject<NotebookDraft>
): {
  draftTitle: string
  draftBody: string
  setDraftTitle: (v: string) => void
  setDraftBody: (v: string) => void
} {
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')

  useEffect(() => {
    if (!activeId) {
      queueMicrotask(() => {
        baselineRef.current = { title: '', body: '' }
        setDraftTitle('')
        setDraftBody('')
      })
      return
    }

    let cancelled = false
    void (async () => {
      const n = await window.api.notes.get(activeId)
      if (cancelled || !n) return
      baselineRef.current = { title: n.title, body: n.body }
      setDraftTitle(n.title)
      setDraftBody(n.body)
    })()

    return () => {
      cancelled = true
    }
  }, [activeId, baselineRef])

  return { draftTitle, draftBody, setDraftTitle, setDraftBody }
}
