import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command, ImageIcon, MousePointerClick, NotebookText, Search, Settings2 } from 'lucide-react'
import { PANEL_TYPES } from '../utils/panel'
import { Button } from '@share-clipboard/ui/components/button'
import { useI18n, type TFunction } from '@share-clipboard/i18n'

import { formatShortcutLabel } from '../../../shared/shortcutDisplay'
import { useAppPreferences } from '../hooks/useAppPreferences'
import { FeatureCard, GuideStep, StatusCard } from './MainAppCards'
import { MainAppSettingsPanel } from './MainAppSettingsPanel'

export function MainApp(): React.JSX.Element {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useI18n()
  const { preferences } = useAppPreferences()
  const isMac = window.electron.process.platform === 'darwin'

  const shortcutLabel = preferences
    ? formatShortcutLabel(preferences.shortcut, isMac)
    : isMac
      ? '⌘⇧C'
      : 'Ctrl+Shift+C'

  const openPanel = (type: (typeof PANEL_TYPES)[keyof typeof PANEL_TYPES]): void => {
    window.api.showPanel(type).catch((error) => {
      console.error('[MainApp] Failed to show panel:', error)
    })
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="h-10 w-full" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <MainAppHeader
          text={t}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((open) => !open)}
        />

        {settingsOpen ? (
          <div className="mb-8">
            <MainAppSettingsPanel />
          </div>
        ) : null}

        <section className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-wrap-balance">
            {t('main.featureTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <FeatureCard
              icon={<NotebookText className="w-5 h-5" aria-hidden="true" />}
              title={t('main.notebook')}
              description={t('main.notebookDescription')}
              onClick={() => navigate('/notebook')}
            />
            <FeatureCard
              icon={<Search className="w-5 h-5" aria-hidden="true" />}
              title={t('main.search')}
              description={t('main.searchDescription')}
              onClick={() => openPanel(PANEL_TYPES.SEARCH)}
            />
            <FeatureCard
              icon={<ImageIcon className="w-5 h-5" aria-hidden="true" />}
              title={t('main.imageGeneration')}
              description={t('main.imageDescription')}
              onClick={() => openPanel(PANEL_TYPES.IMAGE)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-wrap-balance">
            {t('main.guideTitle')}
          </h2>
          <div className="grid gap-2">
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
      </main>

      <div className="pointer-events-auto fixed bottom-4 right-4 z-10">
        <StatusCard />
      </div>
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
    <header className="mb-8 mt-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold text-foreground">{text('main.appTitle')}</h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{text('main.appDescription')}</p>
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
      </div>
    </header>
  )
}
