import { useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@share-clipboard/ui/components/card'
import { SearchForm } from './search/SearchForm'
import { SearchPanelHeader } from './search/SearchPanelHeader'
import { SearchSettings } from './search/SearchSettings'
import { useSearchPanelController } from './search/useSearchPanelController'
import { useI18n } from '@share-clipboard/i18n'

const COMPACT_PANEL_SIZE = { width: 760, height: 300 }
const SETTINGS_PANEL_SIZE = { width: 760, height: 620 }

export function SearchPanel(): React.JSX.Element {
  const controller = useSearchPanelController()
  const { t } = useI18n()

  useEffect(() => {
    const size = controller.isSettingsOpen ? SETTINGS_PANEL_SIZE : COMPACT_PANEL_SIZE
    window.api.resizePanelWindow(size.width, size.height).catch((error) => {
      console.error('[SearchPanel] Failed to resize panel window:', error)
    })
  }, [controller.isSettingsOpen])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div
        className="flex h-9 shrink-0 items-center px-3 pt-2"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      />
      <div
        className="flex min-h-0 flex-1 flex-col px-4 pb-4"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <Card className="min-h-0 flex-1 gap-4 overflow-auto py-0">
          <SearchPanelHeader
            defaultEngine={controller.defaultEngine}
            isSettingsOpen={controller.isSettingsOpen}
            onToggleSettings={() => controller.setIsSettingsOpen((current) => !current)}
          />
          <CardContent className="flex flex-col gap-4 px-4">
            <SearchForm
              query={controller.query}
              message={controller.message}
              defaultEngine={controller.defaultEngine}
              onQueryChange={controller.handleQueryChange}
              onSearch={(engine) => void controller.handleSearch(engine)}
            />
            {controller.isSettingsOpen && (
              <SearchSettings
                engines={controller.engines}
                defaultEngineId={controller.defaultEngine.id}
                customEngines={controller.config.customEngines}
                onSetDefault={controller.handleSetDefaultEngine}
                onUpdateUrlTemplate={controller.updateEngineUrlTemplate}
                onAddCustomEngine={controller.addCustomEngine}
                onRemoveCustomEngine={controller.removeCustomEngine}
              />
            )}
          </CardContent>
          <CardFooter className="px-4 pb-4">
            <p className="text-xs text-muted-foreground">
              {controller.hasQuery ? t('search.hintHasQuery') : t('search.hintEmpty')}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
