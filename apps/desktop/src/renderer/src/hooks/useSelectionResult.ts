import { useEffect, useRef } from 'react'

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
    return window.api.onSelectionResult((result: SelectionResult) => {
      if (result.success) {
        onSuccessRef.current()
      }
    })
  }, [])
}
