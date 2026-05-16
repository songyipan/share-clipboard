import { toPng } from 'html-to-image'

export async function exportAsImage(
  element: HTMLElement,
  filename: string = 'code.png'
): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: undefined
    })
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}
