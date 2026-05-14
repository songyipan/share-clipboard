import { clipboard } from 'electron'
import { keyboard, Key } from '@nut-tree-fork/nut-js'
import { isMac } from './utils/platform'
import { delay } from './utils/async'

const MIN_TEXT_LENGTH = 1
const MAX_TEXT_LENGTH = 500
const COPY_DELAY_MS = 100

export interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

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

function backupClipboard(): string {
  return clipboard.readText()
}

async function simulateCopy(): Promise<void> {
  const modifierKey = isMac ? Key.LeftSuper : Key.LeftControl

  await keyboard.pressKey(modifierKey, Key.C)
  await keyboard.releaseKey(modifierKey, Key.C)
  await delay(COPY_DELAY_MS)
}

function readSelectedText(): string {
  return clipboard.readText()
}

function restoreClipboard(text: string): void {
  clipboard.writeText(text)
}

function isValidText(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.length >= MIN_TEXT_LENGTH && trimmed.length <= MAX_TEXT_LENGTH
}
