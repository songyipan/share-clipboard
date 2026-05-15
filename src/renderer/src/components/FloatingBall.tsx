import { useState } from 'react'
import { useSelectionResult } from '../hooks/useSelectionResult'
import { useFloatingBallHidden } from '../hooks/useFloatingBallHidden'
import { useResizeWindow } from '../hooks/useResizeWindow'
import { FloatingBallContainer } from './FloatingBallContainer'
import { getPanelTypeFromAction } from '../utils/panel'

export function FloatingBall(): React.JSX.Element {
  const [visible, setVisible] = useState<boolean>(false)
  const containerRef = useResizeWindow(visible)

  useSelectionResult(() => setVisible(true))
  useFloatingBallHidden(() => setVisible(false))

  const handleAction = (action: number): void => {
    const type = getPanelTypeFromAction(action)
    window.api.showPanel(type)
  }

  if (!visible) return <></>

  return <FloatingBallContainer ref={containerRef} onAction={handleAction} />
}
