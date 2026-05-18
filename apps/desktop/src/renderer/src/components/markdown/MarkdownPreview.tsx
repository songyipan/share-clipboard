import MDEditor from '@uiw/react-md-editor'
import remarkBreaks from 'remark-breaks'
import './loadMarkdownStyles'

interface MarkdownPreviewProps {
  source: string
}

export function MarkdownPreview({ source }: MarkdownPreviewProps): React.JSX.Element {
  return (
    <div className="w-full h-full min-h-0 rounded-md border border-input overflow-auto">
      <MDEditor.Markdown
        remarkPlugins={[remarkBreaks]}
        source={source}
        className="p-4 !bg-transparent"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}
