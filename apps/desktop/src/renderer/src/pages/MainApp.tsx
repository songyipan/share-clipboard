import { useState, useEffect } from 'react'
import { Command, ImageIcon, Settings2 } from 'lucide-react'
import { Button } from '@share-clipboard/ui/components/button'
import { useI18n, type TFunction } from '@share-clipboard/i18n'
import { FeatureCard, GuideStep, StatusCard } from './MainAppCards'
import { MainAppSettingsPanel } from './MainAppSettingsPanel'

export function MainApp(): React.JSX.Element {
  const [shortcut, setShortcut] = useState<string>('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    window.api.getCurrentShortcut().then(setShortcut)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部拖动区域 */}
      <div className="h-10 w-full" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <main className="max-w-3xl mx-auto px-6 pb-8">
        <MainAppHeader
          text={t}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((open) => !open)}
        />

        {settingsOpen && <MainAppSettingsPanel />}

        {/* 状态卡片 */}
        <section className="mb-8">
          <StatusCard />
        </section>

        {/* 使用指南 */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-wrap-balance">
            {t('main.guideTitle')}
          </h2>
          <div className="grid gap-3">
            {/* <GuideStep
              step={1}
              icon={<MousePointer className="w-4 h-4" aria-hidden="true" />}
              title="划选文本"
              description="在任意应用中选中想要处理的文字"
            /> */}
            <GuideStep
              step={1}
              icon={<Command className="w-4 h-4" aria-hidden="true" />}
              title={t('main.triggerShortcut')}
              description={t('main.triggerDescription', { shortcut: shortcut || '⌘⇧C' })}
            />
          </div>
        </section>

        {/* 功能特性 */}
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
