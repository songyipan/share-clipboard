import { HashRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MainApp } from './pages/MainApp'
import { FloatingBall } from './components/FloatingBall'
import { SearchPanel } from './components/SearchPanel'
import { NotebookPanel } from './components/NoteBookPanel'
import { ImagePanel } from './components/ImagePanel'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/floating" element={<FloatingBallPage />} />
        <Route path="/panel" element={<PanelPage />} />
      </Routes>
    </HashRouter>
  )
}

function FloatingBallPage(): React.JSX.Element {
  return (
    <div style={{ background: 'transparent', height: '100vh' }}>
      <FloatingBall />
    </div>
  )
}

function PanelPage(): React.JSX.Element {
  const [panelType, setPanelType] = useState<string>('search')

  useEffect(() => {
    const cleanup = window.api.onPanelType((type) => {
      console.log('[PanelPage] Received panel type:', type)
      setPanelType(type)
    })
    return cleanup
  }, [])

  console.log('[PanelPage] Current panelType:', panelType)

  const renderPanel = (): React.JSX.Element => {
    if (panelType === 'notebook') return <NotebookPanel />
    if (panelType === 'image') return <ImagePanel />
    return <SearchPanel />
  }

  return (
    <div style={{ background: 'transparent', height: '100vh', padding: '8px' }}>
      {renderPanel()}
    </div>
  )
}

export default App
