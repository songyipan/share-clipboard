import { useState } from 'react'
import { useDarkMode } from '../../hooks/useDarkMode'
import { MarkdownEditor, MarkdownPreview, MarkdownSplitRow, type PreviewTheme } from '../markdown'
import { useSelectedText, useSyncEditWithSelected } from '../image-panel/imagePanelHooks'
import { NotebookPanelToolbar } from './NotebookPanelToolbar'

export function NotebookPanel(): React.JSX.Element {
  const lastSelectedText = useSelectedText()
  const [editText, setEditText] = useSyncEditWithSelected(lastSelectedText)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')
  const isDark = useDarkMode()

  const colorMode = previewOpen ? previewTheme : isDark ? 'dark' : 'light'
  const previewSource = editText || lastSelectedText

  return (
    <div className="w-full h-full flex flex-col bg-background" data-color-mode={colorMode}>
      <div
        className="flex items-center h-10 px-3 pt-2 shrink-0"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      />
      <div className="flex-1 flex flex-col min-h-0 px-3 pb-3 gap-2">
        <NotebookPanelToolbar
          previewOpen={previewOpen}
          onPreviewOpenChange={setPreviewOpen}
          previewTheme={previewTheme}
          onPreviewThemeChange={setPreviewTheme}
        />
        <MarkdownSplitRow
          showPreview={previewOpen}
          editor={<MarkdownEditor value={editText} onChange={setEditText} />}
          preview={<MarkdownPreview source={previewSource} />}
        />
      </div>
    </div>
  )
}
