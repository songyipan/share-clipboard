import { Activity, ShieldAlert } from 'lucide-react'
import { Button } from '@share-clipboard/ui/components/button'
import { useI18n, type TFunction } from '@share-clipboard/i18n'

import { formatShortcutLabel } from '../../../shared/shortcutDisplay'
import { useStatusCardState } from '../hooks/useStatusCardState'

export function StatusCard(): React.JSX.Element {
  const { t } = useI18n()
  const state = useStatusCardState()

  const needsPermission = state.permission?.required && !state.permission.granted
  const isActive = !needsPermission && state.listenerActive

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusCardMain
          needsPermission={!!needsPermission}
          isActive={isActive}
          preferences={state.preferences}
          isMac={window.electron.process.platform === 'darwin'}
          t={t}
        />
        {needsPermission ? (
          <PermissionActions
            canPrompt={state.permission?.canPrompt ?? false}
            onRequest={() => void state.requestPermission()}
            onOpenSettings={() => void state.openPermissionSettings()}
            t={t}
          />
        ) : (
          <StatusIndicator active={isActive} t={t} />
        )}
      </div>
    </div>
  )
}

function StatusCardMain({
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
}): React.JSX.Element {
  const title = needsPermission
    ? t('main.permissionRequired')
    : isActive
      ? t('main.running')
      : t('main.paused')

  const hint = needsPermission
    ? t('main.permissionRequiredHint')
    : !preferences || !isActive
      ? t('main.listenerDisabled')
      : preferences.triggerMode === 'auto'
        ? t('main.listenerEnabledAuto')
        : t('main.listenerEnabledShortcut', {
            shortcut: formatShortcutLabel(preferences.shortcut, isMac)
          })

  return (
    <div className="flex items-center gap-4 min-w-0">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
          needsPermission
            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
            : isActive
              ? 'bg-primary shadow-lg shadow-primary/25'
              : 'bg-muted'
        }`}
      >
        {needsPermission ? (
          <ShieldAlert className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Activity
            className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground text-wrap-balance">{title}</h3>
        <p className="text-sm text-muted-foreground text-pretty">{hint}</p>
      </div>
    </div>
  )
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
    <div className="flex flex-wrap gap-2 shrink-0">
      {canPrompt ? (
        <Button type="button" size="sm" onClick={onRequest}>
          {t('main.permissionRequest')}
        </Button>
      ) : null}
      <Button type="button" size="sm" variant="outline" onClick={onOpenSettings}>
        {t('main.permissionOpenSettings')}
      </Button>
    </div>
  )
}

function StatusIndicator({
  active,
  t
}: {
  active: boolean
  t: TFunction
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span
        className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`}
        aria-hidden="true"
      />
      <span className={`text-sm font-medium ${active ? 'text-green-500' : 'text-muted-foreground'}`}>
        {active ? t('main.normal') : t('main.abnormal')}
      </span>
    </div>
  )
}
