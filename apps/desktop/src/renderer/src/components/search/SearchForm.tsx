import { ArrowRight } from 'lucide-react'
import { Button } from '@share-clipboard/ui/components/button'
import { Input } from '@share-clipboard/ui/components/input'
import { Label } from '@share-clipboard/ui/components/label'
import { useI18n } from '@share-clipboard/i18n'
import { MAX_QUERY_LENGTH, normalizeQuery } from './searchEngineConfig'
import type { SearchEngine } from './types'

interface SearchFormProps {
  query: string
  message: string
  defaultEngine: SearchEngine
  onQueryChange: (query: string) => void
  onSearch: (engine: SearchEngine) => void
}

export function SearchForm({
  query,
  message,
  defaultEngine,
  onQueryChange,
  onSearch
}: SearchFormProps): React.JSX.Element {
  const queryLength = normalizeQuery(query).length
  const { t } = useI18n()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(defaultEngine)
      }}
      className="flex flex-col gap-2"
    >
      <Label htmlFor="search-query" className="sr-only">
        {t('search.keyword')}
      </Label>
      <div className="flex gap-2">
        <Input
          id="search-query"
          name="search-query"
          type="search"
          value={query}
          placeholder={t('search.placeholder')}
          autoComplete="off"
          autoFocus
          className="h-11"
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <Button type="submit" className="h-11 shrink-0">
          {t('search.withEngine', { engine: defaultEngine.label })}
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span aria-live="polite">{message}</span>
        <span className="shrink-0 tabular-nums">
          {queryLength}/{MAX_QUERY_LENGTH}
        </span>
      </div>
    </form>
  )
}
