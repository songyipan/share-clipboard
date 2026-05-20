import { ShieldAlert } from 'lucide-react'
import { Button } from '@share-clipboard/ui/components/button'
import { useI18n, type TFunction } from '@share-clipboard/i18n'

import { formatShortcutLabel } from '../../../shared/shortcutDisplay'
import { useStatusCardState } from '../hooks/useStatusCardState'

export function StatusCard(): React.JSX.Element {
  const { t } = useI18n()
  const state = useStatusCardState()

  const needsPermission = state.permission?.required && !state.permission.granted
  const isActive = !needsPermission && state.listenerActive
  const isMac = window.electron.process.platform === 'darwin'

  const modeHint = buildModeHint({
    needsPermission: !!needsPermission,
    isActive,
    preferences: state.preferences,
    isMac,
    t
  })

  const statusLabel = needsPermission
    ? t('main.permissionRequired')
    : isActive
      ? t('main.running')
      : t('main.paused')

  return (
    <div className="flex max-w-[200px] flex-col items-end gap-1.5 text-right" role="status" aria-live="polite">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs shadow-sm ${
          needsPermission
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
            : isActive
              ? 'border-primary/25 bg-primary/5 text-foreground'
              : 'border-border bg-muted/50 text-muted-foreground'
        }`}
        title={modeHint}
      >
        {needsPermission ? (
          <ShieldAlert className="size-3 shrink-0" aria-hidden="true" />
        ) : (
          <span
            className={`size-1.5 shrink-0 rounded-full ${
              isActive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
            }`}
            aria-hidden="true"
          />
        )}
        <span className="font-medium leading-none">{statusLabel}</span>
      </div>

      <p className="line-clamp-2 text-[10px] leading-snug text-muted-foreground" title={modeHint}>
        {modeHint}
      </p>

      {needsPermission ? (
        <PermissionActions
          canPrompt={state.permission?.canPrompt ?? false}
          onRequest={() => void state.requestPermission()}
          onOpenSettings={() => void state.openPermissionSettings()}
          t={t}
        />
      ) : null}
    </div>
  )
}

function buildModeHint({
  needsPermission,
  isActive,
  preferences,
  isMac,
  t
}: {
  needsPermission: boolean
  isActive: boolean
  preferences: ReturnType<typeof useStatusCardState>['preferences']
  isMac: boolean
  t: TFunction
}): string {
  if (needsPermission) return t('main.permissionRequiredHint')
  if (!preferences || !isActive) return t('main.listenerDisabled')
  if (preferences.triggerMode === 'auto') return t('main.listenerEnabledAuto')
  return t('main.listenerEnabledShortcut', {
    shortcut: formatShortcutLabel(preferences.shortcut, isMac)
  })
}

function PermissionActions({
  canPrompt,
  onRequest,
  onOpenSettings,
  t
}: {
  canPrompt: boolean
  onRequest: () => void
  onOpenSettings: () => void
  t: TFunction
}): React.JSX.Element {
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {canPrompt ? (
        <Button type="button" size="sm" className="h-6 px-2 text-[10px]" onClick={onRequest}>
          {t('main.permissionRequest')}
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-6 px-2 text-[10px]"
        onClick={onOpenSettings}
      >
        {t('main.permissionOpenSettings')}
      </Button>
    </div>
  )
}
