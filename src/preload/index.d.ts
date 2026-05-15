import { ElectronAPI } from '@electron-toolkit/preload'

interface FloatingBallAPI {
  showFloatingBall: (text: string) => Promise<void>
  hideFloatingBall: () => Promise<void>
  getSelectedText: () => Promise<{ success: boolean; text: string; error?: string }>
  showPanel: () => Promise<void>
  hidePanel: () => Promise<void>
  isListenerActive: () => Promise<boolean>
  getCurrentShortcut: () => Promise<string>
  onFloatingBallHidden: (callback: () => void) => () => void
  resizeFloatingWindow: (width: number, height: number) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: FloatingBallAPI
  }
}
