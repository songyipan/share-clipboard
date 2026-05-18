export function sanitizeNoteFilenameBasename(name: string): string {
  const t = name.trim() || 'note'
  return t.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 120)
}
