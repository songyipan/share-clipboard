/**
 * 面板类型常量
 */
export const PANEL_TYPES = {
  SEARCH: 'search',
  NOTEBOOK: 'notebook',
  IMAGE: 'image'
} as const

export type PanelType = (typeof PANEL_TYPES)[keyof typeof PANEL_TYPES]

/**
 * 按钮索引到面板类型的映射
 */
export const ACTION_TO_PANEL_TYPE: Record<number, PanelType> = {
  0: PANEL_TYPES.SEARCH,
  1: PANEL_TYPES.NOTEBOOK,
  2: PANEL_TYPES.IMAGE
}

/**
 * 根据按钮索引获取面板类型
 */
export function getPanelTypeFromAction(action: number): PanelType {
  return ACTION_TO_PANEL_TYPE[action] ?? PANEL_TYPES.SEARCH
}
