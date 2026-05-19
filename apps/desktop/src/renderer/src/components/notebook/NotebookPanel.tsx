import { useState } from 'react'
import type { CSSProperties } from 'react'

import type { TFunction } from '@share-clipboard/i18n'
import { useI18n } from '@share-clipboard/i18n'

import { useDarkMode } from '../../hooks/useDarkMode'
import { useSelectedText } from '../image-panel/imagePanelHooks'
import { type PreviewTheme } from '../markdown'
import { NotebookEntryGate } from './NotebookEntryGate'
import { NotebookNoteList } from './NotebookNoteList'
import { NotebookPanelToolbar } from './NotebookPanelToolbar'
import { useNotebookExportActions } from './useNotebookExportActions'
import { useNotebookPanelEntry } from './useNotebookPanelEntry'
import { useNotebookWorkspace } from './useNotebookWorkspace'
import { NotebookWorkspaceEditor } from './NotebookWorkspaceEditor'
import type { NotebookWorkspaceHandlers } from './notebookWorkspaceTypes'

export function NotebookPanel(): React.JSX.Element {
  const { t } = useI18n()
  const lastSelectedText = useSelectedText()
  const nb = useNotebookWorkspace()
  const entry = useNotebookPanelEntry(nb, lastSelectedText, t)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')
  const isDark = useDarkMode()

  const canInsertSelection = lastSelectedText.trim().length > 0
  const colorMode = previewOpen ? previewTheme : isDark ? 'dark' : 'light'

  const exports = useNotebookExportActions(
    nb.activeId,
    nb.draftBody,
    nb.flushNow,
    nb.changeDraftBody,
    lastSelectedText,
    t
  )

  return (
    <div className="relative w-full h-full flex flex-col bg-background" data-color-mode={colorMode}>
      <div
        className="flex items-center h-10 px-3 pt-2 shrink-0"
        style={{ WebkitAppRegion: 'drag' } as CSSProperties}
      />
      <div className="flex-1 flex min-h-0 px-3 pb-3 gap-2">
        <aside className="w-36 shrink-0 flex flex-col border border-border rounded-md p-2 min-h-0">
          <NotebookNoteList
            notes={nb.notes}
            activeId={nb.activeId}
            onSelect={(id) => void nb.selectNote(id)}
            className="flex-1"
          />
        </aside>

        <NotebookMainColumn
          nb={nb}
          previewOpen={previewOpen}
          setPreviewOpen={setPreviewOpen}
          previewTheme={previewTheme}
          setPreviewTheme={setPreviewTheme}
          exportHint={exports.exportHint}
          canInsertSelection={canInsertSelection}
          previewSource={nb.activeId ? nb.draftBody : ''}
          t={t}
          onNewNote={() => void nb.addNote(lastSelectedText.trim() || undefined)}
          onExportPdf={() => void exports.exportPdf()}
          onExportDocx={() => void exports.exportDocx()}
          onInsertSelection={exports.insertSelection}
        />
      </div>

      {!entry.workspaceReady ? (
        <NotebookEntryGate
          step={entry.gateStep}
          remark={entry.remark}
          busy={entry.gateBusy}
          onRemarkChange={entry.setRemark}
          onEditLater={entry.onEditLater}
          onEditNow={entry.onEditNow}
          onBack={entry.onBackFromLater}
          onSaveToList={() => void entry.onSaveToList()}
          t={t}
        />
      ) : null}
    </div>
  )
}

interface NotebookMainColumnProps {
  nb: NotebookWorkspaceHandlers
  previewOpen: boolean
  setPreviewOpen: (v: boolean) => void
  previewTheme: PreviewTheme
  setPreviewTheme: (v: PreviewTheme) => void
  exportHint: string
  canInsertSelection: boolean
  previewSource: string
  t: TFunction
  onNewNote: () => void
  onExportPdf: () => void
  onExportDocx: () => void
  onInsertSelection: () => void
}

function NotebookMainColumn({
  nb,
  previewOpen,
  setPreviewOpen,
  previewTheme,
  setPreviewTheme,
  exportHint,
  canInsertSelection,
  previewSource,
  t,
  onNewNote,
  onExportPdf,
  onExportDocx,
  onInsertSelection
}: NotebookMainColumnProps): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col min-w-0 gap-2">
      <NotebookPanelToolbar
        previewOpen={previewOpen}
        onPreviewOpenChange={setPreviewOpen}
        previewTheme={previewTheme}
        onPreviewThemeChange={setPreviewTheme}
        hasActiveNote={!!nb.activeId}
        saving={nb.saving}
        draftTitle={nb.draftTitle}
        onDraftTitleChange={nb.changeDraftTitle}
        onNewNote={onNewNote}
        onDeleteNote={() => void nb.removeActiveNote()}
        onExportPdf={onExportPdf}
        onExportDocx={onExportDocx}
        onInsertSelection={onInsertSelection}
        canInsertSelection={canInsertSelection}
      />

      {exportHint ? (
        <p className="text-[10px] text-muted-foreground truncate" role="status">
          {exportHint}
        </p>
      ) : null}

      {!nb.activeId ? (
        <div className="flex flex-1 min-h-[120px] items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground px-4 text-center">
          {nb.notes.length === 0 ? t('panel.noNotesYet') : t('panel.pickOrCreateNote')}
        </div>
      ) : (
        <NotebookWorkspaceEditor
          showPreview={previewOpen}
          draftBody={nb.draftBody}
          previewSource={previewSource}
          onBodyChange={nb.changeDraftBody}
        />
      )}
    </div>
  )
}
