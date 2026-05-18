export type NotebookDraft = { title: string; body: string }

export function sameDraft(a: NotebookDraft, b: NotebookDraft): boolean {
  return a.title === b.title && a.body === b.body
}
