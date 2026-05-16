import { useState } from 'react'
import type { CodeCardConfig, CodeCardTheme, WindowTheme } from './types'

const DEFAULT_CONFIG: CodeCardConfig = {
  theme: 'dracula',
  windowTheme: 'macos',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: 32,
  showLineNumbers: false
}

type UseCodeCardConfigReturn = CodeCardConfig & {
  setTheme: (theme: CodeCardTheme) => void
  setWindowTheme: (theme: WindowTheme) => void
  setBackgroundColor: (color: string) => void
  setPadding: (padding: number) => void
  setShowLineNumbers: (show: boolean) => void
  reset: () => void
}

export function useCodeCardConfig(): UseCodeCardConfigReturn {
  const [config, setConfig] = useState<CodeCardConfig>(DEFAULT_CONFIG)

  const setTheme = (theme: CodeCardTheme): void => {
    setConfig((prev) => ({ ...prev, theme }))
  }

  const setWindowTheme = (windowTheme: WindowTheme): void => {
    setConfig((prev) => ({ ...prev, windowTheme }))
  }

  const setBackgroundColor = (backgroundColor: string): void => {
    setConfig((prev) => ({ ...prev, backgroundColor }))
  }

  const setPadding = (padding: number): void => {
    setConfig((prev) => ({ ...prev, padding }))
  }

  const setShowLineNumbers = (showLineNumbers: boolean): void => {
    setConfig((prev) => ({ ...prev, showLineNumbers }))
  }

  const reset = (): void => {
    setConfig(DEFAULT_CONFIG)
  }

  return {
    ...config,
    setTheme,
    setWindowTheme,
    setBackgroundColor,
    setPadding,
    setShowLineNumbers,
    reset
  }
}
