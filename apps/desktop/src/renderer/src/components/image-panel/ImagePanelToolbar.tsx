import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { TabsList, TabsTrigger } from '@share-clipboard/ui/components/tabs'
import { useI18n } from '@share-clipboard/i18n'
import { ConfigPanel, useCodeCardConfig, exportAsImage } from '../CodeCard'
import { MarkdownPreviewThemeSelect } from '../markdown'
import type { PreviewTheme } from '../markdown'
import { PROGRAMMING_LANGUAGES } from './imagePanelConstants'

interface ToolbarProps {
  activeTab: string
  previewTheme: PreviewTheme
  selectedLanguage: string
  onThemeChange: (theme: PreviewTheme) => void
  onLanguageChange: (lang: string) => void
  codeCardConfig: ReturnType<typeof useCodeCardConfig>
}

function EditControls({
  selectedLanguage,
  onLanguageChange
}: {
  selectedLanguage: string
  onLanguageChange: (lang: string) => void
}): React.JSX.Element {
  const { t } = useI18n()

  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="h-7 w-28 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PROGRAMMING_LANGUAGES.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.labelKey ? t(lang.labelKey) : lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function CodeCardControls({
  codeCardConfig
}: {
  codeCardConfig: ReturnType<typeof useCodeCardConfig>
}): React.JSX.Element {
  const handleExport = async (): Promise<void> => {
    const element = document.getElementById('code-card')
    if (element) {
      await exportAsImage(element, 'code-card.png')
    }
  }

  return (
    <ConfigPanel
      config={codeCardConfig}
      onThemeChange={codeCardConfig.setTheme}
      onWindowThemeChange={codeCardConfig.setWindowTheme}
      onBackgroundColorChange={codeCardConfig.setBackgroundColor}
      onExport={handleExport}
    />
  )
}

export function ImagePanelToolbar({
  activeTab,
  previewTheme,
  selectedLanguage,
  onThemeChange,
  onLanguageChange,
  codeCardConfig
}: ToolbarProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between shrink-0 gap-2">
      <TabsList>
        <TabsTrigger value="preview">{t('panel.preview')}</TabsTrigger>
        <TabsTrigger value="edit">{t('panel.edit')}</TabsTrigger>
        <TabsTrigger value="code-card">{t('panel.codeCard')}</TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
        {activeTab === 'preview' && (
          <MarkdownPreviewThemeSelect value={previewTheme} onValueChange={onThemeChange} />
        )}
        {(activeTab === 'edit' || activeTab === 'code-card') && (
          <EditControls selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
        )}
        {activeTab === 'code-card' && <CodeCardControls codeCardConfig={codeCardConfig} />}
      </div>
    </div>
  )
}
