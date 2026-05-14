import { useState } from 'react'
import './MainApp.css'

export function MainApp(): React.JSX.Element {
  const [shortcut, setShortcut] = useState<string>('')

  useState(() => {
    window.api.getCurrentShortcut().then(setShortcut)
  })

  return (
    <div className="main-app">
      <header>
        <h1>划词翻译</h1>
      </header>

      <main>
        <div className="instruction">
          <h2>使用说明</h2>
          <p>
            1. 在任意应用中划选文本
            <br />
            2. 按 <strong>{shortcut || 'Ctrl+Shift+C'}</strong> 快捷键
            <br />
            3. 悬浮球将出现在鼠标位置
          </p>
        </div>

        <div className="status">
          <h2>当前状态</h2>
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
    <div className={`status-badge ${active ? 'active' : 'inactive'}`}>
      {active ? '已启用' : '未启用'}
    </div>
  )
}