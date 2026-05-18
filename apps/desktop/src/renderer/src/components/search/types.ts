import type { LucideIcon } from 'lucide-react'

export interface StoredCustomSearchEngine {
  id: string
  label: string
  hint: string
  urlTemplate: string
}

export interface SearchEngineConfig {
  defaultEngineId: string
  customEngines: StoredCustomSearchEngine[]
  engineUrlOverrides: Record<string, string>
}

export interface SearchEngine extends StoredCustomSearchEngine {
  icon?: LucideIcon
  iconSrc?: string
  isCustom?: boolean
}

export interface CustomEngineDraft {
  label: string
  hint: string
  urlTemplate: string
}

export interface SearchPanelController {
  query: string
  message: string
  hasQuery: boolean
  isSettingsOpen: boolean
  config: SearchEngineConfig
  engines: SearchEngine[]
  defaultEngine: SearchEngine
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
  addCustomEngine: (draft: CustomEngineDraft) => void
  removeCustomEngine: (engineId: string) => void
  updateEngineUrlTemplate: (engineId: string, urlTemplate: string) => void
  handleSearch: (engine: SearchEngine) => Promise<void>
  handleQueryChange: (nextQuery: string) => void
  handleSetDefaultEngine: (engineId: string) => void
}
