import { useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { loadLanguage } from '@uiw/codemirror-extensions-langs'
import type { Extension } from '@codemirror/state'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { xcodeDark, xcodeLight } from '@uiw/codemirror-theme-xcode'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@share-clipboard/ui/components/tabs'

type EditorTheme = 'github' | 'xcode' | 'dracula' | 'vscode' | 'onedark'

interface ThemeOption {
  label: string
  light: Extension
  dark: Extension
}

const THEMES: Record<EditorTheme, ThemeOption> = {
  github: { label: 'GitHub', light: githubLight, dark: githubDark },
  xcode: { label: 'Xcode', light: xcodeLight, dark: xcodeDark },
  dracula: { label: 'Dracula', light: dracula, dark: dracula },
  vscode: { label: 'VS Code', light: vscodeDark, dark: vscodeDark },
  onedark: { label: 'One Dark', light: oneDark, dark: oneDark }
}

const langAliases: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  shell: 'bash',
  yaml: 'yml'
}

type PreviewMode = 'render' | 'source'

type LangKey =
  | 'markdown'
  | 'html'
  | 'json'
  | 'javascript'
  | 'python'
  | 'cpp'
  | 'c'
  | 'typescript'
  | 'java'
  | 'rust'
  | 'go'
  | 'php'
  | 'ruby'
  | 'shell'
  | 'sql'
  | 'yaml'
  | 'xml'
  | 'css'

const VALID_LANGS: LangKey[] = [
  'markdown',
  'html',
  'json',
  'javascript',
  'python',
  'cpp',
  'c',
  'typescript',
  'java',
  'rust',
  'go',
  'php',
  'ruby',
  'shell',
  'sql',
  'yaml',
  'xml',
  'css'
]

function isValidLangKey(key: string): key is LangKey {
  return VALID_LANGS.includes(key as LangKey)
}

function detectLanguage(text: string): LangKey | null {
  const trimmed = text.trim()
  const codeBlockMatch = trimmed.match(/^```(\w+)/)
  if (codeBlockMatch) {
    const matched = codeBlockMatch[1] as string
    if (isValidLangKey(matched)) return matched
    if (matched === 'js' || matched === 'jsx') return 'javascript'
    if (matched === 'ts' || matched === 'tsx') return 'typescript'
    if (matched === 'py') return 'python'
    if (matched === 'sh' || matched === 'bash') return 'shell'
    if (matched === 'yml') return 'yaml'
    return null
  }

  if (trimmed.startsWith('<!DOCTYPE html>') || trimmed.startsWith('<html')) return 'html'
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json'
  if (trimmed.startsWith('import ') || /^(const|let|var|function|export)\s/.test(trimmed))
    return 'javascript'
  if (/^(def|import|from|class)\s/.test(trimmed)) return 'python'
  if (/^(#include|int main|void|char|float|double)/.test(trimmed)) return 'cpp'

  return null
}

function getLanguageExtension(text: string, manualLang?: LangKey): Extension[] {
  const lang = manualLang || detectLanguage(text)
  if (!lang) return [markdown()]

  const loaded = loadLanguage(lang as Parameters<typeof loadLanguage>[0])
  if (loaded) return [loaded]

  if (lang === 'cpp' || lang === 'c') {
    const cExt = loadLanguage('c')
    if (cExt) return [cExt]
  }

  return [markdown()]
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

function useMarkdownLike(text: string): boolean {
  return useMemo(() => {
    const trimmed = text.trim()
    return (
      trimmed.startsWith('#') ||
      trimmed.includes('```') ||
      trimmed.includes('**') ||
      trimmed.includes('__') ||
      trimmed.includes('|') ||
      trimmed.includes('- ') ||
      trimmed.includes('> ')
    )
  }, [text])
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
  editorTheme: EditorTheme
  previewMode: PreviewMode
  selectedLang: LangKey | 'auto'
}

function useImagePanelState(): ImagePanelState & {
  setActiveTab: (tab: string) => void
  setEditorTheme: (theme: EditorTheme) => void
  setPreviewMode: (mode: PreviewMode) => void
  setSelectedLang: (lang: LangKey | 'auto') => void
} {
  const [activeTab, setActiveTab] = useState('preview')
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('github')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('render')
  const [selectedLang, setSelectedLang] = useState<LangKey | 'auto'>('auto')

  return {
    activeTab,
    editorTheme,
    previewMode,
    selectedLang,
    setActiveTab,
    setEditorTheme,
    setPreviewMode,
    setSelectedLang
  }
}

interface UseImagePanelDerivedProps {
  editText: string
  lastSelectedText: string
  editorTheme: EditorTheme
  selectedLang: LangKey | 'auto'
  isDark: boolean
}

interface UseImagePanelDerivedReturn {
  currentTheme: Extension
  languageExts: Extension[]
  displaySource: string
  isMarkdownLike: boolean
}

function useImagePanelDerived({
  editText,
  lastSelectedText,
  editorTheme,
  selectedLang,
  isDark
}: UseImagePanelDerivedProps): UseImagePanelDerivedReturn {
  const currentTheme = useMemo(() => {
    const option = THEMES[editorTheme]
    return isDark ? option.dark : option.light
  }, [editorTheme, isDark])

  const languageExts = useMemo(
    () =>
      getLanguageExtension(
        editText || lastSelectedText,
        selectedLang === 'auto' ? undefined : selectedLang
      ),
    [editText, lastSelectedText, selectedLang]
  )

  const displaySource = editText || lastSelectedText
  const isMarkdownLike = useMarkdownLike(displaySource)

  return {
    currentTheme,
    languageExts,
    displaySource,
    isMarkdownLike
  }
}

interface ToolbarProps {
  activeTab: string
  isMarkdownLike: boolean
  previewMode: PreviewMode
  editorTheme: EditorTheme
  selectedLang: LangKey | 'auto'
  onPreviewModeChange: (mode: PreviewMode) => void
  onThemeChange: (theme: EditorTheme) => void
  onLangChange: (lang: LangKey | 'auto') => void
}

function Toolbar({
  editorTheme,
  selectedLang,

  onThemeChange,
  onLangChange
}: ToolbarProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between shrink-0 gap-2">
      <TabsList>
        <TabsTrigger value="preview">预览</TabsTrigger>
        <TabsTrigger value="edit">编辑</TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
        <Select value={selectedLang} onValueChange={(v) => onLangChange(v as LangKey | 'auto')}>
          <SelectTrigger className="w-28 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">自动检测</SelectItem>
            {VALID_LANGS.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={editorTheme} onValueChange={(v) => onThemeChange(v as EditorTheme)}>
          <SelectTrigger className="w-28 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(THEMES) as EditorTheme[]).map((key) => (
              <SelectItem key={key} value={key}>
                {THEMES[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

interface PreviewPaneProps {
  source: string
  isMarkdownLike: boolean
  previewMode: PreviewMode
  theme: Extension
  languageExts: Extension[]
}

function PreviewPane({
  source,
  isMarkdownLike,
  previewMode,
  theme,
  languageExts
}: PreviewPaneProps): React.JSX.Element {
  if (previewMode === 'render' && isMarkdownLike) {
    return (
      <div className="w-full h-full rounded-md border border-input overflow-auto">
        <MarkdownPreview source={source} className="p-4" style={{ background: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-md border border-input overflow-auto">
      <CodeMirror
        value={source}
        height="100%"
        theme={theme}
        extensions={languageExts}
        editable={false}
        basicSetup={{ lineNumbers: true, foldGutter: true }}
        className="h-full text-sm"
      />
    </div>
  )
}

interface EditorPaneProps {
  value: string
  theme: Extension
  languageExts: Extension[]
  onChange: (value: string) => void
}

function EditorPane({ value, theme, languageExts, onChange }: EditorPaneProps): React.JSX.Element {
  return (
    <div className="w-full h-full rounded-md border border-input overflow-hidden">
      <CodeMirror
        value={value}
        height="100%"
        theme={theme}
        extensions={languageExts}
        onChange={(v) => onChange(v)}
        basicSetup={{ lineNumbers: true, foldGutter: true }}
        className="h-full text-sm"
        placeholder="在此编辑内容..."
      />
    </div>
  )
}

export function ImagePanel(): React.JSX.Element {
  const lastSelectedText = useSelectedText()
  const [editText, setEditText] = useSyncEditWithSelected(lastSelectedText)
  const state = useImagePanelState()
  const isDark = useDarkMode()
  const derived = useImagePanelDerived({
    editText,
    lastSelectedText,
    editorTheme: state.editorTheme,
    selectedLang: state.selectedLang,
    isDark
  })

  const handleLangChange = (lang: LangKey | 'auto'): void => {
    state.setSelectedLang(lang)

    if (lang === 'auto') return

    const alias = langAliases[lang] || lang
    const trimmed = editText.trim()

    // 检查是否已经有代码块包裹
    const codeBlockRegex = /^```(\w+)?\s*([\s\S]*?)\s*```$/
    const match = trimmed.match(codeBlockRegex)

    if (match) {
      // 替换现有代码块的语言标识
      const content = match[2] || trimmed
      setEditText(`\`\`\`${alias}\n${content}\n\`\`\``)
    } else {
      // 包裹新代码块
      setEditText(`\`\`\`${alias}\n${trimmed}\n\`\`\``)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
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
            isMarkdownLike={derived.isMarkdownLike}
            previewMode={state.previewMode}
            editorTheme={state.editorTheme}
            selectedLang={state.selectedLang}
            onPreviewModeChange={state.setPreviewMode}
            onThemeChange={state.setEditorTheme}
            onLangChange={handleLangChange}
          />
          <TabsContent value="preview" className="flex-1 min-h-0 mt-2">
            <PreviewPane
              source={derived.displaySource}
              isMarkdownLike={derived.isMarkdownLike}
              previewMode={state.previewMode}
              theme={derived.currentTheme}
              languageExts={derived.languageExts}
            />
          </TabsContent>
          <TabsContent value="edit" className="flex-1 min-h-0 mt-2">
            <EditorPane
              value={editText}
              theme={derived.currentTheme}
              languageExts={derived.languageExts}
              onChange={setEditText}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
