import { useState } from 'react'

import { Button } from '@share-clipboard/ui/components/button'
import { Input } from '@share-clipboard/ui/components/input'
import { useI18n } from '@share-clipboard/i18n'

import { acceleratorFromKeyboardEvent } from '../../../../shared/shortcutCapture'
import { formatShortcutLabel } from '../../../../shared/shortcutDisplay'

interface ShortcutRecorderProps {
  value: string
  disabled?: boolean
  onChange: (shortcut: string) => void
}

export function ShortcutRecorder({
  value,
  disabled,
  onChange
}: ShortcutRecorderProps): React.JSX.Element {
  const { t } = useI18n()
  const [recording, setRecording] = useState(false)
  const isMac = window.electron.process.platform === 'darwin'

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!recording) return
    event.preventDefault()
    event.stopPropagation()

    const accelerator = acceleratorFromKeyboardEvent(event.nativeEvent, isMac)
    if (!accelerator) return

    setRecording(false)
    onChange(accelerator)
  }

  return (
    <div className="flex gap-2" role="group">
      <Input
        readOnly
        value={formatShortcutLabel(value, isMac)}
        placeholder={t('settings.shortcutPlaceholder')}
        onKeyDown={handleKeyDown}
        onBlur={() => setRecording(false)}
        disabled={disabled}
        className={recording ? 'ring-2 ring-primary' : undefined}
        aria-label={t('settings.shortcutLabel')}
      />
      <Button
        type="button"
        variant={recording ? 'default' : 'outline'}
        size="sm"
        className="shrink-0"
        disabled={disabled}
        onClick={() => setRecording((v) => !v)}
      >
        {recording ? t('settings.shortcutRecording') : t('settings.shortcutRecord')}
      </Button>
    </div>
  )
}
