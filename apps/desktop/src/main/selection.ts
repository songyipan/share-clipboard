import { clipboard } from 'electron'
import { keyboard, Key } from '@nut-tree-fork/nut-js'
import { isMac } from './utils/platform'
import { delay } from './utils/async'

const MIN_TEXT_LENGTH = 1
const MAX_TEXT_LENGTH = 500
const SHORTCUT_RELEASE_DELAY_MS = 150
const CLIPBOARD_SETTLE_MS = 12
const COPY_DELAY_MS = 100
const COPY_TIMEOUT_MS = 500
const COPY_POLL_INTERVAL_MS = 50
const AUTO_COPY_DELAY_MS = 18
const AUTO_COPY_TIMEOUT_MS = 200
const AUTO_COPY_POLL_INTERVAL_MS = 8

export interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

export interface CaptureSelectionOptions {
  /** 划词自动触发为 true；快捷键触发需等待修饰键释放 */
  fromAutoSelection?: boolean
}

export async function captureSelection(
  options: CaptureSelectionOptions = {}
): Promise<SelectionResult> {
  const fast = options.fromAutoSelection === true
  const clipboardBackup = backupClipboard()

  try {
    clipboard.clear()
    await delay(fast ? CLIPBOARD_SETTLE_MS : SHORTCUT_RELEASE_DELAY_MS)
    await simulateCopy(fast)
    const selectedText = await waitForSelectedText(fast)

    if (!isValidText(selectedText)) {
      return { success: false, text: '' }
    }

    return { success: true, text: selectedText }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, text: '', error: message }
  } finally {
    restoreClipboard(clipboardBackup)
  }
}

function backupClipboard(): string {
  return clipboard.readText()
}

async function simulateCopy(fast: boolean): Promise<void> {
  const modifierKey = isMac ? Key.LeftSuper : Key.LeftControl

  await keyboard.pressKey(modifierKey, Key.C)
  await keyboard.releaseKey(modifierKey, Key.C)
  await delay(fast ? AUTO_COPY_DELAY_MS : COPY_DELAY_MS)
}

async function waitForSelectedText(fast: boolean): Promise<string> {
  const timeout = fast ? AUTO_COPY_TIMEOUT_MS : COPY_TIMEOUT_MS
  const pollInterval = fast ? AUTO_COPY_POLL_INTERVAL_MS : COPY_POLL_INTERVAL_MS
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    const text = clipboard.readText()
    if (text.trim().length > 0) {
      return text
    }
    await delay(pollInterval)
  }

  return clipboard.readText()
}

function restoreClipboard(text: string): void {
  clipboard.writeText(text)
}

function isValidText(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.length >= MIN_TEXT_LENGTH && trimmed.length <= MAX_TEXT_LENGTH
}
