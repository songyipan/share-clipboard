import { MarkdownEditor, MarkdownPreview, MarkdownSplitRow } from '../markdown'

interface NotebookWorkspaceEditorProps {
  showPreview: boolean
  draftBody: string
  previewSource: string
  onBodyChange: (body: string) => void
}

export function NotebookWorkspaceEditor({
  showPreview,
  draftBody,
  previewSource,
  onBodyChange
}: NotebookWorkspaceEditorProps): React.JSX.Element {
  return (
    <MarkdownSplitRow
      showPreview={showPreview}
      editor={<MarkdownEditor value={draftBody} onChange={onBodyChange} />}
      preview={<MarkdownPreview source={previewSource} />}
    />
  )
}
