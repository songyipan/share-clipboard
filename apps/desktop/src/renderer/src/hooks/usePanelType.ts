import { useEffect, useState } from 'react'
import { PANEL_TYPES, type PanelType } from '../utils/panel'

function isPanelType(type: string): type is PanelType {
  return Object.values(PANEL_TYPES).includes(type as PanelType)
}

/**
 * 监听面板类型的 hook
 */
export function usePanelType(): PanelType | null {
  const [panelType, setPanelType] = useState<PanelType | null>(null)

  useEffect(() => {
    let cancelled = false

    window.api.getCurrentPanelType().then((type) => {
      if (!cancelled && isPanelType(type)) {
        setPanelType(type)
      }
    })

    const cleanup = window.api.onPanelType((type) => {
      console.log('[usePanelType] Received:', type)
      if (isPanelType(type)) {
        setPanelType(type)
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return panelType
}
