import { Keyboard, MousePointerClick } from 'lucide-react'

import { Label } from '@share-clipboard/ui/components/label'
import { useI18n } from '@share-clipboard/i18n'
import { isTriggerMode } from '../../../../shared/appPreferences'

import { useAppPreferences } from '../../hooks/useAppPreferences'
import { PreferenceSelect } from './PreferenceSelect'
import { ShortcutRecorder } from './ShortcutRecorder'

export function TriggerSettingsSection(): React.JSX.Element | null {
  const { t } = useI18n()
  const { preferences, saving, error, setTriggerMode, setShortcut } = useAppPreferences()

  if (!preferences) return null

  const shortcutDisabled = preferences.triggerMode !== 'shortcut' || saving

  return (
    <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
      <PreferenceSelect
        id="trigger-mode"
        icon={<MousePointerClick className="size-4" aria-hidden="true" />}
        label={t('settings.triggerMode')}
        value={preferences.triggerMode}
        options={[
          { value: 'auto', label: t('settings.triggerModeAuto') },
          { value: 'shortcut', label: t('settings.triggerModeShortcut') }
        ]}
        onValueChange={(value) => {
          if (isTriggerMode(value)) void setTriggerMode(value)
        }}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label className="flex items-center gap-2">
          <Keyboard className="size-4" aria-hidden="true" />
          {t('settings.shortcutLabel')}
        </Label>
        <ShortcutRecorder
          value={preferences.shortcut}
          disabled={shortcutDisabled}
          onChange={(shortcut) => void setShortcut(shortcut)}
        />
        <p className="text-xs text-muted-foreground">
          {preferences.triggerMode === 'auto'
            ? t('settings.shortcutHintAuto')
            : t('settings.shortcutHintShortcut')}
        </p>
        {error ? (
          <p className="text-xs text-destructive" role="alert">
            {t('settings.shortcutRegisterFailed')}
          </p>
        ) : null}
      </div>
    </div>
  )
}
