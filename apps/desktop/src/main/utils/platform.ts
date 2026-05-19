/**
 * 平台检测工具
 */
export const isMac = process.platform === 'darwin'
export const isWindows = process.platform === 'win32'
export const isLinux = process.platform === 'linux'

import { getDefaultShortcutForPlatform } from '../../shared/appPreferences'

/**
 * 获取默认快捷键
 */
export const getDefaultShortcut = (): string => getDefaultShortcutForPlatform(process.platform)

/**
 * IPC 通道常量
 */
export { IPC_CHANNELS } from '../../shared/ipc'
