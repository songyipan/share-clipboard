import { forwardRef } from 'react'
import { Button } from './ui/button'
import { Search, NotebookText, ImageIcon, GripVertical, LucideIcon } from 'lucide-react'

interface FloatingBallContainerProps {
  onAction: (action: number) => void
}

export const FloatingBallContainer = forwardRef<HTMLDivElement, FloatingBallContainerProps>(
  function FloatingBallContainer({ onAction }, ref): React.JSX.Element {
    return (
      <div
        className="inline-flex justify-center items-center"
        style={{
          width: '100%',
          height: '100%',
          padding: '6px 8px 10px'
        }}
      >
        <div
          ref={ref}
          className="inline-flex gap-1 py-1 px-1.5 flex-row items-center bg-background rounded-full select-none border border-border/50"
          style={
            {
              WebkitAppRegion: 'drag',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
            } as React.CSSProperties
          }
        >
          <DragHandle />
          <ActionButtons onAction={onAction} />
        </div>
      </div>
    )
  }
)

function DragHandle(): React.JSX.Element {
  return (
    <div
      className="flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-muted-foreground/80 transition-colors"
      title="拖动移动"
    >
      <GripVertical className="size-4" />
    </div>
  )
}

function ActionButtons({ onAction }: { onAction: (action: number) => void }): React.JSX.Element {
  return (
    <div className="flex flex-row" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
      <ActionButton icon={Search} onClick={() => onAction(0)} />
      <ActionButton icon={NotebookText} onClick={() => onAction(1)} />
      <ActionButton icon={ImageIcon} onClick={() => onAction(2)} />
    </div>
  )
}

function ActionButton({
  icon: Icon,
  onClick
}: {
  icon: LucideIcon
  onClick: () => void
}): React.JSX.Element {
  return (
    <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={onClick}>
      <Icon />
    </Button>
  )
}
