import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { useI18n, type I18nKey } from '@share-clipboard/i18n'
import { PREVIEW_THEMES, type PreviewTheme } from './markdownConstants'

const PREVIEW_THEME_LABEL_KEYS: Record<PreviewTheme, I18nKey> = {
  light: 'settings.light',
  dark: 'settings.dark'
}

interface MarkdownPreviewThemeSelectProps {
  value: PreviewTheme
  onValueChange: (theme: PreviewTheme) => void
}

export function MarkdownPreviewThemeSelect({
  value,
  onValueChange
}: MarkdownPreviewThemeSelectProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as PreviewTheme)}>
      <SelectTrigger className="h-7 w-24 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PREVIEW_THEMES.map((key) => (
          <SelectItem key={key} value={key}>
            {t(PREVIEW_THEME_LABEL_KEYS[key])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
