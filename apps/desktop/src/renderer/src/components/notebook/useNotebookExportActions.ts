import { useCallback, useState } from 'react'

import type { TFunction } from '@share-clipboard/i18n'

import type { NoteExportResultDto } from '../../../../shared/notes/types'

export function useNotebookExportActions(
  activeId: string | null,
  draftBody: string,
  flushNow: () => Promise<void>,
  changeDraftBody: (body: string) => void,
  lastSelectedText: string,
  t: TFunction
): {
  exportHint: string
  exportPdf: () => Promise<void>
  exportDocx: () => Promise<void>
  insertSelection: () => void
} {
  const [exportHint, setExportHint] = useState('')

  const exportPdf = useCallback(async () => {
    if (!activeId) return
    await flushNow()
    const r = await window.api.notes.exportPdf(activeId)
    setExportHint(exportOutcomeMessage(r, t))
  }, [activeId, flushNow, t])

  const exportDocx = useCallback(async () => {
    if (!activeId) return
    await flushNow()
    const r = await window.api.notes.exportDocx(activeId)
    setExportHint(exportOutcomeMessage(r, t))
  }, [activeId, flushNow, t])

  const insertSelection = useCallback(() => {
    const text = lastSelectedText.trim()
    if (!text) return
    const next = draftBody ? `${draftBody}\n\n${text}` : text
    changeDraftBody(next)
  }, [changeDraftBody, draftBody, lastSelectedText])

  return { exportHint, exportPdf, exportDocx, insertSelection }
}

function exportOutcomeMessage(r: NoteExportResultDto, t: TFunction): string {
  if (r.status === 'cancelled') return ''
  if (r.status === 'failed') return t('panel.exportFailed', { message: r.message })
  return t('panel.exportSaved', { path: r.path })
}
