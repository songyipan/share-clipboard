import MDEditor from '@uiw/react-md-editor'
import './loadMarkdownStyles'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps): React.JSX.Element {
  return (
    <div className="w-full h-full min-h-0 rounded-md border border-input overflow-hidden flex flex-col">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || '')}
        height="100%"
        preview="edit"
        hideToolbar
        visibleDragbar={false}
        style={{ background: 'transparent' }}
      />
    </div>
  )
}
