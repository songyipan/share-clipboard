import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

export function markdownToExportHtml(markdown: string): string {
  const raw = marked.parse(markdown.trim() || '&nbsp;', { async: false })
  return typeof raw === 'string' ? raw : ''
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildNotebookPrintHtml(title: string, bodyMarkdown: string): string {
  const bodyInner = markdownToExportHtml(bodyMarkdown)
  const safeTitle = escapeHtml(title)
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC", sans-serif;
      line-height: 1.6; padding: 24px; max-width: 720px; margin: 0 auto; color: #111; }
    h1.note-doc-title { font-size: 1.5rem; margin: 0 0 16px 0; }
    article.note-doc-body code { font-family: ui-monospace, monospace; font-size: 0.9em;
      background: #f4f4f5; padding: 0 4px; border-radius: 4px; }
    article.note-doc-body pre { background: #f4f4f5; padding: 12px; border-radius: 8px;
      overflow: auto; white-space: pre-wrap; word-break: break-word; }
    article.note-doc-body pre code { background: transparent; padding: 0; }
    article.note-doc-body img { max-width: 100%; height: auto; }
    article.note-doc-body blockquote { border-left: 4px solid #e4e4e7; margin: 0; padding-left: 12px; color: #444; }
  </style>
</head>
<body>
  <h1 class="note-doc-title">${safeTitle}</h1>
  <article class="note-doc-body">${bodyInner}</article>
</body>
</html>`
}
