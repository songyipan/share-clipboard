import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Search, Languages, ImageIcon, GripVertical } from 'lucide-react'

interface SelectionResult {
  success: boolean
  text: string
  error?: string
}

const IPC_CHANNEL = 'selection:result'

export function FloatingBall(): React.JSX.Element {
  const [text, setText] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    const handler = createSelectionHandler(setText, setVisible)
    window.electron.ipcRenderer.on(IPC_CHANNEL, handler)

    return () => {
      window.electron.ipcRenderer.removeListener(IPC_CHANNEL, handler)
    }
  }, [])

  // 监听主进程触发的隐藏事件（如点击窗口外部）
  useEffect(() => {
    const cleanup = window.api.onFloatingBallHidden(() => {
      setVisible(false)
    })
    return cleanup
  }, [])

  const handleAction = (action: string): void => {
    console.log(`${action}: ${text}`)
  }

  if (!visible) return <></>

  return (
    <div
      className="flex-1 flex gap-1 py-1  px-1.5 flex-row items-center bg-white rounded-full select-none "
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* 拖动手柄 */}
      <div
        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500 transition-colors"
        title="拖动移动"
      >
        <GripVertical className="size-4" />
      </div>
      {/* 按钮区域 - no-drag 保持可点击 */}
      <div className="flex flex-row " style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => handleAction('搜索')}
        >
          <Search className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => handleAction('翻译')}
        >
          <Languages className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => handleAction('图片')}
        >
          <ImageIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function createSelectionHandler(
  setText: (text: string) => void,
  setVisible: (visible: boolean) => void
): (_event: Electron.IpcRendererEvent, result: SelectionResult) => void {
  return (_event, result: SelectionResult) => {
    if (result.success) {
      setText(result.text)
      setVisible(true)
    }
  }
}
