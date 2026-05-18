import { useCallback, useRef, useState } from 'react'

import { useI18n } from '@share-clipboard/i18n'

import type { NotebookWorkspaceHandlers } from './notebookWorkspaceTypes'
import { useNotebookActiveDraft } from './useNotebookActiveDraft'
import { useNotebookAutosave } from './useNotebookAutosave'
import { useNotebookDraftMutators } from './useNotebookDraftMutators'
import { useNotebookNavigation } from './useNotebookNavigation'
import { useNotebookNotesQuery } from './useNotebookNotesQuery'

export function useNotebookWorkspace(): NotebookWorkspaceHandlers {
  const { t } = useI18n()
  const baselineRef = useRef({ title: '', body: '' })
  const [activeId, setActiveId] = useState<string | null>(null)

  const { notes, refreshNotes } = useNotebookNotesQuery()
  const { draftTitle, draftBody, setDraftTitle, setDraftBody } = useNotebookActiveDraft(
    activeId,
    baselineRef
  )
  const { saving, persistNow, markDirty, clearTimer } = useNotebookAutosave(
    activeId,
    draftTitle,
    draftBody,
    baselineRef,
    refreshNotes
  )

  const { changeDraftTitle, changeDraftBody } = useNotebookDraftMutators(
    setDraftTitle,
    setDraftBody,
    markDirty
  )

  const confirmRemove = useCallback(() => window.confirm(t('panel.noteDeleteConfirm')), [t])

  const { selectNote, addNote, removeActiveNote, flushNow } = useNotebookNavigation({
    activeId,
    setActiveId,
    baselineRef,
    clearTimer,
    persistNow,
    refreshNotes,
    setDraftTitle,
    setDraftBody,
    confirmRemove
  })

  return {
    notes,
    activeId,
    draftTitle,
    draftBody,
    saving,
    selectNote,
    changeDraftTitle,
    changeDraftBody,
    addNote,
    removeActiveNote,
    refreshNotes,
    flushNow
  }
}
