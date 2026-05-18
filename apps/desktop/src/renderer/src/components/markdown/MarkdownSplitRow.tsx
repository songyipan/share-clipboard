import { cn } from '@share-clipboard/ui/lib/utils'

interface MarkdownSplitRowProps {
  showPreview: boolean
  editor: React.ReactNode
  preview: React.ReactNode
}

export function MarkdownSplitRow({
  showPreview,
  editor,
  preview
}: MarkdownSplitRowProps): React.JSX.Element {
  return (
    <div className="flex flex-1 min-h-0 gap-2">
      <div
        className={cn('min-h-0 min-w-0 flex flex-col', showPreview ? 'flex-1 basis-0' : 'flex-1')}
      >
        {editor}
      </div>
      {showPreview ? (
        <div className="min-h-0 min-w-0 flex-1 basis-0 flex flex-col">{preview}</div>
      ) : null}
    </div>
  )
}
