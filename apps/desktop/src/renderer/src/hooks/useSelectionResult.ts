import { useEffect, useRef } from 'react'
import { IPC_CHANNELS } from '../../../shared/ipc'

interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

/**
 * 监听选中文本结果的 hook
 */
export function useSelectionResult(onSuccess: () => void): void {
  const onSuccessRef = useRef(onSuccess)

  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    const handler = (_event: Electron.IpcRendererEvent, result: SelectionResult): void => {
      if (result.success) {
        onSuccessRef.current()
      }
    }

    window.electron.ipcRenderer.on(IPC_CHANNELS.SELECTION_RESULT, handler)

    return () => {
      window.electron.ipcRenderer.removeListener(IPC_CHANNELS.SELECTION_RESULT, handler)
    }
  }, [])
}
