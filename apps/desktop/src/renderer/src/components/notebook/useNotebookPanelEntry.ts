import { useState } from 'react'

import type { TFunction } from '@share-clipboard/i18n'

import type { NotebookEntryGateStep } from './NotebookEntryGate'
import type { NotebookWorkspaceHandlers } from './notebookWorkspaceTypes'

async function readSelectedText(fallback: string): Promise<string> {
  const fromMain = (await window.api.getLastSelectedText()).trim()
  return fromMain || fallback.trim()
}

export function useNotebookPanelEntry(
  nb: NotebookWorkspaceHandlers,
  selectedText: string,
  t: TFunction,
  options?: { skipEntryGate?: boolean }
): {
  workspaceReady: boolean
  gateStep: NotebookEntryGateStep
  remark: string
  gateBusy: boolean
  setRemark: (v: string) => void
  onEditLater: () => void
  onEditNow: () => void
  onBackFromLater: () => void
  onSaveToList: () => Promise<void>
} {
  const [workspaceReady, setWorkspaceReady] = useState(options?.skipEntryGate ?? false)
  const [gateStep, setGateStep] = useState<NotebookEntryGateStep>('choice')
  const [remark, setRemark] = useState('')
  const [gateBusy, setGateBusy] = useState(false)

  const onEditNow = (): void => {
    setGateBusy(true)
    void (async () => {
      try {
        const body = await readSelectedText(selectedText)
        await nb.addNote(body || undefined)
        setWorkspaceReady(true)
      } finally {
        setGateBusy(false)
      }
    })()
  }

  const onSaveToList = async (): Promise<void> => {
    setGateBusy(true)
    try {
      await nb.selectNote(null)
      const title = remark.trim() || t('panel.quickNoteDefaultTitle')
      const body = await readSelectedText(selectedText)
      await window.api.notes.create({ title, body })
      await nb.refreshNotes()
      setRemark('')
      setGateStep('choice')
      setWorkspaceReady(true)
    } finally {
      setGateBusy(false)
    }
  }

  return {
    workspaceReady,
    gateStep,
    remark,
    gateBusy,
    setRemark,
    onEditLater: () => setGateStep('later'),
    onEditNow,
    onBackFromLater: () => {
      setGateStep('choice')
      setRemark('')
    },
    onSaveToList
  }
}
