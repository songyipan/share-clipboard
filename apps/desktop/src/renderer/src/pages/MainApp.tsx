import { useState } from 'react'
import { Command, ImageIcon, MousePointerClick, Settings2 } from 'lucide-react'
import { Button } from '@share-clipboard/ui/components/button'
import { useI18n, type TFunction } from '@share-clipboard/i18n'

import { formatShortcutLabel } from '../../../shared/shortcutDisplay'
import { useAppPreferences } from '../hooks/useAppPreferences'
import { FeatureCard, GuideStep, StatusCard } from './MainAppCards'
import { MainAppSettingsPanel } from './MainAppSettingsPanel'

export function MainApp(): React.JSX.Element {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useI18n()
  const { preferences } = useAppPreferences()
  const isMac = window.electron.process.platform === 'darwin'

  const shortcutLabel = preferences
    ? formatShortcutLabel(preferences.shortcut, isMac)
    : isMac
      ? '⌘⇧C'
      : 'Ctrl+Shift+C'

  return (
    <div className="min-h-screen bg-background">
      <div className="h-10 w-full" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <main className="max-w-3xl mx-auto px-6 pb-8">
        <MainAppHeader
          text={t}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((open) => !open)}
        />

        {settingsOpen && <MainAppSettingsPanel />}

        <section className="mb-8">
          <StatusCard />
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-wrap-balance">
            {t('main.guideTitle')}
          </h2>
          <div className="grid gap-3">
            {preferences?.triggerMode === 'shortcut' ? (
              <GuideStep
                step={1}
                icon={<Command className="w-4 h-4" aria-hidden="true" />}
                title={t('main.triggerShortcutGuide')}
                description={t('main.triggerShortcutDescription', { shortcut: shortcutLabel })}
              />
            ) : (
              <GuideStep
                step={1}
                icon={<MousePointerClick className="w-4 h-4" aria-hidden="true" />}
                title={t('main.triggerAuto')}
                description={t('main.triggerAutoDescription')}
              />
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-wrap-balance">
            {t('main.featureTitle')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <FeatureCard
              icon={<ImageIcon className="w-5 h-5" aria-hidden="true" />}
              title={t('main.imageGeneration')}
              description={t('main.imageDescription')}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function MainAppHeader({
  text,
  settingsOpen,
  onToggleSettings
}: {
  text: TFunction
  settingsOpen: boolean
  onToggleSettings: () => void
}): React.JSX.Element {
  return (
    <header className="mb-6 mt-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold text-foreground">{text('main.appTitle')}</h1>
        <p className="mt-1 truncate text-sm text-muted-foreground">{text('main.appDescription')}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={onToggleSettings}
      >
        <Settings2 data-icon="inline-start" aria-hidden="true" />
        {settingsOpen ? text('main.hideSettings') : text('main.settings')}
      </Button>
    </header>
  )
}
