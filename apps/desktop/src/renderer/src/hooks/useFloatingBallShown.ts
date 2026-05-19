import { useEffect, useRef } from 'react'

export function useFloatingBallShown(onShow: () => void): void {
  const onShowRef = useRef(onShow)

  useEffect(() => {
    onShowRef.current = onShow
  }, [onShow])

  useEffect(() => {
    const cleanup = window.api.onFloatingBallShown(() => onShowRef.current())
    return cleanup
  }, [])
}
