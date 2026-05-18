import { Button } from '@share-clipboard/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { useI18n } from '@share-clipboard/i18n'
import type { CodeCardConfig, CodeCardTheme, WindowTheme } from './types'
import {
  BACKGROUND_COLORS,
  CODE_CARD_THEMES,
  WINDOW_THEME_KEYS,
  WINDOW_THEME_LABEL_KEYS
} from './types'

interface ConfigPanelProps {
  config: CodeCardConfig
  onThemeChange: (theme: CodeCardTheme) => void
  onWindowThemeChange: (theme: WindowTheme) => void
  onBackgroundColorChange: (color: string) => void
  onExport: () => void
}

export function ConfigPanel({
  config,
  onThemeChange,
  onWindowThemeChange,
  onBackgroundColorChange,
  onExport
}: ConfigPanelProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={config.theme} onValueChange={onThemeChange as (v: string) => void}>
        <SelectTrigger className="w-32 h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(CODE_CARD_THEMES) as CodeCardTheme[]).map((theme) => (
            <SelectItem key={theme} value={theme}>
              {CODE_CARD_THEMES[theme].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={config.windowTheme} onValueChange={onWindowThemeChange as (v: string) => void}>
        <SelectTrigger className="w-24 h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WINDOW_THEME_KEYS.map((theme) => (
            <SelectItem key={theme} value={theme}>
              {t(WINDOW_THEME_LABEL_KEYS[theme])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={config.backgroundColor} onValueChange={onBackgroundColorChange}>
        <SelectTrigger
          className="w-28 h-7 text-xs"
          title="画布背景渐变（非代码语言）"
          aria-label="画布背景渐变"
        >
          <SelectValue placeholder="背景" />
        </SelectTrigger>
        <SelectContent>
          {BACKGROUND_COLORS.map((bg) => (
            <SelectItem key={bg.value} value={bg.value}>
              {t(bg.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" onClick={onExport}>
        导出图片
      </Button>
    </div>
  )
}
