export function wrapCodeWithLanguage(text: string, language: string): string {
  if (!text.trim()) return text
  let cleanedText = text.trim()
  if (cleanedText.startsWith('```')) {
    const firstNewlineIndex = cleanedText.indexOf('\n')
    if (firstNewlineIndex !== -1) {
      cleanedText = cleanedText.slice(firstNewlineIndex + 1)
    }
  }
  if (cleanedText.endsWith('```')) {
    cleanedText = cleanedText.slice(0, -3)
  }
  cleanedText = cleanedText.trim()
  return language === 'plaintext' ? cleanedText : `\`\`\`${language}\n${cleanedText}\n\`\`\``
}
