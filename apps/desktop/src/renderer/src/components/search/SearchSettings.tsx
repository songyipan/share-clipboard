import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@share-clipboard/ui/components/button'
import { Input } from '@share-clipboard/ui/components/input'
import { Label } from '@share-clipboard/ui/components/label'
import { Separator } from '@share-clipboard/ui/components/separator'
import {
  EMPTY_CUSTOM_ENGINE_DRAFT,
  QUERY_PLACEHOLDER,
  validateCustomEngineDraft
} from './searchEngineConfig'
import { SearchEngineSettingsList } from './SearchEngineSettingsList'
import type { CustomEngineDraft, SearchEngine, StoredCustomSearchEngine } from './types'

interface SearchSettingsProps {
  engines: SearchEngine[]
  defaultEngineId: string
  customEngines: StoredCustomSearchEngine[]
  onSetDefault: (engineId: string) => void
  onUpdateUrlTemplate: (engineId: string, urlTemplate: string) => void
  onAddCustomEngine: (draft: CustomEngineDraft) => void
  onRemoveCustomEngine: (engineId: string) => void
}

export function SearchSettings({
  engines,
  defaultEngineId,
  customEngines,
  onSetDefault,
  onUpdateUrlTemplate,
  onAddCustomEngine,
  onRemoveCustomEngine
}: SearchSettingsProps): React.JSX.Element {
  const [draft, setDraft] = useState<CustomEngineDraft>(EMPTY_CUSTOM_ENGINE_DRAFT)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const updateDraft = (field: keyof CustomEngineDraft, value: string): void => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }))
    setError('')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const validationError = validateCustomEngineDraft(draft)
    if (validationError) {
      setError(validationError)
      return
    }

    onAddCustomEngine(draft)
    setDraft(EMPTY_CUSTOM_ENGINE_DRAFT)
    setIsAdding(false)
    setError('')
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
      <SearchEngineSettingsList
        engines={engines}
        defaultEngineId={defaultEngineId}
        onSetDefault={onSetDefault}
        onUpdateUrlTemplate={onUpdateUrlTemplate}
        onRemoveCustomEngine={onRemoveCustomEngine}
      />
      <Separator />
      {isAdding && (
        <AddEngineForm
          draft={draft}
          error={error}
          onSubmit={handleSubmit}
          onChange={updateDraft}
          onCancel={() => setIsAdding(false)}
        />
      )}
      {error && (
        <p className="text-xs text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      {!isAdding && (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)}>
          <Plus data-icon="inline-start" aria-hidden="true" />
          增加搜索引擎
        </Button>
      )}
      {customEngines.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground">可以添加自己的搜索 URL 模板。</p>
      )}
    </div>
  )
}

interface AddEngineFormProps {
  draft: CustomEngineDraft
  error: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onChange: (field: keyof CustomEngineDraft, value: string) => void
  onCancel: () => void
}

function AddEngineForm({
  draft,
  error,
  onSubmit,
  onChange,
  onCancel
}: AddEngineFormProps): React.JSX.Element {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-2">
        <SettingsInput
          id="custom-engine-name"
          label="名称"
          value={draft.label}
          placeholder="Perplexity…"
          onChange={(value) => onChange('label', value)}
        />
        <SettingsInput
          id="custom-engine-hint"
          label="说明"
          value={draft.hint}
          placeholder="AI 搜索…"
          onChange={(value) => onChange('hint', value)}
        />
        <SettingsInput
          id="custom-engine-url"
          label="URL 模板"
          value={draft.urlTemplate}
          placeholder={`https://example.com/search?q=${QUERY_PLACEHOLDER}`}
          invalid={Boolean(error)}
          onChange={(value) => onChange('urlTemplate', value)}
        />
        <Button type="submit" size="sm" className="self-end">
          保存
        </Button>
        <Button type="button" variant="ghost" size="sm" className="self-end" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  )
}

interface SettingsInputProps {
  id: string
  label: string
  value: string
  placeholder: string
  invalid?: boolean
  onChange: (value: string) => void
}

function SettingsInput({
  id,
  label,
  value,
  placeholder,
  invalid,
  onChange
}: SettingsInputProps): React.JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={invalid}
        className="h-8 text-xs"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
