import { Search } from 'lucide-react'
import googleIcon from '../../../../../resources/setting/google.svg?asset'
import baiduIcon from '../../../../../resources/setting/baidu.svg?asset'
import bingIcon from '../../../../../resources/setting/bing.svg?asset'
import githubIcon from '../../../../../resources/setting/github.svg?asset'
import stackOverflowIcon from '../../../../../resources/setting/stack-overflow.svg?asset'
import type {
  CustomEngineDraft,
  SearchEngine,
  SearchEngineConfig,
  StoredCustomSearchEngine
} from './types'

export const MAX_QUERY_LENGTH = 500
export const SEARCH_CONFIG_STORAGE_KEY = 'share-clipboard.search-engines.v1'
export const DEFAULT_ENGINE_ID = 'google'
export const QUERY_PLACEHOLDER = '{query}'

export const BUILT_IN_SEARCH_ENGINES: SearchEngine[] = [
  {
    id: 'google',
    label: 'Google',
    hint: '网页搜索',
    iconSrc: googleIcon,
    urlTemplate: `https://www.google.com/search?q=${QUERY_PLACEHOLDER}`
  },
  {
    id: 'baidu',
    label: '百度',
    hint: '中文内容',
    iconSrc: baiduIcon,
    urlTemplate: `https://www.baidu.com/s?wd=${QUERY_PLACEHOLDER}`
  },
  {
    id: 'bing',
    label: 'Bing',
    hint: '备用搜索',
    iconSrc: bingIcon,
    urlTemplate: `https://www.bing.com/search?q=${QUERY_PLACEHOLDER}`
  },
  {
    id: 'github',
    label: 'GitHub',
    hint: '代码与项目',
    iconSrc: githubIcon,
    urlTemplate: `https://github.com/search?q=${QUERY_PLACEHOLDER}`
  },
  {
    id: 'stackoverflow',
    label: 'Stack Overflow',
    hint: '技术问答',
    iconSrc: stackOverflowIcon,
    urlTemplate: `https://stackoverflow.com/search?q=${QUERY_PLACEHOLDER}`
  }
]

export const DEFAULT_SEARCH_CONFIG: SearchEngineConfig = {
  defaultEngineId: DEFAULT_ENGINE_ID,
  customEngines: [],
  engineUrlOverrides: {}
}

export const EMPTY_CUSTOM_ENGINE_DRAFT: CustomEngineDraft = {
  label: '',
  hint: '',
  urlTemplate: ''
}

export function normalizeQuery(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH)
}

export function buildSearchUrl(engine: SearchEngine, query: string): string {
  return engine.urlTemplate.replaceAll(QUERY_PLACEHOLDER, encodeURIComponent(query))
}

export function validateCustomEngineDraft(draft: CustomEngineDraft): string | null {
  if (!draft.label.trim()) return '请输入搜索源名称'
  return validateUrlTemplate(draft.urlTemplate)
}

export function validateUrlTemplate(urlTemplate: string): string | null {
  if (!urlTemplate.trim()) return '请输入 URL 模板'
  if (!urlTemplate.includes(QUERY_PLACEHOLDER)) return 'URL 模板需要包含 {query}'
  if (!isHttpUrlFromTemplate(urlTemplate)) return 'URL 模板必须是 http 或 https 链接'
  return null
}

export function readSearchConfig(): SearchEngineConfig {
  try {
    const storedConfig = localStorage.getItem(SEARCH_CONFIG_STORAGE_KEY)
    return normalizeSearchConfig(storedConfig ? JSON.parse(storedConfig) : null)
  } catch {
    return DEFAULT_SEARCH_CONFIG
  }
}

export function writeSearchConfig(config: SearchEngineConfig): void {
  localStorage.setItem(SEARCH_CONFIG_STORAGE_KEY, JSON.stringify(config))
}

export function createRuntimeEngines(config: SearchEngineConfig): SearchEngine[] {
  return [
    ...BUILT_IN_SEARCH_ENGINES.map((engine) => ({
      ...engine,
      urlTemplate: config.engineUrlOverrides[engine.id] ?? engine.urlTemplate
    })),
    ...config.customEngines.map((engine) => ({
      ...engine,
      urlTemplate: config.engineUrlOverrides[engine.id] ?? engine.urlTemplate,
      icon: Search,
      isCustom: true
    }))
  ]
}

export function resolveDefaultEngine(
  engines: SearchEngine[],
  defaultEngineId: string
): SearchEngine {
  return (
    engines.find((engine) => engine.id === defaultEngineId) ??
    engines.find((engine) => engine.id === DEFAULT_ENGINE_ID) ??
    engines[0]
  )
}

function isHttpUrlFromTemplate(urlTemplate: string): boolean {
  try {
    const parsedUrl = new URL(urlTemplate.replaceAll(QUERY_PLACEHOLDER, 'example'))
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:'
  } catch {
    return false
  }
}

function isStoredCustomSearchEngine(value: unknown): value is StoredCustomSearchEngine {
  if (!value || typeof value !== 'object') return false
  const engine = value as Record<string, unknown>
  return (
    typeof engine.id === 'string' &&
    typeof engine.label === 'string' &&
    typeof engine.hint === 'string' &&
    typeof engine.urlTemplate === 'string'
  )
}

function normalizeSearchConfig(value: unknown): SearchEngineConfig {
  if (!value || typeof value !== 'object') return DEFAULT_SEARCH_CONFIG
  const config = value as Partial<SearchEngineConfig>
  const customEngines = Array.isArray(config.customEngines)
    ? config.customEngines.filter(isStoredCustomSearchEngine)
    : []
  const engineUrlOverrides =
    config.engineUrlOverrides && typeof config.engineUrlOverrides === 'object'
      ? filterUrlOverrides(config.engineUrlOverrides)
      : {}

  return {
    defaultEngineId:
      typeof config.defaultEngineId === 'string' ? config.defaultEngineId : DEFAULT_ENGINE_ID,
    customEngines,
    engineUrlOverrides
  }
}

function filterUrlOverrides(value: object): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}
