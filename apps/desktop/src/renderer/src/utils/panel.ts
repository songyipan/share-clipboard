/**
 * 面板类型常量
 */
export const PANEL_TYPES = {
  SEARCH: 'search',
  NOTEBOOK: 'notebook',
  IMAGE: 'image'
} as const

export type PanelType = (typeof PANEL_TYPES)[keyof typeof PANEL_TYPES]
