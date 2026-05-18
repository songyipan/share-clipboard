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
export { IPC_CHANNELS } from '../../shared/ipc'
