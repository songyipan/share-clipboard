/**
 * 平台检测工具
 */
export const isMac = process.platform === 'darwin'
export const isWindows = process.platform === 'win32'
export const isLinux = process.platform === 'linux'

/**
 * 获取默认快捷键
 */
export const getDefaultShortcut = (): string => (isMac ? 'Command+Shift+C' : 'Ctrl+Shift+C')

/**
 * IPC 通道常量
 */
export const IPC_CHANNELS = {
  SELECTION_RESULT: 'selection:result',
  FLOATING_SHOW: 'floating:show',
  FLOATING_HIDE: 'floating:hide',
  FLOATING_RESIZE: 'floating:resize',
  SELECTION_GET: 'selection:get',
  LISTENER_STATUS: 'listener:status',
  LISTENER_SHORTCUT: 'listener:shortcut',
  PANEL_SHOW: 'panel:show',
  PANEL_HIDE: 'panel:hide',
  PANEL_TYPE: 'panel:type'
} as const
