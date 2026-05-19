/** 将 Electron accelerator 转为界面展示文案 */
export function formatShortcutLabel(accelerator: string, isMac: boolean): string {
  if (!isMac) return accelerator

  return accelerator
    .replaceAll('Command', '⌘')
    .replaceAll('Control', '⌃')
    .replaceAll('Alt', '⌥')
    .replaceAll('Shift', '⇧')
    .replaceAll('+', '')
}
