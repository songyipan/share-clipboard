import { clipboard } from 'electron'
import { keyboard, Key } from '@nut-tree-fork/nut-js'

const MIN_TEXT_LENGTH = 1
const MAX_TEXT_LENGTH = 500
const COPY_DELAY_MS = 100

/**
 * 划词结果
 */
export interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

/**
 * 执行划词操作
 */
export async function captureSelection(): Promise<SelectionResult> {
  try {
    const clipboardBackup = backupClipboard()
    await simulateCopy()
    const selectedText = readSelectedText()
    restoreClipboard(clipboardBackup)

    if (!isValidText(selectedText)) {
      return { success: false, text: '' }
    }

    return { success: true, text: selectedText.trim() }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, text: '', error: message }
  }
}

/**
 * 备份当前剪贴板内容
 */
function backupClipboard(): string {
  return clipboard.readText()
}

/**
 * 模拟复制操作
 */
async function simulateCopy(): Promise<void> {
  const modifierKey = process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl

  await keyboard.pressKey(modifierKey, Key.C)
  await keyboard.releaseKey(modifierKey, Key.C)

  await delay(COPY_DELAY_MS)
}

/**
 * 读取选中的文本
 */
function readSelectedText(): string {
  return clipboard.readText()
}

/**
 * 恢复剪贴板内容
 */
function restoreClipboard(text: string): void {
  clipboard.writeText(text)
}

/**
 * 验证文本是否有效
 */
function isValidText(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.length >= MIN_TEXT_LENGTH && trimmed.length <= MAX_TEXT_LENGTH
}

/**
 * 延迟工具函数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
