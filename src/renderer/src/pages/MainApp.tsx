import { useState } from 'react'

export function MainApp(): React.JSX.Element {
  const [shortcut, setShortcut] = useState<string>('')

  useState(() => {
    window.api.getCurrentShortcut().then(setShortcut)
  })

  return (
    <div className="p-6 font-sans">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-800">划词翻译</h1>
      </header>

      <main>
        <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
          <h2 className="text-lg font-medium mb-3">使用说明</h2>
          <p className="leading-relaxed">
            1. 在任意应用中划选文本
            <br />
            2. 按{' '}
            <strong className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm">
              {shortcut || 'Ctrl+Shift+C'}
            </strong>{' '}
            快捷键
            <br />
            3. 悬浮球将出现在鼠标位置
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">当前状态</h2>
          <StatusIndicator />
        </div>
      </main>
    </div>
  )
}

function StatusIndicator(): React.JSX.Element {
  const [active, setActive] = useState<boolean>(false)

  useState(() => {
    window.api.isListenerActive().then(setActive)
  })

  return (
    <span
      className={`px-4 py-2 rounded-lg font-medium ${
        active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {active ? '已启用' : '未启用'}
    </span>
  )
}
