import { useCallback, useEffect, useState } from 'react'

import type { NoteSummaryDto } from '../../../../shared/notes/types'

export function useNotebookNotesQuery(): {
  notes: NoteSummaryDto[]
  refreshNotes: () => Promise<void>
} {
  const [notes, setNotes] = useState<NoteSummaryDto[]>([])

  const refreshNotes = useCallback(async () => {
    const rows = await window.api.notes.list()
    setNotes(rows)
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const rows = await window.api.notes.list()
      if (!cancelled) setNotes(rows)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { notes, refreshNotes }
}
