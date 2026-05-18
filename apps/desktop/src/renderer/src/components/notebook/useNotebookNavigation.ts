import { useCallback } from 'react'
import type { MutableRefObject } from 'react'

import type { NotebookDraft } from './notebookDraftUtils'
import { notebookCreateFresh, notebookFlushSelection, notebookRemoveCurrent } from './notebookFlows'

interface NotebookNavigationArgs {
  activeId: string | null
  setActiveId: (id: string | null) => void
  baselineRef: MutableRefObject<NotebookDraft>
  clearTimer: () => void
  persistNow: () => Promise<void>
  refreshNotes: () => Promise<void>
  setDraftTitle: (v: string) => void
  setDraftBody: (v: string) => void
  confirmRemove: () => boolean
}

export function useNotebookNavigation(params: NotebookNavigationArgs): {
  selectNote: (nextId: string | null) => Promise<void>
  addNote: () => Promise<void>
  removeActiveNote: () => Promise<boolean>
  flushNow: () => Promise<void>
} {
  const {
    activeId,
    setActiveId,
    baselineRef,
    clearTimer,
    persistNow,
    refreshNotes,
    setDraftTitle,
    setDraftBody,
    confirmRemove
  } = params

  const selectNote = useCallback(
    async (nextId: string | null) => {
      await notebookFlushSelection({ clearTimer, persistNow, setActiveId, nextId })
    },
    [clearTimer, persistNow, setActiveId]
  )

  const addNote = useCallback(async () => {
    await notebookCreateFresh({
      clearTimer,
      persistNow,
      refreshNotes,
      setActiveId,
      baselineRef,
      setDraftTitle,
      setDraftBody
    })
  }, [baselineRef, clearTimer, persistNow, refreshNotes, setActiveId, setDraftBody, setDraftTitle])

  const removeActiveNote = useCallback(async (): Promise<boolean> => {
    if (!activeId) return false
    if (!confirmRemove()) return false
    await notebookRemoveCurrent({ activeId, clearTimer, refreshNotes, setActiveId })
    return true
  }, [activeId, clearTimer, confirmRemove, refreshNotes, setActiveId])

  const flushNow = useCallback(async () => {
    clearTimer()
    await persistNow()
  }, [clearTimer, persistNow])

  return { selectNote, addNote, removeActiveNote, flushNow }
}
