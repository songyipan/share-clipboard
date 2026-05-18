import { Button } from '@share-clipboard/ui/components/button'
import { cn } from '@share-clipboard/ui/lib/utils'

import type { NoteSummaryDto } from '../../../../shared/notes/types'

interface NotebookNoteListProps {
  notes: NoteSummaryDto[]
  activeId: string | null
  onSelect: (id: string) => void
  className?: string
}

export function NotebookNoteList({
  notes,
  activeId,
  onSelect,
  className
}: NotebookNoteListProps): React.JSX.Element {
  return (
    <div className={cn('flex flex-col gap-0.5 overflow-y-auto min-h-0 pr-1', className)}>
      {notes.map((n) => (
        <Button
          key={n.id}
          type="button"
          variant={activeId === n.id ? 'secondary' : 'ghost'}
          size="sm"
          className="h-auto min-h-8 py-1.5 px-2 justify-start text-left whitespace-normal shrink-0"
          onClick={() => onSelect(n.id)}
          aria-current={activeId === n.id ? 'true' : undefined}
        >
          <span className="text-xs leading-snug line-clamp-3">{n.title}</span>
        </Button>
      ))}
    </div>
  )
}
