import { useCallback, useEffect, useRef } from 'react'

const SHADOW_PADDING_X = 8
const SHADOW_PADDING_Y = 12

/**
 * 调整悬浮球窗口尺寸的 hook
 */
export function useResizeWindow(visible: boolean): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null)

  const resizeWindow = useCallback((): void => {
    if (!containerRef.current) return

    const { offsetWidth, offsetHeight } = containerRef.current
    window.api.resizeFloatingWindow(
      offsetWidth + SHADOW_PADDING_X * 2,
      offsetHeight + SHADOW_PADDING_Y * 2
    )
  }, [])

  useEffect(() => {
    if (!visible) return undefined

    const timer = setTimeout(resizeWindow, 0)
    return () => clearTimeout(timer)
  }, [visible, resizeWindow])

  return containerRef
}
