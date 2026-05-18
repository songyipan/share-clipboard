import type { SearchEngine } from './types'
import { SearchEngineSettingsRow } from './SearchEngineSettingsRow'

interface SearchEngineSettingsListProps {
  engines: SearchEngine[]
  defaultEngineId: string
  onSetDefault: (engineId: string) => void
  onUpdateUrlTemplate: (engineId: string, urlTemplate: string) => void
  onRemoveCustomEngine: (engineId: string) => void
}

export function SearchEngineSettingsList({
  engines,
  defaultEngineId,
  onSetDefault,
  onUpdateUrlTemplate,
  onRemoveCustomEngine
}: SearchEngineSettingsListProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {engines.map((engine) => (
        <SearchEngineSettingsRow
          key={engine.id}
          engine={engine}
          isDefault={engine.id === defaultEngineId}
          onSetDefault={() => onSetDefault(engine.id)}
          onUpdateUrlTemplate={(urlTemplate) => onUpdateUrlTemplate(engine.id, urlTemplate)}
          onRemove={() => onRemoveCustomEngine(engine.id)}
        />
      ))}
    </div>
  )
}
