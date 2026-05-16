import { useEffect, useRef, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@share-clipboard/ui/components/tabs'
import { CodeCard, ConfigPanel, useCodeCardConfig, exportAsImage } from './CodeCard'

type PreviewTheme = 'light' | 'dark'

const PREVIEW_THEMES: Record<PreviewTheme, { label: string }> = {
  light: { label: '浅色' },
  dark: { label: '深色' }
}

const PROGRAMMING_LANGUAGES = [
  { value: 'plaintext', label: '纯文本' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' }
]

function wrapCodeWithLanguage(text: string, language: string): string {
  if (!text.trim()) return text
  // 简单但更安全的清理方式
  let cleanedText = text.trim()
  // 检查是否有开头的 ```
  if (cleanedText.startsWith('```')) {
    const firstNewlineIndex = cleanedText.indexOf('\n')
    if (firstNewlineIndex !== -1) {
      cleanedText = cleanedText.slice(firstNewlineIndex + 1)
    }
  }
  // 检查是否有结尾的 ```
  if (cleanedText.endsWith('```')) {
    cleanedText = cleanedText.slice(0, -3)
  }
  cleanedText = cleanedText.trim()
  return language === 'plaintext' ? cleanedText : `\`\`\`${language}\n${cleanedText}\n\`\`\``
}

function useSelectedText(): string {
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false
    window.api.getLastSelectedText().then((t) => {
      if (!cancelled) setText(t)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return text
}

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent): void => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isDark
}

function useSyncEditWithSelected(
  lastSelectedText: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [editText, setEditText] = useState(lastSelectedText)
  const lastSelectedTextRef = useRef(lastSelectedText)

  useEffect(() => {
    if (lastSelectedTextRef.current !== lastSelectedText) {
      lastSelectedTextRef.current = lastSelectedText
      setEditText(lastSelectedText)
    }
  }, [lastSelectedText])

  return [editText, setEditText]
}

interface ImagePanelState {
  activeTab: string
  previewTheme: PreviewTheme
  selectedLanguage: string
}

function useImagePanelState(): ImagePanelState & {
  setActiveTab: (tab: string) => void
  setPreviewTheme: (theme: PreviewTheme) => void
  setSelectedLanguage: (lang: string) => void
} {
  const [activeTab, setActiveTab] = useState('preview')
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')
  const [selectedLanguage, setSelectedLanguage] = useState('plaintext')

  return {
    activeTab,
    previewTheme,
    selectedLanguage,
    setActiveTab,
    setPreviewTheme,
    setSelectedLanguage
  }
}

interface ToolbarProps {
  activeTab: string
  previewTheme: PreviewTheme
  selectedLanguage: string
  onThemeChange: (theme: PreviewTheme) => void
  onLanguageChange: (lang: string) => void
  codeCardConfig: ReturnType<typeof useCodeCardConfig>
}

function Toolbar({
  activeTab,
  previewTheme,
  selectedLanguage,
  onThemeChange,
  onLanguageChange,
  codeCardConfig
}: ToolbarProps): React.JSX.Element {
  const handleExport = async (): Promise<void> => {
    const element = document.getElementById('code-card')
    if (element) {
      await exportAsImage(element, 'code-card.png')
    }
  }

  return (
    <div className="flex items-center justify-between shrink-0 gap-2">
      <TabsList>
        <TabsTrigger value="preview">预览</TabsTrigger>
        <TabsTrigger value="edit">编辑</TabsTrigger>
        <TabsTrigger value="code-card">代码卡片</TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
        {activeTab === 'preview' && (
          <Select value={previewTheme} onValueChange={(v) => onThemeChange(v as PreviewTheme)}>
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PREVIEW_THEMES) as PreviewTheme[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {PREVIEW_THEMES[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {activeTab === 'edit' && (
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-28 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {activeTab === 'code-card' && (
          <ConfigPanel
            config={codeCardConfig}
            onThemeChange={codeCardConfig.setTheme}
            onWindowThemeChange={codeCardConfig.setWindowTheme}
            onBackgroundColorChange={codeCardConfig.setBackgroundColor}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  )
}

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
          <Toolbar
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
