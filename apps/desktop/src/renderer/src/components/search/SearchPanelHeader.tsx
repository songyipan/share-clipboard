import { Search, Settings2 } from 'lucide-react'
import { Badge } from '@share-clipboard/ui/components/badge'
import { Button } from '@share-clipboard/ui/components/button'
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
} from '@share-clipboard/ui/components/card'
import { useI18n } from '@share-clipboard/i18n'
import type { SearchEngine } from './types'

interface SearchPanelHeaderProps {
  defaultEngine: SearchEngine
  isSettingsOpen: boolean
  onToggleSettings: () => void
}

export function SearchPanelHeader({
  defaultEngine,
  isSettingsOpen,
  onToggleSettings
}: SearchPanelHeaderProps): React.JSX.Element {
  const { t } = useI18n()

  return (
    <CardHeader className="px-4 pt-4 pb-0">
      <CardTitle className="flex min-w-0 items-center gap-2">
        <Search data-icon="inline-start" aria-hidden="true" />
        {t('search.title')}
        <Badge variant="secondary" className="ml-1">
          {t('search.defaultPrefix')}
          {defaultEngine.label}
        </Badge>
      </CardTitle>
      <CardDescription className="truncate">{t('search.description')}</CardDescription>
      <CardAction>
        <Button
          type="button"
          variant={isSettingsOpen ? 'secondary' : 'outline'}
          size="sm"
          aria-label={isSettingsOpen ? t('search.collapseSettings') : t('search.expandSettings')}
          onClick={onToggleSettings}
        >
          <Settings2 data-icon="inline-start" aria-hidden="true" />
          {isSettingsOpen ? t('search.closeSettings') : t('main.settings')}
        </Button>
      </CardAction>
    </CardHeader>
  )
}
