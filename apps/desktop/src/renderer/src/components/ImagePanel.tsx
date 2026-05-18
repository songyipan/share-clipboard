import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { Tabs, TabsContent } from '@share-clipboard/ui/components/tabs'
import { CodeCard, useCodeCardConfig } from './CodeCard'
import { wrapCodeWithLanguage } from './imagePanelCode'
import {
  useDarkMode,
  useImagePanelState,
  useSelectedText,
  useSyncEditWithSelected
} from './imagePanelHooks'
import { ImagePanelToolbar } from './ImagePanelToolbar'

export function ImagePanel(): React.JSX.Element {
  const lastSelectedText = useSelectedText()
  const [editText, setEditText] = useSyncEditWithSelected(lastSelectedText)
  const state = useImagePanelState()
  const isDark = useDarkMode()
  const codeCardConfig = useCodeCardConfig()

  const colorMode = state.activeTab === 'preview' ? state.previewTheme : isDark ? 'dark' : 'light'
  const content = editText || lastSelectedText

  const handleLanguageChange = (language: string): void => {
    state.setSelectedLanguage(language)
    setEditText(wrapCodeWithLanguage(content, language))
  }

  return (
    <div className="w-full h-full flex flex-col bg-background" data-color-mode={colorMode}>
      <div
        className="flex items-center h-10 px-3 pt-2 shrink-0"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      />
      <div className="flex-1 flex flex-col min-h-0 px-3 pb-3 gap-2">
        <Tabs
          value={state.activeTab}
          onValueChange={state.setActiveTab}
          className="flex flex-col flex-1 min-h-0"
        >
          <ImagePanelToolbar
            activeTab={state.activeTab}
            previewTheme={state.previewTheme}
            selectedLanguage={state.selectedLanguage}
            onThemeChange={state.setPreviewTheme}
            onLanguageChange={handleLanguageChange}
            codeCardConfig={codeCardConfig}
          />
          <TabsContent value="preview" className="flex-1 min-h-0 mt-2">
            <div className="w-full h-full rounded-md border border-input overflow-auto">
              <MDEditor.Markdown
                source={content}
                className="p-4 !bg-transparent"
                style={{ background: 'transparent' }}
              />
            </div>
          </TabsContent>
          <TabsContent value="edit" className="flex-1 min-h-0 mt-2">
            <div className="w-full h-full rounded-md border border-input overflow-hidden">
              <MDEditor
                value={editText}
                onChange={(v) => setEditText(v || '')}
                height="100%"
                preview="edit"
                hideToolbar
                visibleDragbar={false}
                style={{ background: 'transparent' }}
              />
            </div>
          </TabsContent>
          <TabsContent value="code-card" className="flex-1 min-h-0 mt-2">
            <CodeCard content={content} config={codeCardConfig} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
