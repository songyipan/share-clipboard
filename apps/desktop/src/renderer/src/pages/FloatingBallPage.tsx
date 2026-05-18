import { FloatingBall } from '../components/floating/FloatingBall'
import { useEffect } from 'react'

export function FloatingBallPage(): React.JSX.Element {
  useEffect(() => {
    // 设置 body 和 html 背景为透明
    document.body.style.background = 'transparent'
    document.documentElement.style.background = 'transparent'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    window.api.notifyFloatingReady().catch((error) => {
      console.error('[FloatingBallPage] Failed to notify ready:', error)
    })

    return () => {
      // 清理，恢复默认样式
      document.body.style.background = ''
      document.documentElement.style.background = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
    }
  }, [])

  return (
    <div style={{ background: 'transparent', height: '100vh', width: '100vw' }}>
      <FloatingBall />
    </div>
  )
}
