import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { TabsList, TabsTrigger } from '@share-clipboard/ui/components/tabs'
import { useI18n } from '@share-clipboard/i18n'
import { ConfigPanel, useCodeCardConfig, exportAsImage } from './CodeCard'
import { PREVIEW_THEMES, PROGRAMMING_LANGUAGES, type PreviewTheme } from './imagePanelConstants'

interface ToolbarProps {
  activeTab: string
  previewTheme: PreviewTheme
  selectedLanguage: string
  onThemeChange: (theme: PreviewTheme) => void
  onLanguageChange: (lang: string) => void
  codeCardConfig: ReturnType<typeof useCodeCardConfig>
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

  const handleExport = async (): Promise<void> => {
    const element = document.getElementById('code-card')
    if (element) {
      await exportAsImage(element, 'code-card.png')
    }
  }

  return (
    <div className="flex items-center justify-between shrink-0 gap-2">
      <TabsList>
        <TabsTrigger value="preview">{t('panel.preview')}</TabsTrigger>
        <TabsTrigger value="edit">{t('panel.edit')}</TabsTrigger>
        <TabsTrigger value="code-card">{t('panel.codeCard')}</TabsTrigger>
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
