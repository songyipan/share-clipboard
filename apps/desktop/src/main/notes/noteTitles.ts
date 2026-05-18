import { DEFAULT_NOTE_TITLE } from './noteConstants'

export function suggestTitleFromBody(body: string): string {
  const line = body
    .split('\n')
    .map((s) => s.trim())
    .find((s) => s.length > 0)
  if (!line) return ''

  const heading = line.replace(/^#+\s*/, '').trim()
  const candidate = heading || line
  const singleLine = candidate.replace(/\s+/g, ' ').trim()
  return singleLine.length > 120 ? `${singleLine.slice(0, 117)}...` : singleLine
}

export function titleOrDefault(title: string | undefined, body: string): string {
  const t = title?.trim()
  if (t) return t
  return suggestTitleFromBody(body) || DEFAULT_NOTE_TITLE
}
