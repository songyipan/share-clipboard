import { useEffect, useRef, useState } from 'react'
import { buildSearchUrl, MAX_QUERY_LENGTH, normalizeQuery } from './searchEngineConfig'
import { useSearchEngineConfig } from './useSearchEngineConfig'
import type { SearchEngine, SearchPanelController } from './types'

function useSelectedText(): string {
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false
    window.api.getLastSelectedText().then((selectedText) => {
      if (!cancelled) setText(selectedText)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return text
}

function useSearchQuery(
  lastSelectedText: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [query, setQuery] = useState(lastSelectedText)
  const lastSelectedTextRef = useRef(lastSelectedText)

  useEffect(() => {
    if (lastSelectedTextRef.current !== lastSelectedText) {
      lastSelectedTextRef.current = lastSelectedText
      setQuery(normalizeQuery(lastSelectedText))
    }
  }, [lastSelectedText])

  return [query, setQuery]
}

export function useSearchPanelController(): SearchPanelController {
  const lastSelectedText = useSelectedText()
  const [query, setQuery] = useSearchQuery(lastSelectedText)
  const [message, setMessage] = useState('回车使用默认搜索源')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const searchConfig = useSearchEngineConfig()
  const { engines, defaultEngine, setDefaultEngine } = searchConfig
  const hasQuery = normalizeQuery(query).length > 0

  const handleSearch = async (engine: SearchEngine): Promise<void> => {
    const normalizedQuery = normalizeQuery(query)
    if (!normalizedQuery) {
      setMessage('先输入或划选一段要搜索的内容')
      return
    }

    setQuery(normalizedQuery)
    try {
      await window.api.openExternal(buildSearchUrl(engine, normalizedQuery))
      setMessage(`已用 ${engine.label} 打开浏览器`)
    } catch (error) {
      console.error('[SearchPanel] Failed to open external URL:', error)
      setMessage('打开浏览器失败，请检查搜索源 URL')
    }
  }

  const handleQueryChange = (nextQuery: string): void => {
    setQuery(nextQuery.slice(0, MAX_QUERY_LENGTH))
    setMessage(`回车使用 ${defaultEngine.label}`)
  }

  const handleSetDefaultEngine = (engineId: string): void => {
    setDefaultEngine(engineId)
    const engine = engines.find((item) => item.id === engineId)
    if (engine) setMessage(`已设为默认：${engine.label}`)
  }

  return {
    ...searchConfig,
    query,
    message,
    hasQuery,
    isSettingsOpen,
    setIsSettingsOpen,
    handleSearch,
    handleQueryChange,
    handleSetDefaultEngine
  }
}
