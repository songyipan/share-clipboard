import { ElectronAPI } from '@electron-toolkit/preload'

interface FloatingBallAPI {
  showFloatingBall: (text: string) => Promise<void>
  hideFloatingBall: () => Promise<void>
  getSelectedText: () => Promise<{ success: boolean; text: string; error?: string }>
  isListenerActive: () => Promise<boolean>
  getCurrentShortcut: () => Promise<string>
  onFloatingBallHidden: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: FloatingBallAPI
  }
}