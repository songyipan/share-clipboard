import { useI18n } from '@share-clipboard/i18n'
import { Button } from '@share-clipboard/ui/components/button'
import { Eye, EyeOff } from 'lucide-react'
import { MarkdownPreviewThemeSelect, type PreviewTheme } from '../markdown'

interface NotebookPanelToolbarProps {
  previewOpen: boolean
  onPreviewOpenChange: (open: boolean) => void
  previewTheme: PreviewTheme
  onPreviewThemeChange: (theme: PreviewTheme) => void
}

export function NotebookPanelToolbar({
  previewOpen,
  onPreviewOpenChange,
  previewTheme,
  onPreviewThemeChange
}: NotebookPanelToolbarProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between shrink-0 gap-2">
      <div className="text-xs text-muted-foreground font-medium">{t('panel.notebookTitle')}</div>
      <div className="flex items-center gap-2">
        {previewOpen ? (
          <MarkdownPreviewThemeSelect value={previewTheme} onValueChange={onPreviewThemeChange} />
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => onPreviewOpenChange(!previewOpen)}
          aria-pressed={previewOpen}
          aria-label={previewOpen ? t('panel.hidePreview') : t('panel.showPreview')}
        >
          {previewOpen ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {previewOpen ? t('panel.hidePreview') : t('panel.showPreview')}
        </Button>
      </div>
    </div>
  )
}
