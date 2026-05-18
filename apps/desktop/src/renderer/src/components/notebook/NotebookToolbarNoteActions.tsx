import { useI18n } from '@share-clipboard/i18n'
import { Button } from '@share-clipboard/ui/components/button'
import { Input } from '@share-clipboard/ui/components/input'
import { ClipboardPaste, FileDown, FileType, Plus, Trash2 } from 'lucide-react'

export interface NotebookToolbarNoteActionsProps {
  hasActiveNote: boolean
  draftTitle: string
  onDraftTitleChange: (value: string) => void
  onNewNote: () => void
  onDeleteNote: () => void
  onExportPdf: () => void
  onExportDocx: () => void
  onInsertSelection: () => void
  canInsertSelection: boolean
}

export function NotebookToolbarNoteActions({
  hasActiveNote,
  draftTitle,
  onDraftTitleChange,
  onNewNote,
  onDeleteNote,
  onExportPdf,
  onExportDocx,
  onInsertSelection,
  canInsertSelection
}: NotebookToolbarNoteActionsProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        value={draftTitle}
        onChange={(e) => onDraftTitleChange(e.target.value)}
        disabled={!hasActiveNote}
        placeholder={t('panel.noteTitlePlaceholder')}
        className="h-8 text-xs flex-1 min-w-[8rem] sm:max-w-[14rem]"
        aria-label={t('panel.noteTitlePlaceholder')}
      />
      <NotebookPrimaryNoteActions
        hasActiveNote={hasActiveNote}
        canInsertSelection={canInsertSelection}
        onNewNote={onNewNote}
        onDeleteNote={onDeleteNote}
        onInsertSelection={onInsertSelection}
      />
      <NotebookExportNoteActions
        hasActiveNote={hasActiveNote}
        onExportPdf={onExportPdf}
        onExportDocx={onExportDocx}
      />
    </div>
  )
}

function NotebookPrimaryNoteActions({
  hasActiveNote,
  canInsertSelection,
  onNewNote,
  onDeleteNote,
  onInsertSelection
}: {
  hasActiveNote: boolean
  canInsertSelection: boolean
  onNewNote: () => void
  onDeleteNote: () => void
  onInsertSelection: () => void
}): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={onNewNote}
      >
        <Plus className="size-3.5" aria-hidden />
        {t('panel.newNote')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={onDeleteNote}
        disabled={!hasActiveNote}
      >
        <Trash2 className="size-3.5" aria-hidden />
        {t('panel.deleteNote')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        disabled={!canInsertSelection}
        onClick={onInsertSelection}
      >
        <ClipboardPaste className="size-3.5" aria-hidden />
        {t('panel.insertSelection')}
      </Button>
    </div>
  )
}

function NotebookExportNoteActions({
  hasActiveNote,
  onExportPdf,
  onExportDocx
}: {
  hasActiveNote: boolean
  onExportPdf: () => void
  onExportDocx: () => void
}): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        disabled={!hasActiveNote}
        onClick={onExportPdf}
      >
        <FileDown className="size-3.5" aria-hidden />
        {t('panel.exportPdf')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        disabled={!hasActiveNote}
        onClick={onExportDocx}
      >
        <FileType className="size-3.5" aria-hidden />
        {t('panel.exportWord')}
      </Button>
    </div>
  )
}
