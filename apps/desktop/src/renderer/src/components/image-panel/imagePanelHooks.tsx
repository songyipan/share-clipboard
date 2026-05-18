import { useEffect, useRef, useState } from 'react'
import { IPC_CHANNELS } from '../../../../shared/ipc'
import type { PreviewTheme } from '../markdown/markdownConstants'

interface SelectionResultPayload {
  success: boolean
  text?: string
}

export function useSelectedText(): string {
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false
    window.api.getLastSelectedText().then((t) => {
      if (!cancelled) setText(t)
    })

    const handler = (_event: Electron.IpcRendererEvent, result: SelectionResultPayload): void => {
      if (result.success && typeof result.text === 'string') {
        setText(result.text)
      }
    }

    window.electron.ipcRenderer.on(IPC_CHANNELS.SELECTION_RESULT, handler)
    return () => {
      cancelled = true
      window.electron.ipcRenderer.removeListener(IPC_CHANNELS.SELECTION_RESULT, handler)
    }
  }, [])

  return text
}

export function useSyncEditWithSelected(
  lastSelectedText: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [editText, setEditText] = useState(lastSelectedText)
  const lastSelectedTextRef = useRef(lastSelectedText)

  useEffect(() => {
    if (lastSelectedTextRef.current !== lastSelectedText) {
      lastSelectedTextRef.current = lastSelectedText
      setEditText(lastSelectedText)
    }
  }, [lastSelectedText])

  return [editText, setEditText]
}

export interface ImagePanelState {
  activeTab: string
  previewTheme: PreviewTheme
  selectedLanguage: string
}

export function useImagePanelState(): ImagePanelState & {
  setActiveTab: (tab: string) => void
  setPreviewTheme: (theme: PreviewTheme) => void
  setSelectedLanguage: (lang: string) => void
} {
  const [activeTab, setActiveTab] = useState('edit')
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')
  const [selectedLanguage, setSelectedLanguage] = useState('plaintext')

  return {
    activeTab,
    previewTheme,
    selectedLanguage,
    setActiveTab,
    setPreviewTheme,
    setSelectedLanguage
  }
}

export { useDarkMode } from '../../hooks/useDarkMode'
