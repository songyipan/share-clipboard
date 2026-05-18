import { Button } from '@share-clipboard/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import type { CodeCardConfig, CodeCardTheme, WindowTheme } from './types'
import { CODE_CARD_THEMES, WINDOW_THEMES, BACKGROUND_COLORS } from './types'

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
          {(Object.keys(WINDOW_THEMES) as WindowTheme[]).map((theme) => (
            <SelectItem key={theme} value={theme}>
              {WINDOW_THEMES[theme].label}
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
          {BACKGROUND_COLORS.map((bg, idx) => (
            <SelectItem key={idx} value={bg.value}>
              {bg.label}
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
