import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { PREVIEW_THEMES, type PreviewTheme } from './markdownConstants'

interface MarkdownPreviewThemeSelectProps {
  value: PreviewTheme
  onValueChange: (theme: PreviewTheme) => void
}

export function MarkdownPreviewThemeSelect({
  value,
  onValueChange
}: MarkdownPreviewThemeSelectProps): React.JSX.Element {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as PreviewTheme)}>
      <SelectTrigger className="h-7 w-24 text-xs">
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
  )
}
