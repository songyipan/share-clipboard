import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 悬浮球相关
  showFloatingBall: (text: string) => ipcRenderer.invoke('floating:show', text),
  hideFloatingBall: () => ipcRenderer.invoke('floating:hide'),
  getSelectedText: () => ipcRenderer.invoke('selection:get'),

  // 监听器状态
  isListenerActive: () => ipcRenderer.invoke('listener:status'),
  getCurrentShortcut: () => ipcRenderer.invoke('listener:shortcut'),

  // 监听悬浮球隐藏事件
  onFloatingBallHidden: (callback: () => void) => {
    ipcRenderer.on('floating:hidden', callback)
    return () => ipcRenderer.removeListener('floating:hidden', callback)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}