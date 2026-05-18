import { Languages, Monitor, Moon, Settings2, Sun } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@share-clipboard/ui/components/card'
import { Label } from '@share-clipboard/ui/components/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'
import { useI18n, isLanguage } from '@share-clipboard/i18n'
import { type Theme, useTheme, isTheme } from '@share-clipboard/ui/theme'

interface PreferenceSelectProps {
  id: string
  icon: React.ReactNode
  label: string
  value: string
  options: { value: string; label: string }[]
  onValueChange: (value: string) => void
}

export function MainAppSettingsPanel(): React.JSX.Element {
  const { language, setLanguage, t } = useI18n()
  const { theme, setTheme } = useTheme()

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="size-4" aria-hidden="true" />
          {t('main.settings')}
        </CardTitle>
        <CardDescription>{t('main.settingsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <PreferenceSelect
          id="app-language"
          icon={<Languages className="size-4" aria-hidden="true" />}
          label={t('main.language')}
          value={language}
          options={[
            { value: 'zh-CN', label: t('settings.chinese') },
            { value: 'en-US', label: t('settings.english') }
          ]}
          onValueChange={(value) => {
            if (isLanguage(value)) setLanguage(value)
          }}
        />
        <PreferenceSelect
          id="app-theme"
          icon={getThemeIcon(theme)}
          label={t('main.theme')}
          value={theme}
          options={[
            { value: 'system', label: t('settings.system') },
            { value: 'light', label: t('settings.light') },
            { value: 'dark', label: t('settings.dark') }
          ]}
          onValueChange={(value) => {
            if (isTheme(value)) setTheme(value)
          }}
        />
      </CardContent>
    </Card>
  )
}

function PreferenceSelect({
  id,
  icon,
  label,
  value,
  options,
  onValueChange
}: PreferenceSelectProps): React.JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

function getThemeIcon(theme: Theme): React.ReactNode {
  if (theme === 'light') return <Sun className="size-4" aria-hidden="true" />
  if (theme === 'dark') return <Moon className="size-4" aria-hidden="true" />
  return <Monitor className="size-4" aria-hidden="true" />
}
