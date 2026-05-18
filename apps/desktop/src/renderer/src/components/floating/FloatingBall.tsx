import { useState } from 'react'
import { useSelectionResult } from '../hooks/useSelectionResult'
import { useFloatingBallHidden } from '../hooks/useFloatingBallHidden'
import { useResizeWindow } from '../hooks/useResizeWindow'
import { FloatingBallContainer } from './FloatingBallContainer'
import type { PanelType } from '../utils/panel'

export function FloatingBall(): React.JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(false)
  const containerRef = useResizeWindow(visible)

  useSelectionResult(() => setVisible(true))
  useFloatingBallHidden(() => setVisible(false))

  const handleAction = (type: PanelType): void => {
    window.api.showPanel(type).catch((error) => {
      console.error('[FloatingBall] Failed to show panel:', error)
    })
  }

  const handleClose = (): void => {
    window.api.hideFloatingBall().catch((error) => {
      console.error('[FloatingBall] Failed to hide floating ball:', error)
    })
  }

  if (!visible) return null

  return <FloatingBallContainer ref={containerRef} onAction={handleAction} onClose={handleClose} />
}
