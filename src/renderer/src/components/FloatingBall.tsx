import { useState, useEffect } from 'react'

interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

export function FloatingBall(): React.JSX.Element {
  const [text, setText] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    setupListeners(setText, setVisible)

    return cleanupListeners
  }, [])

  useEffect(() => {
    if (!visible) return undefined

    const timer = setTimeout(hideBall, 3000)
    return () => clearTimeout(timer)
  }, [visible])

  function hideBall(): void {
    setVisible(false)
    window.api.hideFloatingBall()
  }

  if (!visible) return <></>

  return (
    <div className="floating-ball">
      <div className="ball-container">
        <div className="ball-icon">T</div>
      </div>
      {text && <div className="text-preview">{truncateText(text)}</div>}
    </div>
  )
}

function setupListeners(
  setText: (text: string) => void,
  setVisible: (visible: boolean) => void
): void {
  window.electron.ipcRenderer.on('selection:result', (_, result: SelectionResult) => {
    if (result.success) {
      setText(result.text)
      setVisible(true)
    }
  })
}

function cleanupListeners(): void {
  window.electron.ipcRenderer.removeAllListeners('selection:result')
}

function truncateText(text: string, maxLength = 50): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}