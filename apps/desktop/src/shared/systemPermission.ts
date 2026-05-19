export interface SystemPermissionStatus {
  /** 当前平台是否需要额外系统授权 */
  required: boolean
  /** 是否已获得授权 */
  granted: boolean
  /** 是否可在应用内弹出系统授权提示（macOS） */
  canPrompt: boolean
}
