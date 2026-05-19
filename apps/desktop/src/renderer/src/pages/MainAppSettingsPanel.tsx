import { Languages, Monitor, Moon, Settings2, Sun } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@share-clipboard/ui/components/card'
import { useI18n, isLanguage } from '@share-clipboard/i18n'
import { type Theme, useTheme, isTheme } from '@share-clipboard/ui/theme'

import { PreferenceSelect } from '../components/settings/PreferenceSelect'
import { TriggerSettingsSection } from '../components/settings/TriggerSettingsSection'

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
        <TriggerSettingsSection />
      </CardContent>
    </Card>
  )
}

function getThemeIcon(theme: Theme): React.ReactNode {
  if (theme === 'light') return <Sun className="size-4" aria-hidden="true" />
  if (theme === 'dark') return <Moon className="size-4" aria-hidden="true" />
  return <Monitor className="size-4" aria-hidden="true" />
}
