import type { BundledLanguage } from 'shiki'

interface ParsedCode {
  code: string
  language: string
}

const FENCED_CODE_PATTERN = /^```([\w#+-]*)[^\n]*\n([\s\S]*?)\n?```$/

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function parseCodeContent(content: string, uiDeclaredLanguage?: string): ParsedCode {
  const trimmedContent = content.trim()
  const match = trimmedContent.match(FENCED_CODE_PATTERN)

  if (!match) {
    const key = uiDeclaredLanguage?.trim().toLowerCase() ?? ''
    if (key && needsLanguageInference(key)) {
      return { code: content, language: 'plaintext' }
    }
    if (key) {
      return { code: content, language: uiDeclaredLanguage!.trim() }
    }
    return { code: content, language: 'plaintext' }
  }

  return {
    code: match[2] ?? '',
    language: match[1] || 'plaintext'
  }
}

export function normalizeDeclaredLanguage(language: string): BundledLanguage {
  const aliases: Record<string, string> = {
    plaintext: 'text',
    txt: 'text',
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash'
  }

  const key = language.trim().toLowerCase()
  return (aliases[key] ?? key) as BundledLanguage
}

function needsLanguageInference(language: string): boolean {
  const key = language.trim().toLowerCase()
  return key === '' || key === 'plaintext' || key === 'text' || key === 'txt'
}

export function resolveHighlightLanguage(code: string, declared: string): BundledLanguage {
  const normalized = normalizeDeclaredLanguage(declared)
  if (!needsLanguageInference(declared)) {
    return normalized
  }

  const c = code.trim()
  if (!c) return 'text' as BundledLanguage

  if (/^\s*(import|export)\s/m.test(c)) {
    return /\b(interface|type)\s+\w|\w\s*:\s*\w|\bas\s+const\b/.test(c)
      ? 'typescript'
      : 'javascript'
  }

  if (
    /<[A-Za-z]/.test(c) ||
    /\/>/.test(c) ||
    /\bclassName\s*=/.test(c) ||
    /\{\s*[a-zA-Z_$][\w$]*\s*\}/.test(c)
  ) {
    return 'tsx'
  }

  if (/^\s*</.test(c)) return 'html'

  try {
    JSON.parse(c)
    return 'json'
  } catch {
    /* not JSON */
  }

  const looksTs =
    /\b(interface|type|enum)\s+[A-Za-z_$]|\bimplements\s+[A-Za-z_$]|: string\b|: number\b|: boolean\b|: void\b|as\s+const\b|<[A-Za-z_$][\w$]*(?:\.\w+)?>/.test(
      c
    )
  const looksJsLike =
    /\b(?:const|let|var|function|class)\b\s/.test(c) ||
    /=>\s*[{(]|=>\s*[\w`'"]/.test(c) ||
    /\b(?:async|await)\b/.test(c) ||
    /^\s*\/\/.|\/\*[\s\S]*\*\//.test(c)

  if (looksJsLike || looksTs) {
    return looksTs ? 'typescript' : 'javascript'
  }

  return 'text' as BundledLanguage
}

export function renderPlainCode(code: string, fallbackColor: string): string {
  return `<pre class="shiki code-card-plain-fallback" style="color:${fallbackColor}"><code>${escapeHtml(code)}</code></pre>`
}
