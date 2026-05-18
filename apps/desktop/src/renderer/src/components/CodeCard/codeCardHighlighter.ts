import type { BundledLanguage, BundledTheme } from 'shiki'
import { getSingletonHighlighter } from 'shiki/bundle/full'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

export async function codeToHtmlJsEngine(
  code: string,
  options: { lang: BundledLanguage; theme: BundledTheme }
): Promise<string> {
  const h = await getSingletonHighlighter({
    engine: createJavaScriptRegexEngine(),
    langs: [options.lang],
    themes: [options.theme]
  })
  return h.codeToHtml(code, options)
}
