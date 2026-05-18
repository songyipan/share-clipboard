import { clipboard } from 'electron'
import { keyboard, Key } from '@nut-tree-fork/nut-js'
import { isMac } from './utils/platform'
import { delay } from './utils/async'

const MIN_TEXT_LENGTH = 1
const MAX_TEXT_LENGTH = 500
const SHORTCUT_RELEASE_DELAY_MS = 150
const COPY_DELAY_MS = 100
const COPY_TIMEOUT_MS = 500
const COPY_POLL_INTERVAL_MS = 50

export interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

export async function captureSelection(): Promise<SelectionResult> {
  const clipboardBackup = backupClipboard()

  try {
    clipboard.clear()
    await delay(SHORTCUT_RELEASE_DELAY_MS)
    await simulateCopy()
    const selectedText = await waitForSelectedText()

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

async function simulateCopy(): Promise<void> {
  const modifierKey = isMac ? Key.LeftSuper : Key.LeftControl

  await keyboard.pressKey(modifierKey, Key.C)
  await keyboard.releaseKey(modifierKey, Key.C)
  await delay(COPY_DELAY_MS)
}

async function waitForSelectedText(): Promise<string> {
  const deadline = Date.now() + COPY_TIMEOUT_MS

  while (Date.now() < deadline) {
    const text = clipboard.readText()
    if (text.trim().length > 0) {
      return text
    }
    await delay(COPY_POLL_INTERVAL_MS)
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
