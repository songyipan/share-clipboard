import { useEffect, useRef, useState } from 'react'
import { type BundledTheme } from 'shiki'
import { WindowTitleBar } from './WindowTitleBar'
import { ResizeHandle } from './ResizeHandle'
import { useResize } from './useResize'
import type { CodeCardConfig } from './types'
import { CODE_CARD_THEMES } from './types'
import { codeToHtmlJsEngine } from './codeCardHighlighter'
import { parseCodeContent, renderPlainCode, resolveHighlightLanguage } from './codeHighlight'

interface CodeCardProps {
  content: string
  config: CodeCardConfig
  uiDeclaredLanguage?: string
}

async function highlightToHtml(code: string, lang: string, theme: string): Promise<string> {
  return codeToHtmlJsEngine(code, {
    lang: resolveHighlightLanguage(code, lang),
    theme: theme as BundledTheme
  })
}

function useHighlightedCode(
  content: string,
  theme: string,
  fallbackColor: string,
  uiDeclaredLanguage?: string
): string {
  const parsed = parseCodeContent(content, uiDeclaredLanguage)
  const [html, setHtml] = useState(() => renderPlainCode(parsed.code, fallbackColor))

  useEffect(() => {
    let cancelled = false
    const nextParsed = parseCodeContent(content, uiDeclaredLanguage)
    const fallbackHtml = renderPlainCode(nextParsed.code, fallbackColor)

    Promise.resolve()
      .then(() => {
        if (!cancelled) setHtml(fallbackHtml)
      })
      .then(() => highlightToHtml(nextParsed.code, nextParsed.language, theme))
      .then((highlightedHtml) => {
        if (!cancelled) setHtml(highlightedHtml)
      })
      .catch(() => {
        if (!cancelled) setHtml(fallbackHtml)
      })

    return () => {
      cancelled = true
    }
  }, [content, theme, fallbackColor, uiDeclaredLanguage])

  return html
}

function CodeCardThemeStyles(): React.JSX.Element {
  return (
    <style>{`
      .code-card-wrapper .shiki {
        background: transparent !important;
        margin: 0;
        padding: 0;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      .code-card-wrapper .shiki code {
        background: transparent !important;
        display: block;
        white-space: pre-wrap !important;
      }
    `}</style>
  )
}

function CodeCardContent({
  content,
  themeBg,
  themeText,
  shikiTheme,
  minHeight,
  uiDeclaredLanguage
}: {
  content: string
  themeBg: string
  themeText: string
  shikiTheme: string
  minHeight: number
  uiDeclaredLanguage?: string
}): React.JSX.Element {
  const highlightedHtml = useHighlightedCode(content, shikiTheme, themeText, uiDeclaredLanguage)

  return (
    <div
      className="overflow-auto p-6 font-mono text-sm leading-relaxed"
      style={{
        background: themeBg,
        minHeight: `${minHeight}px`
      }}
    >
      <CodeCardThemeStyles />
      <div
        className="code-card-wrapper w-full"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}

export function CodeCard({
  content,
  config,
  uiDeclaredLanguage
}: CodeCardProps): React.JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null)
  const { width, height, handleMouseDown } = useResize()
  const themeConfig = CODE_CARD_THEMES[config.theme]

  return (
    <div
      ref={cardRef}
      id="code-card"
      className="flex items-center justify-center"
      style={{
        background: config.backgroundColor,
        padding: `${config.padding}px`,
        minHeight: '100%'
      }}
    >
      <div
        className="rounded-lg shadow-2xl overflow-hidden relative"
        style={{ width: `${width}px`, minHeight: `${height}px` }}
      >
        <WindowTitleBar windowTheme={config.windowTheme} themeBg={themeConfig.bg} />
        <CodeCardContent
          content={content}
          themeBg={themeConfig.bg}
          themeText={themeConfig.text}
          shikiTheme={themeConfig.shikiTheme}
          minHeight={height - 40}
          uiDeclaredLanguage={uiDeclaredLanguage}
        />
        <ResizeHandle onMouseDown={handleMouseDown} />
      </div>
    </div>
  )
}
