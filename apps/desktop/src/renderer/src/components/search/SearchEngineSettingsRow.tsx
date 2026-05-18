import { Edit3, Save, Star, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@share-clipboard/ui/components/badge'
import { Button } from '@share-clipboard/ui/components/button'
import { Input } from '@share-clipboard/ui/components/input'
import { validateUrlTemplate } from './searchEngineConfig'
import type { SearchEngine } from './types'

interface SearchEngineSettingsRowProps {
  engine: SearchEngine
  isDefault: boolean
  onSetDefault: () => void
  onUpdateUrlTemplate: (urlTemplate: string) => void
  onRemove: () => void
}

export function SearchEngineSettingsRow({
  engine,
  isDefault,
  onSetDefault,
  onUpdateUrlTemplate,
  onRemove
}: SearchEngineSettingsRowProps): React.JSX.Element {
  const [isEditing, setIsEditing] = useState(false)
  const [draftUrl, setDraftUrl] = useState(engine.urlTemplate)
  const [error, setError] = useState('')

  const handleSave = (): void => {
    const validationError = validateUrlTemplate(draftUrl)
    if (validationError) {
      setError(validationError)
      return
    }
    onUpdateUrlTemplate(draftUrl)
    setIsEditing(false)
    setError('')
  }

  const handleCancel = (): void => {
    setDraftUrl(engine.urlTemplate)
    setError('')
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-3">
      <div className="grid grid-cols-[minmax(9rem,1fr)_minmax(16rem,2fr)_auto_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <SearchEngineIcon engine={engine} />
          <span className="truncate text-sm font-medium">{engine.label}</span>
          {isDefault && <Badge variant="secondary">默认</Badge>}
        </div>
        {isEditing ? (
          <Input
            value={draftUrl}
            aria-invalid={Boolean(error)}
            className="h-8 text-xs"
            onChange={(event) => setDraftUrl(event.target.value)}
          />
        ) : (
          <span className="truncate font-mono text-xs text-muted-foreground">
            {engine.urlTemplate}
          </span>
        )}
        <DefaultButton isDefault={isDefault} onClick={onSetDefault} />
        <RowActions
          isCustom={Boolean(engine.isCustom)}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
          onRemove={onRemove}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}

function SearchEngineIcon({ engine }: { engine: SearchEngine }): React.JSX.Element {
  if (engine.iconSrc) {
    return <img src={engine.iconSrc} alt="" className="size-4 shrink-0" />
  }

  const Icon = engine.icon
  return Icon ? (
    <Icon aria-hidden="true" />
  ) : (
    <span className="size-4 shrink-0" aria-hidden="true" />
  )
}

function DefaultButton({
  isDefault,
  onClick
}: {
  isDefault: boolean
  onClick: () => void
}): React.JSX.Element {
  return (
    <Button type="button" variant={isDefault ? 'default' : 'outline'} size="sm" onClick={onClick}>
      <Star
        data-icon="inline-start"
        aria-hidden="true"
        className={isDefault ? 'fill-yellow-400 text-yellow-400' : undefined}
      />
      {isDefault ? '默认' : '设为默认'}
    </Button>
  )
}

interface RowActionsProps {
  isCustom: boolean
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onRemove: () => void
}

function RowActions({
  isCustom,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRemove
}: RowActionsProps): React.JSX.Element {
  if (isEditing) {
    return (
      <div className="flex justify-end gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="保存地址"
          onClick={onSave}
        >
          <Save aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="取消编辑"
          onClick={onCancel}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-1">
      <Button type="button" variant="outline" size="icon-sm" aria-label="编辑地址" onClick={onEdit}>
        <Edit3 aria-hidden="true" />
      </Button>
      {isCustom && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="删除搜索引擎"
          onClick={onRemove}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
