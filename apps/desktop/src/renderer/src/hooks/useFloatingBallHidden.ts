import { useEffect, useRef } from 'react'

/**
 * 监听悬浮球隐藏事件的 hook
 */
export function useFloatingBallHidden(onHide: () => void): void {
  const onHideRef = useRef(onHide)

  useEffect(() => {
    onHideRef.current = onHide
  }, [onHide])

  useEffect(() => {
    const cleanup = window.api.onFloatingBallHidden(() => onHideRef.current())
    return cleanup
  }, [])
}
