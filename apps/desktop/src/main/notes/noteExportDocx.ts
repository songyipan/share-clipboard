import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import { dialog } from 'electron'
import { writeFile } from 'fs/promises'
import type { NoteDto } from '../../shared/notes/types'
import { sanitizeNoteFilenameBasename } from './noteFilenames'

export type NoteExportDocxResult =
  | { status: 'saved'; path: string }
  | { status: 'cancelled' }
  | { status: 'failed'; message: string }

function bodyToDocxParagraphs(body: string): Paragraph[] {
  const blocks = body.split(/\n{2,}/)
  const out: Paragraph[] = []
  for (const block of blocks) {
    const lines = block.split('\n')
    for (const line of lines) {
      const t = line.trimEnd()
      if (!t) {
        out.push(new Paragraph({ text: '' }))
        continue
      }
      out.push(
        new Paragraph({
          children: [new TextRun({ text: t, font: 'Arial' })]
        })
      )
    }
  }
  return out
}

export async function exportNoteDocx(note: NoteDto): Promise<NoteExportDocxResult> {
  const { filePath, canceled } = await dialog.showSaveDialog({
    defaultPath: `${sanitizeNoteFilenameBasename(note.title)}.docx`,
    filters: [{ name: 'Word', extensions: ['docx'] }]
  })

  if (canceled || !filePath) {
    return { status: 'cancelled' }
  }

  try {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: note.title,
              heading: HeadingLevel.HEADING_1
            }),
            ...bodyToDocxParagraphs(note.body)
          ]
        }
      ]
    })
    const buffer = await Packer.toBuffer(doc)
    await writeFile(filePath, buffer)
    return { status: 'saved', path: filePath }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Export Word failed'
    return { status: 'failed', message }
  }
}
