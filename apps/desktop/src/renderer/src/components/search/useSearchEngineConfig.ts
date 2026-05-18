import { useState } from 'react'
import {
  DEFAULT_ENGINE_ID,
  createRuntimeEngines,
  readSearchConfig,
  resolveDefaultEngine,
  writeSearchConfig
} from './searchEngineConfig'
import type { CustomEngineDraft, SearchEngine, SearchEngineConfig } from './types'

interface SearchEngineConfigApi {
  config: SearchEngineConfig
  engines: SearchEngine[]
  defaultEngine: SearchEngine
  setDefaultEngine: (engineId: string) => void
  addCustomEngine: (draft: CustomEngineDraft) => void
  removeCustomEngine: (engineId: string) => void
  updateEngineUrlTemplate: (engineId: string, urlTemplate: string) => void
}

export function useSearchEngineConfig(): SearchEngineConfigApi {
  const [config, setConfig] = useState<SearchEngineConfig>(() => readSearchConfig())
  const engines = createRuntimeEngines(config)
  const defaultEngine = resolveDefaultEngine(engines, config.defaultEngineId)

  const updateConfig = (updater: (config: SearchEngineConfig) => SearchEngineConfig): void => {
    setConfig((currentConfig) => {
      const nextConfig = updater(currentConfig)
      writeSearchConfig(nextConfig)
      return nextConfig
    })
  }

  const setDefaultEngine = (engineId: string): void => {
    updateConfig((currentConfig) => ({ ...currentConfig, defaultEngineId: engineId }))
  }

  const addCustomEngine = (draft: CustomEngineDraft): void => {
    updateConfig((currentConfig) => ({
      ...currentConfig,
      customEngines: [
        ...currentConfig.customEngines,
        {
          id: `custom-${Date.now()}`,
          label: draft.label.trim(),
          hint: draft.hint.trim() || '自定义搜索',
          urlTemplate: draft.urlTemplate.trim()
        }
      ]
    }))
  }

  const removeCustomEngine = (engineId: string): void => {
    updateConfig((currentConfig) => ({
      defaultEngineId:
        currentConfig.defaultEngineId === engineId
          ? DEFAULT_ENGINE_ID
          : currentConfig.defaultEngineId,
      customEngines: currentConfig.customEngines.filter((engine) => engine.id !== engineId),
      engineUrlOverrides: removeUrlOverride(currentConfig.engineUrlOverrides, engineId)
    }))
  }

  const updateEngineUrlTemplate = (engineId: string, urlTemplate: string): void => {
    updateConfig((currentConfig) => ({
      ...currentConfig,
      engineUrlOverrides: {
        ...currentConfig.engineUrlOverrides,
        [engineId]: urlTemplate.trim()
      }
    }))
  }

  return {
    config,
    engines,
    defaultEngine,
    setDefaultEngine,
    addCustomEngine,
    removeCustomEngine,
    updateEngineUrlTemplate
  }
}

function removeUrlOverride(
  overrides: Record<string, string>,
  engineId: string
): Record<string, string> {
  const nextOverrides = { ...overrides }
  delete nextOverrides[engineId]
  return nextOverrides
}
