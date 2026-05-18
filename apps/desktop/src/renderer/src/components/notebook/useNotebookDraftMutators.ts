import { useCallback } from 'react'

export function useNotebookDraftMutators(
  setDraftTitle: (v: string) => void,
  setDraftBody: (v: string) => void,
  markDirty: () => void
): {
  changeDraftTitle: (title: string) => void
  changeDraftBody: (body: string) => void
} {
  const changeDraftTitle = useCallback(
    (title: string) => {
      setDraftTitle(title)
      markDirty()
    },
    [markDirty, setDraftTitle]
  )

  const changeDraftBody = useCallback(
    (body: string) => {
      setDraftBody(body)
      markDirty()
    },
    [markDirty, setDraftBody]
  )

  return { changeDraftTitle, changeDraftBody }
}
