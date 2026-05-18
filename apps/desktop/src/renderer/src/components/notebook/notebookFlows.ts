import type { MutableRefObject } from 'react'

import type { NotebookDraft } from './notebookDraftUtils'

export async function notebookFlushSelection(args: {
  clearTimer: () => void
  persistNow: () => Promise<void>
  setActiveId: (id: string | null) => void
  nextId: string | null
}): Promise<void> {
  args.clearTimer()
  await args.persistNow()
  args.setActiveId(args.nextId)
}

export async function notebookCreateFresh(args: {
  clearTimer: () => void
  persistNow: () => Promise<void>
  refreshNotes: () => Promise<void>
  setActiveId: (id: string | null) => void
  baselineRef: MutableRefObject<NotebookDraft>
  setDraftTitle: (v: string) => void
  setDraftBody: (v: string) => void
}): Promise<void> {
  args.clearTimer()
  await args.persistNow()
  const created = await window.api.notes.create({})
  await args.refreshNotes()
  args.setActiveId(created.id)
  args.baselineRef.current = { title: created.title, body: created.body }
  args.setDraftTitle(created.title)
  args.setDraftBody(created.body)
}

export async function notebookRemoveCurrent(args: {
  activeId: string
  clearTimer: () => void
  refreshNotes: () => Promise<void>
  setActiveId: (id: string | null) => void
}): Promise<void> {
  args.clearTimer()
  await window.api.notes.remove(args.activeId)
  args.setActiveId(null)
  await args.refreshNotes()
}
