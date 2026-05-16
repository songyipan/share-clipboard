import { useRef, useState, useEffect, useCallback } from 'react'

const MIN_WIDTH = 400
const MIN_HEIGHT = 200
const MAX_WIDTH = 1000

interface ResizeState {
  width: number
  height: number
  isResizing: boolean
}

export function useResize(): {
  width: number
  height: number
  handleMouseDown: (e: React.MouseEvent) => void
} {
  const [resize, setResize] = useState<ResizeState>({
    width: 700,
    height: 300,
    isResizing: false
  })
  const startPos = useRef({ x: 0, y: 0, startWidth: 0, startHeight: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        startWidth: resize.width,
        startHeight: resize.height
      }
      setResize((prev) => ({ ...prev, isResizing: true }))
    },
    [resize]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resize.isResizing) return
      const newWidth = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startPos.current.startWidth + (e.clientX - startPos.current.x))
      )
      const newHeight = Math.max(
        MIN_HEIGHT,
        startPos.current.startHeight + (e.clientY - startPos.current.y)
      )
      setResize((prev) => ({ ...prev, width: newWidth, height: newHeight }))
    },
    [resize.isResizing]
  )

  const handleMouseUp = useCallback(() => {
    setResize((prev) => ({ ...prev, isResizing: false }))
  }, [])

  useEffect(() => {
    if (resize.isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
    return undefined
  }, [resize.isResizing, handleMouseMove, handleMouseUp])

  return {
    width: resize.width,
    height: resize.height,
    handleMouseDown
  }
}
