import { useI18n } from '@share-clipboard/i18n'
import { Button } from '@share-clipboard/ui/components/button'
import { Eye, EyeOff } from 'lucide-react'
import { MarkdownPreviewThemeSelect, type PreviewTheme } from '../markdown'

import type { NotebookToolbarNoteActionsProps } from './NotebookToolbarNoteActions'
import { NotebookToolbarNoteActions } from './NotebookToolbarNoteActions'

export interface NotebookPanelToolbarProps extends NotebookToolbarNoteActionsProps {
  previewOpen: boolean
  onPreviewOpenChange: (open: boolean) => void
  previewTheme: PreviewTheme
  onPreviewThemeChange: (theme: PreviewTheme) => void
  saving: boolean
}

export function NotebookPanelToolbar({
  previewOpen,
  onPreviewOpenChange,
  previewTheme,
  onPreviewThemeChange,
  saving,
  ...noteActions
}: NotebookPanelToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <NotebookToolbarTopRow
        previewOpen={previewOpen}
        onPreviewOpenChange={onPreviewOpenChange}
        previewTheme={previewTheme}
        onPreviewThemeChange={onPreviewThemeChange}
        saving={saving}
      />
      <NotebookToolbarNoteActions {...noteActions} />
    </div>
  )
}

function NotebookToolbarTopRow({
  previewOpen,
  onPreviewOpenChange,
  previewTheme,
  onPreviewThemeChange,
  saving
}: Pick<
  NotebookPanelToolbarProps,
  'previewOpen' | 'onPreviewOpenChange' | 'previewTheme' | 'onPreviewThemeChange' | 'saving'
>): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-muted-foreground font-medium shrink-0">
          {t('panel.notebookTitle')}
        </span>
        {saving ? (
          <span className="text-[10px] text-muted-foreground">{t('panel.noteSaving')}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2 shrink-0">
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
