import { useI18n } from '@share-clipboard/i18n'

interface NotebookPanelProps {
  children?: React.ReactNode
}

export function NotebookPanel({ children }: NotebookPanelProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div
        className="flex items-center h-10 px-3 pt-2"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      ></div>
      <div className="flex-1 p-3 text-sm text-muted-foreground flex items-center justify-center">
        {children || t('panel.notebookTitle')}
      </div>
    </div>
  )
}
