import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { Search, NotebookText, ImageIcon, GripVertical } from 'lucide-react'

interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

const IPC_CHANNEL = 'selection:result'

export function FloatingBall(): React.JSX.Element {
  const [visible, setVisible] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = createSelectionHandler(setVisible)
    window.electron.ipcRenderer.on(IPC_CHANNEL, handler)

    return () => {
      window.electron.ipcRenderer.removeListener(IPC_CHANNEL, handler)
    }
  }, [])

  useEffect(() => {
    const cleanup = window.api.onFloatingBallHidden(() => {
      setVisible(false)
    })
    return cleanup
  }, [])

  const handleAction = (action: number): void => {
    if (action === 2) {
      window.api.showPanel()
    }
  }

  const resizeWindow = useCallback((): void => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      const shadowPaddingX = 8
      const shadowPaddingY = 12
      window.api.resizeFloatingWindow(
        offsetWidth + shadowPaddingX * 2,
        offsetHeight + shadowPaddingY * 2
      )
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(resizeWindow, 0)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [visible, resizeWindow])

  if (!visible) return <></>

  return (
    <div
      className="inline-flex justify-center items-center"
      style={
        {
          width: '100%',
          height: '100%',
          padding: '6px 8px 10px'
        } as React.CSSProperties
      }
    >
      <div
        ref={containerRef}
        className="inline-flex gap-1 py-1 px-1.5 flex-row items-center bg-white rounded-full select-none border border-gray-200/50"
        style={
          {
            WebkitAppRegion: 'drag',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
          } as React.CSSProperties
        }
      >
        <div
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500 transition-colors"
          title="拖动移动"
        >
          <GripVertical className="size-4" />
        </div>
        <div
          className="flex flex-row"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => handleAction(0)}
          >
            <Search className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => handleAction(1)}
          >
            <NotebookText className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => handleAction(2)}
          >
            <ImageIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function createSelectionHandler(
  setVisible: (visible: boolean) => void
): (_event: Electron.IpcRendererEvent, result: SelectionResult) => void {
  return (_event, result: SelectionResult) => {
    if (result.success) {
      setVisible(true)
    }
  }
}
