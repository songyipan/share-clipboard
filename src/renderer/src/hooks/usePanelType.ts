import { useEffect, useState } from 'react'
import type { PanelType } from '../utils/panel'

/**
 * 监听面板类型的 hook
 */
export function usePanelType(): PanelType {
  const [panelType, setPanelType] = useState<PanelType>('search')

  useEffect(() => {
    const cleanup = window.api.onPanelType((type) => {
      console.log('[usePanelType] Received:', type)
      setPanelType(type as PanelType)
    })
    return cleanup
  }, [])

  return panelType
}
