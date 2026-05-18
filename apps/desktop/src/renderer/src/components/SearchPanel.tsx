import { Card, CardContent, CardFooter } from '@share-clipboard/ui/components/card'
import { SearchForm } from './search/SearchForm'
import { SearchPanelHeader } from './search/SearchPanelHeader'
import { SearchSettings } from './search/SearchSettings'
import { useSearchPanelController } from './search/useSearchPanelController'
import { useI18n } from '@share-clipboard/i18n'

export function SearchPanel(): React.JSX.Element {
  const controller = useSearchPanelController()
  const { t } = useI18n()

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
        <Card className="min-h-0 flex-1 gap-4 overflow-hidden py-0">
          <SearchPanelHeader
            defaultEngine={controller.defaultEngine}
            isSettingsOpen={controller.isSettingsOpen}
            onToggleSettings={() => controller.setIsSettingsOpen((current) => !current)}
          />
          <CardContent className="min-h-0 flex-1 overflow-y-auto px-4">
            <SearchForm
              query={controller.query}
              message={controller.message}
              defaultEngine={controller.defaultEngine}
              onQueryChange={controller.handleQueryChange}
              onSearch={(engine) => void controller.handleSearch(engine)}
            />
            {controller.isSettingsOpen && (
              <div className="mt-4">
                <SearchSettings
                  engines={controller.engines}
                  defaultEngineId={controller.defaultEngine.id}
                  customEngines={controller.config.customEngines}
                  onSetDefault={controller.handleSetDefaultEngine}
                  onUpdateUrlTemplate={controller.updateEngineUrlTemplate}
                  onAddCustomEngine={controller.addCustomEngine}
                  onRemoveCustomEngine={controller.removeCustomEngine}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="shrink-0 px-4 pb-4">
            <p className="text-xs text-muted-foreground">
              {controller.hasQuery ? t('search.hintHasQuery') : t('search.hintEmpty')}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
