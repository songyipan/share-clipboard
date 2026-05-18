import { BrowserWindow, dialog } from 'electron'
import { writeFile } from 'fs/promises'
import type { NoteDto } from '../../shared/notes/types'
import { buildNotebookPrintHtml } from './noteExportHtml'
import { sanitizeNoteFilenameBasename } from './noteFilenames'

export type NoteExportPdfResult =
  | { status: 'saved'; path: string }
  | { status: 'cancelled' }
  | { status: 'failed'; message: string }

async function pdfBufferFromHtml(html: string): Promise<Buffer> {
  const win = new BrowserWindow({
    show: false,
    webPreferences: { sandbox: false }
  })
  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    await new Promise<void>((resolve, reject) => {
      win.webContents.once('did-fail-load', (_e, _c, msg) =>
        reject(new Error(msg || 'Failed to load print document'))
      )
      win.webContents.once('did-finish-load', () => resolve())
    })
    const data = await win.webContents.printToPDF({
      printBackground: true
    })
    return Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayLike<number>)
  } finally {
    if (!win.isDestroyed()) win.close()
  }
}

export async function exportNotePdf(note: NoteDto): Promise<NoteExportPdfResult> {
  const { filePath, canceled } = await dialog.showSaveDialog({
    defaultPath: `${sanitizeNoteFilenameBasename(note.title)}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })

  if (canceled || !filePath) {
    return { status: 'cancelled' }
  }

  try {
    const html = buildNotebookPrintHtml(note.title, note.body)
    const buf = await pdfBufferFromHtml(html)
    await writeFile(filePath, buf)
    return { status: 'saved', path: filePath }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Export PDF failed'
    return { status: 'failed', message }
  }
}
